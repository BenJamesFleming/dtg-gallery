function Gallery(data=null, urlBuilder=null, captionBuilder=null, debug=false)
{

    // Define app as this;
    var app = this;

    // Build The Config
    var config = {
        'data': data,
        'urlBuilder': urlBuilder,
        'captionBuilder': captionBuilder,
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
			'default_classes': {
				'container': 'container ',
				'img_wrap': 'img_wrap ',
				'overlay': 'overlay ',
				'overlay_controls': 'overlay_controls ',
				'buffer': 'buffer ',
			},
        },
        'page': {
            'index': 0,
    		'max_per_page': 4,
    		'max_page_size': function () {return Math.ceil(data.length / this['max_per_page']);}
        }
    }

    // Function Check Config
    // Run To Check That The Users Config Is Correct
    this.checkConfig = function (config) {

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
        if (typeof config.urlBuilder === 'undefined') {
            config.urlBuilder = function (index, data) { return data; }
        }

        // Check Caption Builder
        // If Not Valid Revert To Default
        if (typeof config.captionBuilder === 'undefined') {
            config.captionBuilder = function (index, data) { return ""; }
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
            if (config.overlay.index*config.page.index > config.data.length) {
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
                if (config.page.index < config.page.max_page_size()) {

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
		if (config.page.index < config.page.max_page_size()) {

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

    // Function Update UI
    // Updates The UI To Show The User The Correct Images
    this.UpdateUI = function () {

        // Clear The DOM Of The Previous Images
        config.dom.container.innerHTML = "";
		config.dom.overlay.innerHTML = "";
		config.dom.buffer.innerHTML = "";

		// Debug
		app.log("Updating UI...");

        console.log(config);

		// Loop Through The Data Array
		// And Add All The Images To The Container Element
		for (var i=0;i<config.data.length;i++) {

			// Image Index
			var imageIndex = i + (config.page.max_per_page*config.page.index);

			// URL For Image
			var url = config.urlBuilder(imageIndex, config.data[imageIndex]);
			
			// Caption For Image
			var caption = config.captionBuilder(imageIndex, config.data[imageIndex]);

			// Check If The Max Per Page Has Been Reached
			// If True Break The For Loop
			if (i >= config.page.max_per_page*2) { break; }
			if (i >= config.page.max_per_page) {
				config.dom.buffer.innerHTML += "<img src='"+url+"'>";
				continue;
			}

			// Check If The Image Is Not Undefined
			// If True Break The For Loop
			if (imageIndex >= config.data.length) { break; }

            // Generate A Random ID
            var id = '_' + Math.random().toString(36).substr(2, 9);

			// Add The Image To The Container
			// Then To The Overlay
			config.dom.container.innerHTML += "<div class='img_wrap' data-id='"+id+"'><img src='"+url+"'><div class='caption'>"+caption+"</div></div>";
			config.dom.overlay.innerHTML += "<img class='img_wrap' data-id='"+id+"' src='"+url+"'>";
		}

        //
		// Add On Click Events To All Images
        //

        // Variables
        // image_list as arr;       The Images In The Container Element
        // images_overlay as arr;   The Images In The Overlay Element
		var images_list = config.dom.container.getElementsByClassName("img_wrap");
		var images_overlay = config.dom.overlay.getElementsByClassName("img_wrap");

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

						images_overlay[j].className = config.dom.default_classes.img_wrap+"show";
						config.dom.overlay.className = config.dom.default_classes.overlay+"show";
						config.dom.overlay_controls.className = config.dom.default_classes.overlay_controls+"show";
						config.dom.container.className = config.dom.default_classes.container+"hide";
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

				this.className = config.dom.default_classes.img_wrap;
				config.dom.overlay.className = config.dom.default_classes.overlay;
                config.dom.overlay_controls.className = config.dom.default_classes.overlay_controls;
				config.dom.container.className = config.dom.default_classes.container;
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
            var images_overlay = config.dom.overlay.getElementsByTagName("img");
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
