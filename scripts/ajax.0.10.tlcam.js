// JS library to call AJAX server
// Fernando R
// The Wilson Project (www.iambobot.com)
// TWO PUBLIC functions
//   function getXMLDoc(url, params, callback)
//		Creates the request to the server and call callback(xml) function on server response
//		xml parameter in callback() funtion is the XML structure returned by the server
//		url -  is the server URL
//		params - are the parameter is the POST to the server
//		callback - is the funtion to be called when the server responds
// 
//   function XMLDocParse(xmlDoc, param, index)
//		this is used to parse the XML structure returned by the server
//
// DEPRECATED (to be removed)
//   function parseXMLString(XMLString, param)
//		this is used to parse the XML structure returned by the server
//
// version 0.2 Sept-2015
// - XMLDocParse fix to avoid "TypeError: elements[index].childNodes[0] is undefined" error with empty tags
// version 0.3 Sept-2015
// - getXMLDoc added timout as an option
//   function is overloaded and can be called either as in 0.2
//   getXMLDoc(url, params, callback)
//	 or with a timeout
//   getXMLDoc(url, params, callback, timeout)
// version 0.4 Oct-2015
// - getXMLDoc fix when param is empty
// version 0.5 Dec-2015
// - getXMLDocObj with obj as parameter
// version 0.6
// - Intermediate
// version 0.7 
// - (only HOST)
// version 0.8e Feb-2017 - embedded / should work for Host
// - Clean up cType in case Content-Type: text/xml;charset=UTF-8
// version 0.10 Jan-2018 
// - createHTTPObject Fix Safari
// version 0.10.tlcam Apr-2020
// - Safari still not working 
// ------------------------------------------------------------------------------------------------------------------

// Create XML doc
function XMLDocCreate(XMLString)
{
	if (window.DOMParser) {
		parser=new DOMParser();
		xmlDoc=parser.parseFromString(XMLString,"text/xml");
	}
	else {
	// Internet Explorer
		xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
		xmlDoc.async=false;
		xmlDoc.loadXML(XMLString); 
	} 	
	return xmlDoc;
}

function XMLDocParse(xmlDoc, param, index)
{
	var elements= xmlDoc.getElementsByTagName(param);
	if(elements[index] && elements[index].childNodes[0] && elements.length) // ajax.0.2 fix
		return elements[index].childNodes[0].nodeValue;
	else return "";
}
function parseXMLStringIndex(XMLString, param, index)
{
	if (window.DOMParser) {
		xmlDoc = ( new window.DOMParser() ).parseFromString(XMLString, "text/xml");
	}
	else if (window.ActiveXObject) {
	// Internet Explorer
		xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
		xmlDoc.async=false;
		xmlDoc.loadXML(XMLString); 
	} 	
	else return '';
	return xmlDoc.getElementsByTagName(param)[index].childNodes[0].nodeValue;
}

// ------------------------------------------------------------------------------------------

function createHTTPObject(){
	var xmlHttp
	try {
		//Firefox, Opera 8.0+, Safari
		xmlHttp = new XMLHttpRequest();
	}
	catch(e) {
		//Internet Explorer
		try {
			xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
		}
		catch(e) {
			try {
				xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
			}
			catch(e) {
				alert("Your browser does not support AJAX!")
				return false;
			}
		}
	}
	return xmlHttp;
}

// PARAMETERS
// action - string passed to the server with GET method serverajax.php?Action=<action>
// callback - Call Back function called from onreadystatechange when server response is received
// timeout - timeout in milliseconds
function getXMLDoc(url, params, callback, timeout)
{
	// 1.- Create xmlHttpRequest object
	var xmlhttp = createHTTPObject();
	// Set a timeout (5 seconds) just in case
//	xmlhttp._timeout=setTimeout(function(){xmlhttp.abort()}, 5000);
	// 2.- Set the function to handle the response
	xmlhttp.onreadystatechange=function() {
		// 4= completado & 200=OK
		// readyState 	Holds the status of the XMLHttpRequest. Changes from 0 to 4:
		// 				0: request not initialized
		// 				1: server connection established
		// 				2: request received
		// 				3: processing request
		// 				4: request finished and response is ready
		// status 		200: "OK"
		// 				404: Page not found
		if (xmlhttp.readyState==4) {
			if( xmlhttp.status==200) {
				// The response is expecto to be in XML format and then data sent back from the server is retrieved 
				// with the responseXML property for getting the response as XML.
				// r0.8e case Content-Type: text/xml;charset=UTF-8
				var cType= xmlhttp.getResponseHeader("Content-Type").split(";")[0];
				
				var returnstr= "";
				if (cType == 'text/xml') {
					var xmlDoc=xmlhttp.responseXML;
					var Xml2String;	// Convert the xml to string just to display it 
					if (xmlDoc.xml) {
						// Converts the xml object to string  (For IE)
						Xml2String= xmlDoc.xml;	
					}
					else {
						// Converts the xml object to string (For rest browsers, mozilla, etc)
						Xml2String= new XMLSerializer().serializeToString(xmlDoc);  
					}
					returnstr= Xml2String;
				} 
				else if (cType == 'text/html') {
					returnstr= 'ERROR: Content-Type is text/html ='+ cType+' Text= '+xmlhttp.responseText;
				}
				else returnstr= 'ERROR: Content-Type is not text/xml ='+ cType;
				if(callback) callback(returnstr);
			}
		}
	}
	xmlhttp.ontimeout = function () { 
		if(callback) callback("timeout",1);
	}
	// 3.- Call the server 
	xmlhttp.open("POST", url, true); // true= asíncrona
	xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=ISO-8859-1');
	if(typeof timeout !== "undefined")
		xmlhttp.timeout = timeout; // Set timeout in milliseconds
	xmlhttp.send(params);
}

function getXMLDocObj(obj, params, timeout)
{
	// 1.- Create xmlHttpRequest object
	var xmlhttp = createHTTPObject();
	// 2.- Set the function to handle the response
	xmlhttp.onreadystatechange=function() {
		// 4= completado & 200=OK
		if (xmlhttp.readyState==4 && xmlhttp.status==200) {
			// The response is expecto to be in XML format and then data sent back from the server is retrieved 
			// with the responseXML property for getting the response as XML.
			var cType= xmlhttp.getResponseHeader("Content-Type");
			var returnstr= "";
			if (cType == 'text/xml') {
				var xmlDoc=xmlhttp.responseXML;
				var Xml2String;	// Convert the xml to string just to display it 
				if (xmlDoc.xml) {
					// Converts the xml object to string  (For IE)
					Xml2String= xmlDoc.xml;	
				}
				else {
					// Converts the xml object to string (For rest browsers, mozilla, etc)
					Xml2String= new XMLSerializer().serializeToString(xmlDoc);  
				}
				returnstr= Xml2String;
			} 
			else if (cType == 'text/html') {
				returnstr= 'ERROR: Content-Type is text/html ='+ cType+' Text= '+xmlhttp.responseText;
			}
			else returnstr= 'ERROR: Content-Type is not text/xml ='+ cType;
			if(obj.callback) obj.callback(obj, returnstr);
		}
	}
	xmlhttp.ontimeout = function () { 
		if(obj.callback) obj.callback(obj, "timeout", 1);
	}
	// 3.- Call the server 
	xmlhttp.open("POST", obj.url, true); // true= asíncrona
	xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=ISO-8859-1');
	xmlhttp.setRequestHeader("Content-length", params.length);
	if(typeof timeout !== "undefined")
		xmlhttp.timeout = timeout; // Set timeout in milliseconds
	xmlhttp.send(params);
}
