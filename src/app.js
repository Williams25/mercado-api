const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')

app.use(morgan('dev')) // Monitora as requisições http
app.use(bodyParser.urlencoded({ extended: false })) // apenas dados simples
app.use(bodyParser.json()) 

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*') // configurando cors
    res.header('Access-Control-Allow-Headers', 
    'Origin, X-Requested-With, Content-Type, Accept, Authorization')

    if(req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
        return res.status(200).send({})
    }
    next()
})

// 
//

app.use((req, res, next) => {
    const erro = new Error('Não encontrado');
    erro.status = 404;
    next(erro);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    return res.send({
        erro: {
            mensagem: error.message
        }
    })
})


module.exports = app