const mysql = require('mysql')

var pool = mysql.createPool({
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
}

exports.pool = pool