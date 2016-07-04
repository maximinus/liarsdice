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

	this.drawSingleDice = function(xpos, ypos, value) {
		var sprite = game.add.sprite(xpos, ypos, getDiceName(value));
		sprite.width = 84;
		sprite.height = 84;
		this.dice.push(sprite);		
	};

	this.drawOne = function(ypos, dice1) {
		// draw this single dice
		this.drawSingleDice(this.global_xpos + 5 + 110, ypos, dice1);
	};

	this.drawTwo = function(ypos, dice1, dice2) {
		var xpos = this.global_xpos + 5 + 61;
		this.drawSingleDice(xpos, ypos, dice1);
		xpos += 84 + 14;
		this.drawSingleDice(xpos, ypos, dice2);
	};

	this.drawThree = function(ypos, dice1, dice2, dice3) {
		var xpos = this.global_xpos + 18;
		this.drawSingleDice(xpos, ypos, dice1);
		xpos += 84 + 13;
		this.drawSingleDice(xpos, ypos, dice2);
		xpos += 84 + 13;
		this.drawSingleDice(xpos, ypos, dice3);
	};

	this.draw = function(player) {
		if(this.sprite == null) {
			this.createInitialSprite();
		}
		// redraw dice
		this.destroyDiceSprites();
		var ypos = 66;
		this.drawThree(ypos, player.dice[0], player.dice[1], player.dice[2]);
		ypos += 84 + 13;
		this.drawTwo(ypos, player.dice[3], player.dice[4]);

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
