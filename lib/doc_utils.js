const fs = require('fs')
const path = require('path')
const Handlebars = require('handlebars')

const readDirRecursive = dir => {
	return fs.statSync(dir).isDirectory()
		? Array.prototype.concat(...fs.readdirSync(dir).map(f => readDirRecursive(path.join(dir, f))))
		: dir
}

const hbCompile = (data, params) => Handlebars.compile(data.toString(), { noEscape: true })(params)

module.exports = {
	readDirRecursive,
	hbCompile
}
