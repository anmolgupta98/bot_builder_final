if (typeof(CKEDITOR) != 'undefined') {
( function() {
	CKEDITOR.plugins.add( 'panel', {
		beforeInit: function( editor ) {
			editor.ui.addHandler( CKEDITOR.UI_PANEL, CKEDITOR.ui.panel.handler );
		}
	} );


	CKEDITOR.UI_PANEL = 'panel';


	CKEDITOR.ui.panel = function( document, definition ) {
		
		if ( definition )
			CKEDITOR.tools.extend( this, definition );


		CKEDITOR.tools.extend( this, {
			className: '',
			css: []
		} );

		this.id = CKEDITOR.tools.getNextId();
		this.document = document;
		this.isFramed = this.forceIFrame || this.css.length;

		this._ = {
			blocks: {}
		};
	};

	
	CKEDITOR.ui.panel.handler = {
	
		create: function( definition ) {
			return new CKEDITOR.ui.panel( definition );
		}
	};

	var panelTpl = CKEDITOR.addTemplate( 'panel', '<div lang="{langCode}" id="{id}" dir={dir}' +
		' class="cke cke_reset_all {editorId} cke_panel cke_panel {cls} cke_{dir}"' +
		' style="z-index:{z-index}" role="presentation">' +
		'{frame}' +
		'</div>' );

	var frameTpl = CKEDITOR.addTemplate( 'panel-frame', '<iframe id="{id}" class="cke_panel_frame" role="presentation" frameborder="0" src="{src}"></iframe>' );

	var frameDocTpl = CKEDITOR.addTemplate( 'panel-frame-inner', '<!DOCTYPE html>' +
		'<html class="cke_panel_container {env}" dir="{dir}" lang="{langCode}">' +
			'<head>{css}</head>' +
			'<body class="cke_{dir}"' +
				' style="margin:0;padding:0" onload="{onload}"></body>' +
		'<\/html>' );


	CKEDITOR.ui.panel.prototype = {
	
		render: function( editor, output ) {
			var data = {
				editorId: editor.id,
				id: this.id,
				langCode: editor.langCode,
				dir: editor.lang.dir,
				cls: this.className,
				frame: '',
				env: CKEDITOR.env.cssClass,
				'z-index': editor.config.baseFloatZIndex + 1
			};

			this.getHolderElement = function() {
				var holder = this._.holder;

				if ( !holder ) {
					if ( this.isFramed ) {
						var iframe = this.document.getById( this.id + '_frame' ),
							parentDiv = iframe.getParent(),
							doc = iframe.getFrameDocument();

						
						CKEDITOR.env.iOS && parentDiv.setStyles( {
							'overflow': 'scroll',
							'-webkit-overflow-scrolling': 'touch'
						} );

						var onLoad = CKEDITOR.tools.addFunction( CKEDITOR.tools.bind( function() {
							this.isLoaded = true;
							if ( this.onLoad )
								this.onLoad();
						}, this ) );

						doc.write( frameDocTpl.output( CKEDITOR.tools.extend( {
							css: CKEDITOR.tools.buildStyleHtml( this.css ),
							onload: 'window.parent.CKEDITOR.tools.callFunction(' + onLoad + ');'
						}, data ) ) );

						var win = doc.getWindow();

						
						win.$.CKEDITOR = CKEDITOR;

						
						doc.on( 'keydown', function( evt ) {
							var keystroke = evt.data.getKeystroke(),
								dir = this.document.getById( this.id ).getAttribute( 'dir' );

						
							if ( evt.data.getTarget().getName() === 'input' && ( keystroke === 37 || keystroke === 39 ) ) {
								return;
							}
						
							if ( this._.onKeyDown && this._.onKeyDown( keystroke ) === false ) {
								if ( !( evt.data.getTarget().getName() === 'input' && keystroke === 32 ) ) {
									
									evt.data.preventDefault();
								}
								return;
							}

							
							if ( keystroke == 27 || keystroke == ( dir == 'rtl' ? 39 : 37 ) ) {
								if ( this.onEscape && this.onEscape( keystroke ) === false )
									evt.data.preventDefault();
							}
						}, this );

						holder = doc.getBody();
						holder.unselectable();
						CKEDITOR.env.air && CKEDITOR.tools.callFunction( onLoad );
					} else {
						holder = this.document.getById( this.id );
					}

					this._.holder = holder;
				}

				return holder;
			};

			if ( this.isFramed ) {
			
				var src =
					CKEDITOR.env.air ? 'javascript:void(0)' : 
					( CKEDITOR.env.ie && !CKEDITOR.env.edge ) ? 'javascript:void(function(){' + encodeURIComponent( 
						'document.open();' +
						
						'(' + CKEDITOR.tools.fixDomain + ')();' +
						'document.close();'
					) + '}())' :
					'';

				data.frame = frameTpl.output( {
					id: this.id + '_frame',
					src: src
				} );
			}

			var html = panelTpl.output( data );

			if ( output )
				output.push( html );

			return html;
		},

	
		addBlock: function( name, block ) {
			block = this._.blocks[ name ] = block instanceof CKEDITOR.ui.panel.block ? block : new CKEDITOR.ui.panel.block( this.getHolderElement(), block );

			if ( !this._.currentBlock )
				this.showBlock( name );

			return block;
		},

		
		getBlock: function( name ) {
			return this._.blocks[ name ];
		},

		
		showBlock: function( name ) {
			var blocks = this._.blocks,
				block = blocks[ name ],
				current = this._.currentBlock;

		
			var holder = !this.forceIFrame || CKEDITOR.env.ie ? this._.holder : this.document.getById( this.id + '_frame' );

			if ( current )
				current.hide();

			this._.currentBlock = block;

			CKEDITOR.fire( 'ariaWidget', holder );

			
			block._.focusIndex = -1;

			this._.onKeyDown = block.onKeyDown && CKEDITOR.tools.bind( block.onKeyDown, block );

			block.show();

			return block;
		},

		destroy: function() {
			this.element && this.element.remove();
		}
	};

	
	CKEDITOR.ui.panel.block = CKEDITOR.tools.createClass( {
	
		$: function( blockHolder, blockDefinition ) {
			this.element = blockHolder.append( blockHolder.getDocument().createElement( 'div', {
				attributes: {
					'tabindex': -1,
					'class': 'cke_panel_block'
				},
				styles: {
					display: 'none'
				}
			} ) );

		
			if ( blockDefinition )
				CKEDITOR.tools.extend( this, blockDefinition );

		
			this.element.setAttributes( {
				'role': this.attributes.role || 'presentation',
				'aria-label': this.attributes[ 'aria-label' ],
				'title': this.attributes.title || this.attributes[ 'aria-label' ]
			} );

			this.keys = {};

			this._.focusIndex = -1;

			this.element.disableContextMenu();
		},

		_: {

			
			markItem: function( index ) {
				if ( index == -1 )
					return;
				var focusables = this._.getItems();
				var item = focusables.getItem( this._.focusIndex = index );

				
				if ( CKEDITOR.env.webkit )
					item.getDocument().getWindow().focus();
				item.focus();

				this.onMark && this.onMark( item );
			},

			
			markFirstDisplayed: function( beforeMark ) {
				var notDisplayed = function( element ) {
						return element.type == CKEDITOR.NODE_ELEMENT && element.getStyle( 'display' ) == 'none';
					},
					focusables = this._.getItems(),
					item, focused;

				for ( var i = focusables.count() - 1; i >= 0; i-- ) {
					item = focusables.getItem( i );

					if ( !item.getAscendant( notDisplayed ) ) {
						focused = item;
						this._.focusIndex = i;
					}

					if ( item.getAttribute( 'aria-selected' ) == 'true' ) {
						focused = item;
						this._.focusIndex = i;
						break;
					}
				}

				if ( !focused ) {
					return;
				}

				if ( beforeMark ) {
					beforeMark();
				}

				if ( CKEDITOR.env.webkit )
					focused.getDocument().getWindow().focus();
				focused.focus();

				this.onMark && this.onMark( focused );
			},

		
			getItems: function() {
				return this.element.find( 'a,input' );
			}
		},

		proto: {
			show: function() {
				this.element.setStyle( 'display', '' );
			},

			hide: function() {
				if ( !this.onHide || this.onHide.call( this ) !== true )
					this.element.setStyle( 'display', 'none' );
			},

			onKeyDown: function( keystroke, noCycle ) {
				var keyAction = this.keys[ keystroke ];
				switch ( keyAction ) {
			
					case 'next':
						var index = this._.focusIndex,
							focusables = this._.getItems(),
							focusable;

						while ( ( focusable = focusables.getItem( ++index ) ) ) {
							
							if ( focusable.getAttribute( '_cke_focus' ) && focusable.$.offsetWidth ) {
								this._.focusIndex = index;
								focusable.focus( true );
								break;
							}
						}

						if ( !focusable && !noCycle ) {
							this._.focusIndex = -1;
							return this.onKeyDown( keystroke, 1 );
						}

						return false;

					
					case 'prev':
						index = this._.focusIndex;
						focusables = this._.getItems();

						while ( index > 0 && ( focusable = focusables.getItem( --index ) ) ) {
							
							if ( focusable.getAttribute( '_cke_focus' ) && focusable.$.offsetWidth ) {
								this._.focusIndex = index;
								focusable.focus( true );
								break;
							}

							
							focusable = null;
						}

						
						if ( !focusable && !noCycle ) {
							this._.focusIndex = focusables.count();
							return this.onKeyDown( keystroke, 1 );
						}

						return false;

					case 'click':
					case 'mouseup':
						index = this._.focusIndex;
						focusable = index >= 0 && this._.getItems().getItem( index );

						if ( focusable ) {
							
							focusable.fireEventHandler( keyAction, {
								button: CKEDITOR.tools.normalizeMouseButton( CKEDITOR.MOUSE_BUTTON_LEFT, true )
							} );
						}

						return false;
				}

				return true;
			}
		}
	} );

} )();

}
