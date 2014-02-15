var Core = require('./core.js'),
	NodeList = require('./nodelist.js'),
	helper = require('../helper.js'),
	factory = require('../simple/factory.js'),
	sys = require('sys');


/**
 *  Node
 *  @name    Node
 *  @type    function
 *  @access  internal
 *  @param   simple
 *  @return  void
 */
function Node(simple)
{
	var node = this;

	Node.super_.apply(this, [simple]);
}
//  Node extends Core
sys.inherits(Node, Core);

/**
 *  ___property
 *  @name    ___property
 *  @type    method
 *  @access  internal (exposed)
 *  @param
 *  @return  void
 */
Node.prototype.___property = function()
{
	return helper.combine({
		nodeName:   {key: 'name', locked: true},
		nodeValue:  {key: 'data', set: true},
		nodeType:   {key: 'type', locked: true},
		parentNode: {key: 'parent'},
		childNodes: {get: function(){
			//  TODO:  cache this properly

			if (!this.childNodeList)
				this.childNodeList = new NodeList(this.child);

			return this.childNodeList;
		}},
		firstChild: {get: function(){
console.log('firstChild.get', this.name, this.child.length, factory);
			return this.child.length > 0 ? factory.instance(this.child[0]) : null;
		}},
		lastChild: {get: function(){
			return this.child.length > 0 ? factory.instance(this.child[this.child.length - 1]) : null;
		}},
		previousSibling: {get: function(){
			var self = this,
				index;

			this.parent.child.forEach(function(item, i){
				if (item === self)
					index = i - 1;
			});

			return index >= 0 ? factory.instance(this.parent.child[index]) : null;
		}},
		nextSibling: {get: function(){
			var self = this,
				index;

			this.parent.child.forEach(function(item, i){
				if (item === self)
					index = i + 1;
			});

			return index < this.parent.child.length ? factory.instance(this.parent.child[index]) : null;
		}},
		attributes: {get: function(){
			return this.type === 1 ? new NamedNodeMap(this.data) : null;
		}},
		ownerDocument: {key: 'owner'},
		namespaceURI: {},
		prefix: {},
		localName: {},
		baseURI: {},
		textContent: {}
	}, Core.prototype.___property());
};

/**
 *  ___set_nodeValue
 *  @name    ___set_nodeValue
 *  @type    method
 *  @access  internal (exposed)
 *  @param   value
 *  @return  void
 */
Node.prototype.___set_nodeValue = function(value)
{
	switch (this.nodeType)
	{
		case this.ATTRIBUTE_NODE:
		case this.CDATA_SECTION_NODE:
		case this.COMMENT_NODE:
		case this.PROCESSING_INSTRUCTION_NODE:
		case this.TEXT_NODE:
			this.___simple(function(){
				this.data = value;
			});
			break;

		//  as per spec, we completely disregard the setting on other nodeTypes
	}
};

/**
 *  ___get_parentNode
 *  @name    ___get_parentNode
 *  @type    method
 *  @access  internal (exposed)
 *  @param
 *  @return  void
 */
Node.prototype.___get_parentNode = function()
{
	return this.___simple(function(){
		return factory.instance(this.parent);
	});
};

/**
 *  ___get_ownerDocument
 *  @name    ___get_ownerDocument
 *  @type    method
 *  @access  internal (exposed)
 *  @param
 *  @return  void
 */
Node.prototype.___get_ownerDocument = function()
{
	return this.___simple(function(){
		return factory.instance(this.owner);
	});
};

/**
 *  insertBefore
 *  @name    insertBefore
 *  @type    method
 *  @access  public
 *  @param   newChild, oldChild
 *  @return  void
 */
Node.prototype.insertBefore = function(newChild, refChild)
{
	//  TODO: implement Node.insertBefore
};

/**
 *  replaceChild
 *  @name    replaceChild
 *  @type    method
 *  @access  public
 *  @param   newChild, oldChild
 *  @return  void
 */
Node.prototype.replaceChild = function(newChild, oldChild)
{
	//  TODO: implement Node.replaceChild
};

/**
 *  removeChild
 *  @name    removeChild
 *  @type    method
 *  @access  public
 *  @param   oldChild
 *  @return  void
 */
Node.prototype.removeChild = function(oldChild)
{
	//  delegate the actual removal to the simple object of the Node
	this.___simple(function(){
		if (this.childNodeList)
			delete this.childNodeList;

		//  here we simply filter out the child we desire to remove
		this.child = this.child.filter(function(child){
			return child.instance !== oldChild;
		});
	});
};

/**
 *  appendChild
 *  @name    appendChild
 *  @type    method
 *  @access  public
 *  @param   newChild
 *  @return  void
 */
Node.prototype.appendChild = function(newChild)
{
	var parent = newChild.parentNode,
		simple;

	if (parent.ownerDocument !== newChild.ownerDocument)
		throw new DOMException('WRONG_DOCUMENT_ERR');

	//  trickery to obtain the simple of Node.
	this.___simple(function(){
		if (this.childNodeList)
			delete this.childNodeList;

		simple = this;
	});

	//  remove from current parent
	if (parent)
		parent.removeChild(newChild);

	//  assign the simple of Node to be the parent of the simple of newChild
	newChild.___simple(function(){
		this.parent = simple;

		//  and while we are in the scope the simple of newChild, add it to the child of the simple of Node
		simple.child.push(this);
	});
	//  still with us? :)

	//  we can safely assume that what is added, is what we need to return
	return newChild;
};

/**
 *  hasChildNodes
 *  @name    hasChildNodes
 *  @type    method
 *  @access  public
 *  @param
 *  @return  void
 */
Node.prototype.hasChildNodes = function()
{
	return this.___simple(function(){
		return this.child.length > 0;
	});
};

/**
 *  cloneNode
 *  @name    cloneNode
 *  @type    method
 *  @access  public
 *  @param   deep
 *  @return  void
 */
Node.prototype.cloneNode = function(deep)
{
	return factory.instance(this.___simple(function(){
		return this.clone(deep);
	}));
};

/**
 *  normalize
 *  @name    normalize
 *  @type    method
 *  @access  public
 *  @param
 *  @return  void
 */
Node.prototype.normalize = function()
{
	//  TODO: implement Node.normalize
};

/**
 *  isSupported
 *  @name    isSupported
 *  @type    method
 *  @access  public
 *  @param   feature, version
 *  @return  void
 */
Node.prototype.isSupported = function(feature, version)
{
	//  TODO: implement Node.isSupported
};

/**
 *  compareDocumentPosition
 *  @name    compareDocumentPosition
 *  @type    method
 *  @access  public
 *  @param   other
 *  @return  void
 */
Node.prototype.compareDocumentPosition = function(other)
{
	//  TODO: implement Node.compareDocumentPosition
};

/**
 *  isSameNode
 *  @name    isSameNode
 *  @type    method
 *  @access  public
 *  @param   other
 *  @return  void
 */
Node.prototype.isSameNode = function(other)
{
	return other === this;
};

/**
 *  lookupPrefix
 *  @name    lookupPrefix
 *  @type    method
 *  @access  public
 *  @param   namespaceURI
 *  @return  void
 */
Node.prototype.lookupPrefix = function(namespaceURI)
{
	//  TODO: implement Node.lookupPrefix
};

/**
 *  isDefaultNamespace
 *  @name    isDefaultNamespace
 *  @type    method
 *  @access  public
 *  @param   namespaceURI
 *  @return  void
 */
Node.prototype.isDefaultNamespace = function(namespaceURI)
{
	//  TODO: implement Node.isDefaultNamespace
};

/**
 *  Tests whether two nodes are equal.
 *  This method tests for equality of nodes, not sameness (i.e., whether the two nodes are references to the same
 *  object) which can be tested with Node.isSameNode(). All nodes that are the same will also be equal, though the
 *  reverse may not be true.
 *  @name    isEqualNode
 *  @type    method
 *  @access  public
 *  @param   arg
 *  @return  bool equal
 *  @note    Two nodes are equal if and only if the following conditions are satisfied:
 *           - The two nodes are of the same type.
 *           - The following string attributes are equal: nodeName, localName, namespaceURI, prefix, nodeValue.
 *             This is: they are both null, or they have the same length and are character for character identical.
 *           - The attributes NamedNodeMaps are equal. This is: they are both null, or they have the same length and
 *             for each node that exists in one map there is a node that exists in the other map and is equal,
 *             although not necessarily at the same index.
 *           - The childNodes NodeLists are equal. This is: they are both null, or they have the same length and
 *             contain equal nodes at the same index. Note that normalization can affect equality; to avoid this,
 *             nodes should be normalized before being compared.
 *  @note    For two DocumentType nodes to be equal, the following conditions must also be satisfied:
 *           - The following string attributes are equal: publicId, systemId, internalSubset.
 *           - The entities NamedNodeMaps are equal.
 *           - The notations NamedNodeMaps are equal.
 */
Node.prototype.isEqualNode = function(arg)
{
	var equal = true, //  assume the best
		compare = ['nodeType', 'nodeName', 'localName', 'namespaceURI', 'prefix', 'nodeValue'],
		i;

	if (equal)
		for (i = 0; i < compare.length; ++i)
			equal = equal && this[compare[i]] === arg[compare[i]];

	if (equal && typeof this.attributes === typeof arg.attributes && this.attributes instanceof NamedNodeMap)
		for (i = 0; i < this.attributes.length; ++i)
		{
			equal = equal && this.attributes[i].nodeName  === arg.hasAttribute(this.attributes[i].nodeName);
			equal = equal && this.attributes[i].nodeValue === arg.getAttribute(this.attributes[i].nodeName);
		}

	if (equal)
	{
		//  normalize both child nodes
		this.normalize();
		arg.normalize();

		if (this.childNodes.length === arg.childNodes.length)
			for (i = 0; i < this.childNodes.length; ++i)
				equal = equal && this.childNodes[i].isEqualNode(arg.childNodes[i]);
	}

	if (equal && this.nodeType === this.DOCUMENT_TYPE_NODE)
	{
		//  TODO: check DocumentType for equality
		//  The following string attributes are equal: publicId, systemId, internalSubset.
		//  - The entities NamedNodeMaps are equal.
		//  - The notations NamedNodeMaps are equal.
	}

	return equal;
};

/**
 *  getFeature
 *  @name    getFeature
 *  @type    method
 *  @access  public
 *  @param   feature, version
 *  @return  void
 */
Node.prototype.getFeature = function(feature, version)
{
	//  TODO: implement Node.getFeature
};

/**
 *  setUserData
 *  @name    setUserData
 *  @type    method
 *  @access  public
 *  @param   key, data, handler
 *  @return  void
 */
Node.prototype.setUserData = function(key, data, handler)
{
	//  TODO: implement Node.setUserData
};

/**
 *  getUserData
 *  @name    getUserData
 *  @type    method
 *  @access  public
 *  @param   key
 *  @return  void
 */
Node.prototype.getUserData = function(key)
{
	//  TODO: implement Node.getUserData
};


//  Expose the Node module
module.exports = Node;
