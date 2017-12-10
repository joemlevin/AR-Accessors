var World = {
    loaded: false,

    init: function initFn() {
        this.createOverlays();
    },

    createOverlays: function () {
        /*
         First an AR.ImageTracker needs to be created in order to start the recognition engine. It is initialized with a AR.TargetCollectionResource specific to the target collection that should be used. Optional parameters are passed as object in the last argument. In this case a callback function for the onTargetsLoaded trigger is set. Once the tracker loaded all its target images, the function worldLoaded() is called.

         Important: If you replace the tracker file with your own, make sure to change the target name accordingly.
         Use a specific target name to respond only to a certain target or use a wildcard to respond to any or a certain group of targets.
         */
        var targetCollectionResource = new AR.TargetCollectionResource("assets/ar_11.wtc");

        /*
         To enable simultaneous tracking of multiple targets 'maximumNumberOfConcurrentlyTrackableTargets' has to be passed as a parameter.
         */
        var tracker = new AR.ImageTracker(targetCollectionResource, {
            maximumNumberOfConcurrentlyTrackableTargets: 5, // a maximum of 5 targets can be tracked simultaneously for now
            /*
             Disables extended range recognition.
             The reason for this is that extended range recognition requires more processing power and with multiple targets
             the SDK is trying to recognize targets until the maximumNumberOfConcurrentlyTrackableTargets is reached and it
             may slow down the tracking of already recognized targets.
             */
            extendedRangeRecognition: AR.CONST.IMAGE_RECOGNITION_RANGE_EXTENSION.OFF,
            onTargetsLoaded: this.worldLoaded,
            onError: function (errorMessage) {
                alert(errorMessage);
            }
        });

        this.targets = new AR.ImageTrackable(tracker, "*", {
            onImageRecognized: function (target) {
            	// Send the tag id and target name to the output function to generate the HTML overlay.
            	var target_id = 0; //Change this to use the JSON metadata for each image detected.
            	AR.platform.sendJSONObject({
			       my_target: target,
			       id: target_id
			    });
			    World.target_name = target;
            	// Eventually a function will be called that retrieves the HTML string and adds that overlay
            	// to the target name.

    //             /* Create drawable for the seen AR tag */
				// var overlayOne = new AR.HtmlDrawable({html:"<button type='button'>LED ON</button>"}, 1, {
				//   offsetX : 1,
				//   scale: 1,
				//   onClick : function() {
				//     AR.context.openInBrowser("https://www.wikitude.com");
				//   },
				//   // horizontalAnchor : AR.CONST.HORIZONTAL_ANCHOR.LEFT,
				//   opacity : 0.9
				// });

    //             /*
    //              Adds the model as augmentation for the currently recognized target.
    //              */
    //             this.addImageTargetCamDrawables(target, overlayOne);

    //             World.removeLoadingBar();
            },
            onError: function (errorMessage) {
                alert(errorMessage);
            }
        });
    },

    removeLoadingBar: function () {
        if (!World.loaded) {
            var e = document.getElementById('loadingMessage');
            e.parentElement.removeChild(e);
            World.loaded = true;
        }
    },

    worldLoaded: function worldLoadedFn() {
		var cssDivLeft = " style='display: table-cell;vertical-align: middle; text-align: right; width: 50%; padding-right: 15px;'";
		var cssDivRight = " style='display: table-cell;vertical-align: middle; text-align: left;'";
		document.getElementById('loadingMessage').innerHTML =
			"<div" + cssDivLeft + ">Scan AR Tag</div>" +
			"<div" + cssDivRight + ">";
	},

	// Called by outside to add overlay to a target
	constructUI: function () {
		// Note: "<button type='button'>LED ON</button>" is html
		var html_drawable = "<button type='button'>LED ON</button>";
		var target = World.target_name;
		/* Create drawable for the seen AR tag */
		var overlayOne = new AR.HtmlDrawable({html:html_drawable}, 1, {
		  offsetX : 1,
		  scale: 1,
		  onClick : function() {
		    AR.context.openInBrowser("https://www.wikitude.com");
		  },
		  // horizontalAnchor : AR.CONST.HORIZONTAL_ANCHOR.LEFT,
		  opacity : 0.9
		});
		/*
	     Adds the model as augmentation for the currently recognized target.
	     */
	    this.targets.addImageTargetCamDrawables(target, overlayOne);

	    World.removeLoadingBar();
	}
};

World.init();



// /////////////////////////////////////////////////////////////////

// var World = {
// 	loaded: false,

// 	init: function initFn() {
// 		this.createOverlays();
// 	},

// 	createOverlays: function createOverlaysFn() {
// 		/*
// 			First an AR.ImageTracker needs to be created in order to start the recognition engine. It is initialized with a AR.TargetCollectionResource specific to the target collection that should be used. Optional parameters are passed as object in the last argument. In this case a callback function for the onTargetsLoaded trigger is set. Once the tracker loaded all its target images, the function worldLoaded() is called.

// 			Important: If you replace the tracker file with your own, make sure to change the target name accordingly.
// 			Use a specific target name to respond only to a certain target or use a wildcard to respond to any or a certain group of targets.
// 		*/
//         this.targetCollectionResource = new AR.TargetCollectionResource("assets/ar_11.wtc", {
//         });

//         this.tracker = new AR.ImageTracker(this.targetCollectionResource, {
//             onTargetsLoaded: this.worldLoaded,
//             onError: function(errorMessage) {
//             	alert(errorMessage);
//             }
//         });

// 		// /*
// 		// 	The next step is to create the augmentation. In this example an image resource is created and passed to the AR.ImageDrawable. A drawable is a visual component that can be connected to an IR target (AR.ImageTrackable) or a geolocated object (AR.GeoObject). The AR.ImageDrawable is initialized by the image and its size. Optional parameters allow for position it relative to the recognized target.
// 		// */

// 		// /* Create drawable for the seen AR tag */
// 		// var overlayOne = new AR.HtmlDrawable({html:"<button type='button'>LED ON</button>"}, 1, {
// 		//   offsetX : 1,
// 		//   scale: 1,
// 		//   onCli
// 		//   ck : function() {
// 		//     AR.context.openInBrowser("https://www.wikitude.com");
// 		//   },
// 		//   // horizontalAnchor : AR.CONST.HORIZONTAL_ANCHOR.LEFT,
// 		//   opacity : 0.9
// 		// });

		
// 			The last line combines everything by creating an AR.ImageTrackable with the previously created tracker, the name of the image target and the drawable that should augment the recognized image.
// 			Please note that in this case the target name is a wildcard. Wildcards can be used to respond to any target defined in the target collection. If you want to respond to a certain target only for a particular AR.ImageTrackable simply provide the target name as specified in the target collection.
		
// 		this.pageOne = new AR.ImageTrackable(this.tracker, "*", {
// 			onImageRecognized: this.loadARIntoViewFor11,
//             onError: function(errorMessage) {
//             	alert(errorMessage);
//             }
// 		});
// 	},

// 	loadARIntoViewFor11: function() {
// 		// Remove Loading Bar
// 		if (!World.loaded) {
// 			var e = document.getElementById('loadingMessage');
// 			e.parentElement.removeChild(e);
// 			World.loaded = true;
// 		}
// 		// Now retrieve tag ID and send it to the next accessor. But we will implement this later.

// 		// For now let's call the function that adds in the new drawable
// 		this.addDrawableforDetectedImage(this.pageOne);
// 	},

// 	worldLoaded: function worldLoadedFn() {
// 		var cssDivLeft = " style='display: table-cell;vertical-align: middle; text-align: right; width: 50%; padding-right: 15px;'";
// 		var cssDivRight = " style='display: table-cell;vertical-align: middle; text-align: left;'";
// 		document.getElementById('loadingMessage').innerHTML =
// 			"<div" + cssDivLeft + ">Scan AR Tag</div>" +
// 			"<div" + cssDivRight + ">";
// 	},

// 	addDrawableforDetectedImage: function(image_trackable) {
// 		/* Create drawable for the seen AR tag */
// 		var overlayOne = new AR.HtmlDrawable({html:"<button type='button'>LED ON</button>"}, 1, {
// 		  offsetX : 1,
// 		  scale: 1,
// 		  onClick : function() {
// 		    AR.context.openInBrowser("https://www.wikitude.com");
// 		  },
// 		  // horizontalAnchor : AR.CONST.HORIZONTAL_ANCHOR.LEFT,
// 		  opacity : 0.9
// 		});

// 		// Add the overlay to the ImageTracker.
// 		image_trackable.drawables.addCamDrawable(overlayOne, 0);
// 	}
// };

// World.init();
