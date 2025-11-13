use agrotech;

DELIMITER $$

-- 1. Concatena o prefixo 'RZT' + data (Nascimento ou atual) + '_' + 6 caracteres aleatórios.
--    Exemplo: RZT19920130_C5266A
-- 2. Utiliza um loop (WHILE) para checar se o ID gerado já existe.
-- 3. Se existir, gera um novo ID até encontrar um que seja único.
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

    -- Se a data de nascimento for nula, usa a data atual para gerar o ID
    IF p_data_nascimento IS NULL THEN
        SET data_formatada = DATE_FORMAT(NOW(), '%Y%m%d');
    ELSE
        SET data_formatada = DATE_FORMAT(p_data_nascimento, '%Y%m%d');
    END IF;

    -- Garante a unicidade do ID
    WHILE id_existe > 0 DO
        SET parte_aleatoria = SUBSTRING(MD5(RAND()), 1, 6);
        SET novo_id = CONCAT(prefixo, data_formatada, '_', UPPER(parte_aleatoria));

        -- Verifica se o ID já existe na tabela Usuarios
        SELECT COUNT(*) INTO id_existe FROM Usuarios WHERE ID_Usuario = novo_id;
    END WHILE;

    RETURN novo_id;
END $$
DELIMITER ;

DELIMITER $$

-- Propósito: Criar um ID de contrato sequencial e formatado por ano.
-- 1. Pega o ano atual (ex: 2024).
-- 2. Busca o último número sequencial usado para aquele ano (ex: 1001).
-- 3. Se for o primeiro do ano, começa em 1000.
-- 4. Incrementa o sequencial (ex: 1002) e formata o ID.
--    Exemplo: CON-2024-1002
CREATE FUNCTION `fn_Gerar_ID_Contrato`()
RETURNS VARCHAR(20)
DETERMINISTIC
BEGIN
    DECLARE v_ano INT;
    DECLARE v_ultimo_id INT;
    DECLARE v_novo_id_sequencial INT;
    DECLARE v_novo_id_contrato VARCHAR(20);

    SET v_ano = YEAR(CURDATE());
    
    -- Busca o maior ID (convertido para número) daquele ano. Se não houver, usa 1000 como base.
    SELECT IFNULL(MAX(CONVERT(SUBSTRING(ID_contrato, 10), UNSIGNED INTEGER)), 1000)
    INTO v_ultimo_id
    FROM Contrato WHERE SUBSTRING(ID_contrato, 5, 4) = v_ano;

    -- Gera o próximo número da sequência
    SET v_novo_id_sequencial = v_ultimo_id + 1;
    -- Formata o novo ID
    SET v_novo_id_contrato = CONCAT('CON-', v_ano, '-', v_novo_id_sequencial);

    RETURN v_novo_id_contrato;
END$$
DELIMITER ;

DELIMITER $$

-- Propósito: Automatizar o cadastro completo de um novo Agricultor.
-- 1. Inicia uma TRANSAÇÃO (ou tudo funciona, ou nada é salvo).
-- 2. Gera um ID de usuário novo chamando a função `FN_GERAR_ID_USUARIO`.
-- 3. Insere os dados básicos na tabela 'Usuarios'.
-- 4. Insere os dados específicos (CPF, etc.) na tabela 'Agricultor', ligando ao usuário criado.
-- 5. Busca o ID da 'Role' (permissão) de 'Agricultor'.
-- 6. Associa o novo usuário a essa permissão na tabela 'Usuario_Roles'.
-- 7. Finaliza a transação com COMMIT.
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
    
    -- Gera o ID único
    SET v_id_usuario = FN_GERAR_ID_USUARIO(p_data_nascimento);
    
    -- Insere o usuário
    INSERT INTO Usuarios (ID_Usuario, nome, senha, email, telefone)
    VALUES (v_id_usuario, p_nome, p_senha, p_email, p_telefone);
    
    -- Insere o agricultor
    INSERT INTO Agricultor (CPF, data_nascimento, ID_Usuario_fk)
    VALUES (p_cpf, p_data_nascimento, v_id_usuario);

    -- Atribui a permissão de "Agricultor"
    SELECT role_id INTO v_role_id FROM Roles WHERE nome_role = 'Agricultor';
    INSERT INTO Usuario_Roles (ID_Usuario_fk, role_id) VALUES (v_id_usuario, v_role_id);
    
    COMMIT;
END$$
DELIMITER ;

DELIMITER $$

-- O que faz:
-- 1. Gera um ID de usuário novo (passando NULL para usar a data atual).
-- 2. Insere os dados na tabela 'Usuarios'.
-- 3. Insere o cargo na tabela 'Funcionarios', ligando ao usuário criado.
-- 4. Associa o novo usuário à permissão (Role) de 'Funcionario'.
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

    -- Atribui a permissão de "Funcionario"
    SELECT role_id INTO v_role_id FROM Roles WHERE nome_role = 'Funcionario';
    INSERT INTO Usuario_Roles (ID_Usuario_fk, role_id) VALUES (v_id_usuario, v_role_id);
    
END$$
DELIMITER ;

DELIMITER $$

-- O que faz:
-- 1. Gera um ID de usuário novo.
-- 2. Insere os dados na tabela 'Usuarios'.
-- 3. Insere o nível de permissão na tabela 'ADM', ligando ao usuário criado.
-- 4. Associa o novo usuário à permissão (Role) de 'Admin'.
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

    -- Atribui a permissão de "Admin"
    SELECT role_id INTO v_role_id FROM Roles WHERE nome_role = 'Admin';
    INSERT INTO Usuario_Roles (ID_Usuario_fk, role_id) VALUES (v_id_usuario, v_role_id);
    
END$$
DELIMITER ;