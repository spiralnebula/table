define({
	name    : "table",
	main    : "table",
	start   : {},
	module  : [
		"library/event_master",
		"library/morphism",
		"library/body",
		"library/event",
		"library/listener",
		"library/bodymap",
		"library/url_parser",
	],
	package : [
		"library/morph",
		"library/transit",
		"library/transistor",
	]
})