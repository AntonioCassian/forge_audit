
import mongoose from 'mongoose';
import type { Collection } from 'mongodb';
import type { AuditLog } from '../../core/entitties/audit-log.js';

export const connectMongoDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error('MONGODB_URI não foi configurada!');
    }

    await mongoose.connect(mongoUri);

    console.log('MongoDB conectado com sucesso!');
  } catch (error) {
    console.error('Erro ao conectar MongoDB:', error);
    throw error;
  }
};

export const getAuditCollection = (): Collection<AuditLog> => {
  if (!mongoose.connection.db) {
    throw new Error('MongoDB ainda não está conectado!');
  }

  return mongoose.connection.db.collection<AuditLog>('audit_logs');
};
