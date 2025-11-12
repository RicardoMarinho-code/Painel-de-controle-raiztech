import mongoose, { Schema, Document } from 'mongoose';

/**
 * Interface que representa um documento de Medição no MongoDB.
 * Garante a tipagem correta ao usar TypeScript.
 */
export interface IMedicaoLog extends Document {
  sensorId: number;
  tipo: 'Temperatura' | 'Umidade' | 'LuzSolar' | 'pH';
  valor: number;
  timestamp: Date;
}

/**
 * Schema do Mongoose para MedicaoLog.
 * Define a estrutura, tipos e validações dos dados.
 */
const MedicaoLogSchema: Schema = new Schema({
  sensorId: { type: Number, required: true, index: true },
  tipo: { type: String, required: true, enum: ['Temperatura', 'Umidade', 'LuzSolar', 'pH'] },
  valor: { type: Number, required: true },
  timestamp: { type: Date, required: true, default: Date.now, index: true }
});

/**
 * Modelo do Mongoose.
 * É através dele que interagimos com a coleção 'medicoes' no MongoDB.
 */
export default mongoose.model<IMedicaoLog>('MedicaoLog', MedicaoLogSchema, 'medicoes');