(function ( window, module ) {

	if ( window.define && window.define.amd ) {
		define(module)
	} else { 

		var current_scripts, this_script, module_name

		current_scripts     = document.getElementsByTagName("script")
		this_script         = current_scripts[current_scripts.length-1]
		module_name         = this_script.getAttribute("data-module-name") || "bodymap"
		window[module_name] = module
	}
})( 
	window,
	{
		define : {
			allow   : "*",
			require : [ "morph" ],
		},

		make : function ( given ) {

			var given_instruction_to_true_instruction, self

			self                                  = this
			given_instruction_to_true_instruction = {
				"1"      : "firstChild",
				"first"  : "firstChild",
				"last"   : "lastChild",
				"^"      : "parentElement",
				"parent" : "parentElement",
			}

			return this.library.morph.inject_object({
				object : {
					main : given.body
				},
				with   : this.library.morph.biject_object({ 
					object : given.map,
					with   : function ( loop ) {
						return {
							value : self.library.morph.index_loop({
								subject : loop.value.split(":"),
								into    : given.body,
								else_do : function ( loop ) {
									return loop.into[given_instruction_to_true_instruction[loop.indexed]]
								}
							})
						}
					}
				})
			})
		},
	}
)