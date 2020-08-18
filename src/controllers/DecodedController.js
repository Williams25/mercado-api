const jwt = require('jsonwebtoken')

module.exports = {
  async decodeToken(req, res) {
    const { token } = req.body
    // Metodo para descriptografar o token
    try {
      const decoded = jwt.decode(token, {complete: true})

      const decodeToken = {
        id: decoded.payload.id,
        nome: decoded.payload.nome,
        usuario: decoded.payload.usuario,
      }
      return res.status(200).send({ decodeToken })
    } catch (error) {
      return res.status(500)  
    }
  }
}