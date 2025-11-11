use AgroTech;

-- Consulta de verificação final
SELECT 'Dados inseridos com sucesso!' AS Status;

-- Contagens de verificação
SELECT COUNT(*) AS Total_Usuarios FROM Usuarios;
SELECT COUNT(*) AS Total_Agricultores FROM Agricultor;
SELECT COUNT(*) AS Total_Empreendimentos FROM Empreendimento;
SELECT COUNT(*) AS Total_Propriedades FROM PropriedadeRural;
SELECT COUNT(*) AS Total_Zonas FROM Zona;
SELECT COUNT(*) AS Total_Irrigadores FROM Irrigador;
SELECT COUNT(*) AS Total_Sensores FROM Sensor;
SELECT COUNT(*) AS Total_Medicoes FROM Medicao;
SELECT COUNT(*) AS Total_Setores FROM Setor;
SELECT COUNT(*) AS Total_Reservatorios FROM Reservatorio;
SELECT COUNT(*) AS Total_DecisoesIA FROM DecisaoIA;
SELECT COUNT(*) AS Total_Culturas FROM Cultura;
SELECT COUNT(*) AS Total_Contratos FROM Contrato;
SELECT COUNT(*) AS Total_Adms FROM Adm;
SELECT COUNT(*) AS Total_Funcionarios FROM Funcionarios;

-- Consulta exemplo sobre o usuario tentar ver relatorios:

SELECT EXISTS (
    SELECT 1
    FROM Usuario_Roles ur
    JOIN Role_Permissoes rp ON ur.role_id = rp.role_id
    JOIN Permissoes p ON rp.permissao_id = p.permissao_id
    WHERE 
        ur.ID_Usuario_fk = 'RZT001' -- Usuário logado
        AND p.nome_permissao = 'PODE_VER_RELATORIOS_IA'
) AS tem_permissao;

SELECT EXISTS (
    SELECT 1
    FROM Usuario_Roles ur
    JOIN Role_Permissoes rp ON ur.role_id = rp.role_id
    JOIN Permissoes p ON rp.permissao_id = p.permissao_id
    WHERE 
        ur.ID_Usuario_fk = 'FUN002' -- Usuário logado
        AND p.nome_permissao = 'PODE_VER_RELATORIOS_IA'
) AS tem_permissao;

-- Como tirar autoridade de um funcionario de ver certos dados

DELETE FROM Role_Permissoes
WHERE
    role_id = (SELECT role_id FROM Roles WHERE nome_role = 'Funcionario')
    AND permissao_id = (SELECT permissao_id FROM Permissoes WHERE nome_permissao = 'PODE_VER_SENSORES');

-- Select para o junin gostosao abaixo:

SELECT ID_Usuario, nome, email FROM Usuarios;