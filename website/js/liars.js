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

function LiarsEngine(total_players) {
	this.rollAllDice = function() {
		for(var i of this.players) {
			i.rollDice(); }
	};

	this.players = [];
	for(var i=0; i<total_players; i++) {
		this.players.push(new Player());
	}
	this.rollAllDice();
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

	this.liars_engine = new LiarsEngine(consts.STARTING_PLAYERS);
};

var game = new Phaser.Game(consts.WIDTH, consts.HEIGHT, Phaser.CANVAS, "Liar;s Dice");
game.state.add('Game', new Game());
game.state.start('Game');
