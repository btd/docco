
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

var parseString = function(comments, data, onNewBlock, onEnd) {
	var result = []

	var commentBeginFrom = 0

	var nextBegin = nextCommentBegin(comments, data, commentBeginFrom)

	var prevComment = ""

	var tryAddBlock = function() {
		var code = data.substring(commentBeginFrom, nextBegin.textPos)

		if(code.trim() !== "" || prevComment.trim() !== "") {
			var block = { code: data.substring(commentBeginFrom, nextBegin.textPos), comment: prevComment}
			result.push(block)
			onNewBlock && onNewBlock(block)
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

	onEnd && onEnd()

	return result
}

module.exports.parseString = parseString 

module.exports.nextCommentPart = nextCommentPart 
