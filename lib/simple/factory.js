function SimpleFactory()
{
	'use strict';

	var factory = this,
		Simple = require('./simple.js'),
		Core = require('../dom/core.js'),
		DOMException = require('../dom/exception.js'),

		//  These are the variables which (will) contain the DOM modules, we can't load them right here as it
		//  would render us with a disfunction SimpleFactory instance in those modules because it is not yet
		//  fully constructed. Hence we've moved the actual requiring to a more JIT-like approach.
		Document,
		DocumentFragment,
		Element,
		Attr,
		Text,
		CDATASection,
		ProcessingInstruction,
		Comment
	;


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
		{
			switch (child.type || 0)
			{
				case Core.prototype.DOCUMENT_NODE:
					if (!Document)
						Document = require('../dom/document.js');
					child.instance = new Document(child);
					break;

				case Core.prototype.ATTRIBUTE_NODE:
					if (!Attr)
						Attr = require('../dom/attr.js');
					child.instance = new Attr(child);
					break;

				case Core.prototype.ELEMENT_NODE:
					if (!Element)
						Element = require('../dom/element.js');
					child.instance = new Element(child);
					break;

				case Core.prototype.TEXT_NODE:
					if (!Text)
						Text = require('../dom/text.js');
					child.instance = new Text(child);
					break;

				case Core.prototype.CDATA_SECTION_NODE:
					if (!CDATASection)
						CDATASection = require('../dom/cdatasection.js');
					child.instance = new CDATASection(child);
					break;

				case Core.prototype.COMMENT_NODE:
					if (!Comment)
						Comment = require('../dom/comment.js');
					child.instance = new Comment(child);
					break;

				case Core.prototype.PROCESSING_INSTRUCTION_NODE:
					if (!ProcessingInstruction)
						ProcessingInstruction = require('../dom/processinginstruction.js');
					child.instance = new ProcessingInstruction(child);
					break;

				case Core.prototype.ENTITY_REFERENCE_NODE:
				case Core.prototype.ENTITY_NODE:
				case Core.prototype.DOCUMENT_TYPE_NODE:
				case Core.prototype.DOCUMENT_FRAGMENT_NODE:
				case Core.prototype.NOTATION_NODE:
					throw new DOMException('NOT_SUPPORTED_ERR');
			}
		}

		return child ? child.instance || null : null;
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
}

module.exports = new SimpleFactory();
