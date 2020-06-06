const express = require('express')
const routes = express.Router()
const dataF = require('../resources/Data.js')
const ClienteController = require('../controllers/ClienteController')

routes.get('/', ClienteController.index)
routes.get('/:id', ClienteController.findId)
routes.post('/', ClienteController.create)
routes.put('/', ClienteController.update)
routes.delete('/', ClienteController.delete)

routes.post('/login', (req, res) => {
  const { usuario, senha } = req.headers
  return res.send({ usuario: usuario, senha: senha, data: dataF.formataData(dataF.formataDataBanco()) }).status(200)
})

module.exports = routes