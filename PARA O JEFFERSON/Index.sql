use AgroTech;

-- Justificativa: A tabela 'Medicao' será a maior do banco, com registros constantes de sensores.
-- Consultas para obter medições de uma propriedade específica serão muito frequentes.
-- Criar um índice em 'ID_propriedade_fk' é essencial para a performance.
create INDEX idx_medicao_propriedade on Medicao(ID_propriedade_fk);

-- Justificativa: Será comum buscar todos os sensores de uma determinada propriedade rural
-- para exibir em um dashboard ou para processamento.
create INDEX idx_sensor_propriedade on Sensor(ID_PropriedadeRural_fk);

-- Justificativa: Para buscar rapidamente todos os contratos de um agricultor.
create INDEX idx_contrato_agricultor on Contrato(ID_agricultor_fk);