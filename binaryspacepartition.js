var BSP = function (){};

BSP.prototype = {
	init: function()
	{
		console.log("binaryspacepartition.js - init()");
		//
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
};