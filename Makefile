
test:
	@./node_modules/.bin/mocha -u tdd

todo:
	@grep -ir --exclude-dir=node_modules todo * | cut -d: -f2- | tr "\t\/" " " | sed 's/^ *//'

.PHONY: test

