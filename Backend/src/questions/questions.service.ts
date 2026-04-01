import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from '../entities/question.entity';
import { OffreEmploi } from '../entities/offre-emploi.entity';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepo: Repository<Question>,
    @InjectRepository(OffreEmploi)
    private readonly offreRepo: Repository<OffreEmploi>,
  ) {}

  async getQuestionsByOffre(offreId: string, userId: number) {
    const cleanId = (offreId || '').trim();
    const offre = await this.offreRepo.findOne({
      where: { id: cleanId },
      relations: ['entreprise'],
    });

    if (!offre) throw new NotFoundException(`Offre ${cleanId} introuvable.`);
    if (Number(offre.entreprise?.id) !== Number(userId)) {
      throw new ForbiddenException("Vous n'êtes pas autorisé à consulter ces questions.");
    }

    const questions = await this.questionRepo.find({
      where: { offre: { id: offreId } },
      order: { createdAt: 'ASC' }, // Sort conceptually or by whichever column makes sense
    });

    return questions.map(q => ({
      id: q.id,
      contenu: q.contenu,
      chronometre: q.chronometre,
      isCorrectVerified: q.isCorrectVerified,
      createdAt: q.createdAt
    }));
  }

  async createQuestion(data: any, userId: number) {
    if (!data.offre || !data.offre.id) {
        throw new BadRequestException('ID of Offre is required.');
    }

    const cleanId = (data.offre.id || '').trim();
    const offre = await this.offreRepo.findOne({
      where: { id: cleanId },
      relations: ['entreprise'],
    });

    if (!offre) throw new NotFoundException(`Offre ${cleanId} introuvable.`);
    if (Number(offre.entreprise?.id) !== Number(userId)) {
      throw new ForbiddenException("Vous n'êtes pas autorisé à ajouter des questions à cette offre.");
    }

    const newQuestion = this.questionRepo.create({
      contenu: data.contenu,
      chronometre: data.chronometre || 30,
      isCorrectVerified: true, // Assuming the recruiter validates it during generation
      offre: offre,
    });

    const saved = await this.questionRepo.save(newQuestion);

    return {
      id: saved.id,
      contenu: saved.contenu,
      chronometre: saved.chronometre,
      isCorrectVerified: saved.isCorrectVerified,
      createdAt: saved.createdAt
    };
  }

  async deleteQuestion(id: number, userId: number) {
    const question = await this.questionRepo.findOne({
      where: { id },
      relations: ['offre', 'offre.entreprise'],
    });

    if (!question) throw new NotFoundException(`Question ${id} introuvable.`);
    if (Number(question.offre?.entreprise?.id) !== Number(userId)) {
      throw new ForbiddenException("Vous n'êtes pas autorisé à supprimer cette question.");
    }

    await this.questionRepo.remove(question);
    return { message: 'Question supprimée avec succès.' };
  }

  async publishQcm(offreId: string, userId: number) {
    // Optional logic if you need to set a "isQcmPublished" flag on OffreEmploi
    const offre = await this.offreRepo.findOne({
      where: { id: offreId },
      relations: ['entreprise'],
    });

    if (!offre) throw new NotFoundException(`Offre ${offreId} introuvable.`);
    if (Number(offre.entreprise?.id) !== Number(userId)) {
      throw new ForbiddenException("Vous n'êtes pas autorisé à modifier cette offre.");
    }

    // Since in the current schema QCMs are inherently attached to the offre, nothing specific needs updating here unless you add a `qcmPublished` boolean on `OffreEmploi`.
    return { message: 'QCM publié avec succès.' };
  }
}
