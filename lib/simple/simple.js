/**
 *  Simplified representation of DOMNodes
 *  @name    Simple
 *  @type    constructor
 *  @access  internal
 *  @param   number nodeType
 *  @param   string nodeName
 *  @param   mixed  data
 *  @return  Simple object
 */
function Simple(type, name, data)
{
	var o, p;

	this.type   = type;
	this.name   = name;
	this.parent = null;
	this.owner  = null;
	this.child  = [];
	this.data   = data;

	//  Only DOMElements can have attributes, which are provided as an object
	if (type === 1 && !(data instanceof Array))
	{
		this.data = [];
		for (p in data)
		{
			o = new Simple(2, p, data[p]);
			o.parent = this;
			this.data.push(o);
		}
	}
}

/**
 *  Append a child node to the current Simple object
 *  @name    append
 *  @type    method
 *  @access  public
 *  @param   Simple child
 *  @return  Simple child
 *  @note    this does not remove the child from any associated parent
 */
Simple.prototype.append = function(child)
{
	this.child.push(child);
	child.parent = this;
	child.owner  = this.owner;
	return child;
};

/**
 *  Find any Simple object based on type/name, optionally searches the tree (descent into children)
 *  @name    find
 *  @type    method
 *  @access  public
 *  @param   number nodeType
 *  @param   string nodeName
 *  @param   bool   descent
 *  @return  Array  matches
 */
Simple.prototype.find = function(type, name, descent)
{
	var found = [],
		search = [];

	if (type === 2 && this.type === 1) //  attributes
		search = search.concat(this.data);
	search = search.concat(this.child);

	search.forEach(function(child){
		if ((!type || type === child.type) && (!name || name.toLowerCase() === child.name.toLowerCase()))
			found.push(child);

		if (descent)
			found = found.concat(child.find(type, name, descent));
	});

	return found;
};

/**
 *  Clone the Simple instance
 *  @name    clone
 *  @type    method
 *  @access  public
 *  @param   bool   deep
 *  @param   Simple owner [optional, default null - the current owner]
 *  @return  Simple clone
 */
Simple.prototype.clone = function(deep, owner)
{
	var result = new Simple(this.type, this.name, this.data),
		i;

	result.owner = owner || this.owner;

	if (deep)
		this.child.forEach(function(child){
			result.append(child.clone(deep, result.owner));
		});

	return result;
};



module.exports = Simple;
