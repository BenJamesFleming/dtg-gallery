function Gallery(data=null, urlBuilder=null, debug=true) 
{

  // Define app as this;
  var app = this;
  
  // Build The Config
  var config = {
    'data': data,
    'urlBuilder': urlBuilder,
    'debug': debug,
    'dom': {
      'container':  document.getElementsByClassName('container')[0];,
      'overlay':    document.getElementsByClassName('overlay')[0];,
      'buffer':     document.getElementsByClassName('buffer')[0];,
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
  
    // Check User Data
    if (typeof config.data === 'undefined') {
      app.raiseError("The Gallery Has Been Given No Data!", true);
    }
    
    // Check URL Builder
    if (typeof config.urlBuilder === 'undefined') {
      config.urlBuilder = fucntion (index, data) { return data; }
    }
  }
  app.checkConfig(config);
  
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
    
    // Check If The App Should Kill
    // If True Kill The App
    if (kill == true) {
      // TODO: Kill The App
    }
    
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
			app.log("Loading Next Page...");
      
			// Check If The Index Is Small Than The Max Page Size
			// If True Go Back A Page
			if (config['page']['index'] < config['page']['max_page_size']()) { 
				config['page']['index']++;
				return UpdateUI();
			}
			
	};
  
  // Fucntion Prev
  // Load The Pervious Page
  this.prev = function () {
			
			//Debug
			app.log("Loading Previous Page...");
			
			// Check If The Index Is Bigger Than Zero
			// If True Go Back A Page
			if (config['page']['index'] > 0) { 
				config['page']['index']--;
				return UpdateUI();
			}
			
		};
    
    this.UpdateUI = function () {
    
      // Clear The DOM Of The Previous Images
      container.innerHTML = "";
			overlay.innerHTML = "";
			buffer.innerHTML = "";
			
			// Debug
			app.log("Updating UI..");
			
			// Loop Through The Data Array
			// And Add All The Images To The Container Element
			for (var i=0;i<data.length;i++) {
				
				// Image Index
				var imageIndex = i + (config['page']['max_per_page']*config['page']['index']);
				
				// URL For Image
				var url = config['urlBuilder'](imageIndex, config['data'][imageIndex]);
				
				// Check If The Max Per Page Has Been Reached
				// If True Break The For Loop
				if (i >= config['page']['max_per_page']*2) { break; }
				if (i >= config['page']['max_per_page']) {
					buffer.innerHTML += "<img src='"+url+"'>";
					continue;
				}
				
				// Check If The Image Is Not Undefined
				// If True Break The For Loop
				if (imageIndex >= config['data'].length) { break; }
        
        // Generate A Random ID
        var id = '_' + Math.random().toString(36).substr(2, 9);
				
				// Add The Image To The Container
				// Then To The Overlay
				container.innerHTML += "<img data-id='"+id+"' src='"+url+"'>";
				overlay.innerHTML += "<img data-id='"+id+"' src='"+url+"'>";
			}
			
			// Add On Click Events To All Images
			var images = container.getElementsByTagName("img");
			var imagesBig = overlay.getElementsByTagName("img");
			for (var i=0;i<images.length;i++) {
				images[i].onclick = function () {
					
					var dataID = this.getAttribute("data-id");
					for (var j=0;j<imagesBig.length;j++) {
						var bigDataID = imagesBig[j].getAttribute("data-id");
						if (dataID == bigDataID) {
							imagesBig[j].className = "show";
							overlay.className = "overlay show";
							container.className = "container hide";
						}
					}
					
				};
			}
			
			for (var i=0;i<imagesBig.length;i++) {
				imagesBig[i].onclick = function () {
					this.className = "";
					overlay.className = "overlay";
					container.className = "container";
				};
			}
    };
  
}
