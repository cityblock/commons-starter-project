var Enzyme = require('enzyme');
var Adapter = require('enzyme-adapter-react-16');
// Needed to run tests related to react-PDF generation
require('regenerator-runtime/runtime');

Enzyme.configure({ adapter: new Adapter() });
