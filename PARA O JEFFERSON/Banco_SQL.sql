create database AgroTech;

use AgroTech;

create table Agricultor (
	ID_agricultor int primary key auto_increment,
    nome varchar(255) not null,
    #Adição do CPF que estava no documento
    CPF varchar(11) unique not null,
    data_nascimento date not null,
    telefones_de_conato varchar(255) not null
);

select * from Agricultor;

create table Empreendimento(
	ID_empreendimento int primary key auto_increment,
    nome varchar(255) not null,
    finalidade varchar(255) not null,
    
	ID_agricultor_fk int not null,
    foreign key (ID_agricultor_fk) references Agricultor(ID_agricultor)
);

select * from Empreendimento;

create table Contrato (
	ID_contrato int primary key auto_increment,
    data_assinatura date not null,
    valor float not null,
    
    #Adicionei mais uma chave estrangeira para fazer ligação com o "Empreendimento"
    ID_agricultor_fk int not null,
    ID_empreendimento_fk int not null,
    foreign key (ID_agricultor_fk) references Agricultor(ID_agricultor),
    foreign key (ID_empreendimento_fk) references Empreendimento(ID_empreendimento)
);

select * from Contrato;

create table PropriedadeRural(
	ID_propriedade int primary key auto_increment,
    nome varchar(255) not null,
    localizacao varchar(255) not null,
    #Mudança de float para decimal na "area_total"
    area_total decimal(10,5) not null,
    
    ID_agricultor_fk int not null,
    foreign key (ID_agricultor_fk) references Agricultor(ID_agricultor)
);

select * from PropriedadeRural;

create table Sensor (
	ID_sensor int primary key auto_increment,
	fabricante varchar(255) not null,
    #Adição do "tipo"
    tipo enum('Umidade', 'pH', 'Temperatura', 'LuzSolar', 'Reservatorio') not null,
    
    ID_PropriedadeRural_fk int not null,
    foreign key (ID_PropriedadeRural_fk) references PropriedadeRural(ID_propriedade)
);

select * from Sensor;

create table Medicao (
	ID_medicao int primary key auto_increment,
    data_hora datetime not null,
    #Mudança de float para decimal no "valor"
    valor_medicao decimal(10,2) not null,
    
    ID_sensor_fk int not null,
    ID_propriedade_fk int not null,
    foreign key (ID_sensor_fk) references Sensor(ID_sensor),
    foreign key (ID_propriedade_fk) references PropriedadeRural(ID_propriedade)
);

select * from Medicao;

create table Reservatorio(
	ID_reservatorio int primary key auto_increment,
    #Mudança de float para decimal na "capacidade" e "nivel_atual"
    capacidade decimal(10,2) not null,
    nivel_atual decimal(10,2) not null,
    
    ID_propriedade_fk int not null,
    foreign key (ID_propriedade_fk) references PropriedadeRural(ID_propriedade)
);

select * from Reservatorio;

create table Zona(
	ID_zona int primary key auto_increment,
    nome varchar(255) not null,
    hectares decimal(10,2) not null,
    eficiencia decimal(5,2) not null,
    economia decimal(10,2) not null,
    
    ID_propriedade_fk int not null,
    foreign key (ID_propriedade_fk) references PropriedadeRural(ID_propriedade)
);

select * from Zona;

create table DecisaoIA (
	ID_decisao int primary key auto_increment,
    tipo varchar(255) not null,
    zona varchar(255) not null,
    descricao text not null,
    volume_economizado decimal(10,2) not null,
    confianca decimal(5,2) not null,
    data_hora datetime not null,
    
    ID_zona_fk int not null,
    foreign key (ID_zona_fk) references Zona(ID_zona)
);

select * from DecisaoIA;

create table Setor(
	ID_setor int primary key auto_increment,
    nome varchar(255) not null,
    cultura varchar(255) not null,
    umidade_atual decimal(5,2) not null,
    duracao_irrigacao int not null,
    ultima_irrigacao datetime not null,
    proxima_irrigacao datetime not null,
    
	ID_propriedade_fk int not null,
    foreign key (ID_propriedade_fk) references PropriedadeRural(ID_propriedade)
);

select * from Setor;

create table Irrigador(
	ID_irrigador int primary key auto_increment,
	nome varchar(255) not null,
    eficiencia_hidrica decimal(5,2) not null,
    economia decimal(10,2) not null,
    bateria decimal(5,2) not null,
    status_ enum('Ativo', 'Ocioso', 'Manutenção') not null,
    
    ID_zona_fk int not null,
    foreign key (ID_zona_fk) references Zona(ID_zona)
);

select * from Irrigador;

create table Cultura(
	ID_cultura int primary key auto_increment,
    nome varchar(255) not null,
    padroes_ml int not null,
    eficiencia decimal(5,2) not null,
    economia decimal(10,2) not null,
    statusIA enum('Otimizado', 'Aprendendo', 'Especialista') not null,
    
    ID_setor_fk int not null,
    foreign key (ID_setor_fk) references Setor(ID_setor)
);

select * from Cultura;