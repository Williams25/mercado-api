const express = require('express');
const routes = express.Router()

const mysql = require('../connection/mysql').pool // tirar isto dps de passar os metodos para o controller
const ClienteController = require('../controllers/ClienteController')

routes.get('/', ClienteController.index)

routes.get('/:id', async (req, res) => {
	const id = req.params.id

	mysql.getConnection((error, conn) => {
		if (error) return res.status(500).send({ error: error })

		conn.query({
			sql: 'SELECT * FROM view_cliente_login WHERE id = ?',
			values: [id]
		}, (err, result) => {
			conn.release()

			if (err) return res.status(500).send({ error: err.message, response: `Não foi encontrado nenhum cliente com id ${id}` })

			if (result.length == 0) return res.status(404).send({ response: `Não foi encontrado nenhum cliente com id ${id}` })

			const response = {
				cliente:
					result.map((cliente) => {
						return {
							id: cliente.id,
							nome: cliente.nome,
							usuario: cliente.usuario,
							senha: cliente.senha,
						}
					})
			}

			return res.status(200).send(response)
		})
	})
})

routes.post('/', async (req, res) => {
	mysql.getConnection((error, conn) => {
		if (error) return res.status(500).send({ error: error })

		conn.query({
			sql: 'SELECT * FROM view_cliente_login WHERE usuario = ?',
			values: [req.body.usuario]
		}, (err, result) => {
			if (err) return res.status(500).send({ error: err.message, response: null })

			let usuario // ARMAZENA CLIENTE.USUARIO PARA FAZER A VERIFICAÇÃO

			{
				cliente: result.map((cliente) => {
					return {
						usuario: usuario = cliente.usuario
					}
				})
			}

			if (usuario == req.body.usuario) return res.status(203).send({ mensagem: `Usuario ${req.body.usuario} já utilizado` })

			conn.query({
				sql: `INSERT INTO CLIENTE (nome, usuario, senha)	VALUES (?,?,?)`,
				values: [req.body.nome, req.body.usuario, req.body.senha]
			}, (err, result) => {
				conn.release()

				const response = {
					mensagem: 'Cadastrado com sucesso',
					cliente: {
						nome: req.body.nome,
						usuario: req.body.usuario,
						senha: req.body.senha
					}
				}

				return res.status(201).send(response)
			})
		})

	})
})

module.exports = routes