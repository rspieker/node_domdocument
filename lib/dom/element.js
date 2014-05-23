var Node = require('./node.js'),
	NodeList = require('./nodelist.js'),
	NamedNodeMap = require('./namednodemap.js'),
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
 *  @return  void
 */
Element.prototype.___property = function()
{
	return helper.combine({
		//  The name of the element. If Node.localName is different from null, this attribute is a qualified name.
		//  TODO: determine whether or not the tagName ought to be uppercased (true if HTML)
		tagName: {key: 'name'},
		//  A NamedNodeMap containing the attributes of this node (if it is an Element) or null otherwise.
		attributes: {get: (function(){
			var map;

			return function(){
				if (!map)
					map = new NamedNodeMap(this.data);
				return map;
			};
		})()},
		//  The type information associated with this element
		schemaTypeInfo: {}
	}, Node.prototype.___property());
};

/**
 *  Retrieves an attribute value by name.
 *  @name    getAttribute
 *  @type    method
 *  @access  public
 *  @param   string  name
 *  @return  string  value
 */
Element.prototype.getAttribute = function(name)
{
	var attr = this.getAttributeNode(name);

	return attr ? attr.nodeValue : null;
};

/**
 *  Adds a new attribute. If an attribute with that name is already present in the element, its value is changed to be
 *  that of the value parameter. This value is a simple string; it is not parsed as it is being set. So any markup
 *  (such as syntax to be recognized as an entity reference) is treated as literal text, and needs to be appropriately
 *  escaped by the implementation when it is written out. In order to assign an attribute value that contains entity
 *  references, the user must create an Attr node plus any Text and EntityReference nodes, build the appropriate
 *  subtree, and use setAttributeNode to assign it as the value of an attribute.
 *  @name    setAttribute
 *  @type    method
 *  @access  public
 *  @param   string  name
 *  @param   string  value
 *  @return  void
 */
Element.prototype.setAttribute = function(name, value)
{
	var attr = this.attributes.getNamedItem(name);

	if (!attr || attr.value !== value)
	{
		attr = this.ownerDocument.createAttribute(name);
		attr.nodeValue = value;
		this.setAttributeNode(attr);
	}
};

/**
 *  Removes an attribute by name. If a default value for the removed attribute is defined in the DTD, a new attribute
 *  immediately appears with the default value as well as the corresponding namespace URI, local name, and prefix when
 *  applicable. The implementation may handle default values from other schemas similarly but applications should use
 *  Document.normalizeDocument() to guarantee this information is up-to-date.
 *  @name    removeAttribute
 *  @type    method
 *  @access  public
 *  @param   string  name
 *  @return  void
 */
Element.prototype.removeAttribute = function(name)
{
	return this.attributes.removeNamedItem(name);
};

/**
 *  Retrieves an attribute node by name.
 *  @name    getAttributeNode
 *  @type    method
 *  @access  public
 *  @param   string  name
 *  @return  Attr    node
 */
Element.prototype.getAttributeNode = function(name)
{
	return this.attributes.getNamedItem(name);
};

/**
 *  Adds a new attribute node. If an attribute with that name (nodeName) is already present in the element, it is
 *  replaced by the new one. Replacing an attribute node by itself has no effect.
 *  @name    setAttributeNode
 *  @type    method
 *  @access  public
 *  @param   Attr  node
 *  @return  Attr  node
 */
Element.prototype.setAttributeNode = function(attr)
{
	return this.attributes.setNamedItem(attr);
};

/**
 *  Removes the specified attribute node. If a default value for the removed Attr node is defined in the DTD, a new node
 *  immediately appears with the default value as well as the corresponding namespace URI, local name, and prefix when
 *  applicable. The implementation may handle default values from other schemas similarly but applications should use
 *  Document.normalizeDocument() to guarantee this information is up-to-date.
 *  @name    removeAttributeNode
 *  @type    method
 *  @access  public
 *  @param   Attr  node
 *  @return  Attr  node
 */
Element.prototype.removeAttributeNode = function(attr)
{
	return this.attributes.removeNamedItem(attr.name) ? attr : null;
};

/**
 *  Returns a NodeList of all descendant Elements with a given tag name, in document order.
 *  @name    getElementsByTagName
 *  @type    method
 *  @access  public
 *  @param   string   name
 *  @return  NodeList nodes
 */
Element.prototype.getElementsByTagName = function(name)
{
	return new NodeList(this.___simple(function(){
		return this.find(1, name, true);
	}));
};

/**
 *  Retrieves an attribute value by local name and namespace URI.
 *  @name    getAttributeNS
 *  @type    method
 *  @access  public
 *  @param   string  namespaceURI
 *  @param   string  localName
 *  @return  string  value
 */
Element.prototype.getAttributeNS = function(namespaceURI, localName)
{
	//  TODO: implement Element.getAttributeNS
};

/**
 *  Adds a new attribute. If an attribute with the same local name and namespace URI is already present on the element,
 *  its prefix is changed to be the prefix part of the qualifiedName, and its value is changed to be the value
 *  parameter. This value is a simple string; it is not parsed as it is being set. So any markup (such as syntax to be
 *  recognized as an entity reference) is treated as literal text, and needs to be appropriately escaped by the
 *  implementation when it is written out. In order to assign an attribute value that contains entity references, the
 *  user must create an Attr node plus any Text and EntityReference nodes, build the appropriate subtree, and use
 *  setAttributeNodeNS or setAttributeNode to assign it as the value of an attribute.
 *  @name    setAttributeNS
 *  @type    method
 *  @access  public
 *  @param   string  namespaceURI
 *  @param   string  qualifiedName
 *  @param   string  value
 *  @return  void
 */
Element.prototype.setAttributeNS = function(namespaceURI, qualifiedName, value)
{
	//  TODO: implement Element.setAttributeNS
};

/**
 *  Removes an attribute by local name and namespace URI. If a default value for the removed attribute is defined in
 *  the DTD, a new attribute immediately appears with the default value as well as the corresponding namespace URI,
 *  local name, and prefix when applicable. The implementation may handle default values from other schemas similarly
 *  but applications should use Document.normalizeDocument() to guarantee this information is up-to-date.
 *  If no attribute with this local name and namespace URI is found, this method has no effect.
 *  @name    removeAttributeNS
 *  @type    method
 *  @access  public
 *  @param   string  namespaceURI
 *  @param   string  localName
 *  @return  void
 */
Element.prototype.removeAttributeNS = function(namespaceURI, localName)
{
	//  TODO: implement Element.removeAttributeNS
};

/**
 *  Retrieves an Attr node by local name and namespace URI.
 *  @name    getAttributeNodeNS
 *  @type    method
 *  @access  public
 *  @param   string  namespaceURI
 *  @param   string  localName
 *  @return  Attr    node
 */
Element.prototype.getAttributeNodeNS = function(namespaceURI, localName)
{
	//  TODO: implement Element.getAttributeNodeNS
};

/**
 *  Adds a new attribute. If an attribute with that local name and that namespace URI is already present in the element,
 *  it is replaced by the new one. Replacing an attribute node by itself has no effect.
 *  @name    setAttributeNodeNS
 *  @type    method
 *  @access  public
 *  @param   Attr  node
 *  @return  Attr  node
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
 *  Returns a NodeList of all the descendant Elements with a given local name and namespace URI in document order.
 *  @name    getElementsByTagNameNS
 *  @type    method
 *  @access  public
 *  @param   string   namespaceURI
 *  @param   string   localName
 *  @return  NodeList nodes
 */
Element.prototype.getElementsByTagNameNS = function(namespaceURI, localName)
{
	//  TODO: implement Element.getElementsByTagNameNS
};

/**
 *  Returns true when an attribute with a given name is specified on this element or has a default value, false otherwise.
 *  @name    hasAttribute
 *  @type    method
 *  @access  public
 *  @param   string  name
 *  @return  bool    hasAttribute
 */
Element.prototype.hasAttribute = function(name)
{
	return this.___simple(function(){
		return this.find(2, name).length > 0;
	});
};

/**
 *  Returns true when an attribute with a given local name and namespace URI is specified on this element or has a
 *  default value, false otherwise.
 *  @name    hasAttributeNS
 *  @type    method
 *  @access  public
 *  @param   string  namespaceURI
 *  @param   string  localName
 *  @return  bool    hasAttributeNS
 */
Element.prototype.hasAttributeNS = function(namespaceURI, localName)
{
	//  TODO: implement Element.hasAttributeNS
};

/**
 *  If the parameter isId is true, this method declares the specified attribute to be a user-determined ID attribute.
 *  This affects the value of Attr.isId and the behavior of Document.getElementById, but does not change any schema that
 *  may be in use, in particular this does not affect the Attr.schemaTypeInfo of the specified Attr node. Use the value
 *  false for the parameter isId to undeclare an attribute for being a user-determined ID attribute.
 *  To specify an attribute by local name and namespace URI, use the setIdAttributeNS method.
 *  @name    setIdAttribute
 *  @type    method
 *  @access  public
 *  @param   string  name
 *  @param   bool    isId
 *  @return  void
 */
Element.prototype.setIdAttribute = function(name, isId)
{
	//  TODO: implement Element.setIdAttribute
};

/**
 *  If the parameter isId is true, this method declares the specified attribute to be a user-determined ID attribute.
 *  This affects the value of Attr.isId and the behavior of Document.getElementById, but does not change any schema that
 *  may be in use, in particular this does not affect the Attr.schemaTypeInfo of the specified Attr node. Use the value
 *  false for the parameter isId to undeclare an attribute for being a user-determined ID attribute.
 *  @name    setIdAttributeNS
 *  @type    method
 *  @access  public
 *  @param   string  namespaceURI
 *  @param   string  localName
 *  @param   bool    isId
 *  @return  void
 */
Element.prototype.setIdAttributeNS = function(namespaceURI, localName, isId)
{
	//  TODO: implement Element.setIdAttributeNS
};

/**
 *  If the parameter isId is true, this method declares the specified attribute to be a user-determined ID attribute.
 *  This affects the value of Attr.isId and the behavior of Document.getElementById, but does not change any schema that
 *  may be in use, in particular this does not affect the Attr.schemaTypeInfo of the specified Attr node. Use the value
 *  false for the parameter isId to undeclare an attribute for being a user-determined ID attribute.
 *  @name    setIdAttributeNode
 *  @type    method
 *  @access  public
 *  @param   Attr  node
 *  @param   bool  isId
 *  @return  void
 */
Element.prototype.setIdAttributeNode = function(attr, isId)
{
	//  TODO: implement Element.setIdAttributeNode
};


//  Expose the Element module
module.exports = Element;
