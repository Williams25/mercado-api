const http = require('http')
const port = process.env.PORT || 3000
const app = require('./app')

const server = http.createServer(app)
<<<<<<< HEAD
server.listen(port)
=======
server.listen(port, () => console.log(`http://localhost:${port}`))
>>>>>>> 9c581b5 (Adicionando variaveis de ambiente para conexão com o bando)
