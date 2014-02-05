node_modules: package.json
	npm install

test: node_modules
	grunt test
