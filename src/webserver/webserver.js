/*
 Simple WebServer

 Inspired by source code taken from
 http://stackoverflow.com/questions/6084360/node-js-as-a-simple-web-server

 And refactored by ratopi. ;-)
 */

var fs = require( "fs" );
var http = require( "http" );
var path = require( "path" );
var process = require( "process" );
var url = require( "url" );

// ---

var webserver =
	function ( request, response )
	{
		var fileHandler =
			function ( err, file )
			{
				if ( err )
				{
					response.writeHead( 500, { "Content-Type": "text/plain" } );
					response.write( err + "\n" );
					response.end();
					return;
				}

				var headers = {};

				var contentType = contentTypesByExtension[ path.extname( filename ) ];

				if ( contentType )
				{
					headers[ "Content-Type" ] = contentType;
				}

				response.writeHead( 200, headers );
				response.write( file, "binary" );
				response.end();
			};

		// ---

		var pathHandler =
			function ( exists )
			{
				if ( ! exists )
				{
					response.writeHead( 404, { "Content-Type": "text/plain" } );
					response.write( "404 Not Found\n" );
					response.end();

					return;
				}

				if ( fs.statSync( filename ).isDirectory() )
				{
					fs.exists( filename += '/index.html', pathHandler );
				}
				else
				{
					fs.readFile( filename, "binary", fileHandler );
				}
			};

		// ---

		var uri = url.parse( request.url ).pathname;
		var filename = path.join( process.cwd(), uri );

		var contentTypesByExtension = {
			'.html': "text/html",
			'.css': "text/css",
			'.js': "text/javascript"
		};

		fs.exists( filename, pathHandler );
	};

// ---

var port = process.argv[ 2 ] || 8888;

http.createServer( webserver ).listen( parseInt( port, 10 ) );

console.log( "Static file server running at " );
console.log( "=> http://localhost:" + port );
console.log( "CTRL + C to shutdown" );
