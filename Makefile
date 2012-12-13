
MOCHA_OPTS=
REPORTER = spec

start:
	@NODE_ENV=development ./node_modules/.bin/nodemon ./server.js

test: test-unit

test-unit:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		$(MOCHA_OPTS)

test-cov: 
	@echo 'Checkin test sources coverage...'

	@rm -rf _src-with-coverage && rm -rf _test-with-coverage

	@jscoverage lib _src-with-coverage

	@cp -r test _test-with-coverage
	@find _test-with-coverage -name '*.js' -exec sed -i '' 's/lib\//_src-with-coverage\//g' '{}' \;

	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter html-cov \
		$$(find _test-with-coverage -name '*.js') > coverage.html

	@rm -rf _src-with-coverage && rm -rf _test-with-coverage

.PHONY: test test-unit test-cov