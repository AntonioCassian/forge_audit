import mongoose from 'mongoose';

export const connectMongoDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log('MongoDB conectado com sucesso!');
  } catch (error) {
    console.error('Erro ao conectar MongoDB:', error);
    throw error;
  }
};