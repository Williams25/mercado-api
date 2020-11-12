const mysql = require('mysql')

var pool = mysql.createPool({
<<<<<<< HEAD
    "user": "root",
    "password": "",
    "database": "mercado",
    "host": "localhost",
    "port": 3306
})

exports.execute = (query, params=[]) => {
    return new Promise((resolve, reject) => {
        pool.query(query, params, (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
=======
	"user": process.env.USER,
	"password": process.env.PASSWORD,
	"database": process.env.DATABASE,
	"host": process.env.HOST,
	"port": process.env.PORT
})

exports.execute = (query, params = []) => {
	return new Promise((resolve, reject) => {
		pool.query(query, params, (err, result) => {
			if (err) {
				reject(err)
			} else {
				resolve(result)
			}
		})
	})
>>>>>>> 9c581b5 (Adicionando variaveis de ambiente para conexão com o bando)
}

exports.pool = pool