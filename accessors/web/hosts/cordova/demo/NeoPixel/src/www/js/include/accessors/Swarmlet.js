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

/** This swarmlet defines the system architecture for the Augmented Reality
 * Accessor control system. It was written as a part of the AR accessors
 * class project for EECS149: Embedded Systems during the Fall 2017 semester
 * at UC Berkeley
 *
 *  See https://www.icyphy.org/accessors/wiki/Main/CordovaHost2
 *
 *  @module swarmlet.js
 *  @author Joseph Levin
 *  @version $$Id: swarmlet.js 1502 2017-04-17 21:34:03Z cxh $$
 */

exports.setup = function() {
    this.input('input');
    console.log('Swarmlet setup...');
    var mutable = this.instantiate('mutable', 'Mutable');
    var schemaToHtml = this.instantiate('sth', 'SchemaToHTML');
    var ui = this.instantiate('ui', 'UserInput');
    var ui_build = this.instantiate('ui_build', 'UserInterface');
    var ar = this.instantiate('ar', 'ARInterface');
    this.connect(mutable, 'schema', schemaToHtml, 'schema');
    this.connect(schemaToHtml, 'html', ui, 'html');
    this.connect(ar, 'accessor', mutable, 'accessor');
    this.connect(ui, 'update', ui_build, 'update');
    this.connect(ui_build, 'post', mutable, 'control');
    console.log('Swarmlet setup ended.');
};



exports.initialize = function () {
    this.react();
    console.log('Swarmlet initialized');
};
