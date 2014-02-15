var factory = require('../simple/factory.js');

/**
 *  NodeList, an immutable wrapper around an array of (Simple) instances
 *  Any Simple object will be instanced when it is accessed (either using <NodeList>.index(N) or <NodeList>[N]
 *  @name    NodeList
 *  @type    function
 *  @access  internal
 *  @package DOM
 */
function NodeList(items)
{
	var list = this,
		i;

	/**
	 *  define
	 *  @name    define
	 *  @type    function
	 *  @access  internal
	 *  @param   index
	 *  @return  void
	 */
	function define(index)
	{
		Object.defineProperty(list, index, {
			get: function(){
				return item(index);
			}
		});
	}

	/**
	 *  item
	 *  @name    item
	 *  @type    function
	 *  @access  internal
	 *  @param   index
	 *  @return  void
	 */
	function item(index)
	{
		var child = null;

		if (items.length > index)
			child = factory.instance(items[index]);

		return child;
	}

	Object.defineProperty(this, 'length', {
		enumerable: true,
		writable: false,
		value: items.length
	});

	for (i = 0; i < items.length; ++i)
		define(i);

	this.item = function(index){
		return item(index);
	};
}


//  Expose the NodeList module
module.exports = NodeList;
