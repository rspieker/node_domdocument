function SimpleFactory()
{
	'use strict';

	var factory = this,
		Simple = require('./simple.js'),
		Core = require('../dom/core.js'),
		DOMException = require('../dom/exception.js'),
		resolver = {},
		modules = {}
	;


	/**
	 *  Initialize the SimpleFactory
	 *  @name    init
	 *  @type    function
	 *  @access  internal
	 *  @return  void
	 */
	function init()
	{
		resolver[Core.prototype.DOCUMENT_NODE] = 'document';
		resolver[Core.prototype.ATTRIBUTE_NODE] = 'attr';
		resolver[Core.prototype.ELEMENT_NODE] = 'element';
		resolver[Core.prototype.TEXT_NODE] = 'text';
		resolver[Core.prototype.CDATA_SECTION_NODE] = 'cdatasection';
		resolver[Core.prototype.COMMENT_NODE] = 'comment';
		resolver[Core.prototype.PROCESSING_INSTRUCTION_NODE] = 'processinginstruction';
		resolver[Core.prototype.DOCUMENT_FRAGMENT_NODE] = 'documentfragment';
		resolver[Core.prototype.DOCUMENT_TYPE_NODE] = 'documenttype';
	}

	/**
	 *  Lookup a module by the type, require the file if needed and return an instance of it
	 *  @name    jit
	 *  @type    function
	 *  @access  internal
	 *  @param   int     nodeType
	 *  @param   Simple  node
	 *  @return  mixed DOM-Instance
	 */
	function jit(type, child)
	{
		var name = type in resolver ? resolver[type] : null;

		if (!name)
			throw new DOMException('NOT_SUPPORTED_ERR');

		if (!(name in modules))
			modules[name] = require('../dom/' + name + '.js');

		return new modules[name](child);
	}

	/**
	 *  Obtain the DOMNode instance of a Simple object, create it if it does not yet exist
	 *  @name    instance
	 *  @type    function
	 *  @access  internal
	 *  @param   Simple child
	 *  @return  void
	 */
	function instance(child)
	{
		if (child && !child.instance)
			child.instance = jit(child.type, child);

		return child ? child.instance : null;
	}



	/**
	 *  Create a new Simple object representing a DOMNode of given type
	 *  @name    create
	 *  @type    method
	 *  @access  public
	 *  @param   number  nodeType
	 *  @param   string  nodeName
	 *  @param   mixed   data
	 *  @return  Simple  object
	 */
	factory.create = function(type, name, data)
	{
		return new Simple(type, name, data);
	};

	/**
	 *  Obtain the appropriate DOMNode instance of given Simple object
	 *  @name    instance
	 *  @type    method
	 *  @access  public
	 *  @param   Simple  object
	 *  @return  DOMNode instance
	 */
	factory.instance = function(simple)
	{
		return instance(simple);
	};

	init();
}

module.exports = new SimpleFactory();
