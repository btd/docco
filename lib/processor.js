var hljs = require('highlight.js'),
		Showdown = require('showdown')

var unescape = function(value) {
    return value
    	.replace(/&amp;/gm, '&')
    	.replace(/&lt;/gm, '<')
    	.replace(/&gt;/gm, '>')
}


var highlight = function(converter) {
  return [
      /* seems better such blocks do not highlight
      { type: 'output', filter: function(source){
          return source.replace(/<pre><code>([^<]+)<\/code><\/pre>/g, function(match, code) {
              return wrapCode(hljs.highlightAuto(unescape(code)).value)
          });
      }},*/
      { type: 'output', filter: function(source){
          return source.replace(/<pre><code\s+class\="(\w+)">([^<]+)<\/code><\/pre>/g, function(match, language, code) {
              return wrapCode(hljs.highlight(language, unescape(code)).value, language)
          });
      }}
  ];
};

var converter = new Showdown.converter({
	extensions: [highlight]
})

var processBlocks = function(blocks, language) {
	return blocks.map(function(block) {
		return processBlock(block, language)
	})
}

var processBlock = function(block, language) {
	return {
		codeHtml: wrapCode((language ? hljs.highlight(language, block.code): hljs.highlightAuto(block.code)).value, language),
		docHtml: converter.makeHtml(block.comment)
	}
}

var wrapCode = function(code, language) {
	return '<pre><code ' + (language ? ('class="' + language + '"') : "") +'>' + code + '</code></pre>'
}

module.exports.processBlocks = processBlocks

module.exports.processBlock = processBlock


