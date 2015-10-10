/**
 *
 */

var zlib = require('zlib');
var fs = require( 'fs' );

var gzip = zlib.createGzip();


var inp = fs.createReadStream( 'pipe.js' );

var out = fs.createWriteStream( 'pipe.js.gz' );


inp.pipe( gzip ).pipe( out );
