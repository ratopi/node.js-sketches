/*
 Common Web Utilities

 Copyright (c) 2015 Ralf Th. Pietsch <ratopi@abwesend.de>
 */

var cheerio = require( "cheerio" );
var request = require( "request" );

// ---

var commonRequester =
	function ( url, bodyHandler )
	{
		var tryAgainRequester =
			function ( errorList, url, bodyHandler )
			{
				if ( errorList.length > 2 )
				{
					errorList.forEach(
						function ( error )
						{
							console.log( "ERROR " + error + " from " + url );
						}
					);
					console.log( "Got 3 errors requesting '" + url + "'.  Now giving up." );
					return;
				}

				request(
					url,
					function ( error, response, body )
					{
						if ( error )
						{
							errorList.push( error );
							tryAgainRequester( errorList, url, bodyHandler );
						}
						else
						{
							// console.log( "got response from " + url );
							bodyHandler( body, response );
						}
					}
				);
			};

		tryAgainRequester( [], url, bodyHandler );
	};

// ---

exports.get =
	function ( url, objectHandler )
	{
		commonRequester(
			url,
			function ( body, response )
			{
				objectHandler( body, response );
			}
		);
	};

/**
 * Gets an URL by GET-Method, parses the response-body as JSON and calls the objectHandler with the result.
 * @param url An URL
 * @param objectHandler A function; will be called with the response-object.
 */
exports.getJson =
	function ( url, objectHandler )
	{
		commonRequester(
			url,
			function ( body, response )
			{
				objectHandler( JSON.parse( body ), response );
			}
		);
	};

/**
 * Gets an URL by GET-Method, parses the response-body as HTML and calls the objectHandler with a cheerio-object!
 * @param url An URL.
 * @param htmlHandler A function, which expects a cheerio-object as single-argument.
 */
exports.getHtml =
	function ( url, htmlHandler )
	{
		commonRequester(
			url,
			function ( body, response )
			{
				htmlHandler( cheerio.load( body ), response );
			}
		);
	};

//---

exports.uniqueUrlCaller =
	function ()
	{
		var urls = {};

		var o = {};

		o.get =
			function ( url, handler )
			{
				urls[ url ] ||
				exports.get(
					url,
					function ( json, response )
					{
						urls[ url ] = true;
						handler( json, response );
					}
				)
			};

		o.getJson =
			function ( url, handler )
			{
				urls[ url ] ||
				exports.getJson(
					url,
					function ( json, response )
					{
						urls[ url ] = true;
						handler( json, response );
					}
				)
			};

		o.getHtml =
			function ( url, handler )
			{
				urls[ url ] ||
				exports.getHtml(
					url,
					function ( html, response )
					{
						urls[ url ] = true;
						handler( html, response );
					}
				)
			};

		o.reset =
			function ()
			{
				urls = {};
			};

		return o;
	};
