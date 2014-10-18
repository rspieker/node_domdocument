'use strict';

var Node = require('./node.js'),
	sys = require('sys');


/**
 *  DocumentFragment is a "lightweight" or "minimal" Document object. It is very common to want to be able to extract a
 *  portion of a document's tree or to create a new fragment of a document. Imagine implementing a user command like
 *  cut or rearranging a document by moving fragments around. It is desirable to have an object which can hold such
 *  fragments and it is quite natural to use a Node for this purpose. While it is true that a Document object could
 *  fulfill this role, a Document object can potentially be a heavyweight object, depending on the underlying
 *  implementation.
 *  @name    DocumentFragment
 *  @type    constructor
 *  @access  internal
 *  @param   Simple  object
 *  @return  DocumentFragment
 */
function DocumentFragment(simple)
{
	DocumentFragment.super_.apply(this, [simple]);
}
//  DocumentFragment extends Node
sys.inherits(DocumentFragment, Node);


//  Expose the DocumentFragment module
module.exports = DocumentFragment;
