const express = require('express')
const routes = express.Router()

const mysql = require('../connection/mysql').pool

routes.get('/', (req, res) => {
  mysql.getConnection((error, conn) => {
    if (error) return res.status(500).send({ error: error })

    conn.query({
      sql: 'SELECT * FROM produto',
    }, (err, result) => {
      conn.release()
      if (err) return res.status(500).send({ error: err.message, response: 'Não foi encontrado nenhum dado' })
      if (result.length == 0) return res.status(404).send({ response: 'Não foi encontrado nenhum dado' })

      const response = {
        quantidade: result.length,
        produto: result.map((produto) => {
          return {
            id: produto.id,
            id_cliente: produto.id_cliente,
            nome: produto.nome,
            quantidade: produto.quantidade,
            ativo: produto.ativo
          }
        })
      }

      return res.status(200).send(response)
    })
  })
})


routes.get('/:id', async (req, res) => {
  const id = req.params.id

  mysql.getConnection((error, conn) => {
    if (error) return res.status(500).send({ error: error })

    conn.query({
      sql: 'SELECT * FROM produto WHERE id=?',
      values: [id]
    }, (err, result) => {
      conn.release()
      if (err) return res.status(500).send({ error: err.message, response: 'Não foi encontrado nenhum dado' })
      if (result.length == 0) return res.status(404).send({ response: 'Não foi encontrado nenhum dado' })

      const response = {
        produto: result.map((produto) => {
          return {
            id: produto.id,
            id_cliente: produto.id_cliente,
            nome: produto.nome,
            quantidade: produto.quantidade,
            ativo: produto.ativo
          }
        })
      }

      return res.status(200).send(response)
    })
  })
})

module.exports = routes