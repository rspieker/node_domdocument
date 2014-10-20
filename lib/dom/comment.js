/* jshint node:true */
'use strict';

var CharacterData = require('./characterdata.js'),
	sys = require('sys');


/**
 *  This interface inherits from CharacterData and represents the content of a comment, i.e., all the characters between
 *  the starting '<!--' and ending '-->'. Note that this is the definition of a comment in XML, and, in practice, HTML,
 *  although some HTML tools may implement the full SGML comment structure.
 *  @name    Comment
 *  @type    constructor
 *  @access  internal
 *  @param   Simple  object
 *  @return  Comment
 */
function Comment(simple)
{
	Comment.super_.apply(this, [simple]);
}
//  Comment extends CharacterData
sys.inherits(Comment, CharacterData);


//  Expose the Comment module
module.exports = Comment;
