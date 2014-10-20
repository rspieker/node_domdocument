/* jshint node:true */
'use strict';

/**
 *  Combine any number objects into one single object containing all the properties
 *  This method processes the given object from right to left, last argument to first
 *  @name    combine
 *  @type    function
 *  @access  internal
 *  @param   object ... N
 *  @return  object combined
 */
function combine()
{
	var obj = {},
		type, i, p;

	for (i = arguments.length - 1; i >= 0 ; --i)
		if ('object' === typeof arguments[i])
			for (p in arguments[i])
				obj[p] = p in obj && isObject(obj[p], arguments[i][p]) ? combine(arguments[i][p], obj[p]) : arguments[i][p];

	return obj;
}

/**
 *  Test whether or not the arguments are all object type (true object types: {}, new <function>)
 *  @name    isObject
 *  @type    function
 *  @access  internal
 *  @param   mixed ... N
 *  @return  bool  is object
 */
function isObject()
{
	for (var i = 0; i < arguments.length; ++i)
		if (!(arguments[i] && 'object' === typeof arguments[i] && /\bObject\b/.test({}.toString.call(arguments[i]))))
			return false;

	return true;
}

/**
 *  Decorate given object with any setting obtained from calling the (somewhat magical) ___property method on it
 *  @name    decorate
 *  @type    function
 *  @access  internal
 *  @param   Core   object
 *  @param   Simple object
 *  @return  void
 */
function decorate(object, simple)
{
	var property = object.___property(),
		setting = {},
		p;

	//  for all property names
	for (p in property)
	{
		//  allow the property to be exposed
		setting[p] = {enumerable:true};
		//  if the property ought to be locked (cannot be modified), we remove the option to write it and set the value
		if ('locked' in property[p] && property[p].locked)
		{
			setting[p].writable = false;
			setting[p].value    = property[p].value || simple[property[p].key] || null;
		}
		else
		{
			//  we check if the property can be set, by seeing if there is a 'set' property defined and;
			//  - if 'set' equals bool true, a magical setter function is created (see function setter)
			//  - if 'set' doesn't equal bool true, the value provided is used as setter (so it makes sense to provide a
			//    function)
			if ('set' in property[p])
				setting[p].set = property[p].set === true ? setter(object, simple, p, property[p]) : property[p].set.bind(simple);

			//  a getter is always created (as it makes no sense to create a property which cannot be accessed), either
			//  a method is provided, which is used, or a getter is dynamically created (see function getter)
			setting[p].get = 'function' === typeof property[p].get ? property[p].get.bind(simple) : getter(object, simple, p, property[p]);
		}
	}

	//  now that all properties to define are known, we slap them on.
	Object.defineProperties(object, setting);
}

/**
 *  Create a dynamic getter
 *  @name    getter
 *  @type    function
 *  @access  internal
 *  @param   Core object
 *  @param   Simple object
 *  @param   string key
 *  @param   object config
 *  @return  function
 */
function getter(core, simple, key, config)
{
	return function(){
		if ('key' in config && config.key in simple)
			return simple[config.key];
		return null;
	};
}

/**
 *  Create a dynamic setter
 *  @name    setter
 *  @type    function
 *  @access  internal
 *  @param   Core object
 *  @param   Simple object
 *  @param   string key
 *  @param   object config
 *  @return  function
 */
function setter(core, simple, key, config)
{
	return function(value){
		if ('key' in config && config.key in simple)
			simple[config.key] = value;
	};
}


//  Expose the helper functions
module.exports = {
	combine: combine,
	decorate: decorate
};
