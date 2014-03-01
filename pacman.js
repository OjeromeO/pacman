
var context = null;
var pacman = null;
var lastupdate = null;



var MovementDirection = {};
Object.defineProperties(MovementDirection,
{
    "UP":  {value: 0, writable: false, configurable: false, enumerable: true},
    "DOWN":  {value: 1, writable: false, configurable: false, enumerable: true},
    "LEFT":  {value: 2, writable: false, configurable: false, enumerable: true},
    "RIGHT":  {value: 3, writable: false, configurable: false, enumerable: true}
});



function Pacman(xpos, ypos, direction)
{
    this.x = xpos;
    this.y = ypos;
    this.direction = direction;
    this.animtime = 0;
    this.mouthstartangle = 0;
    this.mouthendangle = 2 * Math.PI;
}

Pacman.prototype.draw = function()
{
    context.fillStyle = "yellow";
    context.beginPath();
    context.moveTo(this.x, this.y);
    /*
        if arc() has the same start and end angles (mouth shutted), nothing is
        done ; a little trick to have a circle in this case is to use the fact
        that angles are modulo(2*PI)
    */
    context.arc(this.x, this.y, 20, this.mouthstartangle, this.mouthendangle);
    context.fill();
};

Pacman.prototype.animate = function(elapsed)
{
    /*
        max half angle : 6/10 rad
        mouth animation speed : 2 * MAX_HALF_ANGLE rad/s
                                = opening/shutting mouth in 1 s
    */
    var mouthhalfangle = 0;
    var baseangle = 0;
    
    this.animtime = (this.animtime + elapsed) % (1000);
    
    if (this.direction === MovementDirection.UP)
    {
        baseangle = 3*Math.PI/2;
    }
    if (this.direction === MovementDirection.DOWN)
    {
        baseangle = Math.PI/2;
    }
    if (this.direction === MovementDirection.LEFT)
    {
        baseangle = Math.PI;
    }
    if (this.direction === MovementDirection.RIGHT)
    {
        baseangle = 0;
    }
    
    if (this.animtime < 500)
    {
        mouthhalfangle = 6/10 * this.animtime/500;
    }
    else
    {
        mouthhalfangle = 6/10 * (1000-this.animtime)/500;
    }
    
    this.mouthstartangle = baseangle + mouthhalfangle;
    this.mouthendangle = baseangle - mouthhalfangle;
};

Pacman.prototype.move = function(elapsed)
{
    /*
        fixed speed : 100 px/s
    */
    if (this.direction === MovementDirection.UP)
    {
        this.y -= 100 * elapsed/1000;
    }
    if (this.direction === MovementDirection.DOWN)
    {
        this.y += 100 * elapsed/1000;
    }
    if (this.direction === MovementDirection.LEFT)
    {
        this.x -= 100 * elapsed/1000;
    }
    if (this.direction === MovementDirection.RIGHT)
    {
        this.x += 100 * elapsed/1000;
    }
};



function updategraphics()
{
    context.fillStyle = "blue";
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    
    pacman.draw();
    
    requestAnimationFrame(updategraphics);
}

function updatelogic()
{
    var newupdate = performance.now();
    var elapsed = newupdate - lastupdate;
    lastupdate = newupdate;
    
    //XXX TEST
    if (performance.now() > 7000)
    {
        pacman.direction = MovementDirection.UP;
    }
    else if (performance.now() > 4000)
    {
        pacman.direction = MovementDirection.RIGHT;
    }
    else if (performance.now() > 3000)
    {
        pacman.direction = MovementDirection.DOWN;
    }
    
    pacman.animate(elapsed);
    pacman.move(elapsed);
    
    setTimeout(updatelogic, 1000/60);
}



/* TODO
- utiliser getImageData() et putImageData() pour les boutons ingame et les faire changer de couleur/forme, ou simplement redessiner si ça pose pas de probleme de faire un fillrect() d'une zone un peu plus large
- gerer perte de focus
- one class pacman and one class ghost, the two inheriting a 2DAnimatedObject class (containing a static method draw() called in updategraphics, and a static method update() called in updatelogic (update the position and the animation state), and x/y properties, ... and something to animate, like passing the timestamp ? or an other solution ?=> the static method update())
*/

var canvas = document.getElementById("gamecanvas");
canvas.width = 600;
canvas.height = 400;

context = canvas.getContext("2d");

/* init the game */

pacman = new Pacman(400, 200, MovementDirection.LEFT);

/* draw the world */

lastupdate = performance.now();
updategraphics();

/* start the game */

setTimeout(updatelogic, 1000/60);
requestAnimationFrame(updategraphics);











