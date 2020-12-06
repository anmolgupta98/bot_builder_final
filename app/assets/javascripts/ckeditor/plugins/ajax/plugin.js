if (typeof(CKEDITOR) != 'undefined') {
	( function() {
		CKEDITOR.plugins.add( 'ajax', {
			requires: 'xml'
		} );
		CKEDITOR.ajax = ( function() {
			function createXMLHttpRequest() {
				if ( !CKEDITOR.env.ie || location.protocol != 'file:' ) {
					try {
						return new XMLHttpRequest();
					} catch ( e ) {
					}
				}

				try {
					return new ActiveXObject( 'Msxml2.XMLHTTP' );
				} catch ( e ) {}
				try {
					return new ActiveXObject( 'Microsoft.XMLHTTP' );
				} catch ( e ) {}

				return null;
			}

			function checkStatus( xhr ) {
				return ( xhr.readyState == 4 && ( ( xhr.status >= 200 && xhr.status < 300 ) || xhr.status == 304 || xhr.status === 0 || xhr.status == 1223 ) );
			}

			function getResponseText( xhr ) {
				if ( checkStatus( xhr ) )
					return xhr.responseText;
				return null;
			}

			function getResponseXml( xhr ) {
				if ( checkStatus( xhr ) ) {
					var xml = xhr.responseXML;
					return new CKEDITOR.xml( xml && xml.firstChild ? xml : xhr.responseText );
				}
				return null;
			}

			function load( url, callback, getResponseFn ) {
				var async = !!callback;

				var xhr = createXMLHttpRequest();

				if ( !xhr )
					return null;

				xhr.open( 'GET', url, async );

				if ( async ) {
					xhr.onreadystatechange = function() {
						if ( xhr.readyState == 4 ) {
							callback( getResponseFn( xhr ) );
							xhr = null;
						}
					};
				}

				xhr.send( null );

				return async ? '' : getResponseFn( xhr );
			}

			function post( url, data, contentType, callback, getResponseFn ) {
				var xhr = createXMLHttpRequest();

				if ( !xhr )
					return null;

				xhr.open( 'POST', url, true );

				xhr.onreadystatechange = function() {
					if ( xhr.readyState == 4 ) {
						if ( callback ) {
							callback( getResponseFn( xhr ) );
						}
						xhr = null;
					}
				};

				xhr.setRequestHeader( 'Content-type', contentType || 'application/x-www-form-urlencoded; charset=UTF-8' );

				xhr.send( data );
			}

			return {
				load: function( url, callback ) {
					return load( url, callback, getResponseText );
				},
				post: function( url, data, contentType, callback ) {
					return post( url, data, contentType, callback, getResponseText );
				},

				loadXml: function( url, callback ) {
					return load( url, callback, getResponseXml );
				}
			};
		} )();

	} )();
};
