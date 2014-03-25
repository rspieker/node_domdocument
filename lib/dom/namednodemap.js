var factory = require('../simple/factory.js'),
	Node = require('./node.js');

/**
 *  Objects implementing the NamedNodeMap interface are used to represent collections of nodes that can be accessed by 
 *  name. Note that NamedNodeMap does not inherit from NodeList; NamedNodeMaps are not maintained in any particular 
 *  order. Objects contained in an object implementing NamedNodeMap may also be accessed by an ordinal index, but this 
 *  is simply to allow convenient enumeration of the contents of a NamedNodeMap, and does not imply that the DOM
 *  specifies an order to these Nodes.
 *  @name    NamedNodeMap
 *  @type    module
 *  @access  internal
 *  @package DOM
 */
function NamedNodeMap(items)
{
	var map = this;

	Object.defineProperty(this, 'length', {
		enumerable: true,
		get: function(){
			return items.length;
		}
	});

	/**
	 *  Returns the indexth item in the map. If index is greater than or equal to the number of nodes in this map, this 
	 *  returns null.
	 *  @name    item
	 *  @type    method
	 *  @access  public
	 *  @param   number index
	 *  @return  Node   item (null if the index exceeds the number of items)
	 */
	map.item = function(index)
	{
		return index <= items.length ? factory.instance(items[index]) : null;
	}

	/**
	 *  Retrieves a node specified by name.
	 *  @name    getNamedItem
	 *  @type    method
	 *  @access  public
	 *  @param   string name
	 *  @return  Node   item (null if no Node with given name exists)
	 */
	map.getNamedItem = function(name)
	{
		var match = items.filter(function(item){
				return name === item.name;
			});

		return match && match.length ? factory.instance(match[0]) : null;
	};

	/**
	 *  Retrieves a node specified by local name and namespace URI.
	 *  @name    getNamedItemNS
	 *  @type    method
	 *  @access  public
	 *  @param   string namespace URI
	 *  @param   string local name
	 *  @return  Node   item (null if no Node with given name exists)
	 */
	map.getNamedItemNS = function(namespaceURI, localName)
	{
		//  TODO: implement map.getNamedItemNS
	};

	/**
	 *  Removes a node specified by name. When this map contains the attributes attached to an element, if the removed
	 *  attribute is known to have a default value, an attribute immediately appears containing the default value as 
	 *  well as the corresponding namespace URI, local name, and prefix when applicable.
	 *  @name    removeNamedItem
	 *  @type    method
	 *  @access  public
	 *  @param   string name
	 *  @return  Node   removed item (null if the named item did not exist)
	 */
	map.removeNamedItem = function(name)
	{
		var removed = map.getNamedItem(name),
			remain = [];

		if (removed)
		{
			items.map(function(item){
				if (item.name !== name)
					remain.push(item);
			});
			items = remain;
		}

		return removed;
	};

	/**
	 *  Adds a node using its nodeName attribute. If a node with that name is already present in this map, it is 
	 *  replaced by the new one. Replacing a node by itself has no effect.
	 *  As the nodeName attribute is used to derive the name which the node must be stored under, multiple nodes of 
	 *  certain types (those that have a "special" string value) cannot be stored as the names would clash. This is 
	 *  seen as preferable to allowing nodes to be aliased.
	 *  @name    setNamedItem
	 *  @type    method
	 *  @access  public
	 *  @param   Node node
	 *  @return  Node replaced (null if no node was replaced)
	 */
	map.setNamedItem = function(node)
	{
		var removed = map.getNamedItem(node.name);

		items.push(node.___simple(function(){
			return this;
		}));

		return removed;
	};
}

/*
interface NamedNodeMap {
  Node               getNamedItem(in DOMString name);
  Node               setNamedItem(in Node arg)
                                        raises(DOMException);
  Node               removeNamedItem(in DOMString name)
                                        raises(DOMException);
  Node               item(in unsigned long index);
  readonly attribute unsigned long   length;
  // Introduced in DOM Level 2:
  Node               getNamedItemNS(in DOMString namespaceURI, 
                                    in DOMString localName)
                                        raises(DOMException);
  // Introduced in DOM Level 2:
  Node               setNamedItemNS(in Node arg)
                                        raises(DOMException);
  // Introduced in DOM Level 2:
  Node               removeNamedItemNS(in DOMString namespaceURI, 
                                       in DOMString localName)
                                        raises(DOMException);
};
*/



//  Expose the NamedNodeMap module
module.exports = NamedNodeMap;
