import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Candidature } from '../entities/candidature.entity';
import { OffreEmploi } from '../entities/offre-emploi.entity';

// ─── Internal types ───────────────────────────────────────────────────────────

export interface ExtractedSkill {
  name: string;
  avgScore: number;
  type: 'technical' | 'behavioral';
}

export interface SuggestedOffer {
  id: string;
  TitreDePost: string;
  titre: string;
  categorie: string;
  competences: string;
  localisation: string;
  typeDeContrat: string;
  dateLimite: Date;
  matchScore: number;
  matchedSkills: Array<{ name: string; score: number }>;
  missingSkills: string[];
  reason: string;
}

export interface SuggestionResult {
  strongSkills: ExtractedSkill[];
  suggestions: SuggestedOffer[];
  totalSkillsIdentified: number;
  message: string;
}

// ─── Normalisation helpers ────────────────────────────────────────────────────

/** Lowercase, keep alphanumeric + programming chars, remove spaces */
const normalizeKey = (s: string): string =>
  s
    .toLowerCase()
    .replace(/^(bon niveau en|connaissances en|notions en|maîtrise de|compétence en|introduction à|bases de)\s+/i, '')
    .replace(/[^a-z0-9+#.]/g, '')
    .trim();

/** True when the raw name looks like a generic/vague label */
const isVague = (key: string): boolean =>
  ['expertise', 'basique', 'technique', 'niveau', 'general', 'competence', 'skill', 'other'].includes(key);

/** Build a human-readable reason string for a suggestion */
const buildReason = (matched: Array<{ name: string; score: number }>): string => {
  if (matched.length === 0) return 'Offre correspondant à votre profil général.';
  const top = matched
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(s => `${s.name} (${s.score}%)`)
    .join(', ');
  return `Compétences correspondantes : ${top}`;
};

@Injectable()
export class SuggestionService {
  private readonly logger = new Logger(SuggestionService.name);

  constructor(
    @InjectRepository(Candidature)
    private readonly candidatureRepo: Repository<Candidature>,
    @InjectRepository(OffreEmploi)
    private readonly offreRepo: Repository<OffreEmploi>,
  ) {}

  // ══════════════════════════════════════════════════════════════════════════════
  // PUBLIC: Main suggestion entry point
  // ══════════════════════════════════════════════════════════════════════════════

  async getSuggestions(userId: number, maxResults = 6): Promise<SuggestionResult> {
    // 1. Fetch all candidatures for the user
    const candidatures = await this.candidatureRepo.find({
      where: { candidat: { id: userId } },
      relations: ['offre'],
      order: { datePostulation: 'DESC' },
    });

    const appliedOfferIds = candidatures.map(c => c.offre?.id).filter(Boolean) as string[];

    // 2. Extract all skills from evaluationDetails (both sources)
    const skillMap = this.extractAllSkills(candidatures);

    // 3. Derive identified skills list and filter for HIGH SCORES only (>= 50%)
    const SKILL_THRESHOLD = 50;

    const allIdentifiedSkills: ExtractedSkill[] = Object.values(skillMap).map(({ name, scores, type }) => ({
      name,
      avgScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
      type,
    }));

    // Only skills with a high score are used for suggestions
    const strongSkills = allIdentifiedSkills.filter(s => s.avgScore >= SKILL_THRESHOLD);
    strongSkills.sort((a, b) => b.avgScore - a.avgScore);

    // 4. No strong skills → do NOT fallback, return empty suggestions
    if (strongSkills.length === 0) {
      return {
        strongSkills: [],
        suggestions: [],
        totalSkillsIdentified: 0,
        message: 'Aucune compétence validée à +50%. Passez plus de tests pour recevoir des suggestions personnalisées.',
      };
    }

    // 5. Fetch active offers matching at least one strong skill
    const now = new Date();
    const skillNames = strongSkills.map(s => s.name);

    let query = this.offreRepo.createQueryBuilder('offre')
      .where('(offre.DateLimite IS NULL OR offre.DateLimite >= :now)', { now });

    if (appliedOfferIds.length > 0) {
      query = query.andWhere('offre.id NOT IN (:...excluded)', { excluded: appliedOfferIds });
    }

    // Build ILIKE conditions matching against competences OR title
    const conditions = skillNames.map((_, i) =>
      `(LOWER(offre.competences) LIKE LOWER(:skill${i}) OR LOWER(offre."TitreDePost") LIKE LOWER(:skill${i}))`,
    );
    const params: Record<string, string> = {};
    skillNames.forEach((skill, i) => { params[`skill${i}`] = `%${skill}%`; });

    query = query.andWhere(`(${conditions.join(' OR ')})`, params);
    query = query.take(maxResults * 3); // fetch extra for ranking

    const rawOffers = await query.getMany();

    // 6. Rank & enrich each offer using ONLY strong skills
    const ranked = rawOffers.map(o => this.scoreOffer(o, strongSkills))
      .filter(o => o.matchedSkills.length > 0); // Must match at least one strong skill

    ranked.sort((a, b) => b.matchScore - a.matchScore || b.matchedSkills.length - a.matchedSkills.length);

    return {
      strongSkills,
      suggestions: ranked.slice(0, maxResults),
      totalSkillsIdentified: strongSkills.length,
      message: `${strongSkills.length} compétence(s) validée(s) avec succès, ${ranked.length} offre(s) correspondante(s) trouvée(s).`,
    };
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // PRIVATE: Dual-source skill extraction
  // ══════════════════════════════════════════════════════════════════════════════

  private extractAllSkills(
    candidatures: Candidature[],
  ): Record<string, { name: string; scores: number[]; type: 'technical' | 'behavioral' }> {
    const map: Record<string, { name: string; scores: number[]; type: 'technical' | 'behavioral' }> = {};

    const addSkill = (rawName: string, score: number, type: 'technical' | 'behavioral') => {
      const key = normalizeKey(rawName);
      if (!key || isVague(key) || key.length < 2) return;

      if (!map[key]) {
        map[key] = { name: rawName.trim(), scores: [], type };
      } else {
        // Keep the longer/richer display name
        if (rawName.trim().length > map[key].name.length) {
          map[key].name = rawName.trim();
        }
      }
      map[key].scores.push(score);
    };

    for (const c of candidatures) {
      if (!c.evaluationDetails) continue;
      try {
        const details = JSON.parse(c.evaluationDetails);

        // ── Source 1: New granular AI analysis (skillsAnalysis) ────────────────
        if (details.skillsAnalysis) {
          const sa = details.skillsAnalysis;
          if (Array.isArray(sa.detailedSkills)) {
            for (const s of sa.detailedSkills) {
              if (s.skill && typeof s.score === 'number') {
                addSkill(s.skill, s.score, 'technical');
              }
            }
          }
          if (Array.isArray(sa.behavioralSkills)) {
            for (const s of sa.behavioralSkills) {
              if (s.skill && typeof s.score === 'number') {
                addSkill(s.skill, s.score, 'behavioral');
              }
            }
          }
        }

        // ── Source 2: Legacy ScoreParCompetence ────────────────────────────────
        if (details.ScoreParCompetence) {
          for (const [rawKey, val] of Object.entries(details.ScoreParCompetence)) {
            addSkill(rawKey, Number(val), 'technical');
          }
        }
      } catch {
        // skip malformed JSON
      }
    }

    return map;
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // PRIVATE: Score a single offer against identified skills
  // ══════════════════════════════════════════════════════════════════════════════

  private scoreOffer(offer: OffreEmploi, skills: ExtractedSkill[]): SuggestedOffer {
    const haystack = (
      (offer.competences || '') + ' ' + (offer.TitreDePost || '') + ' ' + (offer.Description || '')
    ).toLowerCase();

    const matched = skills.filter(s => haystack.includes(s.name.toLowerCase()));

    // Compute weighted match score: average of matched skill scores
    const matchScore =
      matched.length > 0
        ? Math.round(matched.reduce((acc, s) => acc + s.avgScore, 0) / matched.length)
        : 0;

    // Identify skills mentioned in the offer but not matched (for "missing skills" insight)
    const offerSkillTokens = (offer.competences || '')
      .split(/[,\n\-•]/)
      .map(t => t.trim())
      .filter(t => t.length > 2);

    const missingSkills = offerSkillTokens.filter(token => {
      const tokenKey = normalizeKey(token);
      return (
        !isVague(tokenKey) &&
        tokenKey.length > 2 &&
        !skills.some(s => normalizeKey(s.name) === tokenKey || haystack.includes(s.name.toLowerCase()))
      );
    });

    return {
      id: offer.id,
      TitreDePost: offer.TitreDePost,
      titre: offer.TitreDePost,
      categorie: offer.Categorie,
      competences: offer.competences,
      localisation: offer.Localisation,
      typeDeContrat: offer.TypeDeContrat,
      dateLimite: offer.DateLimite,
      matchScore,
      matchedSkills: matched.map(s => ({ name: s.name, score: s.avgScore })),
      missingSkills: missingSkills.slice(0, 5),
      reason: buildReason(matched.map(s => ({ name: s.name, score: s.avgScore }))),
    };
  }


}
