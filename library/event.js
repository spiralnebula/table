define({
	
	define : {
		allow   : "*",
		require : [
			"transistor",
			"morph",
			"body",
			"transit",
		]
	},

	define_state : function ( define ) {
		return {
			data : define.with.data || {},
			view : {
				loading_view   : false,
				new_definition : {},
				current_name   : "main",
				history        : {
					position : 0,
					record   : [
						"main"
					],
				},
			}
		}
	},

	define_event : function ( define ) {
		return [
			{ 
				called : "change table"
			},
			{ 
				called : "change view back",
				that_happens : [
					{
						on : define.body.body,
						is : [ "click" ]
					}
				],
				only_if : function ( heard ) {
					return ( 
						heard.event.target.getAttribute("data-button") === "back"	&&
						heard.state.view.history.position > 0
					)
				}
			},
			{ 
				called : "change view forward",
				that_happens : [
					{
						on : define.body.body,
						is : [ "click" ]
					}
				],
				only_if : function ( heard ) { 
					return (
						heard.event.target.getAttribute("data-button") === "forward"	&&
						heard.state.view.history.position < heard.state.view.history.record.length-1
					)
				}
			},
			{ 
				called : "change view",
				that_happens : [
					{ 
						on : define.body.body,
						is : [ "click" ]
					}
				],
				only_if : function ( heard ) { 
					return ( 
						heard.event.target.hasAttribute("data-table-choose-view") &&
						heard.state.view.loading_view === false
					)
				}
			},
		]
	},
})