var CharacterData = require('./characterdata.js'),
	sys = require('sys');


function CData(simple)
{
	CData.super_.apply(this, [simple]);
}
//  CData extends CharacterData
sys.inherits(CData, CharacterData);


//  Expose the CData module
module.exports = CData;
