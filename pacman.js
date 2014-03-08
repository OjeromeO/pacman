
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
var currentline = null;

var LOGIC_REFRESH_RATE = 60;

var PACMAN_RADIUS = 15;
var PACMAN_SPEED = 200;
var LINE_WIDTH = 1.2 * 2 * PACMAN_RADIUS;

var MAZE_LINES = [
                 /* horizontal lines */
                 
                 {x1: 50, y1: 50, x2: 270, y2: 50},
                 {x1: 330, y1: 50, x2: 550, y2: 50},
                 
                 {x1: 50, y1: 130, x2: 550, y2: 130},
                 
                 {x1: 50, y1: 190, x2: 150, y2: 190},
                 {x1: 210, y1: 190, x2: 270, y2: 190},
                 {x1: 330, y1: 190, x2: 390, y2: 190},
                 {x1: 450, y1: 190, x2: 550, y2: 190},
                 
                 {x1: 210, y1: 250, x2: 390, y2: 250},
                 
                 {x1: 50, y1: 310, x2: 210, y2: 310},
                 {x1: 390, y1: 310, x2: 550, y2: 310},
                 
                 {x1: 210, y1: 370, x2: 390, y2: 370},
                 
                 {x1: 50, y1: 430, x2: 270, y2: 430},
                 {x1: 330, y1: 430, x2: 550, y2: 430},
                 
                 {x1: 50, y1: 490, x2: 90, y2: 490},
                 {x1: 150, y1: 490, x2: 450, y2: 490},
                 {x1: 510, y1: 490, x2: 550, y2: 490},
                 
                 {x1: 50, y1: 550, x2: 150, y2: 550},
                 {x1: 210, y1: 550, x2: 270, y2: 550},
                 {x1: 330, y1: 550, x2: 390, y2: 550},
                 {x1: 450, y1: 550, x2: 550, y2: 550},
                 
                 {x1: 50, y1: 610, x2: 550, y2: 610},
                 
                 /* vertical lines */
                 
                 {x1: 50, y1: 50, x2: 50, y2: 190},
                 {x1: 150, y1: 50, x2: 150, y2: 550},
                 {x1: 450, y1: 50, x2: 450, y2: 550},
                 {x1: 550, y1: 50, x2: 550, y2: 190},
                 
                 {x1: 270, y1: 50, x2: 270, y2: 130},
                 {x1: 330, y1: 50, x2: 330, y2: 130},
                 
                 {x1: 210, y1: 130, x2: 210, y2: 190},
                 {x1: 390, y1: 130, x2: 390, y2: 190},
                 
                 {x1: 270, y1: 190, x2: 270, y2: 250},
                 {x1: 330, y1: 190, x2: 330, y2: 250},
                 
                 {x1: 210, y1: 250, x2: 210, y2: 430},
                 {x1: 390, y1: 250, x2: 390, y2: 430},
                 
                 {x1: 50, y1: 430, x2: 50, y2: 490},
                 {x1: 270, y1: 430, x2: 270, y2: 490},
                 {x1: 330, y1: 430, x2: 330, y2: 490},
                 {x1: 550, y1: 430, x2: 550, y2: 490},
                 
                 {x1: 90, y1: 490, x2: 90, y2: 550},
                 {x1: 210, y1: 490, x2: 210, y2: 550},
                 {x1: 390, y1: 490, x2: 390, y2: 550},
                 {x1: 510, y1: 490, x2: 510, y2: 550},
                 
                 {x1: 50, y1: 550, x2: 50, y2: 610},
                 {x1: 270, y1: 550, x2: 270, y2: 610},
                 {x1: 330, y1: 550, x2: 330, y2: 610},
                 {x1: 550, y1: 550, x2: 550, y2: 610}
                 ];
/* XXX
var count1 = 0;
var count2 = 0;
var firstupdate = 0;
*/
/***************************** utilities functions ****************************/

var AssertError = function(message)
{
    this.name = "Assert";
    this.message = message || "assertion failed";
};
AssertError.prototype = new Error();

var assert = function(condition, message)
{
    if (condition === false)
    {
        throw new AssertError(message);
    }
};

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
    assert((arg instanceof LineHV2D || isDirection(arg)), "argument is not a Direction nor a LineHV2D");
    
    if (arg instanceof LineHV2D)
    {
        return (arg.getPoint1().getX() === arg.getPoint2().getX()) ? true : false ;
    }
    else
    {
        return (arg === Direction.UP || arg === Direction.DOWN) ? true : false ;
    }
};

var isHorizontal = function(arg)
{
    assert((arg instanceof LineHV2D || isDirection(arg)), "argument is not a Direction nor a LineHV2D");
    
    if (arg instanceof LineHV2D)
    {
        return (arg.getPoint1().getY() === arg.getPoint2().getY()) ? true : false ;
    }
    else
    {
        return (arg === Direction.LEFT || arg === Direction.RIGHT) ? true : false ;
    }
};

/********************************* Point class ********************************/

var Point2D = function(x, y)
{
    assert((typeof x === "number"), "x is not a number");
    assert((typeof y === "number"), "y is not a number");
    
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

Point2D.prototype.setX = function(x)
{
    assert((typeof x === "number"), "x is not a number");
    
    this._x = x;
};

Point2D.prototype.setY = function(y)
{
    assert((typeof y === "number"), "y is not a number");
    
    this._y = y;
};

Point2D.prototype.set = function(x, y)
{
    assert((typeof x === "number"), "x is not a number");
    assert((typeof y === "number"), "y is not a number");
    
    this._x = x;
    this._y = y;
};

Point2D.prototype.equals = function(point)
{
    assert((point instanceof Point2D), "point is not a Point2D");
    
    return (this._x === point.getX() && this._y === point.getY()) ? true : false ;
};

Point2D.prototype.distance = function(point)
{
    assert((point instanceof Point2D), "point is not a Point2D");
    
    return Math.sqrt(Math.pow(point.getX()-this.getX(), 2) + Math.pow(point.getY()-this.getY(), 2));
};

/********************************* Line class *********************************/

/*
    - HV stands for "Horizontal or Vertical"
    - the instances first point will be the nearest of the origin (the way the
      constructor ensures that is only valid for H or V lines)
*/
var LineHV2D = function(point1, point2)
{
    assert((point1 instanceof Point2D), "point1 is not a Point2D");
    assert((point2 instanceof Point2D), "point2 is not a Point2D");
    assert((point1.getX() === point2.getX() || point1.getY() === point2.getY()),
           "points will not create a horizontal nor a vertical line");
    
    //XXX   should we clone the "pointZ" objects instead of just referencing them ?
    if (point1.getX() <= point2.getX() && point1.getY() <= point2.getY())
    {
        this._point1 = point1;
        this._point2 = point2;
    }
    else
    {
        this._point1 = point2;
        this._point2 = point1;
    }
};

LineHV2D.prototype.getPoint1 = function()
{
    return this._point1;
};

LineHV2D.prototype.getPoint2 = function()
{
    return this._point2;
};

LineHV2D.prototype.size = function()
{
    if (isVertical(this))
    {
        return (this._point2.getY() - this._point1.getY());
    }
    else
    {
        return (this._point2.getX() - this._point1.getX());
    }
};

LineHV2D.prototype.XAxis = function()
{
    return (isVertical(this)) ? this._point1.getX() : undefined ;
};

LineHV2D.prototype.YAxis = function()
{
    return (isHorizontal(this)) ? this._point1.getY() : undefined ;
};

LineHV2D.prototype.isInXIntervalOf = function(line)
{
    assert((line instanceof LineHV2D), "line is not a LineHV2D");
    
    if (this._point1.getX() >= line.getPoint1().getX()
     && this._point2.getX() <= line.getPoint2().getX())
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
    assert((line instanceof LineHV2D), "line is not a LineHV2D");
    
    if (this._point1.getY() >= line.getPoint1().getY()
     && this._point2.getY() <= line.getPoint2().getY())
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
    assert((line instanceof LineHV2D), "line is not a LineHV2D");
    
    if ((this.isInYIntervalOf(line) && line.isInXIntervalOf(this))
     || (this.isInXIntervalOf(line) && line.isInYIntervalOf(this)))
    {
        return true;
    }
    
    return false;
};

LineHV2D.prototype.containsPoint = function(point)
{
    assert((point instanceof Point2D), "point is not a Point2D");
    
    if (point.getY() >= this._point1.getY() && point.getY() <= this.getPoint2().getY()
     && point.getX() >= this._point1.getX() && point.getX() <= this.getPoint2().getX())
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
    assert((typeof x === "number"), "x is not a number");
    
    if ((isVertical(this) && x === this._point1.getX())
     || (isHorizontal(this) && x >= this._point1.getX() && x <= this._point2.getX()))
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
    assert((typeof y === "number"), "y is not a number");
    
    if ((isHorizontal(this) && y === this._point1.getY())
     || (isVertical(this) && y >= this._point1.getY() && y <= this._point2.getY()))
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
    assert((typeof x === "number"), "x is not a number");
    
    if (isHorizontal(this) && x > this._point1.getX() && x < this._point2.getX())
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
    assert((typeof y === "number"), "y is not a number");
    
    if (isVertical(this) && y > this._point1.getY() && y < this._point2.getY())
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
        
        rect.x = line.getPoint1().getX() - PACMAN_RADIUS;
        rect.y = line.getPoint1().getY() - PACMAN_RADIUS;
        
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
    assert((index >= 0 && index < this._mazelines.length), "index value is not valid");
    
    return this._mazelines[index];
};

Map.prototype.mazeLinesCount = function()
{
    return this._mazelines.length;
};

Map.prototype.containsPoint = function(point)
{
    assert((point instanceof Point2D), "point is not a Point2D");
    
    for(var i=0;i<this._mazelines.length;i++)
    {
        if (this._mazelines[i].containsPoint(point))
        {
            return true;
        }
    }
    
    return false;
};

Map.prototype.mazeCurrentLine = function(point, direction)
{
    assert((point instanceof Point2D), "point is not a Point2D");
    assert((isDirection(direction)), "direction value is not valid");
    assert((this.containsPoint(point)), "point is not inside the map");
    
    var line = null;
    
    for(var i=0; i<this._mazelines.length; i++)
    {
        line = this._mazelines[i];
        
        if (((isVertical(direction) && isVertical(line))
          || (isHorizontal(direction) && isHorizontal(line)))
         && line.containsPoint(point))
        {
            return line;
        }
    }
};

Map.prototype.mazeNextTurn = function(line, point, direction, nextdirection)
{
    assert((line instanceof LineHV2D), "line is not a LineHV2D");
    assert((point instanceof Point2D), "point is not a Point2D");
    assert((isDirection(direction)), "direction value is not valid");
    assert((isDirection(nextdirection)), "nextdirection value is not valid");
    
    if ((isVertical(direction) && isVertical(nextdirection))
     || (isHorizontal(direction) && isHorizontal(nextdirection)))
    {
        return undefined;
    }
    
    var lines = [];
    var xlimit = null;
    var ylimit = null;
    
    if (direction === Direction.UP)         {xlimit = point.getX(); ylimit = line.getPoint1().getY();}
    else if (direction === Direction.DOWN)  {xlimit = point.getX(); ylimit = line.getPoint2().getY();}
    else if (direction === Direction.LEFT)  {xlimit = line.getPoint1().getX(); ylimit = point.getY();}
    else if (direction === Direction.RIGHT) {xlimit = line.getPoint2().getX(); ylimit = point.getY();}
    
    /* find all the lines on which we could turn */
    
    for(var i=0;i<this._mazelines.length;i++)
    {
        var line = this._mazelines[i];
        
        /* if this line is crossing ours */
        if (line.isCrossing(new LineHV2D(point, new Point2D(xlimit, ylimit))))
        {
            /* if there is some place to turn */
            if ((nextdirection === Direction.LEFT && line.containsX(point.getX()-1))
             || (nextdirection === Direction.RIGHT && line.containsX(point.getX()+1))
             || (nextdirection === Direction.UP && line.containsY(point.getY()-1))
             || (nextdirection === Direction.DOWN && line.containsY(point.getY()+1)))
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
            return new Point2D(nearest, point.getY());
        }
        else
        {
            return new Point2D(point.getX(), nearest);
        }
    }
};

Map.prototype._drawMazeRects = function()
{
    context.fillStyle = "blue";
    
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
    assert((typeof x === "number"), "x is not a number");
    assert((typeof y === "number"), "y is not a number");
    assert((isDirection(direction)), "direction value is not valid");
    assert((map.containsPoint(new Point2D(x, y))), "coordinates are not inside the map");
    
    this._position = new Point2D(x, y);
    this._direction = direction;
    
    this._nextdirection = null;     // direction requested
    this._nextturn = null;          // intersection that allows movement in the requested direction
    
    this._animtime = 0;
    this._mouthstartangle = 0;
    this._mouthendangle = 2 * Math.PI;
    
    currentline = map.mazeCurrentLine(this._position, this._direction);
};

Pacman.prototype.setDirection = function(direction)
{
    assert((isDirection(direction)), "direction value is not valid");

    this._direction = direction;
};

Pacman.prototype.setPosition = function(x, y)
{
    assert((typeof x === "number"), "x is not a number");
    assert((typeof y === "number"), "y is not a number");

    this._position.set(x, y);
};

Pacman.prototype.setPositionX = function(x)
{
    assert((typeof x === "number"), "x is not a number");

    this._position.setX(x);
};

Pacman.prototype.setPositionY = function(y)
{
    assert((typeof y === "number"), "y is not a number");

    this._position.setY(y);
};

Pacman.prototype.setNextDirection = function(nextdirection)
{
    assert((isDirection(nextdirection)), "nextdirection value is not valid");
    
    this._nextdirection = nextdirection;
};

Pacman.prototype.changeDirection = function(direction)
{
    assert((isDirection(direction)), "direction value is not valid");
    
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
        
        var point = map.mazeNextTurn(currentline, this._position, this._direction, this._nextdirection);
        
        this._nextturn = (point === undefined) ? null : point ;
    }
};

Pacman.prototype.draw = function()
{
    context.fillStyle = "yellow";
    context.beginPath();
    context.moveTo(this._position.getX(), this._position.getY());
    
    /*
        if arc() has the same start and end angles (mouth shutted), nothing is
        done ; a little trick to have a circle in this case is to use the fact
        that angles are modulo(2*PI)
    */
    context.arc(this._position.getX(), this._position.getY(), PACMAN_RADIUS, this._mouthstartangle, this._mouthendangle);
    context.fill();
};

Pacman.prototype.animate = function(elapsed)
{
    assert((elapsed > 0), "elapsed value is not valid");
    
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
    assert((elapsed > 0), "elapsed value is not valid");
    
    var movement = Math.round(PACMAN_SPEED * elapsed/1000);
    var distance = null;
    
    if (this._nextdirection !== null && this._nextturn !== null)
    {
        distance = this._nextturn.distance(this._position);
    }
    
    /* if we don't have to turn for now */
    if (this._nextdirection === null
     || this._nextturn === null
     || (this._nextdirection !== null && this._nextturn !== null && distance > movement))
    {
        var limit = 0;
        
        if (this._direction === Direction.UP)
        {
            limit = currentline.getPoint1().getY();
            var y = (this._position.getY()-movement > limit) ? this._position.getY()-movement : limit ;
            this._position.setY(y);
        }
        else if (this._direction === Direction.DOWN)
        {
            limit = currentline.getPoint2().getY();
            var y = (this._position.getY()+movement < limit) ? this._position.getY()+movement : limit ;
            this._position.setY(y);
        }
        else if (this._direction === Direction.LEFT)
        {
            limit = currentline.getPoint1().getX();
            var x = (this._position.getX()-movement > limit) ? this._position.getX()-movement : limit ;
            this._position.setX(x);
        }
        else
        {
            limit = currentline.getPoint2().getX();
            var x = (this._position.getX()+movement < limit) ? this._position.getX()+movement : limit ;
            this._position.setX(x);
        }
    }
    else
    {
        if (this._nextdirection === Direction.UP)
        {
            this._position.set(this._nextturn.getX(), this._nextturn.getY() - (movement - distance));
        }
        else if (this._nextdirection === Direction.DOWN)
        {
            this._position.set(this._nextturn.getX(), this._nextturn.getY() + (movement - distance));
        }
        else if (this._nextdirection === Direction.LEFT)
        {
            this._position.set(this._nextturn.getX() - (movement - distance), this._nextturn.getY());
        }
        else
        {
            this._position.set(this._nextturn.getX() + (movement - distance), this._nextturn.getY());
        }
        
        this._direction = this._nextdirection;
        this._nextdirection = null;
        this._nextturn = null;
        
        currentline = map.mazeCurrentLine(this._position, this._direction);
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
    //XXX count1++;
    /*if (!pause)
    {*/
    map.draw();
    pacman.draw();
    /*}*/
    requestAnimationFrame(graphicsLoop);
};

var logicLoop = function()
{
    //XXX count2++;
    //XXX if (performance.now() - firstupdate > 1000) {console.log(count1 + ", " + count2); firstupdate = performance.now(); count1 = 0; count2 = 0;}
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
    - create the real pacman map
*/

var canvas = document.getElementById("gamecanvas");
canvas.width = 600;
canvas.height = 650;

context = canvas.getContext("2d");

/* init the game */

var lines = [];
for(var i=0; i<MAZE_LINES.length; i++)
{
    lines.push(new LineHV2D(new Point2D(MAZE_LINES[i].x1, MAZE_LINES[i].y1),
                            new Point2D(MAZE_LINES[i].x2, MAZE_LINES[i].y2)));
}
map = new Map(lines);

//pacman = new Pacman(60, 80, Direction.UP);
pacman = new Pacman(50, 50, Direction.UP);

console.log("yeaaaaah 3");

canvas.addEventListener("keydown", keyEventListener);
canvas.focus();

lastupdate = performance.now();
firstupdate = lastupdate;

/* start the game */

graphicsLoop();
logicLoop();






















