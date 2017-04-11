# Template Engine
> This is a school project for **DTG3**

> Main File : [`js/template.js`](https://github.com/BenJamesFleming/template.js/blob/master/js/template.js)

---
#### Usage

<a href="basic-00.html" target='\_blank'>VIEW CODE IN ACTION</a>
```html
<script src="js/template.min.js"></script>
<script>
window.onload = function () {
	TemplateEngine([
		"This is item 1",
		"This is item 2",
		"This is item 3",
		"This is item 4",
		"..."
	]).init();
};
</script>

```

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
template | This is the template variable. The program will use this to  get the template for the current data value. It can be set by `engine.template = function(_engine) { return "<div class='...'>{% raw %}{{ value }}{% endraw %}</div>"; }`. By default the program uses the following simple template `"<span>{% raw %}{{ value }}{% endraw %}<br></span>"`. ***Must Be `typeof 'function'`***. This function must take one parameter, `function(_engine)`. `_engine` is the TemplateEngine() Object.
template_signals | This is an array containing the template signals. These signal are what tell the program where a variable is in the template. The default value is `["{{", "}}"]`, this tells the program to look for `'{% raw %}{{ ... }}{% endraw %}'` in the template, where `'...'` represents the variable name of a builder. ***Must Be `typeof 'array'` With A Length Of 2***


## Basic Usage

**Warning:** Be Sure To Add The Script To Your HTML Head!

The example below loads the `data` array onto the page, and makes the `engine.onClickFunction` toggle the color of the text from black and red. This shows some names on the page.

<a href="basic-01.html" target='\_blank'>VIEW CODE IN ACTION</a>
```html
<script src="js/template.min.js"></script>
<script>
window.onload = function() {
	var data = [
		"<strong>Tap On Any Text To Make It Change Colour</strong>",
		"Ben",
		"Tawhiri",
		"Alex",
		"..."
	];
	var engine = new TemplateEngine(data);
	engine.onClickFunction = function (_engine, element) {
		element.style.color = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
		return _engine;
	};
	engine.init();
};
</script>

```

---
##### Adding Builders

Taking it a step further we can edit the data before it goes onto the template. This is an example of how to use a builder.

 * **What Is A Builder:** A builder is a function that gets called to get the value to inject into the html.
 * **How Builders Work:**
A builder with a index of `'id'` would return a string id to insert into the template. And a builder with an index of `'value'` would return the value of the data.

For the example below we need to check that the data is a name and not the first item in the array. We can do this by checking that the index of the data is bigger than 0, `index > 0`. If this is true the builder will return a modified version of the value, else it will return the default value.

<a href="basic-02.html" target='\_blank'>VIEW CODE IN ACTION</a>
```html
<script src="js/template.min.js"></script>
<script>
window.onload = function() {
	var data = [
		"<strong>Tap On Any Text To Make It Change Colour</strong>",
		"Ben",
		"Tawhiri",
		"Alex",
		"..."
	];
	var engine = new TemplateEngine(data);

	////////////////// This Is The Addition
	engine.addBuilder('value', function (_engine, index, value) {
		if (index > 0) {
			return "Hello My Name Is "+value;
		}
		return value;
	});
	//////////////////

	engine.onClickFunction = function (_engine, element) {
		element.style.color = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
		return _engine;
	};
	engine.init();
};
</script>
```

---
##### Advanced Templates

Another thing that we can do is set a better template, since the default one will only work for some simple use cases.

 * **What Is The Template:** The template is the string that the program injects data into.
 * **How It Works:** The template has variables in the string, `<div>{% raw %}{{ value }}{% endraw %}</div>`. The program will find these variables and replace them with the value that is returned by their builder. For Example the program will find `{% raw %}{{ value }}{% endraw %}` in the template, and replace it with the returned string of `builders['value'](_engine, index, value)`

> **Note:** For every variable in the tempalte there needs to be a matching builder. For Example, if `'{% raw %}{{ name }}{% endraw %}'` is in the template, there sould be a builder for it. `typeof builder['name'] == 'function'`.

For the example below the two parameters are `'{% raw %}{{ value }}{% endraw %}'` and `'{% raw %}{{ index }}{% endraw %}'`, these are default parameters so therefore don't need builders. **But** because we are modifying the value, we need to set the value builder to get the modified variables.

<a href="basic-03.html" target='\_blank'>VIEW CODE IN ACTION</a>
```html
<script src="js/template.min.js"></script>
<script>
window.onload = function() {
	var data = [
		"<strong>Tap On Any Text To Make It Change Colour</strong>",
		"Ben",
		"Tawhiri",
		"Alex",
		"..."
	];
	var engine = new TemplateEngine(data);

	////////////////// This Is The Addition
	engine.template = function(_engine) {
		return '<div style=\'user-select:none;\'>{% raw %}{{ value }}{% endraw %}, This is at index {% raw %}{{ index }}{% endraw %}</div>';
	};
	//////////////////

	engine.addBuilder('value', function (_engine, index, value) {
		if (index > 0) {
			return "Hello My Name Is "+value;
		}
		return value;
	});
	engine.onClickFunction = function (_engine, element) {
		element.style.color = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
		return _engine;
	};
	engine.init();
};
</script>

```

---
##### Adding Middleware

Another feature of the Template Engine, is that you can add Middleware. By default there is no middleware.

 * **What Is Middleware For:** Middleware is a set of functions that run before something happens, in this case the middleware runs every time the program starts building up a template.
 * **How It Works:** The users gives the program a set of functions to run at before building each template.

With this Middleware we can set what parentElement each template is appended to, or weather to skip that index and continue on with the next one. For the example below, we will add Middleware that stops the program from showing the 3rd item in the data array, by skipping it.

<a href="basic-04.html" target='\_blank'>VIEW CODE IN ACTION</a>
```html
<script src="js/template.min.js"></script>
<script>
window.onload = function() {
	var data = [
		"<strong>Tap On Any Text To Make It Change Colour</strong>",
		"Ben",
		"Tawhiri",
		"Alex",
		"..."
	];
	var engine = new TemplateEngine(data);

	////////////////// This Is The Addition
	engine.addMiddleware(function (_engine, index) {
		if (index == 2) {
			_engine.skip = true;
		}
		return _engine;
	});
	//////////////////

	engine.template = function(_engine) {
		return '<div style=\'user-select:none;\'>{% raw %}{{ value }}{% endraw %}, This is at index {% raw %}{{ index }}{% endraw %}</div>';
	};
	engine.addBuilder('value', function (_engine, index, value) {
		if (index > 0) {
			return "Hello My Name Is "+value;
		}
		return value;
	});
	engine.onClickFunction = function (_engine, element) {
		element.style.color = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
		return _engine;
	};
	engine.init();
};
</script>
```
---
##### Setting The Parent Element

For most applications of the template, you will want the template to be appended on to a pre-built element, since again the default parent element will only work for simple projects.

By default the program creates its own parentElement and adds it to the body of the HTML.

 * **What Is The Parent Element:** The parentElement is the element that the templates get append to after being built.
 * **How It Works:** The program builds up all the templates with the data, then appends it to the DOM by adding it to `parentElement.innerHTML`.

In the example below we add a html element,  `<div class='names'></div>`. And then the code to set that element as the parentElement for the program.

<a href="basic-05.html" target='\_blank'>VIEW CODE IN ACTION</a>
```html
<div class='names'></div>
<script src="js/template.min.js"></script>
<script>
window.onload = function() {
	var data = [
		"<strong>Tap On Any Text To Make It Change Colour</strong>",
		"Ben",
		"Tawhiri",
		"Alex",
		"..."
	];
	var engine = new TemplateEngine(data);

	////////////////// This Is An Addition
	engine.parentElement = function (_engine) {
		return document.getElementsByClassName('names')[0];
	};
	//////////////////

	engine.addMiddleware(function (_engine, index) {
		if (index == 2) {
			_engine.skip = true;
		}
		return _engine;
	});
	engine.template = function(_engine) {
		return '<div style=\'user-select:none;\'>{% raw %}{{ value }}{% endraw %}, This is at index {% raw %}{{ index }}{% endraw %}</div>';
	};
	engine.addBuilder('value', function (_engine, index, value) {
		if (index > 0) {
			return "Hello My Name Is "+value;
		}
		return value;
	});
	engine.onClickFunction = function (_engine, element) {
		element.style.color = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
		return _engine;
	};
	engine.init();
};
</script>
```

---
##### Using More Advanced Data Sets

For most applications you will want to output more than a single string from a dataset. This is where **Advanced Datasets** come in. Using these we can add a lot more to what our program does.

 * **What Is An Advanced Dataset:** An Advanced Dataset is a dataset that has more than an single string. An advanced dataset could have objects with multiple strings or even bools.

 * **How It Works:** The program uses a build to get the data out of the dataset. Because you are making the builders yourself, the data structure can be whatever you want / need.

> **Note:** If you don't set what the program should do for `{% raw %}{{ value }}{% endraw %}`, the program will get the first string in the data object.

```html
<script src="js/template.min.js"></script>
<script>
window.onload = function() {
	var data = [
		"<strong>Tap On Any Text To Make It Change Colour</strong>",
		{
			name: 'Ben',
			age: 17
		},
	    [
			"Tawhiri",
			17
		],
		"Alex",
		"..."
	];
	var engine = new TemplateEngine(data);

	engine.template = function(_engine, index) {
		if (index < 1) {
			return '<div>{% raw %}{{ value }}{% endraw %}</div>';
		}
		return '<div style=\'user-select:none;\'>Hello my name is {% raw %}{{ value }}{% endraw %}, Age {% raw %}{{ age }}{% endraw %}. I am located at index {% raw %}{{ index }}{% endraw %} in the dataset.</div>';
	};

	////////////////// This Is The Addition
	engine.addBuilder('age', function (_engine, index, value) {
		if (Array.isArray(value)) return value[1];			// Check If value Is An Array
		if (typeof value == 'object') return value['age'];  // Check If value Is An Object
		return 'Unknown';									// If value Is Not An Array or Object,
															// There Must Not Be A Age Defined, So Return 'Unknown'
	});
	//////////////////

	engine.onClickFunction = function (_engine, element) {
		element.style.color = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
		return _engine;
	};
	engine.init();
};
</script>

```

---
##### Line By Line

```html
<script src="js/template.min.js"></script>
```

This code loads the template script into the program.

---
```javascript
window.onload = function() {};
```

This code waits for the window to load before running the program, this is good practice because it makes sure that the webpage is ready for the JavaScript to run.

---
```javascript
var data = [
	"<strong>Tap On Any Text To Make It Change Colour</strong>",
	{
		name: 'Ben',
		age: 17
	},
	[
		"Tawhiri",
		17
	],
	"Alex",
	"..."
];
```

This is the Dataset / Data Array that the Template Engine will use. It holds all the data for the engine to run. This example shows the advanced dataset with different types of data. The first line is a *String*, the second is a *JavaScript Object*, and the third is an *Array*. Having different types of data does not break the engine, but it does make it harder to expand,

> **Note:** It is recommended to only have one type of data in your Dataset, e.g. all strings or all objects.

---
```javascript
var engine = new TemplateEngine(data);
```

This loads up the template engine, with the data but it does not start the engine. Load the template engine into a variables if you want to doe some more setup.

---
```javascript
engine.template = function(_engine, index) {
	if (index < 1) {
		return '<div>{% raw %}{{ value }}{% endraw %}</div>';
	}
	return '<div style=\'user-select:none;\'>Hello my name is {% raw %}{{ value }}{% endraw %}, Age {% raw %}{{ age }}{% endraw %}. I am located at index {% raw %}{{ index }}{% endraw %} in the dataset.</div>';
};
```

This code sets the template function. This allows you to set what template the program should use for each item, in the dataset. This template function loads a very basic template for the first item in the dataset, `data[0]`, and a more advanced one for the rest of the items. In these template string is where you put your variables. For Example for the first item, the only variable used is `value`, whereas the other items use three variables `value`, `age` & `index`.

---
```javascript
engine.addBuilder('age', function (_engine, index, value) {
	if (Array.isArray(value)) return value[1];		
	if (typeof value == 'object') return value['age'];  
	return 'Unknown';									
});
```

This code adds a builder for the age variable that gets injected into the template. The name is defined as `age`, this is the first parameter in the addBuilder function. The second parameter in this function, is a function that returns a string for the template. The function is given the index and value to work out what value to return. For this example the `typeof value` is Unknown, so the function has to check how to get the data out of the dataset. If the data is not an Array or an Object, Then it cannot have the data for the age variable so it returns `string 'Unknown'` to insert into the template.

---
```javascript
engine.onClickFunction = function (_engine, element) {
	element.style.color = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
	return _engine;
};
```

This code defines the function that is called when one of the elements is clicked. This functions should return the engine object that is given to it. This function changes the colour of the element to a random hex value. But your function could do anything that you need it to.

---
```javascript
engine.init();
```

This final code starts the Template Engine after all the setup has been completed.
