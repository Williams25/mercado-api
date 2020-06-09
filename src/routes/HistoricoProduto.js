const express = require('express')
const routes = express.Router()

const HistoricoProdutoController = require('../controllers/HistoricoProdutoController')

routes.get('/lista/:id', HistoricoProdutoController.index)
routes.get('/:id', HistoricoProdutoController.findId)
routes.put('/', HistoricoProdutoController.update)
routes.delete('/', HistoricoProdutoController.delete)

module.exports = routes