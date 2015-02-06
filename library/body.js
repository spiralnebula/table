define({
	
	define : {
		allow   : "*",
		require : [
			"morph"
		]
	},

	define_body : function ( define ) {

		var self, content
		
		self    = this
		content = []

		if ( define.with.control ) {
			content = content.concat( this.define_control_body( define ) )
		}

		if ( define.with.data ) {
			content = content.concat([
				this.define_row_and_column({
					class_name : define.class_name,
					with       : {
						data   : define.with.data.view.main,
						format : define.with.format
					}
				})
			])
		}

		if ( define.with.data ) {
			return {
				"width" : ( define.with.format.field.width * define.with.data.view.main.column.length ) + "px",
				"class" : define.class_name.wrap,
				"child" : content
			}
		} else {
			return {
				"display" : "none",
				"class"   : define.class_name.wrap,
				"child"   : content
			}
		}
	},

	define_control_body : function ( define ) {
		return {
			"class" : define.class_name.control,
			"child" : [ 
				{ 
					"class"       : define.class_name.control_button,
					"text"        : "Back",
					"data-button" : "back",
					"mark_as"     : "back button",
				},
				{ 
					"class"       : define.class_name.control_button,
					"text"        : "Forward",
					"data-button" : "forward",
					"mark_as"     : "forward button",
				},
				{ 
					"class"   : define.class_name.control_text,
					"mark_as" : "control text",
					"text"    : "Some text here",
				}
			]
		}
	},

	define_row_and_column : function ( define ) {

		var self = this
		return {
			"class" : define.class_name.content,
			"child" : [
				this.define_column_name_row({
					class_name : define.class_name,
					with       : { 
						column : define.with.data.column,
						format : define.with.format
					}
				}),
				this.define_row({
					class_name : define.class_name,
					with       : {
						row    : define.with.data.row,
						format : define.with.format
					}
				})
			]
		}
	},

	define_column_name_row : function ( define ) {
		var self = this
		return {
			"class" : define.class_name.head_wrap,
			"child" : this.library.morph.index_loop({
				subject : this.format_column_field_definition( define.with.column ),
				else_do : function ( loop ) {
					return loop.into.concat(
						self.define_column_name_field({
							class_name : define.class_name,
							with       : loop.indexed,
							format     : define.with.format
						})
					)
				}
			})
		}
	},

	define_column_name_field : function ( define ) {
		return {
			"class" : define.class_name.head_name,
			"width" : define.format.field.width + "px",
			"text"  : define.with.text
		}
	},

	format_column_field_definition : function ( definition ) { 
		return this.library.morph.index_loop({
			subject : definition,
			else_do : function ( loop ) {

				var field_definition

				if ( loop.indexed.constructor === String ) { 
					field_definition = { 
						"text" : loop.indexed
					}					
				}

				if ( loop.indexed.constructor === Object ) {
					field_definition = loop.indexed
				}

				return loop.into.concat( field_definition )
			}
		})
	},

	format_row_field_definition : function ( definition ) {

		var self = this
		return this.library.morph.object_loop({
			subject : definition,
			else_do : function ( loop ) {

				var field_definition
				
				if ( loop.value !== null && loop.value !== undefined ) { 

					if ( loop.value.constructor === String || loop.value.constructor === Number ) { 
						field_definition = { 
							"text" : loop.value
						}
					}

					if ( loop.value.constructor === Boolean ) { 
						field_definition = {
							"text" : loop.value.toString()
						}
					}

					if ( loop.value.constructor === Object ) {
						field_definition = loop.value
					}

				} else {

					field_definition = {
						text : ""
					}
				}

				// console.log( field_definition )

				return {
					key   : loop.key,
					value : field_definition,
				}
			}
		})
	},

	define_row : function ( define ) {
		var self = this
		return {
			"class" : define.class_name.body_wrap,
			"child" : this.library.morph.index_loop({
				subject : this.library.morph.index_loop({
					subject : define.with.row,
					else_do : function ( format_loop ) {
						return format_loop.into.concat(
							self.format_row_field_definition( format_loop.indexed )
						)
					}
				}),
				else_do : function ( content_loop ) {

					return content_loop.into.concat({
						"class" : define.class_name.row_wrap,
						"child" : self.library.morph.object_loop({
							"subject" : content_loop.indexed,
							"into?"   : [],
							"else_do" : function ( loop ) {
								return { 
									into : loop.into.concat(
										self.define_row_field({
											class_name : define.class_name,
											format     : define.with.format,
											with       : loop.value
										})
									)
								}
							} 
						})
					})
				}
			})
		}
	},


	define_row_field : function ( define ) { 
		
		var definition

		definition = {
			"class"  : define.class_name.row_name,
			"text"   : define.with.text,
			"height" : define.format.field.height +"px",
			"width"  : define.format.field.width +"px"
		}

		if ( define.with.view ) { 
			definition["data-table-choose-view"] = define.with.view
		}

		if ( define.with.link ) { 
			definition["type"]  = "a"
			definition["class"] = define.class_name.link_row_name
			definition["href"]  = define.with.link
		}

		return definition
	},

	convert_field_instruction_to_definition : function ( given ) { 
		
		var self, definition

		self       = this
		definition = {
			"text" : given.instruction.text
		}

		if ( given.instruction.link ) { 
			definition.type = "a"
			definition.href = given.instruction.link
		}

		return definition
	}
})