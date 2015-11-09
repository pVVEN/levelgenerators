var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');
var Main = function () {};

Main.prototype = {
	preload: function ()
	{
		game.load.image('bg_background', 'background.png');
		game.load.image('img_leveltiles', 'leveltiles.png');
		game.load.script('Camera', 'Camera.js');
		game.load.script('BSP', 'binaryspacepartition.js');
	},

	create: function ()
	{
		game.add.sprite(0, 0, 'bg_background');
		game.world.setBounds(0, 0, 2048, 2048);
		Camera.init();

		game.state.add('BSP', BSP);
		game.state.start('BSP');
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

game.state.add('Main', Main);
game.state.start('Main');