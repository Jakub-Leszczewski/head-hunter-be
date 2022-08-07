import { Injectable } from '@nestjs/common';
import { MailerService } from '@nest-modules/mailer';

interface StudentSignupContext {
  courseCompletion: number;
  courseEngagement: number;
  projectDegree: number;
  teamProjectDegree: number;
  signupUrl: string;
}

interface HrSignupContext {
  signupUrl: string;
}

interface ForgotPasswordContext {
  forgotPasswordUrl: string;
}

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendStudentSignupEmail(to: string, context: StudentSignupContext): Promise<void> {
    await this.mailerService.sendMail({
      to,
      subject: 'MegaK Head hunter - rejestracja',
      template: 'student-signup',
      context,
    });
  }

  async sendHrSignupEmail(to: string, context: HrSignupContext): Promise<void> {
    await this.mailerService.sendMail({
      to,
      subject: 'MegaK Head hunter - rejestracja',
      template: 'hr-signup',
      context,
    });
  }

  async sendForgotPassword(to: string, context: ForgotPasswordContext): Promise<void> {
    await this.mailerService.sendMail({
      to,
      subject: 'MegaK Head hunter - reset hasła',
      template: 'forgot-password',
      context,
    });
  }
}
