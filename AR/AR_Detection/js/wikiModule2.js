/* This is part 2 to the Wiki module.
 */

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

	/* Please note that settings should look as follows: 
     *
     */ 
	constructUI: function (settings) {
		
		var html_drawable = settings.html;
		var target = settings.target_name;
		/* Create drawable for the seen AR tag */
		var overlayOne = new AR.HtmlDrawable({html:html_drawable}, 1, {
		  offsetX : 1,
		  scale: 1,
		  onClick : settings.callback_func,
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