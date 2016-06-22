"user strict";

IMAGES = {'one-dot':'1_dot.png',
		  'two-dot':'2_dots.png',
		  'three-dot':'3_dots.png',
		  'four-dot':'4_dots.png',
		  'five-dot':'5_dots.png',
		  'six-dot':'6_dots.png'};

function getLength(dictionary) {
	var count = 0;
	for(var i in dictionary) {
		if(dictionary.hasOwnProperty(i)) {
			count++; }
	}
	return(count);
};


function ImageLoader(callback) {
	this.imageLoaded = function() {
		this.total_loaded += 1;
		if(this.total_loaded == this.images_to_load) {
			// run the callback
			this.onImagesLoaded(this.images);
		}
	};

	this.images = {};
	this.total_loaded = 0;
	this.onImagesLoaded = callback;
	// get number of images
	this.images_to_load = getLength(IMAGES);

	// load all the images and then call callback
	for(var name in IMAGES) {
		if(IMAGES.hasOwnProperty(name)) {
			this.images[name] = new Image();
			this.images[name].onload = this.imageLoaded.bind(this);
			this.images[name].src = 'gfx/' + IMAGES[name];
		}
	}
};

function Player() {
	var dice = [];
};

Player.prototype.rollDice = function() {
	var total_dice = this.dice.length;
	new_dice = [];
	for(var i=0; i<total_dice; i++) {
		new_dice.push(1);
	}
};

function DiceDisplay(canvas) {
	// canvas is the context
	this.canvas = canvas;
}

function GameEngine(images) {
	this.images = images;
	console.log('Started up the engine!');
	console.log(images);
}

function imagesLoaded(images) {
	// pass this to the engine and start it
	engine = new GameEngine(images);
}

var engine = null;

window.onload = function() {
	var images = ImageLoader(imagesLoaded);
};
