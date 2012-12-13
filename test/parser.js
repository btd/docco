var should = require('should')

var parseString = require("../lib/parser").parseString

var nextCommentPart = require("../lib/parser").nextCommentPart

var config = {
	comments: [["/*!", "*/"], ["//", "\n"]]
}

describe("parser", function(){
	describe("#parseString", function() {

		it("should return empty array if data is empty", function() {

			parseString(config.comments, "").should.eql([])

		})

		it("should split data string with code/comment pairs by comments, when for each code exists comment", function() {

			parseString(config.comments, "/*! comment*/ code there").should.eql([
				{ code: " code there", comment: " comment" }
			])

			parseString(config.comments, "some text before /*! comment*/ code there").should.eql([
				{ code: "some text before ", comment: "" },
				{ code: " code there", comment: " comment" }
			])

			parseString(config.comments, "some text before /*! multiline\n comment with // nested*/ code there").should.eql([
				{ code: "some text before ", comment: "" },
				{ code: " code there", comment: " multiline\n comment with // nested" }
			])

			parseString(config.comments, "some text before /*! comment*/").should.eql([
				{ code: "some text before ", comment: "" },
				{ code: "", comment: " comment" }
			])

			parseString(config.comments, "some text before /*! comment").should.eql([
				{ code: "some text before ", comment: "" },
				{ code: "", comment: " comment" }
			])

			parseString(config.comments, "some text before /*! comment /*! */  */").should.eql([
				{ code: "some text before ", comment: "" },
				{ code: "  */", comment: " comment /*! " }
			])

			parseString(config.comments, "some text // asdas \n before ").should.eql([
				{ code: "some text ", comment: "" },
				{ code: " before ", comment: " asdas " }
			])
		})
	})

	describe("#nextCommentPart", function() {

		it("should find nearest comment begining from begining of string", function() {

			nextCommentPart(config.comments, "some string /*! with comment // ", 0).should.eql({
				comment: 0,
				textPos: 12
			})

		})

		it("should find nearest comment begining from some pos in string", function() {

			nextCommentPart(config.comments, "some string /*! with comment // ", 0, 15).should.eql({
				comment: 1,
				textPos: 29
			})

		})

		it("should return comment:-1 if no comments in string", function() {

			nextCommentPart(config.comments, "some string /*! with comment // ", 0, 40).should.have.property('comment', -1)

		})
	})
})