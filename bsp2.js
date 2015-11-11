//Constants
var TILE_SIZE = 32;
var WIDTH_RATIO = 0.45;
var HEIGHT_RATIO = 0.45;
var ITERATIONS = 4;
var mainRoom = undefined;

var BSP2 = function (){
	this.levelWidth = 0;
	this.levelHeight = 0;
	this.tilesPerRow = 0;
	this.tilesPerColumn = 0;
	this.roomTree = undefined;
	this.rooms = [];
};

BSP2.prototype = {
	init: function(levelWidth, levelHeight)
	{
		console.log("bsp2.js - init("+levelWidth+", "+levelHeight+")");
		this.levelWidth = levelWidth;
		this.levelHeight = levelHeight;

		this.tilesPerRow = levelWidth/TILE_SIZE;
		this.tilesPerColumn = levelHeight/TILE_SIZE;
		console.log("    tilesPerRow: "+this.tilesPerRow+", tilesPerColumn: "+this.tilesPerColumn);

		mainRoom = new RoomContainer(0, 0, this.levelWidth, this.levelHeight);
	},

	preload: function()
	{
		console.log("bsp2.js - preload()");
		//
	},

	create: function()
	{
		console.log("bsp2.js - create()");
		game.add.sprite(0, 0, 'bg_background');

		//this.drawGrid();

		Camera.init();

		this.roomTree = splitRoom(mainRoom, ITERATIONS);
		this.growRooms();
		this.drawPartitions();
		this.drawRooms();
	},

	update: function()
	{
		Camera.update();
	},

	growRooms: function()
	{
		var leafs = this.roomTree.getLeaves();

		for(var i = 0; i < leafs.length; i++)
		{
			leafs[i].growRoom();
			this.rooms.push(leafs[i].room);
		}
	},

	drawGrid: function()
	{
		//draw grid
		var bmd_gridLine = game.add.bitmapData(this.levelWidth, this.levelHeight);
		for(var v = 0; v < this.tilesPerRow; v++)
		{
			bmd_gridLine.line(v*TILE_SIZE, 0, v*TILE_SIZE, this.levelHeight);
		}
		for(var h = 0; h < this.tilesPerColumn; h++)
		{
			bmd_gridLine.line(0, h*TILE_SIZE, this.levelWidth, h*TILE_SIZE);
		}
	    game.add.sprite(0, 0, bmd_gridLine);
	},

	drawPartitions: function()
	{
		this.roomTree.paint();
	},

	drawRooms: function()
	{
		for(var i = 0; i < this.rooms.length; i++)
		{
			this.rooms[i].paint();
		}
	}
};

//====================================================
//		TREE STUFF
//====================================================

var Tree = function(leaf)
{
	this.leaf = leaf;
	this.lChild = undefined;
	this.rChild = undefined;
};

Tree.prototype = {
	getLeaves: function()
	{
		if(this.lChild === undefined && this.rChild === undefined)
		{
			return [this.leaf];
		}else{
			return [].concat(this.lChild.getLeaves(), this.rChild.getLeaves());
		}
	},

	getLevel: function(level, queue)
	{
		if(queue === undefined)
		{
			queue = [];
		}

		if(level == 1)
		{
			queue.push(this);
		}else{
			if(this.lChild !== undefined)
			{
				this.lChild.getLevel(level-1, queue);
			}

			if(this.rChild !== undefined)
			{
				this.rChild.getLevel(level-1, queue);
			}
		}

		return queue;
	},

	paint: function()
	{
		this.leaf.paint();

		if(this.lChild !== undefined)
		{
			this.lChild.paint();
		}

		if(this.rChild !== undefined)
		{
			this.rChild.paint();
		}
	}
}

//====================================================
//		ROOM STUFF
//====================================================

var Room = function(x, y, w, h)
{
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.center = new Point(this.x + this.w/2, this.y + this.h/2);
};

Room.prototype = {
	paint: function()
	{
		console.log("Room.paint() - drawing "+this.w+" x "+this.h+" room at "+this.x+", "+this.y);
		var bmd_blueBorder = game.add.bitmapData(this.w, this.h);
		bmd_blueBorder.rect(0, 0, this.w, this.h);
		bmd_blueBorder.fill(0, 102, 255);
		bmd_blueBorder.clear(1, 1, this.w-2, this.h-2);
		game.add.sprite(this.x, this.y, bmd_blueBorder);
	}
};

//====================================================
//		ROOM CONTAINER STUFF
//====================================================

var RoomContainer = function(x, y, w, h)
{
	BSP2.call(this, x, y, w, h);
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.room = undefined;
};

RoomContainer.prototype = {
	growRoom: function()
	{
		var x, y, w, h;

		x = this.x + random(1, Math.floor(this.w/3)); //using 1 instead of 0 because we don't want walls to touch
		y = this.y + random(1, Math.floor(this.h/3));
		w = this.w - (x - this.x);
		h = this.h - (y - this.y);
		w -= random(1, w/3);
		h -= random(1, h/3);

		this.room = new Room(x, y, w, h);
	},

	paint: function()
	{
		//console.log("RoomContainer.paint() - drawing "+this.w+" x "+this.h+" room at "+this.x+", "+this.y);
		var bmd_greenBorder = game.add.bitmapData(this.w, this.h);
		bmd_greenBorder.rect(0, 0, this.w, this.h);
		bmd_greenBorder.fill(51, 204, 51);
		bmd_greenBorder.clear(1, 1, this.w-2, this.h-2);
		game.add.sprite(this.x, this.y, bmd_greenBorder);
	}
};

//====================================================
//		FUNCTIONS
//====================================================

var Point = function(x, y)
{
    this.x = x;
    this.y = y;
};

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

function splitRoom(room, iteration)
{
	var root = new Tree(room);

	if(iteration != 0)
	{
		var split = randomSplit(room);
		root.lChild = splitRoom(split[0], iteration-1);
		root.rChild = splitRoom(split[1], iteration-1);
	}

	return root;
};

function randomSplit(room)
{
	var roomOne, roomTwo;

	if(random(0, 1) == 0)
	{
		//Vertical
		roomOne = new RoomContainer(
			room.x, 			//roomOne.x
			room.y, 			//roomOne.y
			random(1, room.w), 	//roomOne.w
			room.h 				//roomOne.h
		);

		roomTwo = new RoomContainer(
			room.x + roomOne.w, //roomTwo.x
			room.y, 			//roomTwo.y
			room.w - roomOne.w, //roomTwo.w
			room.h 				//roomTwo.h
		);

		var roomOneWidthRatio = roomOne.w / roomOne.h;
		var roomTwoWidthRatio = roomTwo.w / roomTwo.h;

		if(roomOneWidthRatio < WIDTH_RATIO || roomTwoWidthRatio < WIDTH_RATIO)
		{
			return randomSplit(room);
		}
	}else{
		//Horizontal
		roomOne = new RoomContainer(
			room.x, 			//roomOne.x
			room.y, 			//roomOne.y
			room.w, 			//roomOne.w
			random(1, room.h)	//roomOne.h
		);

		roomTwo = new RoomContainer(
			room.x, 			//roomTwo.x
			room.y + roomOne.h, //roomTwo.y
			room.w, 			//roomTwo.w
			room.h - roomOne.h 	//roomTwo.h
		);

		var roomOneHeightRatio = roomOne.h / roomOne.w;
		var roomTwoHeightRatio = roomTwo.h / roomTwo.w;

		if(roomOneHeightRatio < HEIGHT_RATIO || roomTwoHeightRatio < HEIGHT_RATIO)
		{
			return randomSplit(room);
		}
	}

	return [roomOne, roomTwo];
};