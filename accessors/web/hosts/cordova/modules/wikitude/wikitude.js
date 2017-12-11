// Wikitude module for cordova accessors host.
//
// Below is the copyright agreement for the Ptolemy II system.
//
// Copyright (c) 2017 The Regents of the University of California.
// All rights reserved.
//
// Permission is hereby granted, without written agreement and without
// license or royalty fees, to use, copy, modify, and distribute this
// software and its documentation for any purpose, provided that the above
// copyright notice and the following two paragraphs appear in all copies
// of this software.
//
// IN NO EVENT SHALL THE UNIVERSITY OF CALIFORNIA BE LIABLE TO ANY PARTY
// FOR DIRECT, INDIRECT, SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES
// ARISING OUT OF THE USE OF THIS SOFTWARE AND ITS DOCUMENTATION, EVEN IF
// THE UNIVERSITY OF CALIFORNIA HAS BEEN ADVISED OF THE POSSIBILITY OF
// SUCH DAMAGE.
//
// THE UNIVERSITY OF CALIFORNIA SPECIFICALLY DISCLAIMS ANY WARRANTIES,
// INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE. THE SOFTWARE
// PROVIDED HEREUNDER IS ON AN "AS IS" BASIS, AND THE UNIVERSITY OF
// CALIFORNIA HAS NO OBLIGATION TO PROVIDE MAINTENANCE, SUPPORT, UPDATES,
// ENHANCEMENTS, OR MODIFICATIONS.
//

/**
 *  Module for retrieving wikitube information and for communicating to the Wikitude WebView.
 *	Portions of the code is drawn from sample examples for the wikiPlugin.
 *
 *  @module wikitude
 *  @author Marsalis Gibson, Joseph Levin
 *  @version $$Id: wikitude.js 76494 2017-08-02 12:04:07Z cxh $$
 */

// Stop extra messages from jslint and jshint.  Note that there should
// be no space between the / and the * and global. See
// https://chess.eecs.berkeley.edu/ptexternal/wiki/Main/JSHint */
/*globals addInputHandler, console, get, getParameter, getResource, error, exports, extend, get, input, output, parameter, require, send */
/*jshint globalstrict: true*/

"use strict";
exports.requiredPlugins = ['com.wikitude.phonegap.WikitudePlugin'];
var wikitudePlugin = cordova.require("com.wikitude.phonegap.WikitudePlugin.WikitudePlugin");
var isDeviceSupported = false;
var isArchitectWorldLoaded = false;
var ar_path = "www/world.html"; //Change this!
var targets = []

exports.StartAR = function (settings){
	// represents the device capability of launching ARchitect Worlds with specific features
	var onJSONObjectReceived = function (seen_target) {
		var target_id = null;
		var target = null;
		if (seen_target.id && seen_target.my_target) {
		target_id = seen_target.id;
		arget = seen_target.my_target
	} else {
		return;
	}
		// If I haven't seen the target_id, please add it to memory.
		if (!targets.includes(target_id)) {
			targets.push({target_id: target});
		settings.callback_func(target_id);
  }
	}
	bindEvents(onJSONObjectReceived);
	console.log("AR initialized.");
};
exports.TestFn = function() {
  console.log("This is Charles Humbleton, BBC News.")
}
exports.RenderUI = function (options){
	// Send the construction to Wikitube
	var new_target = this.targets[options.target_id];
	var settings = {
		html: options.html,
		target_name: new_target,
		callback_func: options.UI_input_handler
	};
    wikitudePlugin.callJavaScript("World.constructUI(" + JSON.stringify( settings ) +");");
}

function bindEvents(onJSONObjectReceived) {
	var onDeviceReady = function () {
	    // set a callback for android that is called once the back button was clicked.
	    if ( cordova.platformId == "android" ) {
	        wikitudePlugin.setBackButtonCallback(onBackButton);
	    }
	    wikitudePlugin.setJSONObjectReceivedCallback(onJSONObjectReceived);
	    loadCustomARchitectWorldFromURL(ar_path);
	}
	document.addEventListener('deviceready', onDeviceReady, false);
}

function loadCustomARchitectWorldFromURL(url) {
    var customArchitectWorld = {
        "path": url,
        "requiredFeatures": [
            "image_tracking",
            "geo"
        ],
        "startupConfiguration": {
            "camera_position": "back"
        }
    };
    isArchitectWorldLoaded = false;
    prepareArchitectWorld(customArchitectWorld, function() {
        loadARchitectWorld(customArchitectWorld);
    });
}

function prepareArchitectWorld(architectWorld, successCallback) {
    wikitudePlugin.isDeviceSupported(function() {
        wikitudePlugin.requestAccess(
            function() {
                successCallback();
            },
            function(error) {
                /* The error object contains two error messages.
                    * userDescription is a end user formatted message that can be displayed with e.g. a JS alert
                    * developerDescription is a developer formatted message with more detailed information about the error
                 */
                /* Here, the userDescription is used to show a confirmation box which, in case of a positive result, shows the applications settings so that user can grant access. */
                var openAppSettings = confirm(error.userDescription + '\nOpen App Settings?');
                if ( openAppSettings == true ) {
                    wikitudePlugin.openAppSettings();
                }
            },
            architectWorld.requiredFeatures);
    }, function(errorMessage) {
        alert(errorMessage);
    },
    architectWorld.requiredFeatures);
}

// Use this method to load a specific ARchitect World from either the local file system or a remote server
function loadARchitectWorld(architectWorld) {
    wikitudePlugin.loadARchitectWorld(function successFn(loadedURL) {
            /* Respond to successful world loading if you need to */
            isArchitectWorldLoaded = true;

            /* in case the loaded Architect World belongs to the 'obtain poi data from application model' example, we can now safely inject poi data. */
            if ( architectWorld.requiredExtension === "ObtainPoiDataFromApplicationModel" ) {
                injectGeneratedPoiJsonData();
            }
        }, function errorFn(error) {
            isArchitectWorldLoaded = false;
            alert('Loading AR web view failed: ' + error);
        },
        architectWorld.path, architectWorld.requiredFeatures, architectWorld.startupConfiguration
    );
}


function onJSONObjectReceived(jsonObject) {
    // What to do whenever, I receive a jsonObject specifying the AR Tag that I have seen.
}

function onBackButton() {
    /* Android back button was pressed and the Wikitude PhoneGap Plugin is now closed */
}
