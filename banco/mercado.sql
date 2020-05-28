CREATE DATABASE mercado;
USE mercado;
CREATE TABLE cliente(
	id INT NOT NULL AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    usuario VARCHAR(32) CHECK (usuario > 3),
    senha VARCHAR(32) CHECK (senha > 3),
    
    CONSTRAINT PK_CLIENTE PRIMARY KEY (id)
);
CREATE TABLE produto(
	id INT NOT NULL AUTO_INCREMENT,
    id_cliente INT NOT NULL,
    nome VARCHAR(100) NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
	quantidade INT NOT NULL,
    ativo BIT,
    
    CONSTRAINT PK_PRODUTO PRIMARY KEY (id, id_cliente),
    CONSTRAINT FK_CLIENTE_PRODUTO FOREIGN KEY (id_cliente) REFERENCES cliente (id)
);
/*
CREATE TABLE historico_compras(
	id INT NOT NULL AUTO_INCREMENT,
    id_produto INT NOT NULL,
    id_cliente INT NOT NULL,
    
	CONSTRAINT PK_CLIENTE PRIMARY KEY (id),
    CONSTRAINT FK_HISTORICO_COMPRAS_CLIENTE FOREIGN KEY (id_cliente) REFERENCES cliente (id),
    CONSTRAINT FK_HISTORICO_COMPRAS_PRODUTO FOREIGN KEY (id_produto) REFERENCES cliente (id)
);

drop table  historico_compras;
*/

SELECT * FROM produto;

INSERT INTO cliente (nome, usuario, senha) VALUES ('taty', 'tatysavio','taty2000'),
												  ('william', 'gabrielsouza','1999'),
                                                  ('spaike', 'pata','todos'),
                                                  ('tony', 'tonynaosei','122145');
                                                  
INSERT PRODUTO (id_cliente, nome, preco, quantidade, ativo) VALUES 	(3, 'banana', 2.99, 5, 1),
																	(1, 'pera', 5.99, 15, 0),
                                                                    (4, 'milka', 2.99, 2, 1),
                                                                    (2, 'm&m', 14.99, 11, 0),
                                                                    (3, 'fini', 2.99, 25, 1);
 
 
-- VIEW CLIENTE LOGIN
-- SELECT * FROM view_cliente_login WHERE usuario = '?' AND senha = '?';

CREATE VIEW view_cliente_login AS
 SELECT * FROM cliente;


-- VIEW PRODUTO / PRODUTOS ATIVOS E INATIVOS 
 SELECT * FROM view_produto_cliente WHERE id_cliente = ? AND ativo = ?;

 CREATE VIEW view_produto_cliente AS 
	SELECT  cliente.id as 'id_cliente', cliente.usuario, cliente.senha ,
		produto.id as 'id_produto', produto.nome, produto.preco, produto.quantidade, produto.quantidade * produto.preco as 'total_produto', produto.ativo 
        FROM produto
		INNER JOIN cliente ON cliente.id = produto.id_cliente;