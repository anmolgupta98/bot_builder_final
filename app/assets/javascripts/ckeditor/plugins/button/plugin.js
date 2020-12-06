if (typeof(CKEDITOR) != 'undefined') {
( function() {
	var template = '<a id="{id}"' +
		' class="cke_button cke_button__{name} cke_button_{state} {cls}"' +
		( CKEDITOR.env.gecko && !CKEDITOR.env.hc ? '' : ' href="javascript:void(\'{titleJs}\')"' ) +
		' title="{title}"' +
		' tabindex="-1"' +
		' hidefocus="true"' +
		' role="button"' +
		' aria-labelledby="{id}_label"' +
		' aria-describedby="{id}_description"' +
		' aria-haspopup="{hasArrow}"' +
		' aria-disabled="{ariaDisabled}"';

	
	if ( CKEDITOR.env.gecko && CKEDITOR.env.mac )
		template += ' onkeypress="return false;"';


	if ( CKEDITOR.env.gecko )
		template += ' onblur="this.style.cssText = this.style.cssText;"';

	
	var specialClickHandler = '';
	if ( CKEDITOR.env.ie ) {
		specialClickHandler = 'return false;" onmouseup="CKEDITOR.tools.getMouseButton(event)==CKEDITOR.MOUSE_BUTTON_LEFT&&';
	}

	template += ' onkeydown="return CKEDITOR.tools.callFunction({keydownFn},event);"' +
		' onfocus="return CKEDITOR.tools.callFunction({focusFn},event);" ' +
		'onclick="' + specialClickHandler + 'CKEDITOR.tools.callFunction({clickFn},this);return false;">' +
		'<span class="cke_button_icon cke_button__{iconName}_icon" style="{style}"';


	template += '>&nbsp;</span>' +
		'<span id="{id}_label" class="cke_button_label cke_button__{name}_label" aria-hidden="false">{label}</span>' +
		'<span id="{id}_description" class="cke_button_label" aria-hidden="false">{ariaShortcut}</span>' +
		'{arrowHtml}' +
		'</a>';

	var templateArrow = '<span class="cke_button_arrow">' +
		
	( CKEDITOR.env.hc ? '&#9660;' : '' ) +
		'</span>';

	var btnArrowTpl = CKEDITOR.addTemplate( 'buttonArrow', templateArrow ),
		btnTpl = CKEDITOR.addTemplate( 'button', template );

	CKEDITOR.plugins.add( 'button', {
		beforeInit: function( editor ) {
			editor.ui.addHandler( CKEDITOR.UI_BUTTON, CKEDITOR.ui.button.handler );
		}
	} );

	
	CKEDITOR.UI_BUTTON = 'button';

	
	CKEDITOR.ui.button = function( definition ) {
		CKEDITOR.tools.extend( this, definition,
	
		{
			title: definition.label,
			click: definition.click ||
			function( editor ) {
				editor.execCommand( definition.command );
			}
		} );

		this._ = {};
	};

	
	CKEDITOR.ui.button.handler = {
	
		create: function( definition ) {
			return new CKEDITOR.ui.button( definition );
		}
	};

	
	CKEDITOR.ui.button.prototype = {
		
		render: function( editor, output ) {
			var modeStates = null;

			function updateState() {
				
				var mode = editor.mode;

				if ( mode ) {
					
					var state = this.modes[ mode ] ? modeStates[ mode ] !== undefined ? modeStates[ mode ] : CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED;

					state = editor.readOnly && !this.readOnly ? CKEDITOR.TRISTATE_DISABLED : state;

					this.setState( state );

			
					if ( this.refresh )
						this.refresh();
				}
			}

			var env = CKEDITOR.env,
				id = this._.id = CKEDITOR.tools.getNextId(),
				stateName = '',
				command = this.command,
				clickFn,
				keystroke,
				shortcut;

			this._.editor = editor;

			var instance = {
				id: id,
				button: this,
				editor: editor,
				focus: function() {
					var element = CKEDITOR.document.getById( id );
					element.focus();
				},
				execute: function() {
					this.button.click( editor );
				},
				attach: function( editor ) {
					this.button.attach( editor );
				}
			};

			var keydownFn = CKEDITOR.tools.addFunction( function( ev ) {
				if ( instance.onkey ) {
					ev = new CKEDITOR.dom.event( ev );
					return ( instance.onkey( instance, ev.getKeystroke() ) !== false );
				}
			} );

			var focusFn = CKEDITOR.tools.addFunction( function( ev ) {
				var retVal;

				if ( instance.onfocus )
					retVal = ( instance.onfocus( instance, new CKEDITOR.dom.event( ev ) ) !== false );

				return retVal;
			} );

			var selLocked = 0;

			instance.clickFn = clickFn = CKEDITOR.tools.addFunction( function() {

				
				if ( selLocked ) {
					editor.unlockSelection( 1 );
					selLocked = 0;
				}
				instance.execute();

				
				if ( env.iOS ) {
					editor.focus();
				}
			} );


			if ( this.modes ) {
				modeStates = {};

				editor.on( 'beforeModeUnload', function() {
					if ( editor.mode && this._.state != CKEDITOR.TRISTATE_DISABLED )
						modeStates[ editor.mode ] = this._.state;
				}, this );

				
				editor.on( 'activeFilterChange', updateState, this );
				editor.on( 'mode', updateState, this );
		
				!this.readOnly && editor.on( 'readOnly', updateState, this );

			} else if ( command ) {
		
				command = editor.getCommand( command );

				if ( command ) {
					command.on( 'state', function() {
						this.setState( command.state );
					}, this );

					stateName += ( command.state == CKEDITOR.TRISTATE_ON ? 'on' : command.state == CKEDITOR.TRISTATE_DISABLED ? 'disabled' : 'off' );
				}
			}

			var iconName;

			
			if ( this.directional ) {
				editor.on( 'contentDirChanged', function( evt ) {
					var el = CKEDITOR.document.getById( this._.id ),
						icon = el.getFirst();

					var pathDir = evt.data;

					if ( pathDir !=  editor.lang.dir )
						el.addClass( 'cke_' + pathDir );
					else
						el.removeClass( 'cke_ltr' ).removeClass( 'cke_rtl' );

					
					icon.setAttribute( 'style', CKEDITOR.skin.getIconStyle( iconName, pathDir == 'rtl', this.icon, this.iconOffset ) );
				}, this );
			}

			if ( !command ) {
				stateName += 'off';
			} else {
				keystroke = editor.getCommandKeystroke( command );

				if ( keystroke ) {
					shortcut = CKEDITOR.tools.keystrokeToString( editor.lang.common.keyboard, keystroke );
				}
			}

			var name = this.name || this.command,
				iconPath = null,
				overridePath = this.icon;

			iconName = name;

			
			if ( this.icon && !( /\./ ).test( this.icon ) ) {
				iconName = this.icon;
				overridePath = null;

			} else {
			
				if ( this.icon ) {
					iconPath = this.icon;
				}
				if ( CKEDITOR.env.hidpi && this.iconHiDpi ) {
					iconPath = this.iconHiDpi;
				}
			}

			if ( iconPath ) {
				CKEDITOR.skin.addIcon( iconPath, iconPath );
				overridePath = null;
			} else {
				iconPath = iconName;
			}

			var params = {
				id: id,
				name: name,
				iconName: iconName,
				label: this.label,
				
				cls:  ( this.hasArrow ? 'cke_button_expandable ' : '' ) + ( this.className || '' ),
				state: stateName,
				ariaDisabled: stateName == 'disabled' ? 'true' : 'false',
				title: this.title + ( shortcut ? ' (' + shortcut.display + ')' : '' ),
				ariaShortcut: shortcut ? editor.lang.common.keyboardShortcut + ' ' + shortcut.aria : '',
				titleJs: env.gecko && !env.hc ? '' : ( this.title || '' ).replace( "'", '' ),
				hasArrow: typeof this.hasArrow === 'string' && this.hasArrow || ( this.hasArrow ? 'true' : 'false' ),
				keydownFn: keydownFn,
				focusFn: focusFn,
				clickFn: clickFn,
				style: CKEDITOR.skin.getIconStyle( iconPath, ( editor.lang.dir == 'rtl' ), overridePath, this.iconOffset ),
				arrowHtml: this.hasArrow ? btnArrowTpl.output() : ''
			};

			btnTpl.output( params, output );

			if ( this.onRender )
				this.onRender();

			return instance;
		},

		setState: function( state ) {
			if ( this._.state == state )
				return false;

			this._.state = state;

			var element = CKEDITOR.document.getById( this._.id );

			if ( element ) {
				element.setState( state, 'cke_button' );
				element.setAttribute( 'aria-disabled', state == CKEDITOR.TRISTATE_DISABLED );

				if ( !this.hasArrow ) {
					
					if ( state === CKEDITOR.TRISTATE_ON ) {
						element.setAttribute( 'aria-pressed', true );
					} else {
						element.removeAttribute( 'aria-pressed' );
					}
				} else {
					
					element.setAttribute( 'aria-expanded', state == CKEDITOR.TRISTATE_ON );
				}

				return true;
			} else {
				return false;
			}
		},

		
		toFeature: function( editor ) {
			if ( this._.feature )
				return this._.feature;

			var feature = this;

		
			if ( !this.allowedContent && !this.requiredContent && this.command )
				feature = editor.getCommand( this.command ) || feature;

			return this._.feature = feature;
		}
	};

	
	CKEDITOR.ui.prototype.addButton = function( name, definition ) {
		this.add( name, CKEDITOR.UI_BUTTON, definition );
	};

} )();
}