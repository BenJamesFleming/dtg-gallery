//
//
//
//

// Function Gallery
// This Is The Main Function
function Gallery(data=null, template=null, builders=null, debug=true)
{

    // Define app as this;
    var app = this;

    // Build The Config
    this.config = {
        'data': data,
        'template': template,
        'builders': builders,
        'debug': debug,
        'overlay': {
            'in_overlay': false,
            'index_old': 0,
            'index': 0
        },
        'dom': {
            'container':  document.getElementsByClassName('container')[0],
            'overlay':    document.getElementsByClassName('overlay')[0],
            'overlay_controls': document.getElementsByClassName('overlay_controls')[0],
            'buffer':     document.getElementsByClassName('buffer')[0],
        },
        'page': {
            'index': 0,
    		'max_per_page': 8,
            'buffer_number': 3,
    		'max_page_size': function () {return Math.ceil(data.length / this['max_per_page']);}
        }
    };
    var config = this.config;

    // Function Check Config
    // Run To Check That The Users Config Is Correct
    this.checkConfig = function (config) {

        // Debug The Config
        console.log(config);

        // Check That The Config Is Defined
        if (typeof config === 'undefined') {
            return app.raiseError("The Config Is Not Valid!", true);
        }

        // Check User Data
        if (typeof config.data === 'undefined') {
            return app.raiseError("The Gallery Has Been Given No Data!", true);
        }

        // Check URL Builder
        // If Not Valid Revert To Default
        if (typeof config.builders['url'] === 'undefined') {
            config.builders['url'] = function (index, data) { return data; }
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
    this.next = function () {

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

    // Function Inject HTML
    // Inject The Data Into The Template
    this.InjectHTML = function (data, data_index) {

        var signals = ["{{", "}}"];
        var params = [];
        var tmp_template = config.template;
        var index = 0;
        var output = config.template;

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

            // The Value To Replace The Param
            var value = "";

            // Variables
            // param_trim
            var param_trim = params[i].trim();
            //console.log(param_trim, data[param_trim], config.builders[param_trim]);

            // Check For Current Param In The Data
            // If True Load From The Data
            // Else Look For Builder
            if (typeof data[param_trim] != 'undefined') {

                // Get The Data For The Current Param
                var value = data[param_trim];
            } else {

                // Check For Builder
                // If True Load Value From Builder
                if (typeof config.builders[param_trim] != 'undefined') {
                    var value = config.builders[param_trim](data_index, config.data[data_index]);
                }
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

            // Data For Injection
            //       Generate A Random ID
			//       URL For Image
			//       Caption For Image
            // HTML With Injected Variables
            var data = {
                'id':       '_' + Math.random().toString(36).substr(2, 9),
            };
            var html = app.InjectHTML(data, imageIndex);

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
			
			images_list[i].style.height = "calc(( 1080 / 1920 ) * "+images_list[i].offsetHeight+")px";
			
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
            console.log(images_overlay, config.overlay.index);
            images_overlay[config.overlay.index].className = "show";

            // Add The Class Names To The Divs Aswell
            config.dom.overlay.className = "overlay show";
            config.dom.overlay_controls.className = "overlay_controls show";
            config.dom.container.className = "container hide";

        }
    };

    // Funciton Run
    // Bootstrap The Gallery
    this.run = function () {

        // Check That The User Config Is Valid
        // If True Run The App
        if (app.checkConfig(config)) {
            app.UpdateUI();
        }
    };

    // return this to user
    return this;

}
