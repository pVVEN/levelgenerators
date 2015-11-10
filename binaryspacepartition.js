var BSP = function (){};
var levelArr = [];
var numTilesWidth = 0;
var numTilesHeight = 0;
var tileSize = 32;
var minWidth = 12;
var minHeight = 12;

BSP.prototype = {
	init: function(levelWidth, levelHeight)
	{
		console.log("binaryspacepartition.js - init("+levelWidth+", "+levelHeight+")");
		numTilesWidth = (levelWidth/tileSize);
		numTilesHeight = (levelHeight/tileSize);
		console.log("numTilesWidth: "+numTilesWidth+", numTilesHeight: "+numTilesHeight);

		levelArr = new Array(numTilesHeight);
		for(var i = 0; i < numTilesHeight; i++)
		{
			levelArr[i] = new Array(numTilesWidth);
		}

		for(var c = 0; c < numTilesHeight; c++)
		{
			for(var r = 0; r < numTilesWidth; r++)
			{
				levelArr[c][r] = 0;
			}
		}
	},
	preload: function()
	{
		console.log("binaryspacepartition.js - preload()");
		//
	},

	create: function()
	{
		console.log("binaryspacepartition.js - create()");
		game.add.sprite(0, 0, 'bg_background');
		Camera.init();

		buildLevel();
		placeTiles();
		console.log(levelArr.toString());
	},

	update: function()
	{
		Camera.update();
	},

	render: function()
	{
		//
	}
};

function buildLevel()
{
	//
	console.log("binaryspacepartition.js - buildLevel()");

	cutVertical(0, 0, numTilesWidth, numTilesHeight);
};

function cutVertical(tileStartX, tileStartY, areaWidth, areaHeight)
{
	console.log("cutVertical("+tileStartX+", "+tileStartY+", "+areaWidth+", "+areaHeight+")");

	//-----------------------------------------------------------------
	//|tileStartX              splitX|splitX+1               areaWidth|
	//|tileStartY          tileStartY|tileStartY            tileStartY|
	//|                              |                                |
	//|                              |                                |
	//|                              |                                |
	//|                              |                                |
	//|                              |                                |
	//|                              |                                |
	//|                              |                                |
	//|                              |                                |
	//|tileStartX              splitX|splitX+1               areaWidth|
	//|areaHeight          areaHeight|areaHeight            areaHeight|
	//-----------------------------------------------------------------

	var splitX = randomValueBetweenNumbers(tileStartX, areaWidth);
	if(splitX < minWidth)
	{
		var temp = minWidth - splitX;
		splitX += temp;
	}
	var leftWidth = splitX - tileStartX;
	var rightWidth = areaWidth - (splitX + 1);
	console.log("areaHeight: "+areaHeight+", leftWidth: "+leftWidth+", rightWidth: "+rightWidth);

	//check height
	if(areaHeight >= minHeight)
	{
		cutHorizontal(tileStartX, tileStartY, leftWidth, areaHeight);
		cutHorizontal(splitX+1, tileStartY, rightWidth, areaHeight);
	}else{
		//check left side width
		if(leftWidth >= minWidth)
		{
			//cutVertical(tileStartX, tileStartY, leftWidth, areaHeight);
		//}else{
			//build room in left side
			plotRoom(tileStartX, tileStartY, leftWidth, areaHeight);
		}

		//check right side width
		if(rightWidth >= minWidth)
		{
			//cutVertical(tileStartX, tileStartY, rightWidth, areaHeight);
		//}else{
			//build room in right side
			plotRoom(tileStartX, tileStartY, rightWidth, areaHeight);
		}
	}
};

function cutHorizontal(tileStartX, tileStartY, areaWidth, areaHeight)
{
	console.log("cutHorizontal("+tileStartX+", "+tileStartY+", "+areaWidth+", "+areaHeight+")");

	//-----------------------------------------------------------------
	//|tileStartX                                            areaWidth|
	//|tileStartY                                           tileStartY|
	//|                                                               |
	//|                                                               |
	//|                                                               |
	//|                                                               |
	//|tileStartX                                            areaWidth|
	//|splitY                                                   splitY|
	//|---------------------------------------------------------------|
	//|tileStartX                                            areaWidth|
	//|splitY+1                                               splitY+1|
	//|                                                               |
	//|                                                               |
	//|                                                               |
	//|                                                               |
	//|tileStartX                                            areaWidth|
	//|areaHeight                                           areaHeight|
	//-----------------------------------------------------------------

	var splitY = randomValueBetweenNumbers(tileStartY, areaHeight);
	if(splitY < minHeight)
	{
		var temp = minHeight - splitY;
		splitY += temp;
	}
	var topHeight = splitY - tileStartY;
	var bottomHeight = areaHeight - (splitY + 1);
	console.log("areaWidth: "+areaWidth+", topHeight: "+topHeight+", bottomHeight: "+bottomHeight);

	//check width
	if(areaWidth >= minWidth)
	{
		cutVertical(tileStartX, tileStartY, areaWidth, topHeight);
		cutVertical(tileStartX, topHeight+1, areaWidth, bottomHeight)
	}else{
		//check top side height
		if(topHeight >= minHeight)
		{
			//cutHorizontal(tileStartX, tileStartY, areaWidth, topHeight);
		//}else{
			//build room in top side
			plotRoom(tileStartX, tileStartY, areaWidth, topHeight);
		}

		//check bottom side height
		if(bottomHeight >= minHeight)
		{
			//cutHorizontal(tileStartX, tileStartY, areaWidth, bottomHeight);
		//}else{
			//build room in top side
			plotRoom(tileStartX, tileStartY, areaWidth, bottomHeight);
		}
	}
};

function plotRoom(tileStartX, tileStartY, areaWidth, areaHeight)
{
	console.log("plotRoom("+tileStartX+", "+tileStartY+", "+areaWidth+", "+areaHeight+")");
	var cornerStartX = tileStartX > 0 ? tileStartX : tileStartX + 1;
	var cornerStartY = tileStartY > 0 ? tileStartY : tileStartY + 1;
	//think of a way to randomize start location within area
	var newWidth = randomValueBetweenNumbers(cornerStartX, areaWidth-1);
	var newHeight = randomValueBetweenNumbers(cornerStartY, areaHeight-1);
	//make sure width and height are at least 1 less than level width and level height

	for(var c = cornerStartY; c < newHeight; c++)
	{
		for(var r = cornerStartX; r < newWidth; r++)
		{
			levelArr[c][r] = 1;
		}
	}
};

function placeTiles()
{
	// for(var c = 0; c < numTilesHeight; c++)
	// {
	// 	for(var r = 0; r < numTilesWidth; r++)
	// 	{
	// 		levelArr[c][r] = 0;
	// 	}
	// }
};

function randomValueBetweenNumbers(min,max)
{
	// console.log("min: "+min+", max: "+max);
	// console.log("result: "+Math.floor(Math.random()*(max-min+1)+min));
    return Math.floor(Math.random()*(max-min+1)+min);
};