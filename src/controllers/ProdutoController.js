const mysql = require('../connection/mysql').pool
const data = require('../resources/Data')
const jwt = require('jsonwebtoken')

module.exports = {

  async index(req, res) {
    const { id } = req.params

    mysql.getConnection((error, conn) => {
      if (error) return res.status(500).send({ error: error })

      conn.query({
        sql: 'SELECT SUM(total_produto) as total_compra FROM view_produto_cliente WHERE id_cliente = ?  AND ativo = ?',
        values: [id, '1']
      }, (err, result) => {

        if (err) return res.status(500).send({ error: err.message, response: 'Não foi encontrado nenhum dado' })

        if (result.length == 0) return res.status(404).send({ response: 'Não foi encontrado nenhum dado' })

        const total_compra = result[0].total_compra

        conn.query({
          sql: 'SELECT * FROM view_produto_cliente WHERE id_cliente = ?  AND ativo = ?',
          values: [id, '1']
        }, (err, result) => {
          conn.release()
          if (err) return res.status(500).send({ error: err.message, response: 'Não foi encontrado nenhum dado' })

          if (result.length == 0) return res.status(404).send({ response: 'Não foi encontrado nenhum dado' })

          const response = {
            quantidade: result.length,
            total_compra: Intl.NumberFormat('pt-br', {style: 'currency', currency: 'BRL'}).format(total_compra),
            produto: result.map((produto) => {
              return {
                id: produto.id_produto,
                nome: produto.nome,
                quantidade: produto.quantidade,
                preco: produto.preco,
                data_produto: data.formataData(produto.data_produto),
                total_produto: produto.total_produto,
                ativo: produto.ativo,
                cliente: {
                  id_cliente: produto.id_cliente,
                  usuario: produto.usuario
                }
              }
            })
          }

          return res.status(200).send(response)
        })
      })
    })
  },

  async findId(req, res) {
    const { id } = req.params

    mysql.getConnection((error, conn) => {
      if (error) return res.status(500).send({ error: error })

      conn.query({
        sql: 'SELECT * FROM view_produto_cliente WHERE id_produto = ? AND ativo = ?',
        values: [id, '1']
      }, (err, result) => {
        conn.release()

        if (err) return res.status(500).send({ error: err.message, response: `Não foi encontrado nenhum produto com id ${id}` })

        if (result.length == 0) return res.status(404).send({ response: `Não foi encontrado nenhum produto com id ${id}` })

        const response = {
          produto: result.map((produto) => {
            return {
              id: produto.id_produto,
              nome: produto.nome,
              quantidade: produto.quantidade,
              preco: produto.preco,
              data_produto: data.formataData(produto.data_produto),
              total_produto: produto.total_produto,
              ativo: produto.ativo,
              cliente: {
                id_cliente: produto.id_cliente,
                usuario: produto.usuario
              }
            }
          })
        }

        return res.status(200).send(response)
      })
    })
  },

  async create(req, res) {
    const { id_cliente, nome, preco, quantidade } = req.body

    if (!id_cliente || !nome || !preco || !quantidade) return res.status(500).send({
      mensagem: 'Campos invalidos',
      body: {
        required: {
          id_cliente: 'Int',
          nome: 'String',
          preco: 'Double',
          quantidade: 'Int'
        }
      }
    })

    mysql.getConnection((error, conn) => {
      if (error) return res.status(500).send({ error: error.message })
      conn.query({
        sql: 'SELECT * FROM view_cliente_login WHERE id = ?',
        values: [id_cliente]
      }, (err, result) => {

        if (err) return res.status(500).send({ error: err.message })

        if (result.length < 1) return res.status(404).send({ mensagem: `Usuario não encontrado` })

        conn.query({
          sql: `INSERT INTO produto (id_cliente,nome,preco,quantidade,data_produto,ativo) 
                    VALUES (?,?,?,?,?,?)`,
          values: [id_cliente, nome, preco, quantidade, data.formataDataBanco(), 1]
        }, (err, result) => {
          conn.release()

          if (err) return res.status(500).send({ error: err.message })

          const response = jwt.sign({
            produto: {
              id_cliente: id_cliente,
              nome: nome,
              preco: preco,
              quantidade: quantidade
            }
          }, 'process.env.JWT_KEY', { expiresIn: '5h' })

          return res.status(201).send({ mensagem: 'Produto cadastrado', token: response })
        })
      })
    })
  },

  async update(req, res) {
    const { nome, quantidade, preco, id } = req.body
    console.log(nome, quantidade, preco, id)

    if (!id || !nome || !preco || !quantidade) return res.status(500).send({
      mensagem: 'Campos invalidos',
      body: {
        required: {
          id: 'Int',
          nome: 'String',
          preco: 'Double',
          quantidade: 'Int'
        }
      }
    })

    mysql.getConnection((error, conn) => {
      if (error) return res.status(500).send({ error: err.message })
      conn.query({
        sql: 'SELECT * FROM produto where  id= ?',
        values: [id]
      }, (err, result) => {
        if (err) return res.status(500).send({ error: err.message })

        if (result.length < 1) return res.status(404).send({ mensagem: "Produto não encontrado" })
        conn.query({
          sql: `UPDATE produto SET nome = ?,
                                   quantidade = ?,
                                   preco = ?
                WHERE id = ?`,
          values: [nome, quantidade, preco, id]
        }, (err, result) => {
          conn.release()

          if (err) return res.status(500).send({ error: err.message })

          const response = {
            mensagem: 'Produto alterado',
            produto: {
              id: id,
              nome: nome,
              quantidade: quantidade,
              preco: preco,
            }
          }

          return res.status(202).send(response)
        })
      })
    })
  },

  async updateAtivo(req, res) {
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
        sql: 'SELECT * FROM produto WHERE id = ?',
        values: [id]
      }, (err, result) => {
        if (err) return res.status(500).send({ error: err.message })

        if (result.length == 0) return res.status(404).send({ mensagem: `Não encontrado` })

        conn.query({
          sql: 'UPDATE produto SET ativo = ? WHERE id = ?',
          values: ['0', id]
        }, (err, result) => {
          conn.release()

          if (err) return res.status(500).send({ error: err.message })

          return res.status(200).send({ mensagem: 'Produto alterado' })
        })
      })
    })
  },

  async delete(req, res) {
    const { id } = req.params

    mysql.getConnection((error, conn) => {
      if (error) return res.status(500).send({ error: error })

      conn.query({
        sql: 'SELECT * FROM produto WHERE id = ?',
        values: [id]
      }, (err, result) => {
        if (err) return res.status(500).send({ error: err.message })

        if (result.length == 0) return res.status(404).send({ mensagem: `Não encontrado` })

        conn.query({
          sql: 'DELETE FROM produto WHERE id = ?',
          values: [id]
        }, (err, result) => {
          conn.release()

          if (err) return res.status(500).send({ error: err.message })

          return res.status(200).send({ mensagem: 'Produto apagado' })
        })
      })
    })
  }
}