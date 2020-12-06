if (typeof(CKEDITOR) != 'undefined') {
	'use strict';

	( function() {

		CKEDITOR.plugins.add( 'autocomplete', {
			requires: 'textwatcher',
			onLoad: function() {
				CKEDITOR.document.appendStyleSheet( this.path + 'skins/default.css' );
			},
			isSupportedEnvironment: function() {
				return !CKEDITOR.env.ie || CKEDITOR.env.version > 8;
			}
		} );
		function Autocomplete( editor, config ) {
			var configKeystrokes = editor.config.autocomplete_commitKeystrokes || CKEDITOR.config.autocomplete_commitKeystrokes;
			this.editor = editor;
			this.throttle = config.throttle !== undefined ? config.throttle : 20;
			this.view = this.getView();
			this.model = this.getModel( config.dataCallback );
			this.model.itemsLimit = config.itemsLimit;
			this.textWatcher = this.getTextWatcher( config.textTestCallback );
			this.commitKeystrokes = CKEDITOR.tools.array.isArray( configKeystrokes ) ? configKeystrokes.slice() : [ configKeystrokes ];
			this._listeners = [];
			this.outputTemplate = config.outputTemplate !== undefined ? new CKEDITOR.template( config.outputTemplate ) : null;

			if ( config.itemTemplate ) {
				this.view.itemTemplate = new CKEDITOR.template( config.itemTemplate );
			}

			
			if ( this.editor.status === 'ready' ) {
				this.attach();
			} else {
				this.editor.on( 'instanceReady', function() {
					this.attach();
				}, this );
			}

			editor.on( 'destroy', function() {
				this.destroy();
			}, this );
		}

		Autocomplete.prototype = {
			attach: function() {
				var editor = this.editor,
					win = CKEDITOR.document.getWindow(),
					editable = editor.editable(),
					editorScrollableElement = editable.isInline() ? editable : editable.getDocument();
				if ( CKEDITOR.env.iOS && !editable.isInline() ) {
					editorScrollableElement = iOSViewportElement( editor );
				}

				this.view.append();
				this.view.attach();
				this.textWatcher.attach();

				this._listeners.push( this.textWatcher.on( 'matched', this.onTextMatched, this ) );
				this._listeners.push( this.textWatcher.on( 'unmatched', this.onTextUnmatched, this ) );
				this._listeners.push( this.model.on( 'change-data', this.modelChangeListener, this ) );
				this._listeners.push( this.model.on( 'change-selectedItemId', this.onSelectedItemId, this ) );
				this._listeners.push( this.view.on( 'change-selectedItemId', this.onSelectedItemId, this ) );
				this._listeners.push( this.view.on( 'click-item', this.onItemClick, this ) );

			
				this._listeners.push( win.on( 'scroll', function() {
					this.viewRepositionListener();
				}, this ) );
				this._listeners.push( editorScrollableElement.on( 'scroll', function() {
					this.viewRepositionListener();
				}, this ) );

				
				this._listeners.push( this.view.element.on( 'mousedown', function( e ) {
					e.data.preventDefault();
				}, null, null, 9999 ) );

				if ( editable ) {
					this.registerPanelNavigation();
				}
				editor.on( 'contentDom', function() {
					this.registerPanelNavigation();
				}, this );
			},

			registerPanelNavigation: function() {
				var editable = this.editor.editable();
				this._listeners.push( editable.attachListener( editable, 'keydown', function( evt ) {
					this.onKeyDown( evt );
				}, this, null, 5 ) );
			},

			close: function() {
				this.model.setActive( false );
				this.view.close();
			},

			commit: function( itemId ) {
				if ( !this.model.isActive ) {
					return;
				}

				this.close();

				if ( itemId == null ) {
					itemId = this.model.selectedItemId;

			
					if ( itemId == null ) {
						return;
					}
				}

				var item = this.model.getItemById( itemId ),
					editor = this.editor;

				editor.fire( 'saveSnapshot' );
				editor.getSelection().selectRanges( [ this.model.range ] );
				editor.insertHtml( this.getHtmlToInsert( item ), 'text' );
				editor.fire( 'saveSnapshot' );
			},

		
			destroy: function() {
				CKEDITOR.tools.array.forEach( this._listeners, function( obj ) {
					obj.removeListener();
				} );

				this._listeners = [];

				this.view.element && this.view.element.remove();
			},

			
			getHtmlToInsert: function( item ) {
				var encodedItem = encodeItem( item );
				return this.outputTemplate ? this.outputTemplate.output( encodedItem ) : encodedItem.name;
			},

			
			getModel: function( dataCallback ) {
				var that = this;

				return new Model( function( matchInfo, callback ) {
					return dataCallback.call( this, CKEDITOR.tools.extend( {
						
						autocomplete: that
					}, matchInfo ), callback );
				} );
			},

			
			getTextWatcher: function( textTestCallback ) {
				return new CKEDITOR.plugins.textWatcher( this.editor, textTestCallback, this.throttle );
			},

		
			getView: function() {
				return new View( this.editor );
			},

			
			open: function() {
				if ( this.model.hasData() ) {
					this.model.setActive( true );
					this.view.open();
					this.model.selectFirst();
					this.view.updatePosition( this.model.range );
				}
			},

		
			viewRepositionListener: function() {
				if ( this.model.isActive ) {
					this.view.updatePosition( this.model.range );
				}
			},

		
			modelChangeListener: function( evt ) {
				if ( this.model.hasData() ) {
					this.view.updateItems( evt.data );
					this.open();
				} else {
					this.close();
				}
			},

		
			onItemClick: function( evt ) {
				this.commit( evt.data );
			},

			
			onKeyDown: function( evt ) {
				if ( !this.model.isActive ) {
					return;
				}

				var keyCode = evt.data.getKey(),
					handled = false;

				
				if ( keyCode == 27 ) {
					this.close();
					this.textWatcher.unmatch();
					handled = true;
			
				} else if ( keyCode == 40 ) {
					this.model.selectNext();
					handled = true;
			
				} else if ( keyCode == 38 ) {
					this.model.selectPrevious();
					handled = true;
				
				} else if ( CKEDITOR.tools.indexOf( this.commitKeystrokes, keyCode ) != -1 ) {
					this.commit();
					this.textWatcher.unmatch();
					handled = true;
				}

				if ( handled ) {
					evt.cancel();
					evt.data.preventDefault();
					this.textWatcher.consumeNext();
				}
			},


			onSelectedItemId: function( evt ) {
				this.model.setItem( evt.data );
				this.view.selectItem( evt.data );
			},

		
			onTextMatched: function( evt ) {
				this.model.setActive( false );
				this.model.setQuery( evt.data.text, evt.data.range );
			},

		
			onTextUnmatched: function() {
				
				this.model.query = null;
				this.model.lastRequestId = null;

				this.close();
			}
		};

		
		function View( editor ) {
		
			this.itemTemplate = new CKEDITOR.template( '<li data-id="{id}">{name}</li>' );

			
			this.editor = editor;

		}

		View.prototype = {
		
			append: function() {
				this.document = CKEDITOR.document;
				this.element = this.createElement();

				this.document.getBody().append( this.element );
			},

			
			appendItems: function( itemsFragment ) {
				this.element.setHtml( '' );
				this.element.append( itemsFragment );
			},

			
			attach: function() {
				this.element.on( 'click', function( evt ) {
					var target = evt.data.getTarget(),
						itemElement = target.getAscendant( this.isItemElement, true );

					if ( itemElement ) {
						this.fire( 'click-item', itemElement.data( 'id' ) );
					}
				}, this );

				this.element.on( 'mouseover', function( evt ) {
					var target = evt.data.getTarget();

					if ( this.element.contains( target ) ) {

						target = target.getAscendant( function( element ) {
							return element.hasAttribute( 'data-id' );
						}, true );

						if ( !target ) {
							return;
						}

						var itemId = target.data( 'id' );

						this.fire( 'change-selectedItemId', itemId );
					}

				}, this );
			},

		
			close: function() {
				this.element.removeClass( 'cke_autocomplete_opened' );
			},

			
			createElement: function() {
				var el = new CKEDITOR.dom.element( 'ul', this.document );

				el.addClass( 'cke_autocomplete_panel' );
				
				el.setStyle( 'z-index', this.editor.config.baseFloatZIndex - 3 );

				return el;
			},

			
			createItem: function( item ) {
				var encodedItem = encodeItem( item );
				return CKEDITOR.dom.element.createFromHtml( this.itemTemplate.output( encodedItem ), this.document );
			},

			
			getViewPosition: function( range ) {
				
				var rects = range.getClientRects(),
					viewPositionRect = rects[ rects.length - 1 ],
					offset,
					editable = this.editor.editable();

				if ( editable.isInline() ) {
					offset = CKEDITOR.document.getWindow().getScrollPosition();
				} else {
					offset = editable.getParent().getDocumentPosition( CKEDITOR.document );
				}

			
				var hostElement = CKEDITOR.document.getBody();
				if ( hostElement.getComputedStyle( 'position' ) === 'static' ) {
					hostElement = hostElement.getParent();
				}

				var offsetCorrection = hostElement.getDocumentPosition();

				offset.x -= offsetCorrection.x;
				offset.y -= offsetCorrection.y;

				return {
					top: ( viewPositionRect.top + offset.y ),
					bottom: ( viewPositionRect.top + viewPositionRect.height + offset.y ),
					left: ( viewPositionRect.left + offset.x )
				};
			},

			
			getItemById: function( itemId ) {
				return this.element.findOne( 'li[data-id="' + itemId + '"]' );
			},

			
			isItemElement: function( node ) {
				return node.type == CKEDITOR.NODE_ELEMENT &&
					Boolean( node.data( 'id' ) );
			},

			
			open: function() {
				this.element.addClass( 'cke_autocomplete_opened' );
			},

		
			selectItem: function( itemId ) {
				if ( this.selectedItemId != null ) {
					this.getItemById( this.selectedItemId ).removeClass( 'cke_autocomplete_selected' );
				}

				var itemElement = this.getItemById( itemId );
				itemElement.addClass( 'cke_autocomplete_selected' );
				this.selectedItemId = itemId;

				this.scrollElementTo( itemElement );
			},

			
			setPosition: function( rect ) {
				var editor = this.editor,
					viewHeight = this.element.getSize( 'height' ),
					editable = editor.editable(),
					
					editorViewportRect;

				
				if ( CKEDITOR.env.iOS && !editable.isInline() ) {
					editorViewportRect = iOSViewportElement( editor ).getClientRect( true );
				} else {
					editorViewportRect = editable.isInline() ? editable.getClientRect( true ) : editor.window.getFrame().getClientRect( true );
				}

			
				var spaceAbove = rect.top - editorViewportRect.top,
					spaceBelow = editorViewportRect.bottom - rect.bottom,
					top;

				
				top = rect.top < editorViewportRect.top ? editorViewportRect.top : Math.min( editorViewportRect.bottom, rect.bottom );

				
				if ( viewHeight > spaceBelow && viewHeight < spaceAbove ) {
					top = rect.top - viewHeight;
				}

				
				if ( editorViewportRect.bottom < rect.bottom ) {
					top = Math.min( rect.top - viewHeight, editorViewportRect.bottom - viewHeight );
				}

				
				if ( editorViewportRect.top > rect.top ) {
					top = Math.max( rect.bottom, editorViewportRect.top );
				}

				this.element.setStyles( {
					left: rect.left + 'px',
					top: top + 'px'
				} );
			},

	
			scrollElementTo: function( itemElement ) {
				itemElement.scrollIntoParent( this.element );
			},

			
			updateItems: function( items ) {
				var i,
					frag = new CKEDITOR.dom.documentFragment( this.document );

				for ( i = 0; i < items.length; ++i ) {
					frag.append( this.createItem( items[ i ] ) );
				}

				this.appendItems( frag );
				this.selectedItemId = null;
			},

			
			updatePosition: function( range ) {
				this.setPosition( this.getViewPosition( range ) );
			}
		};

		CKEDITOR.event.implementOn( View.prototype );

		
		function Model( dataCallback ) {
		
			this.dataCallback = dataCallback;

			
			this.isActive = false;

			
			this.itemsLimit = 0;


			
		}

		Model.prototype = {
		
			getIndexById: function( itemId ) {
				if ( !this.hasData() ) {
					return -1;
				}

				for ( var data = this.data, i = 0, l = data.length; i < l; i++ ) {
					if ( data[ i ].id == itemId ) {
						return i;
					}
				}

				return -1;
			},

		
			getItemById: function( itemId ) {
				var index = this.getIndexById( itemId );
				return ~index && this.data[ index ] || null;
			},

			
			hasData: function() {
				return Boolean( this.data && this.data.length );
			},

			
			setItem: function( itemId ) {
				if ( this.getIndexById( itemId ) < 0 ) {
					throw new Error( 'Item with given id does not exist' );
				}

				this.selectedItemId = itemId;
			},

			select: function( itemId ) {
				this.fire( 'change-selectedItemId', itemId );
			},

			
			selectFirst: function() {
				if ( this.hasData() ) {
					this.select( this.data[ 0 ].id );
				}
			},

			
			selectLast: function() {
				if ( this.hasData() ) {
					this.select( this.data[ this.data.length - 1 ].id );
				}
			},

			
			selectNext: function() {
				if ( this.selectedItemId == null ) {
					this.selectFirst();
					return;
				}

				var index = this.getIndexById( this.selectedItemId );

				if ( index < 0 || index + 1 == this.data.length ) {
					this.selectFirst();
				} else {
					this.select( this.data[ index + 1 ].id );
				}
			},

		
			selectPrevious: function() {
				if ( this.selectedItemId == null ) {
					this.selectLast();
					return;
				}

				var index = this.getIndexById( this.selectedItemId );

				if ( index <= 0 ) {
					this.selectLast();
				} else {
					this.select( this.data[ index - 1 ].id );
				}
			},

			
			setActive: function( isActive ) {
				this.isActive = isActive;
				this.fire( 'change-isActive', isActive );
			},

			
			setQuery: function( query, range ) {
				var that = this,
					requestId = CKEDITOR.tools.getNextId();

				this.lastRequestId = requestId;
				this.query = query;
				this.range = range;
				this.data = null;
				this.selectedItemId = null;

				this.dataCallback( {
					query: query,
					range: range
				}, handleData );

			

				function handleData( data ) {
					
					if ( requestId == that.lastRequestId ) {
		
						if ( that.itemsLimit ) {
							that.data = data.slice( 0, that.itemsLimit );
						} else {
							that.data = data;
						}
						that.fire( 'change-data', that.data );
					}
				}
			}
		};

		CKEDITOR.event.implementOn( Model.prototype );


		CKEDITOR.plugins.autocomplete = Autocomplete;
		Autocomplete.view = View;
		Autocomplete.model = Model;

		CKEDITOR.config.autocomplete_commitKeystrokes = [ 9, 13 ];


		function iOSViewportElement( editor ) {
			return editor.window.getFrame().getParent();
		}

		function encodeItem( item ) {
			return CKEDITOR.tools.array.reduce( CKEDITOR.tools.object.keys( item ), function( cur, key ) {
				cur[ key ] = CKEDITOR.tools.htmlEncode( item[ key ] );
				return cur;
			}, {} );
		}


	} )();
}