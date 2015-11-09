var Camera = function()
{
	"use strict";
	//init
	var cursors = game.input.keyboard.createCursorKeys();
	game.debug.cameraInfo(game.camera, 32, 32);
};

Camera.prototype = Object.create();
Camera.prototype.constructor = Camera;

Camera.prototype.update = function()
{
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
};