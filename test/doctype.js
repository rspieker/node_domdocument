var Code = require('code'),
	Lab = require('lab'),
	lab = exports.lab = Lab.script(),
	DOMDocument = require('./../lib/dom.js');


lab.experiment('DocumentType', function(){
	var html = '\n<html></html>',
		xml = '\n<root />',
		declaration = '<?xml version="1.0" encoding="utf-8"?>\n',
		doctypes = {
			'XML No': {
				source: xml
			},
			'XML (declared) No': {
				source: declaration + xml
			},
			'HTML No': {
				source: html
			},
			'HTML 5': {
				source: '<!DOCTYPE html>' + html,
				name: 'html'
			},
			'HTML 4.01 Strict': {
				source: '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">' + html,
				name: 'HTML',
				publicId: '-//W3C//DTD HTML 4.01//EN',
				systemId: 'http://www.w3.org/TR/html4/strict.dtd'
			},
			'HTML 4.01 Transitional': {
				source: '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">' + html,
				name: 'HTML',
				publicId: '-//W3C//DTD HTML 4.01 Transitional//EN',
				systemId: 'http://www.w3.org/TR/html4/loose.dtd'
			},
			'HTML 4.01 Frameset': {
				source: '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Frameset//EN" "http://www.w3.org/TR/html4/frameset.dtd">' + html,
				name: 'HTML',
				publicId: '-//W3C//DTD HTML 4.01 Frameset//EN',
				systemId: 'http://www.w3.org/TR/html4/frameset.dtd'
			},
			'XHTML 1.0 Strict': {
				source: '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">' + html,
				name: 'html',
				publicId: '-//W3C//DTD XHTML 1.0 Strict//EN',
				systemId: 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd'
			},
			'XHTML 1.0 Transitional': {
				source: '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">' + html,
				name: 'html',
				publicId: '-//W3C//DTD XHTML 1.0 Transitional//EN',
				systemId: 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd'
			},
			'XHTML 1.0 Frameset': {
				source: '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">' + html,
				name: 'html',
				publicId: '-//W3C//DTD XHTML 1.0 Frameset//EN',
				systemId: 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd'
			},
			'XHTML 1.1': {
				source: '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">' + html,
				name: 'html',
				publicId: '-//W3C//DTD XHTML 1.1//EN',
				systemId: 'http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd'
			},
			'XML ex': {
				source: '<!DOCTYPE ex SYSTEM "ex.dtd">' + xml,
				name: 'ex',
				systemId: 'ex.dtd'
			}
		};

	Object.keys(doctypes).forEach(function(key){

		new DOMDocument().loadXML(doctypes[key].source, function(error, document){

			lab.test(key + ' doctype', function(done){

				if (!('name' in doctypes[key]))
				{
					//  we expect no doctype to be present
					Code.expect(document.doctype).to.equal(null);
				}
				else
				{
					Code.expect(document.doctype + '').to.equal('[object DocumentType]');
					Code.expect(document.doctype.nodeType).to.equal(10);
					Code.expect(document.doctype.name).to.equal(doctypes[key].name);
					Code.expect(document.doctype.publicId).to.equal(doctypes[key].publicId || '');
					Code.expect(document.doctype.systemId).to.equal(doctypes[key].systemId || '');
				}

				done();
			});

		});

	});

});
