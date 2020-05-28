const moment = require('moment').utc

module.exports = {
	formataData(data) {
		return moment(`${data}`, 'YYYY-MM-DD').format('DD/MM/YYYY')
	},
	formataDataBanco() {
		return `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`
	}
}
