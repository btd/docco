
/*!
## Parsing

This will find nearest comment begining
*/
var nextCommentBegin = function(comments, data, fromPos) {
	return nextCommentPart(comments, data, 0, fromPos)
}

/*!
```javascript
var a = 'test';
//comments in text
//but it is valid code
//<pre><code></code></pre>
```
*/
var nextCommentEnd = function(comments, data, fromPos) {
	return nextCommentPart(comments, data, 1, fromPos)
}

var nextCommentPart = function(comments, data, part, fromPos) {
	fromPos = fromPos || 0

	return comments.map(function(comment, index) {
			return { 
				comment: index, 
				textPos: data.indexOf(comment[part], fromPos) 
			}
		}).reduce(function(prevComment, currentComment) {
			return prevComment.textPos > currentComment.textPos && currentComment.textPos != -1 ? currentComment : prevComment
		}, { 
			comment: -1, 
			textPos: data.length
		})
}

var parseString = function(comments, data) {
	var result = []

	var commentBeginFrom = 0

	var nextBegin = nextCommentBegin(comments, data, commentBeginFrom)

	var prevComment = ""

	var tryCombineLastBlocks = function(block) {
		if(result.length >0 ) {
			var lastAddedBlock = result[result.length - 1]
			if(lastAddedBlock.code.trim() === "") {
				//seems we can combine blocks
				lastAddedBlock.comment += "\n" + block.comment
				lastAddedBlock.code = block.code
				return true
			} else if(lastAddedBlock.comment.trim() === ""){
				lastAddedBlock.code += "\n" + block.code
				lastAddedBlock.comment = block.comment
				return true
			}
		}
		return false
	}

	var tryAddBlock = function() {
		var code = data.substring(commentBeginFrom, nextBegin.textPos)

		if(code.trim() !== "" || prevComment.trim() !== "") {
			var block = { 
				code: code, 
				comment: prevComment
			}

			if(!tryCombineLastBlocks(block)) {
				result.push(block)
			}
		}
	}

	while(nextBegin.comment !== -1) {
		var comment = comments[nextBegin.comment]

		tryAddBlock()

		var nextEnd = nextCommentEnd([comment], data, nextBegin.textPos + comment[0].length)

		prevComment = data.substring(nextBegin.textPos + comment[0].length, nextEnd.textPos)

		commentBeginFrom = nextEnd.textPos + comment[1].length

		nextBegin = nextCommentBegin(comments, data, commentBeginFrom)
	}

	tryAddBlock()

	return result
}

module.exports.parseString = parseString 

module.exports.nextCommentPart = nextCommentPart 
