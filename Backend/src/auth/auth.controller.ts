import {
    Controller,
    Post,
    Body,
    HttpCode,
    HttpStatus,
    Get,
    UseGuards,
    Req,
    Res,
    Query
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { RegisterDto } from './dto/register.dto';
import { GoogleAuthGuard } from './guards/social-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    /**
     * POST /api/auth/register
     * Creates a new Candidat or Entreprise account.
     * Returns requiresVerification: true and sends OTP by email.
     */
    @Post('register')
    @ApiOperation({ summary: 'Create a new account (Candidat or Entreprise)' })
    @ApiResponse({ status: 201, description: 'Account created, OTP sent.' })
    async register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }

    /**
     * POST /api/auth/login
     * Step 1: verifies email+password and sends OTP by email.
     * Returns { requiresOtp: true, email }.
     */
    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Login step 1: verify credentials and send OTP' })
    @ApiResponse({ status: 200, description: 'Credentials valid, OTP sent.' })
    async login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }

    /**
     * POST /api/auth/verify-otp
     * Step 2: verifies the OTP and returns a JWT token.
     */
    @Post('verify-otp')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Login step 2: verify OTP and get JWT' })
    @ApiResponse({ status: 200, description: 'OTP valid, JWT returned.' })
    async verifyOtp(@Body() dto: VerifyOtpDto) {
        return this.authService.verifyOtp(dto);
    }

    /**
     * POST /api/auth/resend-otp
     * Resends a new OTP to the given email.
     */
    @Post('resend-otp')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Resend OTP to email' })
    @ApiResponse({ status: 200, description: 'OTP resent.' })
    async resendOtp(@Body('email') email: string) {
        return this.authService.resendOtp(email);
    }

    /**
     * POST /api/auth/forgot-password
     * Sends a password reset email.
     */
    @Post('forgot-password')
    @HttpCode(HttpStatus.OK)
    async forgotPassword(@Body('email') email: string) {
        return this.authService.forgotPassword(email);
    }

    /**
     * POST /api/auth/reset-password
     * Resets the password using the token from the email.
     */
    @Post('reset-password')
    @HttpCode(HttpStatus.OK)
    async resetPassword(@Body() body: { token: string; newPassword: string }) {
        return this.authService.resetPassword(body.token, body.newPassword);
    }

    // ── Social Login Routes ──────────────────────────────────────────────────────

    @Get('google')
    @UseGuards(GoogleAuthGuard)
    @ApiOperation({ summary: 'Initiate Google OAuth login' })
    async googleAuth(@Query('role') _role: string) {
        // Guard redirects to Google
    }

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    @ApiOperation({ summary: 'Google OAuth callback' })
    async googleAuthRedirect(@Req() req, @Res() res) {
        const authResult = await this.authService.handleSocialLogin(req.user);
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        return res.redirect(`${frontendUrl}/social-auth-success?token=${authResult.token}&role=${authResult.role}`);
    }
}
