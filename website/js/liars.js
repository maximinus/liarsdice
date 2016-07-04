"use strict";

var consts = {
	'WIDTH': 1280,
	'HEIGHT': 960,
	// smallest size
	'GAME_SIZE': 640,
	'BACKGROUNDCOLOR': '#000000',
	'STARTING_PLAYERS': 4,
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

function Rect(x, y, w, h) {	
	this.xpos = x;
	this.ypos = y;
	this.width = w;
	this.height = h;
};

Rect.prototype.inside = function(x, y) {
	if((x < this.xpos) || (x > this.xpos + this.width)) {
		return(false); }
	if((y < this.ypos) || (y > this.ypos + this.height)) {
		console.log('fail y');
		return(false); }
	return(true);
};

function getDiceName(index) {
	// always return some image
	if((index < 1) || (index > 6)) {
		return('1_image'); }
	return(index.toString() + '_image');
};

function PlayerDisplay(location, color) {
	var WIDTH = 320;
	var HEIGHT = 320;

	this.createInitialSprite = function() {
		// create the border etc..
		var image = game.add.bitmapData(WIDTH, HEIGHT);
		image.ctx.beginPath();
		image.ctx.rect(0, 0, WIDTH, HEIGHT);
		image.ctx.fillStyle = this.color;
		image.ctx.fill();
		this.background = game.add.sprite(-(WIDTH * 2), 0, image);
	};

	this.destroyDiceSprites = function() {
		for(var i of this.dice) {
			i.kill(); }
		this.dice = [];
	};

	this.draw = function(player) {
		console.log(player);

		if(this.sprite == null) {
			this.createInitialSprite();
		}
		// redraw dice
		this.destroyDiceSprites();
		var xpos = 0;
		for(var i of player.dice) {
			game.add.sprite(xpos, 0, getDiceName(i));
			xpos += 128;
		}
		this.background.x = 0;
		this.background.y = 0;
	};

	this.color = color;
	this.background = null;
	this.dice = [];
	this.location = location;
};

function LiarModel(total_players) {
	this.rollAllDice = function() {
		for(var i of this.players) {
			i.rollDice(); }
	};

	this.init = function() {
		this.players = [];
		for(var i=0; i<total_players; i++) {
			this.players.push(new Player()); }
		this.rollAllDice();
	};

	this.init();
};

function Game() {
	this.preload = function() {
		for(var i=1; i<7; i++) {
			var filename = 'gfx/' + i.toString() + '_dots.png';
			var index = i.toString() + '_image';
			game.load.image(index, filename);
		}
	};

	this.create = function() {
		this.initFullScreen();
		this.game.stage.backgroundColor = consts.BACKGROUNDCOLOR;
		this.addKeys();

		console.log(this.model);

		this.drawPlayers();
	};
	
	this.addKeys = function() {
		//var key = game.input.keyboard.addKey(Phaser.Keyboard.C);
		//key.onDown.add(this.sprite_cycle.update, this.sprite_cycle);
	};
	
	this.initFullScreen = function() {
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.scale.minWidth = consts.GAME_SIZE;
		this.scale.minHeight = consts.GAME_SIZE;
		this.scale.pageAlignHorizontally = true;
		this.scale.pageAlignVertically = true;
		this.stage.forceLandscape = true;
	};

	this.update = function(delta) {
		// called every frame. delta = time since last frame
	};

	this.drawPlayers = function() {
		this.player_display.draw(this.model.players[0]);
	};

	this.model = new LiarModel(consts.STARTING_PLAYERS);
	this.player_display = new PlayerDisplay(0, '#ff0000');
};

var game = new Phaser.Game(consts.WIDTH, consts.HEIGHT, Phaser.CANVAS, "Liar;s Dice");
game.state.add('Game', new Game());
game.state.start('Game');
