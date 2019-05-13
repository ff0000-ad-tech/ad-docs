'use strict'
const jsdoc2md = require('jsdoc-to-markdown')
const path = require('path')
const fs = require('fs')
const util = require('util')
fs.readFileAsync = util.promisify(fs.readFile)
const docUtils = require('./doc_utils.js')
const hbCompile = docUtils.hbCompile

const TAGS_PATH = `${__dirname}/../md/tags.hbs`
const CONFIG_PATH = `${__dirname}/../md/config.jsdoc.json`

async function createMarkdownFromClasses(packageName, outputDir, api, readme) {
	console.log('createMarkdownFromClasses()', outputDir, api, readme)

	const { outputDocsDir, templateData } = setup(outputDir, true)

	// reduce templateData to an array of class names
	const classNames = templateData.reduce((classNames, identifier) => {
		if (identifier.kind === 'class') classNames.push(identifier.name)
		return classNames
	}, [])

	// create a documentation file for each class
	for (const className of classNames) {
		const template = `{{#class name="${className}"}}{{>docs}}{{/class}}`
		const output = jsdoc2md.renderSync({ data: templateData, template: template })
		fs.writeFileSync(path.resolve(outputDocsDir, `${className}.md`), output)
	}

	const apiData = await fs.readFileAsync(api)

	// create the main README
	let apiOutput = jsdoc2md.renderSync({
		data: templateData,
		template: apiData.toString(),
		helper: __dirname + '/helper.js'
	})

	apiOutput = apiOutput.replace(/(<a\sname=")(.*)(">)(<\/a>)([^#])+(##.+)/gm, (full, a, b, c, d) => {
		return '## ' + a + b + '" href="./docs/' + b + '.md' + c + b + d
	})

	// use to convert links from page scroll to nav to other md files
	apiOutput = apiOutput.replace(/(\[)([^\]]+)(\]\(#([^\)]+)\))/g, (full, a, b, c, d) => {
		// split to see if it is a method or property
		const split = d.split('.')
		return split.length > 1 ? `<a href="./docs/${split[0]}.md#${d}">${b}</a>` : b
	})

	// use to simply remove the links
	// const delink = removeVisibleHeader.replace(/(\[)([^\]]+)(\]\(#[^\)]+\))/g, (full, a, b, c) => b)

	const hbsRendered = await prepReadme(packageName, readme)

	// render the api inside the README
	const combinedOutput = hbCompile(hbsRendered, { api: apiOutput })

	fs.writeFileSync(path.resolve(outputDir, `README.md`), combinedOutput)
}

async function prepReadme(packageName, readme) {
	const [tagsData, readmeData] = await Promise.all([fs.readFileAsync(TAGS_PATH), fs.readFileAsync(readme)])
	const tagsRendered = hbCompile(tagsData, { name: packageName })
	return tagsRendered + readmeData.toString()
}

function setup(outputDir, createDocsDir) {
	// input and output paths
	const inputFiles = [outputDir + 'index.js'].concat(docUtils.readDirRecursive(outputDir + 'lib'))

	// get template data
	const templateData = jsdoc2md.getTemplateDataSync({ files: inputFiles, configure: CONFIG_PATH })

	if (createDocsDir) {
		const outputDocsDir = outputDir + 'docs'
		if (!fs.existsSync(outputDocsDir)) {
			fs.mkdirSync(outputDocsDir)
		}
		return { outputDocsDir, templateData }
	}

	return templateData
}

function createMarkdownFromPackage(outputDir, hbs) {
	console.log('createMarkdownFromPackage()', outputDir, hbs)
	const templateData = setup(outputDir, false)

	// create the main README
	fs.readFile(hbs, (err, data) => {
		if (err) return console.error(err)

		const output = jsdoc2md.renderSync({
			data: templateData,
			template: data.toString(),
			helper: __dirname + '/helper.js'
		})

		fs.writeFileSync(path.resolve(outputDir, `README.md`), output)
	})
}

module.exports = {
	createMarkdownFromClasses,
	createMarkdownFromPackage
}

// store former script

// ad-geom => package of classes
// "jsdoc2md --template md/README.hbs -c md/.jsdoc.json --no-cache --files index.js lib/* > README.md"

// ad-useragent => package of files with exported methods
// "jsdoc2md --template md/README.hbs -c md/.jsdoc.json --no-cache --helper md/helper.js --files index.js lib/* > README.md"
