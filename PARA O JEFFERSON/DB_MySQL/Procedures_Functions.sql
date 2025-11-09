use AgroTech;

DELIMITER $$
CREATE FUNCTION `FN_GERAR_ID_USUARIO`()
RETURNS VARCHAR(30)
DETERMINISTIC
BEGIN
    DECLARE novo_id VARCHAR(30);
    DECLARE prefixo VARCHAR(4) DEFAULT 'RZT';
    DECLARE data_atual VARCHAR(8);
    DECLARE parte_aleatoria VARCHAR(6);
    DECLARE id_existe INT DEFAULT 1;

    WHILE id_existe > 0 DO
        SET data_atual = DATE_FORMAT(NOW(), '%Y%m%d');
        SET parte_aleatoria = SUBSTRING(MD5(RAND()), 1, 6);
        SET novo_id = CONCAT(prefixo, data_atual, '_', UPPER(parte_aleatoria));

        -- CORREÇÃO: O nome da coluna foi corrigido para ID_Usuario
        SELECT COUNT(*) INTO id_existe FROM Usuarios WHERE ID_Usuario = novo_id;
    END WHILE;

    RETURN novo_id;
END $$
DELIMITER ;

DELIMITER $$
CREATE FUNCTION `fn_Gerar_ID_Contrato`()
RETURNS VARCHAR(20)
DETERMINISTIC
BEGIN
    DECLARE v_ano INT;
    DECLARE v_ultimo_id INT;
    DECLARE v_novo_id_sequencial INT;
    DECLARE v_novo_id_contrato VARCHAR(20);

    SET v_ano = YEAR(CURDATE());
    
    SELECT IFNULL(MAX(CONVERT(SUBSTRING(ID_contrato, 10), UNSIGNED INTEGER)), 1000)
    INTO v_ultimo_id
    FROM Contrato WHERE SUBSTRING(ID_contrato, 5, 4) = v_ano;

    SET v_novo_id_sequencial = v_ultimo_id + 1;
    SET v_novo_id_contrato = CONCAT('CON-', v_ano, '-', v_novo_id_sequencial);

    RETURN v_novo_id_contrato;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE sp_Cadastrar_Agricultor(
    IN p_nome VARCHAR(255),
    IN p_senha VARCHAR(255),
    IN p_email VARCHAR(255),
    IN p_telefone VARCHAR(15),
    IN p_cpf VARCHAR(11),
    IN p_data_nascimento DATE
)
BEGIN
    DECLARE v_id_usuario VARCHAR(30);
    
    START TRANSACTION;
    
    -- Gera e insere na tabela de usuários
    SET v_id_usuario = FN_GERAR_ID_USUARIO();
    INSERT INTO Usuarios (ID_Usuario, nome, senha, email, telefone)
    VALUES (v_id_usuario, p_nome, p_senha, p_email, p_telefone);
    
    -- Insere na tabela de agricultores usando o ID gerado
    INSERT INTO Agricultor (CPF, data_nascimento, ID_Usuario_fk)
    VALUES (p_cpf, p_data_nascimento, v_id_usuario);
    
    COMMIT;
END$$
DELIMITER ;