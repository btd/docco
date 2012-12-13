var should = require('should')

var processBlocks = require("../lib/processor").processBlocks

var parseString = require("../lib/parser").parseString

var config = {
	lang: 'javascript',
	comments: [["/*!", "*/"], ["//", "\n"]]
}

describe("processor", function() {
	it("should process docs with markdown and code with highlight.js", function() {
		var result = processBlocks(parseString(config.comments, "var a = 'test' /*! multiline\n comment with // nested*/ while(true) { }"), config.lang)
		
		result.should.have.length(2)
	})
})