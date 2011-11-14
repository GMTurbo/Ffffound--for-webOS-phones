var offset = 0;
var userOffset = 0;
var showing = false;
var snapIndex = 1;

function MainAssistant(argFromPusher) {
	this.firstLoad = true;
	this.searching = false;
	this.foundArray = [];
	this.author = null;
	this.timer = null;
	this.highQ = true;

	cookie = new Mojo.Model.Cookie("hd");
	if (cookie.get()) {
		if (typeof cookie.get().HD !== "undefined") {
			this.highQ = cookie.get().HD;
		}
	}

	this.fillList = function(items) {
		var foundArray = new Array(items.length);
		for (var i = 0; i < items.length; i++) {
			foundArray[i] = {
				background: items[i].thumbnail.url,
				image: this.highQ ? items[i].content.url : items[i].thumbnail.url,
				author: items[i].author,
				link: items[i].link,
				content: items[i].content,
				title: items[i].title,
				source: items[i].source
			};
		}
		listModel = {
			items: foundArray
		};
		return {
			getList: function() {
				return listModel;
			}
		};
	};
}

function spinner(state) {
	if (state) {
		$('overlayImg').addClassName("loading");
		$('overlayMain').style.top = "225px"; //105 for circular loader
	} else {
		$('overlayImg').removeClassName("loading");
		$('overlayMain').style.top = "600px";
	}
}

function showBanner(message) {
	Mojo.Controller.getAppController().showBanner(message, {
		source: 'notification'
	});
}

MainAssistant.prototype = {
	setup: function() {
		Ares.setupSceneAssistant(this);
		this.appMenuModel = {
			items: [
				{command:'none'},
				{
				label: "High Quality Images",
				command: 'quality',
				iconPath: this.highQ ? Mojo.appPath + "/images/check_mark.png" : "none"
			},{command:'none'},
				{
				label: "Jump",
				command: 'jump'
			},
				{
				label: "Home",
				command: 'home'
			},{command:'none'},
				{
				label: "Support",
				command: 'support'
			},{command:'none'}]
		};
		this.controller.setupWidget(Mojo.Menu.appMenu, {},
		this.appMenuModel);

		attributes = {
			hintText: $L('search users'),
			modelProperty: 'original',
			multiline: false,
			label: $L('To:'),
			focus: true,
			textFieldMode: 'sentence-case',
			limitResize: false,
			enterSubmits: true,
			holdToEnable: true
		};
		model = {
			'original ': $L(''),
			disabled: false
		};

		this.controller.setupWidget('SearchtextField', attributes, model);

		Mojo.Event.listen(this.controller.get("scroller1"), Mojo.Event.propertyChange, this.handleUpdate.bind(this));
		Mojo.Event.listen(this.controller.get("scroller2"), Mojo.Event.propertyChange, this.handleUpdate2.bind(this));
		this.controller.document.addEventListener("keyup", this.keyupHandler.bind(this), true);

	},
	cleanup: function() {
		Ares.cleanupSceneAssistant(this);
		Mojo.Event.stopListening(this.controller.get("scroller1"), Mojo.Event.propertyChange, this.handleUpdate.bind(this));
		Mojo.Event.stopListening(this.controller.get("scroller2"), Mojo.Event.propertyChange, this.handleUpdate2.bind(this));
		this.controller.document.removeEventListener("keyup", this.keyupHandler.bind(this), true);
	},
	activate: function(ret) {
		if (typeof ret === "undefined") {
			this.controller.get('scroller2').mojo.setSnapIndex(1, false);
			spinner(true);
			//$('listTypeID').textContent = "everyone";
			this.loadImages();
		}
	},
	handleUpdate: function(event) {
		this.controller.get('scroller2').mojo.setSnapIndex(event.value, true);
		snapIndex = event.value;
	},
	handleUpdate2: function(event) {
		this.controller.get('scroller1').mojo.setSnapIndex(event.value, true);
		snapIndex = event.value;
	},
	loadImages: function() {
		var query = "Select * from rss where url='http://ffffound.com/feed?offset=0' LIMIT 10";
		var url = "http://query.yahooapis.com/v1/public/yql?q=" + encodeURIComponent(query) + "&format=json";

		var request = new Ajax.Request(url, {
			method: 'get',
			asynchronous: true,
			evalJSON: "false",
			onSuccess: this.parseResult.bind(this),

			on0: function(ajaxResponse) {
				// connection failed, typically because the server is overloaded or has gone down since the page loaded
				Mojo.Log.error("Connection failed");
			},
			onFailure: function(response) {
				// Request failed (404, that sort of thing)
				Mojo.Log.error("Request failed");
			}
		});
	},
	loadUserImages: function(item) {
		//http://ffffound.com/home/thatdayinthepark/found/feed
		this.author = item.author;
		this.$.label2.setLabel(item.author + "'s images");
		userOffset = 0;
		var query = "Select * from rss where url='http://ffffound.com/home/" + item.author + "/found/feed' LIMIT 10";
		var url = "http://query.yahooapis.com/v1/public/yql?q=" + encodeURIComponent(query) + "&format=json";
		var request = new Ajax.Request(url, {
			method: 'get',
			asynchronous: true,
			evalJSON: "false",
			onSuccess: this.parseResultUser.bind(this),

			on0: function(ajaxResponse) {
				// connection failed, typically because the server is overloaded or has gone down since the page loaded
				Mojo.Log.error("Connection failed");
			},
			onFailure: function(response) {
				// Request failed (404, that sort of thing)
				Mojo.Log.error("Request failed");
			}
		});
	},
	advance: function() {
		switch (snapIndex) {
		case 1:
			spinner(true);
			offset += 10;
			this.loadPage();
			break;
		case 2:
			spinner(true);
			userOffset += 10;
			this.loadUserPage();
			break;
		}
	},
	retreat: function() {
		switch (snapIndex) {
		case 1:
			spinner(true);
			offset -= 10;
			this.loadPage();
			break;
		case 2:
			spinner(true);
			userOffset -= 10;
			this.loadUserPage();
			break;
		}
	},
	jump: function() {
		switch (snapIndex) {
		case 1:
			spinner(true);
			offset += Math.floor(Math.random() * 50);
			showBanner("Jumped forward " + offset * 10 + " images deep..");
			this.loadPage();
			break;
		case 2:
			spinner(true);
			userOffset += Math.floor(Math.random() * 50);
			showBanner("Jumped forward " + userOffset + " user images deep..");
			this.loadUserPage();
			break;
		}
	},
	home: function() {
		switch (snapIndex) {
		case 1:
			spinner(true);
			offset = 0;
			showBanner("Back to start");
			this.loadPage();
			break;
		case 2:
			spinner(true);
			userOffset = 0;
			showBanner("Back to beginning of user list");
			this.loadUserPage();
			break;
		}
	},
	loadPage: function() {
		var query = "Select * from rss where url='http://ffffound.com/feed?offset=" + offset + "' LIMIT 10";
		var url = "http://query.yahooapis.com/v1/public/yql?q=" + encodeURIComponent(query) + "&format=json";

		var request = new Ajax.Request(url, {
			method: 'get',
			asynchronous: true,
			evalJSON: "false",
			onSuccess: this.parseResult.bind(this),

			on0: function(ajaxResponse) {
				// connection failed, typically because the server is overloaded or has gone down since the page loaded
				Mojo.Log.error("Connection failed");
			},
			onFailure: function(response) {
				// Request failed (404, that sort of thing)
				Mojo.Log.error("Request failed");
			}
		});
	},
	loadUserPage: function() {
		var query = "Select * from rss where url='http://ffffound.com/home/" + this.author + "/found/feed?offset=" + userOffset + "' LIMIT 10";
		var url = "http://query.yahooapis.com/v1/public/yql?q=" + encodeURIComponent(query) + "&format=json";
		var request = new Ajax.Request(url, {
			method: 'get',
			asynchronous: true,
			evalJSON: "false",
			onSuccess: this.parseResultUser.bind(this),

			on0: function(ajaxResponse) {
				// connection failed, typically because the server is overloaded or has gone down since the page loaded
				Mojo.Log.error("Connection failed");
			},
			onFailure: function(response) {
				// Request failed (404, that sort of thing)
				Mojo.Log.error("Request failed");
			}
		});
	},
	parseResult: function(transport) {
		if (transport.status === 200) {
			if (transport.responseJSON.query.results) {
				this.foundArray = this.fillList(transport.responseJSON.query.results.item).getList();
				this.controller.setWidgetModel('list1', this.fillList(transport.responseJSON.query.results.item).getList());
				this.controller.get("mainScroll").mojo.scrollTo(0, 0, true, true);
				if (this.firstLoad) {
					this.firstLoad = false;
					this.currentItem = this.foundArray.items[0];
					this.controller.get("userScroll").mojo.scrollTo(0, 0, true, true);
					this.loadUserImages(this.currentItem);
				}
			} else {
				showBanner("no results ffffound :(");
			}
			spinner(false);
		}
	},
	parseResultUser: function(transport) {
		if (transport.status === 200) {
			if (transport.responseJSON.query.results) {
				this.$.label2.setLabel(this.author + "'s images");
				this.foundArrayUser = this.fillList(transport.responseJSON.query.results.item).getList();
				this.controller.setWidgetModel('list2', this.fillList(transport.responseJSON.query.results.item).getList());
				this.controller.get("userScroll").mojo.scrollTo(0, 0, true, true);
				if (this.controller.get('scroller2').mojo.snapIndex !== 2 && this.searching) {
					this.controller.get('scroller2').mojo.setSnapIndex(2, true);
				}
			} else {
				showBanner(this.author + " has no more images :(");
			}
		}
		spinner(false);
	},
	list1Listtap: function(inSender, event) {
		this.currentItem = event.item;
		if (event.originalEvent.target.tagName === "CITE" || event.originalEvent.target.tagName === "SPAN") {
			spinner(true);
			this.loadUserImages(this.currentItem);
			this.controller.get('scroller2').mojo.setSnapIndex(2, true);
		} else {
			//this.controller.stageController.setWindowOrientation("free");
			this.controller.stageController.pushScene('fullView', {
				item: this.currentItem
			});
		}
	},
	list2Listtap: function(inSender, event) {
		this.currentItem = event.item;
		//this.controller.stageController.setWindowOrientation("free");
		this.controller.stageController.pushScene('fullView', {
			item: this.currentItem
		});
	},
	keyupHandler: function(event) {
		if (this.controller.sceneId === "main") {
			if (Mojo.Char.isEnterKey(event.keyCode)) {
				this.beginSearch(this.controller.get('SearchtextField').mojo.getValue());
			}
		}
	},
	beginSearch: function(author) {
		if (author.length > 0) {
			showBanner("Searching " + author + "'s ffffound");
			this.author = author.toLowerCase();
			this.searching = true;
			userOffset = 0;
			var query = "Select * from rss where url='http://ffffound.com/home/" + this.author + "/found/feed' LIMIT 10";
			var url = "http://query.yahooapis.com/v1/public/yql?q=" + encodeURIComponent(query) + "&format=json";
			var request = new Ajax.Request(url, {
				method: 'get',
				asynchronous: true,
				evalJSON: "false",
				onSuccess: this.parseResultUser.bind(this),

				on0: function(ajaxResponse) {
					// connection failed, typically because the server is overloaded or has gone down since the page loaded
					Mojo.Log.error("Connection failed");
				},
				onFailure: function(response) {
					// Request failed (404, that sort of thing)
					Mojo.Log.error("Request failed");
				}
			});
		}
	}
};

MainAssistant.prototype.handleCommand = function(event) {
	controller = Mojo.Controller.stageController.activeScene();
	if (event.type === Mojo.Event.back) {
		event.stop();
		this.retreat();
	} else if (event.type === Mojo.Event.forward) {
		event.stop();
		this.advance();
	} else {
		switch (event.command) {
		case 'quality':
			this.highQ = !this.highQ;
			cook = new Mojo.Model.Cookie("hd");
			cook.put({
				HD: this.highQ
			});
			this.appMenuModel.items[0].iconPath = this.highQ ? Mojo.appPath + "/images/check_mark.png" : "none";
			//controller.modelChanged(this.appMenuModel);
			spinner(true);
			this.loadPage();
			this.loadUserPage();
			break;
		case 'support':
			this.controller.serviceRequest("palm://com.palm.applicationManager", {
				method: 'open',
				parameters: {
					id: "com.palm.app.email",
					params: {
						summary: "ffffone Support Request: v" + Mojo.Controller.appInfo.version,
						recipients: [{
							type: "email",
							role: 1,
							value: "GTestaSoftware@gmail.com",
							contactDisplay: "ffffone Support"
						}]
					}
				}
			});
			break;
		case 'jump':
			this.jump();
			break;
		case 'home':
			this.home();
			break;
		}
	}
};