'use strict';


var Node = require('./node.js'),
	sys = require('sys');


/**
 *  A processing instruction provides an opportunity for application-specific instructions to be embedded within XML
 *  and which can be ignored by XML processors which do not support processing their instructions (outside of their
 *  having a place in the DOM).
 *  @name    ProcessingInstruction
 *  @type    constructor
 *  @access  internal
 *  @param   Simple  object
 *  @return  ProcessingInstruction
 */
function ProcessingInstruction(simple)
{
	ProcessingInstruction.super_.apply(this, [simple]);
}
//  ProcessingInstruction extends Node
sys.inherits(ProcessingInstruction, Node);

ProcessingInstruction.prototype.toString = function()
{
	return '[object DOMProcessingInstruction]';
};


//  Expose the ProcessingInstruction module
module.exports = ProcessingInstruction;
