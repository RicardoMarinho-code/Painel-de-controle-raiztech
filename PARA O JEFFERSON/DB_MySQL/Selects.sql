use AgroTech;

-- Consulta de verificação final 
SELECT 'Dados inseridos com sucesso!' AS Status;

-- Contagens de verificação (queries de diagnóstico para validar a carga de dados)
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

-- Consulta de verificação de permissão (RBAC - Role-Based Access Control)
-- Propósito: Verificar se o usuário 'RZT001' possui a permissão 'PODE_VER_RELATORIOS_IA'.
-- Lógica:
-- 1. (ur) Encontra os papéis (roles) do usuário.
-- 2. (rp) Encontra as permissões desses papéis.
-- 3. (p) Filtra pelo nome da permissão desejada.
-- Otimização: `SELECT EXISTS` é usado por performance. Ele retorna '1' (true)
--            assim que encontra a primeira correspondência e para a execução.
SELECT EXISTS (
    SELECT 1
    FROM Usuario_Roles ur
    JOIN Role_Permissoes rp ON ur.role_id = rp.role_id
    JOIN Permissoes p ON rp.permissao_id = p.permissao_id
    WHERE 
        ur.ID_Usuario_fk = 'RZT19800722_8BDF08' -- ID do Usuário logado
        AND p.nome_permissao = 'PODE_VER_RELATORIOS_IA'
) AS tem_permissao;

-- Mesmo teste de permissão (RBAC), mas para o usuário 
SELECT EXISTS (
    SELECT 1
    FROM Usuario_Roles ur
    JOIN Role_Permissoes rp ON ur.role_id = rp.role_id
    JOIN Permissoes p ON rp.permissao_id = p.permissao_id
    WHERE 
        ur.ID_Usuario_fk = 'RZT20251111_39FBD6' -- ID do Usuário logado
        AND p.nome_permissao = 'PODE_VER_RELATORIOS_IA'
) AS tem_permissao;

-- Como tirar autoridade de um funcionario de ver certos dados

-- Gerenciamento de Permissão (RBAC)
-- Propósito: Revogar/Remover uma permissão de um papel (Role) inteiro.
-- Ação: Deleta o registro na tabela de junção 'Role_Permissoes' que liga
--       o papel 'Funcionario' à permissão 'PODE_VER_SENSORES'.
-- Resultado: A partir deste comando, nenhum usuário com o papel 'Funcionario'
--            terá mais essa permissão (a menos que possua outro papel que a conceda).
DELETE FROM Role_Permissoes
WHERE
    role_id = (SELECT role_id FROM Roles WHERE nome_role = 'Funcionario')
    AND permissao_id = (SELECT permissao_id FROM Permissoes WHERE nome_permissao = 'PODE_VER_SENSORES');

-- (Consulta simples de dados de usuário)
SELECT ID_Usuario, nome, email FROM Usuarios;