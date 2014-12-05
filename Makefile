#  Run all tests
test:
	@./node_modules/.bin/lab;

#  Run all tests and create a report in html
test-report:
	@mkdir -p report;
	@./node_modules/.bin/lab -c -r html -o report/lab-report.html && echo "Lab Report generated in report/lab-report.html";

#  Run all tests and show the coverage (target is always to cover 100%)
test-coverage:
	@./node_modules/.bin/lab -c;

analysis:
	@./node_modules/.bin/plato --dir report/plato --recurse lib/ && echo "Plato Report generated in report/plato";

full-report:
	@$(MAKE) analysis test-report;

#  Run all tests and show the lint results (linting is not-configured and very tight)
test-lint:
	@./node_modules/.bin/lab -L lib/;

#  Check all sources for a 'todo' and display those
todo:
	@grep -ir --exclude-dir=node_modules --exclude-dir=report --exclude="*.html" todo * | cut -d: -f2- | tr "\t\/" " " | sed 's/^ *//';

#  Generate the list of authors with the number of occurences in the git log (representing the amount of commits)
commit-count:
	@git log --format='%aN <%aE>' | sort | uniq -c | sort -r;

#  The list of authors, with the commit-count itself removed
credits:
	@$(MAKE) commit-count | sed 's/^ *[0-9]* //';

#  Update the AUTHORS file
authors-file:
	@$(MAKE) credits > AUTHORS;


.PHONY: test

