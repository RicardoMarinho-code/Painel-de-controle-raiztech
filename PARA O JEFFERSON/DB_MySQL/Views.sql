use AgroTech;

-- Visão Geral do Agricultor
-- Justificativa: Simplifica a obtenção de informações combinadas do agricultor, seu usuário e
-- seu principal empreendimento, evitando a necessidade de escrever um JOIN complexo toda vez.
-- Útil para telas de perfil de usuário.
CREATE VIEW vw_Perfil_Agricultor AS
SELECT
    u.nome AS Nome_Usuario,
    u.email,
    a.CPF,
    a.data_nascimento,
    e.nome AS Nome_Empreendimento,
    e.finalidade
FROM Usuarios u
JOIN Agricultor a ON u.ID_Usuario = a.ID_Usuario_fk
LEFT JOIN Empreendimento e ON a.ID_agricultor = e.ID_agricultor_fk;


-- Dashboard de Sensores
-- Justificativa: Fornece um resumo do estado atual de todos os sensores, mostrando a última
-- medição registrada para cada um. Essencial para um painel de controle em tempo real.
CREATE VIEW vw_Status_Atual_Sensores AS
SELECT
    s.ID_sensor,
    s.tipo,
    pr.nome AS Propriedade,
    m.valor_medicao,
    m.data_hora AS Ultima_Leitura
FROM Sensor s
JOIN PropriedadeRural pr ON s.ID_PropriedadeRural_fk = pr.ID_propriedade
-- Subquery para pegar apenas a última medição de cada sensor
JOIN Medicao m ON s.ID_sensor = m.ID_sensor_fk
WHERE m.data_hora = (SELECT MAX(data_hora) FROM Medicao WHERE ID_sensor_fk = s.ID_sensor);