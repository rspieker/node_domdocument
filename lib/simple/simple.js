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
 *  @param   object namespace [optional, default undefined - no namespace]
 *  @return  Simple object
 */
function Simple(type, name, data, ns)
{
	var p;

	this.type     = type;
	this.name     = name;
	this.parent   = null;
	this.owner    = null;
	this.child    = [];
	this.data     = data;
	this.uri      = null;
	this.instance = null;
	this.xmlns    = ns;

	//  Only DOMElements can have attributes, which are provided as an object
	if (type === 1 && !(data instanceof Array))
	{
		this.data = [];
		for (p in data)
			this.append(new Simple(2, p, data[p]));
	}
	else if (type === 2 && /^xmlns(?:.*)$/.test(name))
	{
		//  by definition all namespace declaring attributes (name/prefix equals 'xmlns') are bound to the namespace URI
		//  'http://www.w3.org/2000/xmlns/'
		this.xmlns = 'http://www.w3.org/2000/xmlns/';
	}
	//  documents may receive ns/uri as data
	else if (type === 9)
	{
		this.uri = 'string' === typeof data ? data : process.cwd();
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
	//  Attribute nodes are associated with nodes, but are not children
	if (child.type === 2)
	{
		this.data.push(child);
	}
	//  The content of CDATASections is delivered as child nodes, so we treat those differently
	else if (this.type === 4)
	{
		this.data += child.data;
	}
	//  everything else is considered a child
	else
	{
		this.child.push(child);
	}

	return child.bind(this);
};

/**
 *  Bind a child node to the current node and document
 *  @name    bind
 *  @type    method
 *  @access  public
 *  @param   Simple  child
 *  @return  Simple  child
 */
Simple.prototype.bind = function(parent)
{
	var pair = this.name.split(':'),
		xmlns;

	this.release();
	this.parent = parent;
	this.owner  = parent.type === 9 ? parent : parent.owner;

	//  for any non-default namespaced attribute, we must ensure the existence of the namespace declaration
	if (this.type === 2 && pair.length > 1 && pair[0] !== 'xmlns')
	{
		xmlns = parent.ns();

		if (!(pair[0] in xmlns))
			this.parent.append(new Simple(2, 'xmlns:' + pair[0], this.xmlns));
	}

	return this;
};

/**
 *  Release a child node from the current parent and document
 *  @name    release
 *  @type    method
 *  @access  public
 *  @param   Simple  child
 *  @return  bool    success
 */
Simple.prototype.release = function()
{
	var pair = this.name.split(':'),
		self, xmlns;

	if (this.parent)
	{
		self = this;
		if (this.type === 1)
		{
			this.parent.child = this.parent.child.filter(function(child){
				return child !== self;
			});
		}
		else if (this.type === 2)
		{
			this.parent.data = this.parent.child.filter(function(attr){
				return attr !== self;
			});

			if (pair.length > 1 && pair[0] !== 'xmlns')
			{
				//xmlns = this.parent.ns();
				//  TODO: verify whether or not the namespace declaration is still needed
			}
		}

		this.parent = null;
	}

	return this.parent === null;
};

/**
 *  Obtain all the relevant namespaces affecting the current Simple instance
 *  @name    ns
 *  @type    method
 *  @access  public
 *  @param   bool    bubble
 *  @return  object  xmlns (format: {prefix:uri,...})
 */
Simple.prototype.ns = function()
{
	var xmlns = this.type === 1 && this.parent ? this.parent.ns() : {},
		pair = this.name.split(':');

	if (this.type === 2 && pair[0] === 'xmlns')
		xmlns[pair.length > 1 ? pair[1] : ''] = this.data;

	if (this.type === 1 && this.data instanceof Array)
		this.data.forEach(function(attr){
			var ns = attr.ns();

			Object.keys(ns).forEach(function(key){
				if (ns[key])
					xmlns[key] = ns[key];
			});
		});

	return xmlns;
};

/**
 *  Find the appropriate prefix for given namespaceURI + localName
 *  @name    qualifiedName
 *  @type    method
 *  @access  public
 *  @param   string  namespaceURI
 *  @param   string  localName
 *  @return  string  qualifiedName
 */
Simple.prototype.qualifiedName = function(namespaceURI, localName)
{
	var ns = this.ns(),
		names;

	names = Object.keys(ns)
		.filter(function(key){
			if ((namespaceURI || '') === '')
				return key === '';

			return ns[key] === namespaceURI;
		})
		.map(function(key){
			return (key !== '' ? key + ':' : '') + localName;
		})
	;

	return names.length ? names.shift() : null;
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

			case 1:  //  Node
			case 9:  //  Document
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
