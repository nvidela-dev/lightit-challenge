import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the queue before importing
const mockAdd = vi.fn();
vi.mock('@config/queue.js', () => ({
  createQueue: () => ({
    add: mockAdd,
  }),
}));

const { dispatchConfirmation, dispatchConfirmationEmail, dispatchConfirmationSms } = await import(
  './notification.queue.js'
);

const basePayload = {
  patientId: '123',
  fullName: 'John Doe',
  email: 'john@gmail.com',
  phoneCode: '+1',
  phoneNumber: '1234567890',
};

describe('notification.queue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('dispatchConfirmationEmail', () => {
    it('adds email job to queue', async () => {
      await dispatchConfirmationEmail({
        patientId: '123',
        email: 'john@gmail.com',
        fullName: 'John Doe',
      });

      expect(mockAdd).toHaveBeenCalledWith('SEND_CONFIRMATION_EMAIL', {
        type: 'SEND_CONFIRMATION_EMAIL',
        payload: {
          patientId: '123',
          email: 'john@gmail.com',
          fullName: 'John Doe',
        },
      });
    });
  });

  describe('dispatchConfirmationSms', () => {
    it('adds SMS job to queue', async () => {
      await dispatchConfirmationSms({
        patientId: '123',
        phoneCode: '+1',
        phoneNumber: '1234567890',
        fullName: 'John Doe',
      });

      expect(mockAdd).toHaveBeenCalledWith('SEND_CONFIRMATION_SMS', {
        type: 'SEND_CONFIRMATION_SMS',
        payload: {
          patientId: '123',
          phoneCode: '+1',
          phoneNumber: '1234567890',
          fullName: 'John Doe',
        },
      });
    });
  });

  describe('dispatchConfirmation', () => {
    it('dispatches email when preference is EMAIL', async () => {
      await dispatchConfirmation({
        ...basePayload,
        notificationPreference: 'EMAIL',
      });

      expect(mockAdd).toHaveBeenCalledWith('SEND_CONFIRMATION_EMAIL', {
        type: 'SEND_CONFIRMATION_EMAIL',
        payload: {
          patientId: '123',
          email: 'john@gmail.com',
          fullName: 'John Doe',
        },
      });
    });

    it('dispatches SMS when preference is SMS', async () => {
      await dispatchConfirmation({
        ...basePayload,
        notificationPreference: 'SMS',
      });

      expect(mockAdd).toHaveBeenCalledWith('SEND_CONFIRMATION_SMS', {
        type: 'SEND_CONFIRMATION_SMS',
        payload: {
          patientId: '123',
          phoneCode: '+1',
          phoneNumber: '1234567890',
          fullName: 'John Doe',
        },
      });
    });

    it('throws for unknown preference', () => {
      expect(() =>
        dispatchConfirmation({
          ...basePayload,
          notificationPreference: 'CARRIER_PIGEON' as 'EMAIL',
        })
      ).toThrow(/Unknown notification preference/);
    });
  });
});
