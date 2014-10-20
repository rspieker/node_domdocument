/* jshint node:true */
'use strict';


var CharacterData = require('./text.js'),
	sys = require('sys');


/**
 *  CDATA sections are used to escape blocks of text containing characters that would otherwise be regarded as markup.
 *  The only delimiter that is recognized in a CDATA section is the "]]>" string that ends the CDATA section. CDATA
 *  sections cannot be nested. Their primary purpose is for including material such as XML fragments, without needing to
 *  escape all the delimiters.
 *  @name    CDATASection
 *  @type    constructor
 *  @access  internal
 *  @param   Simple  object
 *  @return  CDATASection
 */
function CDATASection(simple)
{
	CDATASection.super_.apply(this, [simple]);
}
//  CDATASection extends CharacterData
sys.inherits(CDATASection, CharacterData);

CDATASection.prototype.toString = function()
{
	return '[object DOMCDATASection]';
};


//  Expose the CDATASection module
module.exports = CDATASection;
