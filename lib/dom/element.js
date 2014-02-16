var Node = require('./node.js'),
	NodeList = require('./nodelist.js'),
	helper = require('../helper.js'),
	sys = require('sys');


/**
 *  Element
 *  @name    Element
 *  @type    function
 *  @access  internal
 *  @param   simple
 *  @return  void
 */
function Element(simple)
{
	Element.super_.apply(this, [simple]);
}
//  Element extends Node
sys.inherits(Element, Node);

/**
 *  ___property
 *  @name    ___property
 *  @type    method
 *  @access  internal (exposed)
 *  @param
 *  @return  void
 */
Element.prototype.___property = function()
{
	return helper.combine({
		//  A NamedNodeMap containing the attributes of this node (if it is an Element) or null otherwise.
		attributes: {get: function(){
			return new NamedNodeMap(this.data);
		}},
		//  readonly attribute TypeInfo schemaTypeInfo;
		schemaTypeInfo: {}
	}, Node.prototype.___property());
};

/**
 *  getAttribute
 *  @name    getAttribute
 *  @type    method
 *  @access  public
 *  @param   name
 *  @return  void
 */
Element.prototype.getAttribute = function(name)
{
	var attr = this.getAttributeNode(name);

	return attr ? attr.nodeValue : null;
};

/**
 *  setAttribute
 *  @name    setAttribute
 *  @type    method
 *  @access  public
 *  @param   name, value
 *  @return  void
 */
Element.prototype.setAttribute = function(name, value)
{
	//  TODO: implement Element.setAttribute
};

/**
 *  removeAttribute
 *  @name    removeAttribute
 *  @type    method
 *  @access  public
 *  @param   name
 *  @return  void
 */
Element.prototype.removeAttribute = function(name)
{
	//  TODO: implement Element.removeAttribute
};

/**
 *  getAttributeNode
 *  @name    getAttributeNode
 *  @type    method
 *  @access  public
 *  @param   name
 *  @return  void
 */
Element.prototype.getAttributeNode = function(name)
{
	return this.attributes.getNamedItem(name);
};

/**
 *  setAttributeNode
 *  @name    setAttributeNode
 *  @type    method
 *  @access  public
 *  @param   attr
 *  @return  void
 */
Element.prototype.setAttributeNode = function(attr)
{
	//  TODO: implement Element.setAttributeNode
};

/**
 *  removeAttributeNode
 *  @name    removeAttributeNode
 *  @type    method
 *  @access  public
 *  @param   attr
 *  @return  void
 */
Element.prototype.removeAttributeNode = function(attr)
{
	//  TODO: implement Element.removeAttributeNode
};

/**
 *  Returns a NodeList of all the Elements in document order with a given tag name and are contained in the
 *  document.
 *  @name    getElementsByTagName
 *  @type    method
 *  @access  public
 *  @param   name
 *  @return  NodeList
 */
Element.prototype.getElementsByTagName = function(name)
{
	return new NodeList(this.___simple(function(){
		return this.find(1, name, true);
	}));
};

/**
 *  getAttributeNS
 *  @name    getAttributeNS
 *  @type    method
 *  @access  public
 *  @param   namespaceURI, localName
 *  @return  void
 */
Element.prototype.getAttributeNS = function(namespaceURI, localName)
{
	//  TODO: implement Element.getAttributeNS
};

/**
 *  setAttributeNS
 *  @name    setAttributeNS
 *  @type    method
 *  @access  public
 *  @param   namespaceURI, qualifiedName, value
 *  @return  void
 */
Element.prototype.setAttributeNS = function(namespaceURI, qualifiedName, value)
{
	//  TODO: implement Element.setAttributeNS
};

/**
 *  removeAttributeNS
 *  @name    removeAttributeNS
 *  @type    method
 *  @access  public
 *  @param   namespaceURI, localName
 *  @return  void
 */
Element.prototype.removeAttributeNS = function(namespaceURI, localName)
{
	//  TODO: implement Element.removeAttributeNS
};

/**
 *  getAttributeNodeNS
 *  @name    getAttributeNodeNS
 *  @type    method
 *  @access  public
 *  @param   namespaceURI, localName
 *  @return  void
 */
Element.prototype.getAttributeNodeNS = function(namespaceURI, localName)
{
	//  TODO: implement Element.getAttributeNodeNS
};

/**
 *  setAttributeNodeNS
 *  @name    setAttributeNodeNS
 *  @type    method
 *  @access  public
 *  @param   attr
 *  @return  void
 */
Element.prototype.setAttributeNodeNS = function(attr)
{
	//  TODO: implement Element.setAttributeNodeNS
};

/**
 *  removeAttributeNodeNS
 *  @name    removeAttributeNodeNS
 *  @type    method
 *  @access  public
 *  @param   attr
 *  @return  void
 */
Element.prototype.removeAttributeNodeNS = function(attr)
{
	//  TODO: implement Element.removeAttributeNodeNS
};

/**
 *  getElementsByTagNameNS
 *  @name    getElementsByTagNameNS
 *  @type    method
 *  @access  public
 *  @param   namespaceURI, localName
 *  @return  void
 */
Element.prototype.getElementsByTagNameNS = function(namespaceURI, localName)
{
	//  TODO: implement Element.getElementsByTagNameNS
};

/**
 *  hasAttribute
 *  @name    hasAttribute
 *  @type    method
 *  @access  public
 *  @param   name
 *  @return  void
 */
Element.prototype.hasAttribute = function(name)
{
	//  TODO: implement Element.hasAttribute
};

/**
 *  hasAttributeNS
 *  @name    hasAttributeNS
 *  @type    method
 *  @access  public
 *  @param   namespaceURI, localName
 *  @return  void
 */
Element.prototype.hasAttributeNS = function(namespaceURI, localName)
{
	//  TODO: implement Element.hasAttributeNS
};

/**
 *  setIdAttribute
 *  @name    setIdAttribute
 *  @type    method
 *  @access  public
 *  @param   name, isId
 *  @return  void
 */
Element.prototype.setIdAttribute = function(name, isId)
{
	//  TODO: implement Element.setIdAttribute
};

/**
 *  setIdAttributeNS
 *  @name    setIdAttributeNS
 *  @type    method
 *  @access  public
 *  @param   namespaceURI, localName, isId
 *  @return  void
 */
/**
 *  setIdAttributeNS
 *  @name    setIdAttributeNS
 *  @type    method
 *  @access  public
 *  @param   namespaceURI, localName, isId
 *  @return  void
 */
Element.prototype.setIdAttributeNS = function(namespaceURI, localName, isId)
{
	//  TODO: implement Element.setIdAttributeNS
};

/**
 *  setIdAttributeNode
 *  @name    setIdAttributeNode
 *  @type    method
 *  @access  public
 *  @param   attr, isId
 *  @return  void
 */
Element.prototype.setIdAttributeNode = function(attr, isId)
{
	//  TODO: implement Element.setIdAttributeNode
};


//  Expose the Element module
module.exports = Element;
