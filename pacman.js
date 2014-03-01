
/********************* global variables and enumerations **********************/

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

/******************************** Pacman class ********************************/

var Pacman = function(xpos, ypos, direction)
{
    this.x = xpos;
    this.y = ypos;
    this.direction = direction;
    this.nextdirection = null;
    this.animtime = 0;
    this.mouthstartangle = 0;
    this.mouthendangle = 2 * Math.PI;
};

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
    var movement = 100 * elapsed/1000;
    
    if (this.direction === MovementDirection.UP)
    {
        this.y -= movement;
    }
    if (this.direction === MovementDirection.DOWN)
    {
        this.y += movement;
    }
    if (this.direction === MovementDirection.LEFT)
    {
        this.x -= movement;
    }
    if (this.direction === MovementDirection.RIGHT)
    {
        this.x += movement;
    }
};

/******************************* game functions *******************************/

var drawWorld = function()
{
    //TODO
};

/**************************** game loop functions *****************************/

var updateGraphics = function()
{
    context.fillStyle = "blue";
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    
    pacman.draw();
    
    requestAnimationFrame(updateGraphics);
};

var updateLogic = function()
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
    else if (performance.now() > 2500)
    {
        pacman.direction = MovementDirection.DOWN;
    }
    
    pacman.animate(elapsed);
    pacman.move(elapsed);
    
    setTimeout(updateLogic, 1000/60);
};



/* TODO
    - utiliser getImageData() et putImageData() pour les boutons ingame et les
    faire changer de couleur/forme, ou simplement redessiner si ça pose pas de
    probleme de faire un fillrect() d'une zone un peu plus large
    - gerer perte de focus
    - one class pacman and one class ghost, the two inheriting a
    2DAnimatedObject class (containing a static method draw() called in
    updategraphics, and a static method update() called in updatelogic (update
    the position and the animation state), and x/y properties, ... and something
    to animate, like passing the timestamp ? or an other solution ?=> the static
    method update())
    - representation of the world : the "road" is a list of lines, each line
    represented by 2 points (x;y)
    - if we pressed a key for an other direction, change the nextdirection value, and then move() will later do :
        => if it's the opposite of the current direction, then this.direction =
        this.nextdirection; and this.nextdirection = null;
        => if it's a perpendicular direction, then move() will each time look if
        the distance (= the line), that has been covered during elapsed time,
        crossed an intersection with an other line in the requested direction :
        if no one, then continue like that, but if there is one, then
        this.direction = this.nextdirection; and this.nextdirection = null; and
        the pacman is positionned in the good place with the covered distance
    - use the '_' convention for private methods/properties
*/

var canvas = document.getElementById("gamecanvas");
canvas.width = 600;
canvas.height = 400;

context = canvas.getContext("2d");

/* init the game */

pacman = new Pacman(400, 200, MovementDirection.LEFT);

/* draw the world */

lastupdate = performance.now();
updateGraphics();

/* start the game */

setTimeout(updateLogic, 1000/60);
requestAnimationFrame(updateGraphics);











