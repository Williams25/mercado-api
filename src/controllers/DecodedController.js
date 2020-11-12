const jwt = require('jsonwebtoken')

module.exports = {
  async decodeToken(req, res) {
    const { token } = req.body
<<<<<<< HEAD
<<<<<<< HEAD
    // Metodo para descriptografar o token
=======

>>>>>>> 9c581b5 (Adicionando variaveis de ambiente para conexão com o bando)
=======
    // Metodo para descriptografar o token
>>>>>>> 51dcdd0a03500127903cd8a3535f980006497540
    try {
      const decoded = jwt.decode(token, {complete: true})

      const decodeToken = {
        id: decoded.payload.id,
        nome: decoded.payload.nome,
        usuario: decoded.payload.usuario,
      }
<<<<<<< HEAD
<<<<<<< HEAD
=======

>>>>>>> 9c581b5 (Adicionando variaveis de ambiente para conexão com o bando)
=======
>>>>>>> 51dcdd0a03500127903cd8a3535f980006497540
      return res.status(200).send({ decodeToken })
    } catch (error) {
      return res.status(500)  
    }
  }
}