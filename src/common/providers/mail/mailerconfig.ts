import { HandlebarsAdapter } from '@nest-modules/mailer';
import { join } from 'path';
import { config } from '../../../config/config';

export = {
  transport: `smtp://${config.mailUsername}:${config.mailPassword}@localhost:2500`,
  defaults: {
    from: 'no-reply@head-hunter.pl',
  },
  template: {
    dir: join(__dirname, '../../src/mail/templates'),
    adapter: new HandlebarsAdapter(),
    options: {
      strict: true,
    },
  },
};
