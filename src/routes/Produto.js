const express = require('express')
const routes = express.Router()

const ProdutoController = require('../controllers/ProdutoController')

routes.get('/lista/:id', ProdutoController.index)
routes.get('/:id', ProdutoController.findId)
routes.post('/', ProdutoController.create)
routes.put('/', ProdutoController.update)
routes.put('/ativo', ProdutoController.updateAtivo)
routes.delete('/:id', ProdutoController.delete)

module.exports = routes