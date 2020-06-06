const express = require('express')
const routes = express.Router()
const mysql = require('../connection/mysql').pool
const data = require('../resources/Data')

routes.get('/', (req, res) => {
  mysql.getConnection((error, conn) => {
    if (error) return res.status(500).send({ error: error })

    conn.query({
      sql: 'SELECT * FROM view_produto_cliente',
    }, (err, result) => {
      conn.release()

      if (err) return res.status(500).send({ error: err.message, response: 'Não foi encontrado nenhum dado' })

      if (result.length == 0) return res.status(404).send({ response: 'Não foi encontrado nenhum dado' })

      const response = {
        quantidade: result.length,
        produto: result.map((produto) => {
          return {
            id: produto.id_produto,
            nome: produto.nome,
            quantidade: produto.quantidade,
            preco: produto.preco,
            data_produto: data.formataData(produto.data_produto),
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


routes.get('/:id', async (req, res) => {
  const {id} = req.params.id
  mysql.getConnection((error, conn) => {
    if (error) return res.status(500).send({ error: error })

    conn.query({
      sql: 'SELECT * FROM view_produto_cliente WHERE id_produto = ?',
      values: [id]
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


routes.post("/", async (req, res) => {
  const { id_cliente, nome, preco, quantidade } = req.body

  mysql.getConnection((error, conn) => {
    if (error) return res.status(500).send({ error: error.message })
    conn.query({
      sql: 'SELECT * FROM view_cliente_login WHERE id = ?',
      values: [id_cliente]
    }, (err, result) => {
      conn.release()

      if (err) return res.status(500).send({ error: err.message })

      if (result.length < 1) return res.status(404).send({ mensagem: `Usuario não encontrado` })

      conn.query({
        sql: `INSERT INTO produto (id_cliente,nome,preco,quantidade,data_produto,ativo) 
                  VALUES (?,?,?,?,?,?)`,
        values: [id_cliente, nome, preco, quantidade, data.formataDataBanco(), 1]
      }, (err, result) => {
        if (err) return res.status(500).send({ error: err.message })

        const response = {
          mensagem: 'Produto inserido',
          produto: {
            id_cliente: id_cliente,
            nome: nome,
            preco: preco,
            quantidade: quantidade
          }
        }
        return res.status(201).send(response)
      })
    })
  })
})
module.exports = routes