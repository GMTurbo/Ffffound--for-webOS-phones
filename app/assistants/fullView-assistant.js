function FullViewAssistant(argFromPusher) {
	this.item = argFromPusher.item;
	this.timer = null;
}
function toggleBar(state) {
	showing = state;
	if (state) {
		$('overlayToolBar').removeClassName("hide");
		$('overlayToolBar').addClassName("show");
	} else {
		$('overlayToolBar').removeClassName("show");
		$('overlayToolBar').addClassName("hide");
	}
}

FullViewAssistant.prototype = {
	setup: function() {
		Ares.setupSceneAssistant(this);
		this.controller.listen(this.controller.get("one"), Mojo.Event.tap, this.save.bind(this));
		this.controller.listen(this.controller.get("three"), Mojo.Event.tap, this.email.bind(this));
		this.controller.listen(this.controller.get("two"), Mojo.Event.tap, this.open.bind(this));
		this.controller.listen(this.controller.window, 'resize', this.handleResize.bind(this));
	},
	cleanup: function() {
		Ares.cleanupSceneAssistant(this);
		this.controller.stopListening(this.controller.get("one"), Mojo.Event.tap, this.save.bind(this));
		this.controller.stopListening(this.controller.get("three"), Mojo.Event.tap, this.email.bind(this));
		this.controller.stopListening(this.controller.get("two"), Mojo.Event.tap, this.open.bind(this));
		this.controller.stopListening(this.controller.window, 'resize', this.handleResize.bind(this));
	},
	activate: function(){
		spinner(true);
		this.controller.stageController.setWindowOrientation("free");
		this.controller.enableFullScreenMode(true);
		this.controller.get("imageView1").mojo.centerUrlProvided(this.item.source.url);
	},
	deactivate: function(){
		this.controller.enableFullScreenMode(false);
		this.controller.stageController.setWindowOrientation("up");
	},
	imageView1Hold: function(inSender, event) {
		toggleBar($('overlayToolBar').className.indexOf("hide") > 0);
		if(this.timer){
			this.controller.window.clearTimeout(this.timer);
		}
		this.timer = this.controller.window.setTimeout(function() {
			toggleBar(false);
		},
		4000);
	},
	save: function(event) {
		if ($('overlayToolBar').className.indexOf("hide") === -1) {
			this.download(this.item.content.url);
		}
	},
	open: function(event) {
		if ($('overlayToolBar').className.indexOf("hide") === -1) {
			this.open1();
		}
	},
	email: function(event) {
		if ($('overlayToolBar').className.indexOf("hide") === -1) {
			this.email1(this.item.content.url);
		}
	},
	download: function(image) {
		downloadImage = function(url, onSuccess, onFailure) {
			this.controller.serviceRequest('palm://com.palm.downloadmanager/', {
				method: 'download',
				parameters: {
					target: url,
					targetDir: "/media/internal/ffffound",
					targetFilename: name,
					keepFilenameOnRedirect: false,
					subscribe: false
				},
				onComplete: onSuccess,
				onFailure: onFailure
			});
		}.bind(this);
		var onSuccess = function(event) {
			showBanner("Image saved to device");
		};
		onFailure = function() {
			showBanner("Download Failed");
		};
		downloadImage(image, onSuccess.bind(this), onFailure.bind(this));
	},
	email1: function(image) {
		this.controller.serviceRequest("palm://com.palm.applicationManager", {
			method: 'open',
			parameters: {
				id: "com.palm.app.email",
				params: {
					summary: "Checkout this image",
					text: "<img src=\"" + image + "\"><br><br><a href=\"" + this.item.link + "\">" + "check out what I ffffound</a>"
				}
			}
		});
	},
	open1: function() {
		this.controller.serviceRequest('palm://com.palm.applicationManager', {
			method: 'open',
			parameters: {
				id: 'com.palm.app.browser',
				params: {
					target: this.item.source.referer
				}
			}
		});
	},
	imageView1ImageViewChanged: function(inSender, event) {
		spinner(false);
	},
	handleResize: function(inSender, event){
		this.controller.get('imageView1').mojo.manualSize(this.controller.window.innerWidth, this.controller.window.innerHeight);
	}
};

FullViewAssistant.prototype.handleCommand = function(event) {
	if (event.type == Mojo.Event.command) {} else if (event.type === Mojo.Event.back) {
		spinner(false);
		this.controller.stageController.popScene({ret: true});
	}
};