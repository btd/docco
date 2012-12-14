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
	fs.stat(firstEntry, function(err, stat) {
		if(err) throw err

		if(stat.isDirectory()) {
			var walker  = walk.walk(firstEntry, { followLinks: false });

			walker.on('file', function(root, stat, next) {
				var entry = path.join(root, stat.name)
				if(isGoodEntry(entry)) onFile(entry)
				next()
			})

			walker.on('end', function() {
				onEnd()
			})
		} else if(stat.isFile()) {
			if(isGoodEntry(firstEntry)) onFile(firstEntry)
			onEnd()
		}
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

	options = _.extend({
		templatePathIndex: (__dirname + "/templates/index.file.jst"),
		outputPath: "./docco"
	}, options)

	var processEntry = function(config, entry) {
		entries.push(entry)

		var htmlOutputPath = path.join(options.outputPath, entry + ".html")
		mkdirp(path.dirname(htmlOutputPath), function (err) {
			if(err) {
				console.log("Error, while creating dirs ")
				throw err
			}
			new docco(config.config).processFile(entry, function() {
			},
			{
				outputPath: path.dirname(htmlOutputPath),
				rootDir: path.relative(path.dirname(htmlOutputPath), options.outputPath)
			})
		})
	}

	var entries = []

	configs.forEach(function(config) {

		traverse(
			config.path, 
			config.filters, 
			function(entry) {
				processEntry(config, entry)
			},
			function() {
				if(--numberOfRoots === 0) {
					
					fs.readFile(options.templatePathIndex, 'utf8', function(err, tpl) {
						if(err) {
							console.log("Could not read template file: " + templatePathIndex)
							throw err
						}

						var compiledTemplate = _.template(tpl)

						var dirs = _.chain(entries)
							.groupBy(function(entry) {
								return path.dirname(entry)
							}).map(function(files, dir) {
								return {
									name: dir,
									files: files
								}
							}).sortBy(function(dir) {
								return dir.name
							})

						fs.writeFile(path.join(options.outputPath, "index.html"), 
			  			compiledTemplate({
			  				title: options.title,
			  				dirs: dirs
			  			}), 
			  			function(err) {
			  				if (err) throw err
			  				done()
			  			}
			  		)
					})
				}
			})
	})
}

module.exports.traverse = traverse
module.exports.doccoBatch = doccoBatch