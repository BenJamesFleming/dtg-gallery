# Template Engine
> This is a school project for **DTG3**

> Main File : [`js/template.js`](https://github.com/BenJamesFleming/dtg-gallery/blob/master/js/template.js)

> Click [Here](docs/) To View Basic Usage

---
#### Template Engine Functions

> These Are The Functions For `new TemplateEngine()`

Function | About | Return Value
-------- | ----- | ------------
.init() | This function starts the program. It runs the bootware before starting program. | This functions returns `typeof TemplateEngine`
.addBuilder(index, func) | This Function Adds A Builder To The Engine. `index` is the name of the parameter in the template that this builder returns a value for, ***Must Be `typeof string`***. `func` is the function that returns a string, to replace the parameter in the template with, It must take three parameters, `func(_engine, index, value)`. `_engine` is the TemplateEngine() Object. `index` is the index of the data in the given array, and `value` is the value of the data in the array at `index`. ***Must Be `typeof 'function'`, And Return `typeof 'string'`***. | This functions returns `typeof TemplateEngine`
.addBootware(func) | This function adds a bootware function. `func` will get called at the start of the program, and every time it gets reset. **Example Usage:** Clear the document, so that the templates get added to a clean parent element. It just takes one parameter, `func(_engine)`. `_engine` is the TemplateEngine() Object. ***`func` Must Be `typeof 'function'`*** | This function returns `typeof TemplateEngine`
.addMiddleware(func) | This functions adds a middleware function. `func` gets called each time a template is being built. **Example Usage** Skip item 2 from being added to the page. It must take two parameters, `func(_engine, index)`. `_engine` is the TemplateEngine() Object. `index` is the index of the data in the given data array. | This function returns `typeof TemplateEngine`

#### Template Engine Variables

> These Are The Config Variables For `new TemplateEngine()`

Variable | About
-------- | -----
data | This is the data array that the program uses, it can be set when calling the `new TemplateEngine(data)` or by `engine.data = data`. ***Must Be `typeof 'array'`***
parentElement | This is the element that all the templates get appended to. It can be set to a spefic element `engine.parentElement = function(_engine) { return document.getElementById(...); }`. By default the program creates its own parentElement `<div class="TEMPLATE_ENGINE_ELEMENT"></div`, and appends it to the body element. ***Must Be `typeof 'function'`***. This function must take one parameter, `function(_engine)`. `_engine` is the TemplateEngine() Object.
template | This is the template variable. The program will use this to  get the template for the current data value. It can be set by `engine.template = function(_engine) { return "<div class='...'>{% raw %}{{ value }}{% endraw %}</div>"; }`. By default the program uses the following simple template `"<span>{{ value }}<br></span>"`. ***Must Be `typeof 'function'`***. This function must take one parameter, `function(_engine)`. `_engine` is the TemplateEngine() Object.
template_signals | This is an array containing the template signals. These signal are what tell the program where a variable is in the template. The default value is `["{{", "}}"]`, this tells the program to look for `'{{ ... }}'` in the template, where `'...'` represents the variable name of a builder. ***Must Be `typeof 'array'` With A Length Of 2***
