// Test accessor that multiplies its input by a scale factor.
//
// Copyright (c) 2016-2017 The Regents of the University of California.
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

/** Test accessor that multiplies its input by a scale factor.
 *  This is a modified copy of TestGain.js
 *
 *  First, the parameter is initialized to a different value.
 *
 *  Second, there is an additional output, that sends the opposite of the
 *  obtained value. This second output is echoed using console.log.
 *
 *  Third, there are 2 realized features, witch are 'gain' and 'opposite'.
 *
 *  @accessor mutable/TestGain2
 *  @param gain The gain, a number with default 4.
 *  @param input The input, a number with default 0.
 *  @param scaled The output, the result of input * gain.
 *  @author Edward A. Lee
 *  @version $$Id: TestGain2.js 2074 2017-08-25 21:20:30Z chadlia.jerad $$
 */

// Stop extra messages from jslint.  Note that there should be no
// space between the / and the * and global.
/*globals console, error, exports, require */
/*jshint globalstrict: true*/
"use strict";

exports.setup = function () {
    this.input('input', {
        'type': 'number',
        'value': 0
    });
    this.output('scaled', {
        'type': 'number'
    });
    this.output('opScaled', {
        'type': 'number'
    });
    this.parameter('gain', {
        'type': 'number',
        'value': 4
    });
};

exports.initialize = function () {
    this.addInputHandler('input', function () {
        // console.log("TestGain2: inputHandler: input: " + this.get('input') + " gain: " + this.getParameter('gain'));
        // console.log('TestGain2: scaled: ' + this.get('input') * this.getParameter('gain') + ' opScaled: ' + -(this.get('input') * this.getParameter('gain')));

        this.send('scaled', this.get('input') * this.getParameter('gain'));
        this.send('opScaled', -(this.get('input') * this.getParameter('gain')));
    });
};
