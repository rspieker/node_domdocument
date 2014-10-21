DOM Documents for Node.js
=========================

While there are many DOM implementations for Node.js, many of them seem abandoned or not quite right. The main goal of DOMDocument is to have a fully implemented standard DOM, eventually configurable to support a specific DOM level.

Based on the magnificent SAX parser expat, made available for Node.js by the node-expat project, DOMDocument has a solid and very fast foundation.

##How to use
```js
var DOMDocument = require('./path/to/domdocument');  //  sorry for not yet releasing this to the mighty NPM

//  from a file
new DOMDocument().load('path/to/file.xml', function(error, document){

	if (error)
		throw error;  //  error is an extension to the built-in Errors

	console.log(document.documentElement.nodeName);

});


//  from an XML string
var xml = '<root><!--  My first DOMDocument  --></root>';
new DOMDocument().loadXML(xml, function(error, document){

	if (error)
		throw error;  //  error is an extension to the built-in Errors

	console.log(document.documentElement.firstChild.nodeValue);  //  echoes the comment contents

});

```


##Shortcomings
At the moment I'm working on the unit tests and getting the code coverage to 100% in a proper and clean way, so there are still a bunch of things I have not yet implemented.

###Namespaces
Being one of the tougher requirements of a fully capable DOM implementation, namespaces are lacking entirely from this implementation.
- [ ] Document.createAttributeNS
- [x] Document.createElementNS
- [ ] Document.getElementsByTagNameNS
- [ ] Element.getAttributeNodeNS
- [ ] Element.getAttributeNS
- [ ] Element.getElementsByTagNameNS
- [ ] Element.hasAttributeNS
- [ ] Element.removeAttributeNodeNS
- [ ] Element.removeAttributeNS
- [ ] Element.setAttributeNodeNS
- [ ] Element.setAttributeNS
- [ ] Element.setIdAttributeNS
- [ ] NamedNodeMap.getNamedItemNS
- [x] Node.isDefaultNamespace
- [x] Node.localName
- [x] Node.lookupPrefix
- [x] Node.prefix

###ID attributes
In order to maintain steady progress on the implementation of DOMDocument, I have ignored the part of the specification where the DOM lets you specify which attribute is the id attribute, I went for the most common usage (which is the HTML DOM), where the id attribute is literally the attribute whose name is 'id', this means the following methods and properties will not yet behave fully DOM compatible
- [ ] Element.setIdAttribute
- [ ] Element.setIdAttributeNS
- [ ] Element.setIdAttributeNode
- [ ] Attr.isId

###The rest
And that's not even it, we also lack full support of the following methods and properties:
- [ ] Attr.specified
- [ ] Attr.schemaTypeInfo
- [ ] Document.renameNode
- [ ] Node.isSupported (always returns false for now, as net a single DOM is yet fully supported)
- [ ] Node.getFeature
- [ ] Node.setUserData
- [ ] Node.getUserData
- [ ] Text.isElementContentWhitespace
- [x] Text.splitText


##Roadmap
Once the implementation hits a fully tested state we will be releasing the npm module, this should be around november 2014
We expect to implement the full DOM level 2 (maybe 3) in december 2014/januari 2015
