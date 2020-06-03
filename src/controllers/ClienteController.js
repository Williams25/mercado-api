const mysql = require('../connection/mysql').pool

module.exports = {

	async index(req, res) {
		mysql.getConnection((error, conn) => {
			if (error) return res.status(500).send({ error: error })

			conn.query({
				sql: 'SELECT * FROM view_cliente_login'
			}, (err, result) => {
				conn.release()

				if (err) return res.status(500).send({ error: err.message, response: `Não foi encontrado nenhum cliente` })

				if (result.length == 0) return res.status(404).send({ response: `Não foi encontrado nenhum cliente` })

				const response = {
					quantidade: result.length,
					cliente: result.map((cliente) => {
						return {
							id: cliente.id,
							nome: cliente.nome,
							usuario: cliente.usuario,
							senha: cliente.senha
						}
					})
				}

				return res.status(200).send(response)
			})
		})
	},

	async findId(req, res) {
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
	},

	async create(req, res) {
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
	},

	async update(req, res) {
		mysql.getConnection((error, conn) => {
			if (error) return res.status(500).send({ error: error })

			conn.query({
				sql: 'SELECT * FROM view_cliente_login WHERE id = ?',
				values: [req.body.id]
			}, (err, result) => {
				if (err) return res.status(500).send({ error: err.message })

				if (result.length < 1) return res.status(404).send({ mensagem: `Não encontrado` })

				conn.query({
					sql: `UPDATE cliente SET nome = ?, 
																usuario = ?,
																senha = ?
							WHERE id = ?`,
					values: [req.body.nome, req.body.usuario, req.body.senha, req.body.id]
				}, (err, result) => {
					if (err) return res.status(500).send({ error: err.message })

					const response = {
						mensagem: 'Cliente alterado',
						cliente: {
							id: req.body.id,
							nome: req.body.nome,
							usuario: req.body.usuario,
							senha: req.body.senha,
						}
					}

					return res.status(202).send(response)
				})
			})
		})
	},

	async delete(req, res) {
		mysql.getConnection((error, conn) => {
			if (error) return res.status(500).send({ error: error })

			conn.query({
				sql: 'SELECT * FROM cliente WHERE id = ?',
				values: [req.body.id]
			}, (err, result) => {
				if (err) return res.status(500).send({ error: err.message })

				if (result.length == 0) return res.status(404).send({ mensagem: `Não encontrado` })

				conn.query({
					sql: 'DELETE FROM produto WHERE id_cliente = ?',
					values: [req.body.id]
				}, (err, result) => {
					if (err) return res.status(500).send({ error: err.message })

					conn.query({
						sql: 'DELETE FROM cliente WHERE id = ?',
						values: [req.body.id]
					}, (err, result) => {
						if (err) return res.status(500).send({ error: err.message })

						return res.status(200).send({ mensagem: 'Cliente apagado' })
					})
				})
			})
		})
	}
}