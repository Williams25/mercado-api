const express = require('express');
const routes = express.Router()

// const mysql = require('../connection/mysql').pool // tirar isto dps de passar os metodos para o controller
const ClienteController = require('../controllers/ClienteController')

routes.get('/', ClienteController.index)
routes.get('/:id', ClienteController.findId)
routes.post('/', ClienteController.create)
routes.put('/', ClienteController.update)
routes.delete('/', ClienteController.delete)

module.exports = routes