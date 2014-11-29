/* jshint node:true */
'use strict';

var helper = require('../helper.js');


/**
 *  Core module, providing the very basics of any module in need of access to DOM constants and/or Simple references
 *  @name    Core
 *  @type    constructor
 *  @access  internal
 *  @param   Simple object
 *  @return  Core   object
 */
function Core(simple)
{
	//  Create a reference to the provided Simple object, this reference is a function which takes a callback function
	//  which is applied using the Simple object as function scope (the 'this' keyword inside the callback will refer
	//  to the Simple object);
	Object.defineProperty(this, '___simple', {
		enumerable: false,
		writable: false,
		value: function(callback){
			return callback.apply(simple, []);
		}
	});

	//  slap on the logic obtained from calling the somewhat magical ___property method
	helper.decorate(this, simple);
}

//  Provide all DOM constants as a single prototype object
Core.prototype = {
	// NodeType
	ELEMENT_NODE:                1,
	ATTRIBUTE_NODE:              2,
	TEXT_NODE:                   3,
	CDATA_SECTION_NODE:          4,
	ENTITY_REFERENCE_NODE:       5,
	ENTITY_NODE:                 6,
	PROCESSING_INSTRUCTION_NODE: 7,
	COMMENT_NODE:                8,
	DOCUMENT_NODE:               9,
	DOCUMENT_TYPE_NODE:          10,
	DOCUMENT_FRAGMENT_NODE:      11,
	NOTATION_NODE:               12,

	// DocumentPosition
	DOCUMENT_POSITION_DISCONNECTED:            0x01,
	DOCUMENT_POSITION_PRECEDING:               0x02,
	DOCUMENT_POSITION_FOLLOWING:               0x04,
	DOCUMENT_POSITION_CONTAINS:                0x08,
	DOCUMENT_POSITION_CONTAINED_BY:            0x10,
	DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC: 0x20
};

/**
 *  The (somewhat magical) ___property method, which returns a set of properties and the getter/setter logic which
 *  should be applied
 *  @name    ___property
 *  @type    method
 *  @access  internal (exposed)
 *  @return  Object settings
 */
Core.prototype.___property = function()
{
	return {
		//  The name of this node, depending on its type
		nodeName:   {key: 'name', locked: true},
		//  A code representing the type of the underlying object
		nodeType:   {key: 'type', locked: true}
	};
};
/**
 *  Ensure we expose something useful when logging the object
 *  @name    __toString
 *  @type    method
 *  @access  public
 *  @return  string object description
 */
Core.prototype.toString = function()
{
	return this.___simple(function(){
		var name = this.name.replace(/[^\w]+/gi, '');

		return '[object DOM' + name[0].toUpperCase() + name.substr(1) + (this.type === 1 ? 'Node' : '') + ']';
	});
};


//  Expose the Core module so it can be extended
module.exports = Core;
