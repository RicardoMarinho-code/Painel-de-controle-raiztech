/**
 * SERVIÇO DE HISTÓRICO - history.service.ts
 * -------------------------------------------
 * A camada de "Service" (serviço) é responsável por conter a lógica de negócio da aplicação.
 * Ela é chamada pelos "Controllers" e sua função é orquestrar as operações,
 * como buscar dados do banco (usando os "Models"), processá-los, e retornar
 * o resultado para o controller.
 *
 * Manter a lógica de negócio aqui isola-a do framework web (Express), tornando o código
 * mais testável, reutilizável e fácil de manter.
 */

// Importa o modelo `MedicaoLog` e sua interface `IMedicaoLog`.
// O modelo é a ferramenta para interagir com a coleção `medicoes` no MongoDB.
import MedicaoLog, { IMedicaoLog } from '../models/MedicaoLog.model';

/**
 * Função `getCorrelacoes24h`
 *
 * Busca todas as medições das últimas 24 horas no MongoDB, processa esses dados
 * para calcular médias horárias por tipo de sensor e retorna um resultado formatado.
 * Esta função é um bom exemplo de como a lógica de agregação de dados, que poderia
 * ser feita no banco de dados SQL, é frequentemente trazida para a camada de aplicação
 * ao se trabalhar com NoSQL.
 */
async function getCorrelacoes24h() {
  // 1. CALCULAR O PONTO DE PARTIDA NO TEMPO
  // Cria um objeto Date representando o momento exato de 24 horas atrás.
  const vinteQuatroHorasAtras = new Date(Date.now() - 24 * 60 * 60 * 1000);

  // 2. BUSCAR DADOS DO BANCO DE DADOS
  // Usa o modelo `MedicaoLog` para executar uma query `find` no MongoDB.
  // - `{ timestamp: { $gte: vinteQuatroHorasAtras } }`: É o filtro da query. `$gte` (greater than or equal)
  //   seleciona todos os documentos onde o campo `timestamp` é maior ou igual à data calculada.
  // - `.sort({ timestamp: 'asc' })`: Ordena os resultados em ordem cronológica ascendente.
  /**
   * NOTA DE PERFORMANCE:
   * Esta abordagem busca todos os documentos das últimas 24h para a memória da aplicação
   * e então faz o processamento (agrupamento e cálculo de médias). Para volumes de dados
   * pequenos ou moderados, isso é aceitável.
   *
   * Para grandes volumes de dados, a abordagem mais performática seria usar o
   * MongoDB Aggregation Framework. Isso permitiria que o próprio banco de dados
   * fizesse o agrupamento e o cálculo das médias, retornando para a aplicação
   * um conjunto de dados muito menor e já pré-processado, economizando memória e CPU na API.
   */
  const medicoes: IMedicaoLog[] = await MedicaoLog.find({
    timestamp: { $gte: vinteQuatroHorasAtras }
  }).sort({ timestamp: 'asc' });

  // 3. PROCESSAR E AGRUPAR OS DADOS NA APLICAÇÃO
  // Cria um objeto para agrupar as medições. A chave será a hora (0-23) e o valor
  // será outro objeto contendo os valores de cada tipo de medição naquela hora.
  // Exemplo da estrutura após o loop: { 14: { Temperatura: [25, 26], Umidade: [60, 62] }, 15: { ... } }
  const medicoesPorHora: { [hour: number]: { [type: string]: number[] } } = {};

  // Itera sobre cada medição retornada pelo banco.
  for (const medicao of medicoes) {
    // Extrai a hora do timestamp da medição.
    const hour = new Date(medicao.timestamp).getHours();
    // Se ainda não existe uma entrada para esta hora, cria um objeto vazio.
    if (!medicoesPorHora[hour]) {
      medicoesPorHora[hour] = {};
    }
    // Se ainda não existe um array para este tipo de medição nesta hora, cria um array vazio.
    if (!medicoesPorHora[hour][medicao.tipo]) {
      medicoesPorHora[hour][medicao.tipo] = [];
    }
    // Adiciona o valor da medição ao array correspondente.
    medicoesPorHora[hour][medicao.tipo].push(medicao.valor);
  }

  // 4. CALCULAR MÉDIAS E FORMATAR A SAÍDA
  // Transforma o objeto `medicoesPorHora` em um array de resultados finais.
  // `Object.entries` converte o objeto { hora: { tipo: valores } } em um array de [chave, valor],
  // por exemplo: [ [0, { Temperatura: [25, 26] }], [1, { ... }] ]
  const resultadoFinal = Object.entries(medicoesPorHora).map(([hour, tipos]) => {
    // Objeto para armazenar as médias calculadas para a hora atual.
    // Ex: { temperatura: 25.5, umidade: 61 }
    const medias: { [key: string]: number | null } = {};

    // Para cada hora, itera sobre os tipos de medição (`Temperatura`, `Umidade`, etc.).
    // Novamente, `Object.entries` é usado para iterar sobre o objeto de tipos.
    for (const [tipo, valores] of Object.entries(tipos)) {
      // `reduce` é usado para somar todos os valores de um determinado tipo de medição naquela hora.
      // `acc` é o acumulador (começa em 0) e `val` é o valor atual no array `valores`.
      const soma = valores.reduce((acc, val) => acc + val, 0);
      // Calcula a média e a armazena no objeto `medias` com o nome do tipo em minúsculas.
      // Isso padroniza as chaves do objeto para o frontend (ex: 'Temperatura' vira 'temperatura').
      medias[tipo.toLowerCase()] = soma / valores.length;
    }

    // Retorna um objeto formatado para o frontend, com nomes de propriedade padronizados
    // e aplicando ajustes de escala se necessário.
    // O operador `|| null` garante que, se não houver medições para um tipo em uma determinada hora,
    // o valor será `null` em vez de `undefined`, o que pode ser mais fácil de tratar no frontend.
    return {
      hour: parseInt(hour, 10),
      temperature: medias.temperatura || null,
      soilMoisture: medias.umidade || null,
      // Exemplo de normalização: se a intensidade solar é armazenada em uma escala de 0-1000,
      // mas o gráfico no frontend espera uma escala de 0-100, a divisão é feita aqui.
      sunIntensity: medias.luzsolar ? medias.luzsolar / 10 : null, // Ajuste de escala
      // Exemplo de ajuste: se o pH é armazenado como 0.7 e o frontend espera 7.0.
      ph: medias.ph ? medias.ph * 10 : null, // Ajuste de escala
    };
  });

  // Garante que o resultado final esteja ordenado por hora antes de retornar.
  // Isso é importante para que os gráficos de linha do tempo no frontend sejam exibidos corretamente.
  return resultadoFinal.sort((a, b) => a.hour - b.hour);
}

// Exporta um objeto contendo todas as funções do serviço para serem usadas pelos controllers.
export const historyService = {
  getCorrelacoes24h,
};