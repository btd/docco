
var fs = require("fs"),
		path = require("path"),
		_ = require("lodash")

var processBlock = require("./processor").processBlock,
		parseString = require("./parser").parseString



var docco = function(configs) {
	/*!
		To know with wich language this file was written
	*/
	var lang = function(filename) {
		return _(configs).find(function(config) {
			return config.files.some(function(filenameRegEx) {
				return filenameRegEx.test(filename)
			})
		})
	}

	var defaultOptions = {
		templatePath: (__dirname + "/templates/single.file.jst")
	}

	return {
		processFile: function(filePath, done, options) {
			var filename = path.basename(filePath)

			var langConfig = lang(filename)

			options = _.extend(defaultOptions, {
				outputPath: "."
			}, options)

			fs.readFile(options.templatePath, 'utf8', function(err, tpl) {
				if(err) {
					console.log("Could not read template file: " + templatePath)
					throw err
				}

				var compiledTemplate = _.template(tpl)

				fs.readFile(filePath, 'utf8', function (err, data) {
				  if (err) {
				  	console.log("Could not read documented source file: " + filePath)
				  	throw err
				  }

				  var sections = []

				  parseString(
				  	langConfig.comments, 
				  	data, 
				  	function(newBlock) {
				  		sections.push(processBlock(newBlock, langConfig.lang))
				  	}, 
				  	function() {
				  		fs.writeFile(path.join(options.outputPath, filename + ".html"), 
				  			compiledTemplate({
				  				filename: filename,
				  				sections: sections,
				  				rootDir: options.rootDir
				  			}), 
				  			function(err) {
				  				if (err) throw err
				  				done()
				  			}
				  		)
				  	}	
				  )
				})
			})
		}
	}
}

module.exports = docco