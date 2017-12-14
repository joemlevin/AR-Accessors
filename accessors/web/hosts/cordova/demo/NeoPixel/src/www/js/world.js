/* This is part 2 to the Wiki module.
 */
var asset = "assets/accimg.wtc";
var trackableName = "apt1";
var activeDrawables = {};
var drawables = []
var World = {
    loaded: false,
    // AR.logger.debug('Entered World instance.');
    init: function initFn() {
        // AR.logger.debug('Called Init.');
        this.createOverlays();
    },

    createOverlays: function () {
        /*
         First an AR.ImageTracker needs to be created in order to start the recognition engine.
         It is initialized with a AR.TargetCollectionResource specific to the target collection that should be used.
         Optional parameters are passed as object in the last argument.
         Important: If you replace the tracker file with your own, make sure to change the target name accordingly.
         Use a specific target name to respond only to a certain target or use a wildcard to respond to any or a certain group of targets.
         */
        var targetCollectionResource = new AR.TargetCollectionResource(asset);

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
                console.log("Error: " + errorMessage);
            }
        });

        this.targets = new AR.ImageTrackable(tracker, '*', {
            onImageRecognized: function (target) {
            	// Send the tag id and target name to the output function to generate the HTML overlay.
              var target_id;
              if (target == "apt1") {
            	 target_id = 1; //Change this to use the JSON metadata for each image detected.
             }
            	AR.platform.sendJSONObject({
                my_target: target,
			          id: target_id
              });
            	// Eventually a function will be called that retrieves the HTML string and adds that overlay
            	// to the target name.

            },
            onError: function (errorMessage) {
                alert(errorMessage);
            },
            onImageLost: function(target) {
              this.targets.removeImageTargetCamDrawables(target, drawables);
              drawables = [];
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

		var buttons = settings.html;
		var target = settings.target_name;
    var initialOffset = -0.25;
    var translateX = initialOffset;
    AR.logger.debug(JSON.stringify(buttons));
    // Loop through the required buttons and create drawables for each
    for (var choice in buttons) {
      var button = buttons[choice];
      AR.logger.debug("Value = " + button.value);
		/* Create drawables for the seen AR tag */
      var drawable = new AR.HtmlDrawable({html:button.html}, .1, {
        clickThroughEnabled : true,
        offsetX : 0,
        scale: 1,
        zOrder :1,
        translate : {
          x: translateX
        },
        onClick : function() {
          var value = this.translate.x;
          correctedValue = Math.floor((value + initialOffset) / .1) + 6;
          AR.platform.sendJSONObject({command: correctedValue});
        }
      });
      drawables.push(drawable);
      translateX += .1
    }
    /*
       Adds the model as augmentation for the currently recognized target.
       */
      this.targets.addImageTargetCamDrawables(target, drawables);
	    World.removeLoadingBar();
	}
};

World.init();
