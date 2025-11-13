create database if not exists AgroTech;

use AgroTech;

create table Usuarios (
    ID_Usuario varchar(30) primary key,
    nome varchar(255) not null,
    senha varchar(255) not null,
    email varchar(255) unique not null,
    telefone varchar(15) not null
);

create table Agricultor (
	ID_agricultor int primary key auto_increment,
    CPF varchar(11) unique not null,
    data_nascimento date not null

    ID_Usuario_fk VARCHAR(30) NOT NULL UNIQUE,
    CONSTRAINT fk_Agricultor_Usuarios FOREIGN KEY (ID_Usuario_fk) REFERENCES Usuarios(ID_Usuario)
);

create table Empreendimento(
	ID_empreendimento int primary key auto_increment,
    nome varchar(255) not null,
    finalidade varchar(255) not null,
    
	ID_agricultor_fk int not null,
    foreign key (ID_agricultor_fk) references Agricultor(ID_agricultor)
);

create table Contrato (
	ID_contrato varchar(30) primary key,
    data_assinatura date not null,
    valor float not null,
    
    ID_agricultor_fk int not null,
    ID_empreendimento_fk int not null,
    foreign key (ID_agricultor_fk) references Agricultor(ID_agricultor),
    foreign key (ID_empreendimento_fk) references Empreendimento(ID_empreendimento)
);

create table PropriedadeRural(
	ID_propriedade int primary key auto_increment,
    nome varchar(255) not null,
    localizacao varchar(255) not null,
    area_total decimal(10,5) not null,
    
    ID_agricultor_fk int not null,
    foreign key (ID_agricultor_fk) references Agricultor(ID_agricultor)
);

create table Sensor (
	ID_sensor int primary key auto_increment,
	fabricante varchar(255) not null,
    #Adição do "tipo"
    tipo enum('Umidade', 'pH', 'Temperatura', 'LuzSolar', 'Reservatorio') not null,
    
    ID_PropriedadeRural_fk int not null,
    foreign key (ID_PropriedadeRural_fk) references PropriedadeRural(ID_propriedade)
);

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

create table Reservatorio(
	ID_reservatorio int primary key auto_increment,
    #Mudança de float para decimal na "capacidade" e "nivel_atual"
    capacidade decimal(10,2) not null,
    nivel_atual decimal(10,2) not null,
    
    ID_propriedade_fk int not null,
    foreign key (ID_propriedade_fk) references PropriedadeRural(ID_propriedade)
);

create table Zona(
	ID_zona int primary key auto_increment,
    nome varchar(255) not null,
    hectares decimal(10,2) not null,
    eficiencia decimal(5,2) not null,
    economia decimal(10,2) not null,
    
    ID_propriedade_fk int not null,
    foreign key (ID_propriedade_fk) references PropriedadeRural(ID_propriedade)
);

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

create table Funcionarios (
    ID_Funcionario int primary key auto_increment,
    cargo varchar(100),
    ID_Usuario_fk varchar(30) not null unique,
    constraint fk_Funcionarios_Usuarios foreign key (ID_Usuario_fk) references Usuarios(ID_Usuario)
);

create table ADM (
    ID_ADM int primary key auto_increment,
    nivel_permissao int,
    ID_Usuario_fk varchar(30) not null unique,
    constraint fk_ADM_Usuarios foreign key (ID_Usuario_fk) references Usuarios(ID_Usuario)
);

-- Essas 4 tabelas abaixo relacionadas a Roles e Permissõe dos usuários são relacionadas à tabela obrigatoria "grupos_usuarios"
-- acabei renomeando e separando-as por causa do tamanho e dimensão do nosso projeto.
create table Roles (
    role_id int AUTO_INCREMENT primary key,
    nome_role varchar(50) not null unique comment 'Ex: Admin, Agricultor, Funcionario'
);

create table Permissoes (
    permissao_id int AUTO_INCREMENT primary key,
    nome_permissao varchar(100) not null unique comment 'Ex: PODE_VER_FINANCEIRO, PODE_EDITAR_USUARIOS, PODE_VER_SENSORES'
);

create table Usuario_Roles (
    ID_Usuario_fk varchar(30) not null,
    role_id int not null,
    primary key (ID_Usuario_fk, role_id),
    foreign key (ID_Usuario_fk) references Usuarios(ID_Usuario),
    foreign key (role_id) references Roles(role_id)
);

create table Role_Permissoes (
    role_id int not null,
    permissao_id int not null,
    PRIMARY key (role_id, permissao_id),
    foreign key (role_id) references Roles(role_id),
    foreign key (permissao_id) references Permissoes(permissao_id)
);

create table Log_Contratos (
    ID_log int primary key auto_increment,
    ID_contrato_afetado varchar(20),
    data_acao datetime,
    acao_realizada varchar(50),
    valor_contrato float
);



