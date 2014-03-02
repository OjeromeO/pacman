
/************** global variables, "constants", and enumerations ***************/

var Direction = {};
Object.defineProperties(Direction,
{
    "UP":  {value: 0, writable: false, configurable: false, enumerable: true},
    "DOWN":  {value: 1, writable: false, configurable: false, enumerable: true},
    "LEFT":  {value: 2, writable: false, configurable: false, enumerable: true},
    "RIGHT":  {value: 3, writable: false, configurable: false, enumerable: true}
});

var context = null;
var pacman = null;
var lastupdate = null;
var map = null;

var PACMAN_RADIUS = 30;
var LINE_WIDTH = 1.2 * 2 * PACMAN_RADIUS;
var MAZE_LINES = [
                 {xstart: 60, ystart: 80, direction: Direction.RIGHT, len: 420},
                 {xstart: 60, ystart: 80, direction: Direction.DOWN, len: 220},
                 {xstart: 60, ystart: 200, direction: Direction.RIGHT, len: 140}
                 ];

/********************************** Map class *********************************/

var Map = function(mazelines)
{
    //XXX should we clone the "mazelines" object instead of just referencing it ?
    this.mazelines = mazelines; // lines on which the pacman center can move
    this.mazerects = [];        // rectangles that perfectly wrap the pacman on lines
    
    for(var i=0; i<this.mazelines.length; i++)
    {
        var rect = {x: 0, y: 0, w: 0, h: 0};
        
        if (this.mazelines[i].direction === Direction.DOWN)
        {
            rect.x = this.mazelines[i].xstart - PACMAN_RADIUS;
            rect.y = this.mazelines[i].ystart - PACMAN_RADIUS;
            rect.w = 2 * PACMAN_RADIUS;
            rect.h = this.mazelines[i].len + 2 * PACMAN_RADIUS;
        }
        if (this.mazelines[i].direction === Direction.RIGHT)
        {
            rect.x = this.mazelines[i].xstart - PACMAN_RADIUS;
            rect.y = this.mazelines[i].ystart - PACMAN_RADIUS;
            rect.w = this.mazelines[i].len + 2 * PACMAN_RADIUS;
            rect.h = 2 * PACMAN_RADIUS;
        }
        if (this.mazelines[i].direction === Direction.UP)
        {
            rect.x = this.mazelines[i].xstart - PACMAN_RADIUS;
            rect.y = this.mazelines[i].ystart - this.mazelines[i].len - PACMAN_RADIUS;
            rect.w = 2 * PACMAN_RADIUS;
            rect.h = this.mazelines[i].len + 2 * PACMAN_RADIUS;
        }
        if (this.mazelines[i].direction === Direction.LEFT)
        {
            rect.x = this.mazelines[i].xstart - this.mazelines[i].len - PACMAN_RADIUS;
            rect.y = this.mazelines[i].ystart - PACMAN_RADIUS;
            rect.w = this.mazelines[i].len + 2 * PACMAN_RADIUS;
            rect.h = 2 * PACMAN_RADIUS;
        }
        
        this.mazerects[i] = rect;
    }
};

Map.prototype.drawMazeRects = function()
{
    context.fillStyle = "red";
    
    for(var i=0;i<this.mazerects.length;i++)
    {
        context.fillRect(this.mazerects[i].x,
                         this.mazerects[i].y,
                         this.mazerects[i].w,
                         this.mazerects[i].h);
    }
};

Map.prototype.draw = function()
{
    context.fillStyle = "black";
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    this.drawMazeRects();
    /* TODO
        dessine aussi le reste de la map, qui est statique (donc pas les pacman, ghost, bouboules...) ; utiliser le pre-render du coup ? vu que ce sera toujours la même chose, inutile de refaire tous les dessins de la map
    */
};

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
    context.arc(this.x, this.y, PACMAN_RADIUS, this.mouthstartangle, this.mouthendangle);
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
    
    if (this.direction === Direction.UP)
    {
        baseangle = 3*Math.PI/2;
    }
    if (this.direction === Direction.DOWN)
    {
        baseangle = Math.PI/2;
    }
    if (this.direction === Direction.LEFT)
    {
        baseangle = Math.PI;
    }
    if (this.direction === Direction.RIGHT)
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
    var movement = Math.round(100 * elapsed/1000);
    var xmax = this.x;
    var ymax = this.y;
    
    if (this.direction === Direction.UP)
    {
        for(var i=0; i<map.mazelines.length; i++)
        {
            if ((map.mazelines[i].direction == Direction.UP
              || map.mazelines[i].direction == Direction.DOWN)
             && map.mazelines[i].xstart === this.x)
            {
                if (map.mazelines[i].direction == Direction.UP)
                {
                    ymax = map.mazelines[i].ystart - map.mazelines[i].len;
                }
                else
                {
                    ymax = map.mazelines[i].ystart;
                }
                
                this.y = (this.y-movement > ymax) ? this.y-movement : ymax ;
                
                break;
            }
        }
    }
    if (this.direction === Direction.DOWN)
    {
        for(var i=0; i<map.mazelines.length; i++)
        {
            if ((map.mazelines[i].direction == Direction.UP
              || map.mazelines[i].direction == Direction.DOWN)
             && map.mazelines[i].xstart === this.x)
            {
                if (map.mazelines[i].direction == Direction.UP)
                {
                    ymax = map.mazelines[i].ystart;
                }
                else
                {
                    ymax = map.mazelines[i].ystart + map.mazelines[i].len;
                }
                
                this.y = (this.y+movement < ymax) ? this.y+movement : ymax ;
                
                break;
            }
        }
    }
    if (this.direction === Direction.LEFT)
    {
        for(var i=0; i<map.mazelines.length; i++)
        {
            if ((map.mazelines[i].direction == Direction.LEFT
              || map.mazelines[i].direction == Direction.RIGHT)
             && map.mazelines[i].ystart === this.y)
            {
                if (map.mazelines[i].direction == Direction.LEFT)
                {
                    xmax = map.mazelines[i].xstart - map.mazelines[i].len;
                }
                else
                {
                    xmax = map.mazelines[i].xstart;
                }
                
                this.x = (this.x-movement > xmax) ? this.x-movement : xmax ;
                
                break;
            }
        }
    }
    if (this.direction === Direction.RIGHT)
    {
        for(var i=0; i<map.mazelines.length; i++)
        {
            if ((map.mazelines[i].direction == Direction.LEFT
              || map.mazelines[i].direction == Direction.RIGHT)
             && map.mazelines[i].ystart === this.y)
            {
                if (map.mazelines[i].direction == Direction.LEFT)
                {
                    xmax = map.mazelines[i].xstart;
                }
                else
                {
                    xmax = map.mazelines[i].xstart + map.mazelines[i].len;
                }
                
                this.x = (this.x+movement < xmax) ? this.x+movement : xmax ;
                
                break;
            }
        }
    }
};

/******************************* game functions *******************************/



/**************************** game loop functions *****************************/

var updateGraphics = function()
{
    map.draw();
    pacman.draw();
    
    requestAnimationFrame(updateGraphics);
};

var updateLogic = function()
{
    var newupdate = performance.now();
    var elapsed = newupdate - lastupdate;
    lastupdate = newupdate;
    
    /*XXX some tests */
    
        if (performance.now() > 7000)
        {
            pacman.direction = Direction.LEFT;
        }
        else if (performance.now() > 2500)
        {
            pacman.direction = Direction.RIGHT;
        }
    
    pacman.animate(elapsed);
    pacman.move(elapsed);
    
    setTimeout(updateLogic, 1000/60);
};



/* TODO
    - utiliser getImageData() et putImageData() pour les boutons ingame et les
    faire changer de couleur/forme, ou simplement redessiner si ça pose pas de
    probleme de faire un fillrect() d'une zone un peu plus large
    - manage focus loss (auto pause)
    - when refreshing, useless to redraw everything, just redraw what was under
    the pacman + ghosts
    - improve pacman graphics
    - one class pacman and one class ghost, the two inheriting a
    2DAnimatedObject class (containing a static method draw() called in
    updategraphics, and a static method update() called in updatelogic (update
    the position and the animation state), and x/y properties, ... and something
    to animate, like passing the timestamp ? or an other solution ?=> the static
    method update())
    - if we pressed a key for an other direction, change the nextdirection value,
    and then move() will later do :
        => if it's the opposite of the current direction, then this.direction =
        this.nextdirection; and this.nextdirection = null;
        => if it's a perpendicular direction, then move() will each time look if
        the distance (= the line), that has been covered during elapsed time,
        crossed an intersection with an other line in the requested direction :
        if no one, then continue like that, but if there is one, then
        this.direction = this.nextdirection; and this.nextdirection = null; and
        the pacman is positionned in the good place with the covered distance
    - use the '_' convention for private methods/properties
    - a Game class
*/

var canvas = document.getElementById("gamecanvas");
canvas.width = 600;
canvas.height = 400;

context = canvas.getContext("2d");

/* init the game */

pacman = new Pacman(60, 80, Direction.UP);
map = new Map(MAZE_LINES);

/* draw the world */

lastupdate = performance.now();
updateGraphics();

/* start the game */

setTimeout(updateLogic, 1000/60);
requestAnimationFrame(updateGraphics);























