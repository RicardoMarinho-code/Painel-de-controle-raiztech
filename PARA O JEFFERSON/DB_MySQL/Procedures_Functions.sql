DELIMITER $$
CREATE FUNCTION `FN_GERAR_ID_USUARIO`(
    p_data_nascimento DATE
)
RETURNS VARCHAR(30)
DETERMINISTIC
BEGIN
    DECLARE novo_id VARCHAR(30);
    DECLARE prefixo VARCHAR(4) DEFAULT 'RZT';
    DECLARE data_formatada VARCHAR(8);
    DECLARE parte_aleatoria VARCHAR(6);
    DECLARE id_existe INT DEFAULT 1;

    IF p_data_nascimento IS NULL THEN
        SET data_formatada = DATE_FORMAT(NOW(), '%Y%m%d');
    ELSE
        SET data_formatada = DATE_FORMAT(p_data_nascimento, '%Y%m%d');
    END IF;

    WHILE id_existe > 0 DO
        SET parte_aleatoria = SUBSTRING(MD5(RAND()), 1, 6);
        SET novo_id = CONCAT(prefixo, data_formatada, '_', UPPER(parte_aleatoria));

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
    DECLARE v_role_id INT;
    
    START TRANSACTION;
    
    SET v_id_usuario = FN_GERAR_ID_USUARIO(p_data_nascimento);
    
    -- Insere o usuário
    INSERT INTO Usuarios (ID_Usuario, nome, senha, email, telefone)
    VALUES (v_id_usuario, p_nome, p_senha, p_email, p_telefone);
    
    -- Insere o agricultor
    INSERT INTO Agricultor (CPF, data_nascimento, ID_Usuario_fk)
    VALUES (p_cpf, p_data_nascimento, v_id_usuario);

    SELECT role_id INTO v_role_id FROM Roles WHERE nome_role = 'Agricultor';
    INSERT INTO Usuario_Roles (ID_Usuario_fk, role_id) VALUES (v_id_usuario, v_role_id);
    
    COMMIT;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE sp_Cadastrar_Funcionario(
    IN p_nome VARCHAR(255),
    IN p_senha VARCHAR(255),
    IN p_email VARCHAR(255),
    IN p_telefone VARCHAR(15),
    IN p_cargo VARCHAR(100)
)
BEGIN
    DECLARE v_id_usuario VARCHAR(30);
    DECLARE v_role_id INT;
    
    SET v_id_usuario = FN_GERAR_ID_USUARIO(NULL);

    INSERT INTO Usuarios (ID_Usuario, nome, senha, email, telefone)
    VALUES (v_id_usuario, p_nome, p_senha, p_email, p_telefone);
    
    INSERT INTO Funcionarios (cargo, ID_Usuario_fk)
    VALUES (p_cargo, v_id_usuario);

    SELECT role_id INTO v_role_id FROM Roles WHERE nome_role = 'Funcionario';
    INSERT INTO Usuario_Roles (ID_Usuario_fk, role_id) VALUES (v_id_usuario, v_role_id);
    
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE sp_Cadastrar_Admin(
    IN p_nome VARCHAR(255),
    IN p_senha VARCHAR(255),
    IN p_email VARCHAR(255),
    IN p_telefone VARCHAR(15),
    IN p_nivel_permissao INT
)
BEGIN
    DECLARE v_id_usuario VARCHAR(30);
    DECLARE v_role_id INT;
    
    SET v_id_usuario = FN_GERAR_ID_USUARIO(NULL);

    INSERT INTO Usuarios (ID_Usuario, nome, senha, email, telefone)
    VALUES (v_id_usuario, p_nome, p_senha, p_email, p_telefone);
    
    INSERT INTO ADM (nivel_permissao, ID_Usuario_fk)
    VALUES (p_nivel_permissao, v_id_usuario);

    SELECT role_id INTO v_role_id FROM Roles WHERE nome_role = 'Admin';
    INSERT INTO Usuario_Roles (ID_Usuario_fk, role_id) VALUES (v_id_usuario, v_role_id);
    
END$$
DELIMITER ;