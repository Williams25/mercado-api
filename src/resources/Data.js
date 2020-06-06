const moment = require('moment').utc

module.exports = {
	formataData(data) {
		return moment(data).format('DD/MM/YYYY')
	},
	formataDataBanco() {
		return new Date()
	}
}
