require("./ContextMenu");
var chrome = require("./Chrome");

exports.onUnload = function (reason){
	chrome.onUnload(reason);
};
