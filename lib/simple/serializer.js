/*
 *  Serialize a DOM Tree created by a structure of Simple objects
 *  @name    SimpleSerializer
 *  @package DOMDocument
 */
function SimpleSerializer()
{
	//  if an __instance property is found, the object is already constructed and should be returned
	if (SimpleSerializer.prototype.__instance)
		return SimpleSerializer.prototype.__instance;
	//  make a reference to 'this' and set it to be the __instance returned as singleton
	SimpleSerializer.prototype.__instance = this;


	var serializer = this,
		//  default options
		defaults = {
			//  remove redundant white space
			preserveWhiteSpace: false,
			//  remove comments
			preserveComment: false,
			//  remove empty attributes
			removeEmptyAttributes: true
		},

		//  entity map
		entity = {
			'<': '&lt;',
			'>': '&gt;',
			'&': '&amp;',
			'"': '&quote;'
		},

		//  patterns (defined for the object instance so it can be cached)
		pattern = {
			//  match all string starting with html (case insensitive)
			html: /^html.*/i,
			//  attributes which do not require a value (HTML mode only)
			autoFill: /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
			//  nodes which do not allow content
			selfClosing: /^(?:area|base|basefont|br|col|command|embed|frame|hr|img|input|isindex|keygen|link|meta|param|source|track|wbr)$/i,
			//  nodes which do always require a closing tag
			endTag: /^(?:script|style)$/i,
			//  attribute values for which it is safe to leave out the quotes
			quoteLessAttribute: /^[^"'=><` ]+$/i,
			//  characters which are required to write as entities in text nodes
			encode: /[<&]/g,
			//  helper pattern to obtain one of xml, html, xhtml from the input (any doctype or processing instruction)
			detectFormat: /((?:x?)(?:ht)?ml)/i,
			preserveWhiteSpace: /pre|script/i
		}
	;

	//  public constants

	//  declare the types as they occur in the 'xmldom' module (which aligns with the DOM2 spec, of course)
	serializer.ELEMENT_NODE                = 1;
	serializer.ATTRIBUTE_NODE              = 2;
	serializer.TEXT_NODE                   = 3;
	serializer.CDATA_SECTION_NODE          = 4;
	serializer.ENTITY_REFERENCE_NODE       = 5;
	serializer.ENTITY_NODE                 = 6;
	serializer.PROCESSING_INSTRUCTION_NODE = 7;
	serializer.COMMENT_NODE                = 8;
	serializer.DOCUMENT_NODE               = 9;
	serializer.DOCUMENT_TYPE_NODE          = 10;
	serializer.DOCUMENT_FRAGMENT_NODE      = 11;
	serializer.NOTATION_NODE               = 12;



	/*
	 *  Resolve the entity value for given character
	 *  @name   encode
	 *  @type   function
	 *  @access internal
	 *  @param  string character
	 *  @return string entity
	 */
	function encode(character)
	{
		return character in entity ? entity[character] : '&#' + character.charCodeAt() + ';';
	}

	/*
	 *  Extract the available (if any) xml, xhtml, html string from given value
	 *  @name   detectFormat
	 *  @type   function
	 *  @access internal
	 *  @param  string value
	 *  @return string output format
	 */
	function detectFormat(value)
	{
		var match = value.match(pattern.detectFormat);

		return match[0].toLowerCase();
	}

	/*
	 *  Determine if the given format matches the HTML pattern
	 *  @name   isHTML
	 *  @type   function
	 *  @access internal
	 *  @param  string output format
	 *  @return bool   html
	 */
	function isHTML(format)
	{
		return pattern.html.test(format || defaults.format);
	}

	/*
	 *  Determine if the attribute requires a value (HTML mode only)
	 *  @name   isAutoFill
	 *  @type   function
	 *  @access internal
	 *  @param  string attribute name
	 *  @param  string output format
	 *  @return bool   autofill
	 */
	function isAutoFill(name, format)
	{
		return isHTML(format) && pattern.autoFill.test(name);
	}

	/*
	 *  Determine if the attribute value must be quoted (quoted may be omitted in HTML mode only)
	 *  @name   quoteAttribute
	 *  @type   function
	 *  @access internal
	 *  @param  string attribute value
	 *  @param  string output format
	 *  @return string quote char
	 */
	function quoteAttribute(value, format)
	{
		var quote = '"';
		if (isHTML(format))
		{
			if (pattern.quoteLessAttribute.test(value))
				quote = '';
			else if (value.indexOf('"') >= 0)
				quote = "'";
		}
		return quote;
	}

	/*
	 *  Determine if the element must self close
	 *  @name   isSelfClosing
	 *  @type   function
	 *  @access internal
	 *  @param  string node name
	 *  @return bool   selfclose
	 */
	function isSelfClosing(name)
	{
		return pattern.selfClosing.test(name);
	}

	/*
	 *  Determine if a closing tag is required (HTML mode only)
	 *  @name   isEndTagMandatory
	 *  @type   function
	 *  @access internal
	 *  @param  string node name
	 *  @param  string output format
	 *  @return bool   required
	 */
	function isEndTagMandatory(name, format)
	{
		return isHTML(format) && pattern.endTag.test(name);
	}


	/*
	 *  Build a string representation of the given DOM-node
	 *  @name   serializeToString
	 *  @type   function
	 *  @access internal
	 *  @param  DOMNode
	 *  @param  Array  buffer
	 *  @param  object options
	 *  @return void
	 *  @note   the buffer param acts as output variable, it'll get modified
	 */
	function serializeToString(node, buffer, options)
	{
		var child, close, value, i;

		switch(node.type)
		{
			case serializer.ELEMENT_NODE:
				buffer.push('<', node.name);

				if (node.data instanceof Array)
				{
					node.data.forEach(function(attr){
						serializeToString(attr, buffer, options);
					});
				}

				if (node.child.length > 0 || (isHTML(options.format) && !isSelfClosing(node.name)))
				{
					buffer.push('>');

					node.child.forEach(function(child){
						serializeToString(child, buffer, options);
					});

					buffer.push('</', node.name, '>');
				}
				else
				{
					if (!isHTML(options.format))
						buffer.push('/');
					buffer.push('>');
				}
				return;

			case serializer.ATTRIBUTE_NODE:
				if (isAutoFill(node.name, options.format))
					return buffer.push(' ', node.name);
				else if (node.value === '' && options.removeEmptyAttributes && !/^data-/i.test(node.name))
					return;

				//  if there are any xmlns attributes set, we need to write the xmlns:<prefix> declaration aswel
				Object.keys(node.xmlns).forEach(function(prefix){
					var ns = node.xmlns[prefix];

					if (ns && ns !== '')
					{
						close = quoteAttribute(ns, options.format);
						buffer.push(' xmlns', prefix !== '' ? ':' : '', prefix, '=', close, ns, close);
					}
				});

				close = quoteAttribute(node.data, options.format);
				return buffer.push(' ', node.name, '=', close, (node.data || ''), close);

			case serializer.DOCUMENT_NODE:
			case serializer.DOCUMENT_FRAGMENT_NODE:
				node.child.forEach(function(child){
					serializeToString(child, buffer, options);
				});
				return;

			case serializer.TEXT_NODE:
				value = node.data.replace(pattern.encode, encode);
				if (!pattern.preserveWhiteSpace.test(node.parent.name))
				{
					if (!options.preserveWhiteSpace)
						value = value.replace(/\s+/g, ' ');
				}
				return buffer.push(value);

			case serializer.CDATA_SECTION_NODE:
				return buffer.push('<![CDATA[', node.data, ']]>');

			case serializer.COMMENT_NODE:
				if ('function' === typeof options.preserveComment ? options.preserveComment(node.data) : options.preserveComment)
					buffer.push('<!--', node.data, '-->');
				return;

			case serializer.DOCUMENT_TYPE_NODE:
				if (!options.format)
					options.format = detectFormat(node.publicId || node.systemId || node.name);

				buffer.push('<!DOCTYPE ', node.name);

				if (node.publicId)
					buffer.push(' PUBLIC "', node.publicId, '"');

				if (node.systemId && node.systemId !== '.')
				{
					if (!node.publicId)
						buffer.push(' SYSTEM');
					buffer.push(' "', node.systemId, '"');
				}

				if (node.internalSubset)
					buffer.push(' [', node.internalSubset, ']');

				buffer.push('>');
				return;

			case serializer.PROCESSING_INSTRUCTION_NODE:
				if (!options.format)
					options.format = detectFormat(node.name || node.data);

				return buffer.push('<?', node.name, ' ', node.data, '?>');

			case serializer.ENTITY_REFERENCE_NODE:
				return buffer.push('&', node.name, ';');

			//case ENTITY_NODE:
			//case NOTATION_NODE:
			default:
				buffer.push('??');
				break;
		}
	}

	/*
	 *  Build a string representation of the given DOM-tree
	 *  @name   serializeToString
	 *  @type   method
	 *  @access public
	 *  @param  DOMNode
	 *  @param  object options [format: string ('html', 'xml'), removeEmptyAttributes: bool, preserveWhiteSpace: bool, preserveComment: bool | function(content)]
	 *  @return string
	 */
	serializer.serializeToString = function(dom, options)
	{
		var buffer = [],
			p;

		if ('object' !== typeof options)
		{
			options = defaults;
		}
		else
		{
			//  inherit from defaults
			for (p in defaults)
				if (!(p in options))
					options[p] = defaults[p];
		}

		serializeToString(dom, buffer, options);

		return buffer.join('');
	};
}

module.exports = SimpleSerializer;
