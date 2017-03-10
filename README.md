# Gallery
> This Is A Gallery Project For School, **DTG3**

> Main File: js/gallery.js

## Data
> The Data Needs To Be An Object, With All The Data For Use In The Program

###### Simple Example
```javascript
var data = {
    'http://example.com/image_1.jpg',
    'http://example.com/image_2.jpg'
};
```

###### Advanced Example
```javascript
var data = {
    {
        'url': 'http://example.com/image_1.jpg',
        'caption': 'This Is An Image, That Is Number 1'
    },
    {
        'url': 'http://example.com/image_2.jpg',
        'caption': 'This Is An Image, That Is Number 2'
    }
};
```

## Builders
> All Builder Need To Have A index and value parameters

> E.G. function (index, value) {}

> All Builder Functions Need To Return A String To Import Into The Template

###### Data Parsed Into Functions

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
> This Example Shows How The Builders Could Be Used In A Simple Data System \n
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
    * Returns A String Value,
    That Is Different For Each Data Point In The Array
* URL Builder
    * Returns A String Value,
    This Is The URL Of The Current Image

###### Code For Default Builders
> This Is The Code That Will Be Used If These Builder Functions Are Not Defined

```javascript
var builders = {
    'id': function (index, value) { return index; },
    'url': function (index, value) { return value; },
};
```
