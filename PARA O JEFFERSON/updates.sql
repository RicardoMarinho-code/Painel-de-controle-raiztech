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