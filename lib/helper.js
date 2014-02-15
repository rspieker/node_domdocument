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
		i, p;

	for (i = arguments.length - 1; i >= 0 ; --i)
		if (typeof arguments[i] === 'object')
			for (p in arguments[i])
				obj[p] = p in obj && typeof obj[p] === 'object' ? combine(arguments[i][p], obj[p]) : arguments[i][p];

	return obj;
}

//  Helper functions

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
				setting[p].set = property[p].set === true ? setter(object, simple, p, property[p]) : property[p].set;

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
	//  TODO: make the getter less dynamic, as we should not allow for dynamically added/removed ___get_* methods
	return function(){
		if ('function' === typeof core['___get_' + key])
			return core['___get_' + key].apply(core, []);
		else if (config && 'key' in config && config.key in simple)
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
		if ('function' === typeof core['___set_' + key])
			core['___set_' + key].apply(core, [value]);
		else if (config && 'key' in config && config.key in simple)
			return simple[config.key] = value;
	};
}


//  Expose the helper functions
module.exports = {
	combine: combine,
	decorate: decorate
};
