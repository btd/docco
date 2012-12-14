# Docco - docco documentation generator

It is a rewriten from scratch original docco generator, why i decide to rewrite it:

* Support of directories
* Depends only from node and strong libraries, no process.exec
* Support any language and any comments styles - multilines, onelines - just fill config file and point generator on it

## Examle usage

Show help:

```
docco --help
```

Process one single file:

```
docco file.js
```
Will be created file in current directory with name file.js.html and docco.css. It is all. To specify output directory use `-o` option (strongly recommended for batch processing).

By default it uses C-style comments `/*! comment */` and `// ... \n`. So i am sure you want to use another type of comments - fill language configuration file and specify it with `-l` option.

For example i have such configuration file: 

```json
[
{
	"lang": "css",
	"comments": [["/*!", "*/"]],
	"files": ["\\.css$"] 
},
{
	"lang": "javascript",
	"comments": [["/*!", "*/"], ["//", "\n"]],
	"files": ["\\.js$"] 
},
{
	"comments": [["/*!", "*/"], ["//", "\n"]],
	"files": [".*"] 
}
]
```

It is array of objects. Each object should has 3 property: `lang` - it is `highlight.js` language for highlight, you can skip this argument and in this case will be used best matched, `comments` - it is obviously array or comments, each it is array with start and end, `files` - array of file patterns for this object configuration.

Example usage:

```
docco -l ./resources/languages.example.json ./lib/batch.js
```

## Batch processing

I strongly recommend add `-o` option for batch processing!!!

To unable batch processing you can do one of the following things:

* Specify more then one file for processing:

```
docco -l ./resources/languages.example.json -o ./docs ./lib/batch.js ./lib/single.js
```

* Specify directory or set of directories or files (the same as above but mixed).

* Specify option `-b`

* Specify option `--batch-config <path to batch config>`

First 3 cases uses default filters for directories - skip files which starts from `.`. Last case used when you want to specify your own filters.

Example of batch config:

```json
[
{
	path: './lib',
	config: languageConfig,
	filters: [/^\.[^\/].*/, /\/\.[^\/]/]
}
]
```

So it is also array (you can add any numbers of entryes) with objects: `path` path to entry (usually directory), `config` - it is a language configuration for this entry (see example above), `filters` - it is array of strings, which will be excluded while traversing `path` location recusivly.

For this package i am generating docs with this command:

```
docco -o docs -l ./resources/languages.example.json --title "Docco - documentaion generator" ./lib
```

## License 

(The MIT License)

Copyright (c) 2012 Bardadym Denis &lt;bardadymchik@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
