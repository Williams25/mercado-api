const mysql = require('mysql')

var pool = mysql.createPool({
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
}

exports.pool = pool