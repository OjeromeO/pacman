
/************** global variables, "constants", and enumerations ***************/

var Direction = {};
Object.defineProperties(Direction,
{
    "UP":  {value: 1, writable: false, configurable: false, enumerable: true},
    "DOWN":  {value: 2, writable: false, configurable: false, enumerable: true},
    "LEFT":  {value: 3, writable: false, configurable: false, enumerable: true},
    "RIGHT":  {value: 4, writable: false, configurable: false, enumerable: true}
});

var context = null;
var pacman = null;
var lastupdate = null;
var map = null;
var pressedkeys = [];
var pause = false;

var LOGIC_REFRESH_RATE = 60;

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
    //XXX   should we clone the "mazelines" object instead of just referencing it ?
    //TODO  check if lines don't overlap with one another => if overlap, create
    //      a new one containing the two lines overlapping
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
        else if (this._mazelines[i].direction === Direction.RIGHT)
        {
            rect.x = this._mazelines[i].xstart - PACMAN_RADIUS;
            rect.y = this._mazelines[i].ystart - PACMAN_RADIUS;
            rect.w = this._mazelines[i].len + 2 * PACMAN_RADIUS;
            rect.h = 2 * PACMAN_RADIUS;
        }
        else if (this._mazelines[i].direction === Direction.UP)
        {
            rect.x = this._mazelines[i].xstart - PACMAN_RADIUS;
            rect.y = this._mazelines[i].ystart - this._mazelines[i].len - PACMAN_RADIUS;
            rect.w = 2 * PACMAN_RADIUS;
            rect.h = this._mazelines[i].len + 2 * PACMAN_RADIUS;
        }
        else if (this._mazelines[i].direction === Direction.LEFT)
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
    if (index >= 0 && index < this._mazelines.length)
    {
        return this._mazelines[index];
    }
};

Map.prototype.mazeLinesCount = function()
{
    return this._mazelines.length;
};

Map.prototype.mazeCurrentLine = function(x, y, direction)
{
    if (direction !== Direction.UP
     && direction !== Direction.DOWN
     && direction !== Direction.RIGHT
     && direction !== Direction.LEFT
     && typeof x !== "number"
     && typeof y !== "number")
    {
        return;
    }
    
    var line = null;
    var min = 0;
    var max = 0;
    
    if (direction === Direction.UP
     || direction === Direction.DOWN)
    {
        for(var i=0; i<this._mazelines.length; i++)
        {
            line = this._mazelines[i];
            
            if ((line.direction === Direction.UP
              || line.direction === Direction.DOWN)
             && line.xstart === x)
            {
                min = (line.direction === Direction.UP) ? line.ystart - line.len : line.ystart ;
                max = (line.direction === Direction.UP) ? line.ystart : line.ystart + line.len ;
                
                if (y >= min && y <= max)
                {
                    return line;
                }
            }
        }
    }
    
    if (direction === Direction.RIGHT
     || direction === Direction.LEFT)
    {
        for(var i=0; i<this._mazelines.length; i++)
        {
            line = this._mazelines[i];
            
            if ((line.direction === Direction.RIGHT
              || line.direction === Direction.LEFT)
             && line.ystart === y)
            {
                min = (line.direction === Direction.RIGHT) ? line.xstart : line.xstart - line.len ;
                max = (line.direction === Direction.RIGHT) ? line.xstart + line.len : line.xstart ;
                
                if (x >= min && x <= max)
                {
                    return line;
                }
            }
        }
    }
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
    this._x = (typeof xpos === "number") ? xpos : 42 ;
    this._y = (typeof ypos === "number") ? ypos : 42 ;
    
    if (direction === Direction.UP
     || direction === Direction.DOWN
     || direction === Direction.RIGHT
     || direction === Direction.LEFT)
    {
        this._direction = direction;
    }
    else
    {
        this._direction = Direction.UP;
    }
    
    this._nextdirection = null;
    this._animtime = 0;
    this._mouthstartangle = 0;
    this._mouthendangle = 2 * Math.PI;
};

Pacman.prototype.setDirection = function(direction)
{
    if (direction === Direction.UP
     || direction === Direction.DOWN
     || direction === Direction.RIGHT
     || direction === Direction.LEFT)
    {
        this._direction = direction;
    }
};

Pacman.prototype.setNextDirection = function(nextdirection)
{
    if (nextdirection === Direction.UP
     || nextdirection === Direction.DOWN
     || nextdirection === Direction.RIGHT
     || nextdirection === Direction.LEFT)
    {
        this._nextdirection = nextdirection;
    }
};

Pacman.prototype.changeDirection = function(direction)
{
    if (direction === Direction.UP
     || direction === Direction.DOWN)
    {
        if (this._direction === Direction.UP
         || this._direction === Direction.DOWN)
        {
            this._direction = direction;
        }
        else
        {
            this._nextdirection = direction;
        }
    }
    else if (direction === Direction.RIGHT
          || direction === Direction.LEFT)
    {
        if (this._direction === Direction.RIGHT
         || this._direction === Direction.LEFT)
        {
            this._direction = direction;
        }
        else
        {
            this._nextdirection = direction;
        }
    }
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
    if (!(elapsed > 0))
    {
        return;
    }
    
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
    else if (this._direction === Direction.DOWN)
    {
        baseangle = Math.PI/2;
    }
    else if (this._direction === Direction.LEFT)
    {
        baseangle = Math.PI;
    }
    else if (this._direction === Direction.RIGHT)
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
    if (!(elapsed > 0))
    {
        return;
    }
    
    var xlimit = 0;
    var ylimit = 0;
    
    /*
        fixed speed : 100 px/s
    */
    var movement = Math.round(100 * elapsed/1000);
    var line = map.mazeCurrentLine(this._x, this._y, this._direction);
    
    //TODO besoin d'une methode dans Map : crossLine() ou un truc du genre,
    // pour trouver si la ligne correspondant au mouvement traverse (au bord ou
    // au mileu, peu importe) une autre ligne, et si oui alors renvoyer cette ligne
    
    if (this._direction === Direction.UP)
    {
        /*
            here, the current line direction will always be UP or DOWN
        */
        ylimit = (line.direction === Direction.UP) ? line.ystart - line.len : line.ystart ;
        this._y = (this._y-movement > ylimit) ? this._y-movement : ylimit ;
        // this._y ...
        // getcrossLine()...
        // 
        
    }
    else if (this._direction === Direction.DOWN)
    {
        ylimit = (line.direction === Direction.UP) ? line.ystart : line.ystart + line.len ;
        this._y = (this._y+movement < ylimit) ? this._y+movement : ylimit ;
    }
    else if (this._direction === Direction.LEFT)
    {
        /*
            here, the current line direction will always be LEFT or RIGHT
        */
        xlimit = (line.direction === Direction.LEFT) ? line.xstart - line.len : line.xstart ;
        this._x = (this._x-movement > xlimit) ? this._x-movement : xlimit ;
    }
    else if (this._direction === Direction.RIGHT)
    {
        xlimit = (line.direction === Direction.LEFT) ? line.xstart : line.xstart + line.len ;
        this._x = (this._x+movement < xlimit) ? this._x+movement : xlimit ;
    }
};

/******************************* game functions *******************************/



/**************************** game event listeners ****************************/

var keyEventListener= function(e)
{
    e.preventDefault();         // prevent up and down arrows of moving the page
    pressedkeys.push(e.keyCode);
};

/**************************** game loop functions *****************************/

var graphicsLoop = function()
{
    /*if (!pause)
    {*/
    map.draw();
    pacman.draw();
    /*}*/
    requestAnimationFrame(graphicsLoop);
};

var logicLoop = function()
{
    var newupdate = performance.now();
    var elapsed = newupdate - lastupdate;
    lastupdate = newupdate;
    
    /* input management */
    
    for(var i=0;i<pressedkeys.length;i++)
    {
        var key = pressedkeys.shift()
        
        if (key === 80)
        {
            pause = !pause;
        }
        else
        {
            if (pause)
            {
                /*setTimeout(logicLoop, 1000/LOGIC_REFRESH_RATE - (performance.now()-newupdate));
                return;*/
            }
            else
            {
                if (key === 37) {pacman.changeDirection(Direction.LEFT);}
                else if (key === 38) {pacman.changeDirection(Direction.UP);}
                else if (key === 39) {pacman.changeDirection(Direction.RIGHT);}
                else if (key === 40) {pacman.changeDirection(Direction.DOWN);}
            }
        }
    }
    /*if (pause)
            {
                setTimeout(logicLoop, 1000/LOGIC_REFRESH_RATE - (performance.now()-newupdate));
                return;
            }*/
    /* movement management */
    
    pacman.move(elapsed);
    
    /* animation management */
    
    pacman.animate(elapsed);
    
    //TODO if (performance.now()-newupdate) > 1000/LOGIC_REFRESH_RATE,
    //     then settimeout(logicLoop, k*1000/LOGIC_REFRESH_RATE - (performance.now()-newupdate))
    // then test that and simulate a logicLoop() taking too much time
    // => it could allow to auto-downgrade graphics settings if bad performances
    setTimeout(logicLoop, 1000/LOGIC_REFRESH_RATE - (performance.now()-newupdate));
};

/********************************* game main **********************************/

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
    - ajouter des methodes isVertical() et isHorizontal() ?
    - use lines with 2 (x;y) points instead of my system with len and direction ; create a class for that, that ensures the first point is the smallest, the second point the biggest
*/

var canvas = document.getElementById("gamecanvas");
canvas.width = 600;
canvas.height = 400;

context = canvas.getContext("2d");

/* init the game */

pacman = new Pacman(60, 80, Direction.UP);
map = new Map(MAZE_LINES);

canvas.addEventListener("keydown", keyEventListener);
canvas.focus();

lastupdate = performance.now();

/* start the game */

graphicsLoop();
logicLoop();






















