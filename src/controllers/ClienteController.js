const mysql = require('../connection/mysql').pool
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

module.exports = {

	async login(req, res) {
		const { usuario, senha } = req.headers

		if (!usuario || !senha) return res.status(500).send({
			mensagem: 'Campos invalidos',
			headers: {
				required: {
					usuario: 'String',
					senha: 'String'
				}
			}
		})

		mysql.getConnection((err, conn) => {
			if (err) return res.status(500).send({ error: err.message })

			conn.query({
				sql: `SELECT * FROM cliente WHERE usuario = ?`,
				values: [usuario]
			}, (err, results) => {
				conn.release()

				if (err) return res.status(500).send({ error: err.message })

				if (results.length < 1) return res.status(401).send({ mensagem: 'Falha na autenticação' })

				bcrypt.compare(senha, results[0].senha, (err, result) => {
					if (err) return res.status(401).send({ mensagem: 'Falha na autenticação' })

					if (result) {
						const token = jwt.sign({
							id: results[0].id,
							nome: results[0].nome,
							usuario: results[0].usuario
						}, 'process.env.JWT_KEY', { expiresIn: '5h' })

						return res.status(200).send({ mensagem: 'Autenticado com sucesso', token: token })
					}

					return res.status(401).send({ mensagem: 'Falha na autenticação' })
				})
			})
		})
	},

	async index(req, res) {
		mysql.getConnection((error, conn) => {
			if (error) return res.status(500).send({ error: error })
			conn.query({
				sql: 'SELECT * FROM view_cliente_login'
			}, (err, result) => {
				conn.release()

				if (err) return res.status(500).send({ error: err.message, response: `Não foi encontrado nenhum usuario` })

				if (result.length == 0) return res.status(404).send({ response: `Não foi encontrado nenhum usuario` })

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
		const { id } = req.params

		mysql.getConnection((error, conn) => {
			if (error) return res.status(500).send({ error: error })

			conn.query({
				sql: 'SELECT * FROM view_cliente_login WHERE id = ?',
				values: [id]
			}, (err, result) => {
				conn.release()

				if (err) return res.status(500).send({ error: err.message, response: `Não foi encontrado nenhum usuario` })

				if (result.length == 0) return res.status(404).send({ response: `Não foi encontrado nenhum usuario` })

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
		const { nome, usuario, senha } = req.body

		if (!nome || !usuario || !senha) return res.status(500).send({
			mensagem: 'Campos invalidos',
			body: {
				required: {
					nome: 'String',
					usuario: 'String',
					senha: 'String'
				}
			}
		})

		mysql.getConnection((error, conn) => {
			if (error) return res.status(500).send({ error: error })

			conn.query({
				sql: 'SELECT * FROM view_cliente_login WHERE usuario = ?',
				values: [usuario]
			}, (err, result) => {
				if (err) return res.status(500).send({ error: err.message, response: null })

				if (result.length > 0) return res.status(203).send({ mensagem: `Usuario ${req.body.usuario} já utilizado` })

				bcrypt.hash(req.body.senha, 10, (err, hash) => {
					if (err) return res.status(500).send({ error: err.message })

					conn.query({
						sql: `INSERT INTO CLIENTE (nome, usuario, senha)	VALUES (?,?,?)`,
						values: [nome, usuario, hash]
					}, (err, result) => {
						conn.release()

						if (err) return res.status(500).send({ error: err.message })

						const response = jwt.sign({
							cliente: {
								nome: nome,
								usuario: usuario,
								senha: senha,
							}
						}, 'process.env.JWT_KEY', { expiresIn: '5h' })

						return res.status(201).send({ mensagem: 'Cadastrado com sucesso', token: response })
					})
				})
			})
		})
	},

	async update(req, res) {
		const { nome, usuario, senha, id } = req.body

		if (!nome || !usuario || !senha || !id) return res.status(500).send({
			mensagem: 'Campos invalidos',
			body: {
				required: {
					id: 'Int',
					nome: 'String',
					usuario: 'String',
					senha: 'String'
				}
			}
		})

		mysql.getConnection((error, conn) => {
			if (error) return res.status(500).send({ error: error })

			conn.query({
				sql: 'SELECT * FROM view_cliente_login WHERE id = ?',
				values: [id]
			}, (err, result) => {
				if (err) return res.status(500).send({ error: err.message })

				if (result.length < 1) return res.status(404).send({ mensagem: `Não encontrado` })

				bcrypt.hash(senha, 10, (err, hash) => {
					if (err) return res.status(500).send({ error: err.message })

					conn.query({
						sql: `UPDATE cliente SET nome = ?, 
																	usuario = ?,
																	senha = ?
								WHERE id = ?`,
						values: [nome, usuario, hash, id]
					}, (err, result) => {
						if (err) return res.status(500).send({ error: err.message })

						const response = jwt.sign({
							cliente: {
								id: id,
								nome: nome,
								usuario: usuario,
								senha: senha,
							}
						}, 'process.env.JWT_KEY', { expiresIn: '5h' })

						return res.status(202).send({ mensagem: 'Usuario alterado', token: response })
					})
				})
			})
		})
	},

	async delete(req, res) {
		const { id } = req.body

		if (!id) return res.status(500).send({
			mensagem: 'Campos invalidos',
			body: {
				required: {
					id: 'Int',
				}
			}
		})

		mysql.getConnection((error, conn) => {
			if (error) return res.status(500).send({ error: error })

			conn.query({
				sql: 'SELECT * FROM cliente WHERE id = ?',
				values: [id]
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
						conn.release()
						if (err) return res.status(500).send({ error: err.message })

						return res.status(200).send({ mensagem: 'Usuario apagado' })
					})
				})
			})
		})
	}
}