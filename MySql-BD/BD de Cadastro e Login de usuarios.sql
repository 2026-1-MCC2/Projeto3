create database sistema_usuarios;
use sistema_usuarios;
create table usuarios (
id int auto_increment primary key ,
nome varchar(100) not null,
email varchar(150) not null unique,
senha varchar(255) not null,
criado_em timestamp default current_timestamp,
atualizado_em timestamp default current_timestamp on update current_timestamp,
ativo boolean default true);

insert into usuarios (nome,email,senha)
values ('João Silva','joao@email.com','$2b$10$hashGeradoPelaBibliotecaBcrypt');

select id,nome,email
from usuarios
where email = 'joao@email.com'
and ativo = true;


create index idx_email on usuarios(email);

create table sessoes(
id int auto_increment primary key,
usuario_id int not null,
token varchar(255) not null unique,
expira_em datetime not null,
criado_em timestamp default current_timestamp,
foreign key (usuario_id) references usuarios(id) on delete cascade);

update usuarios
set senha = '$2b$10$novoHashBcrypt'
where email = 'joao@email.com';

update usuarios set ativo = false where id = 1;

select id,nome,email, criado_em from usuarios where ativo= true;



