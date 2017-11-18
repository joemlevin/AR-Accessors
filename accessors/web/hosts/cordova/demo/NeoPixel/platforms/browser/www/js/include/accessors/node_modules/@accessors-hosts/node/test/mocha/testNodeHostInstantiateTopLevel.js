// @version: $$Id: testNodeHostInstantiateTopLevel.js 1488 2017-04-08 08:51:47Z cxh $$
// Run the test/TestComposite code in accessors/web/test/TestComposite.js
// To run this test, do:
//   sudo npm install -g mocha
//   mocha testNodeHostInvoke.js

var nodeHost = require('../../nodeHost.js');
describe('NodeHost./accessors/web/hosts/node/test/mocha/testNodeHostInstantiateTopLevel nodeHost instantiateTopLevel()', function () {
    it('NodeHost./accessors/web/hosts/node/test/mocha/testNodeHostInstantiateTopLevel instantiateTopLevel()', function () {
        nodeHost.instantiateTopLevel("TestComposite", "test/TestComposite");

    });
});
