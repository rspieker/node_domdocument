var Node = require('./node.js'),
	sys = require('sys');


function CharacterData(simple)
{
	CharacterData.super_.apply(this, [simple]);
}
//  CharacterData extends Node
sys.inherits(CharacterData, Node);


//  Expose the CharacterData module
module.exports = CharacterData;
