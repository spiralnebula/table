define({

	define : {
		allow   : "*",
		require : [
			"transistor",
			"event_master",
			"body",
			"event",
			"listener",
			"transit",
			"url_parser",
		]
	},

	define_export_name : function ( define ) { 
		return define.called
	},

	make : function ( define ) {
		
		var table_body, event_circle, table_interface

		table_body   = this.library.transistor.make(
			this.define_body( 
				define 
			)
		)
		event_circle = this.library.event_master.make({
			state  : this.define_state( define ),
			events : this.define_event({
				body : table_body,
				with : define
			})
		})
		event_circle.add_listener(
			this.define_listener({
				body         : table_body,
				class_name   : define.class_name,
				with         : define.with,
				event_circle : event_circle
			})
		)
		table_interface = this.define_interface({
			body         : table_body,
			event_master : event_circle
		})

		if ( define.inside ) { 
			table_interface.append( define.inside )
		}

		if ( define.with.url ) {

			var transit_instructions, url_paramaters

			url_paramaters = this.library.url_parser.get_paramaters_of_url( window.location.href )

			if (
				!define.with.url.only_set_if ||
				define.with.url.only_set_if.call( {}, url_paramaters )
			) { 

				transit_instructions = define.with.url.reader.call( 
					{},
					url_paramaters
				)
				transit_instructions.when = { 
					finished : function ( given ) {
						table_interface.set_value(
							define.with.url.setter.call(
								{},
								{
									with   : url_paramaters,
									result : given.result
								}
							)
						)
					}
				}

				this.library.transit.to(
					transit_instructions
				)
			}

		}

		return table_interface
	},

	define_interface : function ( define ) {

		var self = this

		return {
			body      : define.body.body,
			append    : define.body.append,
			set_value : function ( set ) {
				define.event_master.stage_event({
					called : "change table",
					as     : function ( state ) {
						
						var new_state
						new_state = self.define_state({
							class_name : define.class_name,
							with       : {
								data       : set.data
							}
						})
						new_state.view.new_definition = set.data.view.main
						return { 
							state : new_state,
							event : {
								target : define.body.body
							}
						}
					}
				})
			}
		}
	},

	define_state : function ( define ) {
		return this.library.event.define_state( define )
	},

	define_body : function ( define ) {
		return this.library.body.define_body( define )
	},

	define_event : function ( define ) {
		return this.library.event.define_event( define )
	},

	define_listener : function ( define ) {
		return this.library.listener.define_listener( define )
	},

	convert_string_to_option_name : function ( string ) { 
		return string.toLowerCase().replace(/\s/g, "_")
	}
})