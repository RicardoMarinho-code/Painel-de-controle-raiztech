use AgroTech;

-- Procedure 1: Cadastrar Novo Agricultor
-- Explicação: Encapsula toda a lógica para criar um novo agricultor em uma única chamada.
-- Isso garante que as inserções nas tabelas 'Usuarios' e 'Agricultor' ocorram de forma
-- atômica (ou tudo funciona, ou nada funciona), mantendo a consistência do banco.
DELIMITER $$
create procedure sp_Cadastrar_Agricultor(
    in p_nome varchar(255),
    in p_senha varchar(255),
    in p_email varchar(255),
    in p_telefone varchar(15),
    in p_cpf varchar(11),
    in p_data_nascimento DATE
)
begin
   declare v_id_usuario int;
    -- Inicia uma transação
    start transaction;
    -- Insere na tabela de usuários
    insert into Usuarios (nome, senha, email, telefone)
    values (p_nome, p_senha, p_email, p_telefone);
    -- Pega o ID do usuário recém-criado
    set v_id_usuario = LAST_INSERT_ID();
    -- Insere na tabela de agricultores usando o ID do usuário
    insert into Agricultor (CPF, data_nascimento, ID_Usuario_fk)
    values (p_cpf, p_data_nascimento, v_id_usuario);
    -- Se tudo deu certo, confirma a transação
    commit;
end$$
DELIMITER ;


-- Function 2: Gerar ID de Contrato (atende ao requisito 7 também)
-- Explicação: Cria um ID de contrato personalizado e não sequencial, como 'CON-2025-1001',
-- o que é mais significativo e seguro do que um simples AUTO_INCREMENT para dados críticos.
DELIMITER $$
create function fn_Gerar_ID_Contrato()
returns varchar(20)
DETERMINISTIC
begin
    declare v_ano int;
    declare v_ultimo_id int;
    declare v_novo_id_sequencial int;
    declare v_novo_id_contrato varchar(20);

    set v_ano = year(curdate());
    -- Encontra o último ID do ano corrente (ex: CON-2025-1005 -> extrai 1005)
    -- NOTA: Esta implementação é simplificada. Uma versão de produção usaria uma tabela de sequências.
    SELECT IFNULL(MAX(CONVERT(SUBSTRING(ID_contrato, 10), UNSIGNED INTEGER)), 1000)
    INTO v_ultimo_id
    FROM Contrato WHERE SUBSTRING(ID_contrato, 5, 4) = v_ano;

    set v_novo_id_sequencial = v_ultimo_id + 1;
    set v_novo_id_contrato = CONCAT('CON-', v_ano, '-', v_novo_id_sequencial);

    RETURN v_novo_id_contrato;
END$$
DELIMITER ;

-- Para usar a função, você precisaria alterar a tabela Contrato para usar VARCHAR no ID
-- ALTER TABLE Contrato MODIFY ID_contrato VARCHAR(20) PRIMARY KEY;