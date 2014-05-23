var Core = require('./core.js'),
	NodeList = require('./nodelist.js'),
	DOMException = require('../dom/exception.js'),
	helper = require('../helper.js'),
	factory = require('../simple/factory.js'),
	sys = require('sys');


/**
 *  The Node interface is the primary datatype for the entire Document Object Model. It represents a single node in the
 *  document tree. While all objects implementing the Node interface expose methods for dealing with children, not all
 *  objects implementing the Node interface may have children. For example, Text nodes may not have children, and adding
 *  children to such nodes results in a DOMException being raised.
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
		//  The name of this node, depending on its type
		nodeName:   {key: 'name', locked: true},
		//  The value of this node, depending on its type. When it is defined to be null, setting it has no effect,
		//  including if the node is read-only.
		nodeValue:  {key: 'data', set: true},
		//  A code representing the type of the underlying object
		nodeType:   {key: 'type', locked: true},
		//  The parent of this node. All nodes, except Attr, Document, DocumentFragment, Entity, and Notation may have
		//  a parent. However, if a node has just been created and not yet added to the tree, or if it has been removed
		//  from the tree, this is null.
		parentNode: {key: 'parent'},
		//  A NodeList that contains all children of this node. If there are no children, this is a NodeList containing
		//  no nodes.
		childNodes: {get: function(){
			//  TODO:  cache this properly

			if (!this.childNodeList)
				this.childNodeList = new NodeList(this.child);

			return this.childNodeList;
		}},
		//  The first child of this node. If there is no such node, this returns null.
		firstChild: {get: function(){
			return this.child.length > 0 ? factory.instance(this.child[0]) : null;
		}},
		//  The last child of this node. If there is no such node, this returns null.
		lastChild: {get: function(){
			return this.child.length > 0 ? factory.instance(this.child[this.child.length - 1]) : null;
		}},
		//  The node immediately preceding this node. If there is no such node, this returns null.
		previousSibling: {get: function(){
			var self = this,
				index;

			this.parent.child.forEach(function(item, i){
				if (item === self)
					index = i - 1;
			});

			return index >= 0 ? factory.instance(this.parent.child[index]) : null;
		}},
		//  The node immediately following this node. If there is no such node, this returns null.
		nextSibling: {get: function(){
			var self = this,
				index;

			this.parent.child.forEach(function(item, i){
				if (item === self)
					index = i + 1;
			});

			return index < this.parent.child.length ? factory.instance(this.parent.child[index]) : null;
		}},
		//  A NamedNodeMap containing the attributes of this node (if it is an Element) or null otherwise.
		attributes: {get: function(){
			return null;
		}},
		//  The Document object associated with this node. This is also the Document object used to create new nodes.
		//  When this node is a Document or a DocumentType which is not used with any Document yet, this is null.
		ownerDocument: {key: 'owner'},
		//  The namespace URI of this node, or null if it is unspecified (see XML Namespaces).
		//  This is not a computed value that is the result of a namespace lookup based on an examination of the
		//  namespace declarations in scope. It is merely the namespace URI given at creation time.
		//  For nodes of any type other than ELEMENT_NODE and ATTRIBUTE_NODE and nodes created with a DOM Level 1
		//  method, such as Document.createElement(), this is always null.
		namespaceURI: {
			//  TODO: implement Node.namespaceURI
		},
		//  The namespace prefix of this node, or null if it is unspecified. When it is defined to be null, setting it
		//  has no effect, including if the node is read-only.
		//  Note that setting this attribute, when permitted, changes the nodeName attribute, which holds the qualified
		//  name, as well as the tagName and name attributes of the Element and Attr interfaces, when applicable.
		//  Setting the prefix to null makes it unspecified, setting it to an empty string is implementation dependent.
		//  Note also that changing the prefix of an attribute that is known to have a default value, does not make a
		//  new attribute with the default value and the original prefix appear, since the namespaceURI and localName
		//  do not change.
		//  For nodes of any type other than ELEMENT_NODE and ATTRIBUTE_NODE and nodes created with a DOM Level 1
		//  method, such as createElement from the Document interface, this is always null.
		prefix: {
			//  TODO: implement Node.prefix
		},
		//  Returns the local part of the qualified name of this node.
		//  For nodes of any type other than ELEMENT_NODE and ATTRIBUTE_NODE and nodes created with a DOM Level 1
		//  method, such as Document.createElement(), this is always null.
		localName: {
			//  TODO: implement Node.localName
		},
		//  The absolute base URI of this node or null if the implementation wasn't able to obtain an absolute URI.
		//  This value is computed as described in Base URIs. However, when the Document supports the feature "HTML"
		//  [DOM Level 2 HTML], the base URI is computed using first the value of the href attribute of the HTML BASE
		//  element if any, and the value of the documentURI attribute from the Document interface otherwise.
		baseURI: {get: function(){
			return this.owner.prop.uri;
		}},
		//  This attribute returns the text content of this node and its descendants. When it is defined to be null,
		//  setting it has no effect. On setting, any possible children this node may have are removed and, if it the
		//  new string is not empty or null, replaced by a single Text node containing the string this attribute is
		//  set to.
		//  On getting, no serialization is performed, the returned string does not contain any markup. No whitespace
		//  normalization is performed and the returned string does not contain the white spaces in element content
		//  (see the attribute Text.isElementContentWhitespace). Similarly, on setting, no parsing is performed either,
		//  the input string is taken as pure textual content.
		textContent: {
			//  TODO: implement Node.textContent (setter)
			get: function(){
				switch (this.type)
				{
					case 1:   //  Node
					case 2:   //  Attr
					case 5:   //  EntityReference
					case 6:   //  Entity
					case 11:  //  DocumentFragment
						//  find all Simples for this node, filter the relevant nodes and combine the resulting array of strings.
						return this.find(null, null, true).map(function(simple){
							//  if it is type 3 (Text) or 4 (CData) and of type string, return it, return '' otherwise
							return (simple.type === 3 || simple.type === 4) && 'string' === typeof simple.data ? simple.data : '';
						}).join('');
						break;

					case 3:  //  Text
					case 4:  //  CData
					case 7:  //  ProcessingInstruction
					case 8:  //  Comment
						return this.data;
						break;
				}

				return null;
			}
		}
	}, Core.prototype.___property());
};

/**
 *  Magic setter for nodeValue
 *  @name    ___set_nodeValue
 *  @type    method
 *  @access  internal (exposed)
 *  @param   string  value
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
 *  Magic getter for parentNode
 *  @name    ___get_parentNode
 *  @type    method
 *  @access  internal (exposed)
 *  @return  Node  parentNode
 */
Node.prototype.___get_parentNode = function()
{
	return this.___simple(function(){
		return factory.instance(this.parent);
	});
};

/**
 *  Magic getter for ownerDocument
 *  @name    ___get_ownerDocument
 *  @type    method
 *  @access  internal (exposed)
 *  @return  Document  ownerDocument
 */
Node.prototype.___get_ownerDocument = function()
{
	return this.___simple(function(){
		return factory.instance(this.owner);
	});
};

/**
 *  Inserts the node newChild before the existing child node refChild. If refChild is null, insert newChild at the end
 *  of the list of children.
 *  If newChild is a DocumentFragment object, all of its children are inserted, in the same order, before refChild.
 *  If the newChild is already in the tree, it is first removed.
 *  @name    insertBefore
 *  @type    method
 *  @access  public
 *  @param   Node newChild
 *  @param   Node oldChild
 *  @return  Node newChild
 */
Node.prototype.insertBefore = function(newChild, refChild)
{
	var simple, newSimple, refSimple, index;

	if (this.ownerDocument !== newChild.ownerDocument)
		throw new DOMException('WRONG_DOCUMENT_ERR');

	if (this !== refChild.parentNode)
		throw new DOMException('NOT_FOUND_ERR');

	newChild.___simple(function(){
		newSimple = this;
	});

	refChild.___simple(function(){
		var current = this;
		refSimple = current;

		//  walk up the ancestor tree and see if the newSimple is one of the ancestors
		while (current)
		{
			if (current === newSimple)
				throw new DOMException('HIERARCHY_REQUEST_ERR');
			current = current.parent || false;
		}
	});

	this.___simple(function(){
		simple = this;
	});

	index = simple.index(refSimple);

	if (false === index)
		throw new DOMException('NOT_FOUND_ERR'); //  would be weird if we'd have to throw this one here instead of above

	simple.child = simple.child.slice(0, index).concat([newSimple], simple.child.slice(index));
	newChild.parentNode.removeChild(newChild);
	newSimple.parent = simple;

	return newChild;
};

/**
 *  Replaces the child node oldChild with newChild in the list of children, and returns the oldChild node.
 *  If newChild is a DocumentFragment object, oldChild is replaced by all of the DocumentFragment children, which are
 *  inserted in the same order. If the newChild is already in the tree, it is first removed.
 *  @name    replaceChild
 *  @type    method
 *  @access  public
 *  @param   Node newChild
 *  @param   Node oldChild
 *  @return  Node oldChild
 */
Node.prototype.replaceChild = function(newChild, oldChild)
{
	this.insertBefore(newChild, oldChild);

	return this.removeChild(oldChild);
};

/**
 *  Removes the child node indicated by oldChild from the list of children, and returns it.
 *  @name    removeChild
 *  @type    method
 *  @access  public
 *  @param   Node oldChild
 *  @return  Node oldChild
 */
Node.prototype.removeChild = function(oldChild)
{
	//  delegate the actual removal to the simple object of the Node
	this.___simple(function(){
		var length = this.child.length;

		if (this.childNodeList)
			delete this.childNodeList;

		//  here we simply filter out the child we desire to remove
		this.child = this.child.filter(function(child){
			return child.instance !== oldChild;
		});

		if (this.child.length === length)
			throw new DOMException('NOT_FOUND_ERR');
	});

	return oldChild;
};

/**
 *  Adds the node newChild to the end of the list of children of this node. If the newChild is already in the tree, it
 *  is first removed.
 *  @name    appendChild
 *  @type    method
 *  @access  public
 *  @param   Node newChild
 *  @return  Node newChild
 */
Node.prototype.appendChild = function(newChild)
{
	var parent = newChild.parentNode,
		simple;

	if (this.ownerDocument !== newChild.ownerDocument)
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
 *  Returns whether this node has any children.
 *  @name    hasChildNodes
 *  @type    method
 *  @access  public
 *  @return  bool hasChildNodes
 */
Node.prototype.hasChildNodes = function()
{
	return this.___simple(function(){
		return this.child.length > 0;
	});
};

/**
 *  Returns a duplicate of this node, i.e., serves as a generic copy constructor for nodes. The duplicate node has no
 *  parent (parentNode is null) and no user data. User data associated to the imported node is not carried over.
 *  However, if any UserDataHandlers has been specified along with the associated data these handlers will be called
 *  with the appropriate parameters before this method returns.
 *  @name    cloneNode
 *  @type    method
 *  @access  public
 *  @param   bool deep
 *  @return  Node clonedNode
 */
Node.prototype.cloneNode = function(deep)
{
	return factory.instance(this.___simple(function(){
		return this.clone(deep);
	}));
};

/**
 *  Puts all Text nodes in the full depth of the sub-tree underneath this Node, including attribute nodes, into a
 *  "normal" form where only structure (e.g., elements, comments, processing instructions, CDATA sections, and entity
 *  references) separates Text nodes, i.e., there are neither adjacent Text nodes nor empty Text nodes. This can be
 *  used to ensure that the DOM view of a document is the same as if it were saved and re-loaded, and is useful when
 *  operations (such as XPointer [XPointer] lookups) that depend on a particular document tree structure are to be used.
 *  If the parameter "normalize-characters" of the DOMConfiguration object attached to the Node.ownerDocument is true,
 *  this method will also fully normalize the characters of the Text nodes.
 *  @name    normalize
 *  @type    method
 *  @access  public
 *  @return  void
 */
Node.prototype.normalize = function()
{
	this.___simple(function(){
		this.normalize();
	});
};

/**
 *  Tests whether the DOM implementation implements a specific feature and that feature is supported by this node, as
 *  specified in DOM Features.
 *  @name    isSupported
 *  @type    method
 *  @access  public
 *  @param   string  feature
 *  @param   string  version
 *  @return  bool    isSupported
 */
Node.prototype.isSupported = function(feature, version)
{
	//  TODO: implement Node.isSupported
};

/**
 *  Compares the reference node, i.e. the node on which this method is being called, with a node, i.e. the one passed
 *  as a parameter, with regard to their position in the document and according to the document order.
 *  @name    compareDocumentPosition
 *  @type    method
 *  @access  public
 *  @param   Node    other
 *  @return  Number  position
 */
Node.prototype.compareDocumentPosition = function(other)
{
	//  TODO: test Node.compareDocumentPosition
	var simple = {},
		search, i;

	//  first check if the Nodes are the same, in which case we return 0 (no flags are set)
	if (this.isSameNode(other))
		return 0;

	//  Obtain both Simple objects and build a list of their respective parents
	this.___simple(function(){
		var node = this;
		simple.a = [node];

		for (; node; node = node.parent)
			simple.a.unshift(node);
	});
	other.___simple(function(){
		var node = this;
		simple.b = [node];

		for (; node; node = node.parent)
			simple.b.unshift(node);
	});

	//  if the final ancestors do not match... they are disconnected
	if (simple.a[0] !== simple.b[0])
		return this.DOCUMENT_POSITION_DISCONNECTED;

	for (i = 0; i < simple.a.length; ++i)
		if (simple.a[i] !== simple.b[i])
		{
			search = simple.a[i - 1];
			break;
		}

	//  if search now matches the last simple.a element (the Simple of this), we know 'other' is contained by 'this'
	if (search === simple.a[simple.a.length - 1])
		//  the node contains the reference node. A node which contains is always preceding, too.
		return this.DOCUMENT_POSITION_CONTAINS + this.DOCUMENT_POSITION_PRECEDING;

	//  if search now matches the last simple.b element (the Simple of other), we know 'this' is contained by 'other'
	if (search === simple.b[simple.b.length - 1])
		//  the node is contained by the reference node. A node which is contained is always following, too.
		return this.DOCUMENT_POSITION_CONTAINED_BY + this.DOCUMENT_POSITION_FOLLOWING;

	//  as we are still inside the function, we now know we need to consider document order, we will find all (same
	//  type, if possible) nodes and see which comes first.
	//  make life easier by creating more direct references to the Simple nodes we are looking for
	simple.a = simple.a[simple.a.length - 1];
	simple.b = simple.b[simple.b.length - 1];
	search = search.find(simple.a.type === simple.b.type ? simple.a.type : null, null, true);
	for (i = 0; i < search.length; ++i)
	{
		if (search[i] === simple.a)
			return this.DOCUMENT_POSITION_FOLLOWING;
		else if (search[i] === simple.a)
			return this.DOCUMENT_POSITION_PRECEDING;
	}

	return this.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;
};

/**
 *  Returns whether this node is the same node as the given one.
 *  This method provides a way to determine whether two Node references returned by the implementation reference the
 *  same object. When two Node references are references to the same object, even if through a proxy, the references
 *  may be used completely interchangeably, such that all attributes have the same values and calling the same DOM
 *  method on either reference always has exactly the same effect.
 *  @name    isSameNode
 *  @type    method
 *  @access  public
 *  @param   Node  other
 *  @return  bool  isSameNode
 */
Node.prototype.isSameNode = function(other)
{
	return other === this;
};

/**
 *  Look up the prefix associated to the given namespace URI, starting from this node. The default namespace
 *  declarations are ignored by this method.
 *  @name    lookupPrefix
 *  @type    method
 *  @access  public
 *  @param   string  namespaceURI
 *  @return  string  prefix
 */
Node.prototype.lookupPrefix = function(namespaceURI)
{
	//  TODO: implement Node.lookupPrefix
};

/**
 *  This method checks if the specified namespaceURI is the default namespace or not.
 *  @name    isDefaultNamespace
 *  @type    method
 *  @access  public
 *  @param   string  namespaceURI
 *  @return  bool    isDefaultNamespace
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
		//  normalize both nodes
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
 *  This method returns a specialized object which implements the specialized APIs of the specified feature and version,
 *  as specified in DOM Features. The specialized object may also be obtained by using binding-specific casting methods
 *  but is not necessarily expected to, as discussed in Mixed DOM Implementations. This method also allow the
 *  implementation to provide specialized objects which do not support the Node interface.
 *  @name    getFeature
 *  @type    method
 *  @access  public
 *  @param   string  feature
 *  @param   string  version
 *  @return  mixed   feature [one of: null, object which implements the specialized API]
 */
Node.prototype.getFeature = function(feature, version)
{
	//  TODO: implement Node.getFeature
};

/**
 *  Associate an object to a key on this node. The object can later be retrieved from this node by calling getUserData
 *  with the same key.
 *  @name    setUserData
 *  @type    method
 *  @access  public
 *  @param   string    key
 *  @param   object    data
 *  @param   function  handler
 *  @return  object    previousData [null, if there was no previous data]
 */
Node.prototype.setUserData = function(key, data, handler)
{
	//  TODO: implement Node.setUserData
};

/**
 *  Retrieves the object associated to a key on a this node. The object must first have been set to this node by calling
 *  setUserData with the same key.
 *  @name    getUserData
 *  @type    method
 *  @access  public
 *  @param   string  key
 *  @return  DOMUserData
 */
Node.prototype.getUserData = function(key)
{
	//  TODO: implement Node.getUserData
};


//  Expose the Node module
module.exports = Node;
