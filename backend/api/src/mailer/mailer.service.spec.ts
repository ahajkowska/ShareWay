import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { MailerService as NestMailerService } from '@nestjs-modules/mailer';
import { MailerService } from './mailer.service';

const mockNestMailerService = {
  sendMail: jest.fn(),
};

const mockConfigService = {
  get: jest.fn().mockReturnValue('http://localhost:3000'),
};

describe('MailerService', () => {
  let service: MailerService;

  beforeEach(async () => {
    jest.resetAllMocks();
    mockConfigService.get.mockReturnValue('http://localhost:3000');

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailerService,
        { provide: NestMailerService, useValue: mockNestMailerService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<MailerService>(MailerService);
  });

  describe('sendWelcomeEmail', () => {
    it('calls sendMail with welcome template', async () => {
      mockNestMailerService.sendMail.mockResolvedValue({});
      await service.sendWelcomeEmail({ email: 'a@b.com', nickname: 'Alice' });
      expect(mockNestMailerService.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'a@b.com',
          template: 'welcome',
          context: expect.objectContaining({ nickname: 'Alice' }),
        }),
      );
    });

    it('does not throw when sendMail fails (swallowed)', async () => {
      mockNestMailerService.sendMail.mockRejectedValue(new Error('SMTP error'));
      await expect(
        service.sendWelcomeEmail({ email: 'a@b.com', nickname: 'Alice' }),
      ).resolves.toBeUndefined();
    });
  });

  describe('sendPasswordResetEmail', () => {
    it('calls sendMail with reset-password template', async () => {
      mockNestMailerService.sendMail.mockResolvedValue({});
      await service.sendPasswordResetEmail({
        email: 'a@b.com',
        nickname: 'Alice',
        resetToken: 'tok',
        resetUrl: 'http://localhost/reset?token=tok',
      });
      expect(mockNestMailerService.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'a@b.com',
          template: 'reset-password',
          context: expect.objectContaining({ resetToken: 'tok' }),
        }),
      );
    });

    it('rethrows when sendMail fails', async () => {
      mockNestMailerService.sendMail.mockRejectedValue(new Error('SMTP error'));
      await expect(
        service.sendPasswordResetEmail({
          email: 'a@b.com',
          nickname: 'Alice',
          resetToken: 'tok',
          resetUrl: 'http://localhost/reset',
        }),
      ).rejects.toThrow('SMTP error');
    });
  });

  describe('sendAccountBannedEmail', () => {
    it('calls sendMail with account-banned template', async () => {
      mockNestMailerService.sendMail.mockResolvedValue({});
      await service.sendAccountBannedEmail('a@b.com', 'Alice');
      expect(mockNestMailerService.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'a@b.com',
          template: 'account-banned',
          context: expect.objectContaining({ nickname: 'Alice' }),
        }),
      );
    });

    it('does not throw when sendMail fails (swallowed)', async () => {
      mockNestMailerService.sendMail.mockRejectedValue(new Error('SMTP error'));
      await expect(
        service.sendAccountBannedEmail('a@b.com', 'Alice'),
      ).resolves.toBeUndefined();
    });
  });
});
