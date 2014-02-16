var CharacterData = require('./characterdata.js'),
	sys = require('sys');


/**
 *  The Text interface inherits from CharacterData and represents the textual content (termed character data in XML) of
 *  an Element or Attr. If there is no markup inside an element's content, the text is contained in a single object
 *  implementing the Text interface that is the only child of the element. If there is markup, it is parsed into the
 *  information items (elements, comments, etc.) and Text nodes that form the list of children of the element.
 *  @name    Text
 *  @type    constructor
 *  @access  internal
 *  @param   Simple  object
 *  @return  Text
 */
function Text(simple)
{
	Text.super_.apply(this, [simple]);
}
//  Text extends CharacterData
sys.inherits(Text, CharacterData);

/**
 *  ___property
 *  @name    ___property
 *  @type    method
 *  @access  internal (exposed)
 *  @return  void
 */
Text.prototype.___property = function()
{
	return helper.combine({
		//  Returns whether this text node contains element content whitespace, often abusively called
		//  "ignorable whitespace". The text node is determined to contain whitespace in element content during the load
		//  of the document or if validation occurs while using Document.normalizeDocument().
		isElementContentWhitespace: {get: function(){
			//  TODO: implement Text.isElementContentWhitespace
		}},
		//  Returns all text of Text nodes logically-adjacent text nodes to this node, concatenated in document order.
		wholeText: {
			//  TODO: implement Text.wholeText
		}
	}, CharacterData.prototype.___property());
};

/**
 *  Replaces the text of the current node and all logically-adjacent text nodes with the specified text. All
 *  logically-adjacent text nodes are removed including the current node unless it was the recipient of the replacement
 *  text.
 *  @name    replaceWholeText
 *  @type    method
 *  @access  public
 *  @param   string  content
 *  @return  Text    node
 */
Text.prototype.replaceWholeText = function(content)
{
	//  TODO: implement Text.replaceWholeText
};

/**
 *  Breaks this node into two nodes at the specified offset, keeping both in the tree as siblings. After being split,
 *  this node will contain all the content up to the offset point. A new node of the same type, which contains all the
 *  content at and after the offset point, is returned. If the original node had a parent node, the new node is inserted
 *  as the next sibling of the original node. When the offset is equal to the length of this node, the new node has no
 *  data.
 *  @name    splitText
 *  @type    method
 *  @access  public
 *  @param   number  offset
 *  @return  Text    node
 */
Text.prototype.replaceWholeText = function(offset)
{
	//  TODO: implement Text.replaceWholeText
};

//  Expose the Text module
module.exports = Text;