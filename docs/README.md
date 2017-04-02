## Template Engine Basic Usage

**Warning:** Be Sure To Add The Script To Your HTML Head!

The example below loads the `data` array onto the page, and makes the `engine.onClockFunction` toggle the color of the text from black and red. This shows some names on the page.

<a href="basic-01.html" target='\_blank'>VIEW CODE IN ACTION</a>
```html
<script src="../js/template.min.js"></script>
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
		element.style.color = (element.style.color == 'red' ? 'black' : 'red');
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

<a href="basic-02.html" target='_blank'>VIEW CODE IN ACTION</a>
```html
<script src="../js/template.min.js"></script>
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
		element.style.color = (element.style.color == 'red' ? 'black' : 'red');
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
 * **How It Works:** The template has variables in the string, `<div>{{ value }}</div>`. The program will find these variables and replace them with the value that is returned by their builder. For Example the program will find `'{{ value }}'` in the template, and replace it with the returned string of `builders['value'](_engine, index, value)`

> **Note:** For every variable in the tempalte there needs to be a matching builder. For Example, if `'{{ name }}'` is in the template, there sould be a builder for it. `typeof builder['name'] == 'function'`.

For the example below the two parameters are `'{{ value }}'` and `'{{ index }}'`, these are default parameters so therefore don't need builders. **But** because we are modifying the value, we need to set the value builder to get the modified variables.

<a href="basic-03.html" target='_blank'>VIEW CODE IN ACTION</a>
```html
<script src=".../js/template.min.js"></script>
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
		return '<div>{{ value }}, This is at index {{ index }}</div>';
	};
	//////////////////

	engine.addBuilder('value', function (_engine, index, value) {
		if (index > 0) {
			return "Hello My Name Is "+value;
		}
		return value;
	});
	engine.onClickFunction = function (_engine, element) {
		element.style.color = (element.style.color == 'red' ? 'black' : 'red');
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

<a href="basic-04.html" target='_blank'>VIEW CODE IN ACTION</a>
```html
<script src="../js/template.min.js"></script>
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
		return '<div>{{ value }}, This is at index {{ index }}</div>';
	};
	engine.addBuilder('value', function (_engine, index, value) {
		if (index > 0) {
			return "Hello My Name Is "+value;
		}
		return value;
	});
	engine.onClickFunction = function (_engine, element) {
		element.style.color = (element.style.color == 'red' ? 'black' : 'red');
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

<a href="basic-05.html" target='_blank'>VIEW CODE IN ACTION</a>
```html
<div class='names'></div>
<script src="../js/template.min.js"></script>
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
		return '<div>{{ value }}, This is at index {{ index }}</div>';
	};
	engine.addBuilder('value', function (_engine, index, value) {
		if (index > 0) {
			return "Hello My Name Is "+value;
		}
		return value;
	});
	engine.onClickFunction = function (_engine, element) {
		element.style.color = (element.style.color == 'red' ? 'black' : 'red');
		return _engine;
	};
	engine.init();
};
</script>
```
