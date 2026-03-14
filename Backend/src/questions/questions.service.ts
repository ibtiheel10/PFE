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
    const offre = await this.offreRepo.findOne({
      where: { id: offreId },
      relations: ['entreprise'],
    });

    if (!offre) throw new NotFoundException(`Offre ${offreId} introuvable.`);
    if (offre.entreprise?.id !== userId) {
      throw new ForbiddenException("Vous n'êtes pas autorisé à consulter ces questions.");
    }

    return this.questionRepo.find({
      where: { offre: { id: offreId } },
      order: { dateEvaluation: 'ASC' }, // Sort conceptually or by whichever column makes sense
    });
  }

  async createQuestion(data: any, userId: number) {
    if (!data.offre || !data.offre.id) {
        throw new BadRequestException('ID of Offre is required.');
    }

    const offre = await this.offreRepo.findOne({
      where: { id: data.offre.id },
      relations: ['entreprise'],
    });

    if (!offre) throw new NotFoundException(`Offre ${data.offre.id} introuvable.`);
    if (offre.entreprise?.id !== userId) {
      throw new ForbiddenException("Vous n'êtes pas autorisé à ajouter des questions à cette offre.");
    }

    const newQuestion = this.questionRepo.create({
      contenu: data.contenu,
      reponses: data.reponses,
      niveauDifficulte: data.niveauDifficulte || 'Moyen',
      chronometre: data.chronometre || 2,
      dateEvaluation: new Date(),
      isCorrectVerified: true, // Assuming the recruiter validates it during generation
      offre: offre,
    });

    return await this.questionRepo.save(newQuestion);
  }

  async deleteQuestion(id: number, userId: number) {
    const question = await this.questionRepo.findOne({
      where: { id },
      relations: ['offre', 'offre.entreprise'],
    });

    if (!question) throw new NotFoundException(`Question ${id} introuvable.`);
    if (question.offre?.entreprise?.id !== userId) {
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
    if (offre.entreprise?.id !== userId) {
      throw new ForbiddenException("Vous n'êtes pas autorisé à modifier cette offre.");
    }

    // Since in the current schema QCMs are inherently attached to the offre, nothing specific needs updating here unless you add a `qcmPublished` boolean on `OffreEmploi`.
    return { message: 'QCM publié avec succès.' };
  }
}
