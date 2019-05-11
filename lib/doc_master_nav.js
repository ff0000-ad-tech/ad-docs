'use strict'
const jsdoc2md = require('jsdoc-to-markdown')
const fs = require('fs')
const path = require('path')
const readDirR = require('./utils').readDirR

const basePath = `${__dirname}/../node_modules/@ff0000-ad-tech/`

// get just the repos first and filter to just the ad-[name] repos
const dir = fs
	.readdirSync(basePath)
	.filter(n => n.match(/ad\-/))
	.map(f => path.join(basePath, f))
// console.log(dir)

const groupedInputs = dir.map(base => {
	let obj = {
		name: base.replace(/.*-ad-tech\//, ''),
		files: []
	}
	// let files = []
	if (fs.existsSync(base + '/index.js')) {
		obj.files.push(base + '/index.js')
	}
	if (fs.existsSync(base + '/lib')) {
		const lib = readDirR(base + '/lib')
		obj.files = obj.files.concat(lib)
	}
	return obj
})

const config = `${__dirname}/../config.jsdoc.json`

fs.readFile(`${__dirname}/../docs/md/README.hbs`, (err, data) => {
	if (err) return console.error(err)

	const renderedOutputs = groupedInputs.map(obj => {
		// console.log(obj)
		const urlBase = `https://github.com/ff0000-ad-tech/${obj.name}`
		const header = `# <a href="${urlBase}">${obj.name}</a>`
		let output
		if (obj.files.length > 0) {
			// 	// console.log(repoName)
			const templateData = jsdoc2md.getTemplateDataSync({ files: obj.files, configure: config })
			// console.log(templateData)
			output = jsdoc2md.renderSync({
				data: templateData,
				template: data.toString(),
				helper: __dirname + '/helper.js'
			})

			output = output.replace(/(\[)([^\]]+)(\]\(#([^\)]+)\))/g, (full, a, b, c, d) => {
				// split to see if it is a method or property
				const split = d.split('.')
				let subPath = ''
				if (split.length > 1) {
					subPath = `#${d}`
				} else {
					// check 'd' for 'new_[name]_new' leading word
					split[0] = split[0].replace(/(new_)(.+)(_new)/, '$2')
				}

				return `<a href="${urlBase}/blob/master/docs/${split[0]}.md${subPath}">${b}</a>`
			})
		} else {
			output = ''
		}

		return header + output
	})

	const flattenedOutput = renderedOutputs.join('\n')

	fs.writeFileSync(path.resolve(`${__dirname}/../docs/`, `README.md`), flattenedOutput)
})
