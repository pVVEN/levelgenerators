var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');
var Main = function () {};
//var cursors;

Main.prototype = {
	preload: function ()
	{
		game.load.image('bg_background', 'background.png');
		game.load.script('BSP', 'binaryspacepartition.js')	;
	},

	create: function ()
	{
		game.add.sprite(0, 0, 'bg_background');
		game.world.setBounds(0, 0, 2048, 2048);
		//cursors = game.input.keyboard.createCursorKeys();
	},

	update: function()
	{
		/*
		if (cursors.up.isDown)
	    {
	        game.camera.y -= 4;
	    }
	    else if (cursors.down.isDown)
	    {
	        game.camera.y += 4;
	    }

	    if (cursors.left.isDown)
	    {
	        game.camera.x -= 4;
	    }
	    else if (cursors.right.isDown)
	    {
	        game.camera.x += 4;
	    }
	    */
	},

	render: function()
	{
		//game.debug.cameraInfo(game.camera, 32, 32);
	}
};

game.state.add('Main', Main);
game.state.start('Main');