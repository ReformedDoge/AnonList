const purify = require("purify-css")
var content = ['**/scripts/popup.js', '**/popup.html'];
var css = ['**/css/bootstrap.css'];
var options = {
    // Will write purified CSS to this file.
    output: './bootstrap.css',
    info: true,
    minify: true
};
purify(content, css, options);
