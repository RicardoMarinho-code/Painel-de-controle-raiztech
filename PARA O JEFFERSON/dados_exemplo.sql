-- Script de inserção de dados de exemplo para a aplicação RaizTech
-- Execute este script após criar o banco com o script de DDL.

USE AgroTech;

INSERT INTO Usuarios (nome, email, senha, telefone) VALUES 
-- Agricultores (IDs 1 a 7)
('Maria Oliveira Costa', 'maria.costa@email.com', 'hash_senha_1', '(11) 99876-5432'),
('Carlos Eduardo Lima', 'carlos.lima@email.com', 'hash_senha_2', '(11) 97654-3210'),
('Ana Beatriz Pereira', 'ana.pereira@email.com', 'hash_senha_3', '(19) 98877-6655'),
('Ricardo Almeida Souza', 'ricardo.souza@email.com', 'hash_senha_4', '(19) 97766-5544'),
('Fernanda Gonçalves', 'fernanda.g@email.com', 'hash_senha_5', '(16) 96655-4433'),
('Lucas Martins Ferreira', 'lucas.ferreira@email.com', 'hash_senha_6', '(16) 95544-3322'),
('João da Silva', 'joao.silva@email.com', 'hash_senha_7', '(18) 91234-5678'),
-- Usuário Administrador (ID 8)
('Admin Geral', 'admin@agrotech.com', 'hash_senha_admin', '(61) 99999-0001'),
-- Usuário Funcionário (ID 9)
('Carlos Suporte', 'suporte@agrotech.com', 'hash_senha_func', '(61) 99999-0002');

-- Inserir agricultores de exemplo
-- OBS: Adicionado um 7º agricultor para manter a consistência dos dados de exemplo.
INSERT INTO Agricultor (CPF, data_nascimento, id_usuario_fk) VALUES 
('23456789012', '1980-07-22', 1), -- Maria Oliveira Costa
('34567890123', '1970-11-08', 2), -- Carlos Eduardo Lima
('45678901234', '1992-01-30', 3), -- Ana Beatriz Pereira
('56789012345', '1985-06-10', 4), -- Ricardo Almeida Souza
('67890123456', '1995-09-25', 5), -- Fernanda Gonçalves
('78901234567', '1988-12-01', 6), -- Lucas Martins Ferreira
('89012345678', '1982-03-15', 7);  -- João da Silva

-- Inserir empreendimentos
INSERT INTO Empreendimento (nome, finalidade, ID_agricultor_fk) VALUES
('Cultivo Sustentável São José', 'Produção de grãos com irrigação inteligente', 1),
('Hortifruti Boa Vista', 'Produção de hortaliças orgânicas', 2),
('Agronegócio Santa Clara', 'Produção em larga escala com IA', 3),
('Flores de Holambra', 'Cultivo de flores para exportação', 4),
('Pomar Cítrico de Itu', 'Produção de suco de laranja concentrado', 5),
('Grãos do Interior', 'Cultivo extensivo de amendoim e soja', 6),
('Pecuária Leiteira do Vale', 'Produção de leite com pastagem irrigada', 7);

-- Inserir propriedades rurais
INSERT INTO PropriedadeRural (nome, localizacao, area_total, ID_agricultor_fk) VALUES
('Fazenda São José', 'Campinas/SP - Rodovia SP-340 Km 15', 125.50, 1),
('Sítio Boa Vista', 'Piracicaba/SP - Estrada Municipal 200', 87.25, 2),
('Fazenda Santa Clara', 'Ribeirão Preto/SP - Via Anhanguera Km 320', 200.75, 3),
('Chácara das Flores', 'Holambra/SP - Estrada HBR-040', 45.60, 4),
('Sítio Água Limpa', 'Itu/SP - Estrada do Jacu', 60.00, 5),
('Fazenda Sol Nascente', 'Bebedouro/SP - Rodovia BR-364', 350.20, 6),
('Estância do Vale', 'Franca/SP - Rodovia Cândido Portinari', 180.90, 7);

-- Inserir zonas de irrigação
INSERT INTO Zona (nome, hectares, eficiencia, economia, ID_propriedade_fk) VALUES
('Zona Norte - Milho', 25.50, 94.2, 1250.00, 1),
('Zona Sul - Soja', 30.25, 91.8, 1580.00, 1),
('Zona Leste - Feijão', 18.75, 96.5, 890.00, 2),
('Zona Oeste - Verduras', 12.30, 89.3, 650.00, 2),
('Zona Central - Cana', 45.80, 92.7, 2100.00, 3),
('Zona Nordeste - Café', 22.15, 95.1, 1320.00, 3),
('Zona Flores - Rosas', 15.00, 98.1, 950.00, 4),
('Zona Pomar - Laranja', 20.50, 93.5, 1100.00, 5),
('Zona Grãos - Amendoim', 150.00, 90.5, 4500.00, 6),
('Zona Pastagem - Brachiaria', 100.00, 88.0, 3200.00, 7);

-- Inserir irrigadores
INSERT INTO Irrigador (nome, eficiencia_hidrica, economia, bateria, status_, ID_zona_fk) VALUES
('Irrigador Inteligente A1', 94.2, 1250.00, 98.5, 'Ativo', 1),
('Irrigador Inteligente B2', 91.8, 1580.00, 85.2, 'Ativo', 2),
('Irrigador Inteligente C3', 96.5, 890.00, 92.7, 'Ativo', 3),
('Irrigador Inteligente D4', 89.3, 650.00, 76.3, 'Ocioso', 4),
('Irrigador Inteligente E5', 92.7, 2100.00, 88.9, 'Ativo', 5),
('Irrigador Inteligente F6', 95.1, 1320.00, 15.2, 'Manutenção', 6),
('Irrigador Inteligente G7', 98.1, 950.00, 99.0, 'Ativo', 7),
('Irrigador Inteligente H8', 93.5, 1100.00, 91.4, 'Ativo', 8),
('Irrigador Inteligente I9', 90.5, 4500.00, 82.1, 'Ocioso', 9),
('Irrigador Inteligente J10', 88.0, 3200.00, 89.5, 'Ativo', 10);

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
('SensorTech', 'LuzSolar', 3),
('SensorTech', 'Umidade', 4),
('AgroSense', 'Temperatura', 5),
('SensorTech', 'Umidade', 6),
('HydroSensor', 'Reservatorio', 7);

-- Inserir medições
INSERT INTO Medicao (data_hora, valor_medicao, ID_sensor_fk, ID_propriedade_fk) VALUES
-- Propriedade 1
(NOW() - INTERVAL 1 HOUR, 68.5, 1, 1),   -- Umidade
(NOW() - INTERVAL 1 HOUR, 6.8, 2, 1),    -- pH
(NOW() - INTERVAL 1 HOUR, 24.3, 3, 1),   -- Temperatura
(NOW() - INTERVAL 1 HOUR, 850.2, 4, 1),   -- Luz Solar
(NOW() - INTERVAL 1 HOUR, 75.8, 5, 1),   -- Reservatório
-- Propriedade 2
(NOW() - INTERVAL 2 HOUR, 72.1, 6, 2),   -- Umidade
(NOW() - INTERVAL 2 HOUR, 7.2, 7, 2),    -- pH
(NOW() - INTERVAL 2 HOUR, 23.8, 8, 2),   -- Temperatura
(NOW() - INTERVAL 2 HOUR, 82.4, 9, 2),   -- Reservatório
-- Propriedade 3
(NOW() - INTERVAL 30 MINUTE, 65.3, 10, 3), -- Umidade
(NOW() - INTERVAL 30 MINUTE, 6.5, 11, 3),  -- pH
(NOW() - INTERVAL 30 MINUTE, 25.1, 12, 3), -- Luz Solar
-- Medições mais antigas para histórico
(NOW() - INTERVAL 5 HOUR, 70.2, 1, 1),
(NOW() - INTERVAL 5 HOUR, 6.9, 2, 1),
(NOW() - INTERVAL 10 HOUR, 69.8, 1, 1),
(NOW() - INTERVAL 10 HOUR, 7.0, 2, 1),
(NOW() - INTERVAL 15 HOUR, 71.5, 6, 2), -- Medição de umidade para a propriedade 2
-- Novas medições
(NOW() - INTERVAL 45 MINUTE, 75.0, 13, 4), -- Umidade
(NOW() - INTERVAL 1 HOUR, 28.5, 14, 5),   -- Temperatura
(NOW() - INTERVAL 2 HOUR, 62.5, 15, 6),   -- Umidade
(NOW() - INTERVAL 3 HOUR, 90.0, 16, 7);   -- Reservatório (nível em %)

-- Inserir setores
INSERT INTO Setor (nome, cultura, umidade_atual, duracao_irrigacao, ultima_irrigacao, proxima_irrigacao, ID_propriedade_fk) VALUES
('Setor A - Milho', 'Milho', 68.5, 45, NOW() - INTERVAL 6 HOUR, NOW() + INTERVAL 18 HOUR, 1),
('Setor B - Soja', 'Soja', 72.1, 30, NOW() - INTERVAL 4 HOUR, NOW() + INTERVAL 20 HOUR, 1),
('Setor C - Feijão', 'Feijão', 75.3, 25, NOW() - INTERVAL 8 HOUR, NOW() + INTERVAL 16 HOUR, 2),
('Setor D - Verduras', 'Alface', 78.2, 20, NOW() - INTERVAL 2 HOUR, NOW() + INTERVAL 22 HOUR, 2),
('Setor E - Cana', 'Cana-de-açúcar', 65.8, 60, NOW() - INTERVAL 12 HOUR, NOW() + INTERVAL 12 HOUR, 3),
('Setor F - Rosas', 'Rosas Vermelhas', 80.0, 15, NOW() - INTERVAL 3 HOUR, NOW() + INTERVAL 21 HOUR, 4),
('Setor G - Laranja', 'Laranja Pera', 60.5, 50, NOW() - INTERVAL 10 HOUR, NOW() + INTERVAL 14 HOUR, 5),
('Setor H - Amendoim', 'Amendoim Runner', 55.0, 70, NOW() - INTERVAL 24 HOUR, NOW() + INTERVAL 24 HOUR, 6),
('Setor I - Pasto', 'Brachiaria Brizantha', 50.0, 90, NOW() - INTERVAL 36 HOUR, NOW() + INTERVAL 36 HOUR, 7);

-- Inserir reservatórios
INSERT INTO Reservatorio (capacidade, nivel_atual, ID_propriedade_fk) VALUES
(10000.00, 7580.00, 1),   -- 75.8% de capacidade
(8000.00, 6592.00, 2),    -- 82.4% de capacidade
(15000.00, 10500.00, 3),  -- 70% de capacidade
(5000.00, 4500.00, 4),    -- 90% de capacidade
(7500.00, 6000.00, 5),    -- 80% de capacidade
(25000.00, 18750.00, 6),  -- 75% de capacidade
(20000.00, 18000.00, 7);  -- 90% de capacidade

-- Inserir decisões da IA
INSERT INTO DecisaoIA (tipo, descricao, volume_economizado, confianca, data_hora, ID_zona_fk, zona) VALUES 
('Otimização', 'Irrigação reduzida devido à previsão de chuva em 6 horas', 340.50, 96.2, NOW() - INTERVAL 2 HOUR, 1, 'Zona Norte'),
('Economia', 'Ajuste de pressão baseado na umidade do solo', 280.75, 94.8, NOW() - INTERVAL 1 HOUR, 2, 'Zona Sul'),
('Prevenção', 'Irrigação antecipada para evitar estresse hídrico', 0.00, 91.3, NOW() - INTERVAL 3 HOUR, 3, 'Zona Leste'),
('Otimização', 'Micro-irrigação por detecção de cultura sensível', 420.30, 97.1, NOW() - INTERVAL 30 MINUTE, 5, 'Zona Oeste'),
('Manutenção', 'Irrigador em manutenção preventiva', 0.00, 100.0, NOW() - INTERVAL 4 HOUR, 6, 'Zona Central'),
('Otimização', 'Gotejamento preciso para evitar fungos nas pétalas', 150.00, 99.2, NOW() - INTERVAL 1 HOUR, 7, 'Setor A'),
('Economia', 'Pausa na irrigação, umidade do solo ideal', 220.00, 92.5, NOW() - INTERVAL 5 HOUR, 8, 'Setor B'),
('Alerta', 'Nível de umidade baixo, irrigação de emergência programada', -500.00, 98.0, NOW() - INTERVAL 15 MINUTE, 9, 'Setor C - Emergência'),
('Otimização', 'Irrigação por aspersão em ciclo longo para raízes profundas', 800.00, 90.0, NOW() - INTERVAL 8 HOUR, 10, 'Área de Testes');

-- Inserir culturas
INSERT INTO Cultura (nome, padroes_ml, eficiencia, economia, statusIA, ID_setor_fk) VALUES
('Milho Híbrido', 127, 94.2, 1250.00, 'Otimizado', 1),
('Soja Transgênica', 89, 91.8, 1580.00, 'Aprendendo', 2),
('Feijão Carioca', 156, 96.5, 890.00, 'Otimizado', 3),
('Alface Americana', 203, 89.3, 650.00, 'Especialista', 4),
('Cana-de-açúcar', 78, 92.7, 2100.00, 'Aprendendo', 5),
('Rosas Vermelhas', 250, 98.1, 950.00, 'Especialista', 6),
('Laranja Pera', 110, 93.5, 1100.00, 'Otimizado', 7),
('Amendoim Runner', 95, 90.5, 4500.00, 'Aprendendo', 8),
('Brachiaria Brizantha', 45, 88.0, 3200.00, 'Otimizado', 9);

-- Inserir contratos
INSERT INTO Contrato (data_assinatura, valor, ID_agricultor_fk, ID_empreendimento_fk) VALUES
('2024-01-15', 125000.00, 1, 1),
('2024-02-20', 87500.00, 2, 2),
('2024-03-10', 200000.00, 3, 3),
('2023-11-05', 75000.00, 4, 4),
('2024-04-01', 95000.00, 5, 5),
('2023-09-12', 450000.00, 6, 6),
('2024-05-18', 180000.00, 7, 7);

-- Inserir os dados específicos do ADM e Funcionário.
INSERT INTO Adm (nivel_permissao, id_usuario_fk) VALUES
(1, 8); -- 'Admin Geral' (usuário ID 8) com permissão máxima.

INSERT INTO Funcionarios (cargo, id_usuario_fk) VALUES
('Suporte Técnico', 9); -- 'Carlos Suporte' (usuário ID 9) com o cargo de suporte.

-- Definir os grupos de usuários.
INSERT IGNORE INTO Grupo_usuarios (nome_grupo) VALUES
('Administradores'),
('Funcionarios'),
('Agricultores');

-- Associar cada usuário ao seu respectivo grupo.
INSERT INTO Usuario_pertence_grupo (id_usuario_fk, id_grupo_fk) VALUES
-- Associar todos os agricultores (IDs 1 a 7) ao grupo 'Agricultores' (assumindo que seu ID é 3)
(1, 3),
(2, 3),
(3, 3),
(4, 3),
(5, 3),
(6, 3),
(7, 3),
-- Associar o ADM (ID 8) ao grupo 'Administradores' (assumindo que seu ID é 1)
(8, 1),
-- Associar o Funcionário (ID 9) ao grupo 'Funcionarios' (assumindo que seu ID é 2)
(9, 2);

-- Verificar se os dados foram inseridos
SELECT 'Dados inseridos com sucesso!' as Status;
SELECT COUNT(*) as Total_Agricultores FROM Agricultor;
SELECT COUNT(*) as Total_Propriedades FROM PropriedadeRural;
SELECT COUNT(*) as Total_Irrigadores FROM Irrigador;
SELECT COUNT(*) as Total_Sensores FROM Sensor;
SELECT COUNT(*) as Total_Medicoes FROM Medicao;
SELECT COUNT(*) as Total_Contratos FROM Contrato;