const fs = require('fs')
const path = require('path')
const Handlebars = require('handlebars')

const TAGS_PATH = `${__dirname}/../md/tags.hbs`
const CONFIG_PATH = `${__dirname}/../md/config.jsdoc.json`
const FAT_PATH = `${__dirname}/../node_modules/@ff0000-ad-tech/`

const readDirRecursive = dir => {
	return fs.statSync(dir).isDirectory()
		? Array.prototype.concat(...fs.readdirSync(dir).map(f => readDirRecursive(path.join(dir, f))))
		: dir
}

const hbCompile = (data, params) => Handlebars.compile(data.toString(), { noEscape: true })(params)

const mergeAndRepathHeaderLink = (src, basePath) => {
	return src.replace(/(<a\sname=")(.*)(">)(<\/a>)([^#])+(##.+)/gm, (full, a, b, c, d) => {
		return '## ' + a + b + `" href="${basePath}docs/` + b + '.md' + c + b + d
	})
}

module.exports = {
	readDirRecursive,
	hbCompile,
	mergeAndRepathHeaderLink,
	TAGS_PATH,
	CONFIG_PATH,
	FAT_PATH
}
