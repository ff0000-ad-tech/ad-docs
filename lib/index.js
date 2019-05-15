'use strict'
const jsdoc2md = require('jsdoc-to-markdown')
const path = require('path')
const fs = require('fs')
const util = require('util')
fs.readFileAsync = util.promisify(fs.readFile)
const docUtils = require('./doc_utils.js')
const hbCompile = docUtils.hbCompile
const mergeAndRepathHeaderLink = docUtils.mergeAndRepathHeaderLink

async function createMarkdownFromClasses(packageName, outputDir, api, readme) {
	console.log('createMarkdownFromClasses()')

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

	let apiOutput = await prepApi(api, templateData)

	apiOutput = mergeAndRepathHeaderLink(apiOutput, './')

	// use to convert links from page scroll to nav to other md files
	apiOutput = apiOutput.replace(/(\[)([^\]]+)(\]\(#([^\)]+)\))/g, (full, a, b, c, d) => {
		// split to see if it is a method or property
		const split = d.split('.')
		return split.length > 1 ? `<a href="./docs/${split[0]}.md#${d}">${b}</a>` : b
	})

	combineAndWrite(packageName, outputDir, apiOutput, readme)
}

async function createMarkdownFromPackage(packageName, outputDir, api, readme) {
	console.log('createMarkdownFromPackage()')
	const templateData = setup(outputDir, false)
	const apiOutput = await prepApi(api, templateData)

	// create docs
	const template = `{{#identifiers}}{{>docs}}{{/identifiers}}`
	const output = jsdoc2md.renderSync({ data: templateData, template: template })

	combineAndWrite(packageName, outputDir, apiOutput + '\n' + output, readme)
}

function setup(outputDir, createDocsDir) {
	// input and output paths
	const inputFiles = [outputDir + 'index.js'].concat(docUtils.readDirRecursive(outputDir + 'lib'))

	// get template data
	const templateData = jsdoc2md.getTemplateDataSync({ files: inputFiles, configure: docUtils.CONFIG_PATH })

	if (createDocsDir) {
		const outputDocsDir = outputDir + 'docs'
		if (!fs.existsSync(outputDocsDir)) {
			fs.mkdirSync(outputDocsDir)
		}
		return { outputDocsDir, templateData }
	}

	return templateData
}

async function prepApi(api, templateData) {
	const apiData = await fs.readFileAsync(api)

	// create the main README
	return jsdoc2md.renderSync({
		data: templateData,
		template: apiData.toString(),
		helper: __dirname + '/helper.js'
	})
}

async function prepReadme(packageName, readme) {
	const [tagsData, readmeData] = await Promise.all([fs.readFileAsync(docUtils.TAGS_PATH), fs.readFileAsync(readme)])
	const tagsRendered = hbCompile(tagsData, { name: packageName })
	return tagsRendered + readmeData.toString()
}

async function combineAndWrite(packageName, outputDir, apiOutput, readme) {
	const hbsRendered = await prepReadme(packageName, readme)

	const combinedOutput = hbCompile(hbsRendered, { api: apiOutput })

	fs.writeFileSync(path.resolve(outputDir, `README.md`), combinedOutput)
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
