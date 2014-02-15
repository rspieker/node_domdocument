var sys = require('sys');

/**
 *  DOMException
 *  @name    DOMException
 *  @type    function
 *  @access  internal
 *  @param   message
 *  @return  void
 */
function DOMException(message)
{
	DOMException.super_.apply(this, arguments);
	DOMException.super_.captureStackTrace(this, this.constructor); //  include stack trace in DOMException

	this.name    = 'DOMException';
	this.code    = message in this ? this[message] : null;
	this.message = message;
}
//  DOMException extends Error
sys.inherits(DOMException, Error);

// define 'constants'
DOMException.prototype.INDEX_SIZE_ERR              = 1;
DOMException.prototype.DOMSTRING_SIZE_ERR          = 2;
DOMException.prototype.HIERARCHY_REQUEST_ERR       = 3;
DOMException.prototype.WRONG_DOCUMENT_ERR          = 4;
DOMException.prototype.INVALID_CHARACTER_ERR       = 5;
DOMException.prototype.NO_DATA_ALLOWED_ERR         = 6;
DOMException.prototype.NO_MODIFICATION_ALLOWED_ERR = 7;
DOMException.prototype.NOT_FOUND_ERR               = 8;
DOMException.prototype.NOT_SUPPORTED_ERR           = 9;
DOMException.prototype.INUSE_ATTRIBUTE_ERR         = 10;
DOMException.prototype.INVALID_STATE_ERR           = 11;
DOMException.prototype.SYNTAX_ERR                  = 12;
DOMException.prototype.INVALID_MODIFICATION_ERR    = 13;
DOMException.prototype.NAMESPACE_ERR               = 14;
DOMException.prototype.INVALID_ACCESS_ERR          = 15;
DOMException.prototype.VALIDATION_ERR              = 16;
DOMException.prototype.TYPE_MISMATCH_ERR           = 17;


module.exports = DOMException;
