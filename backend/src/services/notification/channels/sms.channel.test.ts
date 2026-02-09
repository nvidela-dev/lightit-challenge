import { describe, it, expect } from 'vitest';
import { sendConfirmationSms, SmsNotImplementedError } from './sms.channel.js';

describe('sms.channel', () => {
  describe('SmsNotImplementedError', () => {
    it('has correct name and message', () => {
      const error = new SmsNotImplementedError();
      expect(error.name).toBe('SmsNotImplementedError');
      expect(error.message).toContain('SMS notifications are not yet implemented');
      expect(error.message).toContain('Q2 2026');
    });

    it('is an instance of Error', () => {
      const error = new SmsNotImplementedError();
      expect(error).toBeInstanceOf(Error);
    });
  });

  describe('sendConfirmationSms', () => {
    it('throws SmsNotImplementedError', () => {
      expect(() => sendConfirmationSms('+1', '1234567890', 'John Doe')).toThrow(
        SmsNotImplementedError
      );
    });

    it('throws with expected message', () => {
      expect(() => sendConfirmationSms('+1', '1234567890', 'John Doe')).toThrow(
        /SMS notifications are not yet implemented/
      );
    });
  });
});
