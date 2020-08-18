const express = require('express')
const routes = express.Router()

const decoded = require('../controllers/DecodedController')

routes.post('/', decoded.decodeToken)

module.exports = routes