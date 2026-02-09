import { describe, it, expect, beforeEach, vi, beforeAll } from 'vitest';
import request from 'supertest';
import path from 'path';
import fs from 'fs';

// Mock prisma before importing app
const mockPrisma = {
  $queryRaw: vi.fn(),
  patient: {
    findUnique: vi.fn(),
    create: vi.fn(),
    count: vi.fn(),
  },
};

vi.mock('@config/database.js', () => ({
  prisma: mockPrisma,
}));

// Mock notification queue
const mockDispatchConfirmationEmail = vi.fn();
vi.mock('@services/notification/notification.queue.js', () => ({
  dispatchConfirmationEmail: mockDispatchConfirmationEmail,
}));

// Import app after mocking
const { createApp } = await import('@/app.js');
const app = createApp();

const samplePatient = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  fullName: 'John Doe',
  email: 'john.doe@gmail.com',
  phoneCode: '+1',
  phoneNumber: '1234567890',
  documentUrl: '/uploads/test.jpg',
  createdAt: new Date('2024-01-01T00:00:00.000Z'),
};

describe('GET /api/patients', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns empty array when no patients exist', async () => {
    mockPrisma.$queryRaw.mockResolvedValue([]);
    mockPrisma.patient.count.mockResolvedValue(0);

    const response = await request(app).get('/api/patients');

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual([]);
    expect(response.body.pagination).toEqual({
      page: 1,
      limit: 18,
      total: 0,
      totalPages: 0,
      hasNext: false,
      hasPrevious: false,
    });
  });

  it('returns all patients with formatted dates', async () => {
    mockPrisma.$queryRaw.mockResolvedValue([samplePatient]);
    mockPrisma.patient.count.mockResolvedValue(1);

    const response = await request(app).get('/api/patients');

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0]).toMatchObject({
      id: samplePatient.id,
      fullName: samplePatient.fullName,
      email: samplePatient.email,
      createdAt: samplePatient.createdAt.toISOString(),
    });
    expect(response.body.pagination).toMatchObject({
      page: 1,
      total: 1,
      hasNext: false,
      hasPrevious: false,
    });
  });
});

describe('POST /api/patients', () => {
  const uploadsDir = path.join(process.cwd(), 'uploads');
  const testImagePath = path.join(uploadsDir, 'test-image.jpg');

  beforeAll(() => {
    fs.mkdirSync(uploadsDir, { recursive: true });
    fs.writeFileSync(testImagePath, Buffer.from([0xff, 0xd8, 0xff, 0xe0]));
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 400 when document is missing', async () => {
    const response = await request(app)
      .post('/api/patients')
      .field('fullName', 'John Doe')
      .field('email', 'john@gmail.com')
      .field('phoneCode', '+1')
      .field('phoneNumber', '1234567890');

    expect(response.status).toBe(400);
    expect(response.body.errors.document).toBe('Document photo is required');
  });

  it('returns validation errors for invalid fields', async () => {
    const response = await request(app)
      .post('/api/patients')
      .field('fullName', '123')
      .field('email', 'invalid@yahoo.com')
      .field('phoneCode', 'abc')
      .field('phoneNumber', '12')
      .attach('document', testImagePath);

    expect(response.status).toBe(400);
    expect(response.body.errors).toHaveProperty('fullName');
    expect(response.body.errors).toHaveProperty('email');
    expect(response.body.errors).toHaveProperty('phoneCode');
    expect(response.body.errors).toHaveProperty('phoneNumber');
  });

  it('returns 409 when email already exists', async () => {
    mockPrisma.patient.findUnique.mockResolvedValue({ id: 'existing' });

    const response = await request(app)
      .post('/api/patients')
      .field('fullName', 'John Doe')
      .field('email', 'john.doe@gmail.com')
      .field('phoneCode', '+1')
      .field('phoneNumber', '1234567890')
      .attach('document', testImagePath);

    expect(response.status).toBe(409);
    expect(response.body.errors.email).toContain('already exists');
  });

  it('creates patient and dispatches confirmation email', async () => {
    mockPrisma.patient.findUnique.mockResolvedValue(null);
    mockPrisma.patient.create.mockResolvedValue(samplePatient);

    const response = await request(app)
      .post('/api/patients')
      .field('fullName', 'John Doe')
      .field('email', 'john.doe@gmail.com')
      .field('phoneCode', '+1')
      .field('phoneNumber', '1234567890')
      .attach('document', testImagePath);

    expect(response.status).toBe(201);
    expect(response.body.data).toMatchObject({
      fullName: 'John Doe',
      email: 'john.doe@gmail.com',
    });
    expect(mockDispatchConfirmationEmail).toHaveBeenCalledWith({
      patientId: samplePatient.id,
      email: samplePatient.email,
      fullName: samplePatient.fullName,
    });
  });
});

describe('GET /api/health', () => {
  it('returns health status', async () => {
    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
    expect(response.body).toHaveProperty('timestamp');
  });
});
