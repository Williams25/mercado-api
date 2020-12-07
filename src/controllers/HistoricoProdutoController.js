const mysql = require('../connection/mysql').pool
const data = require('../resources/Data')

module.exports = {

  async index(req, res) {
    const { id } = req.params

    mysql.getConnection((error, conn) => {
      if (error) return res.status(500).send({ error: error })

      conn.query({
        sql: 'SELECT SUM(total_produto) as total_compra FROM view_produto_cliente WHERE id_cliente = ?  AND ativo = ?',
        values: [id, '0']
      }, (err, result) => {

        if (err) return res.status(500).send({ error: err.message, response: 'Não foi encontrado nenhum dado' })

        if (result.length == 0) return res.status(404).send({ response: 'Não foi encontrado nenhum dado' })

        const total_compra = result[0].total_compra

        conn.query({
          sql: 'SELECT * FROM view_produto_cliente WHERE id_cliente = ?  AND ativo = ?',
          values: [id, '0',]
        }, (err, result) => {
          conn.release()
          if (err) return res.status(500).send({ error: err.message, response: 'Não foi encontrado nenhum dado' })

          if (result.length == 0) return res.status(404).send({ response: 'Não foi encontrado nenhum dado' })

          const response = {
            quantidade: result.length,
            total_compra: Intl.NumberFormat('pt-br', { style: 'currency', currency: 'BRL' }).format(total_compra),
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
        values: [id, '0']
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

  async update(req, res) {
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
      if (error) return res.status(500).send({ error: err.message })
      conn.query({
        sql: 'SELECT * FROM produto WHERE id = ?',
        values: [id]
      }, (err, result) => {
        if (err) return res.status(500).send({ error: err.message })

        if (result.length < 1) return res.status(404).send({ mensagem: "Produto não encontrado" })

        conn.query({
          sql: `UPDATE produto SET ativo = ?
                WHERE id = ?`,
          values: ['1', id]
        }, (err, result) => {
          conn.release()

          if (err) return res.status(500).send({ error: err.message })

          const response = {
            mensagem: 'Produto alterado',
          }

          return res.status(202).send(response)
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