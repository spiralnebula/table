define({

	define : {
		allow   : "*",
		require : [
			"transistor",
			"event_master",
			"body",
			"event",
			"listener",
		]
	},

	nonon : function () { 
		console.log("some some")
	},

	define_export_name : function ( define ) { 
		return define.called
	},

	make : function ( define ) {
		console.log( define )
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