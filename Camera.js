var Camera = {
    init: function()
    {
        this.cursors = game.input.keyboard.createCursorKeys();
        game.debug.cameraInfo(game.camera, 32, 32);
    },

    update: function()
    {
        if (this.cursors.up.isDown)
        {
            game.camera.y -= 4;
        }
        else if (this.cursors.down.isDown)
        {
            game.camera.y += 4;
        }

        if (this.cursors.left.isDown)
        {
            game.camera.x -= 4;
        }
        else if (this.cursors.right.isDown)
        {
            game.camera.x += 4;
        }
    }
}