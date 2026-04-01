import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactMessage } from '../entities/contact-message.entity';
import { CreateContactDto } from './dto/create-contact.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  constructor(
    @InjectRepository(ContactMessage)
    private readonly contactRepo: Repository<ContactMessage>,
    private readonly mailerService: MailerService,
    private readonly notificationsService: NotificationsService,
  ) { }

  // ──────────────────────────────────────────────────
  //  PUBLIC: Submit contact form
  // ──────────────────────────────────────────────────
  async create(dto: CreateContactDto, file?: Express.Multer.File): Promise<ContactMessage> {
    const msg = this.contactRepo.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      subject: dto.subject,
      message: dto.message,
      fileName: file ? file.originalname : null,
      filePath: file ? file.path : null,
      statut: 'Non lu',
    });

    const saved = await this.contactRepo.save(msg);
    this.logger.log(
      `📩 New contact message #${saved.id} from ${saved.firstName} ${saved.lastName} (${saved.email}) — ${saved.subject}`,
    );

    // Create system notification for Admins
    try {
      await this.notificationsService.notifyNouveauMessageContact(
        `${saved.firstName} ${saved.lastName}`,
        saved.subject
      );
    } catch (e) {
      this.logger.error(`Failed to create system notification for message #${saved.id}:`, e);
    }

    // Send email notification to admin
    try {
      const mailOptions: any = {
        to: 'skillvia.recrutement@gmail.com',
        subject: `[Nouveau Contact] ${saved.subject}`,
        html: `
          <h3>Nouveau message de contact :</h3>
          <p><strong>De:</strong> ${saved.firstName} ${saved.lastName} (${saved.email})</p>
          <p><strong>Sujet:</strong> ${saved.subject}</p>
          <p><strong>Message:</strong></p>
          <blockquote style="background: #f9f9f9; border-left: 10px solid #ccc; margin: 1.5em 10px; padding: 0.5em 10px;">
            ${saved.message.replace(/\n/g, '<br>')}
          </blockquote>
          ${saved.fileName ? `<p><strong>Pièce jointe:</strong> ${saved.fileName} (ci-joint)</p>` : ''}
          <hr>
          <p style="font-size: 0.9em; color: gray;">Ce message a été envoyé depuis le formulaire de contact de la plateforme Skillvia.</p>
        `,
      };

      if (saved.filePath && saved.fileName) {
        mailOptions.attachments = [
          {
            filename: saved.fileName,
            path: saved.filePath,
          },
        ];
      }

      await this.mailerService.sendMail(mailOptions);
      this.logger.log(`📧 Notification email sent to admin for message #${saved.id}`);
    } catch (e) {
      this.logger.error(`Failed to send email notification for message #${saved.id}:`, e);
    }

    return saved;
  }

  // ──────────────────────────────────────────────────
  //  ADMIN: Get all messages (newest first)
  // ──────────────────────────────────────────────────
  async findAll(): Promise<ContactMessage[]> {
    return this.contactRepo.find({
      order: { createdAt: 'DESC' },
    });
  }

  // ──────────────────────────────────────────────────
  //  ADMIN: Get one message (marks it as "Lu")
  // ──────────────────────────────────────────────────
  async findOne(id: number): Promise<ContactMessage> {
    const msg = await this.contactRepo.findOne({ where: { id } });
    if (!msg) throw new NotFoundException(`Message #${id} introuvable.`);

    if (msg.statut === 'Non lu') {
      msg.statut = 'Lu';
      await this.contactRepo.save(msg);
    }
    return msg;
  }

  // ──────────────────────────────────────────────────
  //  ADMIN: Mark as "Traité"
  // ──────────────────────────────────────────────────
  async markTraite(id: number): Promise<ContactMessage> {
    const msg = await this.contactRepo.findOne({ where: { id } });
    if (!msg) throw new NotFoundException(`Message #${id} introuvable.`);

    msg.statut = 'Traité';
    return this.contactRepo.save(msg);
  }

  // ──────────────────────────────────────────────────
  //  ADMIN: Delete a message
  // ──────────────────────────────────────────────────
  async deleteOne(id: number): Promise<void> {
    const msg = await this.contactRepo.findOne({ where: { id } });
    if (!msg) throw new NotFoundException(`Message #${id} introuvable.`);
    await this.contactRepo.remove(msg);
  }

  // ──────────────────────────────────────────────────
  //  ADMIN: Stats (count by statut)
  // ──────────────────────────────────────────────────
  async getStats(): Promise<{ total: number; nonLu: number; lu: number; traite: number }> {
    const [total, nonLu, lu, traite] = await Promise.all([
      this.contactRepo.count(),
      this.contactRepo.count({ where: { statut: 'Non lu' } }),
      this.contactRepo.count({ where: { statut: 'Lu' } }),
      this.contactRepo.count({ where: { statut: 'Traité' } }),
    ]);
    return { total, nonLu, lu, traite };
  }
}
