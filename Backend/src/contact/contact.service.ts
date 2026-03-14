import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  async handleContact(data: any, file?: Express.Multer.File) {
    this.logger.log(`Received contact message from ${data.FirstName} ${data.LastName} (${data.Email})`);
    this.logger.log(`Subject: ${data.Subject}`);
    this.logger.log(`Message: ${data.Message}`);
    
    if (file) {
      this.logger.log(`Attached file: ${file.originalname} (${file.size} bytes)`);
    }

    // In a real application, you would send an email using Nodemailer,
    // or save the contact message to the database here.
    return { 
      success: true, 
      message: 'Votre message a été envoyé avec succès. Nous vous répondrons sous 24h.' 
    };
  }
}
