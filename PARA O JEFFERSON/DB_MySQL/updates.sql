USE AgroTech;

UPDATE Usuarios 
SET telefone = '(11) 98888-7777' 
WHERE email = 'maria.costa@email.com'; 


UPDATE ADM 
SET nivel_permissao = 2 
WHERE ID_Usuario_fk = (SELECT ID_Usuario FROM Usuarios WHERE email = 'admin@agrotech.com'); 

UPDATE Funcionarios 
SET cargo = 'Suporte Técnico Sênior' 
WHERE ID_Usuario_fk = (SELECT ID_Usuario FROM Usuarios WHERE email = 'suporte@agrotech.com');

UPDATE Empreendimento 
SET finalidade = 'Produção de grãos orgânicos com irrigação de precisão' 
WHERE ID_empreendimento = 1;

UPDATE PropriedadeRural 
SET area_total = 130.00 
WHERE ID_propriedade = 1;

UPDATE Sensor 
SET fabricante = 'SensorTech Global' 
WHERE ID_sensor = 1;

UPDATE Zona 
SET hectares = 26.00 
WHERE ID_zona = 1;

UPDATE Irrigador 
SET status_ = 'Manutenção' 
WHERE ID_irrigador = 1;

UPDATE Setor 
SET cultura = 'Milho Híbrido Premium' 
WHERE ID_setor = 1;

UPDATE Cultura 
SET statusIA = 'Especialista' 
WHERE ID_cultura = 1;