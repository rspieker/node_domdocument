/* jshint node:true */
'use strict';


var Node = require('./node.js'),
	helper = require('../helper.js'),
	factory = require('../simple/factory.js'),
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
		//  Returns the name of this attribute. If Node.localName is different from null, this attribute is a qualified
		//  name.
		name: {key: 'name'},
		nodeValue:  {
			get: function(){
				return this.data;
			},
			set: function(value){
				this.data = value;
			}
		},
		//  True if this attribute was explicitly given a value in the instance document, false otherwise. If the
		//  application changed the value of this attribute node (even if it ends up having the same value as the
		//  default value) then it is set to true. The implementation may handle attributes with default values from
		//  other schemas similarly but applications should use Document.normalizeDocument() to guarantee this
		//  information is up-to-date.
		specified: {
			//  TODO: implement the 'specified' property
		},
		//  On retrieval, the value of the attribute is returned as a string. Character and general entity references
		//  are replaced with their values. See also the method getAttribute on the Element interface.
		//  On setting, this creates a Text node with the unparsed contents of the string, i.e. any characters that an
		//  XML processor would recognize as markup are instead treated as literal text. See also the method
		//  Element.setAttribute().
		value: {key: 'data'},
		//  The Element node this attribute is attached to or null if this attribute is not in use.
		ownerElement: {
			get: function(){
				return factory.instance(this.parent);
			}
		},
		//  The type information associated with this attribute. While the type information contained in this attribute
		//  is guaranteed to be correct after loading the document or invoking Document.normalizeDocument(),
		//  schemaTypeInfo may not be reliable if the node was moved.
		schemaTypeInfo: {
			//  TODO: implement the 'schemaTypeInfo' property
		},
		//  Returns whether this attribute is known to be of type ID (i.e. to contain an identifier for its owner
		//  element) or not. When it is and its value is unique, the ownerElement of this attribute can be retrieved
		//  using the method Document.getElementById.
		isId: {
			//  TODO: implement the 'isId' property
		}
	}, Node.prototype.___property());
};


//  Expose the Attr module
module.exports = Attr;
