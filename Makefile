VERSION := $(shell sed '/version/ b e; d; b; :e s/ *"version": "\([^"]*\)",/\1/ ' package.json)

blackboardjs-$(VERSION).tgz:
	npm pack

dist: blackboardjs-$(VERSION).tgz

node_modules: package.json
	npm install

test: node_modules
	grunt test

all: test dist
