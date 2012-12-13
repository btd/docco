var docco = require("../lib/single")

var should = require('should')

var fs = require("fs")

describe("docco - single", function() {
	it("should process file with default template", function(done) {
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


		var doccoSingle = new docco(config)

		doccoSingle.processFile(__dirname + "/../lib/parser.js", done)
	})
})