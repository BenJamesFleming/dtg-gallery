Data
The Data Needs To Be An Object, With All The Data For Use In The Program

Simple Example
'''
var data = {
    'http://example.com/image_1.jpg',
    'http://example.com/image_2.jpg'
};
'''

Advanced Example
'''
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
'''

Builders
All Builder Need To Have A index and value paramter || E.G. function (index, value) {}
All Builder Functions Need To Return A String To Import Into The Template

index as int;        This Is The Index Of The Value In The Array
value as *;          This Is The Value Of The Data In The Array

var builders = {
    'id': function (index, value) { return value.unique_id },
};

Id Buidler   || Returns String, That Is Different For Each Data Point In The Array
URL Builder  || Returns String, The URL Of The Current Image
