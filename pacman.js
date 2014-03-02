
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
    this._mazelines = mazelines; // lines on which the pacman center can move
    this._mazerects = [];        // rectangles that perfectly wrap the pacman on lines
    
    for(var i=0; i<this._mazelines.length; i++)
    {
        var rect = {x: 0, y: 0, w: 0, h: 0};
        
        if (this._mazelines[i].direction === Direction.DOWN)
        {
            rect.x = this._mazelines[i].xstart - PACMAN_RADIUS;
            rect.y = this._mazelines[i].ystart - PACMAN_RADIUS;
            rect.w = 2 * PACMAN_RADIUS;
            rect.h = this._mazelines[i].len + 2 * PACMAN_RADIUS;
        }
        if (this._mazelines[i].direction === Direction.RIGHT)
        {
            rect.x = this._mazelines[i].xstart - PACMAN_RADIUS;
            rect.y = this._mazelines[i].ystart - PACMAN_RADIUS;
            rect.w = this._mazelines[i].len + 2 * PACMAN_RADIUS;
            rect.h = 2 * PACMAN_RADIUS;
        }
        if (this._mazelines[i].direction === Direction.UP)
        {
            rect.x = this._mazelines[i].xstart - PACMAN_RADIUS;
            rect.y = this._mazelines[i].ystart - this._mazelines[i].len - PACMAN_RADIUS;
            rect.w = 2 * PACMAN_RADIUS;
            rect.h = this._mazelines[i].len + 2 * PACMAN_RADIUS;
        }
        if (this._mazelines[i].direction === Direction.LEFT)
        {
            rect.x = this._mazelines[i].xstart - this._mazelines[i].len - PACMAN_RADIUS;
            rect.y = this._mazelines[i].ystart - PACMAN_RADIUS;
            rect.w = this._mazelines[i].len + 2 * PACMAN_RADIUS;
            rect.h = 2 * PACMAN_RADIUS;
        }
        
        this._mazerects[i] = rect;
    }
};

Map.prototype.getMazeLine = function(index)
{
    return this._mazelines[index];
};

Map.prototype.mazeLinesCount = function()
{
    return this._mazelines.length;
};

Map.prototype._drawMazeRects = function()
{
    context.fillStyle = "red";
    
    for(var i=0;i<this._mazerects.length;i++)
    {
        context.fillRect(this._mazerects[i].x,
                         this._mazerects[i].y,
                         this._mazerects[i].w,
                         this._mazerects[i].h);
    }
};

Map.prototype.draw = function()
{
    context.fillStyle = "black";
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    this._drawMazeRects();
    /* TODO
        dessine aussi le reste de la map, qui est statique (donc pas les pacman, ghost, bouboules...) ; utiliser le pre-render du coup ? vu que ce sera toujours la même chose, inutile de refaire tous les dessins de la map
    */
};

/******************************** Pacman class ********************************/

var Pacman = function(xpos, ypos, direction)
{
    this._x = xpos;
    this._y = ypos;
    this._direction = direction;
    this._nextdirection = null;
    this._animtime = 0;
    this._mouthstartangle = 0;
    this._mouthendangle = 2 * Math.PI;
};

Pacman.prototype.setDirection = function(direction)
{
    this._direction = direction;
};

Pacman.prototype.draw = function()
{
    context.fillStyle = "yellow";
    context.beginPath();
    context.moveTo(this._x, this._y);
    /*
        if arc() has the same start and end angles (mouth shutted), nothing is
        done ; a little trick to have a circle in this case is to use the fact
        that angles are modulo(2*PI)
    */
    context.arc(this._x, this._y, PACMAN_RADIUS, this._mouthstartangle, this._mouthendangle);
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
    
    this._animtime = (this._animtime + elapsed) % (1000);
    
    if (this._direction === Direction.UP)
    {
        baseangle = 3*Math.PI/2;
    }
    if (this._direction === Direction.DOWN)
    {
        baseangle = Math.PI/2;
    }
    if (this._direction === Direction.LEFT)
    {
        baseangle = Math.PI;
    }
    if (this._direction === Direction.RIGHT)
    {
        baseangle = 0;
    }
    
    if (this._animtime < 500)
    {
        mouthhalfangle = 6/10 * this._animtime/500;
    }
    else
    {
        mouthhalfangle = 6/10 * (1000-this._animtime)/500;
    }
    
    this._mouthstartangle = baseangle + mouthhalfangle;
    this._mouthendangle = baseangle - mouthhalfangle;
};

Pacman.prototype.move = function(elapsed)
{
    /*
        fixed speed : 100 px/s
    */
    var movement = Math.round(100 * elapsed/1000);
    
    var xmax = 0;
    var ymax = 0;
    var line = null;
    
    if (this._direction === Direction.UP)
    {
        for(var i=0; i<map.mazeLinesCount(); i++)
        {
            line = map.getMazeLine(i);
            
            if ((line.direction == Direction.UP || line.direction == Direction.DOWN)
             && line.xstart === this._x)
            {
                if (line.direction == Direction.UP)
                {
                    ymax = line.ystart - line.len;
                }
                else
                {
                    ymax = line.ystart;
                }
                
                this._y = (this._y-movement > ymax) ? this._y-movement : ymax ;
                
                break;
            }
        }
    }
    if (this._direction === Direction.DOWN)
    {
        for(var i=0; i<map.mazeLinesCount(); i++)
        {
            line = map.getMazeLine(i);
            
            if ((line.direction == Direction.UP || line.direction == Direction.DOWN)
             && line.xstart === this._x)
            {
                if (line.direction == Direction.UP)
                {
                    ymax = line.ystart;
                }
                else
                {
                    ymax = line.ystart + line.len;
                }
                
                this._y = (this._y+movement < ymax) ? this._y+movement : ymax ;
                
                break;
            }
        }
    }
    if (this._direction === Direction.LEFT)
    {
        for(var i=0; i<map.mazeLinesCount(); i++)
        {
            line = map.getMazeLine(i);
            
            if ((line.direction == Direction.LEFT || line.direction == Direction.RIGHT)
             && line.ystart === this._y)
            {
                if (line.direction == Direction.LEFT)
                {
                    xmax = line.xstart - line.len;
                }
                else
                {
                    xmax = line.xstart;
                }
                
                this._x = (this._x-movement > xmax) ? this._x-movement : xmax ;
                
                break;
            }
        }
    }
    if (this._direction === Direction.RIGHT)
    {
        for(var i=0; i<map.mazeLinesCount(); i++)
        {
            line = map.getMazeLine(i);
            
            if ((line.direction == Direction.LEFT || line.direction == Direction.RIGHT)
             && line.ystart === this._y)
            {
                if (line.direction == Direction.LEFT)
                {
                    xmax = line.xstart;
                }
                else
                {
                    xmax = line.xstart + line.len;
                }
                
                this._x = (this._x+movement < xmax) ? this._x+movement : xmax ;
                
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
            pacman.setDirection(Direction.LEFT);
        }
        else if (performance.now() > 2500)
        {
            pacman.setDirection(Direction.RIGHT);
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























