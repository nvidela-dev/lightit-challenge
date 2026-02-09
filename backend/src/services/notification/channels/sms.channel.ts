export class SmsNotImplementedError extends Error {
  constructor() {
    super('SMS notifications are not yet implemented. Expected availability: Q2 2026.');
    this.name = 'SmsNotImplementedError';
  }
}

export const sendConfirmationSms = (
  _phoneCode: string,
  _phoneNumber: string,
  _fullName: string
): Promise<void> => {
  throw new SmsNotImplementedError();
};
