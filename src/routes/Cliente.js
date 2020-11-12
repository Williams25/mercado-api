const express = require('express')
const routes = express.Router()

const ClienteController = require('../controllers/ClienteController')

routes.post('/login', ClienteController.login)
routes.get('/', ClienteController.index)
routes.get('/:id', ClienteController.findId)
routes.post('/', ClienteController.create)
routes.put('/', ClienteController.update)
routes.delete('/', ClienteController.delete)

module.exports = routes