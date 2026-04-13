const { createConnection, getRepository } = require('typeorm');
const path = require('path');
process.env.DB_HOST="127.0.0.1";
process.env.DB_PORT="5432";
process.env.DB_USERNAME="postgres";
process.env.DB_PASSWORD="123456";
process.env.DB_NAME="skillvia_db_2";

async function testSuggestions() {
    const dataSource = await createConnection({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        entities: [__dirname + '/src/entities/*.ts'],
        synchronize: false,
        logging: true
    });

    const candidatRepo = dataSource.getRepository('User');
    const candidats = await candidatRepo.find({ where: { role: 'Candidat' } });

    console.log(`Found ${candidats.length} candidats`);
    if(candidats.length === 0) return process.exit(0);

    const Candidature = dataSource.getRepository('Candidature');
    const OffreEmploi = dataSource.getRepository('OffreEmploi');

    // copy implementation
    const normalizeKey = (s) =>
        s.toLowerCase()
         .replace(/^(bon niveau en|connaissances en|notions en|maîtrise de|compétence en|introduction à|bases de)\\s+/i, '')
         .replace(/[^a-z0-9+#.]/g, '')
         .trim();

    const isVague = (key) =>
        ['niveau', 'skill', 'other'].includes(key);

    const candidatures = await Candidature.find({
        where: { candidat: { id: candidats[0].id } },
        relations: ['offre']
    });

    console.log(`Candidat ${candidats[0].id} has ${candidatures.length} candidatures`);
    const map = {};
    const addSkill = (rawName, score, type) => {
      const key = normalizeKey(rawName);
      if (!key || isVague(key) || key.length < 2) return;
      if (!map[key]) {
        map[key] = { name: rawName.trim(), scores: [], type };
      } else {
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
        if (details.skillsAnalysis) {
          const sa = details.skillsAnalysis;
          if (Array.isArray(sa.detailedSkills)) sa.detailedSkills.forEach(s => addSkill(s.skill, s.score, 'technical'));
          if (Array.isArray(sa.behavioralSkills)) sa.behavioralSkills.forEach(s => addSkill(s.skill, s.score, 'behavioral'));
        }
        if (details.ScoreParCompetence) Object.entries(details.ScoreParCompetence).forEach(([k,v]) => addSkill(k, Number(v), 'technical'));
      } catch (err) { }
    }

    const SKILL_THRESHOLD = 50;
    const allIdentifiedSkills = Object.values(map).map(s => ({
      name: s.name,
      avgScore: Math.round(s.scores.reduce((a, b) => a + b, 0) / s.scores.length),
      type: s.type,
    }));

    const strongSkills = allIdentifiedSkills.filter(s => s.avgScore >= SKILL_THRESHOLD);
    strongSkills.sort((a, b) => b.avgScore - a.avgScore);
    console.log(`Strong skills found:`, strongSkills);

    if (strongSkills.length === 0) {
        console.log("No strong skills");
        return process.exit(0);
    }
    const skillNames = strongSkills.map(s => s.name);
    
    let query = OffreEmploi.createQueryBuilder('offre')
      .where('(offre.DateLimite IS NULL OR offre.DateLimite >= :now)', { now: new Date() });

    const conditions = skillNames.map((_, i) =>
      `(LOWER(offre.competences) LIKE LOWER(:skill${i}) OR LOWER(offre.TitreDePost) LIKE LOWER(:skill${i}))`,
    );
    const params = {};
    skillNames.forEach((s, i) => { params[`skill${i}`] = `%${s}%`; });
    query = query.andWhere(`(${conditions.join(' OR ')})`, params);

    try {
        const res = await query.getMany();
        console.log("Query returned:", res.length);
    } catch(e) {
        console.error("SQL ERROR:", e);
    }
    
    process.exit(0);
}
testSuggestions();
