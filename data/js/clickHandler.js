self.on("click", function (node, data) {

	var text = window.getSelection().toString().trim();
	var message = {"engineName":data,"query":text};

	self.postMessage(message);
});
