create database Logout;
use logout;

create table usuario(
id int auto_increment primary key,
nome varchar(150) not null,
email varchar(255) unique not null,
senha_hash varchar (255) not null,
criado_em datetime default current_timestamp
);

create table sessoes(
id int auto_increment primary key,
usuario_id int not null,
token varchar(512) unique not null,
ip_adress varchar (45),
user_agent text,
criado_em datetime default current_timestamp,
expira_em datetime not null,
encerrado_em datetime,
status varchar(20) default 'ativa',
foreign key (usuario_id) references usuario(id) on delete cascade
);

create table log_logout(
id int auto_increment primary key,
sessao_id int not null,
motivo varchar(50) default 'manual',
ip_adress varchar(45),
logout_em datetime default current_timestamp,
foreign key (sessao_id) references sessoes(id)
);

create index idx_sessoes_token on sessoes(token);
create index idx_sessoes_usuario on sessoes(usuario_id);
create index idx_sessoes_status on sessoes(status);
create index idx_log_logout_sessao on log_logout(sessao_id);

