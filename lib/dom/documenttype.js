/* jshint node:true */
'use strict';


var Node = require('./node.js'),
	helper = require('../helper.js'),
	sys = require('sys');


/**
 *  Each Document has a doctype attribute whose value is either null or a DocumentType object. The DocumentType
 *  interface in the DOM Core provides an interface to the list of entities that are defined for the document, and
 *  little else because the effect of namespaces and the various XML schema efforts on DTD representation are not
 *  clearly understood as of this writing.
 *  @name    DocumentType
 *  @type    constructor
 *  @access  internal
 *  @param   Simple  object
 *  @return  DocumentType
 */
function DocumentType(simple)
{
	DocumentType.super_.apply(this, [simple]);
}
//  DocumentType extends Node
sys.inherits(DocumentType, Node);

/**
 *  ___property
 *  @name    ___property
 *  @type    method
 *  @access  internal (exposed)
 *  @return  void
 */
DocumentType.prototype.___property = function()
{
	return helper.combine({
		name: {
			get: function(){
				return this.name;
			}
		},
		publicId: {
			get: function(){
				return this.data.publicId ? this.data.publicId : '';
			}
		},
		systemId: {
			get: function(){
				return this.data.systemId ? this.data.systemId : '';
			}
		}
	}, Node.prototype.___property());
};

DocumentType.prototype.toString = function()
{
	return '[object DocumentType]';
};


//  Expose the DocumentType module
module.exports = DocumentType;
