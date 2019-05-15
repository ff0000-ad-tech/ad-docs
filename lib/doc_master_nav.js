'use strict'
const jsdoc2md = require('jsdoc-to-markdown')
const fs = require('fs')
const path = require('path')
const docUtils = require('./doc_utils.js')
const readDirRecursive = docUtils.readDirRecursive
const mergeAndRepathHeaderLink = docUtils.mergeAndRepathHeaderLink

// get just the repos first and filter to just the ad-[name] repos
const dir = fs
	.readdirSync(docUtils.FAT_PATH)
	.filter(n => n.match(/ad\-/))
	.map(f => path.join(docUtils.FAT_PATH, f))
// console.log(dir)

const groupedInputs = dir.map(base => {
	let obj = {
		name: base.replace(/.*-ad-tech\//, ''),
		files: [],
		api: null
	}
	if (fs.existsSync(base + '/md/api.hbs')) {
		obj.api = base + '/md/api.hbs'
	} else {
		// TODO optimize by calling only once
		obj.api = __dirname + '/../md/fromClasses.hbs'
	}
	// let files = []
	if (fs.existsSync(base + '/index.js')) {
		obj.files.push(base + '/index.js')
	}
	if (fs.existsSync(base + '/lib')) {
		const lib = readDirRecursive(base + '/lib')
		obj.files = obj.files.concat(lib)
	}
	// console.log(obj)
	return obj
})

const renderedOutputs = groupedInputs.map(obj => {
	return new Promise((resolve, reject) => {
		const urlBase = `https://github.com/ff0000-ad-tech/${obj.name}`
		const header = `# <a href="${urlBase}">${obj.name}</a>`

		let finalOutput
		if (obj.files.length > 0) {
			fs.readFile(obj.api, (err, apiData) => {
				if (err) reject(err)

				const templateData = jsdoc2md.getTemplateDataSync({ files: obj.files, configure: docUtils.CONFIG_PATH })
				// console.log(templateData)

				let output = jsdoc2md.renderSync({
					data: templateData,
					template: apiData.toString(),
					helper: __dirname + '/helper.js'
				})

				// remap the links
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

				// convert the class/module name and blank link to proper link
				output = mergeAndRepathHeaderLink(output, `${urlBase}/blob/master/`)

				// indent the classes and properties/methods to sub each package
				output = output.replace(/(\*|##)\s\<a\s/g, full => `> ${full}`)

				// adds collapsable tags if there is package content
				const hasOutput = output.length > 0
				const collapseStart = hasOutput ? `\n\n<details><summary>Package Contents</summary>\n\n` : ''
				const collapseEnd = hasOutput ? `\n</details>\n` : ''

				resolve(header + collapseStart + output + collapseEnd)
			})
		} else {
			resolve(header)
		}
	})
})

Promise.all(renderedOutputs).then(results => {
	const flattenedOutput = results.join('\n')
	fs.writeFileSync(path.resolve(`${__dirname}/../docs/`, `README.md`), flattenedOutput)
})
