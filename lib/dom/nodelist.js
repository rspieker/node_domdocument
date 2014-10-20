/* jshint node:true */
'use strict';

var factory = require('../simple/factory.js');

/**
 *  NodeList, a wrapper around an array of (Simple) instances or a Simple instance for which its children are wrapped
 *  providing a 'live' NodeList. Any Simple object will be instanced when it is accessed (either using
 *  <NodeList>.index(N) or <NodeList>[N])
 *  @name    NodeList
 *  @type    function
 *  @access  internal
 *  @package DOM
 */
function NodeList(source)
{
	var list = this;


	function init()
	{
		var i, len;

		Object.defineProperty(list, 'length', {
			enumerable: true,
			get: function(){
				var line = new Array(80).join('-'),
					items = getItems();

				return items.length;
			}
		});

		for (i = 0, len = getItems().length; i < len; ++i)
			define(i);
	}

	function getItems()
	{
		return source instanceof Array ? source : source.child;
	}

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
		var child = null,
			items = getItems();

		if (items.length > index)
			child = factory.instance(items[index]);

		return child;
	}


	list.item = function(index){
		return item(index);
	};


	init();
}


//  Expose the NodeList module
module.exports = NodeList;
