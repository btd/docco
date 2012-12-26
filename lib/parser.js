
/*!
## Parsing

This will find nearest comment begining
*/
var nextCommentBegin = function(comments, data, fromPos) {
	return nextCommentPart(comments, data, 0, fromPos);
};

var nextCommentEnd = function(comments, data, fromPos) {
	return nextCommentPart(comments, data, 1, fromPos);
};

// Lined endings and indentation in code tabs and/or spaces.
var lineEnd = '\n',
		ident = /[\t ]*/;

// I hope programmer will be enough accurate to do not mess spaces and tabs.
var foundIdent = function(data, pos) {
	var lastLinePos = data.lastIndexOf(lineEnd, pos);

	var lineBeforeCommentBegin = data.substring(lastLinePos, pos - lastLinePos);

	return ident.test(lineBeforeCommentBegin) ? lineBeforeCommentBegin : "";
};

// If result.commect === -1 then no comments was found
var nextCommentPart = function(comments, data, part, fromPos) {
	fromPos = fromPos || 0;

	var defaultBlock = { 
		comment: -1, 
		textPos: data.length,
		ident: ''
	};

	return comments.map(function(comment, index) {
		var textPos = data.indexOf(comment[part], fromPos);

		return { 
			comment: index, 
			textPos: textPos,
			ident: foundIdent(data, textPos)
		};
	}).reduce(function(prevComment, currentComment) {
		return prevComment.textPos > currentComment.textPos && 
			currentComment.textPos != -1 ? currentComment : prevComment;
	}, defaultBlock);
};

// I decide that block can be combined with previous block if text is empty or contains only spaces/tabs
var suitableForCombine = function(text) {
	return text === '' || /^[\t ]+$/.test(text);
};

var parseString = function(comments, data) {
	var result = [],
			commentBeginFrom = 0,
			nextBegin = nextCommentBegin(comments, data, commentBeginFrom),
				prevComment = '';

	var tryCombineLastBlocks = function(block) {
		if(result.length > 0) {
			var lastAddedBlock = result[result.length - 1];

			if(suitableForCombine(lastAddedBlock.code)) {
				// seems we can combine blocks
				lastAddedBlock.comment += lineEnd + block.comment;
				// We will trimg spaces at the end to last code.
				lastAddedBlock.code = lastAddedBlock.code.replace(/\s+$/, '') + block.code;
				return true;
			}
		}
		return false;
	};

	var tryAddBlock = function() {
		var code = data.substring(commentBeginFrom, nextBegin.textPos);

		if(code !== "" || prevComment !== "") {
			var block = { 
				code: code, 
				comment: prevComment
			};

			if(!tryCombineLastBlocks(block)) {
				result.push(block);
			}
		}
	};

	while(nextBegin.comment !== -1) {
		var comment = comments[nextBegin.comment];

		tryAddBlock();

		var nextEnd = nextCommentEnd([comment], data, nextBegin.textPos + comment[0].length);

		prevComment = data.substring(nextBegin.textPos + comment[0].length, nextEnd.textPos);

		commentBeginFrom = nextEnd.textPos + comment[1].length;

		nextBegin = nextCommentBegin(comments, data, commentBeginFrom);
	}

	tryAddBlock();

	return result;
};

module.exports.parseString = parseString;

module.exports.nextCommentPart = nextCommentPart;
