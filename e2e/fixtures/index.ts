export const createTestPatient = (suffix = Date.now()) => ({
  fullName: "Test Patient",
  email: `test.patient${suffix}@gmail.com`,
  phoneCode: "+1",
  phoneNumber: "5551234567",
});

export const createInvalidPatients = {
  invalidName: () => ({
    fullName: "123Invalid",
    email: "valid@gmail.com",
    phoneCode: "+1",
    phoneNumber: "5551234567",
  }),
  invalidEmail: () => ({
    fullName: "Valid Name",
    email: "test@yahoo.com",
    phoneCode: "+1",
    phoneNumber: "5551234567",
  }),
  invalidPhone: () => ({
    fullName: "Valid Name",
    email: "valid@gmail.com",
    phoneCode: "+1",
    phoneNumber: "123",
  }),
};

export const seededPatients = Array.from({ length: 5 }, (_, i) => ({
  fullName: `Seeded Patient ${i + 1}`,
  email: `seeded${i + 1}@gmail.com`,
  phoneCode: "+1",
  phoneNumber: `555000000${i}`,
  documentUrl: "/uploads/avatar-1.jpg",
}));
