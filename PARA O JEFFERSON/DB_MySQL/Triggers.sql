use AgroTech;

DELIMITER $$

-- Propósito: Criar um registro de auditoria (log) automaticamente.
-- Evento: Dispara *APÓS* (AFTER) um novo registro ser inserido (INSERT) na tabela 'Contrato'.
-- Ação: Insere o ID do novo contrato (NEW.ID_contrato), a data atual (NOW()),
--       uma descrição da ação ('NOVO CONTRATO') e o valor (NEW.valor)
--       na tabela 'Log_Contratos' para rastreamento.
CREATE TRIGGER trg_log_novo_contrato
AFTER INSERT ON Contrato
FOR EACH ROW
BEGIN
    INSERT INTO Log_Contratos (ID_contrato_afetado, data_acao, acao_realizada, valor_contrato)
    VALUES (NEW.ID_contrato, NOW(), 'NOVO CONTRATO', NEW.valor);
END$$
DELIMITER ;

DELIMITER $$
-- TRIGGER: trg_valida_nivel_reservatorio
-- Propósito: Garantir a integridade dos dados e aplicar uma regra de negócio.
-- Evento: Dispara *ANTES* (BEFORE) de um registro ser atualizado (UPDATE) na 'Reservatorio'.
-- Ação: Verifica se o novo valor (NEW.nivel_atual) é maior que a capacidade (NEW.capacidade).
-- Resultado: Se a condição for verdadeira, a operação de UPDATE é *cancelada*
--          e um erro customizado (SQLSTATE '45000') é retornado ao cliente.
CREATE TRIGGER trg_valida_nivel_reservatorio
BEFORE UPDATE ON Reservatorio
FOR EACH ROW
BEGIN
    IF NEW.nivel_atual > NEW.capacidade THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Erro: O nível atual não pode exceder a capacidade do reservatório.';
    END IF;
END$$
DELIMITER ;