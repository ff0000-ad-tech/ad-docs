const fs = require('fs')
const path = require('path')

function readDirR(dir) {
	return fs.statSync(dir).isDirectory()
		? Array.prototype.concat(...fs.readdirSync(dir).map(f => readDirR(path.join(dir, f))))
		: dir
}

module.exports = {
	readDirR
}
