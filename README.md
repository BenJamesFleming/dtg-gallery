# Gallery
> This Is A Gallery Project For School, **DTG3**

> Main File: js/gallery.js

## HTML Setup
```html
<div id="gallery --default"></div>
<script>

    // Data In Array
    var data = [
        'http://example.com/image_1.jpg',
        'http://example.com/image_2.jpg'
    ];

    // Get Instance Of Gallery
    var gallery = new Gallery();

    // Edit Config Here
    // [START]
    gallery.data = data;
    gallery.max_per_page = 6;
    // [END]

    // Init The Gallery
    gallery.init();
</script>
```

## Data
> The Data Needs To Be An Array, With All The Data For Use In The Program

###### Simple Example
```javascript
var data = [
    'http://example.com/image_1.jpg',
    'http://example.com/image_2.jpg'
];
```

###### Advanced Example
```javascript
var data = [
    {
        'url': 'http://example.com/image_1.jpg',
        'caption': 'This Is An Image, That Is Number 1'
    },
    {
        'url': 'http://example.com/image_2.jpg',
        'caption': 'This Is An Image, That Is Number 2'
    }
];
```

## Template
> The Template Can Be And Function Or A String
> The Function Takes Two Parameters, `_g` and `state`

> `_g` This Is The Gallery Object, So You Can Access The Config

> `state` This Is The State That The Gallery Is In. **E.G.** *'default'* or *'overlay'* or *'buffer'*

> Use A String If You Don't Want Different HTML for Different Parts Of The page

**E.G.**
 * default section, That Is What Gets Shown
 * overlay section, That is What The Users Sees When They Click On An Image

> Use A Function If You Want More Controls Of What Gets Put In The DOM

**E.G.**
 * default section, just show image
 * overlay section, show image with caption, etc..

###### Simple Example
```javascript
var template = "<img data-id='{{ id }}' scr='{{ url }}'>";
```

This Example Has 2 Parameters `{{ id }}`, `{{ url }}`.

###### Advanced Example
```javascript
var template = function (_g, state) {
    var t_default = "<div class='img_wrap' data-id='{{ id }}' style='background-image: url(\"{{ url_s }}\");min-height:{{ height }};width:{{ width }};'><img src='{{ url }}'><div class='caption'>{{ caption }}</div></div>";
    var t_basic = _g.config.template_default;

    if (state == 'overlay') {
        return t_basic;
    }

    return t_default;
};
```

This Example Has 4 Parameters `{{ id }}`, `{{ url_s }}`, `{{ url }}`, `{{ caption }}`.

## Builders
> All Builder Need To Have A index and value parameters

> E.G. `function (_g, index, value) {}`

> All Builder Functions Need To Return A String To Import Into The Template

> *Warning:* The Builder Keys `index`, `value` Are Restricted

###### Data Parsed Into Functions

 * \_g as **Gallery**;      This Is The Gallery Object, With The Config
 * index as **int**;        This Is The Index Of The Value In The Array
 * value as **anything**;   This Is The Value Of The Data In The Array

#### How It Works

> The Program Will Run The Each Builder
> To Fill In The Templates Parameters

###### E.G.
```javascript
var template = "<img data-id='{{ id }}' scr='{{ url }}'>";
```
Where **{{ id }}** And **{{ url }}** Are The Parameters.
The Template Will Find And Replace `"{{ id }}"` From The `template` Variable Above
With The Return Value Of `builders['id'](index, value);` , And Then Do The Same For All The Other Parameters That Have Builders
***(Parameters That Do Not Have Builders Will Simply Be Cleared From The Template)***

###### Simple Example
> This Example Shows How The Builders Could Be Used In A Simple Data System

> *See The Simple Data Example*

```javascript
var builders = {
    'url': function (index, value) { return value },
};
```

###### Advanced Example
> This Example Shows How The Builders Could Be Used With A More Complex Data System

> *See The Advanced Data Example*

```javascript
var builders = {
    'url': function (index, value) { return value.url; },
    'caption': function (index, value) { return value.caption }
};
```

#### Default Types Of Builders
> These Are Default And Do Not Need Setup For Basic Use

> But Many Need Setup For More Advanced Use Cases

* Id Buidler  
    * Returns A String Value, That Is Different For Each Data Point In The Array
* URL Builder
    * Returns A String Value, This Is The URL Of The Current Image

###### Code For Default Builders
> This Is The Code That Will Be Used If These Builder Functions Are Not Defined

```javascript
var builders = {
    'id': function (index, value) { return '_' + Math.random().toString(36).substr(2, 9); },
    'url': function (index, value) { return value; },
};
```
