var http = require( 'http' );

var options = {
	host: 'www.nodejitsu.com',
	path: '/',
	port: '1338',
	//This is the only line that is new. `headers` is an object with the headers to request
	headers: { 'custom': 'Custom Header Demo works' }
};

var callback =
	function ( response )
	{
		var str = '';
		response.on(
			'data', function ( chunk )
			{
				str += chunk;
			} );

		response.on(
			'end', function ()
			{
				console.log( str );
			} );
	};

var request = http.request( options, callback );
request.end();
