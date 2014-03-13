
/************** global variables, "constants", and enumerations ***************/

var Direction = {};
Object.defineProperties(Direction,
{
    "UP":  {value: 1, writable: false, configurable: false, enumerable: true},
    "DOWN":  {value: 2, writable: false, configurable: false, enumerable: true},
    "LEFT":  {value: 3, writable: false, configurable: false, enumerable: true},
    "RIGHT":  {value: 4, writable: false, configurable: false, enumerable: true}
});

var GameState = {};
Object.defineProperties(GameState,
{
    "MAINMENU":  {value: 1, writable: false, configurable: false, enumerable: true},
    "PAUSE":  {value: 2, writable: false, configurable: false, enumerable: true},
    "PLAYING":  {value: 3, writable: false, configurable: false, enumerable: true}
});

var context = null;
var pacman = null;
var lastupdate = null;
var maze = null;
var mazeview = null;
var pressedkeys = [];
var pause = false;
var state = null;
var score = 0;
var playingscreen = null;

var LOGIC_REFRESH_RATE = 60;

var PACMAN_RADIUS = 15;
var PACDOTS_RADIUS = 2;
var PACMAN_SPEED = 200;
var LINE_WIDTH = 1.5 * 2 * PACMAN_RADIUS;
var GRID_UNIT = 20;     // useful to set pacdots on the maze
var PACMAN_STARTX = 50;
var PACMAN_STARTY = 50;
var PACMAN_STARTDIRECTION = Direction.UP;
var PACDOT_POINT = 10;

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

/* these function's assert() will not be removed on release */
var checkConfiguration = function()
{
    assert((typeof LOGIC_REFRESH_RATE === "number" && LOGIC_REFRESH_RATE > 0), "LOGIC_REFRESH_RATE value not valid");
    assert((typeof PACDOT_POINT === "number" && PACDOT_POINT > 0), "PACDOT_POINT value not valid");
    assert((typeof LINE_WIDTH === "number" && LINE_WIDTH >= 2*PACMAN_RADIUS), "LINE_WIDTH value not valid");
    assert((typeof PACMAN_SPEED === "number" && PACMAN_SPEED > 0), "PACMAN_SPEED value not valid");
    assert((typeof PACDOTS_RADIUS === "number" && PACDOTS_RADIUS < PACMAN_RADIUS), "PACDOTS_RADIUS value not valid");
    assert((typeof PACMAN_RADIUS === "number" && PACMAN_RADIUS > 0), "PACMAN_RADIUS value not valid");
    assert((typeof GRID_UNIT === "number" && GRID_UNIT > 0), "GRID_UNIT value not valid");
    assert((typeof PACMAN_STARTX === "number" && PACMAN_STARTX > 0), "PACMAN_STARTX value not valid");
    assert((typeof PACMAN_STARTY === "number" && PACMAN_STARTY > 0), "PACMAN_STARTY value not valid");
    assert((isDirection(PACMAN_STARTDIRECTION)), "PACMAN_STARTDIRECTION value not valid");
    assert((MAZE_LINES instanceof Array && MAZE_LINES.length > 0), "MAZE_LINES value not valid");
    
    /* 
        this will hold the X/Y "padding" for the maze the user gave us,
        and will allow us to check if the lines are on the game grid
        (cf GRID_UNIT)
    */
    var xmin = MAZE_LINES[0].x1;
    var ymin = MAZE_LINES[0].y1;
    
    var pacman = new Point2D(PACMAN_STARTX, PACMAN_STARTY);
    var isPacmanInMaze = false;

    for(var i=0; i<MAZE_LINES.length; i++)
    {
        assert((typeof MAZE_LINES[i].x1 === "number"), "MAZE_LINES[" + i + "].x1 value not valid");
        assert((typeof MAZE_LINES[i].y1 === "number"), "MAZE_LINES[" + i + "].y1 value not valid");
        assert((typeof MAZE_LINES[i].x2 === "number"), "MAZE_LINES[" + i + "].x2 value not valid");
        assert((typeof MAZE_LINES[i].y2 === "number"), "MAZE_LINES[" + i + "].y2 value not valid");
        
        var p1 = new Point2D(MAZE_LINES[i].x1, MAZE_LINES[i].y1);
        var p2 = new Point2D(MAZE_LINES[i].x2, MAZE_LINES[i].y2);
        
        assert((p1.getX() === p2.getX() || p1.getY() === p2.getY()), "MAZE_LINES[" + i + "] points value will not create a horizontal nor a vertical line");
        
        var l = new LineHV2D(p1, p2);
        
        if (l.containsPoint(pacman)) {isPacmanInMaze = true;}
        
        if (l.getPoint1().getX() < xmin) {xmin = l.getPoint1().getX();}
        if (l.getPoint1().getY() < ymin) {ymin = l.getPoint1().getY();}
    }
    
    assert((isPacmanInMaze === true), "PACMAN_START coordinates are not inside the maze");
    
    for(var i=0; i<MAZE_LINES.length; i++)
    {
        assert((((MAZE_LINES[i].x1-xmin) % GRID_UNIT) === 0
             && ((MAZE_LINES[i].y1-ymin) % GRID_UNIT) === 0
             && ((MAZE_LINES[i].x2-xmin) % GRID_UNIT) === 0
             && ((MAZE_LINES[i].y2-ymin) % GRID_UNIT) === 0),
             "MAZE_LINES[" + i +"] points are not on the game grid, using " + GRID_UNIT + " pixels unit");
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

/**************************** PlayingScreen class *****************************/

var PlayingScreen = function()
{
    this._maze = Maze.createFromArrayOfLitterals(MAZE_LINES);
    this._mazeview = new MazeView(this._maze, 0, 0);
    
    this._pacman = new Pacman(PACMAN_STARTX, PACMAN_STARTY, PACMAN_STARTDIRECTION, this._maze);
    
    this._pause = false;
    this._score = 0;
};

PlayingScreen.prototype.handleInput = function(key)
{
    if (key === 37) {this._pacman.changeDirection(Direction.LEFT, this._maze);}
    else if (key === 38) {this._pacman.changeDirection(Direction.UP, this._maze);}
    else if (key === 39) {this._pacman.changeDirection(Direction.RIGHT, this._maze);}
    else if (key === 40) {this._pacman.changeDirection(Direction.DOWN, this._maze);}
};

PlayingScreen.prototype.update = function(elapsed)
{
    assert((elapsed > 0), "elapsed value is not valid");
    
    var movement = Math.round(PACMAN_SPEED * elapsed/1000);
    var limit = 0;
    var turndistance = 0;
    
    if (this._pacman.getNextDirection() !== null && this._pacman.getNextTurn() !== null)
    {
        turndistance = this._pacman.getNextTurn().distance(this._pacman.getPosition());
    }
    
    /* if we don't have to turn for now */
    if (this._pacman.getNextDirection() === null
     || this._pacman.getNextTurn() === null
     || (this._pacman.getNextDirection() !== null && this._pacman.getNextTurn() !== null && turndistance > movement))
    {
        var newx = 0;
        var newy = 0;
        
        if (this._pacman.getDirection() === Direction.UP)
        {
            limit = this._pacman.getCurrentline().getPoint1().getY();
            newx = this._pacman.getPosition().getX();
            newy = (this._pacman.getPosition().getY()-movement > limit) ? this._pacman.getPosition().getY()-movement : limit ;
        }
        else if (this._pacman.getDirection() === Direction.DOWN)
        {
            limit = this._pacman.getCurrentline().getPoint2().getY();
            newx = this._pacman.getPosition().getX();
            newy = (this._pacman.getPosition().getY()+movement < limit) ? this._pacman.getPosition().getY()+movement : limit ;
        }
        else if (this._pacman.getDirection() === Direction.LEFT)
        {
            limit = this._pacman.getCurrentline().getPoint1().getX();
            newx = (this._pacman.getPosition().getX()-movement > limit) ? this._pacman.getPosition().getX()-movement : limit ;
            newy = this._pacman.getPosition().getY();
        }
        else
        {
            limit = this._pacman.getCurrentline().getPoint2().getX();
            newx = (this._pacman.getPosition().getX()+movement < limit) ? this._pacman.getPosition().getX()+movement : limit ;
            newy = this._pacman.getPosition().getY();
        }
        
        /* check if pacman has eaten some pacdots... */
        
        var travelled = new LineHV2D(this._pacman.getPosition(), new Point2D(newx, newy));
        
        for(var i=0; i<this._maze.pacdotsCount(); i++)
        {
            if (travelled.containsPoint(this._maze.getPacdot(i)))
            {
                this._score += PACDOT_POINT;
                this._maze.deletePacdot(i);
            }
        }
        
        this._pacman.getPosition().set(newx, newy);
    }
    else
    {
        var nextline = this._maze.mazeCurrentLine(this._pacman.getNextTurn(), this._pacman.getNextDirection());
        var newx = 0;
        var newy = 0;
        
        if (this._pacman.getNextDirection() === Direction.UP)
        {
            limit = nextline.getPoint1().getY();
            newx = this._pacman.getNextTurn().getX();
            newy = (this._pacman.getPosition().getY() - (movement - turndistance) > limit) ? this._pacman.getPosition().getY() - (movement - turndistance) : limit ;
        }
        else if (this._pacman.getNextDirection() === Direction.DOWN)
        {
            limit = nextline.getPoint2().getY();
            newx = this._pacman.getNextTurn().getX();
            newy = (this._pacman.getPosition().getY() + (movement - turndistance) < limit) ? this._pacman.getPosition().getY() + (movement - turndistance) : limit ;
        }
        else if (this._pacman.getNextDirection() === Direction.LEFT)
        {
            limit = nextline.getPoint1().getX();
            newx = (this._pacman.getPosition().getX() - (movement - turndistance) > limit) ? this._pacman.getPosition().getX() - (movement - turndistance) : limit ;
            newy = this._pacman.getNextTurn().getY();
        }
        else
        {
            limit = nextline.getPoint2().getX();
            newx = (this._pacman.getPosition().getX() + (movement - turndistance) < limit) ? this._pacman.getPosition().getX() + (movement - turndistance) : limit ;
            newy = this._pacman.getNextTurn().getY();
        }
        
        /* check if pacman has eaten some pacdots... */
        
        var travelled1 = new LineHV2D(this._pacman.getPosition(), this._pacman.getNextTurn());
        var travelled2 = new LineHV2D(this._pacman.getNextTurn(), new Point2D(newx, newy));
        
        for(var i=0; i<this._maze.pacdotsCount(); i++)
        {
            if (travelled1.containsPoint(this._maze.getPacdot(i))
             || travelled2.containsPoint(this._maze.getPacdot(i)))
            {
                this._score += PACDOT_POINT;
                this._maze.deletePacdot(i);
            }
        }
        
        this._pacman.getPosition().set(newx, newy);
        
        this._pacman.setDirection(this._pacman.getNextDirection());
        this._pacman.setNextDirection(null);
        this._pacman.setNextTurn(null);
        
        this._pacman.setCurrentline(nextline);
    }
    
    this._pacman.animate(elapsed);
};

PlayingScreen.prototype.draw = function()
{
    this._mazeview.draw();
    this._pacman.draw();
};

/******************************* MazeView class *******************************/

var MazeView = function(maze, paddingTop, paddingLeft)
{
    assert((maze instanceof Maze), "maze is not a Maze");
    assert((typeof paddingTop === "number"), "paddingTop is not a number");
    assert((typeof paddingLeft === "number"), "paddingLeft is not a number");    
    
    this._maze = maze;
    this._mazerects = [];        // rectangles that perfectly wrap the pacman on lines
    this._paddingTop = paddingTop;
    this._paddingLeft = paddingLeft;
    this._width = 0;
    this._height = 0;
    
    this._generateRects();
    this._computeSize();
    
//TODO PlayingScreen contient des objets : Pacman (+ PacmanView ?) + MazeView + ScoreView + ... les xxxView contiendront les draw(padding) (ou: padding_up, padding_left, ...)
// comment appellera-t-on le constructeur Playingscreen() ? => aucun argument, et il fait tout ? ouaich
/*
- "normaliser" les coordonnées des lignes pour que (xmin,ymin) soit à (0,0) (que la map soit dans le systeme de coordonnees normal du canvas)
    => penser que le pacman_startx/y est aussi a mettre a jour par rapport a ça
-=> en fait non, c'est pas les coordonnées des lignes qu'il faut mettre à (0,0), mais le coin haut gauche du rectangle entourant le dédale
*/
/* problemes
- "maze" dans Pacman() + changedirection() + move() => OK en mettant maze en argument ; plus tard le move() sera remplacé par xxxScreen.update() donc OK
- score dans Pacman.move() => plus tard le move() sera remplacé par xxxScreen.update() donc OK
===> en fait on garde les pacman et ghosts dans playingscreen, qui aura lui une fonction update() ; elle remplace les fonctions move() de pacman/ghosts, et du coup dans update() on fera tout : bouger, modif du score, accès a maze sans probleme, ...
*/
};

MazeView.prototype._computeSize = function()
{
    var xmin = this._mazerects[0].x;
    var ymin = this._mazerects[0].y;
    var xmax = this._mazerects[0].x + this._mazerects[0].w;
    var ymax = this._mazerects[0].y + this._mazerects[0].h;

    for(var i=1; i<this._mazerects.length; i++)
    {
        if (this._mazerects[i].x < xmin) {xmin = this._mazerects[i].x;}
        if (this._mazerects[i].y < ymin) {ymin = this._mazerects[i].y;}
        if (this._mazerects[i].x + this._mazerects[i].w > xmax) {xmax = this._mazerects[i].x + this._mazerects[i].w;}
        if (this._mazerects[i].y + this._mazerects[i].h > ymax) {ymax = this._mazerects[i].y + this._mazerects[i].h;}
    }

    this._width = xmax - xmin;
    this._height = ymax - ymin;
};

MazeView.prototype._generateRects = function()
{
    var mazelines = this._maze.getMazeLines();
    
    for(var i=0; i<mazelines.length; i++)
    {
        var line = mazelines[i];
        var rect = {};
        
        rect.x = line.getPoint1().getX() - LINE_WIDTH/2;
        rect.y = line.getPoint1().getY() - LINE_WIDTH/2;
        rect.w = (isVertical(line)) ? LINE_WIDTH : line.size() + LINE_WIDTH ;
        rect.h = (isVertical(line)) ? line.size() + LINE_WIDTH : LINE_WIDTH ;
        
        this._mazerects.push(rect);
    }
};

MazeView.prototype._drawMazeRects = function()
{
    context.fillStyle = "black";
    
    for(var i=0;i<this._mazerects.length;i++)
    {
        context.fillRect(this._mazerects[i].x + this._paddingLeft,
                         this._mazerects[i].y + this._paddingTop,
                         this._mazerects[i].w,
                         this._mazerects[i].h);
    }
};

MazeView.prototype._drawPacdots = function()
{
    var pacdots = this._maze.getPacdots();
    
    context.fillStyle = "silver";
    
    for(var i=0;i<pacdots.length;i++)
    {
        context.beginPath();
        context.arc(pacdots[i].getX() + this._paddingLeft,
                    pacdots[i].getY() + this._paddingTop,
                    PACDOTS_RADIUS,
                    0,
                    2 * Math.PI);
        context.fill();
    }
    
    /* TODO
        better performances : draw in a hidden canvas and then drawImage() or putimagedata()
        cf: http://stackoverflow.com/questions/13916066/speed-up-the-drawing-of-many-points-on-a-html5-canvas-element
    */
};

MazeView.prototype.draw = function()
{
    context.fillStyle = "blue";
    context.fillRect(this._paddingLeft,
                     this._paddingTop,
                     context.canvas.width,
                     context.canvas.height);
    this._drawMazeRects();
    this._drawPacdots();
    
    /* TODO
        dessine aussi le reste de la map, qui est statique (donc pas les pacman, ghost, bouboules...) ; utiliser le pre-render du coup ? vu que ce sera toujours la même chose, inutile de refaire tous les dessins de la map
    */
};

/********************************* Maze class *********************************/

var Maze = function(mazelines)
{
    //XXX   should we clone the "mazelines" object instead of just referencing it ?
    
    //TODO  check if lines don't overlap with one another => if overlap, create
    //      a new one containing the two lines overlapping
    assert((mazelines instanceof Array && mazelines.length > 0), "mazelines is not an array");
    for(var i=0; i<mazelines.length; i++)
    {
        assert((mazelines[i] instanceof LineHV2D), "line " + i +" is not a LineHV2D");
        assert((((mazelines[i].getPoint1().getX()-50) % GRID_UNIT) === 0
             && ((mazelines[i].getPoint1().getY()-50) % GRID_UNIT) === 0
             && ((mazelines[i].getPoint2().getX()-50) % GRID_UNIT) === 0
             && ((mazelines[i].getPoint2().getY()-50) % GRID_UNIT) === 0),
             "line n°" + i +" points are not on the game grid, using " + GRID_UNIT + " pixels unit");
    }
    
    this._mazelines = mazelines; // lines on which the pacman center can move
    this._pacdots = [];
    this._powerpellets = [];
    this._width = 0;
    this._height = 0;
    
    this._computeSize();
    this._generatePacdots();
};

Maze.createFromArrayOfLitterals = function(mazelines)
{
    assert((mazelines instanceof Array && mazelines.length > 0), "mazelines is not an array");
    
    for(var i=0; i<mazelines.length; i++)
    {
        assert((typeof mazelines[i].x1 === "number"), "mazelines[" + i + "].x1 value not valid");
        assert((typeof mazelines[i].y1 === "number"), "mazelines[" + i + "].y1 value not valid");
        assert((typeof mazelines[i].x2 === "number"), "mazelines[" + i + "].x2 value not valid");
        assert((typeof mazelines[i].y2 === "number"), "mazelines[" + i + "].y2 value not valid");
        
        var p1 = new Point2D(mazelines[i].x1, mazelines[i].y1);
        var p2 = new Point2D(mazelines[i].x2, mazelines[i].y2);
        
        assert((p1.getX() === p2.getX() || p1.getY() === p2.getY()), "mazelines[" + i + "] points value will not create a horizontal nor a vertical line");
        
        assert((((p1.getX()-50) % GRID_UNIT) === 0
             && ((p1.getY()-50) % GRID_UNIT) === 0
             && ((p2.getX()-50) % GRID_UNIT) === 0
             && ((p2.getY()-50) % GRID_UNIT) === 0),
             "line n°" + i +" points will not be on the game grid, using " + GRID_UNIT + " pixels unit");
    }
    
    var lines = [];

    for(var i=0; i<mazelines.length; i++)
    {
        lines.push(new LineHV2D(new Point2D(mazelines[i].x1, mazelines[i].y1),
                                new Point2D(mazelines[i].x2, mazelines[i].y2)));
    }
    
    return new Maze(lines);
};

Maze.prototype._computeSize = function()
{
    var xmin = this._mazelines[0].getPoint1().getX();
    var ymin = this._mazelines[0].getPoint1().getY();
    var xmax = this._mazelines[0].getPoint2().getX();
    var ymax = this._mazelines[0].getPoint2().getY();

    for(var i=1; i<this._mazelines.length; i++)
    {
        if (this._mazelines[i].getPoint1().getX() < xmin) {xmin = this._mazelines[i].getPoint1().getX();}
        if (this._mazelines[i].getPoint1().getY() < ymin) {ymin = this._mazelines[i].getPoint1().getY();}
        if (this._mazelines[i].getPoint2().getX() > xmax) {xmax = this._mazelines[i].getPoint2().getX();}
        if (this._mazelines[i].getPoint2().getY() > ymax) {ymax = this._mazelines[i].getPoint2().getY();}
    }

    this._width = xmax - xmin;
    this._height = ymax - ymin;
};

Maze.prototype._generatePacdots = function()
{
    if (!(this._mazelines.length > 0))
    {
        return;
    }
    
    for(var i=0; i<this._mazelines.length; i++)
    {
        var line = this._mazelines[i];
        var start = 0;
        var end = 0;
        
        if (isVertical(line))
        {
            start = line.getPoint1().getY();
            end = line.getPoint2().getY();
            
            for(var j=start; j<=end; j+=GRID_UNIT)
            {
                this._pacdots.push(new Point2D(line.XAxis(), j));
            }
        }
        else
        {
            start = line.getPoint1().getX();
            end = line.getPoint2().getX();
            
            for(var j=start; j<=end; j+=GRID_UNIT)
            {
                this._pacdots.push(new Point2D(j, line.YAxis()));
            }
        }
    }
    
    /* delete all pacdots duplicates */
    
    var p1 = null;
    var p2 = null
    
    for(var i=0; i<this._pacdots.length; i++)
    {
        p1 = this._pacdots[i];
        
        for(var j=i+1; j < this._pacdots.length; j++)
        {
            p2 = this._pacdots[j];
            
            if (p1.getX() === p2.getX()
             && p1.getY() === p2.getY())
            {
                this._pacdots.splice(j, 1);
            }
        }
    }
};

Maze.prototype.getMazeLines = function()
{
    return this._mazelines;
};

Maze.prototype.getMazeLine = function(index)
{
    assert((index >= 0 && index < this._mazelines.length), "index value is not valid");
    
    return this._mazelines[index];
};

Maze.prototype.getPacdots = function()
{
    return this._pacdots;
};

Maze.prototype.getPacdot = function(index)
{
    assert((index >= 0 && index < this._pacdots.length), "index value is not valid");
    
    return this._pacdots[index];
};

Maze.prototype.deletePacdot = function(index)
{
    assert((index >= 0 && index < this._pacdots.length), "index value is not valid");
    
    this._pacdots.splice(index, 1);
};

Maze.prototype.mazeLinesCount = function()
{
    return this._mazelines.length;
};

Maze.prototype.pacdotsCount = function()
{
    return this._pacdots.length;
};

Maze.prototype.containsPoint = function(point)
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

Maze.prototype.mazeCurrentLine = function(point, direction)
{
    assert((point instanceof Point2D), "point is not a Point2D");
    assert((isDirection(direction)), "direction value is not valid");
    assert((this.containsPoint(point)), "point is not inside the maze");
    
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

Maze.prototype.mazeNextTurn = function(line, point, direction, nextdirection)
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

/******************************** Pacman class ********************************/

var Pacman = function(x, y, direction, maze)
{
    assert((typeof x === "number"), "x is not a number");
    assert((typeof y === "number"), "y is not a number");
    assert((isDirection(direction)), "direction value is not valid");
    assert((maze.containsPoint(new Point2D(x, y))), "coordinates are not inside the maze");
    assert((maze instanceof Maze), "maze is not a Maze");
    
    this._position = new Point2D(x, y);
    this._direction = direction;
    
    this._nextdirection = null;     // direction requested
    this._nextturn = null;          // intersection that allows movement in the requested direction
    
    this._animtime = 0;
    this._mouthstartangle = 0;
    this._mouthendangle = 2 * Math.PI;
    
    this._currentline = maze.mazeCurrentLine(this._position, this._direction);
};

Pacman.prototype.getCurrentline = function()
{
    return this._currentline;
};

Pacman.prototype.setCurrentline = function(currentline)
{
    assert((currentline instanceof LineHV2D), "currentline value is not valid");

    this._currentline = currentline;
};

Pacman.prototype.getPosition = function()
{
    return this._position;
};

Pacman.prototype.getDirection = function()
{
    return this._direction;
};

Pacman.prototype.getNextDirection = function()
{
    return this._nextdirection;
};

Pacman.prototype.setNextDirection = function(nextdirection)
{
    assert((isDirection(nextdirection) || nextdirection === null), "nextdirection value is not valid");

    this._nextdirection = nextdirection;
};

Pacman.prototype.getNextTurn = function()
{
    return this._nextturn;
};

Pacman.prototype.setNextTurn = function(nextturn)
{
    assert((nextturn instanceof Point2D || nextturn === null), "nextturn value is not valid");

    this._nextturn = nextturn;
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

Pacman.prototype.changeDirection = function(direction, maze)
{
    assert((isDirection(direction)), "direction value is not valid");
    assert((maze instanceof Maze), "maze is not a Maze");
    
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
        
        var point = maze.mazeNextTurn(this._currentline, this._position, this._direction, this._nextdirection);
        
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

Pacman.prototype.move = function(elapsed, maze)
{
    assert((elapsed > 0), "elapsed value is not valid");
    assert((maze instanceof Maze), "maze is not a Maze");
    
    var movement = Math.round(PACMAN_SPEED * elapsed/1000);
    var limit = 0;
    var turndistance = 0;
    
    if (this._nextdirection !== null && this._nextturn !== null)
    {
        turndistance = this._nextturn.distance(this._position);
    }
    
    /* if we don't have to turn for now */
    if (this._nextdirection === null
     || this._nextturn === null
     || (this._nextdirection !== null && this._nextturn !== null && turndistance > movement))
    {
        var newx = 0;
        var newy = 0;
        
        if (this._direction === Direction.UP)
        {
            limit = this._currentline.getPoint1().getY();
            newx = this._position.getX();
            newy = (this._position.getY()-movement > limit) ? this._position.getY()-movement : limit ;
        }
        else if (this._direction === Direction.DOWN)
        {
            limit = this._currentline.getPoint2().getY();
            newx = this._position.getX();
            newy = (this._position.getY()+movement < limit) ? this._position.getY()+movement : limit ;
        }
        else if (this._direction === Direction.LEFT)
        {
            limit = this._currentline.getPoint1().getX();
            newx = (this._position.getX()-movement > limit) ? this._position.getX()-movement : limit ;
            newy = this._position.getY();
        }
        else
        {
            limit = this._currentline.getPoint2().getX();
            newx = (this._position.getX()+movement < limit) ? this._position.getX()+movement : limit ;
            newy = this._position.getY();
        }
        
        /* check if pacman has eaten some pacdots... */
        
        var travelled = new LineHV2D(this._position, new Point2D(newx, newy));
        
        for(var i=0; i<maze.pacdotsCount(); i++)
        {
            if (travelled.containsPoint(maze.getPacdot(i)))
            {
                score += PACDOT_POINT;
                maze.deletePacdot(i);
            }
        }
        
        this._position.set(newx, newy);
    }
    else
    {
        var nextline = maze.mazeCurrentLine(this._nextturn, this._nextdirection);
        var newx = 0;
        var newy = 0;
        
        if (this._nextdirection === Direction.UP)
        {
            limit = nextline.getPoint1().getY();
            newx = this._nextturn.getX();
            newy = (this._position.getY() - (movement - turndistance) > limit) ? this._position.getY() - (movement - turndistance) : limit ;
        }
        else if (this._nextdirection === Direction.DOWN)
        {
            limit = nextline.getPoint2().getY();
            newx = this._nextturn.getX();
            newy = (this._position.getY() + (movement - turndistance) < limit) ? this._position.getY() + (movement - turndistance) : limit ;
        }
        else if (this._nextdirection === Direction.LEFT)
        {
            limit = nextline.getPoint1().getX();
            newx = (this._position.getX() - (movement - turndistance) > limit) ? this._position.getX() - (movement - turndistance) : limit ;
            newy = this._nextturn.getY();
        }
        else
        {
            limit = nextline.getPoint2().getX();
            newx = (this._position.getX() + (movement - turndistance) < limit) ? this._position.getX() + (movement - turndistance) : limit ;
            newy = this._nextturn.getY();
        }
        
        /* check if pacman has eaten some pacdots... */
        
        var travelled1 = new LineHV2D(this._position, this._nextturn);
        var travelled2 = new LineHV2D(this._nextturn, new Point2D(newx, newy));
        
        for(var i=0; i<maze.pacdotsCount(); i++)
        {
            if (travelled1.containsPoint(maze.getPacdot(i))
             || travelled2.containsPoint(maze.getPacdot(i)))
            {
                score += PACDOT_POINT;
                maze.deletePacdot(i);
            }
        }
        
        this._position.set(newx, newy);
        
        this._direction = this._nextdirection;
        this._nextdirection = null;
        this._nextturn = null;
        
        this._currentline = nextline;
    }
};

/******************************* game functions *******************************/



/**************************** game event listeners ****************************/

/*TODO when key pressed, register also */
/* when it was : like that, even if the */
/* game lags, we can move the pacman to */
/* the good place (move() then look */
/* remaining pressed keys then move() */
/* then...) */
var keyEventListener= function(e)
{
    e.preventDefault();         // prevent up and down arrows of moving the page
    pressedkeys.push(e.keyCode);
};

/**************************** game loop functions *****************************/

var graphicsLoop = function()
{
    //XXX count1++;
    
    if (state === GameState.PLAYING)
    {
        playingscreen.draw();
    }
    else if (state === GameState.PAUSE)
    {
        
    }
    else    /* state === GameState.MAINMENU */
    {
        
    }
    
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
    
    /* TODO
        normalement il faudrait ici que dans le for(), selon l'état du jeu, on appelle le xxxScreen.handleInput() de l'état correspondant, cette fonction renvoyant un état (vu qu'elle s'occupe des entrées), et on met ensuite l'etat du jeu a cet etat, puis on continue le for(), etc...
    */
    for(var i=0;i<pressedkeys.length;i++)
    {
        var key = pressedkeys.shift()
        
        if (state === GameState.PLAYING)
        {
            playingscreen.handleInput(key);
        }
        else if (state === GameState.PAUSE)
        {
            
        }
        else    /* state === GameState.MAINMENU */
        {
            
        }
        /*
        if (key === 80)
        {
            pause = !pause;
        }
        else
        {
            if (pause)
            {
                //setTimeout(logicLoop, 1000/LOGIC_REFRESH_RATE - (performance.now()-newupdate));
                //return;
            }
            else
            {*/
                //playingscreen.handleInput(key);
            /*}
        }*/
    }
    
    /*if (pause)
            {
                setTimeout(logicLoop, 1000/LOGIC_REFRESH_RATE - (performance.now()-newupdate));
                return;
            }*/
    
    /* movement management */
    
    //pacman.move(elapsed, maze);
    playingscreen.update(elapsed);
    
    /* animation management */
    
    //pacman.animate(elapsed);
    
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
    - improve pacman graphics : how to create borders automatically ? and the inside walls ?
    - one class pacman and one class ghost, the two inheriting a
    2DAnimatedObject class (containing a static method draw() called in
    updategraphics, and a static method update() called in updatelogic (update
    the position and the animation state), and x/y properties, ... and something
    to animate, like passing the timestamp ? or an other solution ?=> the static
    method update())
    - a Game class
    - ajouter les fantomes
    - ajouter les power pellets
    - dans checkConfiguration(), verifier si pr le menu la taille specifiée et la police et sa taille peuvent rentrer dedans, ...
    - implement pause
*/

var canvas = document.getElementById("gamecanvas");
canvas.width = 600;
canvas.height = 650;

context = canvas.getContext("2d");

checkConfiguration();

/* init the game */

//TODO save the game size, and use it for the canvas (or the opposite) ?
//     like that we have good size and measures for the map lines ? or define the lines first and then find the game map and then the game size (with a minimal game size) ?

/* TODO
- ici, on fait donc le new Map()
- puis on crée les menus (avant ou après) : avec des MENU_HEIGHT, MENU_FONT, ... et on centre les elements du menu
- puis on met la taille du canvas automatiquement : on appelle les getHeight()/Width() des menus et de la map : on obtiendra un genre de PPCM => on prend la hauteur et la largeur max de ce qu'on obtient, puis on appelle pour chacun (menus+map) un setPadding() qui mettra dans une propriété perso le padding necessaire pour etre centré dans le canvas qui sera trop grand pour certains (en utilisant les propriétés width et size pour chaque XXXView)
*/

/*FIXME
- prob quand on met xstart a 51 par exemple => typerror currentline undefined !!!
*/


playingscreen = new PlayingScreen();

maze = Maze.createFromArrayOfLitterals(MAZE_LINES);
mazeview = new MazeView(maze, 0, 0);

pacman = new Pacman(PACMAN_STARTX, PACMAN_STARTY, PACMAN_STARTDIRECTION, maze);

console.log("yeaaaaah 7");

canvas.addEventListener("keydown", keyEventListener);
canvas.focus();

state = GameState.PLAYING;

lastupdate = performance.now();
firstupdate = lastupdate;

/* start the game */

graphicsLoop();
logicLoop();






















