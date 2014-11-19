const {Cc,Ci,Cu} = require("chrome");
const {Services} = Cu.import("resource://gre/modules/Services.jsm", {});

var cm = require("./ContextMenu"),
observers = {
    'browser-search-engine-modified': {
        aTopic: 'browser-search-engine-modified',
        observe: function (aSubject, aTopic, aData) {
			
				//if any changes occur we want to create a new list of engines
				cm.recreateMenuItems(getSearchEngines());
        },
        register: function () {
            Services.obs.addObserver(observers[this.aTopic], this.aTopic, false);
        },
        unregister: function () {
            Services.obs.removeObserver(observers[this.aTopic], this.aTopic);
        }
    }
};

registerObservers();

function registerObservers(){
	for (var o in observers) {
		observers[o].register();
	}
};


exports.onUnload = function(reason){

	if(reason == "disable" || reason == "uninstall"){
		for (var o in observers) {
			observers[o].unregister();
		}
	}
};



exports.getEngines = function(){
	
	return getSearchEngines();
};

function getSearchEngines(){

	return Services.search.getVisibleEngines();
};

exports.executeSearch = function(engineName,query,inBg,useNewTab,related){
	
	//get engine
	var engine = Services.search.getEngineByName(engineName);

	if (!engine) {
	    throw new Error('could not find engine with name of "' + engineName + '"');
	}


	var submission = engine.getSubmission(query, null, 'searchbar');

	var win = Services.wm.getMostRecentWindow('navigator:browser');

	if (!win) {
		throw new Error('no win found of type "navigator:browser" is open');
	}
	
	win.openLinkIn(submission.uri.spec,
		    useNewTab ? 'tab' : 'current', {
		            postData: submission.postData,
		            inBackground: inBg,
		            relatedToCurrent: related
		        });
};
