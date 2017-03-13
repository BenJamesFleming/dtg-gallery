//
// Gallery.js © Ben Fleming 2017
// Author   : Ben Fleming
// Email    : benfleming121@gmail.com
// GitHub   : http://github.com/benjamesfleming/
//
// Read The GitHub Page To Learn How To Use
//

// Function Gallery
// This Is The Main Function Class
function Gallery(data=[], template="", builders={}, debug=true)
{

    // Define app as this;
    var app = this;

    // Define User Editable Config
    // Max Per Page, The Max Images On A Page
    this.max_per_page = 4;
    this.data = data;
    this.template = template;
    this.builders = builders;
    this.debug = debug;

    // Build The Config
    this.config = {
        'data': null,
        'template': null,
        'template': null,
        'template_str': null,
        'template_default': "<img class='img_wrap' src='{{ url }}' data-id='{{ id }}'>",
        'builders': null,
        'debug': null,
        'overlay': {
            'in_overlay': false,
            'index_old': 0,
            'index': 0
        },
        'dom': {
            'container':  document.getElementsByClassName('container')[0],
			'controls': document.getElementsByClassName('controls')[0],
            'overlay':    document.getElementsByClassName('overlay')[0],
            'overlay_controls': document.getElementsByClassName('overlay_controls')[0],
            'buffer':     document.getElementsByClassName('buffer')[0],
        },
        'page': {
            'index': 0,
    		'max_per_page': 8,
            'buffer_number': 3,
    		'max_page_size': function () {return Math.ceil(app.config.data.length / this['max_per_page']);}
        }
    };
    var config = this.config;

    // Function Check Config
    // Run To Check That The Users Config Is Correct
    this.checkConfig = function (config) {

        // Debug The Config
        app.log(config);

        // Check That The Config Is Defined
        if (typeof config != 'object') {
            return app.raiseError("The Config Is Not Valid!", true);
        }

        // Check User Data
        if (typeof config.data != 'object') {
            return app.raiseError("The Gallery Has Been Given No Data!", true);
        }

        // Check The Template
        // If Not Valid Revert To Default
        if (typeof config.template != 'function') {

            // Check If Template Is A String
            // If True Chnage To Fucntion With Current String
            // Else Revert To Default
            if (typeof config.template == 'string' && config.template != "") {

                // Set Template String
                config.template_str = config.template;

                // Change To Function
                config.template = function (index, value) {
                    return config.template_str;
                };
            } else {

                // Revert To Default
                config.template = function (index, value) {
                    return config.template_default;
                };
            }
        }

        //
        // ID Builder
        //

        // Check The Id Builder
        // Check The It Is A Function
        // Then Check That It Returns Valid Data
        // By Check If It Return Different Id When Given Different Data
        if (typeof config.builders['id'] !=  'function') {
            config.builders['id'] = function (index, value) { return '_' + Math.random().toString(36).substr(2, 9); };
        }

        // Check That The Config Data Size Is Bigger Than 1
        // If True Check The Id Function
        if (config.data.length > 1) {

            // Get The First Two Ids From The Data
            // id[0] where data index = 0
            // id[1] where data index = 1
            var id=[
                config.builders['id'](0, config.data[0]),
                config.builders['id'](1, config.data[1]),
            ];

            // Check If The Ids Are The Same
            // If True Then The Function Is Not Valid
            // So We Will Log Error And Kill
            if (id[0] == id[1]) {
                return app.raiseError("The ID Builder Function Returned The Same Value For Two Different Images!", true);
            }
        }

        //
        // [END ID BUILDER]
        //

        // Check URL Builder
        // If Not Valid Revert To Default
        if (typeof config.builders['url'] != 'function') {
            config.builders['url'] = function (index, data) { return data; };
        }

        // Return True
        // Because The Config Is Valid
        return true;
    };

    // Function Raise Error
    // Call To Raise An Error
    // Variables
    // msg as str;
    // kill as bool;
    this.raiseError = function (msg, kill) {

        // Check That Debug Is True
        // Then Console Log The Error
        if (config.debug == true) {
            console.error(msg);
        }

        // Return Kill To Stop The App
        return !kill;

    };

    // Function Log
    // Log To The Console
    // Variables
    // msg as str;
    this.log = function(msg) {

        // Check That Debug Is True
        // Then Console Log The Message
        if (config.debug == true) {
            console.log(msg);
        }
    };

    // Fucntion Next
    // Load The Check Page
    this.next = function (user_index=null) {

		// Debug
		app.log("Loading Next Page / Image...");

        // Check If The Gallery Is In Overlay
        // if True Go To Next Image
        if (config.overlay.in_overlay == true) {

            // Check If The Index Of The Overlay Images Is Valid
            // If False Break Function and Return False
            if (config.overlay.index + (config.page.max_per_page*config.page.index) >= config.data.length - 1) {
                return false;
            }

            // Check If The Index Of The Overlay Image Is Smaller Than The Max Page Size
            // If True Go To Next Image
            // Else Load Next Page
            if (config.overlay.index < config.page.max_per_page - 1) {

                // Set index_old To Current Index
                // Then Set index To index +1
                // Apply Changes By Calling UpdateUI();
                config.overlay.index_old = config.overlay.index;
                config.overlay.index++;
                return app.UpdateUI();
            } else {

                // Check That We Can Go Fouard A Page
                // If True Go Fouard A Page And Reload
                // Else return false To End The Fucntion
                if (config.page.index < config.page.max_page_size() - 1) {

                    // +1 To page.index to Get To Next Page
        			config.page.index++;

                    // Set index_old To Current Index
                    // Then Set index To 0
                    // Apply Changes By Calling UpdateUI();
                    config.overlay.index_old = config.overlay.index;
                    config.overlay.index = 0;
                    return app.UpdateUI();
                } else {

                    // Return False To End The Function
                    return false;
                }

            }
        }

		// Check If The Index Is Small Than The Max Page Size
		// If True Go To Next Page
		if (config.page.index < config.page.max_page_size() - 1) {

            // +1 To Page Index
            // Apply Changes By Calling UpdateUI();
			config.page.index++;
			return app.UpdateUI();
		}

	};

    // Fucntion Prev
    // Load The Pervious Page
    this.prev = function () {

		//Debug
		app.log("Loading Previous Page / Image...");

        // Check If The Gallery Is In Overlay
        // if True Go To Next Image
        if (config.overlay.in_overlay == true) {

            // Check If The Index Of The Overlay Images Is Valid\
            // If True Go Back In Image
            // Else Go Back A Page
            if (config.overlay.index > 0) {

                // Set index_old To Current Index
                // Then Set index To index -1
                // Apply Changes By Calling UpdateUI();
                config.overlay.index_old = config.overlay.index;
                config.overlay.index--;
                return app.UpdateUI();
            } else {

                // Check That We Can Go Back A Page
                // If True Go Back A Page And Reload
                // Else return false To End The Fucntion
                if (config.page.index > 0) {

                    // -1 To page.index to Get To Next Page
        			config.page.index--;

                    // Set index_old To Current Index
                    // Then Set index To index max_per_page
                    // Apply Changes By Calling UpdateUI();
                    config.overlay.index_old = config.overlay.index;
                    config.overlay.index = config.page.max_per_page - 1;
                    return app.UpdateUI();
                } else {

                    // Return False To End The Function
                    return false;
                }

            }

        }

		// Check If The Index Is Bigger Than Zero
		// If True Go Back A Page
		if (config.page.index > 0) {
			config.page.index--;
			return app.UpdateUI();
		}

	};

	// Function Select
	// Select The Next Page To Show
	// For Use With Page Buttons
	this.select = function (index) {

		// Check That The User Index Is Valid
		// And Is In The Data Array
		if (index != null && index < config.page.max_page_size() && !index < 0) {
			// Set Config Index To The User Index;
			// Then Run UpdateUI To Apply The Changes
			config.page.index = index;
			return app.UpdateUI();
		}
	};

    // Function Inject HTML
    // Inject The Data Into The Template
    this.InjectHTML = function (data) {

        var signals = ["{{", "}}"];
        var params = [];
        var index = 0;
        var tmp_template = config.template(data.index, data.value);
        var output = tmp_template;

        // Get All The Params From The Template
        while (true) {

            // Define Variables
            // Get The Current tmp_template
            // Get The Start Index, Where The signal[0] is found
            // Get The End Index, Where The signal[1] is found
            // Then Set The The Index For The Next Loop
            tmp_template = tmp_template.substr(index, tmp_template.length);
            var start_index = tmp_template.indexOf(signals[0]);
            var end_index = tmp_template.indexOf(signals[1]);
            index = end_index + signals[1].length;

            // Check That The Start Index Is Valid
            // If False Break While Loop
            if (start_index <= -1) { break; }

            // Push The New Param To The Params Array
            params.push(
                tmp_template.substr(start_index+signals[0].length, end_index-start_index-signals[1].length)
            );
        }

        // Loop Through The Params
        // And Inject Them Into The Output HTML
        for (var i=0;i<params.length;i++) {
		
			// Variables
            // param_trim
            var param_trim = params[i].trim();

            // Set The Value To Replace The Param
			// If Debug Then The Log Error To User
			if (config.debug == true) {
				var value = "The Paramter {{ "+param_trim+" }} Has No Injectable Value!";
			} else {
				var value = "";
			}

            // Check For Builder
            // If True Load Value From Builder
			// Else If The Data Value has The Param Load That
            if (typeof config.builders[param_trim] != 'undefined') {
                value = config.builders[param_trim](data.index, data.value);
            } else if (typeof data.value[param_trim] != 'undefined') {
				value = data.value[param_trim];
			}

            // Inject The Current Param
            output = output.replace(signals[0]+params[i]+signals[1], value);
        }

        // Return The Injected HTML
        return output;

    };

    // Function Update UI
    // Updates The UI To Show The User The Correct Images
    this.UpdateUI = function () {

        // Clear The DOM Of The Previous Images
        config.dom.container.innerHTML = "";
		config.dom.overlay.innerHTML = "";
		config.dom.buffer.innerHTML = "";

		// Debug
		app.log("Updating UI...");

		// Loop Through The Data Array
		// And Add All The Images To The Container Element
		for (var i=0;i<config.data.length;i++) {

            // Image Index In The Data
            var imageIndex = i + (config.page.max_per_page*config.page.index);

            // Check If The Image Is Not Undefined
            // If True Break The For Loop
            if (imageIndex >= config.data.length) { break; }

            // HTML
            // This Is The Formatted HTML TO Add To The
            var html = app.InjectHTML({'index': imageIndex, 'value': config.data[imageIndex]});

			// Check If The Max Per Page Has Been Reached
			// If True Break The For Loop
			if (i >= config.page.max_per_page*config.page.buffer_number) { break; }
			if (i >= config.page.max_per_page) {
				config.dom.buffer.innerHTML += html;
				continue;
			}

            // Add The Image To The Container
            // Then To The Overlay
            config.dom.container.innerHTML += html;
            config.dom.overlay.innerHTML += html;
		}

        //
		// Add On Click Events To All Images
        //

        // Variables
        // image_list as arr;       The Images In The Container Element
        // images_overlay as arr;   The Images In The Overlay Element
		var images_list =     config.dom.container.getElementsByClassName("img_wrap");
		var images_overlay =  config.dom.overlay.getElementsByClassName("img_wrap");

        // For Loop
        // Loop Through The images_list And Add OnClick Functions
		for (var i=0;i<images_list.length;i++) {

			images_list[i].onclick = function () {

                // Get The Image ID Of The Current Image
                // Loop Through The Overlay Images And Find A Match
                // Change The Class Names To Make The CSS Show The Ovelay Image While
                // Hiding All The Other Images
				var imgID = this.getAttribute("data-id");
				for (var j=0;j<images_overlay.length;j++) {
					var overlayImgID = images_overlay[j].getAttribute("data-id");
					if (imgID == overlayImgID) {
                        config.overlay.in_overlay = true;
                        config.overlay.index = j;

						images_overlay[j].className = "img_wrap show";
						config.dom.overlay.className = "overlay show";
						config.dom.overlay_controls.className = "overlay_controls show";
						config.dom.container.className = "container hide";
					}
				}

			};
		}

        // For Loop
        // Loop Through The images_overlay And Add OnClick Fucntions
        // To Make The Overlay Image Hiden And All The Other Images Shown
		for (var i=0;i<images_overlay.length;i++) {
			images_overlay[i].onclick = function () {
                config.overlay.in_overlay = false;

				this.className = "img_wrap";
				config.dom.overlay.className = "overlay";
                config.dom.overlay_controls.className = "overlay_controls";
				config.dom.container.className = "container show";
			};
		}

        //
        // Overlay Control
        //

        // Check If The Page Is In Overlay Mode
        // If True Open Overlay
        if (config.overlay.in_overlay == true) {

            // Get The Overlay Image
            // Then Add The Show Class To The Overlay Image
            var images_overlay = config.dom.overlay.getElementsByClassName("img_wrap");
            images_overlay[config.overlay.index].className = "show";

            // Add The Class Names To The Divs Aswell
            config.dom.overlay.className = "overlay show";
            config.dom.overlay_controls.className = "overlay_controls show";
            config.dom.container.className = "container hide";

        }
    };

    // Funciton Init
    // Bootstrap The Gallery
    this.init = function () {

        // Add The User Edits To The Config
        config.page.max_per_page = app.max_per_page;
        config.data = app.data;
        config.template = app.template;
        config.builders = app.builders;
        config.debug = app.debug;

        // Check That The User Config Is Valid
        // If True Run The App
        if (app.checkConfig(config)) {

			//
			// Add The Page Buttons
			//

			// Define The HTML Output
			var btns_HTML = "";

			// Loop For The Amount Of Pages
			// Then Add To The Output HTML
			for (var i=0;i<config.page.max_page_size();i++) {
				btns_HTML += "<button onclick='gallery.select("+i+")'>"+i+"</button>";
			}

			// Add The Output HTML To The DOM
			config.dom.controls.getElementsByClassName("page_btns")[0].innerHTML = btns_HTML;

            // Update The UI When The Window Is Resized
            // To Keep The UI Looing Nice
            window.addEventListener('resize', function(event){
                app.UpdateUI();
            });

            // Update UI
            app.UpdateUI();
        }
    };

    // return this to user
    return this;

}
