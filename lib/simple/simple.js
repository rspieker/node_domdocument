/* jshint node:true */
'use strict';

/**
 *  Simplified representation of DOMNodes
 *  @name    Simple
 *  @type    constructor
 *  @access  internal
 *  @param   number nodeType
 *  @param   string nodeName
 *  @param   mixed  data
 *  @return  Simple object
 */
function Simple(type, name, data)
{
	var o, p;

	this.type     = type;
	this.name     = name;
	this.parent   = null;
	this.owner    = null;
	this.child    = [];
	this.data     = data;
	this.prop     = null;
	this.instance = null;

	//  Only DOMElements can have attributes, which are provided as an object
	if (type === 1 && !(data instanceof Array))
	{
		this.data = [];
		for (p in data)
		{
			o = new Simple(2, p, data[p]);
			o.parent = this;
			this.data.push(o);
		}
	}
	//  documents may receive ns/uri as data
	else if (type === 9)
	{
		this.prop = {
			ns: [],
			uri: 'string' === typeof data ? data : process.cwd()
		};
	}
	//  doctype may receive publicId and/or systemId (or neither)
	else if (type === 10)
	{
		this.prop = data;
		this.data = null;
	}
}

/**
 *  Append a child node to the current Simple object
 *  @name    append
 *  @type    method
 *  @access  public
 *  @param   Simple child
 *  @return  Simple child
 *  @note    this does not remove the child from any associated parent
 */
Simple.prototype.append = function(child)
{
	//  Node-Expat delivers the content of CDATASections as child nodes, so we treat those differently
	if (this.type === 4)
	{
		this.data += child.data;
	}
	else
	{
		this.child.push(child);
	}
	child.parent = this;
	child.owner  = this.type === 9 ? this : this.owner;

	return child;
};

/**
 *  Find any Simple object based on type/name, optionally searches the tree (descent into children)
 *  @name    find
 *  @type    method
 *  @access  public
 *  @param   number nodeType
 *  @param   string nodeName
 *  @param   bool   descent
 *  @return  Array  matches
 */
Simple.prototype.find = function(type, name, descent)
{
	var found = [],
		search = [];

	if (type === 2 && this.type === 1) //  attributes
		search = search.concat(this.data);
	search = search.concat(this.child);

	search.forEach(function(child){
		if ((!type || type === child.type) && (!name || name.toLowerCase() === child.name.toLowerCase()))
			found.push(child);

		if (descent)
			found = found.concat(child.find(type, name, descent));
	});

	return found;
};

/**
 *  Clone the Simple instance
 *  @name    clone
 *  @type    method
 *  @access  public
 *  @param   bool   deep
 *  @param   Simple owner [optional, default null - the current owner]
 *  @return  Simple clone
 */
Simple.prototype.clone = function(deep, owner)
{
	var result = new Simple(this.type, this.name, this.data),
		i;

	result.owner = owner || this.owner;

	if (deep)
		this.child.forEach(function(child){
			result.append(child.clone(deep, result.owner));
		});

	return result;
};

/**
 *  Find the current index of given child Simple
 *  @name    index
 *  @type    method
 *  @access  public
 *  @param   Simple  object
 *  @return  mixed   result [one of: number index, bool false if not a child]
 */
Simple.prototype.index = function(child)
{
	var i;

	for (i = 0; i < this.child.length; ++i)
		if (this.child[i] === child)
			return i;

	return false;
};

/**
 *  Normalize the child Simple instances
 *  @name    normalize
 *  @type    method
 *  @access  public
 *  @return  void
 */
Simple.prototype.normalize = function()
{
	var i;

	for (i = this.child.length - 1; i >= 0; --i)
		switch (this.child[i].type)
		{
			case 3:  //  TextNodes

				if (i + 1 < this.child.length && this.child[i + 1].type === 3)
				{
					this.child[i].data += this.child[i + 1].data;
					this.child.splice(i + 1, 1);
				}
				break;

			case 1:
			case 9:
				this.child[i].normalize();
				break;
		}
};

/**
 *  Serialize the simple object into a string (e.g. XML or HTML)
 *  @name    serialize
 *  @type    method
 *  @access  public
 *  @param   object options [format: string ('html', 'xml'), removeEmptyAttributes: bool, preserveWhiteSpace: bool, preserveComment: bool | function(content)]
 *  @return  string XML|HTML
 */
Simple.prototype.serialize = function(options)
{
	var SimpleSerializer = require('./serializer.js');

	return new SimpleSerializer().serializeToString(this, options);
};


module.exports = Simple;
