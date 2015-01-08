### Table

A table package, supports having its value set, opening other windows within itself, with the ability to go back, dimenisos of fields can be set.

```javascript
{
    format : {
        field : { 
            width : 250
        }
    },
    data : {
        view : {
            // Put any number of view you desire here
            // the main view is the one that is first shown
            "main" : {
                column : ["one", "two"],
                row    : [
                    {
                        "one" : {
                            "text" : "Some",
                            "view" : "oneone",
                        },
                        "two" : "Some"
                    }
                ]
            }
        }
    }
}
```