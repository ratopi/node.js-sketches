/*

 */

exports.convertICal =
	function ( x )
	{
		var lines = x;

		if ( typeof x === "string" ) lines = x.split( /\r?\n/ );

		var o = {};
		var stack = [];

		var current = o;

		lines.forEach(
			function ( line )
			{
				var regex = /^([^:]*):(.*$)/;
				var result = line.match( regex );

				var key = result[ 1 ];
				var value = result[ 2 ];

				if ( "BEGIN" === key )
				{
					stack.push( current );

					if ( ! current[ value ] )
					{
						current[ value ] = [];
					}

					var list = current[ value ];

					var y = {};
					current[ value ].push( y );
					current = y;
				}
				else if ( "END" === key )
				{
					current = stack.pop();
				}
				else
				{
					current[ key ] = value;
				}
			}
		);

		return o;
	};
