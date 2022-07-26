import { Injectable } from '@nestjs/common';
import { MailerService } from '@nest-modules/mailer';

interface StudentSignupContext {
  courseCompletion: number;
  courseEngagement: number;
  projectDegree: number;
  teamProjectDegree: number;
  signupUrl: string;
}

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendStudentSignupEmail(to: string, context: StudentSignupContext): Promise<any> {
    await this.mailerService.sendMail({
      to,
      subject: 'MegaK Head hunter - rejestracja',
      template: 'student-signup',
      context,
    });
  }
}
