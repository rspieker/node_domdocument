'use strict';

var Node = require('./node.js'),
	DOMException = require('../dom/exception.js'),
	helper = require('../helper.js'),
	sys = require('sys');

/**
 *  The CharacterData interface extends Node with a set of attributes and methods for accessing character data in the
 *  DOM. For clarity this set is defined here rather than on each object that uses these attributes and methods. No DOM
 *  objects correspond directly to CharacterData, though Text and others do inherit the interface from it. All offsets
 *  in this interface start from 0.
 *  @name    CharacterData
 *  @type    constructor
 *  @access  internal
 *  @param   Simple  object
 *  @return  CharacterData
 */
function CharacterData(simple)
{
	CharacterData.super_.apply(this, [simple]);
}
//  CharacterData extends Node
sys.inherits(CharacterData, Node);

/**
 *  ___property
 *  @name    ___property
 *  @type    method
 *  @access  internal (exposed)
 *  @return  void
 */
CharacterData.prototype.___property = function()
{
	return helper.combine({
		nodeValue:  {
			get: function(){
				return this.data;
			},
			set: function(value){
				this.data = value;
			}
		},
		//  The character data of the node that implements this interface. The DOM implementation may not put arbitrary
		//  limits on the amount of data that may be stored in a CharacterData node. However, implementation limits may
		//  mean that the entirety of a node's data may not fit into a single DOMString. In such cases, the user may
		//  call substringData to retrieve the data in appropriately sized pieces.
		data: {key: 'data'},
		//  The number of 16-bit units that are available through data and the substringData method below. This may have
		//  the value zero, i.e., CharacterData nodes may be empty.
		length: {get: function(){
			return this.data.length;
		}}
	}, Node.prototype.___property());
};

/**
 *  Append the string to the end of the character data of the node. Upon success, data provides access to the
 *  concatenation of data and the DOMString specified.
 *  @name    appendData
 *  @type    method
 *  @access  public
 *  @param   string  arg
 *  @return  void
 */
CharacterData.prototype.appendData = function(arg)
{
	this.___simple(function(){
		this.data += arg;
	});
};

/**
 *  Remove a range of 16-bit units from the node. Upon success, data and length reflect the change.
 *  @name    deleteData
 *  @type    method
 *  @access  public
 *  @param   number  offset
 *  @param   number  count
 *  @return  void
 */
CharacterData.prototype.deleteData = function(offset, count)
{
	this.replaceData(offset, count, '');
};

/**
 *  Insert a string at the specified 16-bit unit offset.
 *  @name    insertData
 *  @type    method
 *  @access  public
 *  @param   number  offset
 *  @param   string  arg
 *  @return  void
 */
CharacterData.prototype.insertData = function(offset, arg)
{
	this.replaceData(offset, 0, arg);
};

/**
 *  Replace the characters starting at the specified 16-bit unit offset with the specified string.
 *  @name    replaceData
 *  @type    method
 *  @access  public
 *  @param   number  offset
 *  @param   number  count
 *  @param   string  arg
 *  @return  void
 */
CharacterData.prototype.replaceData = function(offset, count, arg)
{
	this.___simple(function(){
		var data;

		if (offset < 0 || offset > this.data.length || count < 0)
			throw new DOMException('INDEX_SIZE_ERR');

		data = this.data.split('');
		data.splice(offset, count, [arg]);

		this.data = data.join('');
	});
};

/**
 *  Extracts a range of data from the node.
 *  @name    substringData
 *  @type    method
 *  @access  public
 *  @param   number  offset
 *  @param   number  count
 *  @return  void
 */
CharacterData.prototype.substringData = function(offset, count)
{
	return this.___simple(function(){
		return this.data.substr(offset, count);
	});
};

//  Expose the CharacterData module
module.exports = CharacterData;
