var CharacterData = require('./characterdata.js'),
	sys = require('sys');


function Comment(simple)
{
	Comment.super_.apply(this, [simple]);
}
//  Comment extends CharacterData
sys.inherits(Comment, CharacterData);


//  Expose the Comment module
module.exports = Comment;
