
/************** global variables, "constants", and enumerations ***************/

var Direction = {};
Object.defineProperties(Direction,
{
    "UP":    {value: 1, writable: false, configurable: false, enumerable: true},
    "DOWN":  {value: 2, writable: false, configurable: false, enumerable: true},
    "LEFT":  {value: 3, writable: false, configurable: false, enumerable: true},
    "RIGHT": {value: 4, writable: false, configurable: false, enumerable: true}
});

/*
    - items for the pause menu ; they will appear in increasing order
    - values need to start at 0 and to be incremented by 1 each time
      as we use an array
*/
var PauseMenuItem = {};
Object.defineProperties(PauseMenuItem,
{
    "RESUME":  {value: 0, writable: false, configurable: false, enumerable: true},
    "RESTART": {value: 1, writable: false, configurable: false, enumerable: true},
    "QUIT":    {value: 2, writable: false, configurable: false, enumerable: true}
});


var GameState = {};
Object.defineProperties(GameState,
{
    "MAIN":    {value: 1, writable: false, configurable: false, enumerable: true},
    "PAUSE":   {value: 2, writable: false, configurable: false, enumerable: true},
    "PLAYING": {value: 3, writable: false, configurable: false, enumerable: true}
});

var PacmanState = {};
Object.defineProperties(PacmanState,
{
    "NORMAL":   {value: 1, writable: false, configurable: false, enumerable: true},
    "PP_EATEN": {value: 2, writable: false, configurable: false, enumerable: true}
});

var GhostState = {};
Object.defineProperties(GhostState,
{
    "NORMAL":   {value: 1, writable: false, configurable: false, enumerable: true},
    "EATABLE":  {value: 2, writable: false, configurable: false, enumerable: true}
});

var canvas = null;
var context = null;
var pacman = null;
var lastupdate = null;
var newupdate = null;
var pressedkeys = [];
var pressedkeysdate = [];
var state = null;
var playingscreen = null;
var pausescreen = null;

var LOGIC_REFRESH_RATE = 60;

var PAUSEMENU_RESUMESTRING = "Resume game";
var PAUSEMENU_QUITSTRING = "Return to main menu";
var PAUSEMENU_RESTARTSTRING = "Restart game";
var PAUSEMENU_FONT = "sans-serif";
var PAUSEMENU_FONT_SIZE = 30;
var PAUSEMENU_HPADDING = 20;
var PAUSEMENU_VPADDING = 20;
var PAUSEMENU_HMARGIN = 30;
var PAUSEMENU_VMARGIN = 30;
var PAUSEMENU_ITEMSDISTANCE = 30;

var PACMAN_RADIUS = 15;
var PACDOTS_RADIUS = 2;
var PACMAN_SPEED = 400;
var LINE_WIDTH = 1.5 * 2 * PACMAN_RADIUS;
var GRID_UNIT = 20;     // useful to set pacdots on the maze
var PACMAN_STARTX = 50;
var PACMAN_STARTY = 50;
var PACMAN_STARTDIRECTION = Direction.UP;
var PACDOT_POINT = 10;

var STATUS_LIVES_RADIUS = 10;
var STATUS_FONT = "sans-serif";
var STATUS_FONT_SIZE = 30;
var STATUS_PADDINGLEFT = 20;

/*
    a "nopacdots" property means that the line will not have any pacdots on it
    (except on an intersection with a line containing pacdots)
*/
var MAZE_LINES = [
                 /* horizontal lines */
                 
                 {x1: 50,  y1: 50,  x2: 270, y2: 50},
                 {x1: 330, y1: 50,  x2: 550, y2: 50},
                 
                 {x1: 50,  y1: 130, x2: 550, y2: 130},
                 
                 {x1: 50,  y1: 190, x2: 150, y2: 190},
                 {x1: 210, y1: 190, x2: 270, y2: 190},
                 {x1: 330, y1: 190, x2: 390, y2: 190},
                 {x1: 450, y1: 190, x2: 550, y2: 190},
                 
                 {x1: 210, y1: 250, x2: 390, y2: 250, nopacdots: "defined"},
                 
                 {x1: 50,  y1: 310, x2: 210, y2: 310, nopacdots: "defined", portalid1: 1},
                 {x1: 390, y1: 310, x2: 550, y2: 310, nopacdots: "defined", portalid2: 1},
                 
                 {x1: 210, y1: 370, x2: 390, y2: 370, nopacdots: "defined"},
                 
                 {x1: 50,  y1: 430, x2: 270, y2: 430},
                 {x1: 330, y1: 430, x2: 550, y2: 430},
                 
                 {x1: 50,  y1: 490, x2: 90,  y2: 490},
                 {x1: 150, y1: 490, x2: 450, y2: 490},
                 {x1: 510, y1: 490, x2: 550, y2: 490},
                 
                 {x1: 50,  y1: 550, x2: 150, y2: 550},
                 {x1: 210, y1: 550, x2: 270, y2: 550},
                 {x1: 330, y1: 550, x2: 390, y2: 550},
                 {x1: 450, y1: 550, x2: 550, y2: 550},
                 
                 {x1: 50,  y1: 610, x2: 550, y2: 610},
                 
                 /* vertical lines */
                 
                 {x1: 50,  y1: 50,  x2: 50,  y2: 190},
                 {x1: 150, y1: 50,  x2: 150, y2: 550},
                 {x1: 450, y1: 50,  x2: 450, y2: 550},
                 {x1: 550, y1: 50,  x2: 550, y2: 190},
                 
                 {x1: 270, y1: 50,  x2: 270, y2: 130},
                 {x1: 330, y1: 50,  x2: 330, y2: 130},
                 
                 {x1: 210, y1: 130, x2: 210, y2: 190},
                 {x1: 390, y1: 130, x2: 390, y2: 190},
                 
                 {x1: 270, y1: 190, x2: 270, y2: 250, nopacdots: "defined"},
                 {x1: 330, y1: 190, x2: 330, y2: 250, nopacdots: "defined"},
                 
                 {x1: 210, y1: 250, x2: 210, y2: 430, nopacdots: "defined"},
                 {x1: 390, y1: 250, x2: 390, y2: 430, nopacdots: "defined"},
                 
                 {x1: 50,  y1: 430, x2: 50,  y2: 490},
                 {x1: 270, y1: 430, x2: 270, y2: 490},
                 {x1: 330, y1: 430, x2: 330, y2: 490},
                 {x1: 550, y1: 430, x2: 550, y2: 490},
                 
                 {x1: 90,  y1: 490, x2: 90,  y2: 550},
                 {x1: 210, y1: 490, x2: 210, y2: 550},
                 {x1: 390, y1: 490, x2: 390, y2: 550},
                 {x1: 510, y1: 490, x2: 510, y2: 550},
                 
                 {x1: 50,  y1: 550, x2: 50,  y2: 610},
                 {x1: 270, y1: 550, x2: 270, y2: 610},
                 {x1: 330, y1: 550, x2: 330, y2: 610},
                 {x1: 550, y1: 550, x2: 550, y2: 610}
                 ];
/*
var count1 = 0;
var count2 = 0;
var firstupdate = 0;
*/
var tmp1 = 0;
var tmp2 = 0;
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

var isPortalID = function(id)
{
    if (typeof id === "number"
     && id > 0)
    {
        return true;
    }
    else
    {
        return false;
    }
};

var isPacmanState = function(state)
{
    if (state === PacmanState.NORMAL
     || state === PacmanState.PP_EATEN)
    {
        return true;
    }
    else
    {
        return false;
    }
};

var isGhostState = function(state)
{
    if (state === GhostState.NORMAL
     || state === GhostState.EATABLE)
    {
        return true;
    }
    else
    {
        return false;
    }
};

var isPauseMenuItem = function(item)
{
    if (item === PauseMenuItem.RESUME
     || item === PauseMenuItem.QUIT
     || item === PauseMenuItem.RESTART)
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
    assert((arg instanceof Line || isDirection(arg)), "argument is not a Direction nor a Line");
    
    if (arg instanceof Line)
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
    assert((arg instanceof Line || isDirection(arg)), "argument is not a Direction nor a Line");
    
    if (arg instanceof Line)
    {
        return (arg.getPoint1().getY() === arg.getPoint2().getY()) ? true : false ;
    }
    else
    {
        return (arg === Direction.LEFT || arg === Direction.RIGHT) ? true : false ;
    }
};

var changeCanvasDimensions = function(w, h)
{
    assert((typeof w === "number" && w >= 0), "w value not valid");
    assert((typeof h === "number" && h >= 0), "h value not valid");
    
    canvas.width = w;
    canvas.height = h;
};

var changeCanvasWidth = function(w)
{
    assert((typeof w === "number" && w >= 0), "w value not valid");
    
    canvas.width = w;
};

var changeCanvasHeight = function(h)
{
    assert((typeof h === "number" && h >= 0), "h value not valid");
    
    canvas.height = h;
};

/* these function's assert() will not be removed on release */
var checkConfiguration = function()
{
    //TODO check for the menus if their size and size font are OK, ... check if each portal has one and only one other portal
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
    
    var pacman = new Point(PACMAN_STARTX, PACMAN_STARTY);
    var isPacmanInMaze = false;

    for(var i=0; i<MAZE_LINES.length; i++)
    {
        assert((typeof MAZE_LINES[i].x1 === "number"), "MAZE_LINES[" + i + "].x1 value not valid");
        assert((typeof MAZE_LINES[i].y1 === "number"), "MAZE_LINES[" + i + "].y1 value not valid");
        assert((typeof MAZE_LINES[i].x2 === "number"), "MAZE_LINES[" + i + "].x2 value not valid");
        assert((typeof MAZE_LINES[i].y2 === "number"), "MAZE_LINES[" + i + "].y2 value not valid");
        
        var p1 = new Point(MAZE_LINES[i].x1, MAZE_LINES[i].y1);
        var p2 = new Point(MAZE_LINES[i].x2, MAZE_LINES[i].y2);
        
        assert((p1.getX() === p2.getX() || p1.getY() === p2.getY()), "MAZE_LINES[" + i + "] points value will not create a horizontal nor a vertical line");
        
        var l = new Line(p1, p2);
        
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

/******************************** Point class *******************************/

var Point = function(x, y, portalid)
{
    assert((typeof x === "number"), "x is not a number");
    assert((typeof y === "number"), "y is not a number");
    assert((typeof portalid === "undefined" || isPortalID(portalid)), "portalid is not a portal ID");
    
    this._x = x;
    this._y = y;
    this._portalid = (typeof portalid === "undefined") ? null : portalid ;
};

Point.prototype.isPortal = function()
{
    return isPortalID(this._portalid);
};

Point.prototype.getPortalID = function()
{
    return this._portalid;
};

Point.prototype.getX = function()
{
    return this._x;
};

Point.prototype.getY = function()
{
    return this._y;
};

Point.prototype.setX = function(x)
{
    assert((typeof x === "number"), "x is not a number");
    
    this._x = x;
};

Point.prototype.setY = function(y)
{
    assert((typeof y === "number"), "y is not a number");
    
    this._y = y;
};

Point.prototype.set = function(x, y)
{
    assert((typeof x === "number"), "x is not a number");
    assert((typeof y === "number"), "y is not a number");
    
    this._x = x;
    this._y = y;
};

Point.prototype.equals = function(point)
{
    assert((point instanceof Point), "point is not a Point");
    
    return (this._x === point.getX() && this._y === point.getY());
};

Point.prototype.distance = function(point)
{
    assert((point instanceof Point), "point is not a Point");
    
    return Math.sqrt(Math.pow(point.getX()-this.getX(), 2) + Math.pow(point.getY()-this.getY(), 2));
};

/******************************* Line class *******************************/

/*
    - Line creates horizontal or vertical lines
    - the instances first point will be the nearest of the origin (the way the
      constructor ensures that is only valid for horizontal or vertical lines)
*/
var Line = function(point1, point2, hasPacdots)
{
    assert((point1 instanceof Point), "point1 is not a Point");
    assert((point2 instanceof Point), "point2 is not a Point");
    assert((point1.getX() === point2.getX() || point1.getY() === point2.getY()),
           "points will not create a horizontal nor a vertical line");
    assert((typeof hasPacdots === "undefined" || typeof hasPacdots === "boolean"), "hasPacdots is not a boolean");
    
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
    
    this._hasPacdots = (typeof hasPacdots === "undefined") ? true : hasPacdots ;
};

Line.prototype.getHasPacdots = function()
{
    return this._hasPacdots;
};

Line.prototype.getPoint1 = function()
{
    return this._point1;
};

Line.prototype.getPoint2 = function()
{
    return this._point2;
};

Line.prototype.size = function()
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

Line.prototype.XAxis = function()
{
    if (isVertical(this))
    {
        return this._point1.getX();
    }
    /* else "undefined" */
};

Line.prototype.YAxis = function()
{
    if (isHorizontal(this))
    {
        return this._point1.getY();
    }
    /* else "undefined" */
};

Line.prototype.isInXIntervalOf = function(line)
{
    assert((line instanceof Line), "line is not a Line");
    
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

Line.prototype.isInYIntervalOf = function(line)
{
    assert((line instanceof Line), "line is not a Line");
    
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

Line.prototype.isCrossing = function(line)
{
    assert((line instanceof Line), "line is not a Line");
    
    if ((this.isInYIntervalOf(line) && line.isInXIntervalOf(this))
     || (this.isInXIntervalOf(line) && line.isInYIntervalOf(this)))
    {
        return true;
    }
    
    return false;
};

Line.prototype.containsPoint = function(point)
{
    assert((point instanceof Point), "point is not a Point");
    
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

Line.prototype.containsX = function(x)
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

Line.prototype.containsY = function(y)
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

Line.prototype.containsXStrictly = function(x)
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

Line.prototype.containsYStrictly = function(y)
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

/**************************** PauseScreen class *****************************/

var PauseScreen = function()
{
    this._pausemenu = new PauseMenu();
    
    this._menuWidth = 0;
    this._menuHeight = 0;
    this._minWidth = 0;
    this._minHeight = 0;
    
    this._computeSize();
};

PauseScreen.prototype.reinit = function()
{
    this._pausemenu.setCurrent(PauseMenuItem.RESUME);
};

PauseScreen.menuWidth = function()
{
    var textmaxwidth = 0;
    var width = 0;
    
    context.font = PAUSEMENU_FONT_SIZE + "px " + PAUSEMENU_FONT;
    
    for(var key in PauseMenuItem)
    {
        var itemwidth = context.measureText(PauseMenuItem[key]).width;
        
        if (itemwidth > textmaxwidth)
        {
            textmaxwidth = itemwidth;
        }
    }
    
    width = PAUSEMENU_HPADDING + textmaxwidth + PAUSEMENU_HPADDING;
    
    return width;
};

PauseScreen.menuHeight = function()
{
    var textheight = 1.3 * PAUSEMENU_FONT_SIZE;
    var height = 0;
    
    height += PAUSEMENU_VPADDING;
    
    for(var key in PauseMenuItem)
    {
        height += textheight;
        height += PAUSEMENU_ITEMSDISTANCE;
    }
    
    height -= PAUSEMENU_ITEMSDISTANCE;
    height += PAUSEMENU_VPADDING;
    
    return height;
};

PauseScreen.prototype._computeSize = function()
{
    this._menuWidth = this._computeMenuWidth();
    this._menuHeight = this._computeMenuHeight();
    this._minWidth = PAUSEMENU_HMARGIN + this._menuWidth + PAUSEMENU_HMARGIN;
    this._minHeight = PAUSEMENU_VMARGIN + this._menuHeight + PAUSEMENU_VMARGIN;
};

PauseScreen.prototype._computeMenuWidth = function()
{
    var textmaxwidth = 0;
    var width = 0;
    
    context.font = PAUSEMENU_FONT_SIZE + "px " + PAUSEMENU_FONT;
    
    for(var i=0; i<this._pausemenu.getItems().length; i++)
    {
        var itemwidth = context.measureText(this._pausemenu.getItems()[i]).width;
        
        if (itemwidth > textmaxwidth)
        {
            textmaxwidth = itemwidth;
        }
    }
    
    width = PAUSEMENU_HPADDING + textmaxwidth + PAUSEMENU_HPADDING;
    
    return width;
};

PauseScreen.prototype._computeMenuHeight = function()
{
    var textheight = 1.3 * PAUSEMENU_FONT_SIZE;
    var height = 0;
    
    height += PAUSEMENU_VPADDING;
    
    for(var i=0; i<this._pausemenu.getItems().length; i++)
    {
        height += textheight;
        height += PAUSEMENU_ITEMSDISTANCE;
    }
    
    height -= PAUSEMENU_ITEMSDISTANCE;
    height += PAUSEMENU_VPADDING;
    
    return height;
};

PauseScreen.prototype.getMinWidth = function()
{
    return this._minWidth;
};

PauseScreen.prototype.getMinHeight = function()
{
    return this._minHeight;
};

PauseScreen.prototype.getMenuWidth = function()
{
    return this._menuWidth;
};

PauseScreen.prototype.getMenuHeight = function()
{
    return this._menuHeight;
};

PauseScreen.prototype.handleInput = function(key)
{
    if (key === 38)         /* up arrow */
    {
        this._pausemenu.changeToPreviousItem();
    }
    else if (key === 40)    /* down arrow */
    {
        this._pausemenu.changeToNextItem();
    }
    else if (key === 13)    /* enter key */
    {
        if (this._pausemenu.getCurrent() === PauseMenuItem.RESUME)
        {
            return GameState.PLAYING;
        }
        else if (this._pausemenu.getCurrent() === PauseMenuItem.QUIT)
        {
            //TODO
        }
        else if (this._pausemenu.getCurrent() === PauseMenuItem.RESTART)
        {
            this.reinit();
            playingscreen.reinit();
            
            return GameState.PLAYING;
        }
    }
    
    return GameState.PAUSE;
};

PauseScreen.prototype.draw = function()
{
    var paddingLeft = (canvas.width - this._menuWidth) / 2;
    var paddingTop = (canvas.height - this._menuHeight) / 2;

    var textheight = 1.3 * PAUSEMENU_FONT_SIZE;
    var textmaxwidth = 0;
    
    context.font = PAUSEMENU_FONT_SIZE + "px " + PAUSEMENU_FONT;
    
    for(var i=0; i<this._pausemenu.getItems().length; i++)
    {
        var itemwidth = context.measureText(this._pausemenu.getItems()[i]).width;
        if (itemwidth > textmaxwidth)
        {
            textmaxwidth = itemwidth;
        }
    }
    
    context.fillStyle = "green";
    
    context.fillRect(paddingLeft,
                     paddingTop,
                     this._menuWidth,
                     this._menuHeight);
    
    context.fillStyle = "blue";
    
    for(var i=0; i<this._pausemenu.getItems().length; i++)
    {
        context.fillRect(paddingLeft + PAUSEMENU_HPADDING,
                         paddingTop + PAUSEMENU_VPADDING + i*(textheight + PAUSEMENU_ITEMSDISTANCE),
                         textmaxwidth,
                         textheight);
    }
    
    var yval = 0;
    for(var i=0; i<this._pausemenu.getItems().length; i++)
    {
        if (i === this._pausemenu.getCurrent())
        {
            context.fillStyle = "white";
        }
        else
        {
            context.fillStyle = "gray";
        }
        
        context.fillText(this._pausemenu.getItems()[i],
                         paddingLeft + PAUSEMENU_HPADDING,
                         paddingTop + PAUSEMENU_VPADDING + PAUSEMENU_FONT_SIZE + yval);
        
        yval += (textheight + PAUSEMENU_ITEMSDISTANCE);
    }
};

/******************************* PauseMenu class ******************************/

var PauseMenu = function()
{
    this._current = PauseMenuItem.RESUME;
    
    this._items = [];
    this._items[PauseMenuItem.RESUME] = PAUSEMENU_RESUMESTRING;
    this._items[PauseMenuItem.RESTART] = PAUSEMENU_RESTARTSTRING;
    this._items[PauseMenuItem.QUIT] = PAUSEMENU_QUITSTRING;
};

PauseMenu.prototype.getCurrent = function()
{
    return this._current;
};

PauseMenu.prototype.setCurrent = function(item)
{
    assert((isPauseMenuItem(item) || item === null), "item value is not valid");
    
    this._current = item;
};

PauseMenu.prototype.getItems = function()
{
    return this._items;
};

PauseMenu.prototype.changeToPreviousItem = function()
{
    if (this._current > 0)
    {
        this._current--;
    }
};

PauseMenu.prototype.changeToNextItem = function()
{
    if (this._current < this._items.length-1)
    {
        this._current++;
    }
};

/**************************** PlayingScreen class *****************************/

var PlayingScreen = function()
{
    this._width = 0;
    this._height = 0;
    
    this._status = new Status();
    
    this._maze = null;
    this._pacman = null;
    
    this._mazerects = [];       // rectangles that perfectly wrap the pacman on lines
    this._mazeportalrects = []; // rectangles that will partially hide the pacman when it go towards a portal
    
    this.loadMapFromArrayOfLitterals(MAZE_LINES);
};

PlayingScreen.prototype.loadMapFromArrayOfLitterals = function(mazelines)
{
    this._maze = Maze.createFromArrayOfLitterals(MAZE_LINES);
    this._pacman = new Pacman(PACMAN_STARTX, PACMAN_STARTY, PACMAN_STARTDIRECTION, this._maze);
    
    this._generateMazeRects();
    this._generateMazePortalsRects();
    
    this._computeSize();
    
    var width = (PauseScreen.menuWidth() > this._width) ? PauseScreen.menuWidth() : this._width ;
    var height = (PauseScreen.menuHeight() > this._height) ? PauseScreen.menuHeight() : this._height ;
    changeCanvasDimensions(width, height);
    
    this._normalizeCoordinates();
};

PlayingScreen.prototype.reinit = function()
{
    this._maze.reinit();
    
    this._status.reinit();
    
    this._pacman.reinit(PACMAN_STARTX, PACMAN_STARTY, PACMAN_STARTDIRECTION, this._maze);
};

PlayingScreen.prototype._generateMazeRects = function()
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

PlayingScreen.prototype._generateMazePortalsRects = function()
{
    var mazelines = this._maze.getMazeLines();
    
    for(var i=0; i<mazelines.length; i++)
    {
        var line = mazelines[i];
        var p1 = line.getPoint1();
        var p2 = line.getPoint2();
        
        if (p1.isPortal())
        {
            var rect = {};
            
            rect.x = p1.getX() - LINE_WIDTH/2;
            rect.y = p1.getY() - LINE_WIDTH/2;
            rect.w = (isVertical(line)) ? LINE_WIDTH : LINE_WIDTH/2 + PACMAN_RADIUS ;
            rect.h = (isVertical(line)) ? LINE_WIDTH/2 + PACMAN_RADIUS : LINE_WIDTH ;
            
            this._mazeportalrects.push(rect);
        }
        
        if (p2.isPortal())
        {
            var rect = {};
            
            rect.x = (isVertical(line)) ? p2.getX() - LINE_WIDTH/2 : p2.getX() - PACMAN_RADIUS ;
            rect.y = (isVertical(line)) ? p2.getY() - PACMAN_RADIUS : p2.getY() - LINE_WIDTH/2 ;
            rect.w = (isVertical(line)) ? LINE_WIDTH : LINE_WIDTH/2 + PACMAN_RADIUS ;
            rect.h = (isVertical(line)) ? LINE_WIDTH/2 + PACMAN_RADIUS : LINE_WIDTH ;
            
            this._mazeportalrects.push(rect);
        }
    }
};

PlayingScreen.prototype._computeSize = function()
{
    var statusheight = 1.3 * STATUS_FONT_SIZE;
    
    this._width = (this._maze.getWidth() + LINE_WIDTH > this._statusMaxWidth()) ? this._maze.getWidth() + LINE_WIDTH : this._statusMaxWidth() ;
    this._height = this._maze.getHeight() + LINE_WIDTH + 10 + statusheight;
};

PlayingScreen.prototype.getWidth = function()
{
    return this._width;
};

PlayingScreen.prototype.getHeight = function()
{
    return this._height;
};

PlayingScreen.prototype._statusMaxWidth = function()
{
    context.font = STATUS_FONT_SIZE + "px " + STATUS_FONT;
    
    return context.measureText("Score : 9 999 999").width + 50 + context.measureText("Lives : ").width + 3 * (10 + 2*STATUS_LIVES_RADIUS);
};

/*
    normalize all the coordinates of the maze lines and pacman, ghosts, ...
    => this function reposition all of the maze elements so that its upper
    left corner match the canvas origin (0,0), or is centered horizontally and
    vertically if it is smaller than the canvas width
*/
PlayingScreen.prototype._normalizeCoordinates = function()
{
    var mazerects = this._mazerects;
    var mazeportalrects = this._mazeportalrects;
    var pacdots = this._maze.getPacdots();
    var mazelines = this._maze.getMazeLines();
    
    var xmin = mazerects[0].x;
    var ymin = mazerects[0].y;
    
    for(var i=1; i<mazerects.length; i++)
    {
        if (mazerects[i].x < xmin) {xmin = mazerects[i].x;}
        if (mazerects[i].y < ymin) {ymin = mazerects[i].y;}
    }
    
    var xpadding = (canvas.width - this._width) / 2 - xmin;
    var ypadding = (canvas.height - this._height) / 2 - ymin;
    
    for(var i=0; i<mazerects.length; i++)
    {
        mazerects[i].x += xpadding;
        mazerects[i].y += ypadding;
    }
    
    for(var i=0; i<mazeportalrects.length; i++)
    {
        mazeportalrects[i].x += xpadding;
        mazeportalrects[i].y += ypadding;
    }
    
    for(var i=0; i<pacdots.length; i++)
    {
        pacdots[i].set(pacdots[i].getX() + xpadding,
                       pacdots[i].getY() + ypadding);
    }
    
    for(var i=0; i<mazelines.length; i++)
    {
        mazelines[i].getPoint1().set(mazelines[i].getPoint1().getX() + xpadding,
                                     mazelines[i].getPoint1().getY() + ypadding);
        mazelines[i].getPoint2().set(mazelines[i].getPoint2().getX() + xpadding,
                                     mazelines[i].getPoint2().getY() + ypadding);
    }
    
    this._pacman.setPosition(this._pacman.getPosition().getX() + xpadding,
                             this._pacman.getPosition().getY() + ypadding);
    
    //TODO ne pas utiliser ce genre de truc pr position depart de pacman mais plutot des flags dans MAZE_LINES (du coup on n'aurait pas a modifier ces "macros" ci-dessous)
    PACMAN_STARTX += xpadding;
    PACMAN_STARTY += ypadding;
};

PlayingScreen.prototype.handleInput = function(key)
{
    if (key === 37)         /* left arrow */
    {
        this._pacman.changeDirection(Direction.LEFT, this._maze);
    }
    else if (key === 38)    /* up arrow */
    {
        this._pacman.changeDirection(Direction.UP, this._maze);
    }
    else if (key === 39)    /* right arrow */
    {
        this._pacman.changeDirection(Direction.RIGHT, this._maze);
    }
    else if (key === 40)    /* down arrow */
    {
        this._pacman.changeDirection(Direction.DOWN, this._maze);
    }
    else if (key === 32)    /* space bar */
    {
        return GameState.PAUSE;
    }
    
    return GameState.PLAYING;
};










PlayingScreen.prototype.move = function(elapsed)
{
    assert((elapsed > 0), "elapsed value is not valid");
    
    var movement = Math.round(PACMAN_SPEED * elapsed/1000);
    var limit = 0;
    var turndistance = 0;
    
    if (this._pacman.getNextDirection() !== null && this._pacman.getNextTurn() !== null)
    {
        turndistance = this._pacman.getNextTurn().distance(this._pacman.getPosition());
    }
    
    /* if we will have to turn */
    if (this._pacman.getNextDirection() !== null
     && this._pacman.getNextTurn() !== null
     && turndistance <= movement)
    {
        /* check if pacman will eat some pacdots... */
        
        var travelled1 = new Line(this._pacman.getPosition(), this._pacman.getNextTurn());
        
        var eatenpacdots = [];
        
        for(var i=0; i<this._maze.pacdotsCount(); i++)
        {
            if (travelled1.containsPoint(this._maze.getPacdot(i)))
            {
                this._status.increaseScore(PACDOT_POINT);
                eatenpacdots.push(i);
            }
        }
        
        for(var i=0; i<eatenpacdots.length; i++)
        {
            /*
                we need to delete from the biggest index to the lowest, because
                when deleting an element of an array, the following ones will be
                re-indexed (indexes decremented) => the registered indexes of
                the next pacdots to delete will become incorrect
            */
            var index = eatenpacdots[eatenpacdots.length-1 - i];
            this._maze.deletePacdot(index);
        }
        
        /* move towards the intersection point */
        
        var nextline = this._maze.mazeCurrentLine(this._pacman.getNextTurn(), this._pacman.getNextDirection());
        
        this._pacman.setPosition(this._pacman.getNextTurn().getX(), this._pacman.getNextTurn().getY());
        this._pacman.setDirection(this._pacman.getNextDirection());
        this._pacman.setNextDirection(null);
        this._pacman.setNextTurn(null);
        this._pacman.setCurrentline(nextline);
        
        movement -= turndistance;
    }
    
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
    
    /* check if pacman will eat some pacdots... */
    
    var travelled2 = new Line(this._pacman.getPosition(), new Point(newx, newy));
    
    var eatenpacdots = [];
    
    for(var i=0; i<this._maze.pacdotsCount(); i++)
    {
        if (travelled2.containsPoint(this._maze.getPacdot(i)))
        {
            this._status.increaseScore(PACDOT_POINT);
            eatenpacdots.push(i);
        }
    }
    
    for(var i=0; i<eatenpacdots.length; i++)
    {
        var index = eatenpacdots[eatenpacdots.length-1 - i];
        this._maze.deletePacdot(index);
    }
    
    this._pacman.setPosition(newx, newy);
    
    /* if we enter a teleportation tunnel */
    if (this._maze.isPortal(this._pacman.getPosition().getX(), this._pacman.getPosition().getY()))
    {
        var p = this._maze.associatedPortal(this._pacman.getPosition().getX(), this._pacman.getPosition().getY());
        var newline = this._maze.mazeCurrentLine(p, this._pacman.getDirection());
        
        this._pacman.setPosition(p.getX(), p.getY());
        this._pacman.setCurrentline(newline);
        
        /* search if we can now turn after the teleportation */
        
        if (this._pacman.getNextDirection() !== null
         && this._pacman.getNextTurn() === null)
        {
            var nt = this._maze.mazeNextTurn(this._pacman.getCurrentline(), this._pacman.getPosition(), this._pacman.getDirection(), this._pacman.getNextDirection());
            
            this._pacman.setNextTurn(nt);
        }
        
        
        //TODO move again, as we reached the limit of the teleportation point
        
        
        //TODO if we will reach the next turn point, turn and then... mais alors
        // et si on rechoppe un teleporteur c chiant... fait un do while() ?
    }
    
    this._pacman.animate(elapsed);
};











PlayingScreen.prototype._drawMazeRects = function()
{
    context.fillStyle = "black";
    
    for(var i=0;i<this._mazerects.length;i++)
    {
        context.fillRect(this._mazerects[i].x,
                         this._mazerects[i].y,
                         this._mazerects[i].w,
                         this._mazerects[i].h);
    }
};

PlayingScreen.prototype._drawMazePacdots = function()
{
    var pacdots = this._maze.getPacdots();
    
    context.fillStyle = "silver";
    
    for(var i=0;i<pacdots.length;i++)
    {
        context.beginPath();
        context.arc(pacdots[i].getX(),
                    pacdots[i].getY(),
                    PACDOTS_RADIUS,
                    0,
                    2 * Math.PI);
        context.fill();
    }
    
    // TODO
    //  better performances : draw in a hidden canvas and then drawImage() or putimagedata()
    //  cf: http://stackoverflow.com/questions/13916066/speed-up-the-drawing-of-many-points-on-a-html5-canvas-element
};

PlayingScreen.prototype._drawMaze = function()
{
    context.fillStyle = "blue";
    context.fillRect((canvas.width - this._width) / 2,
                     (canvas.height - this._height) / 2,
                     this._width,
                     this._height);
    this._drawMazeRects();
    this._drawMazePacdots();
};

PlayingScreen.prototype._drawStatus = function()
{
    context.fillStyle = "gray";
    
    context.font = STATUS_FONT_SIZE + "px " + STATUS_FONT;
    
    var maxscorewidth = context.measureText("Score : 9 999 999").width;
    var statusheight = 1.3 * STATUS_FONT_SIZE;
    var mapheight = this._maze.getHeight() + LINE_WIDTH;
    
    context.fillRect((canvas.width - this._width) / 2,
                     (canvas.height - this._height) / 2 + mapheight + 10,
                     this._width,
                     statusheight);
    
    context.fillStyle = "white";
    
    context.fillText("Score : " + this._status.getScore(),
                     (canvas.width - this._width) / 2 + STATUS_PADDINGLEFT,
                     (canvas.height - this._height) / 2 + mapheight + 10 + STATUS_FONT_SIZE);
    
    context.fillText("Lives : ",
                     (canvas.width - this._width) / 2 + STATUS_PADDINGLEFT + maxscorewidth + 50,
                     (canvas.height - this._height) / 2 + mapheight + 10 + STATUS_FONT_SIZE);
    
    context.fillStyle = "yellow";
    
    for(var i=1; i<=this._status.getLives(); i++)
    {
        var distance = i*10 + (i-1)*2*STATUS_LIVES_RADIUS + (STATUS_LIVES_RADIUS/2);
        context.beginPath();
        context.arc((canvas.width - this._width) / 2 + STATUS_PADDINGLEFT + maxscorewidth + 50 + context.measureText("Lives : ").width + distance,
                    (canvas.height - this._height) / 2 + mapheight + 10 + statusheight/2,
                    STATUS_LIVES_RADIUS,
                    0,
                    2 * Math.PI);
        context.fill();
    }
};

PlayingScreen.prototype._drawPacman = function()
{
    context.fillStyle = "yellow";
    context.beginPath();
    context.moveTo(this._pacman.getPosition().getX(),
                   this._pacman.getPosition().getY());
    
    //
    //    if arc() has the same start and end angles (mouth shutted), nothing is
    //    done ; a little trick to have a circle in this case is to use the fact
    //    that angles are modulo(2*PI)
    //
    context.arc(this._pacman.getPosition().getX(),
                this._pacman.getPosition().getY(),
                PACMAN_RADIUS,
                this._pacman.getMouthstartangle(),
                this._pacman.getMouthendangle());
    context.fill();
};

PlayingScreen.prototype._drawMazePortalsRects = function()
{
    context.fillStyle = "green";
    
    for(var i=0;i<this._mazeportalrects.length;i++)
    {
        context.fillRect(this._mazeportalrects[i].x,
                         this._mazeportalrects[i].y,
                         this._mazeportalrects[i].w,
                         this._mazeportalrects[i].h);
    }
};

PlayingScreen.prototype.draw = function()
{
    this._drawMaze();
    this._drawPacman();
    this._drawMazePortalsRects();
    this._drawStatus();
};

/********************************* Status class *******************************/

var Status = function()
{
    this._score = 0;
    this._lives = 3;
    this._level = 1;
};

Status.prototype.reinit = function()
{
    this._score = 0;
    this._lives = 3;
    this._level = 1;
};

Status.prototype.getScore = function()
{
    return this._score;
};

Status.prototype.increaseScore = function(incr)
{
    assert((typeof incr === "number"), "incr is not a number");
    
    this._score += incr;
};

Status.prototype.setScore = function(score)
{
    assert((typeof score === "number"), "score is not a number");
    
    this._score = score;
};

Status.prototype.getLives = function()
{
    return this._lives;
};

Status.prototype.setLives = function(lives)
{
    assert((typeof lives === "number"), "lives is not a number");
    
    this._lives = lives;
};

Status.prototype.setLevel = function(level)
{
    assert((typeof level === "number"), "level is not a number");
    
    this._level = level;
};

Status.prototype.decrementLives = function()
{
    this._lives--;
};

/********************************* Maze class *********************************/

var Maze = function(mazelines)
{
    //XXX   should we clone the "mazelines" object instead of just referencing it ?
    
    //TODO  check if lines don't overlap with one another => if overlap, create
    //      a new one containing the two lines overlapping (they need to be of
    //      the same type : the 2 with pacdots, or the 2 without pacdots)
    assert((mazelines instanceof Array && mazelines.length > 0), "mazelines is not an array");
    
    var xmin = mazelines[0].getPoint1().getX();
    var ymin = mazelines[0].getPoint1().getY();

    for(var i=1; i<mazelines.length; i++)
    {
        if (mazelines[i].getPoint1().getX() < xmin) {xmin = mazelines[i].getPoint1().getX();}
        if (mazelines[i].getPoint1().getY() < ymin) {ymin = mazelines[i].getPoint1().getY();}
    }
    
    for(var i=0; i<mazelines.length; i++)
    {
        assert((mazelines[i] instanceof Line), "line " + i +" is not a Line");
        assert((((mazelines[i].getPoint1().getX()-xmin) % GRID_UNIT) === 0
             && ((mazelines[i].getPoint1().getY()-ymin) % GRID_UNIT) === 0
             && ((mazelines[i].getPoint2().getX()-xmin) % GRID_UNIT) === 0
             && ((mazelines[i].getPoint2().getY()-ymin) % GRID_UNIT) === 0),
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

Maze.prototype.reinit = function()
{
    this._pacdots.length = 0;
    this._powerpellets.length = 0;
    this._generatePacdots();
};

Maze.createFromArrayOfLitterals = function(mazelines)
{
    assert((mazelines instanceof Array && mazelines.length > 0), "mazelines is not an array");
    
    var xmin = mazelines[0].x1;
    var ymin = mazelines[0].y1;

    for(var i=1; i<mazelines.length; i++)
    {
        if (mazelines[i].x1 < xmin) {xmin = mazelines[i].x1;}
        if (mazelines[i].y1 < ymin) {ymin = mazelines[i].y1;}
    }
    
    for(var i=0; i<mazelines.length; i++)
    {
        assert((typeof mazelines[i].x1 === "number"), "mazelines[" + i + "].x1 value not valid");
        assert((typeof mazelines[i].y1 === "number"), "mazelines[" + i + "].y1 value not valid");
        assert((typeof mazelines[i].x2 === "number"), "mazelines[" + i + "].x2 value not valid");
        assert((typeof mazelines[i].y2 === "number"), "mazelines[" + i + "].y2 value not valid");
        
        var p1 = new Point(mazelines[i].x1, mazelines[i].y1);
        var p2 = new Point(mazelines[i].x2, mazelines[i].y2);
        
        assert((p1.getX() === p2.getX() || p1.getY() === p2.getY()), "mazelines[" + i + "] points value will not create a horizontal nor a vertical line");
        
        assert((((p1.getX()-xmin) % GRID_UNIT) === 0
             && ((p1.getY()-ymin) % GRID_UNIT) === 0
             && ((p2.getX()-xmin) % GRID_UNIT) === 0
             && ((p2.getY()-ymin) % GRID_UNIT) === 0),
             "line n°" + i +" points will not be on the game grid, using " + GRID_UNIT + " pixels unit");
    }
    
    var lines = [];

    for(var i=0; i<mazelines.length; i++)
    {
        var hasPacdots = (typeof mazelines[i].nopacdots === "undefined") ? true : false ;
        var p1 = null;
        var p2 = null;
        
        if (typeof mazelines[i].portalid1 === "undefined")
        {
            p1 = new Point(mazelines[i].x1, mazelines[i].y1);
        }
        else
        {
            p1 = new Point(mazelines[i].x1, mazelines[i].y1, mazelines[i].portalid1);
        }
        
        if (typeof mazelines[i].portalid2 === "undefined")
        {
            p2 = new Point(mazelines[i].x2, mazelines[i].y2);
        }
        else
        {
            p2 = new Point(mazelines[i].x2, mazelines[i].y2, mazelines[i].portalid2);
        }
        
        lines.push(new Line(p1, p2, hasPacdots));
    }
    
    return new Maze(lines);
};

Maze.prototype.getWidth = function()
{
    return this._width;
};

Maze.prototype.getHeight = function()
{
    return this._height;
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
        if (this._mazelines[i].getHasPacdots() === true)
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
                    this._pacdots.push(new Point(line.XAxis(), j));
                }
            }
            else
            {
                start = line.getPoint1().getX();
                end = line.getPoint2().getX();
                
                for(var j=start; j<=end; j+=GRID_UNIT)
                {
                    this._pacdots.push(new Point(j, line.YAxis()));
                }
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

Maze.prototype.isPortal = function(x, y)
{
    assert((typeof x === "number"), "x is not a number");
    assert((typeof y === "number"), "y is not a number");
    
    for(var i=0; i<this._mazelines.length; i++)
    {
        var p1 = this._mazelines[i].getPoint1();
        var p2 = this._mazelines[i].getPoint2();
        
        if ((p1.equals(new Point(x,y)) && p1.isPortal())
         || (p2.equals(new Point(x,y)) && p2.isPortal()))
        {
            return true;
        }
    }
    
    return false;
};

Maze.prototype.associatedPortal = function(x, y)
{
    assert((typeof x === "number"), "x is not a number");
    assert((typeof y === "number"), "y is not a number");
    
    var portalid = 0;
    
    for(var i=0; i<this._mazelines.length; i++)
    {
        var p1 = this._mazelines[i].getPoint1();
        var p2 = this._mazelines[i].getPoint2();
        
        if (p1.equals(new Point(x,y)) && p1.isPortal())
        {
            portalid = p1.getPortalID();
            break;
        }
        
        if (p2.equals(new Point(x,y)) && p2.isPortal())
        {
            portalid = p2.getPortalID();
            break;
        }
    }
    
    for(var i=0; i<this._mazelines.length; i++)
    {
        var p1 = this._mazelines[i].getPoint1();
        var p2 = this._mazelines[i].getPoint2();
        
        if (!p1.equals(new Point(x,y)) && p1.getPortalID() === portalid)
        {
            return p1;
        }
        
        if (!p2.equals(new Point(x,y)) && p2.getPortalID() === portalid)
        {
            return p2;
        }
    }
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
    assert((point instanceof Point), "point is not a Point");
    
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
    assert((point instanceof Point), "point is not a Point");
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
    
    /*
        if we reach this place, that means that the point has a perpendicular
        direction on its current line ; this is only possible when setting the
        pacman on the maze at the beginning
    */
    
    for(var i=0; i<this._mazelines.length; i++)
    {
        line = this._mazelines[i];
        
        if (line.containsPoint(point))
        {
            return line;
        }
    }
};

Maze.prototype.mazeNextTurn = function(line, point, direction, nextdirection)
{
    assert((line instanceof Line), "line is not a Line");
    assert((point instanceof Point), "point is not a Point");
    assert((isDirection(direction)), "direction value is not valid");
    assert((isDirection(nextdirection)), "nextdirection value is not valid");
    
    if ((isVertical(direction) && isVertical(nextdirection))
     || (isHorizontal(direction) && isHorizontal(nextdirection)))
    {
        return;     /* "undefined" */
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
        if (line.isCrossing(new Line(point, new Point(xlimit, ylimit))))
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
        return;     /* "undefined" */
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
            return new Point(nearest, point.getY());
        }
        else
        {
            return new Point(point.getX(), nearest);
        }
    }
};

/******************************** Pacman class ********************************/

var Pacman = function(x, y, direction, maze)
{
    assert((typeof x === "number"), "x is not a number");
    assert((typeof y === "number"), "y is not a number");
    assert((isDirection(direction)), "direction value is not valid");
    assert((maze.containsPoint(new Point(x, y))), "coordinates are not inside the maze");
    assert((maze instanceof Maze), "maze is not a Maze");
    
    this._state = PacmanState.NORMAL;
    
    this._position = new Point(x, y);
    this._direction = direction;
    
    this._nextdirection = null;     // direction requested
    this._nextturn = null;          // intersection that allows movement in the requested direction
    
    this._animtime = 0;
    this._mouthstartangle = 0;
    this._mouthendangle = 2 * Math.PI;
    
    this._currentline = maze.mazeCurrentLine(this._position, this._direction);
};

Pacman.prototype.getState = function()
{
    return this._state;
};

Pacman.prototype.setState = function(state)
{
    assert((isPacmanState(state)), "state value is not valid");

    this._state = state;
};

Pacman.prototype.reinit = function(x, y, direction, maze)
{
    assert((typeof x === "number"), "x is not a number");
    assert((typeof y === "number"), "y is not a number");
    assert((isDirection(direction)), "direction value is not valid");
    assert((maze.containsPoint(new Point(x, y))), "coordinates are not inside the maze");
    assert((maze instanceof Maze), "maze is not a Maze");
    
    this._position.set(x, y);
    this._direction = direction;
    this._nextdirection = null;
    this._nextturn = null;
    this._currentline = maze.mazeCurrentLine(this._position, this._direction);
};

Pacman.prototype.getMouthstartangle = function()
{
    return this._mouthstartangle;
};

Pacman.prototype.getMouthendangle = function()
{
    return this._mouthendangle;
};

Pacman.prototype.getCurrentline = function()
{
    return this._currentline;
};

Pacman.prototype.setCurrentline = function(currentline)
{
    assert((currentline instanceof Line), "currentline value is not valid");

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
    assert((nextturn instanceof Point || nextturn === null), "nextturn value is not valid");

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
        
        this._nextturn = (typeof point === "undefined") ? null : point ;
    }
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

/******************************* game functions *******************************/



/**************************** game event listeners ****************************/

/*
    we also save when the key was pressed, to be able, if there is some system
    lag, to update later the game internal state
*/
var keyEventListener= function(e)
{
    e.preventDefault();         // prevent up and down arrows of moving the page
    pressedkeys.push(e.keyCode);
    pressedkeysdate.push(performance.now());
};

var blurEventListener= function(e)
{
    if (state === GameState.PLAYING)
    {
        state = GameState.PAUSE;
    }
};

/**************************** game loop functions *****************************/

var graphicsLoop = function()
{
    //count1++;
    //tmp2 = performance.now();
    if (state === GameState.PLAYING)
    {
        playingscreen.draw();
    }
    else if (state === GameState.PAUSE)
    {
        pausescreen.draw();
    }
    else    /* state === GameState.MAIN */
    {
        
    }
    //console.log(performance.now()-tmp2);
    requestAnimationFrame(graphicsLoop);
};

var logicLoop = function()
{
    tmp1 = performance.now();
    //count2++;
    //if (performance.now() - firstupdate > 1000) {console.log(count1 + ", " + count2); firstupdate = performance.now(); count1 = 0; count2 = 0;}
    newupdate = performance.now();
    var elapsed = newupdate - lastupdate;
    
    if (pressedkeys.length === 0)
    {
        if (state === GameState.PLAYING)
        {
            playingscreen.move(newupdate - lastupdate);
        }
    }
    else
    {
        /*
            we go through all the pressed keys ; even if there were some system
            lag, the keys will be taken into account
        */
        while (pressedkeys.length > 0)
        {
            var key = pressedkeys.shift();
            var keydate = pressedkeysdate.shift();
            var nextstate = state;
            
            if (state === GameState.PLAYING)
            {
                /*
                    compute the elements movement between the previous update
                    and the pressed key date
                */
                playingscreen.move(keydate - lastupdate);
                nextstate = playingscreen.handleInput(key);
                lastupdate = keydate;
                
                if (nextstate === GameState.PLAYING
                 && pressedkeys.length === 0)
                {
                    /*
                        compute the elements movement between the pressed key
                        date and now
                    */
                    playingscreen.move(newupdate - keydate);
                }
            }
            else if (state === GameState.PAUSE)
            {
                lastupdate = keydate;
                
                nextstate = pausescreen.handleInput(key);
                
                if (nextstate === GameState.PLAYING
                 && pressedkeys.length === 0)
                {
                    /*
                        compute the elements movement between the pressed key
                        date and now
                    */
                    playingscreen.move(newupdate - keydate);
                }
            }
            else    /* state === GameState.MAIN */
            {
                
            }
            
            state = nextstate;
        }
    }
    
    lastupdate = newupdate;
    
    //console.log(performance.now()-tmp1);
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
    - when refreshing, useless to redraw everything, just redraw what was under
    the pacman + ghosts
    - improve pacman graphics : how to create borders automatically ? and the inside walls ?
    - one class pacman and one class ghost, the two inheriting a
    2DAnimatedObject class (containing a static method draw() called in
    updategraphics, and a static method update() called in updatelogic (update
    the position and the animation state), and x/y properties, ... and something
    to animate, like passing the timestamp ? or an other solution ?=> the static
    method update())
    - implement main screen
    - implement a Game class
    - implement ghosts : http://gameinternals.com/post/2072558330/understanding-pac-man-ghost-behavior
    - implement power pellets (a property of pacman)
    - verifier ttes les verifs d'erreurs et ajouter les verifs manquantes, et aussi dans checkconfig()
    - verif les bonnes utilisations de certaines fonctions : par exemple ne pas faire this._position.set() quand on peut faire this._setPosition() !
    - verifier les prop et methodes privées/publiques et statiques
    - mettre currentline pas dans pacman ? (car demande de prendre maze en parametre)
    - ne pas utiliser des coordonnees pour pacman_start, mais mettre un flag dans le maze_lines ! et pr direction de depart alors ? et ghost, faire pareil aussi ?
        => eventuellement mettre ce genre de choses a part ! au lieu de juste utiliser un MAZE_LINES, utiliser un MAP (avec donc un playingscreen.loadmap()) contenant un MAZE_LINES + un PORTALS + un GHOSTS + un PACMANS (contenant donc coord de depart + direction de depart) ?
*/

canvas = document.getElementById("gamecanvas");

context = canvas.getContext("2d");

checkConfiguration();

/* init the game */

playingscreen = new PlayingScreen();
pausescreen = new PauseScreen();

//TODO plus tard, mettre au depart le canvas a la taille prevue pour le menu principal (celles pour les menus avant de jouer) ; ensuite seulement quand on va jouer, verifier entre le playingscreen et le pausescreen pour mettre la bonne taille au canvas (via le loadmapfrom...())

canvas.addEventListener("blur", blurEventListener);
canvas.addEventListener("keydown", keyEventListener);
canvas.focus();

state = GameState.PLAYING;

lastupdate = performance.now();
firstupdate = lastupdate;

/* start the game */

graphicsLoop();
logicLoop();

