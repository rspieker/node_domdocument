'use strict';

var Node = require('./node.js'),
	NodeList = require('./nodelist.js'),
	helper = require('../helper.js'),
	factory = require('../simple/factory.js'),
	sys = require('sys');


/**
 *  The Document interface represents the entire HTML or XML document. Conceptually, it is the root of the document
 *  tree, and provides the primary access to the document's data.
 *  @name    Document
 *  @type    function
 *  @access  internal
 *  @param   simple
 *  @return  void
 *  @note    Since elements, text nodes, comments, processing instructions, etc. cannot exist outside the context
 *           of a Document, the Document interface also contains the factory methods needed to create these objects.
 *           The Node objects created have a ownerDocument attribute which associates them with the Document within
 *           whose context they were created.
 */
function Document(simple)
{
	Document.super_.apply(this, [simple || factory.create(9, '#document')]);
}
//  Document extends Node
sys.inherits(Document, Node);

/**
 *  ___property
 *  @name    ___property
 *  @type    method
 *  @access  internal (exposed)
 *  @param
 *  @return  void
 */
Document.prototype.___property = function()
{
	return helper.combine({
		//  readonly attribute DocumentType doctype;
		//  The Document Type Declaration (see DocumentType) associated with this document. For XML documents
		//  without a document type declaration this returns null. For HTML documents, a DocumentType object may
		//  be returned, independently of the presence or absence of document type declaration in the HTML document.
		//  This provides direct access to the DocumentType node, child node of this Document. This node can be set
		//  at document creation time and later changed through the use of child nodes manipulation methods, such
		//  as Node.insertBefore, or Node.replaceChild. Note, however, that while some implementations may
		//  instantiate different types of Document objects supporting additional features than the "Core", such
		//  as "HTML" [DOM Level 2 HTML], based on the DocumentType specified at creation time, changing it
		//  afterwards is very unlikely to result in a change of the features supported.
		doctype: {},
		//  readonly attribute DOMImplementation implementation;
		//  The DOMImplementation object that handles this document. A DOM application may use objects from
		//  multiple implementations.
		implementation: {},
		//  readonly attribute Element documentElement;
		//  This is a convenience attribute that allows direct access to the child node that is the document
		//  element of the document.
		documentElement: {},

		// Introduced in DOM Level 3:

		//  readonly attribute DOMString inputEncoding;
		//  An attribute specifying the encoding used for this document at the time of the parsing. This is null
		//  when it is not known, such as when the Document was created in memory.
		inputEncoding: {},
		//  readonly attribute DOMString xmlEncoding;
		//  An attribute specifying, as part of the XML declaration, the encoding of this document. This is null
		//  when unspecified or when it is not known, such as when the Document was created in memory.
		xmlEncoding: {},
		//  attribute boolean xmlStandalone;
		//  An attribute specifying, as part of the XML declaration, whether this document is standalone. This is
		//  false when unspecified.
		//  Note: No verification is done on the value when setting this attribute. Applications should use
		//  Document.normalizeDocument() with the "validate" parameter to verify if the value matches the validity
		//  constraint for standalone document declaration as defined in [XML 1.0].
		//  Exceptions on setting: DOMException NOT_SUPPORTED_ERR: Raised if this document does not support the
		//  "XML" feature.
		xmlStandalone: {},
		//  attribute DOMString xmlVersion;
		//  An attribute specifying, as part of the XML declaration, the version number of this document. If there
		//  is no declaration and if this document supports the "XML" feature, the value is "1.0". If this document
		//  does not support the "XML" feature, the value is always null. Changing this attribute will affect
		//  methods that check for invalid characters in XML names. Application should invoke
		//  Document.normalizeDocument() in order to check for invalid characters in the Nodes that are already
		//  part of this Document.
		//  DOM applications may use the DOMImplementation.hasFeature(feature, version) method with parameter
		//  values "XMLVersion" and "1.0" (respectively) to determine if an implementation supports [XML 1.0]. DOM
		//  applications may use the same method with parameter values "XMLVersion" and "1.1" (respectively) to
		//  determine if an implementation supports [XML 1.1]. In both cases, in order to support XML, an
		//  implementation must also support the "XML" feature defined in this specification. Document objects
		//  supporting a version of the "XMLVersion" feature must not raise a NOT_SUPPORTED_ERR exception for the
		//  same version number when using Document.xmlVersion.
		//  Exceptions on setting: DOMException NOT_SUPPORTED_ERR: Raised if the version is set to a value that is
		//  not supported by this Document or if this document does not support the "XML" feature.
		xmlVersion: {},
		//  attribute boolean strictErrorChecking;
		//  An attribute specifying whether error checking is enforced or not. When set to false, the
		//  implementation is free to not test every possible error case normally defined on DOM operations, and
		//  not raise any DOMException on DOM operations or report errors while using Document.normalizeDocument().
		//  In case of error, the behavior is undefined. This attribute is true by default.
		strictErrorChecking: {},
		//  attribute DOMString documentURI;
		//  The location of the document or null if undefined or if the Document was created using
		//  DOMImplementation.createDocument. No lexical checking is performed when setting this attribute; this
		//  could result in a null value returned when using Node.baseURI.
		//  Beware that when the Document supports the feature "HTML" [DOM Level 2 HTML], the href attribute of the
		//  HTML BASE element takes precedence over this attribute when computing Node.baseURI.
		documentURI: {},
		//  readonly attribute DOMConfiguration domConfig;
		//  The configuration used when Document.normalizeDocument() is invoked
		domConfig: {}
	}, Node.prototype.___property());
};

/**
 *  ___get_documentElement
 *  @name    ___get_documentElement
 *  @type    method
 *  @access  internal (exposed)
 *  @param
 *  @return  void
 */
Document.prototype.___get_documentElement = function()
{
	var list = this.___simple(function(){
			return this.find(1);
		});

	return list.length > 0 ? factory.instance(list[0]) : null;
};

/**
 *  createElement
 *  @name    createElement
 *  @type    method
 *  @access  public
 *  @param   name
 *  @return  void
 */
Document.prototype.createElement = function(name)
{
	var simple = factory.create(1, name);
	this.___simple(function(){
		simple.owner = this;
	});

	return factory.instance(simple);
};

/**
 *  createTextNode
 *  @name    createTextNode
 *  @type    method
 *  @access  public
 *  @param   data
 *  @return  void
 */
Document.prototype.createTextNode = function(data)
{
	var simple = factory.create(3, '#text', data);
	this.___simple(function(){
		simple.owner = this;
	});

	return factory.instance(simple);
};

/**
 *  createComment
 *  @name    createComment
 *  @type    method
 *  @access  public
 *  @param   data
 *  @return  void
 */
Document.prototype.createComment = function(data)
{
	var simple = factory.create(8, '#comment', data);
	this.___simple(function(){
		simple.owner = this;
	});

	return factory.instance(simple);
};

/**
 *  createCDATASection
 *  @name    createCDATASection
 *  @type    method
 *  @access  public
 *  @param   data
 *  @return  void
 */
Document.prototype.createCDATASection = function(data)
{
	var simple = factory.create(4, '#cdata-section', data);
	this.___simple(function(){
		simple.owner = this;
	});

	return factory.instance(simple);
};

/**
 *  createProcessingInstruction
 *  @name    createProcessingInstruction
 *  @type    method
 *  @access  public
 *  @param   target, data
 *  @return  void
 */
Document.prototype.createProcessingInstruction = function(target, data)
{
	var simple = factory.create(7, target, data);
	this.___simple(function(){
		simple.owner = this;
	});

	return factory.instance(simple);
};

/**
 *  createAttribute
 *  @name    createAttribute
 *  @type    method
 *  @access  public
 *  @param   name
 *  @return  void
 */
Document.prototype.createAttribute = function(name)
{
	var simple = factory.create(2, name);
	this.___simple(function(){
		simple.owner = this;
	});

	return factory.instance(simple);
};

/**
 *  createEntityReference
 *  @name    createEntityReference
 *  @type    method
 *  @access  public
 *  @param   name
 *  @return  void
 */
Document.prototype.createEntityReference = function(name)
{
	var simple = factory.create(5, name);
	this.___simple(function(){
		simple.owner = this;
	});

	return factory.instance(simple);
};

/**
 *  Returns a NodeList of all the Elements in document order with a given tag name and are contained in the
 *  document.
 *  @name    getElementsByTagName
 *  @type    method
 *  @access  public
 *  @param   tagname
 *  @return  NodeList
 */
Document.prototype.getElementsByTagName = function(tagname)
{
	return new NodeList(this.___simple(function(){
		return this.find(1, tagname, true);
	}));
};

/**
 *  Imports a node from another document to this document, without altering or removing the source node from the
 *  original document; this method creates a new copy of the source node.
 *  @name    importNode
 *  @type    method
 *  @access  public
 *  @param   importedNode, deep
 *  @return  Node
 *  @note    The returned node has no parent; (parentNode is null). For all nodes, importing a node creates a node
 *           object owned by the importing document, with attribute values identical to the source node's nodeName
 *           and nodeType, plus the attributes related to namespaces (prefix, localName, and namespaceURI). As in
 *           the cloneNode operation, the source node is not altered. User data associated to the imported node is
 *           not carried over. However, if any UserDataHandlers has been specified along with the associated data
 *           these handlers will be called with the appropriate parameters before this method returns.
 *           Additional information is copied as appropriate to the nodeType, attempting to mirror the behavior
 *           expected if a fragment of XML or HTML source was copied from one document to another, recognizing that
 *           the two documents may have different DTDs in the XML case. The following list describes the specifics
 *           for each type of node.
 *  @note    Attr nodes are copied including its children, regardless of the deep argument
 *  @note    DocumentFragment nodes are copied respecting the deep argument
 *  @note    Document nodes cannot be imported
 *  @note    DocumentType nodes cannot be imported
 *  @note    Element nodes are copied, including any Attr child regardless of the deep argument
 *  @note    Entity nodes can be imported, however these can not be added to the DocumentType as it is read-only in
 *           DOM level 3
 *  @note    EntityReference nodes will be copied without any children, even if a deep import is requested, since
 *           the source and destination documents might have defined the entity differently. If the document being
 *           imported into provides a definition for this entity name, its value is assigned.
 *  @note    Notation nodes can be imported, however in DOM level 3 the DocumentType is readonly
 *  @note    ProcessingInstruction, Text, CDataSection and Comment nodes will be copied nodes will be copied (as
 *           these cannot contain child nodes the deep argument has no effect)
 */
Document.prototype.importNode = function(importedNode, deep)
{
	var simple;

	this.___simple(function(){
		simple = this;
	});

	return factory.instance(importedNode.___simple(function(){
		return this.clone(deep, simple);
	}));
};

/**
 *  createElementNS
 *  @name    createElementNS
 *  @type    method
 *  @access  public
 *  @param   namespaceURI, qualifiedName
 *  @return  void
 */
Document.prototype.createElementNS = function(namespaceURI, qualifiedName)
{
	//  TODO: implement Document.createElementNS
};

/**
 *  createAttributeNS
 *  @name    createAttributeNS
 *  @type    method
 *  @access  public
 *  @param   namespaceURI, qualifiedName
 *  @return  void
 */
Document.prototype.createAttributeNS = function(namespaceURI, qualifiedName)
{
	//  TODO: implement Document.createAttributeNS
};

/**
 *  getElementsByTagNameNS
 *  @name    getElementsByTagNameNS
 *  @type    method
 *  @access  public
 *  @param   namespaceURI, localName
 *  @return  void
 */
Document.prototype.getElementsByTagNameNS = function(namespaceURI, localName)
{
	//  TODO: implement Document.getElementsByTagNameNS
};

/**
 *  getElementById
 *  @name    getElementById
 *  @type    method
 *  @access  public
 *  @param   elementId
 *  @return  mixed node
 */
Document.prototype.getElementById = function(elementId)
{
	//  TODO: getElementById should respect the isId property of Attr instances instead of checking for blunt 'id'
	//  The DOM implementation is expected to use the attribute Attr.isId to determine if an attribute is of type ID
	var simple = this.___simple(function(){
		return this.find(2, 'id', true).filter(function(item){
			return elementId === item.data;
		});
	});

	//  Returns the Element that has an ID attribute with the given value.
	if (simple.length === 1)
		return factory.instance(simple[0].parent);
	//  If more than one element has an ID attribute with that value, what is returned is undefined.
	else if (simple.length > 1)
		return; //  undefined

	//  If no such element exists, this returns null.
	return null;
};
// Introduced in DOM Level 3:
/**
 *  Attempts to adopt a node from another document to this document. If supported, it changes the ownerDocument of the
 *  source node, its children, as well as the attached attribute nodes if there are any. If the source node has a parent
 *  it is first removed from the child list of its parent. This effectively allows moving a subtree from one document to
 *  another (unlike importNode() which create a copy of the source node instead of moving it). When it fails,
 *  applications should use Document.importNode() instead. Note that if the adopted node is already part of this
 *  document (i.e. the source and target document are the same), this method still has the effect of removing the source
 *  node from the child list of its parent, if any. The following list describes the specifics for each type of node.
 *  @name    adoptNode
 *  @type    method
 *  @access  public
 *  @param   source
 *  @return  void
 */
Document.prototype.adoptNode = function(source)
{
	var document = this.___simple(function(){
			return this;
		}),
		sourceSimple = source.___simple(function(){
			return this;
		});

	//  remove the source from its parent, if any
	if (sourceSimple.parent)
	{
		sourceSimple.parent.child = sourceSimple.parent.child.filter(function(child){
			return child !== sourceSimple;
		});
		sourceSimple.parent = null;
	}

	source.___simple(function(){
		var find = this.child ? this.find(null, null, true) : [];

		this.owner = document;
		find.forEach(function(simple){
			simple.owner = document;
		});
	});

	return source;
};

/**
 *  normalizeDocument
 *  @name    normalizeDocument
 *  @type    method
 *  @access  public
 *  @param
 *  @return  void
 */
Document.prototype.normalizeDocument = function()
{
	this.___simple(function(){
		this.normalize();
	});
};

/**
 *  renameNode
 *  @name    renameNode
 *  @type    method
 *  @access  public
 *  @param   n, namespaceURI, qualifiedName
 *  @return  void
 */
Document.prototype.renameNode = function(n, namespaceURI, qualifiedName)
{
	//  TODO: implement Document.renameNode
};


//  Expose the Document module
module.exports = Document;
