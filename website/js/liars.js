"use strict";

var CONSTS = {'dice_gap':0.2,
			  'dice_background':'#CCCCCC'};

var IMAGES = ['1_dot.png', '2_dots.png', '3_dots.png',
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

	// load all the images and then call callback
	for(var i of IMAGES) {
		this.images.push(new Image());
		this.images[this.images.length - 1].onload = this.imageLoaded.bind(this);
		this.images[this.images.length - 1].src = 'gfx/' + i;
	}
};

function Player() {
	// start with 4 dice
	this.dice = [1,1,1,1,1];
};

Player.prototype.rollDice = function() {
	var total_dice = this.dice.length;
	var new_dice = [];
	for(var i=0; i<total_dice; i++) {
		new_dice.push(Math.floor((Math.random() * 6) + 1));
	}
	new_dice.sort();
	this.dice = new_dice;
};

function DrawDice(dice_images) {
	this.dice = dice_images;
	this.gap = 0;
	this.dice_size = 0;

	this.setCanvasHeight = function(ctx) {
		// ctx is an array of canvas, but they all should be the same height
		// so first, get the width
		var width = ctx[0].canvas.clientWidth;
		// now we know the width, we can get the sizes of the dice
		var total_gap = (CONSTS.dice_gap * width);
		this.dice_size = (width - total_gap) / 3.0;
		this.gap = total_gap / 4.0;
		// the height is 3 gaps + 2 images
		var height = (3.0 * this.gap) + (2.0 * this.dice_size);
		for(var i of ctx) {
			i.canvas.height = height; }

		console.log(width, height);
	};

	this.drawOne = function(ctx, dice) {
		// placed centrally
		var xoff = (ctx.canvas.width - this.dice_size) / 2.0;
		var yoff = (ctx.canvas.height - this.dice_size) / 2.0;
		// now blit the image
		ctx.drawImage(this.dice[dice[0] - 1], xoff, yoff, this.dice_size, this.dice_size);
	};

	this.drawTwo = function(ctx, dice) {
		// placed and spaced centrally
		var xoff = (ctx.canvas.width - (this.dice_size * 2)) / 3.0;
		var yoff = (ctx.canvas.height - this.dice_size) / 2.0;
		ctx.drawImage(this.dice[dice[0] - 1], xoff, yoff, this.dice_size, this.dice_size);
		xoff = (xoff * 2) + this.dice_size;
		ctx.drawImage(this.dice[dice[1] - 1], xoff, yoff, this.dice_size, this.dice_size);
	};

	this.drawThree = function(ctx, dice) {
		// placed and spaced centrally
		var xoff = (ctx.canvas.width - (this.dice_size * 3)) / 4.0;
		var yoff = (ctx.canvas.height - this.dice_size) / 2.0;
		ctx.drawImage(this.dice[dice[0] - 1], xoff, yoff, this.dice_size, this.dice_size);
		var xoff2 = (2.0 * xoff) + this.dice_size;
		ctx.drawImage(this.dice[dice[1] - 1], xoff2, yoff, this.dice_size, this.dice_size);
		xoff2 = (3.0 * xoff) + (2.0 * this.dice_size);
		ctx.drawImage(this.dice[dice[2] - 1], offset, yoff, this.dice_size, this.dice_size);
	};

	this.drawFour = function(ctx, dice) {
		// in a square
		var xoff = (ctx.canvas.width - (this.dice_size * 2)) / 3.0;
		var yoff = this.gap;
		ctx.drawImage(this.dice[dice[0] - 1], xoff, yoff, this.dice_size, this.dice_size);
		var xoff2 = (xoff * 2) + this.dice_size;
		ctx.drawImage(this.dice[dice[1] - 1], xoff2, yoff, this.dice_size, this.dice_size);
		yoff += this.dice_size + this.gap;
		ctx.drawImage(this.dice[dice[2] - 1], xoff, yoff, this.dice_size, this.dice_size);
		ctx.drawImage(this.dice[dice[3] - 1], xoff2, yoff, this.dice_size, this.dice_size);
	};

	this.drawFive = function(ctx, dice) {
		// 2 on top and 3 on the bottom
		var xoff = (ctx.canvas.width - (this.dice_size * 2)) / 3.0;
		var yoff = this.gap;
		ctx.drawImage(this.dice[dice[0] - 1], xoff, yoff, this.dice_size, this.dice_size);
		xoff = (xoff * 2) + this.dice_size;
		ctx.drawImage(this.dice[dice[1] - 1], xoff, yoff, this.dice_size, this.dice_size);
		yoff += this.gap + this.dice_size;
		var xoff = (ctx.canvas.width - (this.dice_size * 3)) / 4.0;
		ctx.drawImage(this.dice[dice[2] - 1], xoff, yoff, this.dice_size, this.dice_size);
		var xoff2 = (2.0 * xoff) + this.dice_size;
		ctx.drawImage(this.dice[dice[3] - 1], xoff2, yoff, this.dice_size, this.dice_size);
		var xoff2 = (3.0 * xoff) + (2.0 * this.dice_size);
		ctx.drawImage(this.dice[dice[4] - 1], xoff2, yoff, this.dice_size, this.dice_size);
	};

	this.draw = function(ctx, dice) {
		// flood fill the canvas
		ctx.fillStyle = CONSTS.dice_background;
		ctx.fillRect(0, 0, ctx.canvas.width - 1, ctx.canvas.height - 1)
		if(dice.length == 1) { this.drawOne(ctx, dice) };
		if(dice.length == 2) { this.drawTwo(ctx, dice) };
		if(dice.length == 3) { this.drawThree(ctx, dice) };
		if(dice.length == 4) { this.drawFour(ctx, dice) };
		if(dice.length == 5) { this.drawFive(ctx, dice) };
	};
};

function GameEngine(images) {
	this.dice_draw = new DrawDice(images);
	this.dice_ctx = [];
	this.dice_images = [];
	this.players = [];

	this.rollAllDice = function() {
		for(var i of this.players) {
			i.rollDice(); }
	};

	this.drawDice = function() {
		for(var i=0; i<this.players.length; i++) {
			this.dice_draw.draw(this.dice_ctx[i], this.players[i].dice);
		}
	};

	this.init = function() {
		// get the player canvases and a 2d context
		for(var i of [1,2,3,4,5]) {
			var canvas_id = 'p' + i.toString() + '-canvas';
			var canvas = document.getElementById(canvas_id);
			this.dice_ctx.push(canvas.getContext('2d'));
			this.players.push(new Player());
		}
		this.dice_draw.setCanvasHeight(this.dice_ctx);
		this.rollAllDice();
		this.drawDice();
	};
};

function imagesLoaded(images) {
	// pass this to the engine and start it
	engine = new GameEngine(images);
	engine.init();
}

var engine = null;

window.onload = function() {
	var images = new ImageLoader(imagesLoaded);
};
