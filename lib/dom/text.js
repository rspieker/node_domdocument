var CharacterData = require('./characterdata.js'),
	sys = require('sys');


function Text(simple)
{
	Text.super_.apply(this, [simple]);
}
//  Text extends CharacterData
sys.inherits(Text, CharacterData);


//  Expose the Text module
module.exports = Text;
