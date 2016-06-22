"user strict";

CONSTS = {'dice_gap':30};

IMAGES = ['1_dot.png', '2_dots.png', '3_dots.png',
		  '4_dots.png', '5_dots.png', '6_dots.png'];


function ImageLoader(callback) {
	this.imageLoaded = function() {
		this.total_loaded += 1;
		if(this.total_loaded == IMAGES.length) {
			this.onImagesLoaded(this.images);
		}
	};

	this.images = [];
	this.total_loaded = 0;
	this.onImagesLoaded = callback;
	// get number of images

	// load all the images and then call callback
	for(var i of IMAGES) {
		this.images.push(new Image());
		this.images[this.images.length - 1].onload = this.imageLoaded.bind(this);
		this.images[this.images.length - 1].src = 'gfx/' + i;
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
	this.dice_canvas = [];
	this.dice_images = [];
	this.players = [];

	this.init = function() {
		// get the player canvases and a 2d context
		for(var i of [1,2,3,4,5]) {
			var canvas_id = 'p' + i.toString() + '-canvas';
			var canvas = document.getElementByID(canvas_id);
			this.dice_canvas.push(canvas.getContext('2d'));
			this.players.push(new Player());
		}

	}
};

function imagesLoaded(images) {
	// pass this to the engine and start it

	console.log(images);
	return;

	engine = new GameEngine(images);
	engine.init();
}

var engine = null;

window.onload = function() {
	var images = ImageLoader(imagesLoaded);
};
