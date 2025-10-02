use AgroTech;

update Irrigador
set status_ = 'Ativo'
where ID_irrigador = 4;

select * from Irrigador

update DecisaoIA
set tipo = 'Manutenção'
where ID_reservatorio = 2;

select * from DecisaoIA

update Cultura
set eficiencia = 91.6
where ID_cultura = 4;

select * from Cultura

update Agricultor
set telefones_de_conato='(61)98427-3883'
where ID_agricultor= 3;

select * from Agricultor

update Irrigador
set status_ = 'Manutenção'
where ID_irrigador = 8;

select * from Irrigador
