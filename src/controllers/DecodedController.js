const jwt = require('jsonwebtoken')

module.exports = {
  async decodeToken(req, res) {
    const { token } = req.body
<<<<<<< HEAD
    // Metodo para descriptografar o token
=======

>>>>>>> 9c581b5 (Adicionando variaveis de ambiente para conexão com o bando)
    try {
      const decoded = jwt.decode(token, {complete: true})

      const decodeToken = {
        id: decoded.payload.id,
        nome: decoded.payload.nome,
        usuario: decoded.payload.usuario,
      }
<<<<<<< HEAD
=======

>>>>>>> 9c581b5 (Adicionando variaveis de ambiente para conexão com o bando)
      return res.status(200).send({ decodeToken })
    } catch (error) {
      return res.status(500)  
    }
  }
}