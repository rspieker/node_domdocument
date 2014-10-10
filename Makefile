
test:
	@./node_modules/.bin/lab

test-coverage:
	@./node_modules/.bin/lab -c

test-lint:
	@./node_modules/.bin/lab -L

todo:
	@grep -ir --exclude-dir=node_modules todo * | cut -d: -f2- | tr "\t\/" " " | sed 's/^ *//'

.PHONY: test

