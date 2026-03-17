import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { ContactMessage } from '../entities/contact-message.entity';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ContactMessage]),
    MulterModule.register({ dest: './uploads/contact' }),
    NotificationsModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: config.get('SMTP_HOST'),
          port: config.get<number>('SMTP_PORT'),
          secure: false, // port 587 uses STARTTLS
          auth: {
            user: config.get('SMTP_USER'),
            pass: config.get('SMTP_PASS'),
          },
        },
        defaults: {
          from: `"Skillvia Contact" <${config.get('SMTP_FROM')}>`,
        },
      }),
    }),
  ],
  controllers: [ContactController],
  providers: [ContactService],
  exports: [ContactService],
})
export class ContactModule { }
