use AgroTech;

DELIMITER $$
CREATE TRIGGER trg_log_novo_contrato
AFTER INSERT ON Contrato
FOR EACH ROW
BEGIN
    INSERT INTO Log_Contratos (ID_contrato_afetado, data_acao, acao_realizada, valor_contrato)
    VALUES (NEW.ID_contrato, NOW(), 'NOVO CONTRATO', NEW.valor);
END$$
DELIMITER ;

-- Atualizar Nível do Reservatório
-- Função: Impede que uma medição de um sensor de reservatório atualize o nível para um
-- valor maior que a capacidade máxima do reservatório. Garante a integridade dos dados.
DELIMITER $$
CREATE TRIGGER trg_valida_nivel_reservatorio
BEFORE UPDATE ON Reservatorio
FOR EACH ROW
BEGIN
    -- Se o novo nível for maior que a capacidade, gera um erro.
    IF NEW.nivel_atual > NEW.capacidade THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Erro: O nível atual não pode exceder a capacidade do reservatório.';
    END IF;
END$$
DELIMITER ;