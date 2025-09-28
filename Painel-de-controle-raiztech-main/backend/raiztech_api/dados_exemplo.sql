-- Dados de exemplo para testar a aplicação RaizTech
-- Execute este script após criar o banco com Banco_SQL.sql

USE AgroTech;

-- Inserir agricultores de exemplo
INSERT INTO Agricultor (nome, CPF, data_nascimento, telefones_de_conato) VALUES
('João Silva Santos', '12345678901', '1975-03-15', '(11) 98765-4321, (11) 3456-7890'),
('Maria Oliveira Costa', '23456789012', '1980-07-22', '(11) 99876-5432'),
('Carlos Eduardo Lima', '34567890123', '1970-11-08', '(11) 97654-3210, (11) 3234-5678');

-- Inserir propriedades rurais
INSERT INTO PropriedadeRural (nome, localizacao, area_total, ID_agricultor_fk) VALUES
('Fazenda São José', 'Campinas/SP - Rodovia SP-340 Km 15', 125.50, 1),
('Sítio Boa Vista', 'Piracicaba/SP - Estrada Municipal 200', 87.25, 2),
('Fazenda Santa Clara', 'Ribeirão Preto/SP - Via Anhanguera Km 320', 200.75, 3);

-- Inserir zonas de irrigação
INSERT INTO Zona (nome, hectares, eficiencia, economia, ID_propriedade_fk) VALUES
('Zona Norte - Milho', 25.50, 94.2, 1250.00, 1),
('Zona Sul - Soja', 30.25, 91.8, 1580.00, 1),
('Zona Leste - Feijão', 18.75, 96.5, 890.00, 2),
('Zona Oeste - Verduras', 12.30, 89.3, 650.00, 2),
('Zona Central - Cana', 45.80, 92.7, 2100.00, 3),
('Zona Nordeste - Café', 22.15, 95.1, 1320.00, 3);

-- Inserir irrigadores
INSERT INTO Irrigador (nome, eficiencia_hidrica, economia, bateria, status_, ID_zona_fk) VALUES
('Irrigador Inteligente A1', 94.2, 1250.00, 98.5, 'Ativo', 1),
('Irrigador Inteligente B2', 91.8, 1580.00, 85.2, 'Ativo', 2),
('Irrigador Inteligente C3', 96.5, 890.00, 92.7, 'Ativo', 3),
('Irrigador Inteligente D4', 89.3, 650.00, 76.3, 'Ocioso', 4),
('Irrigador Inteligente E5', 92.7, 2100.00, 88.9, 'Ativo', 5),
('Irrigador Inteligente F6', 95.1, 1320.00, 15.2, 'Manutenção', 6);

-- Inserir sensores
INSERT INTO Sensor (fabricante, tipo, ID_PropriedadeRural_fk) VALUES
('SensorTech', 'Umidade', 1),
('SensorTech', 'pH', 1),
('AgroSense', 'Temperatura', 1),
('SensorTech', 'LuzSolar', 1),
('HydroSensor', 'Reservatorio', 1),
('SensorTech', 'Umidade', 2),
('AgroSense', 'pH', 2),
('SensorTech', 'Temperatura', 2),
('HydroSensor', 'Reservatorio', 2),
('SensorTech', 'Umidade', 3),
('AgroSense', 'pH', 3),
('SensorTech', 'LuzSolar', 3);

-- Inserir medições recentes (últimas 24 horas)
INSERT INTO Medicao (data_hora, valor_medicao, ID_sensor_fk, ID_propriedade_fk) VALUES
-- Propriedade 1
(NOW() - INTERVAL 1 HOUR, 68.5, 1, 1),    -- Umidade
(NOW() - INTERVAL 1 HOUR, 6.8, 2, 1),     -- pH
(NOW() - INTERVAL 1 HOUR, 24.3, 3, 1),    -- Temperatura
(NOW() - INTERVAL 1 HOUR, 850.2, 4, 1),   -- Luz Solar
(NOW() - INTERVAL 1 HOUR, 75.8, 5, 1),    -- Reservatório

-- Propriedade 2
(NOW() - INTERVAL 2 HOUR, 72.1, 6, 2),    -- Umidade
(NOW() - INTERVAL 2 HOUR, 7.2, 7, 2),     -- pH
(NOW() - INTERVAL 2 HOUR, 23.8, 8, 2),    -- Temperatura
(NOW() - INTERVAL 2 HOUR, 82.4, 9, 2),    -- Reservatório

-- Propriedade 3
(NOW() - INTERVAL 30 MINUTE, 65.3, 10, 3), -- Umidade
(NOW() - INTERVAL 30 MINUTE, 6.5, 11, 3),  -- pH
(NOW() - INTERVAL 30 MINUTE, 25.1, 12, 3), -- Luz Solar

-- Medições mais antigas para histórico
(NOW() - INTERVAL 5 HOUR, 70.2, 1, 1),
(NOW() - INTERVAL 5 HOUR, 6.9, 2, 1),
(NOW() - INTERVAL 10 HOUR, 69.8, 1, 1),
(NOW() - INTERVAL 10 HOUR, 7.0, 2, 1),
(NOW() - INTERVAL 15 HOUR, 71.5, 6, 2),
(NOW() - INTERVAL 15 HOUR, 7.1, 7, 2);

-- Inserir setores
INSERT INTO Setor (nome, cultura, umidade_atual, duracao_irrigacao, ultima_irrigacao, proxima_irrigacao, ID_propriedade_fk) VALUES
('Setor A - Milho', 'Milho', 68.5, 45, NOW() - INTERVAL 6 HOUR, NOW() + INTERVAL 18 HOUR, 1),
('Setor B - Soja', 'Soja', 72.1, 30, NOW() - INTERVAL 4 HOUR, NOW() + INTERVAL 20 HOUR, 1),
('Setor C - Feijão', 'Feijão', 75.3, 25, NOW() - INTERVAL 8 HOUR, NOW() + INTERVAL 16 HOUR, 2),
('Setor D - Verduras', 'Alface', 78.2, 20, NOW() - INTERVAL 2 HOUR, NOW() + INTERVAL 22 HOUR, 2),
('Setor E - Cana', 'Cana-de-açúcar', 65.8, 60, NOW() - INTERVAL 12 HOUR, NOW() + INTERVAL 12 HOUR, 3);

-- Inserir reservatórios
INSERT INTO Reservatorio (capacidade, nivel_atual, ID_propriedade_fk) VALUES
(10000.00, 7580.00, 1),  -- 75.8% de capacidade
(8000.00, 6592.00, 2),   -- 82.4% de capacidade
(15000.00, 10500.00, 3); -- 70% de capacidade

-- Inserir decisões da IA
INSERT INTO DecisaoIA (tipo, zona, descricao, volume_economizado, confianca, data_hora, ID_zona_fk) VALUES
('Otimização', 'Zona Norte', 'Irrigação reduzida devido à previsão de chuva em 6 horas', 340.50, 96.2, NOW() - INTERVAL 2 HOUR, 1),
('Economia', 'Zona Sul', 'Ajuste de pressão baseado na umidade do solo', 280.75, 94.8, NOW() - INTERVAL 1 HOUR, 2),
('Prevenção', 'Zona Leste', 'Irrigação antecipada para evitar estresse hídrico', 0.00, 91.3, NOW() - INTERVAL 3 HOUR, 3),
('Otimização', 'Zona Central', 'Micro-irrigação por detecção de cultura sensível', 420.30, 97.1, NOW() - INTERVAL 30 MINUTE, 5),
('Manutenção', 'Zona Nordeste', 'Irrigador em manutenção preventiva', 0.00, 100.0, NOW() - INTERVAL 4 HOUR, 6);

-- Inserir culturas
INSERT INTO Cultura (nome, padroes_ml, eficiencia, economia, statusIA, ID_setor_fk) VALUES
('Milho Híbrido', 127, 94.2, 1250.00, 'Otimizado', 1),
('Soja Transgênica', 89, 91.8, 1580.00, 'Aprendendo', 2),
('Feijão Carioca', 156, 96.5, 890.00, 'Otimizado', 3),
('Alface Americana', 203, 89.3, 650.00, 'Especialista', 4),
('Cana-de-açúcar', 78, 92.7, 2100.00, 'Aprendendo', 5);

-- Inserir empreendimentos
INSERT INTO Empreendimento (nome, finalidade, ID_agricultor_fk) VALUES
('Cultivo Sustentável São José', 'Produção de grãos com irrigação inteligente', 1),
('Hortifruti Boa Vista', 'Produção de hortaliças orgânicas', 2),
('Agronegócio Santa Clara', 'Produção em larga escala com IA', 3);

-- Inserir contratos
INSERT INTO Contrato (data_assinatura, valor, ID_agricultor_fk, ID_empreendimento_fk) VALUES
('2024-01-15', 125000.00, 1, 1),
('2024-02-20', 87500.00, 2, 2),
('2024-03-10', 200000.00, 3, 3);

-- Verificar se os dados foram inseridos
SELECT 'Dados inseridos com sucesso!' as Status;
SELECT COUNT(*) as Total_Agricultores FROM Agricultor;
SELECT COUNT(*) as Total_Irrigadores FROM Irrigador;
SELECT COUNT(*) as Total_Sensores FROM Sensor;
SELECT COUNT(*) as Total_Medicoes FROM Medicao;

