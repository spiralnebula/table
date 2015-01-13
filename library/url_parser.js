(function ( window, module ) {

	if ( window.define && window.define.amd ) {
		define(module)
	} else { 

		var current_scripts, this_script, module_name

		current_scripts     = document.getElementsByTagName("script")
		this_script         = current_scripts[current_scripts.length-1]
		module_name         = this_script.getAttribute("data-module-name") || "url_parser"
		window[module_name] = module
	}
})( 
	window,
	{
		define : {
			allow   : "*",
			require : [ 
				"morph" 
			],
		},

		get_paramaters_of_url : function ( url ) { 
			
			var self, paramater_string, object_of_paramaters
			
			self                 = this
			object_of_paramaters = {}
			paramater_string     = url.split("?")

			if ( paramater_string.length > 1 ) {

				object_of_paramaters = this.library.morph.index_loop({
					subject : paramater_string[1].split("&"),
					into    : {},
					else_do : function ( loop ) {

						var split_paramater_string, paramater_key, paramater_value,
						paramater_value_is_uri_encoded

						split_paramater_string         = loop.indexed.split("=")
						paramater_key                  = split_paramater_string[0]
						paramater_value                = split_paramater_string[1]
						paramater_value_is_uri_encoded = self.is_string_a_uri_component({
							string : paramater_value
						})

						if ( paramater_value_is_uri_encoded ) { 
							var paramater_value_is_json
							paramater_value         = window.decodeURIComponent( paramater_value )
							paramater_value_is_json = self.is_string_json({
								string : paramater_value
							})
							if ( paramater_value_is_json ) { 
								paramater_value = JSON.parse( paramater_value )
							}
						}

						loop.into[paramater_key] = paramater_value
						return loop.into
					}
				})
			}

			return {
				paramaters : object_of_paramaters
			}
		},

		is_string_a_uri_component : function ( given ) {
			var symbol_to_encoding, number_of_matched_symbols
			symbol_to_encoding = {
				"{"     : "%7B",
				":"     : "%3A",
				"/"     : "%2F",
				"}"     : "%7D",
				";"     : "%3B",
				"space" : "%20",
			}

			number_of_matched_symbols = this.library.morph.index_loop({
				subject : this.library.morph.get_the_values_of_an_object(
					symbol_to_encoding
				),
				into    : 0,
				else_do : function ( loop ) {

					if ( given.string.match( loop.indexed ) ) {
						return loop.into + 1
					}
					
					return loop.into
				}
			})
			return ( number_of_matched_symbols > 0 ) 
		},

		is_string_json : function ( given ) { 

			try { 
				JSON.parse( given.string )
			} catch ( exception ) {
				return false 
			}
			return true
		}
	}
)