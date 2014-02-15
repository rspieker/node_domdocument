var Node = require('./node.js'),
	helper = require('../helper.js'),
	sys = require('sys');


/**
 *  The Attr interface represents an attribute in an Element object. Typically the allowable values for the
 *  attribute are defined in a schema associated with the document.
 *  @name    Attr
 *  @type    function
 *  @access  internal
 *  @param   simple
 *  @return  void
 *  @note    Attr objects inherit the Node interface, but since they are not actually child nodes of the element
 *           they describe, the DOM does not consider them part of the document tree. Thus, the Node attributes
 *           parentNode, previousSibling, and nextSibling have a null value for Attr objects.
 */
function Attr(simple)
{
	Attr.super_.apply(this, [simple]);
}
//  Attr extends Node
sys.inherits(Attr, Node);

/**
 *  ___property
 *  @name    ___property
 *  @type    method
 *  @access  internal (exposed)
 *  @param
 *  @return  void
 */
Attr.prototype.___property = function()
{
	return helper.combine({
		name: {key: 'name'},
		specified: {},
		value: {key: 'data'},
		ownerElement: {key: 'parent'},
		schemaTypeInfo: {},
		isId: {}
	}, Node.prototype.___property());
};

/**
 *  ___get_ownerElement
 *  @name    ___get_ownerElement
 *  @type    method
 *  @access  internal (exposed)
 *  @param
 *  @return  void
 */
Attr.prototype.___get_ownerElement = function()
{
	return this.___get_parentNode();
};


//  Expose the Attr module
module.exports = Attr;
