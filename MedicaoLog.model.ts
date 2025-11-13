/**
 * MODELO DE DADOS MONGOOSE - MedicaoLog.model.ts
 * ------------------------------------------------
 * Este arquivo define o "Model" para a coleção `medicoes` no MongoDB usando a biblioteca Mongoose.
 * O Mongoose é um ODM (Object Data Modeling) que facilita a interação com o MongoDB,
 * fornecendo uma camada de abstração sobre as operações do banco de dados, além de
 * validação de schema, casting de tipos e outras funcionalidades.
 *
 * O Model é a principal ferramenta para realizar operações de CRUD (Create, Read, Update, Delete)
 * na coleção correspondente.
 */

// Importa os componentes necessários do Mongoose.
// - `mongoose`: A instância principal da biblioteca.
// - `Schema`: O construtor para definir a estrutura dos documentos.
// - `Document`: A interface base que os documentos do Mongoose implementam.
import mongoose, { Schema, Document } from 'mongoose';

/**
 * Interface TypeScript (`IMedicaoLog`)
 * ------------------------------------
 * Esta interface define a "forma" de um documento de Medição para o TypeScript.
 * Ela garante que, ao manipular objetos de medição no código, o compilador
 * verifique os tipos, prevenindo erros e melhorando o autocompletar do editor.
 * Ela estende `Document` do Mongoose para incluir propriedades do Mongoose como `_id`.
 */
export interface IMedicaoLog extends Document {
  sensorId: number;
  tipo: 'Temperatura' | 'Umidade' | 'LuzSolar' | 'pH';
  valor: number;
  timestamp: Date;
}

/**
 * Schema do Mongoose (`MedicaoLogSchema`)
 * ---------------------------------------
 * O Schema define a estrutura dos documentos dentro da coleção no MongoDB.
 * Ele especifica os campos, seus tipos de dados e regras de validação.
 */
const MedicaoLogSchema: Schema = new Schema({
  // `index: true`: Cria um índice no MongoDB para este campo.
  // Índices melhoram drasticamente a performance de queries de leitura (find, sort)
  // que utilizam este campo como filtro. O custo é um leve aumento no tempo de escrita
  // (insert, update) e no uso de armazenamento, pois o índice também precisa ser atualizado.
  // É uma boa prática indexar campos que são frequentemente usados em filtros de busca.
  // `sensorId`: Identificador numérico do sensor. É obrigatório e indexado para otimizar buscas.
  sensorId: { type: Number, required: true, index: true },
  // `tipo`: O tipo de medição. O `enum` restringe os valores possíveis a um conjunto pré-definido.
  tipo: { type: String, required: true, enum: ['Temperatura', 'Umidade', 'LuzSolar', 'pH'] },
  // `valor`: O valor numérico da medição. É obrigatório.
  valor: { type: Number, required: true },
  // `default: Date.now`: Se um documento for criado sem um `timestamp`, o Mongoose
  // automaticamente preencherá este campo com a data e hora atuais.
  // `timestamp`: A data e hora da medição. É obrigatório, tem um valor padrão para a data/hora atual
  // e é indexado para otimizar queries baseadas em tempo (como buscar as últimas 24h).
  timestamp: { type: Date, required: true, default: Date.now, index: true }
});

/**
 * Exportação do Modelo Mongoose
 * ------------------------------
 * `mongoose.model<IMedicaoLog>('MedicaoLog', MedicaoLogSchema, 'medicoes')`
 * Esta linha compila o schema em um Modelo e o exporta.
 * - O primeiro argumento, `'MedicaoLog'`, é o nome singular do modelo.
 * - O segundo argumento é o schema que define a estrutura.
 * - O terceiro argumento, `'medicoes'`, é o nome explícito da coleção no MongoDB.
 *   Se omitido, o Mongoose usaria o plural do nome do modelo em minúsculas (ex: 'medicaologs').
 *
 * Este modelo exportado será usado nos "services" para interagir com o banco de dados.
 * Ex: `MedicaoLog.find()`, `MedicaoLog.create()`, etc.
 */
export default mongoose.model<IMedicaoLog>('MedicaoLog', MedicaoLogSchema, 'medicoes');