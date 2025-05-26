all: dist/avguesser.min.js

dist/avguesser.min.js: src/*.ts node_modules/.bin/rollup
	npm run build

node_modules/.bin/rollup:
	npm install

clean:
	npm run clean
