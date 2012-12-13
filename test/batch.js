

var should = require('should')



var traverse    = require('../lib/batch').traverse
var doccoBatch    = require('../lib/batch').doccoBatch

var files   = [];

var config = [
	{
		"lang": "javascript",
		"comments": [["/*!", "*/"], ["//", "\n"]],
		"files": [/\.js$/] 
	},
	{//fallback
		"comments": [["/*!", "*/"], ["//", "\n"]],
		"files": [/.*/] 
	}
	]


describe("docco - batch", function() {
	it("should process walk by file system begining from some source entry", function(done) {
		traverse('./lib', 
			[/^\.[^\/].*/, /\/\.[^\/]/], 
			function(entry) {
				files.push(entry)
			}, function() {
				console.log(files)
				done()
			});
	})

	it("should process directory", function(done) {

		doccoBatch([{
			path: './lib',
			config: config,
			filters: [/^\.[^\/].*/, /\/\.[^\/]/, /\.jst$/]
		}], done)
	})
})