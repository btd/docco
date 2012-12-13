var fs = require('fs'),
		path = require('path'),
		walk = require('walk'),
		_ = require('lodash'),
		mkdirp = require('mkdirp')

var traverse = function(firstEntry, filters, onFile, onEnd) {
	var isGoodEntry = function(entry) {
		return filters && filters.every(function(filter) {
			return !filter.test(entry)
		})
	}
	var walker  = walk.walk(firstEntry, { followLinks: false });

	walker.on('file', function(root, stat, next) {
		var entry = path.join(root, stat.name)
		if(isGoodEntry(entry)) onFile(entry)
		next()
	})

	walker.on('end', function() {
		onEnd()
	})
}

var docco = require('./single')

/*!
configs it is `array` of objects, each object should has 3 property:

```javascript
{
	path: 'path to source root',
	config: [], //language config for docco singe (array of language configs)
	filters: [] //array of filters, each it is a regex
}
```
*/
var doccoBatch = function(configs, done, options) {
	var numberOfRoots = configs.length

	console.log(numberOfRoots)

	options = _.extend({
		templatePathIndex: (__dirname + "/templates/index.file.jst"),
		outputPath: "./docco"
	}, options)

	console.log(options)

	configs.forEach(function(config) {
		
		var doccoSingle = new docco(config.config)

		traverse(
			config.path, 
			config.filters, 
			function(entry) {
				console.log("Found an entry " + entry)

				var htmlOutputPath = path.join(options.outputPath, entry + ".html")
				mkdirp(path.dirname(htmlOutputPath), function (err) {
					if(err) {
						console.log("Error, while creating dirs ")
						throw err
					}

					doccoSingle.processFile(entry, function() {
						console.log("File " + entry + " processed")
					},
					{
						outputPath: htmlOutputPath,
						rootDir: path.relative(htmlOutputPath, options.outputPath)
					})
				})
				
			},
			function() {
				if(--numberOfRoots === 0) {
					console.log("We finish processing")
					//we finish
					done()
				}
			})
	})
}

module.exports.traverse = traverse
module.exports.doccoBatch = doccoBatch