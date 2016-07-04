"use strict";

var consts = {
	'WIDTH': 1280,
	'HEIGHT': 960,
	// smallest size
	'GAME_SIZE': 640,
	'BACKGROUNDCOLOR': '#ffffff',
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
	var WIDTH = 314;
	var HEIGHT = 314;

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

	this.drawOne = function(value) {
		// draw this single dice
		var xpos =  this.global_xpos + 5 + 110;
		var sprite = game.add.sprite(xpos, 128, getDiceName(value));
		sprite.width = 84;
		sprite.height = 84;
		this.dice.push(sprite);
	};

	this.drawTwo = function(dice1, dice2) {
		var xpos = this.global_xpos + 5 + 61;
		var sprite1 = game.add.sprite(xpos, 128, getDiceName(value));
		sprite1.width = 84;
		sprite1.height = 84;
		xpos += 84 + 14;
		var sprite2 = game.add.sprite(xpos, 128, getDiceName(value));
		sprite2.width = 84;
		sprite2.height = 84;
		this.dice.push(sprite1);
		this.dice.push(sprite2);
	};

	this.draw = function(player) {
		if(this.sprite == null) {
			this.createInitialSprite();
		}
		// redraw dice
		this.destroyDiceSprites();
		var xpos = 0;

		this.drawOne(player.dice[0]);

		//for(var i of player.dice) {
		//	game.add.sprite(xpos, 0, getDiceName(i));
		//	xpos += 128;
		//}

		this.background.x = this.global_xpos;
		this.background.y = 0;
	};

	this.global_xpos = location * 320;
	this.color = color;
	this.background = null;
	this.dice = [];
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
		// match model to display
		for(var i = 0; i < this.model.players.length; i++) {
			this.player_display[i].draw(this.model.players[i]);
		}
	};

	this.model = new LiarModel(consts.STARTING_PLAYERS);
	this.player_display = [];
	var colors = ['#ff0000', '#00ff00', '#0000ff', '#aaaa00'];
	for(var i = 0; i < colors.length; i++) {
		this.player_display.push(new PlayerDisplay(i, colors[i]));
	}
};

var game = new Phaser.Game(consts.WIDTH, consts.HEIGHT, Phaser.CANVAS, "Liar;s Dice");
game.state.add('Game', new Game());
game.state.start('Game');
