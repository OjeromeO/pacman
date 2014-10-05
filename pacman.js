
/******************************************************************************/
/*              global variables, "constants", and enumerations               */
/******************************************************************************/

var Direction = {};
Object.defineProperties(Direction,
{
    "UP":    {value: 1, writable: false, configurable: false, enumerable: true},
    "DOWN":  {value: 2, writable: false, configurable: false, enumerable: true},
    "LEFT":  {value: 3, writable: false, configurable: false, enumerable: true},
    "RIGHT": {value: 4, writable: false, configurable: false, enumerable: true}
});

var PauseMenuItem = {};
Object.defineProperties(PauseMenuItem,
{
    "RESUME":  {value: {id: 0, str: "Resume game"},
                writable: false, configurable: false, enumerable: true},
    "RESTART": {value: {id: 1, str: "Restart game"},
                writable: false, configurable: false, enumerable: true},
    "QUIT":    {value: {id: 2, str: "Return to main menu"},
                writable: false, configurable: false, enumerable: true}
});

var GameState = {};
Object.defineProperties(GameState,
{
    "MAIN":    {value: 1, writable: false, configurable: false, enumerable: true},
    "PAUSE":   {value: 2, writable: false, configurable: false, enumerable: true},
    "PLAYING": {value: 3, writable: false, configurable: false, enumerable: true}
});

var MovableState = {};
Object.defineProperties(MovableState,
{
    "MOVING":   {value: 1, writable: false, configurable: false, enumerable: true},
    "IMMOBILE": {value: 2, writable: false, configurable: false, enumerable: true},
    "PAUSED":   {value: 3, writable: false, configurable: false, enumerable: true}
});

var PacmanMode = {};
Object.defineProperties(PacmanMode,
{
    "NORMAL":   {value: 1, writable: false, configurable: false, enumerable: true},
    "PP_EATEN": {value: 2, writable: false, configurable: false, enumerable: true}
});

var PacmanModeDuration = {};
Object.defineProperties(PacmanModeDuration,
{
    "NORMAL":   {value: -1, writable: false, configurable: false, enumerable: true},
    "PP_EATEN": {value: 3000, writable: false, configurable: false, enumerable: true}
});

var GhostMode = {};
Object.defineProperties(GhostMode,
{
    "ATHOME":      {value: 1, writable: false, configurable: false, enumerable: true},
    "LEAVINGHOME": {value: 2, writable: false, configurable: false, enumerable: true},
    "NORMAL":      {value: 3, writable: false, configurable: false, enumerable: true},
    "FRIGHTENED":  {value: 4, writable: false, configurable: false, enumerable: true},
    "EATEN":       {value: 5, writable: false, configurable: false, enumerable: true}
});

var GhostType = {};
Object.defineProperties(GhostType,
{
    "BLINKY":   {value: 1, writable: false, configurable: false, enumerable: true},
    "PINKY":    {value: 2, writable: false, configurable: false, enumerable: true},
    "INKY":     {value: 3, writable: false, configurable: false, enumerable: true},
    "CLYDE":    {value: 4, writable: false, configurable: false, enumerable: true}
});

var canvas = null;
var context = null;
var lastupdate = null;
var newupdate = null;
var pressedkeys = [];
var pressedkeysdate = [];
var state = null;
var playingstate = null;
var pausestate = null;

var LOGIC_REFRESH_RATE = 60;

var PAUSEMENUITEM_FONT_SIZE = 30;
var PAUSEMENUITEM_FONT_HEIGHT = 1.3 * PAUSEMENUITEM_FONT_SIZE;
var PAUSEMENUITEM_WIDTH = 370;
var PAUSEMENUITEM_HEIGHT = PAUSEMENUITEM_FONT_HEIGHT;

var PAUSEMENU_FONT = "sans-serif";
var PAUSEMENU_HPADDING = 20;
var PAUSEMENU_VPADDING = 20;
var PAUSEMENU_ITEMSDISTANCE = 30;
var PAUSEMENU_WIDTH = 2 * PAUSEMENU_HPADDING + PAUSEMENUITEM_WIDTH;
var PAUSEMENU_HEIGHT = 2 * PAUSEMENU_VPADDING + Object.keys(PauseMenuItem).length * PAUSEMENUITEM_HEIGHT + (Object.keys(PauseMenuItem).length - 1) * PAUSEMENU_ITEMSDISTANCE;

var PACMAN_RADIUS = 12;
var PACDOTS_RADIUS = 2;
var PELLETS_RADIUS = 5;

var PACMAN_SPEED = 300;
var PACMAN_PP_SPEED = PACMAN_SPEED;

var GHOST_SPEED = 100;
var GHOST_ATHOME_SPEED = GHOST_SPEED;
var GHOST_LEAVINGHOME_SPEED = GHOST_SPEED;
var GHOST_FRIGHTENED_SPEED = 80;
var GHOST_EATEN_SPEED = 140;

var LINE_WIDTH = 2 * PACMAN_RADIUS + 8;
var GRID_UNIT = 16;
var PACDOT_POINT = 10;
var PELLET_POINT = 50;

var GHOST_WIDTH = 2 * PACMAN_RADIUS;
var GHOST_LOWERHEIGHT = PACMAN_RADIUS;
var GHOST_TOTALHEIGHT = PACMAN_RADIUS + GHOST_LOWERHEIGHT;

var CANVAS_BORDER_SIZE = 20;

var MAZE_BORDER_SIZE = 10;

var STATUS_LIVES_RADIUS = 10;
var STATUS_FONT_FAMILY = "sans-serif";
var STATUS_FONT_SIZE = 30;
var STATUS_FONT = STATUS_FONT_SIZE + "px " + STATUS_FONT_FAMILY;
var STATUS_PADDINGLEFT = 20;

var STATUS_BORDER_SIZE = 10;
var STATUS_VMARGIN = 5;
var STATUS_VPADDING = 5;
var STATUS_CONTENT_HEIGHT = (1.3 * STATUS_FONT_SIZE > 2 * STATUS_LIVES_RADIUS) ? 1.3 * STATUS_FONT_SIZE : 2 * STATUS_LIVES_RADIUS ;
var STATUS_HEIGHT = 2 * STATUS_VMARGIN + 2 * STATUS_BORDER_SIZE + 2 * STATUS_VPADDING + STATUS_CONTENT_HEIGHT;

var STATUS_HMARGIN = 5;
var STATUS_HPADDING = 15;

var tmpcanvas = document.getElementById("gamecanvas");
var tmpcontext = tmpcanvas.getContext("2d");
tmpcontext.font = STATUS_FONT;

var STATUS_LIVES_INTERSPACE = 10;   // distance between them, and between them and the text
var STATUS_SCORE_CONTENT_WIDTH = tmpcontext.measureText("Score : 9 999 999").width;
var STATUS_LIVES_CONTENT_WIDTH = tmpcontext.measureText("Lives : ").width + 3 * STATUS_LIVES_INTERSPACE + 3 * 2 * STATUS_LIVES_RADIUS;
var STATUS_WIDTH = STATUS_HMARGIN + STATUS_BORDER_SIZE + STATUS_HPADDING + STATUS_SCORE_CONTENT_WIDTH + STATUS_HPADDING + STATUS_BORDER_SIZE + STATUS_HMARGIN + STATUS_BORDER_SIZE + STATUS_HPADDING + STATUS_LIVES_CONTENT_WIDTH + STATUS_HPADDING + STATUS_BORDER_SIZE + STATUS_HMARGIN;



var maps = [];

var MAP_1 =
{
    mazelines:  [
                    /* horizontal lines */

                    {x1: 0,  y1: 0,  x2: 11, y2: 0},
                    {x1: 14, y1: 0,  x2: 25, y2: 0},

                    {x1: 0,  y1: 4,  x2: 25, y2: 4},

                    {x1: 0,  y1: 7,  x2: 5,  y2: 7},
                    {x1: 8,  y1: 7,  x2: 11, y2: 7},
                    {x1: 14, y1: 7,  x2: 17, y2: 7},
                    {x1: 20, y1: 7,  x2: 25, y2: 7},

                    {x1: 8,  y1: 10, x2: 17, y2: 10, nopacdots: "defined"},

                    {x1: 0,  y1: 13, x2: 8,  y2: 13, nopacdots: "defined"},
                    {x1: 17, y1: 13, x2: 25, y2: 13, nopacdots: "defined"},
                    
                    {x1: 10.5, y1: 12.5, x2: 14.5, y2: 12.5, nopacdots: "defined", ghosthouse: "defined"},
                    {x1: 10.5, y1: 13.5, x2: 14.5, y2: 13.5, nopacdots: "defined", ghosthouse: "defined"},

                    {x1: 8,  y1: 16, x2: 17, y2: 16, nopacdots: "defined"},

                    {x1: 0,  y1: 19, x2: 11, y2: 19},
                    {x1: 14, y1: 19, x2: 25, y2: 19},

                    {x1: 0,  y1: 22, x2: 2,  y2: 22},
                    {x1: 5,  y1: 22, x2: 20, y2: 22},
                    {x1: 23, y1: 22, x2: 25, y2: 22},

                    {x1: 0,  y1: 25, x2: 5,  y2: 25},
                    {x1: 8,  y1: 25, x2: 11, y2: 25},
                    {x1: 14, y1: 25, x2: 17, y2: 25},
                    {x1: 20, y1: 25, x2: 25, y2: 25},

                    {x1: 0,  y1: 28, x2: 25, y2: 28},

                    /* vertical lines */

                    {x1: 0,  y1: 0,  x2: 0,  y2: 7},
                    {x1: 5,  y1: 0,  x2: 5,  y2: 25},
                    {x1: 20, y1: 0,  x2: 20, y2: 25},
                    {x1: 25, y1: 0,  x2: 25, y2: 7},

                    {x1: 11, y1: 0,  x2: 11, y2: 4},
                    {x1: 14, y1: 0,  x2: 14, y2: 4},

                    {x1: 8,  y1: 4,  x2: 8,  y2: 7},
                    {x1: 17, y1: 4,  x2: 17, y2: 7},

                    {x1: 11, y1: 7,  x2: 11, y2: 10, nopacdots: "defined"},
                    {x1: 14, y1: 7,  x2: 14, y2: 10, nopacdots: "defined"},
                    
                    {x1: 10.5, y1: 12.5, x2: 10.5, y2: 13.5, nopacdots: "defined", ghosthouse: "defined"},
                    {x1: 11.5, y1: 12.5, x2: 11.5, y2: 13.5, nopacdots: "defined", ghosthouse: "defined"},
                    //{x1: 12.5, y1: 10, x2: 12.5, y2: 13.5, nopacdots: "defined", ghosthouse: "defined"},
                    {x1: 12.5, y1: 12.5, x2: 12.5, y2: 13.5, nopacdots: "defined", ghosthouse: "defined"},
                    {x1: 12.5, y1: 10, x2: 12.5, y2: 12.5, nopacdots: "defined", link: "defined"},
                    {x1: 13.5, y1: 12.5, x2: 13.5, y2: 13.5, nopacdots: "defined", ghosthouse: "defined"},
                    {x1: 14.5, y1: 12.5, x2: 14.5, y2: 13.5, nopacdots: "defined", ghosthouse: "defined"},

                    {x1: 8,  y1: 10, x2: 8,  y2: 19, nopacdots: "defined"},
                    {x1: 17, y1: 10, x2: 17, y2: 19, nopacdots: "defined"},

                    {x1: 0,  y1: 19, x2: 0,  y2: 22},
                    {x1: 11, y1: 19, x2: 11, y2: 22},
                    {x1: 14, y1: 19, x2: 14, y2: 22},
                    {x1: 25, y1: 19, x2: 25, y2: 22},

                    {x1: 2,  y1: 22, x2: 2,  y2: 25},
                    {x1: 8,  y1: 22, x2: 8,  y2: 25},
                    {x1: 17, y1: 22, x2: 17, y2: 25},
                    {x1: 23, y1: 22, x2: 23, y2: 25},

                    {x1: 0,  y1: 25, x2: 0,  y2: 28},
                    {x1: 11, y1: 25, x2: 11, y2: 28},
                    {x1: 14, y1: 25, x2: 14, y2: 28},
                    {x1: 25, y1: 25, x2: 25, y2: 28}
                ],
    
    pellets:    [
                    {x: 0,  y:  0},
                    {x: 0,  y:  6}
                ],
    
    portals:    [
                    {x: 0,  y: 13, id: 1},
                    {x: 25, y: 13, id: 1}
                ],
    
    pacman:     {
                    x:          14,
                    y:          22,
                    direction:  Direction.LEFT
                },
    ghosts:     [
                    {id: GhostType.BLINKY, x: 12.5, y: 10, direction: Direction.LEFT},
                    {id: GhostType.INKY,   x: 10.5, y: 13.5, direction: Direction.UP},
                    {id: GhostType.PINKY,  x: 12.5, y: 13.5, direction: Direction.UP},
                    {id: GhostType.CLYDE,  x: 14.5, y: 13.5, direction: Direction.UP}
                ]
};

maps.push(MAP_1);

/*
var count1 = 0;
var count2 = 0;
var firstupdate = 0;
*/

//var tmp1 = 0;
//var tmp2 = 0;



/******************************************************************************/
/*                             utilities functions                            */
/******************************************************************************/

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

var isVirtualKeyCode = function(code)
{
    if (typeof code === "number"
     && code >= 0)
    {
        return true;
    }
    else
    {
        return false;
    }
};

var isDirection = function(direction)
{
    if (typeof direction === "number"
     && (direction === Direction.UP
      || direction === Direction.DOWN
      || direction === Direction.RIGHT
      || direction === Direction.LEFT))
    {
        return true;
    }
    else
    {
        return false;
    }
};

var oppositeDirection = function(direction)
{
    if (direction === Direction.UP)             {return Direction.DOWN;}
    else if (direction === Direction.DOWN)      {return Direction.UP;}
    else if (direction === Direction.RIGHT)     {return Direction.LEFT;}
    else if (direction === Direction.LEFT)      {return Direction.RIGHT;}
};

var areDirectionsParallel = function(direction1, direction2)
{
    return ((isVertical(direction1) && isVertical(direction2))
         || (isHorizontal(direction1) && isHorizontal(direction2)));
};

var isMovableState = function(state)
{
    if (state === MovableState.MOVING
     || state === MovableState.IMMOBILE
     || state === MovableState.PAUSED)
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

var isPacmanMode = function(state)
{
    if (typeof state === "number"
     && (state === PacmanMode.NORMAL
      || state === PacmanMode.PP_EATEN))
    {
        return true;
    }
    else
    {
        return false;
    }
};

var isGhostMode = function(state)
{
    if (typeof state === "number"
     && (state === GhostMode.NORMAL
      || state === GhostMode.EATABLE))
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
    if (typeof item === "string"
     && (item === PauseMenuItem.RESUME
      || item === PauseMenuItem.QUIT
      || item === PauseMenuItem.RESTART))
    {
        return true;
    }
    else
    {
        return false;
    }
};

var isVertical = function(arg)
{
    assert((arg instanceof Line || isDirection(arg)), "argument is not a Direction nor a Line");
    
    if (arg instanceof Line)
    {
        if (arg.getPoint1().getX() === arg.getPoint2().getX()
         && arg.getPoint1().getY() === arg.getPoint2().getY())
        {
            return false;
        }
        
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
        if (arg.getPoint1().getX() === arg.getPoint2().getX()
         && arg.getPoint1().getY() === arg.getPoint2().getY())
        {
            return false;
        }
        
        return (arg.getPoint1().getY() === arg.getPoint2().getY()) ? true : false ;
    }
    else
    {
        return (arg === Direction.LEFT || arg === Direction.RIGHT) ? true : false ;
    }
};

/*
var speedFromMode = function(mode)
{
    if (mode === PacmanMode.NORMAL)             {return PACMAN_SPEED;}
    else if (mode === PacmanMode.PP_EATEN)      {return PACMAN_PP_SPEED;}
    
    else if (mode === GhostMode.ATHOME)         {return GHOST_ATHOME_SPEED;}
    else if (mode === GhostMode.LEAVINGHOME)    {return GHOST_LEAVINGHOME_SPEED;}
    else if (mode === GhostMode.NORMAL)         {return GHOST_SPEED;}
    else if (mode === GhostMode.FRIGHTENED)     {return GHOST_FRIGHTENED_SPEED;}
    else if (mode === GhostMode.EATEN)          {return GHOST_EATEN_SPEED;}
};
*/

var concatenateLines = function(line1, line2)
{
    var minp1 = null;
    var maxp2 = null;
    
    if (line1.getPoint1().getX() <= line2.getPoint1().getX()
     && line1.getPoint1().getY() <= line2.getPoint1().getY())
    {
        minp1 = new Point(line1.getPoint1().getX(), line1.getPoint1().getY());
    }
    else
    {
        minp1 = new Point(line2.getPoint1().getX(), line2.getPoint1().getY());
    }
    
    if (line1.getPoint2().getX() >= line2.getPoint2().getX()
     && line1.getPoint2().getY() >= line2.getPoint2().getY())
    {
        maxp2 = new Point(line1.getPoint2().getX(), line1.getPoint2().getY());
    }
    else
    {
        maxp2 = new Point(line2.getPoint2().getX(), line2.getPoint2().getY());
    }
    
    return new Line(minp1, maxp2);
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
    assert((typeof MAP_1.pacman.x === "number"), "MAP_1.pacman.x value not valid");
    assert((typeof MAP_1.pacman.y === "number"), "MAP_1.pacman.y value not valid");
    assert((isDirection(MAP_1.pacman.direction)), "MAP_1.pacman.direction value not valid");
    assert((MAP_1.mazelines instanceof Array && MAP_1.mazelines.length > 0), "MAP_1.mazelines value not valid");
    
    /* 
        this will hold the X/Y "padding" for the maze the user gave us,
        and will allow us to check if the lines are on the game grid
        (cf GRID_UNIT)
    */
    var xmin = MAP_1.mazelines[0].x1;
    var ymin = MAP_1.mazelines[0].y1;
    
    var pacman = new Point(MAP_1.pacman.x, MAP_1.pacman.y);
    var isPacmanInMaze = false;

    for(var i=0; i<MAP_1.mazelines.length; i++)
    {
        assert((typeof MAP_1.mazelines[i].x1 === "number"), "MAP_1.mazelines[" + i + "].x1 value not valid");
        assert((typeof MAP_1.mazelines[i].y1 === "number"), "MAP_1.mazelines[" + i + "].y1 value not valid");
        assert((typeof MAP_1.mazelines[i].x2 === "number"), "MAP_1.mazelines[" + i + "].x2 value not valid");
        assert((typeof MAP_1.mazelines[i].y2 === "number"), "MAP_1.mazelines[" + i + "].y2 value not valid");
        
        var p1 = new Point(MAP_1.mazelines[i].x1, MAP_1.mazelines[i].y1);
        var p2 = new Point(MAP_1.mazelines[i].x2, MAP_1.mazelines[i].y2);
        
        assert((p1.getX() === p2.getX() || p1.getY() === p2.getY()), "MAP_1.mazelines[" + i + "] points value will not create a horizontal nor a vertical line");
        
        var l = new Line(p1, p2);
        
        if (l.containsPoint(pacman)) {isPacmanInMaze = true;}
        
        if (l.getPoint1().getX() < xmin) {xmin = l.getPoint1().getX();}
        if (l.getPoint1().getY() < ymin) {ymin = l.getPoint1().getY();}
    }
    
    assert((isPacmanInMaze), "MAP_1.pacman coordinates are not inside the maze");
    
    for(var i=0; i<MAP_1.mazelines.length; i++)
    {
        assert((((MAP_1.mazelines[i].x1-xmin) % GRID_UNIT) === 0
             && ((MAP_1.mazelines[i].y1-ymin) % GRID_UNIT) === 0
             && ((MAP_1.mazelines[i].x2-xmin) % GRID_UNIT) === 0
             && ((MAP_1.mazelines[i].y2-ymin) % GRID_UNIT) === 0),
             "MAP_1.mazelines[" + i +"] points are not on the game grid, using " + GRID_UNIT + " pixels unit");
    }
};



/******************************************************************************/
/* -> classes for geometric elements/shapes data :                            */
/*     -> Point, Circle, Rectangle, Line                                      */
/*     -> translate(x, y), setPosition(x, y)                                  */
/*                                                                            */
/* -> corresponding "Drawable" classes, that extend the base classes          */
/*     -> DrawableCircle, ...                                                 */
/*     -> draw()                                                              */
/******************************************************************************/



/******************************************************************************/
/********************************* Point class ********************************/
/******************************************************************************/

var Point = function(x, y)
{
    assert((typeof x === "number"), "x is not a number");
    assert((typeof y === "number"), "y is not a number");
    
    this._x = x;
    this._y = y;
};

Point.prototype.getX = function()
{
    return this._x;
};

Point.prototype.setX = function(x)
{
    assert((typeof x === "number"), "x is not a number");
    
    this._x = x;
};

Point.prototype.getY = function()
{
    return this._y;
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

Point.prototype.translate = function(x, y)
{
    assert((typeof x === "number"), "x is not a number");
    assert((typeof y === "number"), "y is not a number");
    
    this._x += x;
    this._y += y;
};

Point.prototype.setPosition = function(x, y)
{
    this.set(x, y);
};

Point.prototype.equals = function(x, y)
{
    assert((typeof x === "number"), "x is not a number");
    assert((typeof y === "number"), "y is not a number");
    
    return (this._x === x && this._y === y);
};

Point.prototype.equalsPoint = function(point)
{
    assert((point instanceof Point), "point is not a Point");
    
    return (this._x === point.getX() && this._y === point.getY());
};

Point.prototype.distanceTo = function(x, y)
{
    assert((typeof x === "number"), "x is not a number");
    assert((typeof y === "number"), "y is not a number");
    
    return Math.sqrt(Math.pow(x-this._x, 2) + Math.pow(y-this._y, 2));
};

Point.prototype.distanceToPoint = function(point)
{
    assert((point instanceof Point), "point is not a Point");
    
    return Math.sqrt(Math.pow(point.getX()-this._x, 2) + Math.pow(point.getY()-this._y, 2));
};

/******************************************************************************/
/********************************* Circle class *******************************/
/******************************************************************************/

var Circle = function(x, y, radius)
{
    assert((typeof x === "number"), "x is not a number");
    assert((typeof y === "number"), "y is not a number");
    assert((typeof radius === "number"), "radius is not a number");
    
    this._position = new Point(x, y);
    this._radius = radius;
};

Circle.prototype.getPosition = function()
{
    return this._position;
};

Circle.prototype.setPosition = function(x, y)
{
    assert((typeof x === "number"), "x is not a number");
    assert((typeof y === "number"), "y is not a number");
    
    this._position.set(x, y);
};

Circle.prototype.getRadius = function()
{
    return this._radius;
};

Circle.prototype.setRadius = function(radius)
{
    assert((typeof radius === "number"), "radius is not a number");
    
    this._radius = radius;
};

Circle.prototype.translate = function(x, y)
{
    assert((typeof x === "number"), "x is not a number");
    assert((typeof y === "number"), "y is not a number");
    
    this._position.translate(x, y);
};


/*************************** DrawableCircle class *****************************/


var DrawableCircle = function(x, y, radius, filled)
{
    assert((typeof x === "number"), "x is not a number");
    assert((typeof y === "number"), "y is not a number");
    assert((typeof radius === "number"), "radius is not a number");
    assert(((typeof filled === "undefined") || typeof filled === "boolean"), "filled is not a boolean");
    
    Circle.call(this, x, y, radius);
    
    this._filled = (typeof filled === "undefined") ? true : filled ;
};

DrawableCircle.prototype = Object.create(Circle.prototype);
DrawableCircle.prototype.constructor = DrawableCircle;

DrawableCircle.prototype.draw = function()
{
    context.beginPath();
    context.arc(this._position.getX(),
                this._position.getY(),
                this._radius,
                0,
                2 * Math.PI);
    
    if (this._filled)
    {
        context.fill();
    }
    else
    {
        context.stroke();
    }
};

DrawableCircle.prototype.drawInPath = function()
{
    context.arc(this._position.getX(),
                this._position.getY(),
                this._radius,
                0,
                2 * Math.PI);
};

/******************************************************************************/
/******************************** Rectangle class *****************************/
/******************************************************************************/

var Rectangle = function(x, y, w, h)
{
    assert((typeof x === "number"), "x is not a number");
    assert((typeof y === "number"), "y is not a number");
    assert((typeof w === "number"), "w is not a number");
    assert((typeof h === "number"), "h is not a number");
    
    this._position = new Point(x, y);
    this._w = w;
    this._h = h;
};

Rectangle.prototype.getPosition = function()
{
    return this._position;
};

Rectangle.prototype.setPosition = function(x, y)
{
    assert((typeof x === "number"), "x is not a number");
    assert((typeof y === "number"), "y is not a number");
    
    this._position.set(x, y);
};

Rectangle.prototype.getWidth = function()
{
    return this._w;
};

Rectangle.prototype.getHeight = function()
{
    return this._h;
};

Rectangle.prototype.setWidth = function(w)
{
    assert((typeof w === "number"), "w is not a number");
    
    this._w = w;
};

Rectangle.prototype.setHeight = function(h)
{
    assert((typeof h === "number"), "h is not a number");
    
    this._h = h;
};

Rectangle.prototype.translate = function(x, y)
{
    assert((typeof x === "number"), "x is not a number");
    assert((typeof y === "number"), "y is not a number");
    
    this._position.translate(x, y);
};


/************************** DrawableRectangle class ***************************/


var DrawableRectangle = function(x, y, w, h, filled)
{
    assert((typeof x === "number"), "x is not a number");
    assert((typeof y === "number"), "y is not a number");
    assert((typeof w === "number"), "w is not a number");
    assert((typeof h === "number"), "h is not a number");
    assert(((typeof filled === "undefined") || typeof filled === "boolean"), "filled is not a boolean");
    
    Rectangle.call(this, x, y, w, h);
    
    this._filled = (typeof filled === "undefined") ? true : filled ;
};

DrawableRectangle.prototype = Object.create(Rectangle.prototype);
DrawableRectangle.prototype.constructor = DrawableRectangle;

DrawableRectangle.prototype.getIsFilled = function()
{
    return this._filled;
};

DrawableRectangle.prototype.setIsFilled = function(filled)
{
    assert((typeof filled === "boolean"), "isfilled is not a boolean");
    
    this._filled = filled;
};

DrawableRectangle.prototype.draw = function()
{
    if (this._filled)
    {
        context.fillRect(this._position.getX(), this._position.getY(), this._w, this._h);
    }
    else
    {
        context.strokeRect(this._position.getX(), this._position.getY(), this._w, this._h);
    }
};

/******************************************************************************/
/********************************* Line class *********************************/
/******************************************************************************/

/*
    - Line creates horizontal or vertical lines
    - Line ensures that _point1 property is the left-most and the top-most (the way
      the constructor ensures that is only valid for horizontal or vertical lines)
*/
var Line = function(point1, point2)
{
    assert((point1 instanceof Point), "point1 is not a Point");
    assert((point2 instanceof Point), "point2 is not a Point");
    assert((point1.getX() === point2.getX() || point1.getY() === point2.getY()),
           "points will not create a horizontal nor a vertical line");
    
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

Line.prototype.getPoint1 = function()
{
    return this._point1;
};

Line.prototype.getPoint2 = function()
{
    return this._point2;
};

Line.prototype.set = function(point1, point2)
{
    assert((point1 instanceof Point), "point1 is not a Point");
    assert((point2 instanceof Point), "point2 is not a Point");
    assert((point1.getX() === point2.getX() || point1.getY() === point2.getY()),
           "points will not create a horizontal nor a vertical line");
    
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

Line.prototype.translate = function(x, y)
{
    assert((typeof x === "number"), "x is not a number");
    assert((typeof y === "number"), "y is not a number");
    
    this._point1.translate(x,y);
    this._point2.translate(x,y);
};

Line.prototype.setPosition = function(x, y)
{
    assert((typeof x === "number"), "x is not a number");
    assert((typeof y === "number"), "y is not a number");
    
    var xDiff = x - this._point1.getX();
    var yDiff = y - this._point1.getY();
    
    this._point1.set(x, y);
    this._point2.translate(xDiff, yDiff);
};

Line.prototype.size = function()
{
    if (isVertical(this))
    {
        return (this._point2.getY() - this._point1.getY());
    }
    else if (isHorizontal(this))
    {
        return (this._point2.getX() - this._point1.getX());
    }
    else    // line is a point
    {
        return 0;
    }
};

Line.prototype.XAxis = function()
{
    if (isHorizontal(this) !== true)
    {
        return this._point1.getX();
    }
};

Line.prototype.YAxis = function()
{
    if (isVertical(this) !== true)
    {
        return this._point1.getY();
    }
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

Line.prototype.isPoint = function()
{
    return (this._point1.getX() === this._point2.getX() && this._point1.getY() === this._point2.getY());
};

Line.prototype.isCrossing = function(line)
{
    assert((line instanceof Line), "line is not a Line");
    
    if ((isVertical(this) && isVertical(line))
     || (isHorizontal(this) && isHorizontal(line)))
    {
        return false;
    }
    
    if ((this.isInYIntervalOf(line) && line.isInXIntervalOf(this))
     || (this.isInXIntervalOf(line) && line.isInYIntervalOf(this)))
    {
        return true;
    }
    else
    {
        return false;
    }
};

Line.prototype.intersectionPointWith = function(line)
{
    if (this.isParallelTo(line))
    {
        return;
    }
    
    var x = null;
    var y = null;
    
    if (isVertical(this))                   {x = this.XAxis();}
    else if (isHorizontal(this))            {y = this.YAxis();}
    else    /* the "line" is a point... */  {x = this.XAxis(); y = this.YAxis();}
    
    if (isVertical(line))                   {x = line.XAxis();}
    else if (isHorizontal(line))            {y = line.YAxis();}
    else    /* the "line" is a point... */  {x = line.XAxis(); y = line.YAxis();}
    
    return new Point(x, y);
};

Line.prototype.isParallelTo = function(line)
{
    return ((isVertical(this) && isVertical(line)) || (isHorizontal(this) && isHorizontal(line)));
};

Line.prototype.isParallelToDirection = function(direction)
{
    return ((isVertical(this) && isVertical(direction)) || (isHorizontal(this) && isHorizontal(direction)));
};

Line.prototype.containsPoint = function(point)
{
    assert((point instanceof Point), "point is not a Point");
    
    if (point.getY() >= this._point1.getY() && point.getY() <= this._point2.getY()
     && point.getX() >= this._point1.getX() && point.getX() <= this._point2.getX())
    {
        return true;
    }
    else
    {
        return false;
    }
};

Line.prototype.isExtremity = function(point)
{
    assert((point instanceof Point), "point is not a Point");
    
    if (this._point1.equalsPoint(point)
     || this._point2.equalsPoint(point))
    {
        return true;
    }
    else
    {
        return false;
    }
};

Line.prototype.extremity = function(direction)
{
    assert(isDirection(direction), "direction is not a Direction");
    
    if (direction === Direction.UP)           {return new Point(this._point1.getX(), this._point1.getY());}
    else if (direction === Direction.RIGHT)   {return new Point(this._point2.getX(), this._point2.getY());}
    else if (direction === Direction.DOWN)    {return new Point(this._point2.getX(), this._point2.getY());}
    else if (direction === Direction.LEFT)    {return new Point(this._point1.getX(), this._point1.getY());}
};

Line.prototype.pointAtDistance = function(distance, direction)
{
    assert(isDirection(direction), "direction is not a Direction");
    assert((typeof distance === "number"), "distance is not a number");
    assert((distance >= 0), "distance is negative");
    
    var p = this.extremity(oppositeDirection(direction));
    var p2 = this.extremity(direction);
    
    if (distance >= p.distanceToPoint(p2))
    {
        return p2;
    }
    
    if (direction === Direction.UP)           {p.translate(0, -1 * distance);}
    else if (direction === Direction.RIGHT)   {p.translate(distance, 0);}
    else if (direction === Direction.DOWN)    {p.translate(0, distance);}
    else if (direction === Direction.LEFT)    {p.translate(-1 * distance, 0);}
    
    return p;
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



/******************************************************************************/
/* -> maze immobile elements classes :                                        */
/*     -> Portal, Pacdot, Corridor                                            */
/*     -> _generateGraphics(), translate(x, y), setPosition(x, y), draw()     */
/******************************************************************************/



/******************************************************************************/
/********************************* Portal class *******************************/
/******************************************************************************/

var Portal = function(x, y, id)
{
    assert((typeof x === "number"), "x is not a number");
    assert((typeof y === "number"), "y is not a number");
    assert((isPortalID(id)), "id is not a portal ID");
    
    this._position = new Point(x, y);
    this._id = id ;
    
    this._graphicsrect = null;
    
    this._generateGraphics();
};

Portal.prototype._generateGraphics = function()
{
    var rect = new DrawableRectangle(this._position.getX() - LINE_WIDTH/2,
                                     this._position.getY() - LINE_WIDTH/2,
                                     LINE_WIDTH,
                                     LINE_WIDTH,
                                     true);
    
    this._graphicsrect = rect;
};

Portal.prototype.getPosition = function()
{
    return this._position;
};

Portal.prototype.setPosition = function(x, y)
{
    assert((typeof x === "number"), "x is not a number");
    assert((typeof y === "number"), "y is not a number");
    
    this._position.setPosition(x, y);
    this._graphicsrect.setPosition(this._position.getX() - LINE_WIDTH/2,
                                   this._position.getY() - LINE_WIDTH/2);
};

Portal.prototype.getID = function()
{
    return this._id;
};

Portal.prototype.setID = function(id)
{
    assert((isPortalID(id)), "id is not a portal ID");
    
    this._id = id;
};

Portal.prototype.translate = function(x, y)
{
    assert((typeof x === "number"), "x is not a number");
    assert((typeof y === "number"), "y is not a number");
    
    this._position.translate(x, y);
    this._graphicsrect.translate(x, y);
};

Portal.prototype.draw = function()
{
    context.fillStyle = "green";
    
    this._graphicsrect.draw();
};

/******************************************************************************/
/********************************* Pacdot class *******************************/
/******************************************************************************/

var Pacdot = function(x, y)
{
    assert((typeof x === "number"), "x is not a number");
    assert((typeof y === "number"), "y is not a number");
    
    this._position = new Point(x, y);
    
    this._graphicscircle = null;
    
    this._generateGraphics();
};

Pacdot.prototype._generateGraphics = function()
{
    var circle = new DrawableCircle(this._position.getX(),
                                    this._position.getY(),
                                    PACDOTS_RADIUS,
                                    true);
    
    this._graphicscircle = circle;
};

Pacdot.prototype.getPosition = function()
{
    return this._position;
};

Pacdot.prototype.setPosition = function(x, y)
{
    assert((typeof x === "number"), "x is not a number");
    assert((typeof y === "number"), "y is not a number");
    
    this._position.set(x, y);
    this._graphicscircle.setPosition(this._position.getX(),
                                     this._position.getY());
};

Pacdot.prototype.translate = function(x, y)
{
    assert((typeof x === "number"), "x is not a number");
    assert((typeof y === "number"), "y is not a number");
    
    this._position.translate(x, y);
    this._graphicscircle.translate(x, y);
};

Pacdot.prototype.draw = function()
{
    context.fillStyle = "white";
    
    this._graphicscircle.draw();
};

/******************************************************************************/
/********************************* Pellet class *******************************/
/******************************************************************************/

var Pellet = function(x, y)
{
    assert((typeof x === "number"), "x is not a number");
    assert((typeof y === "number"), "y is not a number");
    
    this._position = new Point(x, y);
    
    this._graphicscircle = null;
    
    this._generateGraphics();
};

Pellet.prototype._generateGraphics = function()
{
    var circle = new DrawableCircle(this._position.getX(),
                                    this._position.getY(),
                                    PELLETS_RADIUS,
                                    true);
    
    this._graphicscircle = circle;
};

Pellet.prototype.getPosition = function()
{
    return this._position;
};

Pellet.prototype.setPosition = function(x, y)
{
    assert((typeof x === "number"), "x is not a number");
    assert((typeof y === "number"), "y is not a number");
    
    this._position.set(x, y);
    this._graphicscircle.setPosition(this._position.getX(),
                                     this._position.getY());
};

Pellet.prototype.translate = function(x, y)
{
    assert((typeof x === "number"), "x is not a number");
    assert((typeof y === "number"), "y is not a number");
    
    this._position.translate(x, y);
    this._graphicscircle.translate(x, y);
};

Pellet.prototype.draw = function()
{
    context.fillStyle = "white";
    
    this._graphicscircle.draw();
};

/******************************************************************************/
/******************************** Corridor class ******************************/
/******************************************************************************/

var Corridor = function(point1, point2)
{
    assert((point1 instanceof Point), "point1 is not a Point");
    assert((point2 instanceof Point), "point2 is not a Point");
    assert((point1.getX() === point2.getX() || point1.getY() === point2.getY()),
           "points will not create a horizontal nor a vertical line");
    
    this._line = new Line(point1, point2);
    
    this._graphicsrect = null;
    
    this._generateGraphics();
};

Corridor.prototype._generateGraphics = function()
{
    var rect = new DrawableRectangle(this._line.getPoint1().getX() - LINE_WIDTH/2,
                                     this._line.getPoint1().getY() - LINE_WIDTH/2,
                                     (isVertical(this._line)) ? LINE_WIDTH : this._line.size() + LINE_WIDTH,
                                     (isVertical(this._line)) ? this._line.size() + LINE_WIDTH : LINE_WIDTH,
                                     true);
    
    this._graphicsrect = rect;
};

Corridor.prototype.getLine = function()
{
    return this._line;
};

Corridor.prototype.setLine = function(point1, point2)
{
    assert((point1 instanceof Point), "point1 is not a Point");
    assert((point2 instanceof Point), "point2 is not a Point");
    assert((point1.getX() === point2.getX() || point1.getY() === point2.getY()),
           "points will not create a horizontal nor a vertical line");
    
    this._line.set(point1, point2);
    
    this._graphicsrect.setPosition(this._line.getPoint1().getX() - LINE_WIDTH/2,
                                   this._line.getPoint1().getY() - LINE_WIDTH/2);
};

Corridor.prototype.setPosition = function(x, y)
{
    assert((typeof x === "number"), "x is not a number");
    assert((typeof y === "number"), "y is not a number");
    
    this._line.setPosition(x, y);
    this._graphicsrect.setPosition(x - LINE_WIDTH/2,
                                   y - LINE_WIDTH/2);
};

Corridor.prototype.translate = function(x, y)
{
    assert((typeof x === "number"), "x is not a number");
    assert((typeof y === "number"), "y is not a number");
    
    this._line.translate(x, y);
    this._graphicsrect.translate(x, y);
};

Corridor.prototype.draw = function()
{
    context.fillStyle = "black";
    
    this._graphicsrect.draw();
};

/******************************************************************************/
/********************************* Map class **********************************/
/******************************************************************************/

/*
    Map returns only a copy of the loaded data
*/
var Map = function(litteral)
{
    // loaded data
    this._corridorlines = [];
    this._ghosthouselines = [];
    this._linklines = [];
    this._pacdotsposition = [];
    this._pelletsposition = [];
    this._portalsposition = [];
    this._portalsid = [];
    this._pacmanPosition = null;
    this._pacmanDirection = null;
    this._ghostsPosition = [];
    this._ghostsDirection = [];
    this._ghostsId = [];
    
    //computed data
    this._topleft = null;
    this._bottomright = null;
    this._height = 0;
    this._width = 0;

    /*
        load pacman
    */
    
    this._pacmanPosition = new Point(litteral.pacman.x * GRID_UNIT, litteral.pacman.y * GRID_UNIT);
    this._pacmanDirection = litteral.pacman.direction;
    
    /*
        load ghosts
    */
    
    for(var i=0; i<litteral.ghosts.length; i++)
    {
        this._ghostsPosition.push(new Point(litteral.ghosts[i].x * GRID_UNIT, litteral.ghosts[i].y * GRID_UNIT));
        this._ghostsDirection.push(litteral.ghosts[i].direction);
        this._ghostsId.push(litteral.ghosts[i].id);
    }

    /*
        load lines and pacdots, compute minimum and maximum coordinates
    */
    
    var xmin = litteral.mazelines[0].x1 * GRID_UNIT;
    var ymin = litteral.mazelines[0].y1 * GRID_UNIT;
    var xmax = litteral.mazelines[0].x1 * GRID_UNIT;
    var ymax = litteral.mazelines[0].y1 * GRID_UNIT;
    
    for(var i=0; i<litteral.mazelines.length; i++)
    {
        var line = new Line(new Point(litteral.mazelines[i].x1 * GRID_UNIT, litteral.mazelines[i].y1 * GRID_UNIT),
                            new Point(litteral.mazelines[i].x2 * GRID_UNIT, litteral.mazelines[i].y2 * GRID_UNIT));
        
        // load corridor lines and ghosthouse lines and link lines
        if (typeof litteral.mazelines[i].ghosthouse !== "undefined")
        {
            this._ghosthouselines.push(line);
        }
        else if (typeof litteral.mazelines[i].link !== "undefined")
        {
            this._linklines.push(line);
        }
        else
        {
            this._corridorlines.push(line);
        }
        
        // load pacdots
        if (typeof litteral.mazelines[i].nopacdots === "undefined")
        {
            var start = 0;
            var end = 0;
            
            if (isVertical(line))
            {
                start = line.getPoint1().getY();
                end = line.getPoint2().getY();
            }
            else
            {
                start = line.getPoint1().getX();
                end = line.getPoint2().getX();
            }
            
            for(var j=start; j<=end; j+=GRID_UNIT)
            {
                var p = (isVertical(line)) ? new Point(line.XAxis(), j) : new Point(j, line.YAxis()) ;
                var exists = false;
                
                for(var k=0; k<this._pacdotsposition.length; k++)
                {
                    if (p.equalsPoint(this._pacdotsposition[k]))
                    {
                        exists = true;
                        break;
                    }
                }
                
                if (!exists)
                {
                    this._pacdotsposition.push(p);
                }
            }
        }
        
        // compute minimum and maximum coordinates
        if (litteral.mazelines[i].x1 * GRID_UNIT < xmin) {xmin = litteral.mazelines[i].x1 * GRID_UNIT;}
        if (litteral.mazelines[i].x2 * GRID_UNIT < xmin) {xmin = litteral.mazelines[i].x2 * GRID_UNIT;}
        if (litteral.mazelines[i].y1 * GRID_UNIT < ymin) {ymin = litteral.mazelines[i].y1 * GRID_UNIT;}
        if (litteral.mazelines[i].y2 * GRID_UNIT < ymin) {ymin = litteral.mazelines[i].y2 * GRID_UNIT;}
        
        if (litteral.mazelines[i].x1 * GRID_UNIT > xmax) {xmax = litteral.mazelines[i].x1 * GRID_UNIT;}
        if (litteral.mazelines[i].x2 * GRID_UNIT > xmax) {xmax = litteral.mazelines[i].x2 * GRID_UNIT;}
        if (litteral.mazelines[i].y1 * GRID_UNIT > ymax) {ymax = litteral.mazelines[i].y1 * GRID_UNIT;}
        if (litteral.mazelines[i].y2 * GRID_UNIT > ymax) {ymax = litteral.mazelines[i].y2 * GRID_UNIT;}
    }
    
    /*
        load pellets
    */
    
    for(var i=0; i<litteral.pellets.length; i++)
    {
        this._pelletsposition.push(new Point(litteral.pellets[i].x * GRID_UNIT, litteral.pellets[i].y * GRID_UNIT));
    }
    
    /*
        load portals
    */
    
    for(var i=0; i<litteral.portals.length; i++)
    {
        this._portalsposition.push(new Point(litteral.portals[i].x * GRID_UNIT, litteral.portals[i].y * GRID_UNIT));
        this._portalsid.push(litteral.portals[i].id);
    }
    
    /*
        compute size and top left and bottom right corner
    */
    
    this._height = ymax - ymin;
    this._width = xmax - xmin;
    
    this._topleft = new Point(xmin,ymin);
    this._bottomright = new Point(xmax,ymax);
};

Map.prototype.getTopLeft = function()
{
    return new Point(this._topleft.getX(), this._topleft.getY());
};

Map.prototype.getBottomRight = function()
{
    return new Point(this._bottomright.getX(), this._bottomright.getY());
};

Map.prototype.getHeight = function()
{
    return this._height;
};

Map.prototype.getWidth = function()
{
    return this._width;
};

Map.prototype.getCorridors = function()
{
    var corridors = [];
    
    for(var i=0;i<this._corridorlines.length;i++)
    {
        corridors.push(new Corridor(new Point(this._corridorlines[i].getPoint1().getX(), this._corridorlines[i].getPoint1().getY()),
                                    new Point(this._corridorlines[i].getPoint2().getX(), this._corridorlines[i].getPoint2().getY())));
    }
    
    return corridors;
};

Map.prototype.getGhosthouse = function()
{
    var ghosthouse = [];
    
    for(var i=0;i<this._ghosthouselines.length;i++)
    {
        ghosthouse.push(new Corridor(new Point(this._ghosthouselines[i].getPoint1().getX(), this._ghosthouselines[i].getPoint1().getY()),
                                     new Point(this._ghosthouselines[i].getPoint2().getX(), this._ghosthouselines[i].getPoint2().getY())));
    }
    
    return ghosthouse;
};

Map.prototype.getLinks = function()
{
    var links = [];
    
    for(var i=0;i<this._linklines.length;i++)
    {
        links.push(new Corridor(new Point(this._linklines[i].getPoint1().getX(), this._linklines[i].getPoint1().getY()),
                                     new Point(this._linklines[i].getPoint2().getX(), this._linklines[i].getPoint2().getY())));
    }
    
    return links;
};

Map.prototype.getPacdots = function()
{
    var pacdots = [];
    
    for(var i=0;i<this._pacdotsposition.length;i++)
    {
        pacdots.push(new Pacdot(this._pacdotsposition[i].getX(), this._pacdotsposition[i].getY()));
    }
    
    return pacdots;
};

Map.prototype.getPellets = function()
{
    var pellets = [];
    
    for(var i=0;i<this._pelletsposition.length;i++)
    {
        pellets.push(new Pellet(this._pelletsposition[i].getX(), this._pelletsposition[i].getY()));
    }
    
    return pellets;
};

Map.prototype.getPortals = function()
{
    var portals = [];
    
    for(var i=0;i<this._portalsposition.length;i++)
    {
        portals.push(new Portal(this._portalsposition[i].getX(), this._portalsposition[i].getY(), this._portalsid[i]));
    }
    
    return portals;
};

Map.prototype.getPacman = function()
{
    return new Pacman(this._pacmanPosition.getX(), this._pacmanPosition.getY(), MovableState.MOVING, this._pacmanDirection);
};

Map.prototype.getGhosts = function()
{
    var ghosts = [];
    
    for(var i=0; i<this._ghostsPosition.length; i++)
    {
        ghosts.push(new Ghost(this._ghostsId[i], this._ghostsPosition[i].getX(), this._ghostsPosition[i].getY(), MovableState.MOVING, this._ghostsDirection[i]));
    }
    
    return ghosts;
};



/******************************************************************************/
/* -> classes handling menu structure                                         */
/*     -> MenuItem, Menu                                                      */
/*                                                                            */
/* -> classes for game menus                                                  */
/*     -> PauseMenu                                                           */
/*     -> draw() + building menu in constructor                               */
/******************************************************************************/



/******************************************************************************/
/******************************* MenuItem class *******************************/
/******************************************************************************/

var MenuItem = function(id, string)
{
    this._id = id;
    this._string = string;
};

MenuItem.prototype.getId = function()
{
    return this._id;
};

MenuItem.prototype.setId = function(id)
{
    this._id = id;
};

MenuItem.prototype.getString = function()
{
    return this._string;
};

MenuItem.prototype.setString = function(string)
{
    this._string = string;
};

/******************************************************************************/
/********************************* Menu class *********************************/
/******************************************************************************/

var Menu = function()
{
    this._current = null;
    this._items = [];
};

Menu.prototype.getLength = function()
{
    return this._items.length;
};

Menu.prototype.getItem = function(id)
{
    for(var i=0; i<this._items.length; i++)
    {
        if (this._items[i].getId() === id)
        {
            return this._items[i];
        }
    }
    
    return undefined;
};

Menu.prototype.getItems = function()
{
    return this._items;
};

Menu.prototype.getCurrent = function()
{
    return this._current;
};

Menu.prototype.setCurrent = function(id)
{
    this._current = id;
};

Menu.prototype.changeToPreviousItem = function()
{
    for(var i=0; i<this._items.length; i++)
    {
        if (this._items[i].getId() === this._current)
        {
            if (i > 0)
            {
                this._current = this._items[i-1].getId();
                return;
            }
        }
    }
};

Menu.prototype.changeToNextItem = function()
{
    for(var i=0; i<this._items.length; i++)
    {
        if (this._items[i].getId() === this._current)
        {
            if (i < this._items.length-1)
            {
                this._current = this._items[i+1].getId();
                return;
            }
        }
    }
};

Menu.prototype.addItem = function(id, string)
{
    this._items.push(new MenuItem(id, string));
};

Menu.prototype.deleteItem = function(id)
{
    for(var i=0; i<this._items.length; i++)
    {
        if (this._items[i].getId() === id)
        {
            this._items.splice(i, 1);
            this._current = (this._items.length > 0) ? this._items[0].getId() : null ;
            
            return;
        }
    }
};

/*TODO faire que pausemenu aura aussi des graphics ?

pour les menu principaux, faire un genre de classe abstraite qui herite de emnu et qui a juste un draw() en plus, histoire d'harmoniser le dessin entre par exemple le menu d'options, celui d'aide, celui d'accueil, ...
du coup on aura des optionsmenu, helpmenu, .. qui heriteront de cette classe abstraite et qui auront donc juste en plus les _items
*/

/******************************************************************************/
/******************************* PauseMenu class ******************************/
/******************************************************************************/

var PauseMenu = function()
{
    Menu.call(this);
    
    this.addItem(PauseMenuItem.RESUME.id, PauseMenuItem.RESUME.str);
    this.addItem(PauseMenuItem.RESTART.id, PauseMenuItem.RESTART.str);
    this.addItem(PauseMenuItem.QUIT.id, PauseMenuItem.QUIT.str);
    
    this._current = PauseMenuItem.RESUME.id;
};

PauseMenu.prototype = Object.create(Menu.prototype);
PauseMenu.prototype.constructor = PauseMenu;

PauseMenu.prototype.draw = function()
{
    var paddingLeft = (canvas.width - PAUSEMENU_WIDTH) / 2;
    var paddingTop = (canvas.height - PAUSEMENU_HEIGHT) / 2;
    
    context.font = PAUSEMENUITEM_FONT_SIZE + "px " + PAUSEMENU_FONT;
    
    /* draw menu background */
    
    context.fillStyle = "green";
    
    context.fillRect(paddingLeft,
                     paddingTop,
                     PAUSEMENU_WIDTH,
                     PAUSEMENU_HEIGHT);
    
    /* draw menu items */
    
    for(var i=0; i<this._items.length; i++)
    {
        /* draw menu items background */
        
        context.fillStyle = "blue";
        
        context.fillRect(paddingLeft + PAUSEMENU_HPADDING,
                         paddingTop + PAUSEMENU_VPADDING + i*(PAUSEMENUITEM_HEIGHT + PAUSEMENU_ITEMSDISTANCE),
                         PAUSEMENUITEM_WIDTH,
                         PAUSEMENUITEM_HEIGHT);
        
        /* draw menu items strings */
        
        context.fillStyle = (this._items[i].getId() === this._current) ? "white" : "gray" ;
        
        context.fillText(this._items[i].getString(),
                         paddingLeft + PAUSEMENU_HPADDING + (PAUSEMENUITEM_WIDTH - context.measureText(this._items[i].getString()).width)/2,
                         paddingTop + PAUSEMENU_VPADDING + PAUSEMENUITEM_FONT_SIZE + i*(PAUSEMENUITEM_HEIGHT + PAUSEMENU_ITEMSDISTANCE));
    }
};



/******************************************************************************/
/* -> game states classes                                                     */
/*     -> PauseState, PlayingState                                            */
/*     -> handleInput(key), update(), draw()                                  */
/******************************************************************************/



/******************************************************************************/
/****************************** PauseState class ******************************/
/******************************************************************************/

var PauseState = function()
{
    this._pausemenu = new PauseMenu();
    
    this._firstdraw = true;
};

PauseState.prototype.reinit = function()
{
    this._pausemenu.setCurrent(PauseMenuItem.RESUME.id);
};

PauseState.prototype.handleInput = function(key)
{
    assert((isVirtualKeyCode(key)), "key is not a virtual key code");
    
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
        if (this._pausemenu.getCurrent() === PauseMenuItem.RESUME.id)
        {
            return GameState.PLAYING;
        }
        else if (this._pausemenu.getCurrent() === PauseMenuItem.QUIT.id)
        {
            // mainmenu
        }
        else if (this._pausemenu.getCurrent() === PauseMenuItem.RESTART.id)
        {
            this.reinit();
            playingstate.restart();
            
            return GameState.PLAYING;
        }
    }
    
    return GameState.PAUSE;
};

PauseState.prototype.update = function()
{
    var nextstate = undefined;
    
    if (pressedkeys.length === 0)
    {
        nextstate = GameState.PAUSE;
    }
    else
    {
        do
        {
            var key = pressedkeys.shift();
            var keydate = pressedkeysdate.shift();
            
            nextstate = this.handleInput(key);
            
            lastupdate = keydate;
        } while(pressedkeys.length > 0 && state === nextstate);
    }
    
    // reset for the next time we will be in PauseState
    if (nextstate != state)
    {
        this._firstdraw = true;
    }
    
    return nextstate;
};

PauseState.prototype.draw = function()
{
    if (this._firstdraw)
    {
        context.fillStyle = "rgba(0, 0, 0, 0.3)";
        
        context.fillRect(0,
                         0,
                         canvas.width,
                         canvas.height);
    }
    
    this._pausemenu.draw();
    
    this._firstdraw = false;
};

/******************************************************************************/
/**************************** PlayingState class ******************************/
/******************************************************************************/

var PlayingState = function(litteral)
{
    this._map = null;
    
    this._status = new Status();
    this._maze = null;
    this._pacman = null;
    this._ghosts = [];
    
    this.loadMap(litteral);
    
    this._graphicsborder = null;
    this._graphicsbackground = null;
    
    this._generateGraphics();
    
    //TODO au final quand on aura un PlayingState, faudra savoir si mettre le Map ou seulement le MAP_1, car c ptetre moins pire de devoir tout rechopper a partir du litteral, plutot que de tout stocker tt le temps et de tte façon quand meme choper les infos par copie de ce qu'a chopé Map
};

PlayingState.prototype._generateGraphics = function()
{
    this._graphicsborder = new DrawableRectangle(0,
                                                 0,
                                                 canvas.width,
                                                 canvas.height);
    
    this._graphicsbackground = new DrawableRectangle(CANVAS_BORDER_SIZE,
                                                     CANVAS_BORDER_SIZE,
                                                     canvas.width - 2 * CANVAS_BORDER_SIZE,
                                                     canvas.height - 2 * CANVAS_BORDER_SIZE);
};

/*
    compute the x and y padding between the map coordinates used for the
    definition and the coordinates wanted for the final position (so we
    compute the difference between the desired position of the map top left
    corner for the game, and the original position of this corner in the map
    definition)
*/
PlayingState.prototype._getMapPaddingX = function()
{
    return (canvas.width - this._map.getWidth()) / 2 - this._map.getTopLeft().getX();
};

PlayingState.prototype._getMapPaddingY = function()
{
    return (canvas.height - STATUS_HEIGHT - this._map.getHeight()) / 2 - this._map.getTopLeft().getY();
};

PlayingState.prototype.loadMap = function(litteral)
{
    this._map = new Map(litteral);
    
    /*
        load original map data
    */
    
    var lines = this._map.getCorridors();
    var ghosthouse = this._map.getGhosthouse();
    var links = this._map.getLinks();
    var pacdots = this._map.getPacdots();
    var pellets = this._map.getPellets();
    var portals = this._map.getPortals();
    var ghosts = this._map.getGhosts();
    var pacman = this._map.getPacman();
    
    var mapheight = this._map.getHeight();
    var mapwidth = this._map.getWidth();
    var maptopleft = this._map.getTopLeft();
    
    /*
        update loaded original map data using padding to the desired position
    */
    
    var xmappadding = this._getMapPaddingX();
    var ymappadding = this._getMapPaddingY();
    
    for(var i=0; i<lines.length; i++)
    {
        lines[i].translate(xmappadding, ymappadding);
    }
    
    for(var i=0; i<ghosthouse.length; i++)
    {
        ghosthouse[i].translate(xmappadding, ymappadding);
    }
    
    for(var i=0; i<links.length; i++)
    {
        links[i].translate(xmappadding, ymappadding);
    }
    
    for(var i=0; i<pacdots.length; i++)
    {
        pacdots[i].translate(xmappadding, ymappadding);
    }
    
    for(var i=0; i<pellets.length; i++)
    {
        pellets[i].translate(xmappadding, ymappadding);
    }
    
    for(var i=0; i<portals.length; i++)
    {
        portals[i].translate(xmappadding, ymappadding);
    }
    
    pacman.translate(xmappadding, ymappadding);
    
    for(var i=0; i<ghosts.length; i++)
    {
        ghosts[i].translate(xmappadding, ymappadding);
    }
    
    /*
        create game elements
    */
    
    //TODO TODO TODO
    

        /*
    - Status devrait etre composé de lives (classe LifeStatus composée de nblives de type entier + 1 graphics DrawableString du texte + 1 array de graphics DrawableCircle) et score (classe ScoreStatus composée de score + 1 DrawableString du texte + 1 DrawableStringText du score) ; un drawableString possède une position et un String (en fait, le faire heriter de String, tt comme les autres Drawable heritent de leur truc)
    */
    /*
    - on a besoin de la map pr ses getwidth(), utilisé notamment dans le getmappadding()... ou mettre direct dans Maze... ??!?
    */
    
    //TODO ici, creer direct le this._maze et this._pacman, puis faire un maze.translate() et un pacman.translate() (creer ces fonctions en pensant a translater les graphics aussi)
    
    this._maze = new Maze(ghosthouse, lines, links, pacdots, pellets, portals);
    this._pacman = pacman;
    this._ghosts = ghosts;
};

PlayingState.prototype.restart = function()
{
    var xmappadding = this._getMapPaddingX();
    var ymappadding = this._getMapPaddingY();
    
    // reinit maze
    var pacdots = this._map.getPacdots();
    var pellets = this._map.getPellets();
    
    for(var i=0; i<pacdots.length; i++)
    {
        pacdots[i].translate(xmappadding, ymappadding);
    }
    
    for(var i=0; i<pellets.length; i++)
    {
        pellets[i].translate(xmappadding, ymappadding);
    }
    
    this._maze.reinit(pacdots, pellets);
    
    // reinit status
    this._status.reinit();
    
    // reinit pacman
    var pacman = this._map.getPacman();
    
    pacman.translate(xmappadding, ymappadding);
    
    this._pacman.reinit(pacman.getPosition().getX(), pacman.getPosition().getY(), MovableState.MOVING, pacman.getDirection());
    
    // reinit ghosts
    var ghosts = this._map.getGhosts();
    
    for(var i=0; i<ghosts.length; i++)
    {
        ghosts[i].translate(xmappadding, ymappadding);
    }
    
    for(var i=0; i<ghosts.length; i++)
    {
        this._ghosts[i].reinit(ghosts[i].getID(), ghosts[i].getPosition().getX(), ghosts[i].getPosition().getY(), MovableState.MOVING, ghosts[i].getDirection());
    }
};

PlayingState.prototype.handleInput = function(key)
{
    assert((isVirtualKeyCode(key)), "key is not a virtual key code");
    
    if (key === 37)         {this._pacman.makeMovementToDirection(Direction.LEFT, this._maze);}     /* left arrow */
    else if (key === 38)    {this._pacman.makeMovementToDirection(Direction.UP, this._maze);}       /* up arrow */
    else if (key === 39)    {this._pacman.makeMovementToDirection(Direction.RIGHT, this._maze);}    /* right arrow */
    else if (key === 40)    {this._pacman.makeMovementToDirection(Direction.DOWN, this._maze);}     /* down arrow */
    else if (key === 32)    {return GameState.PAUSE;}                                               /* space bar */
    
    return GameState.PLAYING;
};

PlayingState.prototype.move = function(elapsed)
{
    assert((elapsed > 0), "elapsed value is not valid");
    
    this._pacman.move(elapsed, this._maze, this._status);
    this._pacman.animate(elapsed);
    
    for(var i=0; i<this._ghosts.length; i++)
    {
        this._ghosts[i].movementAI(elapsed, this._maze, this._pacman);
        this._ghosts[i].move(elapsed, this._maze);
        this._ghosts[i].animate(elapsed);
    }
};

PlayingState.prototype.update = function()
{
    var nextstate = undefined;
    
    if (pressedkeys.length > 0)
    {
        do
        {
            var key = pressedkeys.shift();
            var keydate = pressedkeysdate.shift();
            
            this.move(keydate - lastupdate);
            
            nextstate = this.handleInput(key);
            
            lastupdate = keydate;
        } while(pressedkeys.length > 0 && state === nextstate);
    }
    
    // also does the last move() if we end the while() with length=0 in the same state
    if (pressedkeys.length === 0)
    {
        if (nextstate === undefined)
        {
            nextstate = GameState.PLAYING;
        }
        
        if (nextstate === state)
        {
            this.move(newupdate - lastupdate);
        }
    }
    
    return nextstate;
};

PlayingState.prototype.draw = function()
{
    context.fillStyle = "blue";
    this._graphicsborder.draw();
    context.fillStyle = "white";
    this._graphicsbackground.draw();
    
    this._maze.draw();
    this._pacman.draw();
    for(var i=0; i<this._ghosts.length; i++)
    {
        this._ghosts[i].draw();
    }
    this._maze.drawPortals();
    
    this._status.draw();
};

/******************************************************************************/
/********************************* Status class *******************************/
/******************************************************************************/

var Status = function()
{
    this._score = 0;
    this._lives = 3;
    this._level = 1;
    
    this._graphicsscoreborder = null;
    this._graphicsscorebackground = null;
    this._graphicslivesborder = null;
    this._graphicslivesbackground = null;
    
    this._generateGraphics();
};

Status.prototype._generateGraphics = function()
{
    this._graphicsscoreborder = new DrawableRectangle(CANVAS_BORDER_SIZE + STATUS_HMARGIN,
                                                      canvas.height - CANVAS_BORDER_SIZE - STATUS_HEIGHT + STATUS_VMARGIN,
                                                      STATUS_SCORE_CONTENT_WIDTH + 2 * STATUS_HPADDING + 2 * STATUS_BORDER_SIZE,
                                                      STATUS_HEIGHT - 2 * STATUS_VMARGIN);
    
    this._graphicslivesborder = new DrawableRectangle(CANVAS_BORDER_SIZE + 2 * STATUS_HMARGIN + 2 * STATUS_BORDER_SIZE + 2 * STATUS_HPADDING + STATUS_SCORE_CONTENT_WIDTH,
                                                      canvas.height - CANVAS_BORDER_SIZE - STATUS_HEIGHT + STATUS_VMARGIN,
                                                      STATUS_LIVES_CONTENT_WIDTH + 2 * STATUS_HPADDING + 2 * STATUS_BORDER_SIZE,
                                                      STATUS_HEIGHT - 2 * STATUS_VMARGIN);
    
    this._graphicsscorebackground = new DrawableRectangle(CANVAS_BORDER_SIZE + STATUS_HMARGIN + STATUS_BORDER_SIZE,
                                                          canvas.height - CANVAS_BORDER_SIZE - STATUS_HEIGHT + STATUS_VMARGIN + STATUS_BORDER_SIZE,
                                                          STATUS_SCORE_CONTENT_WIDTH + 2 * STATUS_HPADDING,
                                                          STATUS_HEIGHT - 2 * STATUS_VMARGIN - 2 * STATUS_BORDER_SIZE);
    
    this._graphicslivesbackground = new DrawableRectangle(CANVAS_BORDER_SIZE + 2 * STATUS_HMARGIN + 2 * STATUS_BORDER_SIZE + 2 * STATUS_HPADDING + STATUS_SCORE_CONTENT_WIDTH + STATUS_BORDER_SIZE,
                                                          canvas.height - CANVAS_BORDER_SIZE - STATUS_HEIGHT + STATUS_VMARGIN + STATUS_BORDER_SIZE,
                                                          STATUS_LIVES_CONTENT_WIDTH + 2 * STATUS_HPADDING,
                                                          STATUS_HEIGHT - 2 * STATUS_VMARGIN - 2 * STATUS_BORDER_SIZE);
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

Status.prototype.draw = function()
{
    context.fillStyle = "blue";
    this._graphicsscoreborder.draw();
    this._graphicslivesborder.draw();
    
    context.fillStyle = "gray";
    this._graphicsscorebackground.draw();
    this._graphicslivesbackground.draw();
    
    //TODO utiliser des Drawable
    
    context.font = STATUS_FONT;
    context.fillStyle = "white";
    
    context.fillText("Score : " + this._score,
                     CANVAS_BORDER_SIZE + STATUS_HMARGIN + STATUS_BORDER_SIZE + STATUS_HPADDING,
                     canvas.height - CANVAS_BORDER_SIZE - STATUS_HEIGHT + STATUS_VMARGIN + STATUS_BORDER_SIZE + STATUS_VPADDING + 3/4 * STATUS_CONTENT_HEIGHT);
    
    context.fillText("Lives : ",
                     CANVAS_BORDER_SIZE + 2 * STATUS_HMARGIN + 2 * STATUS_BORDER_SIZE + 2 * STATUS_HPADDING + STATUS_SCORE_CONTENT_WIDTH + STATUS_BORDER_SIZE + STATUS_HPADDING,
                     canvas.height - CANVAS_BORDER_SIZE - STATUS_HEIGHT + STATUS_VMARGIN + STATUS_BORDER_SIZE + STATUS_VPADDING + 3/4 * STATUS_CONTENT_HEIGHT);
    
    
    context.fillStyle = "yellow";
    
    for(var i=1; i<=this._lives; i++)
    {
        var distance = i*STATUS_LIVES_INTERSPACE + (i-1)*2*STATUS_LIVES_RADIUS + (STATUS_LIVES_RADIUS/2);
        context.beginPath();
        context.arc(CANVAS_BORDER_SIZE + 2 * STATUS_HMARGIN + 2 * STATUS_BORDER_SIZE + 2 * STATUS_HPADDING + STATUS_SCORE_CONTENT_WIDTH + STATUS_BORDER_SIZE + STATUS_HPADDING + context.measureText("Lives : ").width + distance,
                    canvas.height - CANVAS_BORDER_SIZE - STATUS_HEIGHT + STATUS_VMARGIN + STATUS_BORDER_SIZE + STATUS_VPADDING + STATUS_CONTENT_HEIGHT/2,
                    STATUS_LIVES_RADIUS,
                    0,
                    2 * Math.PI);
        context.fill();
    }
};

/******************************************************************************/
/********************************* Maze class *********************************/
/******************************************************************************/

var Maze = function(ghosthouse, corridors, links, pacdots, pellets, portals)
{
    //TODO  check if lines don't overlap with one another => if overlap, create
    //      a new one containing the two lines overlapping (they need to be of
    //      the same type : the 2 with pacdots, or the 2 without pacdots)
    assert((corridors instanceof Array && corridors.length > 0), "corridors is not an array");
    
    this._ghosthouse = ghosthouse;
    this._corridors = corridors;    // lines on which the pacman center can move
    this._links = links;
    this._pacdots = pacdots;
    this._pellets = pellets;
    this._portals = portals;
    
    this._totalpacdots = this._pacdots.length;
    this._eatenpacdots = 0;
    
    this._totalpellets = this._pellets.length;
    this._eatenpellets = 0;
    
    this._graphicsborder = null;
    this._graphicsbackground = null;
    
    this._width = 0;    // same thing than the width/height of the Map loaded
    this._height = 0;
    
    this._computeDimensions();
    
    this._generateGraphics();
};

Maze.prototype._generateGraphics = function()
{
    this._graphicsborder = new DrawableRectangle((canvas.width - this._width - LINE_WIDTH) / 2 - MAZE_BORDER_SIZE,
                                                 (canvas.height - STATUS_HEIGHT - this._height - LINE_WIDTH) / 2 - MAZE_BORDER_SIZE,
                                                 this._width + LINE_WIDTH + 2 * MAZE_BORDER_SIZE,
                                                 this._height + LINE_WIDTH + 2 * MAZE_BORDER_SIZE);
    this._graphicsbackground = new DrawableRectangle((canvas.width - this._width - LINE_WIDTH) / 2,
                                                     (canvas.height - STATUS_HEIGHT - this._height - LINE_WIDTH) / 2,
                                                     this._width + LINE_WIDTH,
                                                     this._height + LINE_WIDTH);
};

Maze.prototype.reinit = function(pacdots, pellets)
{
    this._pacdots.length = 0;
    this._pacdots = pacdots;
    
    this._pellets.length = 0;
    this._pellets = pellets;
    
    this._totalpacdots = this._pacdots.length;
    this._eatenpacdots = 0;
    
    this._totalpellets = this._pellets.length;
    this._eatenpellets = 0;
};

Maze.prototype.increaseEatenPacdots = function(incr)
{
    assert((typeof incr === "number"), "incr is not a number");
    
    this._eatenpacdots += incr;
};

Maze.prototype.getEatenPacdots = function()
{
    return this._eatenpacdots;
};

Maze.prototype.getTotalPacdots = function()
{
    return this._totalpacdots;
};

Maze.prototype.increaseEatenPellets = function(incr)
{
    assert((typeof incr === "number"), "incr is not a number");
    
    this._eatenpellets += incr;
};

Maze.prototype.getEatenPellets = function()
{
    return this._eatenpellets;
};

Maze.prototype.getTotalPellets = function()
{
    return this._totalpellets;
};

Maze.prototype.getWidth = function()
{
    return this._width;
};

Maze.prototype.getHeight = function()
{
    return this._height;
};

Maze.prototype._computeDimensions = function()
{
    var xmin = this._corridors[0].getLine().getPoint1().getX();
    var ymin = this._corridors[0].getLine().getPoint1().getY();
    var xmax = this._corridors[0].getLine().getPoint1().getX();
    var ymax = this._corridors[0].getLine().getPoint1().getY();

    for(var i=0; i<this._corridors.length; i++)
    {
        if (this._corridors[i].getLine().getPoint1().getX() < xmin) {xmin = this._corridors[i].getLine().getPoint1().getX();}
        if (this._corridors[i].getLine().getPoint2().getX() < xmin) {xmin = this._corridors[i].getLine().getPoint2().getX();}
        if (this._corridors[i].getLine().getPoint1().getY() < ymin) {ymin = this._corridors[i].getLine().getPoint1().getY();}
        if (this._corridors[i].getLine().getPoint2().getY() < ymin) {ymin = this._corridors[i].getLine().getPoint2().getY();}
        
        if (this._corridors[i].getLine().getPoint1().getX() > xmax) {xmax = this._corridors[i].getLine().getPoint1().getX();}
        if (this._corridors[i].getLine().getPoint2().getX() > xmax) {xmax = this._corridors[i].getLine().getPoint2().getX();}
        if (this._corridors[i].getLine().getPoint1().getY() > ymax) {ymax = this._corridors[i].getLine().getPoint1().getY();}
        if (this._corridors[i].getLine().getPoint2().getY() > ymax) {ymax = this._corridors[i].getLine().getPoint2().getY();}
    }

    this._width = xmax - xmin;
    this._height = ymax - ymin;
};

Maze.prototype.getCorridors = function()
{
    return this._corridors;
};

Maze.prototype.getGhostHouse = function()
{
    return this._ghosthouse;
};

Maze.prototype.getLinks = function()
{
    return this._links;
};

Maze.prototype.getPacdots = function()
{
    return this._pacdots;
};

Maze.prototype.getPellets = function()
{
    return this._pellets;
};

Maze.prototype.getPortals = function()
{
    return this._portals;
};

Maze.prototype.isPortal = function(x, y)
{
    assert((typeof x === "number"), "x is not a number");
    assert((typeof y === "number"), "y is not a number");
    
    for(var i=0; i<this._portals.length; i++)
    {
        if (this._portals[i].getPosition().equals(x,y))
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
    
    for(var i=0; i<this._portals.length; i++)
    {
        if (this._portals[i].getPosition().equals(x,y))
        {
            portalid = this._portals[i].getID();
        }
    }
    
    for(var i=0; i<this._portals.length; i++)
    {
        var p = this._portals[i].getPosition();
        
        if (!p.equals(x,y) && this._portals[i].getID() === portalid)
        {
            return this._portals[i];
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

Maze.prototype.getPellet = function(index)
{
    assert((index >= 0 && index < this._pellets.length), "index value is not valid");
    
    return this._pellets[index];
};

Maze.prototype.deletePellet = function(index)
{
    assert((index >= 0 && index < this._pellets.length), "index value is not valid");
    
    this._pellets.splice(index, 1);
};

Maze.prototype.containsPoint = function(point, allowedcorridors)
{
    assert((point instanceof Point), "point is not a Point");
    
    if (allowedcorridors.withCorridors())
    {
        for(var i=0;i<this._corridors.length;i++)
        {
            if (this._corridors[i].getLine().containsPoint(point))
            {
                return true;
            }
        }
    }
    
    if (allowedcorridors.withGhosthouse())
    {
        for(var i=0;i<this._ghosthouse.length;i++)
        {
            if (this._ghosthouse[i].getLine().containsPoint(point))
            {
                return true;
            }
        }
    }
    
    if (allowedcorridors.withLinks())
    {
        for(var i=0;i<this._links.length;i++)
        {
            if (this._links[i].getLine().containsPoint(point))
            {
                return true;
            }
        }
    }
    
    return false;
};

Maze.prototype.HLineContainer = function(point)
{
    assert((point instanceof Point), "point is not a Point");
    
    var line = null;
    
    for(var i=0; i<this._corridors.length; i++)
    {
        line = this._corridors[i].getLine();
        
        if (isHorizontal(line) && line.containsPoint(point))
        {
            /* check if this line overlap with a link line */
            for(var i=0; i<this._links.length; i++)
            {
                if (isHorizontal(this._links[i].getLine())
                 && (this._links[i].getLine().containsPoint(line.getPoint1()) || this._links[i].getLine().containsPoint(line.getPoint2())))
                {
                    return concatenateLines(line, this._links[i].getLine());
                }
            }
            
            return line;
        }
    }
    
    for(var i=0; i<this._ghosthouse.length; i++)
    {
        line = this._ghosthouse[i].getLine();
        
        if (isHorizontal(line) && line.containsPoint(point))
        {
            /* check if this line overlap with a link line */
            for(var i=0; i<this._links.length; i++)
            {
                if (isHorizontal(this._links[i].getLine())
                 && (this._links[i].getLine().containsPoint(line.getPoint1()) || this._links[i].getLine().containsPoint(line.getPoint2())))
                {
                    return concatenateLines(line, this._links[i].getLine());
                }
            }
            
            return line;
        }
    }
    
    for(var i=0; i<this._links.length; i++)
    {
        line = this._links[i].getLine();
        
        if (isHorizontal(line) && line.containsPoint(point))
        {
            return line;
        }
    }
};

Maze.prototype.VLineContainer = function(point)
{
    assert((point instanceof Point), "point is not a Point");
    
    var line = null;
    
    for(var i=0; i<this._corridors.length; i++)
    {
        line = this._corridors[i].getLine();
        
        if (isVertical(line) && line.containsPoint(point))
        {
            /* check if this line overlap with a link line */
            for(var i=0; i<this._links.length; i++)
            {
                if (isVertical(this._links[i].getLine())
                 && (this._links[i].getLine().containsPoint(line.getPoint1()) || this._links[i].getLine().containsPoint(line.getPoint2())))
                {
                    return concatenateLines(line, this._links[i].getLine());
                }
            }
            
            return line;
        }
    }
    
    for(var i=0; i<this._ghosthouse.length; i++)
    {
        line = this._ghosthouse[i].getLine();
        
        if (isVertical(line) && line.containsPoint(point))
        {
            /* check if this line overlap with a link line */
            for(var i=0; i<this._links.length; i++)
            {
                if (isVertical(this._links[i].getLine())
                 && (this._links[i].getLine().containsPoint(line.getPoint1()) || this._links[i].getLine().containsPoint(line.getPoint2())))
                {
                    return concatenateLines(line, this._links[i].getLine());
                }
            }
            
            return line;
        }
    }
    
    for(var i=0; i<this._links.length; i++)
    {
        line = this._links[i].getLine();
        
        if (isVertical(line) && line.containsPoint(point))
        {
            return line;
        }
    }
};

Maze.prototype.isIntersection = function(point)
{
    assert((point instanceof Point), "point is not a Point");
    
    var vl = this.VLineContainer(point);
    var hl = this.HLineContainer(point);
    
    return (typeof vl !== "undefined" && typeof hl !== "undefined");
};

//TODO if the 3 are OK in allowedcorridors, then in if (allowedcorridors.withCorridors()) we also have to check (after the withLinks()) if it overlap with a ghosthouse line
//     same thing for the if (allowedcorridors.withGhosthouse())
Maze.prototype.currentLine = function(point, direction, allowedcorridors)
{
    assert((point instanceof Point), "point is not a Point");
    assert((isDirection(direction)), "direction value is not valid");
    
    var line = null;
    
    if (allowedcorridors.withCorridors())
    {
        for(var i=0; i<this._corridors.length; i++)
        {
            line = this._corridors[i].getLine();
            
            if (line.isParallelToDirection(direction)
             && line.containsPoint(point))
            {
                if (allowedcorridors.withLinks())
                {
                    /* check if this line overlap with a link line */
                    for(var i=0; i<this._links.length; i++)
                    {
                        if (line.isParallelTo(this._links[i].getLine())
                         && (this._links[i].getLine().containsPoint(line.getPoint1()) || this._links[i].getLine().containsPoint(line.getPoint2())))
                        {
                            return concatenateLines(line, this._links[i].getLine());
                        }
                    }
                }
                
                return line;
            }
        }
    }
    
    if (allowedcorridors.withGhosthouse())
    {
        for(var i=0; i<this._ghosthouse.length; i++)
        {
            line = this._ghosthouse[i].getLine();
            
            if (line.isParallelToDirection(direction)
             && line.containsPoint(point))
            {
                if (allowedcorridors.withLinks())
                {
                    /* check if this line overlap with a link line */
                    for(var i=0; i<this._links.length; i++)
                    {
                        if (line.isParallelTo(this._links[i].getLine())
                         && (this._links[i].getLine().containsPoint(line.getPoint1()) || this._links[i].getLine().containsPoint(line.getPoint2())))
                        {
                            return concatenateLines(line, this._links[i].getLine());
                        }
                    }
                }
                
                return line;
            }
        }
    }
    
    if (allowedcorridors.withLinks())
    {
        for(var i=0; i<this._links.length; i++)
        {
            line = this._links[i].getLine();
            
            if (line.isParallelToDirection(direction)
             && line.containsPoint(point))
            {
                return line;
            }
        }
    }
    
    /*
        if we reach this place, that means that the point has a perpendicular
        direction on its current line ; this is possible when manually setting the
        element on the maze
    */
    
    if (allowedcorridors.withCorridors())
    {
        for(var i=0; i<this._corridors.length; i++)
        {
            line = this._corridors[i].getLine();
            
            if (line.containsPoint(point))
            {
                return line;
            }
        }
    }
    
    if (allowedcorridors.withGhosthouse())
    {
        for(var i=0; i<this._ghosthouse.length; i++)
        {
            line = this._ghosthouse[i].getLine();
            
            if (line.containsPoint(point))
            {
                return line;
            }
        }
    }
    
    if (allowedcorridors.withLinks())
    {
        for(var i=0; i<this._links.length; i++)
        {
            line = this._links[i].getLine();
            
            if (line.containsPoint(point))
            {
                return line;
            }
        }
    }
};

Maze.prototype.remainingLine = function(point, direction, allowedcorridors)
{
    var current = this.currentLine(point, direction, allowedcorridors);
    
    var xlimit = null;
    var ylimit = null;
    
    if (direction === Direction.UP)         {xlimit = point.getX(); ylimit = current.getPoint1().getY();}
    else if (direction === Direction.DOWN)  {xlimit = point.getX(); ylimit = current.getPoint2().getY();}
    else if (direction === Direction.LEFT)  {xlimit = current.getPoint1().getX(); ylimit = point.getY();}
    else if (direction === Direction.RIGHT) {xlimit = current.getPoint2().getX(); ylimit = point.getY();}
    
    var remaining = new Line(new Point(point.getX(), point.getY()), new Point(xlimit, ylimit));
    
    return remaining;
};

Maze.prototype.goingFromPortalDirection = function(position)
{
    // a portal can only be at the end on only one line
    var line = this.HLineContainer(position);
    if (typeof line === "undefined") {line = this.VLineContainer(position);}
    
    if (isVertical(line))
    {
        return (line.getPoint1().equalsPoint(position)) ? Direction.DOWN : Direction.UP ;
    }
    else if (isHorizontal(line))
    {
        return (line.getPoint1().equalsPoint(position)) ? Direction.RIGHT : Direction.LEFT ;
    }
};

Maze.prototype.goingToPortalDirection = function(position)
{
    // a portal can only be at the end on only one line
    var line = this.HLineContainer(position);
    if (typeof line === "undefined") {line = this.VLineContainer(position);}
    
    if (isVertical(line))
    {
        return (line.getPoint1().equalsPoint(position)) ? Direction.UP : Direction.DOWN ;
    }
    else if (isHorizontal(line))
    {
        return (line.getPoint1().equalsPoint(position)) ? Direction.LEFT : Direction.RIGHT ;
    }
};

/**
 * Return the NEXT intersection where we can turn into the specified direction ; this means
 * that even if we are exactly on a usable intersection, this intersection is NOT returned.
 * The function doesn't search through portals.
 */
Maze.prototype.nextTurn = function(point, direction, nextdirection, allowedcorridors)
{
    assert((point instanceof Point), "point is not a Point");
    assert((isDirection(direction)), "direction value is not valid");
    assert((isDirection(nextdirection)), "nextdirection value is not valid");
    
    if (areDirectionsParallel(direction, nextdirection))
    {
        return;
    }
    
    var lines = [];
    var remaining = this.remainingLine(point, direction, allowedcorridors);
    
    if (remaining.isPoint())
    {
        return;
    }
    
    /* find all the lines on which we could turn */
    
    if (allowedcorridors.withCorridors())
    {
        for(var i=0;i<this._corridors.length;i++)
        {
            var l = this._corridors[i].getLine();
            
            if (l.isCrossing(remaining))
            {
                var intersection = l.intersectionPointWith(remaining);
                
                if (this.directionIsAvailable(intersection, nextdirection)
                 && !point.equalsPoint(intersection))
                {
                    lines.push(l);
                }
            }
        }
    }
    
    if (allowedcorridors.withGhosthouse())
    {
        for(var i=0;i<this._ghosthouse.length;i++)
        {
            var l = this._ghosthouse[i].getLine();
            
            if (l.isCrossing(remaining))
            {
                var intersection = l.intersectionPointWith(remaining);
                
                if (this.directionIsAvailable(intersection, nextdirection)
                 && !point.equalsPoint(intersection))
                {
                    lines.push(l);
                }
            }
        }
    }
    
    if (allowedcorridors.withLinks())
    {
        for(var i=0;i<this._links.length;i++)
        {
            var l = this._links[i].getLine();
            
            if (l.isCrossing(remaining))
            {
                var intersection = l.intersectionPointWith(remaining);
                
                if (this.directionIsAvailable(intersection, nextdirection)
                 && !point.equalsPoint(intersection))
                {
                    lines.push(l);
                }
            }
        }
    }
    
    if (lines.length === 0)
    {
        return;
    }
    else
    {
        /* find the nearest line */
        
        var nearest = (isVertical(nextdirection)) ? lines[0].XAxis() : lines[0].YAxis() ;
        
        for(var i=1;i<lines.length;i++)
        {
            if ((direction === Direction.LEFT && lines[i].XAxis() > nearest)
             || (direction === Direction.RIGHT && lines[i].XAxis() < nearest)
             || (direction === Direction.UP && lines[i].YAxis() > nearest)
             || (direction === Direction.DOWN && lines[i].YAxis() < nearest))
            {
                nearest = (isVertical(nextdirection)) ? lines[i].XAxis() : lines[i].YAxis() ;
            }
        }
        
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

//TODO en fait actuellement, cette fonction renvoie quand meme l'intersection si on est dessus, mais uniquement dans le cas où notre remainingline est un point ; contrairement à nextTurn, qui return direct si notre remainingline est un point
// seulement utilisée une fois dans Ghost.movementAIToTarget()
Maze.prototype.nextIntersection = function(point, direction, allowedcorridors)
{
    var line = this.currentLine(point, direction, allowedcorridors);
    
    var lines = [];
    var current = this.remainingLine(point, direction, allowedcorridors);
    
    for(var i=0; i<this._corridors.length; i++)
    {
        var l = this._corridors[i].getLine();
        
        if (l.isParallelTo(line) === false)
        {
            if (l.isCrossing(current))
            {
                // if our "remaining" current line is a point
                // or if our point is not an intersection created by this line and our current line, and our "remaining" current line is not a point
                if (current.isPoint()
                 || (!current.isPoint() && !l.containsPoint(point)))
                {
                    lines.push(l);
                }
            }
        }
    }
    
    for(var i=0; i<this._ghosthouse.length; i++)
    {
        var l = this._ghosthouse[i].getLine();
        
        if (l.isParallelTo(line) === false)
        {
            if (l.isCrossing(current))
            {
                if (current.isPoint()
                 || (!current.isPoint() && !l.containsPoint(point)))
                {
                    lines.push(l);
                }
            }
        }
    }
    
    for(var i=0; i<this._links.length; i++)
    {
        var l = this._links[i].getLine();
        
        if (l.isParallelTo(line) === false)
        {
            if (l.isCrossing(current))
            {
                if (current.isPoint()
                 || (!current.isPoint() && !l.containsPoint(point)))
                {
                    lines.push(l);
                }
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
        
        var nearest = (isHorizontal(direction)) ? lines[0].XAxis() : lines[0].YAxis() ;
        
        for(var i=1;i<lines.length;i++)
        {
            if ((direction === Direction.LEFT && lines[i].XAxis() > nearest)
             || (direction === Direction.RIGHT && lines[i].XAxis() < nearest)
             || (direction === Direction.UP && lines[i].YAxis() > nearest)
             || (direction === Direction.DOWN && lines[i].YAxis() < nearest))
            {
                nearest = (isHorizontal(direction)) ? lines[i].XAxis() : lines[i].YAxis() ;
            }
        }
        
        /* return the intersection */
        
        if (isHorizontal(direction))
        {
            return new Point(nearest, point.getY());
        }
        else
        {
            return new Point(point.getX(), nearest);
        }
    }
};

Maze.prototype.directionIsAvailable = function(point, direction)
{
    assert((point instanceof Point), "point is not a Point");
    assert((isDirection(direction)), "direction value is not valid");
    
    if (isVertical(direction))
    {
        var line = this.VLineContainer(point);
        
        if (typeof line !== "undefined"
         && ((line.getPoint1().equalsPoint(point) === false && line.getPoint2().equalsPoint(point) === false)
          || (line.getPoint1().equalsPoint(point) && direction === Direction.DOWN)
          || (line.getPoint2().equalsPoint(point) && direction === Direction.UP)))
        {
            return true;
        }
    }
    
    if (isHorizontal(direction))
    {
        var line = this.HLineContainer(point);
        
        if (typeof line !== "undefined"
         && ((line.getPoint1().equalsPoint(point) === false && line.getPoint2().equalsPoint(point) === false)
          || (line.getPoint1().equalsPoint(point) && direction === Direction.RIGHT)
          || (line.getPoint2().equalsPoint(point) && direction === Direction.LEFT)))
        {
            return true;
        }
    }
    
    return false;
};

Maze.prototype.availableDirections = function(point)
{
    var directions = [];
    
    if (this.directionIsAvailable(point, Direction.UP))    {directions.push(Direction.UP);}
    if (this.directionIsAvailable(point, Direction.RIGHT)) {directions.push(Direction.RIGHT);}
    if (this.directionIsAvailable(point, Direction.DOWN))  {directions.push(Direction.DOWN);}
    if (this.directionIsAvailable(point, Direction.LEFT))  {directions.push(Direction.LEFT);}
    
    return directions;
};

Maze.prototype.draw = function()
{
    context.fillStyle = "gray";
    this._graphicsborder.draw();
    
    context.fillStyle = "blue";
    this._graphicsbackground.draw();
    
    for(var i=0; i<this._corridors.length; i++)     {this._corridors[i].draw();}
    for(var i=0; i<this._ghosthouse.length; i++)    {this._ghosthouse[i].draw();}
    for(var i=0; i<this._links.length; i++)         {this._links[i].draw();}
    for(var i=0; i<this._pacdots.length; i++)       {this._pacdots[i].draw();}
    for(var i=0; i<this._pellets.length; i++)       {this._pellets[i].draw();}
};

Maze.prototype.drawPortals = function()
{
    for(var i=0; i<this._portals.length; i++)       {this._portals[i].draw();}
};



/******************************************************************************/
/*************************** AllowedCorridors class ***************************/
/******************************************************************************/

var AllowedCorridors = function(withcorridors, withghosthouse, withlinks)
{
    this._withcorridors = withcorridors;
    this._withghosthouse = withghosthouse;
    this._withlinks = withlinks;
};

AllowedCorridors.prototype.withCorridors = function()
{
    return this._withcorridors;
};

AllowedCorridors.prototype.withGhosthouse = function()
{
    return this._withghosthouse;
};

AllowedCorridors.prototype.withLinks = function()
{
    return this._withlinks;
};



/******************************************************************************/
/* -> maze mobile elements classes :                                          */
/*     -> Pacman                                                              */
/*     -> _generateGraphics(), translate(x, y), setPosition(x, y), draw()     */
/******************************************************************************/


/******************************************************************************/
/********************************* Mode class *********************************/
/******************************************************************************/

var Mode = function(id, remainingtime)
{
    this._id = id;
    this._remainingtime = remainingtime;
};

Mode.prototype.getID = function()
{
    return this._id;
};

Mode.prototype.getRemainingTime = function()
{
    return this._remainingtime;
};

Mode.prototype.setID = function(id)
{
    this._id = id;
};

Mode.prototype.setRemainingTime = function(remainingtime)
{
    this._remainingtime = remainingtime;
};

Mode.prototype.set = function(id, remainingtime)
{
    this._id = id;
    this._remainingtime = remainingtime;
};

/******************************************************************************/
/******************************** Movable class *******************************/
/******************************************************************************/

var Movable = function(x, y, state, modeid, moderemainingtime, direction, speed)
{
    assert((typeof x === "number"), "x is not a number");
    assert((typeof y === "number"), "y is not a number");
    assert((isMovableState(state)), "state is not a MovableState");
    
    //TODO le checkconfig forcera le litteral a avoir une direction ; le litteral doit definir une direction sauf si on a un etat de depart à IMMOBILE
    assert((isDirection(direction)
         || (!isDirection(direction) && state === MovableState.IMMOBILE)), "direction value is not valid");
    
    this._position = new Point(x, y);
    this._direction = direction;
    
    this._speed = speed;
    
    this._nextturndirection = null;         // direction requested
    this._nextturnposition = null;          // intersection that allows movement in the requested direction
    
    this._movablestate = state;
    
    /*this._mode = mode;
    this._moderemainingtime = moderemainingtime;*/
    this._mode = new Mode(modeid, moderemainingtime);
    
    this._remainingtime = 0;
    this._remainingmovement = 0;
};

Movable.prototype.hasRemainingTime = function()
{
    return (this._remainingtime > 0);
};

Movable.prototype.hasRemainingMovement = function()
{
    return (this._remainingmovement > 0);
};

Movable.prototype.moveBeginRemainingFromTime = function(remainingtime)
{
    this._remainingtime = remainingtime;
    this._remainingmovement = Math.round(this._speed * remainingtime/1000);
};

Movable.prototype.moveBeginRemainingFromMovement = function(remainingmovement)
{
    this._remainingtime = Math.round(1000 * remainingmovement/this._speed);
    this._remainingmovement = remainingmovement;
};

Movable.prototype.moveUpdateRemainingFromTime = function(deltatime)
{
    this._remainingtime += deltatime;
    this._remainingmovement += Math.round(this._speed * deltatime/1000);
    
    if (this._mode.getRemainingTime() != -1)
    {
        //XXX this._moderemainingtime should not be = 0, since mode updates and duration limits are handled in nextmodeupdate...()
        var remaining = (-1 * deltatime > this._mode.getRemainingTime()) ? 0 : this._mode.getRemainingTime() + deltatime ;
        this._mode.setRemainingTime(remaining);
    }
};

Movable.prototype.moveUpdateRemainingFromMovement = function(deltamovement)
{
    this._remainingtime += Math.round(1000 * deltamovement/this._speed);
    this._remainingmovement += deltamovement;
    
    if (this._mode.getRemainingTime() != -1)
    {
        var deltatime = Math.round(1000 * deltamovement/this._speed)
        var remaining = (-1 * deltatime > this._mode.getRemainingTime()) ? 0 : this._mode.getRemainingTime() + deltatime ;
        this._mode.setRemainingTime(remaining);
    }
};

Movable.prototype.moveEndRemaining = function()
{
    if (this._mode.getRemainingTime() != -1)
    {
        var remaining = (this._remainingtime > this._mode.getRemainingTime()) ? 0 : this._mode.getRemainingTime() - this._remainingtime ;
        this._mode.setRemainingTime(remaining);
    }
    
    this._remainingtime = 0;
    this._remainingmovement = 0;
};

Movable.prototype.reinit = function(x, y, state, modeid, moderemainingtime, direction, speed)
{
    assert((typeof x === "number"), "x is not a number");
    assert((typeof y === "number"), "y is not a number");
    assert((isMovableState(state)), "state is not a MovableState");
    assert((isDirection(direction)
         || (!isDirection(direction) && state === MovableState.IMMOBILE)), "direction value is not valid");
    
    this._position = new Point(x, y);
    this._direction = direction;
    
    this._speed = speed;
    
    this._nextturndirection = null;
    this._nextturnposition = null;
    
    this._movablestate = state;
    
    /*this._mode = modeid;
    this._moderemainingtime = moderemainingtime;*/
    this._mode.set(modeid, moderemainingtime);
    
    this._remainingtime = 0;
    this._remainingmovement = 0;
};

Movable.prototype.getPosition = function()
{
    return this._position;
};
Movable.prototype.setPosition = function(x, y)
{
    assert((typeof x === "number"), "x is not a number");
    assert((typeof y === "number"), "y is not a number");
    
    this._position.set(x, y);
};

Movable.prototype.translate = function(x, y)
{
    assert((typeof x === "number"), "x is not a number");
    assert((typeof y === "number"), "y is not a number");
    
    this._position.translate(x, y);
};

Movable.prototype.getDirection = function()
{
    return this._direction;
};
Movable.prototype.setDirection = function(direction)
{
    assert((isDirection(direction)), "direction value is not valid");

    this._direction = direction;
};

Movable.prototype.getNextTurnDirection = function()
{
    return this._nextturndirection;
};
Movable.prototype.setNextTurnDirection = function(direction)
{
    assert((isDirection(direction) || direction === null), "nextdirection value is not valid");

    this._nextturndirection = direction;
};

Movable.prototype.getNextTurnPosition = function()
{
    return this._nextturnposition;
};
Movable.prototype.setNextTurnPosition = function(position)
{
    assert((position instanceof Point || position === null), "position value is not valid");

    this._nextturnposition = position;
};

Movable.prototype.isMoving = function()
{
    return (this._movablestate === MovableState.MOVING);
};

Movable.prototype.isPaused = function()
{
    return (this._movablestate === MovableState.PAUSED);
};

Movable.prototype.isImmobile = function()
{
    return (this._movablestate === MovableState.IMMOBILE);
};

Movable.prototype.setMoving = function(direction)
{
    this._movablestate = MovableState.MOVING;
    this._direction = direction;
};

Movable.prototype.setPaused = function(direction)
{
    this._movablestate = MovableState.PAUSED;
    this._direction = direction;
};

Movable.prototype.setImmobile = function()
{
    this._movablestate = MovableState.IMMOBILE;
    this._direction = null;
    this._nextturnposition = null;
    this._nextturndirection = null;
};

Movable.prototype.setNextTurn = function(position, direction)
{
    this._nextturnposition = position;
    this._nextturndirection = direction;
};

Movable.prototype.resetNextTurn = function()
{
    this._nextturnposition = null;
    this._nextturndirection = null;
};

Movable.prototype.hasNextTurn = function()
{
    return (this._nextturnposition !== null && this._nextturndirection !== null);
};

Movable.prototype.updateMode = function(modeid, moderemainingtime)
{
    this._mode.set(modeid, moderemainingtime);
};



/******************************************************************************/
/****************************** ModeUpdate class ******************************/
/******************************************************************************/

var ModeUpdate = function(x, y, modeid, modeduration)
{
    assert((typeof x === "number"), "x is not a number");
    assert((typeof y === "number"), "y is not a number");
    
    this._point = new Point(x, y);
    this._mode = new Mode(modeid, modeduration);
};

ModeUpdate.prototype.getPoint = function()
{
    return this._point;
};

ModeUpdate.prototype.getModeID = function()
{
    return this._mode.getID();
};

ModeUpdate.prototype.getModeRemainingTime = function()
{
    return this._mode.getRemainingTime();
};



/******************************************************************************/
/******************************** Pacman class ********************************/
/******************************************************************************/

var Pacman = function(x, y, movablestate, direction)
{
    assert((typeof x === "number"), "x is not a number");
    assert((typeof y === "number"), "y is not a number");
    assert((isMovableState(movablestate)), "state is not a MovableState");
    assert((isDirection(direction)
         || (!isDirection(direction) && movablestate === MovableState.IMMOBILE)), "direction value is not valid");
    
    var mode = PacmanMode.NORMAL;
    
    //XXX mettre plutôt à null le moderemainingtime ?
    Movable.call(this, x, y, movablestate, mode, -1, direction, this.speedFromMode(mode));
    //Movable.call(this, x, y, MovableState.IMMOBILE, direction);
    //Movable.call(this, x, y, MovableState.PAUSED, direction);
    
    this._animtime = 0;
    this._mouthstartangle = 6/10;
    this._mouthendangle = -6/10;
};

Pacman.prototype = Object.create(Movable.prototype);
Pacman.prototype.constructor = Pacman;

Pacman.prototype.speedFromMode = function(mode)
{
    if (mode === PacmanMode.NORMAL)             {return PACMAN_SPEED;}
    else if (mode === PacmanMode.PP_EATEN)      {return PACMAN_PP_SPEED;}
};

Pacman.prototype.reinit = function(x, y, movablestate, direction)
{
    assert((typeof x === "number"), "x is not a number");
    assert((typeof y === "number"), "y is not a number");
    assert((isMovableState(movablestate)), "state is not a MovableState");
    assert((isDirection(direction)
         || (!isDirection(direction) && movablestate === MovableState.IMMOBILE)), "direction value is not valid");
    
    var mode = PacmanMode.NORMAL;
    
    Movable.prototype.reinit.call(this, x, y, movablestate, mode, -1, direction, this.speedFromMode(mode));
    
    this._animtime = 0;
    this._mouthstartangle = 6/10;
    this._mouthendangle = -6/10;
};

Pacman.prototype.allowedCorridors = function()
{
    var withcorridors = true;
    var withghosthouse = false;
    var withlinks = false;
    
    return new AllowedCorridors(withcorridors, withghosthouse, withlinks);
};

Pacman.prototype.draw = function()
{
    context.fillStyle = "yellow";
    
    if (this._mode.getID() == PacmanMode.PP_EATEN)
    {
        context.fillStyle = "red";
    }
    
    context.beginPath();
    context.moveTo(this._position.getX(), this._position.getY());
    context.arc(this._position.getX(),
                this._position.getY(),
                PACMAN_RADIUS,
                this._mouthstartangle,
                this._mouthendangle);
    context.fill();
};

Pacman.prototype.getState = function()
{
    return this._mode.getID();
};
Pacman.prototype.setState = function(state)
{
    assert((isPacmanMode(state)), "state value is not valid");

    this._mode.setID(state);
};

Pacman.prototype.getMouthstartangle = function()
{
    return this._mouthstartangle;
};
Pacman.prototype.setMouthstartangle = function(angle)
{
    assert((typeof angle === "number"), "angle is not a number");
    
    this._mouthstartangle = angle;
};

Pacman.prototype.getMouthendangle = function()
{
    return this._mouthendangle;
};
Pacman.prototype.setMouthendangle = function(angle)
{
    assert((typeof angle === "number"), "angle is not a number");
    
    this._mouthendangle = angle;
};







/* TODO
- on aura des pacman.move(maze) et ghost.move(maze, pacman) et des .handle_collision(maze, ghosts), ...
- tte facon soit on a des move(maze, ...) soit on a dans playingstate un gros move() qui utilisera le maze et le pacman et les ghosts en propriétés
- mais pr les collisions, comment faire ? et meme pr les deplacements ? enregistrer le trajet effectué pr chacun (chacun ayant un array de lignes representatn ce chemin) pendant le move() (sans tenir compte des collisions durant le move()), puis appeler pr chacun un handle_collisions() ? mais quand même, faut trouver comment detecter a quel endroit/moment a eu lieu la collision et tt, et agir en consequence... ; ou plutot un handle_collisions() global dans playingstate (sachant que pas de collision entre les fantomes) ; penser a d'abord deplacer le pacman puis les fantomes ensuite, puisqu'ils le suivent ; quoique en fait chacun pourrait avoir son propre handle_collisions() du moment que en parametre on envoie les elements avec lesquels faut checker ça (meme si y'aura des tests redondants ; quoique ici non, y'a que les collision pacman-ghost et pas ghost-ghost)
*/




/**
 * If possible, make the pacman immediately move to this direction,
 * otherwise plan to turn at the next intersection that allows that change.
 * If pacman is IMMOBILE, make him MOVING if going to this direction is immediately possible.
 * If pacman is PAUSED, make him MOVING if going to this direction is immediately or later (at an intersection) possible.
 */
Pacman.prototype.makeMovementToDirection = function(newdirection, maze)
{
    assert((isDirection(newdirection)), "newdirection value is not valid");
    assert((maze instanceof Maze), "maze is not a Maze");
    
    if (this._movablestate === MovableState.IMMOBILE)
    {
        if (maze.directionIsAvailable(this._position, newdirection))
        {
            this._direction = newdirection;
            this.resetNextTurn();
            
            this._movablestate = MovableState.MOVING;
        }
    }
    else if (this._movablestate === MovableState.PAUSED
          || this._movablestate === MovableState.MOVING)
    {
        if (maze.directionIsAvailable(this._position, newdirection))
        {
            this._direction = newdirection;
            this.resetNextTurn();
            
            if (this._movablestate === MovableState.PAUSED)
            {
                this._movablestate = MovableState.MOVING;
            }
        }
        else if (!maze.remainingLine(this._position, this._direction, this.allowedCorridors()).isPoint())
        {
            //TODO penser dans le checkConfig() a interdire de placer un pacman sur un portail avec une direction qui le fait traverser le portail (toute façon ca aurait pas de sens, car il serait immédiatement transporté au portail correspondant ; mais faut s'assurer que ce cas n'arrivera pas)
            //      => sinon faudrait ajouter au if : || isPortal(this._position), car on pourrait aller dans la direction traversant le portail ou bien aller dans une direction perpendiculaire a celle actuelle, en traversant le portail
            //      => et evidemment faudrait gerer ça aussi ci-dessous...

            var turnpoint = maze.nextTurn(this._position, this._direction, newdirection, this.allowedCorridors());
            var position = this._position;
            var direction = this._direction;
            var directlyavailableafterportal = false;
            
            // search through the next portals if we will be able to go this new direction
            while(typeof turnpoint === "undefined")
            {
                var remaining = maze.remainingLine(position, direction, this.allowedCorridors());
                var endpoint = null;
                
                if (this._direction === Direction.UP)           {endpoint = remaining.getPoint1();}
                else if (this._direction === Direction.RIGHT)   {endpoint = remaining.getPoint2();}
                else if (this._direction === Direction.DOWN)    {endpoint = remaining.getPoint2();}
                else if (this._direction === Direction.LEFT)    {endpoint = remaining.getPoint1();}
                
                if (maze.isPortal(endpoint.getX(), endpoint.getY()))
                {
                    associated = maze.associatedPortal(endpoint.getX(), endpoint.getY());
                    
                    //XXX for now, portals can only be on one line (no possibility of a horizontal line and a vertical line leading to the same portal)
                    //    and at the end of a line
                    
                    var line = maze.VLineContainer(associated.getPosition());
                    if (typeof line === "undefined")    {line = maze.HLineContainer(associated.getPosition());}
                    
                    // portals can only be on one line, and at an extremity, so this "if" means :
                    // if we want to go in the only available direction of the after-portal line
                    if (maze.directionIsAvailable(associated.getPosition(), newdirection))
                    {
                        directlyavailableafterportal = true;
                        break;
                    }
                    else if (line.isParallelToDirection(newdirection))      // if we are trying to go beyond the portal ; ex: the portal is at the bottom and newdirection === DOWN
                    {
                        break;
                    }
                    else        // newdirection is perpendicular to our line
                    {
                        position = associated.getPosition();
                        direction = maze.goingFromPortalDirection(associated.getPosition());
                        
                        turnpoint = maze.nextTurn(position, direction, newdirection, this.allowedCorridors());
                    }
                }
                else
                {
                    break;
                }
            }
            
            if (directlyavailableafterportal)
            {
                this.resetNextTurn();
                
                if (this._movablestate === MovableState.PAUSED)
                {
                    this._movablestate = MovableState.MOVING;
                }
            }
            else if (typeof turnpoint === "undefined")
            {
                this.resetNextTurn();
            }
            else
            {
                this._nextturndirection = newdirection;
                this._nextturnposition = turnpoint;
                
                if (this._movablestate === MovableState.PAUSED)
                {
                    this._movablestate = MovableState.MOVING;
                }
            }
        }
    }
};

/* TODO
    - y'a probablement des fonctions de maze qui devraient avoir les 3 parametres withXXX : car là le pacman risque d'aller à des endroits où il a pas le droit non ?
*/

Pacman.prototype.animate = function(elapsed)
{
    assert((elapsed > 0), "elapsed value is not valid");
    
    if (this._movablestate !== MovableState.MOVING)
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
    
    if (this._direction === Direction.UP)           {baseangle = 3*Math.PI/2;}
    else if (this._direction === Direction.DOWN)    {baseangle = Math.PI/2;}
    else if (this._direction === Direction.LEFT)    {baseangle = Math.PI;}
    else if (this._direction === Direction.RIGHT)   {baseangle = 0;}
    
    // at this._animtime = 0, we have the same angle that at the start
    mouthhalfangle = 6/10 * ((this._animtime < 500) ? 500-this._animtime : this._animtime-500)/500;
    
    this._mouthstartangle = baseangle + mouthhalfangle;
    this._mouthendangle = baseangle - mouthhalfangle;
};

// from p1 included to p2 included
Pacman.prototype.eatBetweenPoints = function(p1, p2, maze, status)
{
    var line = new Line(p1, p2);
    var eatenpacdots = [];
    var eatenpellets = [];
    
    for(var i=0; i<maze.getPacdots().length; i++)
    {
        if (line.containsPoint(maze.getPacdot(i).getPosition()))
        {
            status.increaseScore(PACDOT_POINT);
            maze.increaseEatenPacdots(1);
            eatenpacdots.push(i);
        }
    }
    
    for(var i=0; i<maze.getPellets().length; i++)
    {
        if (line.containsPoint(maze.getPellet(i).getPosition()))
        {
            status.increaseScore(PELLET_POINT);
            maze.increaseEatenPellets(1);
            eatenpellets.push(i);
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
        maze.deletePacdot(index);
    }
    
    for(var i=0; i<eatenpellets.length; i++)
    {
        var index = eatenpellets[eatenpellets.length-1 - i];
        maze.deletePellet(index);
    }
};

/* TODO

    => penser que move() doit rester le meme alors que les movexxx() sont sensés etre redefinis par pacman et ghost (voir si chacun devra ou non reecrire ce moveInsideRemainingLine(), c'est ptetre un peu chiant, surtout que la majorité sera identique ; ptetre pas a redefinir vu que y'aura les willtruc() dedans normalement)
    => pour que ghost soit au courant que pacman a mangé un power pellet : utiliser Status (mais du coup pour pacman aussi, si ghost prend/fait un truc special : et du coup, en supposant qu'on enregistre la date a laquelle ca a été fait, faut que le nextmodeupdate() soit adapté à ces modifs)
        => les updatemode() (appelés dans moveInsideRemainingLine()) prendront Status en argument, et comme c'est une methode de Movable, suffit de regarder le mode actuel, à comparer avec le nouveau mode passé en argument ! et on saura du coup si on vient de manger un pellet, ou si on repasse en NORMAL peu apres avoir mangé un pellet
                    => ou plutot (car c'est embetant de devoir a nouveau refaire les tests pour verifier, qu'on fait deja dans nextmodeupdateinside...()) mettre des arguments supplementaires pelleteaten_mode_on / pelleteaten_mode_off à l'objet ModeUpdate, que updatemode() traitera automatiquement avec le Status en argument ?
            ===> si le mode est pp_eaten, alors mettre dans status une propriete justatepowerpellet à true (du coup quand on en sorte, donc quand on va changer de mode a un updatemode(), si on etait en pp_eaten, et qu'on va etre en autre chose que pp_eaten, alors metrte cette propriete à false)
            ===> faudrait enregsitrer dans status le temps apres lequel on est passé en pp_eaten, et le temps apres lequel on est repassé en normal (comme ghost et pacman auront a chaque fois le meme elapsed au tout debut), car si jamais pour une raison ou une autre on a des durées super courtes, faut que les ghost sachent entre quand et quand ils sont "vulnérables"
    
    ====> mettre en place les willtruc() dans moveInsideRemainingLine() et teleport() (pas besoin dans move()) => du coup si c'est fait dans teleport, on peut enlever certains des willtruc()
    
    ===> faire les todo de moveInsideRemainingLine()
    

-------------------------------------------------
pour ghost :
    if (this.justLeavedHome(maze))
    {
        this._mode = GhostMode.NORMAL;
    }

    // if we were outside the ghosthouse and needed to go inside, and now we went inside 
    if (this.justCameHomeEaten(maze))
    {
        this._mode = GhostMode.ATHOME;
    }
    


Ghost.prototype.justLeavedHome = function(maze)
{
    return (this._mode === GhostMode.LEAVINGHOME && maze.containsPoint(this._position, new AllowedCorridors(true, false, false)));
};

Ghost.prototype.justCameHomeEaten = function(maze)
{
    return (this._mode === GhostMode.EATEN && maze.containsPoint(this._position, new AllowedCorridors(false, true, false)));
};



=> et c'est bien dans le nextmodeupdate() qu'il faut calculer où on passera dans un prochain mode (SCATTER puis CHASE, ...), grace a notre this._remainingtime/movement

-------------------------------------------------
*/

/**
/* de la position courante inclue à l'extrémité inclue (position courante si on est en extremite de notre ligne)
 */
Pacman.prototype.nextModeUpdateInsideRemainingLine = function(remaining, maze)
{
    var updatepoint = null;
    
    /* updates from current mode timeout */
    
    if (this._mode.getID() === PacmanMode.PP_EATEN)         /* going into mode PacmanMode.NORMAL */
    {
        if (remaining.isPoint())
        {
            // find when the PP_EATEN mode will stop
            
            if (this._mode.getRemainingTime() <= this._remainingtime)
            {
                if (updatepoint == null
                 || (updatepoint != null && this._position.distanceToPoint(updatepoint) > nearestdistance))
                {
                    updatepoint = new ModeUpdate(this._position.getX(), this._position.getY(), PacmanMode.NORMAL, PacmanModeDuration.NORMAL);
                }
            }
        }
        else
        {
            // find the point where the PP_EATEN mode stops
            
            var distance = Math.round(this._speed * this._mode.getRemainingTime()/1000);
            
            if (distance <= remaining.size()
             && distance <= this._remainingmovement)
            {
                var timeoutpoint = remaining.pointAtDistance(distance, this._direction);
                
                if (updatepoint == null
                 || (updatepoint != null && this._position.distanceToPoint(updatepoint) > nearestdistance))
                {
                    updatepoint = new ModeUpdate(timeoutpoint.getX(), timeoutpoint.getY(), PacmanMode.NORMAL, PacmanModeDuration.NORMAL);
                }
            }
        }
    }
    
    /* updates from events */
    
    if (this._mode.getID() === PacmanMode.NORMAL)           /* going into mode PacmanMode.PP_EATEN */
    {
        // find the nearest power pellet
        
        var pellets = [];
        
        for(var i=0; i<maze.getPellets().length; i++)
        {
            var pellet = maze.getPellet(i).getPosition();
            
            if (remaining.containsPoint(pellet))
            {
                pellets.push(pellet);
            }
        }
        
        if (pellets.length > 0)
        {
            var nearest = pellets[0];
            var nearestdistance = this._position.distanceToPoint(nearest);
            
            for(var i=1; i<pellets.length; i++)
            {
                if (this._position.distanceToPoint(pellets[i]) < nearestdistance)
                {
                    nearest = pellets[i];
                    nearestdistance = this._position.distanceToPoint(nearest);
                }
            }
            
            if (updatepoint == null
             || (updatepoint != null && this._position.distanceToPoint(updatepoint) > nearestdistance))
            {
                updatepoint = new ModeUpdate(nearest.getX(), nearest.getY(), PacmanMode.PP_EATEN, PacmanModeDuration.PP_EATEN);
            }
        }
    }
    
    return updatepoint;
};

// TODO 
//    - a des endroits j'ai des if() sur le remainingmovement, mais faudrait pas plutot remplacer par (ou ajouter) le remainingtime ???
//        (=> reste a verifier moveInsideRemainingLine())
//    - bug: apparemment quand on est deja rouge, et qu'on reprend un pellet, ça a aucun effet, ca rajoute meme pas de temps...
//    ----- de maniere generale, verifier l'utilisation des moveendremaining() ; au fait, dans moveEndRemaining, on met this._moderemainingtime à 0 si (this._remainingtime > this._moderemainingtime), or il se pourrait que on repasse dans un autre mode ayant aussi une durée limitée, et qu'il faille prendre ça en compte et lui décompter la différence entre this._remainingtime et this._moderemainingtime (et ainsi de suite si y'en a plusieurs d'affilée et suffisamment de temps) ; a moins qu'on appelle en fait le moveendremaining() toujours au bon moment en fait ?
//              => euh en fait normalement, le nextmodeupdate...() a deja pris en compte les possibilités de timeout du mode courant... donc le moveendremaining() devrait ptetre pas avoir a s'en preoccuper


// even if position.ispoint()
Pacman.prototype.moveInsideRemainingLine = function(remaining, maze, status)
{
    if (this._movablestate !== MovableState.MOVING
     || !this.hasRemainingMovement()
     || !this.hasRemainingTime())
    {
        this.moveEndRemaining();
        return;
    }

    var modeupdate = this.nextModeUpdateInsideRemainingLine(remaining, maze);
    var currentline = null;

    // while we will reach a mode update point
    while (modeupdate != null && this._remainingmovement >= this._position.distanceToPoint(modeupdate.getPoint()))
    {
        currentline = new Line(new Point(this._position.getX(), this._position.getY()), new Point(modeupdate.getPoint().getX(), modeupdate.getPoint().getY()));
        
        // if we will reach a next turn point
        if (this.hasNextTurn()
         && currentline.containsPoint(this._nextturnposition))
        {
            this.goToPointInsideRemainingLine(currentline, this._nextturnposition, maze, status);
            
            if (this._nextturnposition.equalsPoint(modeupdate.getPoint()))
            {
                this.updateMode(modeupdate.getModeID(), modeupdate.getModeRemainingTime());
            }
            
            this._direction = this._nextturndirection;
            this.resetNextTurn();
            
            return;
        }
        else
        {
            this.goToPointInsideRemainingLine(currentline, modeupdate.getPoint(), maze, status);
            //TODO on pourrait etre un ispoint(), faudrait pas du coup que mode inclue non seulement sa position sur le labyrinthe mais aussi dans le temps (date de declenchement) ?
            this.updateMode(modeupdate.getModeID(), modeupdate.getModeRemainingTime());
            
            if (maze.isPortal(this.getPosition().getX(), this.getPosition().getY()))
            {
                this.teleportToAssociatedPortal(maze, status);
                
                //TODO ajouter test apres le teleport pour voir si y'a pas un modechange juste sur le point où il a été téléporté (ismodupdate...())
                //          => quoique, puisque en fait cette fonction ne fait que, au maximum, s'occuper de la ligne courante, voire le teleport ; le move() appellera a nouveau moveInsideRemainingLine() s'il y a lieu, et a ce moment-là seulement y'aura un nextModeUpdateInsideRemainingLine() (celui a la ligne 4004)
                
                return;
            }
            
            //TODO et ce truc-là faudrait plutôt continuer à boucler (ou mettre un while imbriqué) pour le cas où des états doivent s'enchainer dans le temps, sans avoir à passer sur un bonus ou autre
            if (remaining.isExtremity(this.getPosition()))
            {
                this.moveEndRemaining();
                
                return;
            }
            
            if (this.hasRemainingMovement())
            {
                remaining = maze.remainingLine(this._position, this._direction, this.allowedCorridors());
                modeupdate = this.nextModeUpdateInsideRemainingLine(remaining, maze);
            }
            else
            {
                return;
            }
        }
    }
    
    if (remaining.isPoint())
    {
        this.moveEndRemaining();
        return;
        
        //TODO tester aussi si on est pas sur un portail, et donc alors teleport, puis test apres le teleport si modechange
    }

    // if we will reach a next turn during our movement
    if (this.hasNextTurn()
     && remaining.containsPoint(this._nextturnposition)
     && this._remainingmovement >= this._position.distanceToPoint(this._nextturnposition))
    {
        this.goToPointInsideRemainingLine(remaining, this._nextturnposition, maze, status);
        
        this._direction = this._nextturndirection;
        this.resetNextTurn();
    }
    else if (this._remainingmovement >= remaining.size())
    {
        var extremity = remaining.extremity(this._direction);
        
        this.goToPointInsideRemainingLine(remaining, extremity, maze, status);
        
        if (maze.isPortal(this.getPosition().getX(), this.getPosition().getY()))
        {
            this.teleportToAssociatedPortal(maze, status);
            
            //TODO ajouter test apres le teleport pour voir si y'a pas un modechange juste sur le point où il a été téléporté (ismodupdate...())
        }
        else
        {
            this.moveEndRemaining();
        }
    }
    else
    {
        var destination = remaining.pointAtDistance(this._remainingmovement, this._direction);
        
        this.goToPointInsideRemainingLine(remaining, destination, maze, status);
    }
};

Pacman.prototype.goToPointInsideRemainingLine = function(remaining, point, maze, status)
{
    if (this._movablestate !== MovableState.MOVING
     || !this.hasRemainingMovement()
     || !this.hasRemainingTime()
     || remaining.isPoint())
    {
        return;
    }
    
    var oldposition = new Point(this.getPosition().getX(), this.getPosition().getY());
    
    this.setPosition(point.getX(), point.getY());
    this.eatBetweenPoints(oldposition, this._position, maze, status);
    this.moveUpdateRemainingFromMovement(-1 * oldposition.distanceToPoint(this._position));
};

Pacman.prototype.teleportToAssociatedPortal = function(maze, status)
{
    var associated = maze.associatedPortal(this.getPosition().getX(), this.getPosition().getY());
    
    this.setPosition(associated.getPosition().getX(), associated.getPosition().getY());
    
    // search and assign the new current direction after teleportation
    
    var directions = []
    directions = maze.availableDirections(this.getPosition());
    
    // there will be only one direction in the array
    // (portals can only be on one line, and at an extremity)
    this._direction = directions[0];
};

Pacman.prototype.move = function(elapsed, maze, status)
{
    assert((elapsed > 0), "elapsed value is not valid");
    
    if (this._movablestate !== MovableState.MOVING)
    {
        return;
    }
    
    this.moveBeginRemainingFromTime(elapsed);
    
    var remaining = maze.remainingLine(this._position, this._direction, this.allowedCorridors());
    
    //TODO verifier si y'a pas des moveend() qui manquent dans moveinsideremainingline()
    
    // (we can't be on a portal and in need to be teleported, nor we can be at an intersection in need to turn,
    //  as the move() would have teleported us or make us turn at the previous step)
    while (this.hasRemainingTime())
    {
        this.moveInsideRemainingLine(remaining, maze, status);
        remaining = maze.remainingLine(this._position, this._direction, this.allowedCorridors());
    }
};



/******************************************************************************/
/******************************** Ghost class *********************************/
/******************************************************************************/

var Ghost = function(id, x, y, movablestate, direction)
{
    assert((typeof x === "number"), "x is not a number");
    assert((typeof y === "number"), "y is not a number");
    assert((isMovableState(movablestate)), "state is not a MovableState");
    assert((isDirection(direction)
         || (!isDirection(direction) && movablestate === MovableState.IMMOBILE)), "direction value is not valid");
    
    var mode = null;
    
    if (id === GhostType.BLINKY)        {mode = GhostMode.NORMAL;}
    else if (id === GhostType.PINKY)    {mode = GhostMode.LEAVINGHOME;}
    else if (id === GhostType.INKY)     {mode = GhostMode.ATHOME;}
    else if (id === GhostType.CLYDE)    {mode = GhostMode.ATHOME;}
    
    Movable.call(this, x, y, movablestate, mode, -1, direction, this.speedFromMode(mode));
    
    this._id = id;
    
    this._animtime = 0;
    this._normalwave = true;
};

Ghost.prototype = Object.create(Movable.prototype);
Ghost.prototype.constructor = Ghost;

Ghost.prototype.speedFromMode = function(mode)
{
    if (mode === GhostMode.ATHOME)              {return GHOST_ATHOME_SPEED;}
    else if (mode === GhostMode.LEAVINGHOME)    {return GHOST_LEAVINGHOME_SPEED;}
    else if (mode === GhostMode.NORMAL)         {return GHOST_SPEED;}
    else if (mode === GhostMode.FRIGHTENED)     {return GHOST_FRIGHTENED_SPEED;}
    else if (mode === GhostMode.EATEN)          {return GHOST_EATEN_SPEED;}
};

Ghost.prototype.reinit = function(id, x, y, movablestate, direction)
{
    assert((typeof x === "number"), "x is not a number");
    assert((typeof y === "number"), "y is not a number");
    assert((isMovableState(movablestate)), "state is not a MovableState");
    assert((isDirection(direction)
         || (!isDirection(direction) && movablestate === MovableState.IMMOBILE)), "direction value is not valid");
    
    var mode = null;
    
    if (id === GhostType.BLINKY)        {mode = GhostMode.NORMAL;}
    else if (id === GhostType.PINKY)    {mode = GhostMode.LEAVINGHOME;}
    else if (id === GhostType.INKY)     {mode = GhostMode.ATHOME;}
    else if (id === GhostType.CLYDE)    {mode = GhostMode.ATHOME;}
    
    Movable.prototype.reinit.call(this, x, y, movablestate, mode, -1, direction, this.speedFromMode(mode));
    
    this._id = id;
    
    this._animtime = 0;
    this._normalwave = true;
};

Ghost.prototype.getID = function()
{
    return this._id;
};

/*TODO y'a plusieurs trucs a mettre en constantes */
Ghost.prototype.draw = function()
{
    var baseX = Math.floor(this._position.getX());
    var baseY = Math.floor(this._position.getY());
    
    context.fillStyle = "white";
    
    if (this._id === GhostType.BLINKY)      {context.fillStyle = "red";}
    else if (this._id === GhostType.PINKY)  {context.fillStyle = "pink";}
    else if (this._id === GhostType.INKY)   {context.fillStyle = "cyan";}
    else if (this._id === GhostType.CLYDE)  {context.fillStyle = "orange";}

    var waveheight = 2 * Math.floor(GHOST_TOTALHEIGHT/10);
    
    /* draw the global shape */
    
    context.beginPath();
    context.arc(baseX, baseY - Math.floor(GHOST_TOTALHEIGHT/2) + Math.floor(GHOST_WIDTH/2), Math.floor(GHOST_WIDTH/2), Math.PI, 0);
    context.closePath();
    context.fill();
    
    context.fillRect(baseX - Math.floor(GHOST_WIDTH/2),
                     baseY + Math.floor(GHOST_TOTALHEIGHT/2) - GHOST_LOWERHEIGHT,
                     GHOST_WIDTH,
                     GHOST_LOWERHEIGHT - waveheight);
    
    /* draw the "waves" at the bottom */
    
    if (this._normalwave)
    {
        var Ssize = (0.3/4.2) * GHOST_WIDTH;
        var Msize = (0.6/4.2) * GHOST_WIDTH;
        var Lsize = (0.9/4.2) * GHOST_WIDTH;
        
        context.fillRect(baseX - GHOST_WIDTH/2,
                         baseY + GHOST_TOTALHEIGHT/2 - waveheight,
                         Ssize,
                         waveheight);
        context.fillRect(baseX - GHOST_WIDTH/2 + Ssize,
                         baseY + GHOST_TOTALHEIGHT/2 - waveheight,
                         Ssize,
                         waveheight/2);
        
        context.fillRect(baseX - GHOST_WIDTH/2 + 3*Ssize,
                         baseY + GHOST_TOTALHEIGHT/2 - waveheight,
                         Ssize,
                         waveheight/2);
        context.fillRect(baseX - GHOST_WIDTH/2 + 4*Ssize,
                         baseY + GHOST_TOTALHEIGHT/2 - waveheight,
                         Msize,
                         waveheight);
        
        context.fillRect(baseX - GHOST_WIDTH/2 + 4*Ssize + Msize + Msize,
                         baseY + GHOST_TOTALHEIGHT/2 - waveheight,
                         Msize,
                         waveheight);
        context.fillRect(baseX - GHOST_WIDTH/2 + 4*Ssize + Msize + Msize + Msize,
                         baseY + GHOST_TOTALHEIGHT/2 - waveheight,
                         Ssize,
                         waveheight/2);
        
        context.fillRect(baseX - GHOST_WIDTH/2 + 4*Ssize + Msize + Msize + Msize + 2*Ssize,
                         baseY + GHOST_TOTALHEIGHT/2 - waveheight,
                         Ssize,
                         waveheight/2);
        context.fillRect(baseX - GHOST_WIDTH/2 + 4*Ssize + Msize + Msize + Msize + 2*Ssize + Ssize,
                         baseY + GHOST_TOTALHEIGHT/2 - waveheight,
                         Ssize,
                         waveheight);
    }
    else
    {
        var Ssize = (0.3/4.2) * GHOST_WIDTH;
        var Msize = (0.4/4.2) * GHOST_WIDTH;
        var Lsize = (0.5/4.2) * GHOST_WIDTH;
        var XLsize = (0.6/4.2) * GHOST_WIDTH;
        
        context.fillRect(baseX - GHOST_WIDTH/2,
                         baseY + GHOST_TOTALHEIGHT/2 - waveheight,
                         Lsize,
                         waveheight);
        
        context.fillRect(baseX - GHOST_WIDTH/2 + Lsize + XLsize,
                         baseY + GHOST_TOTALHEIGHT/2 - waveheight,
                         Lsize,
                         waveheight);
        context.fillRect(baseX - GHOST_WIDTH/2 + Lsize + XLsize + Lsize,
                         baseY + GHOST_TOTALHEIGHT/2 - waveheight,
                         Ssize,
                         waveheight/2);
        
        context.fillRect(baseX - GHOST_WIDTH/2 + Lsize + XLsize + Lsize + Ssize + Msize,
                         baseY + GHOST_TOTALHEIGHT/2 - waveheight,
                         Ssize,
                         waveheight/2);
        context.fillRect(baseX - GHOST_WIDTH/2 + Lsize + XLsize + Lsize + Ssize + Msize + Ssize,
                         baseY + GHOST_TOTALHEIGHT/2 - waveheight,
                         Lsize,
                         waveheight);
        
        context.fillRect(baseX - GHOST_WIDTH/2 + Lsize + XLsize + Lsize + Ssize + Msize + Ssize + Lsize + XLsize,
                         baseY + GHOST_TOTALHEIGHT/2 - waveheight,
                         Lsize,
                         waveheight);
    }
    
    /* draw the eyes */
    
    context.fillStyle = "white";
    
    var eyeradius = GHOST_WIDTH/4 - 2;
    var irisradius = eyeradius-2;
    
    context.beginPath();
    context.arc(baseX - 1 - eyeradius, baseY - GHOST_TOTALHEIGHT/2 + GHOST_WIDTH/2 - 2, eyeradius, 0, 2*Math.PI);
    context.fill();
    context.beginPath();
    context.arc(baseX + 1 + eyeradius, baseY - GHOST_TOTALHEIGHT/2 + GHOST_WIDTH/2 - 2, eyeradius, 0, 2*Math.PI);
    context.fill();
    
    /* draw the irises */
    
    context.fillStyle = "blue";
    
    var paddingX = 0;
    var paddingY = 0;
    
    if (this._movablestate === MovableState.IMMOBILE)   {paddingX = 0; paddingY = 0;}
    else
    {
        if (this._direction === Direction.UP)           {paddingY = -2;}
        else if (this._direction === Direction.DOWN)    {paddingY = 2;}
        else if (this._direction === Direction.LEFT)    {paddingX = -2;}
        else if (this._direction === Direction.RIGHT)   {paddingX = 2;}
    }
    
    context.beginPath();
    context.arc(baseX - 1 - eyeradius + paddingX, baseY - GHOST_TOTALHEIGHT/2 + GHOST_WIDTH/2 - 2 + paddingY, irisradius, 0, 2*Math.PI);
    context.fill();
    context.beginPath();
    context.arc(baseX + 1 + eyeradius + paddingX, baseY - GHOST_TOTALHEIGHT/2 + GHOST_WIDTH/2 - 2 + paddingY, irisradius, 0, 2*Math.PI);
    context.fill();
};

Ghost.prototype.animate = function(elapsed)
{
    if (this._movablestate !== MovableState.MOVING)
    {
        return;
    }
    
    this._animtime = (this._animtime + elapsed) % (1000);
    this._normalwave = (this._animtime < 250 || (this._animtime > 500 && this._animtime < 750));
};

Ghost.prototype.justLeavedHome = function(maze)
{
    return (this._mode.getID() === GhostMode.LEAVINGHOME && maze.containsPoint(this._position, new AllowedCorridors(true, false, false)));
};

Ghost.prototype.justCameHomeEaten = function(maze)
{
    return (this._mode.getID() === GhostMode.EATEN && maze.containsPoint(this._position, new AllowedCorridors(false, true, false)));
};






/* TODO
    ===> en plus, faudrait ptetre avoir les methodes de movexxx() dans Movable, et Pacman (il le faut, a cause des 3 parametres) et Ghost redefinissent celles-ci si necessaire => du coup on modifie les movexxx() mais le move() principal reste le même ? et du coup faudrait remplacer les appels direct a des setposition() ou autre pour que ce soit fait par un moveToPoint() par exemple, et que ce soit redefinissable...
    

        ===> EN FAIT, le updatestate(maze) ne fera rien sur les parametres et trucs du genre, il s'occupera bien uniquement de l'etat comme GhostMode et de le modifier selon si on vient juste de quitter la maison, etc.... (if justleaving() etc...) , puisque le allowedCorridors() checke lui-meme ce qui est autorisé ou pas
        
        ===> AUSSI, faire le truc des movexxx() mutualisés dans movable, qui appelleraient des updatestate() et donc des allowedCorridors() redefinis dans Pacman et Ghost, ce qui permettrait de ne pas avoir a modifier le code de maniere generale : en fait, suffit de mettre des updatestate() a chaque fois qu'on bouge a priori
        ===> quoique en fait, les updatestate() devraient ptetre pas etre a l'interieur des movexxx() ?


    => dans certains tests, degager les === true et === false ; mais pour certaines fonctions (notamment de Line, jcrois que y'a une ambiguite sur les ispoint ou isintersection ou autre...) verifier qu'on a bien seulement ces 2 possibilités


===> plus tard faudra mettre en place le changement de vitesse pour certains modes (creer 2-3 macros supplementaire du coup) ; et du coup lors du move() si on se rend compte que a partir de tel point on change de vitesse, ou qu'on passe dans un mode avec une vitesse differente, ben faudra faire un "return move()" avec des arguments mis à jour pour que la trajectoire parte du point où la vitesse change
        ===> A MOINS QUE on mette en propriété (genre dans un this._remainingtime) du pacman/ghost le elapsed qu'on nous fournit en argument du move() ; du coup vu qu'on connaitra la vitesse courante, ainsi que la distance jusqu'au point qui déclenche un changement de vitesse, on déduit le temps que ça prend pour aller jusqu'à ce point, et on peut le soustraire du this._remainingtime
            => du coup pour pacman : meme depuis eatBetweenPoints()
            => et pour ghost : 
            => en fait pour les 2, (depuis eatBetweenPoints() pour l'un, depuis movexxx() pour l'autre) comment faire ensuite pour se mettre au bon endroit en fonction de la nouvelle vitesse ??? faudrait recalculer quasiment tt le temps le mouvement restant et tt...
            ====> AU FINAL : mettre en propriete un this._remainingtime et un this._remainingmovement ; creer dans movable un modeWillChange(remaining, ...) retournant un booléen, constitué des if du updatestate prevu (en fait c'est la même chose que le updatestate(), sauf que au lieu de faire if ... this._mode=truc, on fait if ... return true/false => pacman: if remaining.containsPowerPellet() return true ; ghost: if remaining.containsLinksCorridorsLimit/containsLinksGhosthouseLimit/containsCorridorsGhosthouseLimit() return true, ou juste les if justleaved() ... return true ou les if this._mode...&& maze.containsPoint()... return true ???)
                => pacman : dans les movexxx(), faudra utiliser des if remaining.containsPowerPellet() 
                => ghost : dans les movexxx(), faudra utiliser des if remaining.containsLinksCorridorsLimit/containsLinksGhosthouseLimit/containsCorridorsGhosthouseLimit()
            ===============> OU ALORS EN FAIT, faut juste que chacun modifie les movexxx(), mais le move() principal reste le même pour les 2 ! ce qui serait ptetre plus logique en fait, vu que chacun a ses propres trucs et evenements a prendre en compte dans les movexxx(), mais que le move principal n'a pas à changer ! et donc chacun dans ses movexxx() pourra faire ses petites verif si le mode va changer et dans ce cas il s'occupera du temps/distance restante comme il faut (et d'ailleurs, vu que les movexxx() sont des fonctions simples, genre se deplacer sur un ligne, en fait on pourra ptetre au final quand meme mutualiser les detections de chagement de mode et les update de mode ?)

    
*/

Ghost.prototype.allowedCorridors = function()
{
    var withcorridors = false;
    var withghosthouse = false;
    var withlinks = false;

    if (this._mode.getID() === GhostMode.NORMAL || this._mode.getID() === GhostMode.FRIGHTENED)
    {
        withcorridors = true;
    }
    
    if (this._mode.getID() === GhostMode.ATHOME)
    {
        withghosthouse = true;
        withlinks = true;
    }
    
    if (this._mode.getID() === GhostMode.EATEN || this._mode.getID() === GhostMode.LEAVINGHOME)
    {
        withcorridors = true;
        withghosthouse = true;
        withlinks = true;
    }
    
    return new AllowedCorridors(withcorridors, withghosthouse, withlinks);
};

Ghost.prototype.move = function(elapsed, maze)
{
    assert((elapsed > 0), "elapsed value is not valid");
    
    if (this._direction == null)
    {
        return;
    }
    
    var movement = Math.round(this._speed * elapsed/1000);
    var limit = 0;
    var turndistance = 0;
    
    if (this.hasNextTurn())
    {
        turndistance = this._nextturnposition.distanceToPoint(this._position);
    }
    
    /* if we will have to turn */
    if (this.hasNextTurn()
     && turndistance <= movement)
    {
        /* move towards the intersection point */
        
        this.setPosition(this._nextturnposition.getX(), this._nextturnposition.getY());
        this._direction = this._nextturndirection;
        this.resetNextTurn();
        
        movement -= turndistance;
        
        /* if we were inside the ghosthouse, and now we leaved it */
        if (this._mode.getID() === GhostMode.LEAVINGHOME && maze.containsPoint(this._position, new AllowedCorridors(true, false, false)))
        {
            this._mode.setID(GhostMode.NORMAL);
        }
        
        /* if we were outside the ghosthouse and needed to go inside, and now we went inside */
        if (this._mode.getID() === GhostMode.EATEN && maze.containsPoint(this._position, new AllowedCorridors(false, true, false)))
        {
            this._mode.setID(GhostMode.ATHOME);
        }
    }
    
    var newx = 0;
    var newy = 0;
    
    var remaining = maze.remainingLine(this._position, this._direction, this.allowedCorridors());
    
    if (this._direction === Direction.UP)
    {
        limit = remaining.getPoint1().getY();
        newx = this._position.getX();
        newy = (this._position.getY()-movement > limit) ? this._position.getY()-movement : limit ;
    }
    else if (this._direction === Direction.DOWN)
    {
        limit = remaining.getPoint2().getY();
        newx = this._position.getX();
        newy = (this._position.getY()+movement < limit) ? this._position.getY()+movement : limit ;
    }
    else if (this._direction === Direction.LEFT)
    {
        limit = remaining.getPoint1().getX();
        newx = (this._position.getX()-movement > limit) ? this._position.getX()-movement : limit ;
        newy = this._position.getY();
    }
    else
    {
        limit = remaining.getPoint2().getX();
        newx = (this._position.getX()+movement < limit) ? this._position.getX()+movement : limit ;
        newy = this._position.getY();
    }
    
    this.setPosition(newx, newy);
    
    if (this.justLeavedHome(maze))
    {
        this._mode.setID(GhostMode.NORMAL);
    }
    
    if (this.justCameHomeEaten(maze))
    {
        this._mode.setID(GhostMode.ATHOME);
    }
    
    /* if we enter a teleportation tunnel */
    if (maze.isPortal(this._position.getX(), this._position.getY()))
    {
        var p = maze.associatedPortal(this._position.getX(), this._position.getY());
        
        this.setPosition(p.getPosition().getX(), p.getPosition().getY());
        
        /* search if we can now turn after the teleportation */
        
        if (this._nextturndirection !== null
         && this._nextturnposition === null)
        {
            var nt = maze.nextTurn(this._position, this._direction, this._nextturndirection, this.allowedCorridors());
            
            this.setNextTurnPosition(nt);
        }
    }
};

Ghost.prototype.movementAIToTargetFromPoint = function(maze, target, point)
{
    var directions = maze.availableDirections(point);
    
    var bestdirection = null;
    var bestdistance = Number.MAX_VALUE;
    
    for(var i=0; i<directions.length; i++)
    {
        // if choosing that direction would not cause the ghost to go back
        // (original pacman rules : the ghost can't go back)
        if ((directions[i] === Direction.UP && this._direction !== Direction.DOWN)
         || (directions[i] === Direction.RIGHT && this._direction !== Direction.LEFT)
         || (directions[i] === Direction.DOWN && this._direction !== Direction.UP)
         || (directions[i] === Direction.LEFT && this._direction !== Direction.RIGHT))
        {
            var possibleposition = null;
            
            if (directions[i] === Direction.UP)     {possibleposition = new Point(point.getX(), point.getY() - GRID_UNIT);}
            if (directions[i] === Direction.RIGHT)  {possibleposition = new Point(point.getX() + GRID_UNIT, point.getY());}
            if (directions[i] === Direction.DOWN)   {possibleposition = new Point(point.getX(), point.getY() + GRID_UNIT);}
            if (directions[i] === Direction.LEFT)   {possibleposition = new Point(point.getX() - GRID_UNIT, point.getY());}
            
            if (maze.containsPoint(possibleposition, this.allowedCorridors()))
            {
                var possibledistance = possibleposition.distanceToPoint(target);
                
                if (possibledistance < bestdistance)
                {
                    bestdistance = possibledistance;
                    bestdirection = directions[i];
                }
                else if (possibledistance === bestdistance)
                {
                    // (original pacman rules : if equal distance, priority for chosen direction is up > left > down)
                    if (bestdirection === Direction.RIGHT
                     || (bestdirection === Direction.DOWN && (directions[i] === Direction.LEFT || directions[i] === Direction.UP))
                     || (bestdirection === Direction.LEFT && directions[i] === Direction.UP))
                    {
                        bestdirection = directions[i];
                    }
                }
            }
        }
    }
    
    if (this._direction == null || maze.isIntersection(this._position))
    {
        this._direction = bestdirection;
        this.resetNextTurn();
    }
    else if (this._direction === bestdirection)
    {
        this.resetNextTurn();
    }
    else
    {
        this._nextturndirection = bestdirection;
        this._nextturnposition = new Point(point.getX(), point.getY());
    }
};

Ghost.prototype.movementAIToTarget = function(maze, target)
{
    // - return a Point even if the corridor just make a 90° angle
    // - doesn't return anything if the corridor is a dead end
    // - return the intersection if the ghost is exactly on it, only if the "remaining" line of the ghost is a point
    
    if (this._position.equalsPoint(target)) // TODO et aussi cas où on est dans une impasse
    {
        return;
    }
    
    if (this._direction == null
     || maze.isIntersection(this._position))
    {
        this.movementAIToTargetFromPoint(maze, target, this._position);
        return;
    }
    
    //TODO ptetre verifier l'utilisation des movementAIToTargetFromPoint... des fois on envoie la position courante et des fois celle de l'intersection suivante ? ca pose pas un probleme quand on affecte les (next)direction/turn dedans ??? car la fonction peut pas savoir si faut modif nextdir/turn ou bien juste la direction actuelle (meme si le movementAIToTargetFromPoint triche en utilisant un if (this._direction == null || maze.isIntersection(this._position)))... faudrait separer en 2 fonctions, pour depuis le ghost et pour depuis un (next)point, meme si ces 2 fonctions ont une grande partie en commun... faire une 3eme fonction de "base" que les 2 précédetes utilisent ?
    var int = maze.nextIntersection(this._position, this._direction, this.allowedCorridors());
    
    if (typeof int !== "undefined" && !int.equalsPoint(target))
    {
        this.movementAIToTargetFromPoint(maze, target, int);
    }
    
    /*
        else it's a dead end (maybe a teleporter), and the ghost has to continue
    */
    /* TODO
            - etant donne que maintenant on a isIntersection() et remainingLine(), nextIntersection() devrait ptetre plu renvoyer le turn si on est dessus et ceci quelle que soit la situation = faire comme le nextturn de maintenant ?
    */
};

Ghost.prototype.movementAIRandom = function(maze)
{
        //TODO sauf qu'en fait faut faire tout ca que a une intersection, on change pas la direction comme ça tt le temps... ; et si on a null, on fait comme dans movementAIToTarget => d'abord on se choisit une direction aleatoire, puis on continue et on decide pr la prochaine intersection
        
    var directions = maze.availableDirections(point);
    
    var newdirection = directions[Math.floor(Math.random()*(directions.length))];
    
    if (this._direction == null)
    {
        this._direction = newdirection;
        this.resetNextTurn();
    }
    else if (this._direction === newdirection)
    {
        this.resetNextTurn();
    }
    else
    {
        this._nextturndirection = bestdirection;
        this._nextturnposition = new Point(point.getX(), point.getY());
    }
};

Ghost.prototype.movementAI = function(elapsed, maze, pacman)
{
    /****************************** "BLINKY" AI ******************************/
    
    if (this._id === GhostType.BLINKY)
    {
        //if (maze.isIntersection(this._position)) {console.log("intersec");}
        //console.log("====avant========== " + this._direction + " / " + this._nextturndirection);
        this.movementAIToTarget(maze, pacman.getPosition());
        //console.log("====apres========== " + this._direction + " / " + this._nextturndirection);
        /*XXX etrange...
        
"====apres========== 1 / 3" pacman.js:4652
"====avant========== 1 / 3" pacman.js:4650
"====apres========== 1 / 3" pacman.js:4652
"====avant========== 3 / null" pacman.js:4650
"====apres========== 2 / null" pacman.js:4652
"====avant========== 2 / null" pacman.js:4650
"====apres========== 2 / 3" pacman.js:4652
"====avant========== 2 / 3" pacman.js:4650
"====apres========== 2 / 3"

    => donc a un moment, on sait pas pourquoi, il passe a 2 = DOWN...
    
"====avant========== 2 / 4" pacman.js:4651
"====apres========== 2 / 4" pacman.js:4653
"====avant========== 2 / 4" pacman.js:4651
"====apres========== 2 / 4" pacman.js:4653
"intersec" pacman.js:4650
"====avant========== 4 / null" pacman.js:4651
"====apres========== 1 / null" pacman.js:4653
"====avant========== 1 / null" pacman.js:4651
"====apres========== 1 / null"

    => donc en fait, le move l'a fait bouger, et il se trouve que ca met le ghost pile sur l'intersection ; avec la direction normale, vers la droite dans notre cas ;
       mais au calcul de la nouvelle direction, vu qu'on est sur l'intersection et que la direction actuelle ne nous en empeche pas... ben on va dans la direction qu'on devrait pas... solution: dans le move(), toujours faire tres legerement avancer le ghost lorsqu'on est pile a une intersection (pour pas qu'on soit positionné dans une direction mais qu'on y aille jamais au final a cause de la recherche de direction qui suivra le move()) ? 
        */
    }
    
    /******************************* "PINKY" AI ******************************/
    
    if (this._id === GhostType.PINKY)
    {
        if (this._mode.getID() === GhostMode.ATHOME)
        {
            this._mode.setID(GhostMode.LEAVINGHOME);
        }
        
        if (this._mode.getID() === GhostMode.LEAVINGHOME)
        {
            // go to the link extremity which is not inside the ghost house
            
            var links = maze.getLinks();
            var target = null;
            
            // use as a target the first link extremity which is not inside the ghost house
            for(var i=0; i<links.length; i++)
            {
                var p1 = links[i].getLine().getPoint1();
                var p2 = links[i].getLine().getPoint2();
                
                if (!maze.containsPoint(p1, new AllowedCorridors(false, true, false)))    {target = p1; break;}
                if (!maze.containsPoint(p2, new AllowedCorridors(false, true, false)))    {target = p2; break;}
            }
            
            this.movementAIToTarget(maze, target);
        }
        
        if (this._mode.getID() === GhostMode.NORMAL)
        {
            this.movementAIToTarget(maze, pacman.getPosition());
        }
    }
    
    /******************************* "INKY" AI *******************************/
    
    if (this._id === GhostType.INKY)
    {
        if (maze.getEatenPacdots() < 30)
        {
            if (this._mode.getID() === GhostMode.ATHOME)
            {
                var current = null;
                
                if (this._direction == null)
                {
                    var vline = Maze.VLineContainer(this._position);
                    
                    if (typeof vline === "undefined")
                    {
                        current = Maze.HLineContainer(this._position);
                        this._direction = Direction.LEFT;
                    }
                    else
                    {
                        current = vline;
                        this._direction = Direction.UP;
                    }
                }
                else
                {
                    current = maze.currentLine(this._position, this._direction, this.allowedCorridors());
                }
                
                var newdirection = this._direction;
                
                // make the ghost do up/down/up/down/... moves
                if (isVertical(current))
                {
                    if (current.getPoint1().equalsPoint(this._position))    {newdirection = Direction.DOWN;}
                    if (current.getPoint2().equalsPoint(this._position))    {newdirection = Direction.UP;}
                }
                
                // make the ghost do left/right/left/right/... moves
                if (isHorizontal(current))
                {
                    if (current.getPoint1().equalsPoint(this._position))    {newdirection = Direction.RIGHT;}
                    if (current.getPoint2().equalsPoint(this._position))    {newdirection = Direction.LEFT;}
                }
                
                this._direction = newdirection;
                this.resetNextTurn();
            }
        }
        else
        {
            if (this._mode.getID() === GhostMode.ATHOME)
            {
                this._mode.setID(GhostMode.LEAVINGHOME);
            }
            
            if (this._mode.getID() === GhostMode.LEAVINGHOME)
            {
                // go to the link extremity which is not inside the ghost house
                
                var links = maze.getLinks();
                var target = null;
                
                // use as a target the first link extremity which is not inside the ghost house
                for(var i=0; i<links.length; i++)
                {
                    var p1 = links[i].getLine().getPoint1();
                    var p2 = links[i].getLine().getPoint2();
                    
                    if (!maze.containsPoint(p1, new AllowedCorridors(false, true, false)))    {target = p1; break;}
                    if (!maze.containsPoint(p2, new AllowedCorridors(false, true, false)))    {target = p2; break;}
                }
                
                this.movementAIToTarget(maze, target);
            }
            
            if (this._mode.getID() === GhostMode.NORMAL)
            {
                this.movementAIToTarget(maze, pacman.getPosition());
            }
        }
    }
    
    /******************************* "CLYDE" AI ******************************/
    
    if (this._id === GhostType.CLYDE)
    {
        if (maze.getEatenPacdots() < (maze.getTotalPacdots())/3)
        {
            if (this._mode.getID() === GhostMode.ATHOME)
            {
                var current = null;
                
                if (this._direction == null)
                {
                    var vline = Maze.VLineContainer(this._position);
                    
                    if (typeof vline === "undefined")
                    {
                        current = Maze.HLineContainer(this._position);
                        this._direction = Direction.LEFT;
                    }
                    else
                    {
                        current = vline;
                        this._direction = Direction.UP;
                    }
                }
                else
                {
                    current = maze.currentLine(this._position, this._direction, this.allowedCorridors());
                }
                
                var newdirection = this._direction;
                
                // make the ghost do up/down/up/down/... moves
                if (isVertical(current))
                {
                    if (current.getPoint1().equalsPoint(this._position))    {newdirection = Direction.DOWN;}
                    if (current.getPoint2().equalsPoint(this._position))    {newdirection = Direction.UP;}
                }
                
                // make the ghost do left/right/left/right/... moves
                if (isHorizontal(current))
                {
                    if (current.getPoint1().equalsPoint(this._position))    {newdirection = Direction.RIGHT;}
                    if (current.getPoint2().equalsPoint(this._position))    {newdirection = Direction.LEFT;}
                }
                
                this._direction = newdirection;
                this.resetNextTurn();
            }
        }
        else
        {
            if (this._mode.getID() === GhostMode.ATHOME)
            {
                this._mode.setID(GhostMode.LEAVINGHOME);
            }
            
            if (this._mode.getID() === GhostMode.LEAVINGHOME)
            {
                // go to the link extremity which is not inside the ghost house
                
                var links = maze.getLinks();
                var target = null;
                
                // use as a target the first link extremity which is not inside the ghost house
                for(var i=0; i<links.length; i++)
                {
                    var p1 = links[i].getLine().getPoint1();
                    var p2 = links[i].getLine().getPoint2();
                    
                    if (!maze.containsPoint(p1, new AllowedCorridors(false, true, false)))    {target = p1; break;}
                    if (!maze.containsPoint(p2, new AllowedCorridors(false, true, false)))    {target = p2; break;}
                }
                
                this.movementAIToTarget(maze, target);
            }
            
            if (this._mode.getID() === GhostMode.NORMAL)
            {
                this.movementAIToTarget(maze, pacman.getPosition());
            }
        }
    }





//console.log("fin: " + this._id + " / " + this._direction + " / " + withcorridors + ", " + withghosthouse + ", " + withlinks);
};



/* TODO
    - compléter movementAI() et cie...
        http://www.grospixels.com/site/trucpac.php
        http://gameinternals.com/post/2072558330/understanding-pac-man-ghost-behavior
        http://www.developpez.net/forums/d306886/autres-langages/algorithmes/pacman-algorithme-poursuite/
    
    - faire que les fantomes aillent dans leur coin aussi au debut
    - specifier les etats dans le litteral
    - terminer le TODO de movementAIRandom()
    - implementer les etats CHASE et SCATTER (qui remplaceront NORMAL)
    - comme fait avec Pacman, revoir le move(), et voir si on fait bien les changements d'etat dans le move() et pas dans le movementAI(), et penser que si c'est dans le move(), si y'a eu un long "elapsed" alors faudra que le move() fasse ptetre un movementAI() pour connaitre la prochaine direction a prendre, vu que la ghost pourrait atteindre une intersection ou autre =====> le move() ne fera pas de movementAI(), sinon ce serait pas juste par rapport au joueur, faut qu'ils disposent des memes possibilites de "décision", faut pas que les ghosts puissent decider pendant le mouvement, meme si le elpased est long, car il est long aussi pour le joueur
    - revoir aussi les movementAI() et movementAIXXX()
    - integrer les movablestate pour les ghosts
    - utiliser 1 seul parametre via des macros plutot que 3 parametres via des booléens ? genre MazeTruc.CORRIDORS, MazeTruc.CORRIDORS_LINKS, ... ou même via des flags avec les bits : CORRIDORS|LINKS, ...
    - dans le movementAI() separer le code pr chaque fantome vers différentes fonctions (MovementAIClyde(), MovementAIInky(), ...)
    
    - ameliorer et tester mon assert() avec :
    http://stackoverflow.com/questions/1013239/can-i-get-the-name-of-the-currently-running-function-in-javascript
    http://stackoverflow.com/questions/6586971/get-the-current-function-name-in-javascript
    
    => le code de nextintersection() reste a mettre a jour pr les 3 parametres, mais en fait faudrait l'upadter tout court, en s'inspirant fortement de nextturn()
        => l'erreur rencontrée vient du fait que Pinky est arrivé tout en haut du link, et est donc sur l'intersection, avec direction=UP ; or il appelle movementaitotarget(), qui cherche la prochaine intersection avec nextintersection() pour prendre la decision de la direction a suivre... or notre remainingline est un point/intersection ; faut que movementaitotarget() gère ce genre de cas, puisque nextintersection fait bien son boulot (meme si comme dit ci-dessus, faut ameliorer ça)
        
===> au final : d'une part s'occuper des move(), d'autre part s'occuper des movementAI()
*/



/******************************************************************************/
/*                            game events listeners                           */
/******************************************************************************/



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
    /* TODO
        - ca pose ptetre un probleme en fait, car il pourrait y avoir des touches appuyees avant le "blur", et faudrait s'en occuper avant de modif le state
    */
};



/******************************************************************************/
/*                            game loop functions                             */
/******************************************************************************/



var graphicsLoop = function()
{
    //count1++;
    //tmp2 = performance.now();
    if (state === GameState.PLAYING)
    {
        playingstate.draw();
    }
    else if (state === GameState.PAUSE)
    {
        pausestate.draw();
    }
    else    /* state === GameState.MAIN */
    {
        
    }
    //console.log(performance.now()-tmp2);
    requestAnimationFrame(graphicsLoop);
};

var logicLoop = function()
{
    //tmp1 = performance.now();
    //count2++;
    //if (performance.now() - firstupdate > 1000) {console.log(count1 + ", " + count2); firstupdate = performance.now(); count1 = 0; count2 = 0;}
    newupdate = performance.now();
    
    var nextstate = undefined;
    
    while(state !== nextstate)
    {
        if (nextstate !== undefined)
        {
            state = nextstate;
        }
        
        if (state === GameState.PLAYING)
        {
            nextstate = playingstate.update();
        }
        else if (state === GameState.PAUSE)
        {
            nextstate = pausestate.update();
        }
        else    /* state === GameState.MAIN */
        {
            
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



/******************************************************************************/
/*                                 game main                                  */
/******************************************************************************/



/* TODO

    //  better performances : draw in a hidden canvas and then drawImage() or putimagedata()
    //  cf: http://stackoverflow.com/questions/13916066/speed-up-the-drawing-of-many-points-on-a-html5-canvas-element
    
    - futur multi: mode CTF, avec pacman et ghosts au meme niveau de vitesse etc
    
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
    - add new functionnality to portals, to be able to put a portal in the middle of a line, or at an intersection ; and use a "type" property to know if going to direction X before the portal will make us go to a direction X after the portal ; or use defined direction(s) for this portal
    - implement a Game class
    - implement ghosts : http://gameinternals.com/post/2072558330/understanding-pac-man-ghost-behavior
    - implement power pellets (a property of pacman)
    - verifier ttes les verifs d'erreurs et ajouter les verifs manquantes, et aussi dans checkconfig()
    - verif les bonnes utilisations de certaines fonctions : par exemple ne pas faire this._position.set() quand on peut faire this._setPosition() !
    - verifier les prop et methodes privées/publiques et statiques
    - le loadmapfromarray...() de playingscreeen pourrap tetre etre fait par Game, et du coup plus de prob d'etre obligé d'avoir un truc statique de pausestate pr avoir la largeur et comparer ? et aussi ptetre mettre des trucs statiques a playingstate ? et mettre des proprs statiques dans le constructeur de pausestate permettrait d'avoir tt le temps les valeurs et d'y acceder comme on veut sans avoir a recalculer ; mais et si jamais on devait modif le menu, genre avec un god mode ?=> faudrait alors pouvoir modifier sa taille et donc faudrait garder les props comme props d'instance...
    - ======> creer classe Game : faire des etats et meme des sous-états (ex: pendant playing, quand on commmence, genre avec compte a rebours ; ou quand on a gagne, genre cinematique ; ...) ; lire truc de lazyfoo et cie sur machines a etats : chaque etat a sa methode update(), et init() ? ; et a priori y'aura plu le prob de devoir utiliser truc statique ou nonn pr creer taille ecran jeu, vu que game pourrait creer direct le pause+playingstate et donc avoir leurs mesures (le menu peut donc changer de taille, ce serait pas grave)
    - mettre dans les "constantes" (en haut) tout truc codé en dur (valeur, couleur, ...)
    - utiliser un genre d'automate a etats, comme ça on se souvient des etats précédents, genre menu, playing, pause, ... et une variable du style current_state qu'on utilise et sur laquelle on appelle draw(), update(), ...
    
    - pr pacdot, faire une animation qui fait "briler" ?
    
    - pour l'optimisation des perfs, etc, pr dessiner la meme image ou un truc d'un canvas cache, il suffira d'ajouter une methode drawFromXXX()
    
    - pour l'etat de pause, faire en sorte que ca soit visible si on a ou non le focus, genre en rééclaircissant un peu le canvas ; creation de 2 sous etats a pause, genre pause_focus et pause_nofocus ? ou bien juste appel d'une fonction de PauseState ?
    
    - au lieu du firstdraw pr l'etat pause, renomme en redrawbkacground ? ou utiliser un redrawAll ? ajouter ce meme genre de truc a l'etat playing, pr ne pas redessiner tt le maze ?
    
    - ==========> ptetre qu'en fait, les XXXState ne devraient pas contenir les éléments ? mais que ces derniers devraient etre globaux ou dans une classe Game ?
    
    - =================> ca ira pas pour les graphics en general : certains trucs peuvent pas vraiment avoir des graphics, par exemple quand on dessinera des fantomes, etc... faudrait stocker pleins de propriété pour chaque element de son dessin... autant faire draw() par le fantome lui-meme, tant pis... => en fait faudrait arriver a avoir un unique objet a mettre en propriete, et qui permet de faire draw(), translate(), ...
*/

/*
chaque etat peut avoir des sous-etats ?

dans logicloop, faut a un moment un truc pr changer l'etat si necessaire ; chaque etat pouvant dans une de ses fonctions modifier une variable nextstate ?
*/



canvas = document.getElementById("gamecanvas");

context = canvas.getContext("2d");

//checkConfiguration();

/*
    compute and set the base size of the game canvas, using the original Pacman map
    //TODO - il faudra plus tard verifier aussi avec la taille du menu principal et du menu de pause
    //     - englober tout ca dans un initCanvasSize()
*/

// compute the size of the original Pacman map
/*var mainmap = maps[0];
var lines = [];

for(var i=0; i<mainmap.mazelines.length; i++)
{
    lines.push(new Corridor(new Point(mainmap.mazelines[i].x1, mainmap.mazelines[i].y1),
                            new Point(mainmap.mazelines[i].x2, mainmap.mazelines[i].y2)));
}

var m = new Maze(lines, [], []);
var mainmap_h = m.getHeight();
var mainmap_w = m.getWidth();*/

// compute the size of the status bar
/*context.font = STATUS_FONT_SIZE + "px " + STATUS_FONT;
var status_w = STATUS_PADDINGLEFT + context.measureText("Score : 9 999 999").width + 50 + context.measureText("Lives : ").width + 3 * (10 + 2*STATUS_LIVES_RADIUS);
var status_h = 1.3 * STATUS_FONT_SIZE;*/

// compute the total size
/*var width = (mainmap_w + LINE_WIDTH > status_w) ? mainmap_w + LINE_WIDTH : status_w ;
var height = mainmap_h + LINE_WIDTH + 10 + status_h;*/

// set the canvas size to the game base size
//changeCanvasDimensions(window.innerWidth-15, window.innerHeight-15);  /* -15 is for scrollbars */
/*changeCanvasDimensions(width, height);*/

//console.log(width + ", " + height);

/* TODO TODO TODO
=> en fait, avant de commencer le jeu, faut creer 1 tempmainmenustate, 1 tempplayingstate, et 1 temppausestate ; et avec leur propriete maincontentframe, on prend les dimensions les plus grandes, et on les assigne au canvas, ce qui donne la taille de base ^^ faut le refaire a chaque fois au cas ou on modif des ...

===> ou alors faudrait appeler des truc static : PlayingState.maxDimensions(map_X), et MainMenuState.maxDimensions(), et PauseMenuState.maxDimensions()
    => ça appelle des Maze.maxDimensions(map_X), Status.maxDimensions(), XXXMenu.maxDimension()

=> en fait faudra 3 "liens" => "resize to the normal size" ; "resize the the large size" ; "resize to the maximum size"


====================> AU FINAL : je vais devoir decider d'une taille fixe pour le canvas, qui sera acceptable pour faire des maps pas trop petites ; ensuite apres ça je crée 2 fonctions dans les trucs tout en haut, qui s'appelleront MapMaxWidth() et MapMaxHeight(), qui retourneront les tailles max que le jeu accepte pour les Map (du coup on peut modifier autant qu'on veut les tailles des bordures, des textes, des lignes, ... peu importe, on aura un moyen de savoir si une map est trop grande ou pas => le checkconfig verifiera donc notamment pour chaque map qu'elle n'est pas trop grande)
*/

changeCanvasDimensions(800, 700);




/*
    init the game
*/

playingstate = new PlayingState(maps[0]);
pausestate = new PauseState();

canvas.addEventListener("blur", blurEventListener);
canvas.addEventListener("keydown", keyEventListener);
canvas.focus();

state = GameState.PLAYING;

lastupdate = performance.now();
firstupdate = lastupdate;

/*
    start the game
*/

graphicsLoop();
logicLoop();

