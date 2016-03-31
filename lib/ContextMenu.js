var cm = require("sdk/context-menu");
Data = require("./Data"),
Chrome = require("./Chrome");


var menu = cm.Menu({
	label: "Search On",
	image: Data.get("images/icon16.png"),
	context: cm.SelectionContext(),
	contentScriptFile: Data.get("js/clickHandler.js"),
	items:createMenuItems(Chrome.getEngines()),
	onMessage:function (message){
		Chrome.executeSearch(
				message.engineName,
				message.query,
				require('sdk/preferences/service').get('browser.search.context.loadInBackground'),true,true);
	}
});


function createMenuItems(array){
	var Items = new Array();

	for ( var i =0;i < array.length; i++){
		Items[i] = cm.Item({
			label:array[i].name,
			data:array[i].name
		});	
	}

	return Items;
};


function destroyMenuItems(){
	for(var i=0;i<menu.items.length;i++){
		menu.items[i].destroy();
	}
};


// destroy and recreate menu items so the order reflects
// any user changes such as engines added,removed or reordered
exports.recreateMenuItems = function(engines){
	destroyMenuItems();
	menu.items = createMenuItems(engines);	

};
