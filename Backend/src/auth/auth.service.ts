import {
    Injectable,
    BadRequestException,
    UnauthorizedException,
    ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';

import { User } from '../entities/user.entity';
import { OtpCode } from '../entities/otp-code.entity';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
    private transporter: nodemailer.Transporter;

    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        @InjectRepository(OtpCode)
        private readonly otpRepo: Repository<OtpCode>,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {
        this.transporter = nodemailer.createTransport({
            host: this.configService.get<string>('SMTP_HOST'),
            port: this.configService.get<number>('SMTP_PORT'),
            secure: false,
            auth: {
                user: this.configService.get<string>('SMTP_USER'),
                pass: this.configService.get<string>('SMTP_PASS'),
            },
        });
    }

    // ── Register ─────────────────────────────────────────────────────────────────

    async register(dto: RegisterDto) {
        const existing = await this.userRepo.findOne({ where: { email: dto.email } });
        if (existing) {
            throw new ConflictException('Un compte avec cet email existe déjà.');
        }

        const hashed = await bcrypt.hash(dto.password, 10);
        const user = this.userRepo.create({
            nom: dto.nom,
            prenom: dto.prenom,
            email: dto.email,
            password: hashed,
            role: dto.role,
            secteur: dto.secteur,
            dateNaissance: dto.dateNaissance,
            isEmailVerified: false,
        });
        await this.userRepo.save(user);

        // Send email verification OTP
        await this.createAndSendOtp(user, 'verify');

        return {
            requiresVerification: true,
            email: user.email,
            message: 'Un code de vérification a été envoyé à votre adresse email.',
        };
    }

    // ── Login Step 1 ─────────────────────────────────────────────────────────────

    async login(dto: LoginDto) {
        const user = await this.userRepo.findOne({ where: { email: dto.email } });
        if (!user) {
            throw new UnauthorizedException('Email ou mot de passe incorrect.');
        }

        const passwordMatch = await bcrypt.compare(dto.password, user.password);
        if (!passwordMatch) {
            throw new UnauthorizedException('Email ou mot de passe incorrect.');
        }

        // Bypass OTP for Admin
        if (user.role === 'Admin') {
            const payload = { sub: user.id, email: user.email, role: user.role };
            const token = this.jwtService.sign(payload);

            return {
                token,
                email: user.email,
                nom: user.nom,
                role: user.role,
            };
        }

        // Send OTP for non-admins
        await this.createAndSendOtp(user, 'login');


        return {
            message: 'Un code OTP a été envoyé à votre email.',
            email: user.email,
            requiresOtp: true,
        };
    }

    // ── Verify OTP ───────────────────────────────────────────────────────────────

    async verifyOtp(dto: VerifyOtpDto) {
        const user = await this.userRepo.findOne({ where: { email: dto.email } });
        if (!user) {
            throw new UnauthorizedException('Utilisateur introuvable.');
        }

        const otpRecord = await this.otpRepo.findOne({
            where: { userId: user.id, code: dto.otpCode, used: false },
            order: { createdAt: 'DESC' },
        });

        if (!otpRecord) {
            throw new BadRequestException('Code OTP invalide.');
        }

        if (new Date() > otpRecord.expiresAt) {
            throw new BadRequestException('Code OTP expiré. Veuillez en demander un nouveau.');
        }

        // Mark OTP as used
        otpRecord.used = true;
        await this.otpRepo.save(otpRecord);

        // Mark email as verified (in case of registration flow)
        if (!user.isEmailVerified) {
            user.isEmailVerified = true;
            await this.userRepo.save(user);
        }

        // Issue JWT
        const payload = { sub: user.id, email: user.email, role: user.role };
        const token = this.jwtService.sign(payload);

        return {
            token,
            email: user.email,
            nom: user.nom,
            role: user.role,
        };
    }

    // ── Resend OTP ───────────────────────────────────────────────────────────────

    async resendOtp(email: string) {
        const user = await this.userRepo.findOne({ where: { email } });
        if (!user) {
            throw new BadRequestException('Aucun compte avec cet email.');
        }

        await this.createAndSendOtp(user, 'login');

        return { message: 'Un nouveau code OTP a été envoyé.' };
    }

    // ── Helpers ──────────────────────────────────────────────────────────────────

    private generateOtpCode(): string {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    private async createAndSendOtp(user: User, type: 'login' | 'verify') {
        // Invalidate existing unused OTPs for this user
        await this.otpRepo.update(
            { userId: user.id, used: false },
            { used: true },
        );

        const code = this.generateOtpCode();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        const otp = this.otpRepo.create({ userId: user.id, code, expiresAt });
        await this.otpRepo.save(otp);

        const subject =
            type === 'verify'
                ? 'Vérification de votre compte'
                : 'Code de connexion';

        const html = `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
        <h2 style="color: #4f46e5;">SkillVia</h2>
        <p>Votre code de ${type === 'verify' ? 'vérification' : 'connexion'} est :</p>
        <h1 style="letter-spacing: 8px; color: #4f46e5;">${code}</h1>
        <p>Ce code expire dans <strong>10 minutes</strong>.</p>
        <p style="color: #888; font-size: 12px;">Si vous n'avez pas demandé ce code, ignorez cet email.</p>
      </div>
    `;

        try {
            await this.transporter.sendMail({
                from: `"SkillVia" <${this.configService.get('SMTP_FROM')}>`,
                to: user.email,
                subject,
                html,
            });
        } catch (err) {
            console.error('[AuthService] Failed to send OTP email:', err);
            // Don't fail the request if email fails (show code in dev logs)
            console.log(`[DEV] OTP code for ${user.email}: ${code}`);
        }
    }
}
