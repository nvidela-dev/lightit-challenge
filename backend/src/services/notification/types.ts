export type ConfirmationEmailJob = {
  type: 'SEND_CONFIRMATION_EMAIL';
  payload: {
    patientId: string;
    email: string;
    fullName: string;
  };
};

export type NotificationJob = ConfirmationEmailJob;
