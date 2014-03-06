
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
var PACMAN_SPEED = 200;
var LINE_WIDTH = 1.2 * 2 * PACMAN_RADIUS;

var MAZE_LINES = [
                 {x1: 60, y1: 80, x2: 480, y2: 80},
                 {x1: 60, y1: 80, x2: 60, y2: 300},
                 {x1: 60, y1: 200, x2: 200, y2: 200}
                 ];

/***************************** utilities functions ****************************/

var isDirection = function(direction)
{
    if (direction === Direction.UP
     || direction === Direction.DOWN
     || direction === Direction.RIGHT
     || direction === Direction.LEFT)
    {
        return true;
    }
    else
    {
        return false;
    }
};

var isVertical = function(arg)      /* overloading powaaa ^^ */
{
    if (arg instanceof LineHV2D)
    {
        return (arg.getX1() === arg.getX2()) ? true : false ;
    }
    else if (isDirection(arg))
    {
        return (arg === Direction.UP || arg === Direction.DOWN) ? true : false ;
    }
    else
    {
        throw new TypeError("Argument is not a Direction nor a LineHV2D");
    }
};

var isHorizontal = function(arg)
{
    if (arg instanceof LineHV2D)
    {
        return (arg.getY1() === arg.getY2()) ? true : false ;
    }
    else if (isDirection(arg))
    {
        return (arg === Direction.LEFT || arg === Direction.RIGHT) ? true : false ;
    }
    else
    {
        throw new TypeError("Argument is not a Direction nor a LineHV2D");
    }
};

/********************************* Point class ********************************/

var Point2D = function(x, y)
{
    if (typeof x !== "number")
    {
        throw new TypeError("x is not a number");
    }
    if (typeof y !== "number")
    {
        throw new TypeError("y is not a number");
    }
    
    this._x = x;
    this._y = y;
};

Point2D.prototype.getX = function()
{
    return this._x;
};

Point2D.prototype.getY = function()
{
    return this._y;
};

Point2D.prototype.distance = function(point)
{
    if (!(point instanceof Point2D))
    {
        throw new TypeError("point is not a Point2D");
    }
    
    return Math.sqrt(Math.pow(point.getX()-this.getX(), 2) + Math.pow(point.getY()-this.getY(), 2));
};

/********************************* Line class *********************************/

/*
    - HV stands for "Horizontal or Vertical"
    - the instances first point will be the nearest of the origin (the way the
      constructor ensures that is only valid for H or V lines)
*/
var LineHV2D = function(x1, y1, x2, y2)
{
    if (typeof x1 !== "number")
    {
        throw new TypeError("x1 is not a number");
    }
    if (typeof y1 !== "number")
    {
        throw new TypeError("y1 is not a number");
    }
    if (typeof x2 !== "number")
    {
        throw new TypeError("x2 is not a number");
    }
    if (typeof y2 !== "number")
    {
        throw new TypeError("y2 is not a number");
    }
    if (x1 === y1
     && x1 === x2
     && x1 === y2)
    {
        throw new RangeError("Coordinates values will not create a line");
    }
    if (x1 !== x2
     && y1 !== y2)
    {
        throw new RangeError("Coordinates values will not create a horizontal nor a vertical line");
    }
    
    if (x1 <= x2 && y1 <= y2)
    {
        this._x1 = x1;
        this._y1 = y1;
        this._x2 = x2;
        this._y2 = y2;
    }
    else
    {
        this._x1 = x2;
        this._y1 = y2;
        this._x2 = x1;
        this._y2 = y1;
    }
};

LineHV2D.prototype.getX1 = function()
{
    return this._x1;
};

LineHV2D.prototype.getY1 = function()
{
    return this._y1;
};

LineHV2D.prototype.getX2 = function()
{
    return this._x2;
};

LineHV2D.prototype.getY2 = function()
{
    return this._y2;
};

LineHV2D.prototype.size = function()
{
    return (isVertical(this)) ? this._y2 - this._y1 : this._x2 - this._x1 ;
};

LineHV2D.prototype.XAxis = function()
{
    return (isVertical(this)) ? this._x1 : undefined ;
};

LineHV2D.prototype.YAxis = function()
{
    return (isHorizontal(this)) ? this._y1 : undefined ;
};

LineHV2D.prototype.isInXIntervalOf = function(line)
{
    if (!(line instanceof LineHV2D))
    {
        throw new TypeError("line is not a LineHV2D");
    }
    
    if (this._x1 >= line.getX1() && this._x2 <= line.getX2())
    {
        return true;
    }
    else
    {
        return false;
    }
};

LineHV2D.prototype.isInYIntervalOf = function(line)
{
    if (!(line instanceof LineHV2D))
    {
        throw new TypeError("line is not a LineHV2D");
    }
    
    if (this._y1 >= line.getY1() && this._y2 <= line.getY2())
    {
        return true;
    }
    else
    {
        return false;
    }
};

LineHV2D.prototype.isCrossing = function(line)
{
    if (!(line instanceof LineHV2D))
    {
        throw new TypeError("line is not a LineHV2D");
    }
    
    if ((this.isInYIntervalOf(line) && line.isInXIntervalOf(this))
     || (this.isInXIntervalOf(line) && line.isInYIntervalOf(this)))
    {
        return true;
    }
    
    return false;
};

LineHV2D.prototype.containsPoint = function(point)
{
    if (!(point instanceof Point2D))
    {
        throw new TypeError("point is not a Point2D");
    }
    
    if (point.getY() >= this._y1 && point.getY() <= this._y2
     && point.getX() >= this._x1 && point.getX() <= this._x2)
    {
        return true;
    }
    else
    {
        return false;
    }
};

LineHV2D.prototype.containsX = function(x)
{
    if (typeof x !== "number")
    {
        throw new TypeError("x is not a number");
    }
    
    if ((isVertical(this) && x === this._x1)
     || (isHorizontal(this) && x >= this._x1 && x <= this._x2))
    {
        return true;
    }
    else
    {
        return false;
    }
};

LineHV2D.prototype.containsY = function(y)
{
    if (typeof y !== "number")
    {
        throw new TypeError("y is not a number");
    }
    
    if ((isHorizontal(this) && y === this._y1)
     || (isVertical(this) && y >= this._y1 && y <= this._y2))
    {
        return true;
    }
    else
    {
        return false;
    }
};

LineHV2D.prototype.containsXStrictly = function(x)
{
    if (typeof x !== "number")
    {
        throw new TypeError("x is not a number");
    }
    
    if (isHorizontal(this) && x > this._x1 && x < this._x2)
    {
        return true;
    }
    else
    {
        return false;
    }
};

LineHV2D.prototype.containsYStrictly = function(y)
{
    if (typeof y !== "number")
    {
        throw new TypeError("y is not a number");
    }
    
    if (isVertical(this) && y > this._y1 && y < this._y2)
    {
        return true;
    }
    else
    {
        return false;
    }
};

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
        var line = this._mazelines[i];
        var rect = {};
        
        rect.x = line.getX1() - PACMAN_RADIUS;
        rect.y = line.getY1() - PACMAN_RADIUS;
        
        if (isVertical(line))
        {
            rect.w = 2 * PACMAN_RADIUS;
            rect.h = line.size() + 2 * PACMAN_RADIUS;
        }
        else
        {
            rect.w = line.size() + 2 * PACMAN_RADIUS;
            rect.h = 2 * PACMAN_RADIUS;
        }
        
        this._mazerects.push(rect);
    }
};

Map.prototype.getMazeLine = function(index)
{
    if (index < 0 || index >= this._mazelines.length)
    {
        throw new RangeError("index value is not valid");
    }
    
    return this._mazelines[index];
};

Map.prototype.mazeLinesCount = function()
{
    return this._mazelines.length;
};

Map.prototype.mazeCurrentLine = function(x, y, direction)
{
    if (typeof x !== "number")
    {
        throw new TypeError("x is not a number");
    }
    if (typeof y !== "number")
    {
        throw new TypeError("y is not a number");
    }
    if (!isDirection(direction))
    {
        throw new RangeError("direction value is not valid");
    }
    
    var line = null;
    
    for(var i=0; i<this._mazelines.length; i++)
    {
        line = this._mazelines[i];
        
        if (((isVertical(direction) && isVertical(line))
          || (isHorizontal(direction) && isHorizontal(line)))
         && line.containsPoint(new Point2D(x,y)))
        {
            return line;
        }
    }
    
    return undefined;
};

Map.prototype.mazeNextTurn = function(line, x, y, direction, nextdirection)
{
    if (!(line instanceof LineHV2D))
    {
        throw new TypeError("line is not a LineHV2D");
    }
    if (typeof x !== "number")
    {
        throw new TypeError("x is not a number");
    }
    if (typeof y !== "number")
    {
        throw new TypeError("y is not a number");
    }
    if (!isDirection(direction))
    {
        throw new RangeError("direction value is not valid");
    }
    if (!isDirection(nextdirection))
    {
        throw new RangeError("nextdirection value is not valid");
    }
    
    if ((isVertical(direction) && isVertical(nextdirection))
     || (isHorizontal(direction) && isHorizontal(nextdirection)))
    {
        return undefined;
    }
    
    var lines = [];
    var xlimit = null;
    var ylimit = null;
    
    if (direction === Direction.UP)         {xlimit = x; ylimit = line.getY1();}
    else if (direction === Direction.DOWN)  {xlimit = x; ylimit = line.getY2();}
    else if (direction === Direction.LEFT)  {xlimit = line.getX1(); ylimit = y;}
    else if (direction === Direction.RIGHT) {xlimit = line.getX2(); ylimit = y;}
    
    /* find all the lines on which we could turn */
    
    for(var i=0;i<this._mazelines.length;i++)
    {
        var line = this._mazelines[i];
        
        /* if this line is crossing ours */
        if (line.isCrossing(new LineHV2D(x, y, xlimit, ylimit)))
        {
            /* if there is some place to turn */
            if ((nextdirection === Direction.LEFT && line.containsX(x-1))
             || (nextdirection === Direction.RIGHT && line.containsX(x+1))
             || (nextdirection === Direction.UP && line.containsY(y-1))
             || (nextdirection === Direction.DOWN && line.containsY(y+1)))
            {
                lines.push(this._mazelines[i]);
            }
        }
    }
    
    if (lines.length === 0)
    {
        return undefined;
    }
    else
    {
        /* find the nearest line */
        
        var line = null;
        var nearest = (isVertical(nextdirection)) ? lines[0].XAxis() : lines[0].YAxis() ;
        var index = 0;
        
        for(var i=1;i<lines.length;i++)
        {
            if ((direction === Direction.LEFT && lines[i].XAxis() > nearest)
             || (direction === Direction.RIGHT && lines[i].XAxis() < nearest)
             || (direction === Direction.UP && lines[i].YAxis() > nearest)
             || (direction === Direction.DOWN && lines[i].YAxis() < nearest))
            {
                nearest = (isVertical(nextdirection)) ? lines[i].XAxis() : lines[i].YAxis() ;
                index = i;
            }
        }
        
        line = lines[index];
        
        /* return the intersection */
        
        if (isVertical(nextdirection))
        {
            return new Point2D(nearest, y);
        }
        else
        {
            return new Point2D(x, nearest);
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

var Pacman = function(x, y, direction)
{
    if (typeof x !== "number")
    {
        throw new TypeError("x is not a number");
    }
    if (typeof y !== "number")
    {
        throw new TypeError("y is not a number");
    }
    if (!isDirection(direction))
    {
        throw new RangeError("direction value is not valid");
    }
    
    this._x = x;
    this._y = y;
    this._direction = direction;
    
    this._nextdirection = null;     // direction requested
    this._nextturn = null;          // intersection that allows movement in the requested direction
    
    this._animtime = 0;
    this._mouthstartangle = 0;
    this._mouthendangle = 2 * Math.PI;
};

Pacman.prototype.setDirection = function(direction)
{
    if (!isDirection(direction))
    {
        throw new RangeError("direction value is not valid");
    }

    this._direction = direction;
};

Pacman.prototype.setNextDirection = function(nextdirection)
{
    if (!isDirection(direction))
    {
        throw new RangeError("nextdirection value is not valid");
    }
    
    this._nextdirection = nextdirection;
};

Pacman.prototype.changeDirection = function(direction)
{
    if (!isDirection(direction))
    {
        throw new RangeError("direction value is not valid");
    }
    
    if (direction === this._direction
     || direction === this._nextdirection)
    {
        return;
    }
    
    if ((isVertical(direction) && isVertical(this._direction))
     || (isHorizontal(direction) && isHorizontal(this._direction)))
    {
        this._direction = direction;
        this._nextdirection = null;
        this._nextturn = null;
    }
    else
    {
        this._nextdirection = direction;
            
        var line = map.mazeCurrentLine(this._x, this._y, this._direction);
        if (line === undefined)
        {
            this._nextturn = null;
            return;
        }
        
        var point = map.mazeNextTurn(line, this._x, this._y, this._direction, this._nextdirection);
        if (point === undefined)
        {
            this._nextturn = null;
            return;
        }
        
        this._nextturn = point;
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
    if (elapsed <= 0)
    {
        throw new RangeError("elapsed value is not valid");
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
    else
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
    if (elapsed <= 0)
    {
        throw new RangeError("elapsed value is not valid");
    }
    
    var movement = Math.round(PACMAN_SPEED * elapsed/1000);
    
    var line = map.mazeCurrentLine(this._x, this._y, this._direction);
    if (line === undefined)
    {
        return;
    }
    
    /* if we don't have to turn for now */
    if (this._nextdirection === null
     || this._nextturn === null
     || (this._nextdirection !== null && this._nextturn !== null && this._nextturn.distance(new Point2D(this._x, this._y)) > movement))
    {
        var limit = 0;
        
        if (this._direction === Direction.UP)
        {
            limit = line.getY1();
            this._y = (this._y-movement > limit) ? this._y-movement : limit ;
        }
        else if (this._direction === Direction.DOWN)
        {
            limit = line.getY2();
            this._y = (this._y+movement < limit) ? this._y+movement : limit ;
        }
        else if (this._direction === Direction.LEFT)
        {
            limit = line.getX1();
            this._x = (this._x-movement > limit) ? this._x-movement : limit ;
        }
        else
        {
            limit = line.getX2();
            this._x = (this._x+movement < limit) ? this._x+movement : limit ;
        }
    }
    else
    {
        var distance = this._nextturn.distance(new Point2D(this._x, this._y));
        
        if (this._nextdirection === Direction.UP)
        {
            this._x = this._nextturn.getX();
            this._y = this._nextturn.getY() - (movement - distance);
        }
        else if (this._nextdirection === Direction.DOWN)
        {
            this._x = this._nextturn.getX();
            this._y = this._nextturn.getY() + (movement - distance);
        }
        else if (this._nextdirection === Direction.LEFT)
        {
            this._x = this._nextturn.getX() - (movement - distance);
            this._y = this._nextturn.getY();
        }
        else
        {
            this._x = this._nextturn.getX() + (movement - distance);
            this._y = this._nextturn.getY();
        }
        
        this._direction = this._nextdirection;
        this._nextdirection = null;
        this._nextturn = null;
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
    - a Game class
    - a Rectangle class
    - add Point everywhere instead of raw x/y inside : Line() + Pacman() + Map.mazecurrentline() + Map.mazenextturn()
    - create the real pacman map
*/

var canvas = document.getElementById("gamecanvas");
canvas.width = 600;
canvas.height = 400;

context = canvas.getContext("2d");

/* init the game */

pacman = new Pacman(60, 80, Direction.UP);

var lines = [];
for(var i=0; i<MAZE_LINES.length; i++)
{
    lines.push(new LineHV2D(MAZE_LINES[i].x1,
                            MAZE_LINES[i].y1,
                            MAZE_LINES[i].x2,
                            MAZE_LINES[i].y2));
}
map = new Map(lines);

canvas.addEventListener("keydown", keyEventListener);
canvas.focus();

lastupdate = performance.now();

/* start the game */

graphicsLoop();
logicLoop();






















