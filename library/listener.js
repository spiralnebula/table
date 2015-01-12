 (function ( window, module ) {

	if ( window.define && window.define.amd ) {
		define(module)
	} else { 

		var current_scripts, this_script, module_name

		current_scripts     = document.getElementsByTagName("script")
		this_script         = current_scripts[current_scripts.length-1]
		module_name         = this_script.getAttribute("data-module-name") || "listener"
		window[module_name] = module
	}
})( 
	window,
	{
		define : {
			allow   : "*",
			require : [
				"morph",
				"transistor",
				"body",
				"bodymap",
			],
		},

		define_listener : function ( define ) {

			var self = this
			return [
				{
					for       : "change table",
					that_does : function ( heard ) {

						var table_body, table_content

						table_body             = heard.event.target
						table_body.style.width = ( 
							heard.state.data.view[heard.state.view.current_name].column.length * 
							define.with.format.field.width 
						) + "px"
						table_content          = self.library.transistor.make(
							self.library.body.define_row_and_column({
								class_name : define.class_name,
								with       : {
									data   : heard.state.view.new_definition,
									format : define.with.format
								}
							})
						)

						if ( table_body.firstChild ) { 
							table_body.removeChild( table_body.firstChild )
						}
						if ( table_body.style.display === "none" ) { 
							table_body.style.display = "block"
						}
						table_content.append( table_body )

						return heard
					}
				},
				{ 
					for       : "change view back",
					that_does : function ( heard ) {

						return define.event_circle.stage_event({
							called : "change table",
							as     : function ( state ) {

								var view_definition, view_name, new_position

								new_position    = state.view.history.position-1
								view_name       = state.view.history.record[new_position]
								view_definition = state.data.view[view_name]

								state.view.history.position = new_position
								state.view.new_definition   = view_definition
								state.view.current_name     = view_name

								return { 
									state : state,
									event : { 
										target : define.body.body
									}
								}
							}
						})	

						return heard
					}
				},
				{ 
					for       : "change view forward",
					that_does : function ( heard ) {
						
						return define.event_circle.stage_event({
							called : "change table",
							as     : function ( state ) {

								var view_definition, view_name, new_position

								new_position    = state.view.history.position+1
								view_name       = state.view.history.record[new_position]
								view_definition = state.data.view[view_name]

								state.view.history.position = new_position
								state.view.new_definition   = view_definition
								state.view.current_name     = view_name

								return { 
									state : state,
									event : { 
										target : define.body.body
									}
								}
							}
						})	

						return heard
					}
				},
				{ 
					for       : "change view",
					that_does : function ( heard ) {
						
						var view_name, view_definition

						view_name         = heard.event.target.getAttribute("data-table-choose-view")
						view_definition   = heard.state.data.view[view_name]

						if ( view_definition.url ) {

							var finish_method

							finish_method        = view_definition.when.finished
							view_definition.when = { 
								finished : function ( given ) { 

									var loaded_view_definition

									loaded_view_definition = finish_method.call({}, given )

									define.event_circle.stage_event({
										called : "change table",
										as     : function ( state ) {
											
											state.data.view[view_name] = loaded_view_definition

											return self.prepare_state_for_table_change({
												state           : state,
												view_definition : loaded_view_definition,
												view_name       : view_name,
												body            : define.body.body,
											})
										}
									})	
								}
							}

							self.library.transit.to( view_definition )
						}

						if ( view_definition.column ) {

							return define.event_circle.stage_event({
								called : "change table",
								as     : function ( state ) {

									return self.prepare_state_for_table_change({
										state           : state,
										view_definition : view_definition,
										view_name       : view_name,
										body            : define.body.body,
									})
								}
							})
						}
						
						return heard
					}
				},
			]
		},

		prepare_state_for_table_change : function ( given ) {

			given.state.view.new_definition   = given.view_definition
			given.state.view.current_name     = given.view_name
			given.state.view.history.position = given.state.view.history.position + 1
			given.state.view.history.record   = given.state.view.history.record.slice( 0, given.state.view.history.position ).concat( given.view_name )

			return { 
				state : given.state,
				event : { 
					target : given.body
				}
			}
		}
	}
)