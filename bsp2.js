//Constants
var TILE_SIZE = 32;
var WIDTH_RATIO = 0.45;
var HEIGHT_RATIO = 0.45;
var ITERATIONS = 4;
var mainRoom = undefined;
var levelArr = [];
var map;

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
		//console.log("bsp2.js - init("+levelWidth+", "+levelHeight+")");
		this.levelWidth = levelWidth;
		this.levelHeight = levelHeight;

		this.tilesPerRow = levelWidth/TILE_SIZE;
		this.tilesPerColumn = levelHeight/TILE_SIZE;
		//console.log("    tilesPerRow: "+this.tilesPerRow+", tilesPerColumn: "+this.tilesPerColumn);

		mainRoom = new RoomContainer(0, 0, this.levelWidth, this.levelHeight);

		levelArr = new Array(this.tilesPerColumn);
		for(var i = 0; i < this.tilesPerColumn; i++)
		{
			levelArr[i] = new Array(this.tilesPerColumn);
		}

		for(var c = 0; c < this.tilesPerColumn; c++)
		{
			for(var r = 0; r < this.tilesPerRow; r++)
			{
				levelArr[c][r] = 0;
			}
		}

		//console.log(levelArr.toString());
	},

	preload: function()
	{
		//console.log("bsp2.js - preload()");
		game.load.image('img_leveltiles_test', 'leveltiles_test.png');
	},

	create: function()
	{
		//console.log("bsp2.js - create()");
		game.add.sprite(0, 0, 'bg_background');

		Camera.init();

		this.roomTree = splitRoom(mainRoom, ITERATIONS);
		this.growRooms();

		//this.drawGrid();
		//this.drawPartitions();
		this.drawRooms();

		//console.log(levelArr.toString());

		this.drawTiles();
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
	},

	drawTiles: function()
	{
		console.log("drawTiles()");
		/*
		console.log(levelArr.toString());
		//game.load.tilemap('tilemap', null, [levelArr.toString()], Phaser.Tilemap.TILED_JSON);
		game.load.tilemap('tilemap', null, levelArr.toString(), Phaser.Tilemap.CSV);
		console.log("adding tilemap");
		map = game.add.tilemap('tilemap');//, TILE_SIZE, TILE_SIZE, this.levelWidth/TILE_SIZE, this.levelHeight/TILE_SIZE);
		console.log("adding tileset image");
		var layer = map.createBlankLayer('tileimage');
		map.addTilesetImage('tileimage', 'img_leveltiles_test', TILE_SIZE, TILE_SIZE);
		console.log("calling create");
		map.create('firstlevel', this.levelWidth/TILE_SIZE, this.levelHeight/TILE_SIZE, TILE_SIZE, TILE_SIZE);

		console.log("tiles rendered");
		//debugger;
		*/

		var levelStr = levelArr.toString();
		levelStr = levelStr.replace(/(\S{128})/g,"$1");
		levelStr = levelStr.replace(/(\S{128})/g,"$1\n");
		levelStr = levelStr.replace(/\n$/,"");

		console.log(levelStr);

		// var parsed = Phaser.TilemapParser.parseCSV(levelStr, TILE_SIZE, TILE_SIZE);
		// game.cache.addTilemap('test', parsed);
		// map.addTilesetImage('tileimage', 'img_leveltiles_test', TILE_SIZE, TILE_SIZE);
		// map.create('firstlevel', this.levelWidth/TILE_SIZE, this.levelHeight/TILE_SIZE, TILE_SIZE, TILE_SIZE);
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
		//console.log("Room.paint() - drawing "+this.w+" x "+this.h+" room at "+this.x+", "+this.y);
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
		var x, y, w, h, padX, padY, sizeX, sizeY, randWOne, randHOne, tileX, tileY, tileW, tileH;

		//console.log("growRoom() - this x: "+this.x+", y: "+this.y+", w: "+this.w+", h: "+this.h);
		//rooms given random padding
		padX = random(1, 3) * TILE_SIZE; //using 1 instead of 0 because we don't want walls to touch
		padY = random(1, 3) * TILE_SIZE;
		//console.log("padX: "+padX+", padY: "+padY);
		x = this.x + padX;
		y = this.y + padY;
		//console.log("x: "+x+", y: "+y);
		w = this.w - (x - this.x);
		h = this.h - (y - this.y);
		//console.log("this.w - (x - this.x): "+w);
		//console.log("this.h - (y - this.y): "+h);
		sizeX = random(1, 3) * TILE_SIZE;
		sizeY = random(1, 3) * TILE_SIZE;
		w -= sizeX;
		h -= sizeY;
		//console.log("sizeX: "+sizeX+", sizeY: "+sizeY+", w: "+w+", h: "+h);

		//update level array
		tileX = (x/TILE_SIZE)-1;
		tileY = (y/TILE_SIZE)-1;
		tileW = (w/TILE_SIZE)+tileX;
		tileH = (h/TILE_SIZE)+tileY;
		//console.log("tileX: "+tileX+", tileY: "+tileY+", tileW: "+tileW+", tileH: "+tileH);
		for(var c = tileY; c < tileH; c++)
		{
			//console.log("c: "+c+", h: "+(h/TILE_SIZE));
			for(var r = tileX; r < tileW; r++)
			{
				//console.log("r: "+r+", w: "+(w/TILE_SIZE));
				levelArr[c][r] = 1;
				//console.log("levelArr["+c+"]["+r+"]: "+levelArr[c][r]);
			}
		}

		this.room = new Room(x, y, w, h);
		//console.log("---------------------------------------------------------");
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

	//console.log("SPLIT "+iteration+": room x: "+room.x+", y: "+room.y+", w: "+room.w+", h: "+room.h);
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
	var roomOne, roomTwo, randOne, randTwo;

	if(random(0, 1) == 0)
	{
		//Vertical
		randOne = random(1, (room.w/TILE_SIZE));
		roomOne = new RoomContainer(
			room.x, 			//roomOne.x
			room.y, 			//roomOne.y
			randOne*TILE_SIZE, 	//roomOne.w
			room.h 				//roomOne.h
		);

		roomTwo = new RoomContainer(
			room.x + roomOne.w, //roomTwo.x
			room.y, 			//roomTwo.y
			room.w - roomOne.w, //roomTwo.w
			room.h 				//roomTwo.h
		);
		// console.log("randomSplit() vertical");
		// console.log("    room One x: "+room.x+", y: "+room.y+", w: "+(randOne*TILE_SIZE)+", h: "+room.h);
		// console.log("    randOne: "+randOne+", w % TILE_SIZE: "+(randOne*TILE_SIZE)%TILE_SIZE);
		// console.log("    room Two x: "+(room.x + roomOne.w)+", y: "+room.y+", w: "+(room.w - roomOne.w)+", h: "+room.h);

		var roomOneWidthRatio = roomOne.w / roomOne.h;
		var roomTwoWidthRatio = roomTwo.w / roomTwo.h;

		if(roomOneWidthRatio < WIDTH_RATIO || roomTwoWidthRatio < WIDTH_RATIO)
		{
			return randomSplit(room);
		}
	}else{
		//Horizontal
		randTwo = random(1, (room.h/TILE_SIZE));
		roomOne = new RoomContainer(
			room.x, 			//roomOne.x
			room.y, 			//roomOne.y
			room.w, 			//roomOne.w
			randTwo*TILE_SIZE	//roomOne.h
		);

		roomTwo = new RoomContainer(
			room.x, 			//roomTwo.x
			room.y + roomOne.h, //roomTwo.y
			room.w, 			//roomTwo.w
			room.h - roomOne.h 	//roomTwo.h
		);
		// console.log("randomSplit() horizontal");
		// console.log("    room One x: "+room.x+", y: "+room.y+", w: "+room.w+", h: "+(randTwo*TILE_SIZE));
		// console.log("    randTwo: "+randTwo+", h % TILE_SIZE: "+(randTwo*TILE_SIZE)%TILE_SIZE);
		// console.log("    room Two x: "+room.x+", y: "+(room.y + roomOne.h)+", w: "+room.w+", h: "+(room.h - roomOne.h));

		var roomOneHeightRatio = roomOne.h / roomOne.w;
		var roomTwoHeightRatio = roomTwo.h / roomTwo.w;

		if(roomOneHeightRatio < HEIGHT_RATIO || roomTwoHeightRatio < HEIGHT_RATIO)
		{
			return randomSplit(room);
		}
	}

	return [roomOne, roomTwo];
};