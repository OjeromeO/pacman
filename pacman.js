
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

var PacmanState = {};
Object.defineProperties(PacmanState,
{
    "NORMAL":   {value: 1, writable: false, configurable: false, enumerable: true},
    "PP_EATEN": {value: 2, writable: false, configurable: false, enumerable: true}
});

var GhostState = {};
Object.defineProperties(GhostState,
{
    "ATHOME":     {value: 1, writable: false, configurable: false, enumerable: true},
    "NORMAL":     {value: 2, writable: false, configurable: false, enumerable: true},
    "FRIGHTENED": {value: 3, writable: false, configurable: false, enumerable: true},
    "EATEN":      {value: 4, writable: false, configurable: false, enumerable: true}
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
var PACMAN_SPEED = 300;
var GHOST_SPEED = 100;
var LINE_WIDTH = 2 * PACMAN_RADIUS + 8;
var GRID_UNIT = 16;
var PACDOT_POINT = 10;

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
    
    portals:    [
                    {x: 0,  y: 13, id: 1},
                    {x: 25, y: 13, id: 1}
                ],
    
    pacman:     {
                    x:          0,
                    y:          0,
                    direction:  Direction.UP
                },
    ghosts:     [
                    {id: GhostType.BLINKY, x: 8,  y: 10, direction: Direction.RIGHT},
                    {id: GhostType.PINKY,  x: 12.5, y: 13.5, direction: Direction.UP},
                    {id: GhostType.INKY,   x: 14, y: 10, direction: Direction.LEFT},
                    {id: GhostType.CLYDE,  x: 17, y: 10, direction: Direction.DOWN}
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
    if (typeof state === "number"
     && (state === PacmanState.NORMAL
      || state === PacmanState.PP_EATEN))
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
    if (typeof state === "number"
     && (state === GhostState.NORMAL
      || state === GhostState.EATABLE))
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
    
    assert((isPacmanInMaze === true), "MAP_1.pacman coordinates are not inside the maze");
    
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
/*     -> Point, Circle, CircleArc, Rectangle, Line                           */
/*     -> translate(x, y), setPosition(x, y)                                  */
/*                                                                            */
/* -> corresponding "Drawable" classes, that extend the base classes          */
/*     -> DrawablePoint, ...                                                  */
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


/**************************** DrawablePoint class *****************************/


var DrawablePoint = function(x, y)
{
    assert((typeof x === "number"), "x is not a number");
    assert((typeof y === "number"), "y is not a number");
    
    Point.call(this, x, y);
};

DrawablePoint.prototype = Object.create(Point.prototype);
DrawablePoint.prototype.constructor = DrawablePoint;

DrawablePoint.prototype.draw = function()
{
    context.fillRect(this._x, this._y, 1, 1);
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
/******************************* CircleArc class ******************************/
/******************************************************************************/

var CircleArc = function(x, y, radius, startangle, endangle)
{
    assert((typeof x === "number"), "x is not a number");
    assert((typeof y === "number"), "y is not a number");
    assert((typeof radius === "number"), "radius is not a number");
    assert((typeof startangle === "number"), "startangle is not a number");
    assert((typeof endangle === "number"), "endangle is not a number");
    
    this._position = new Point(x, y);
    this._radius = radius;
    this._startangle = startangle;
    this._endangle = endangle;
};

CircleArc.prototype.getPosition = function()
{
    return this._position;
};

CircleArc.prototype.setPosition = function(x, y)
{
    assert((typeof x === "number"), "x is not a number");
    assert((typeof y === "number"), "y is not a number");
    
    this._position.set(x, y);
};

CircleArc.prototype.getRadius = function()
{
    return this._radius;
};

CircleArc.prototype.setRadius = function(radius)
{
    assert((typeof radius === "number"), "radius is not a number");
    
    this._radius = radius;
};

CircleArc.prototype.getStartangle = function()
{
    return this._startangle;
};

CircleArc.prototype.setStartangle = function(startangle)
{
    assert((typeof startangle === "number"), "startangle is not a number");
    
    this._startangle = startangle;
};

CircleArc.prototype.getEndangle = function()
{
    return this._endangle;
};

CircleArc.prototype.setEndangle = function(endangle)
{
    assert((typeof endangle === "number"), "endangle is not a number");
    
    this._endangle = endangle;
};

CircleArc.prototype.translate = function(x, y)
{
    assert((typeof x === "number"), "x is not a number");
    assert((typeof y === "number"), "y is not a number");
    
    this._position.translate(x, y);
};


/************************* DrawableCircleArc class ****************************/


var DrawableCircleArc = function(x, y, radius, startangle, endangle)
{
    assert((typeof x === "number"), "x is not a number");
    assert((typeof y === "number"), "y is not a number");
    assert((typeof radius === "number"), "radius is not a number");
    assert((typeof startangle === "number"), "startangle is not a number");
    assert((typeof endangle === "number"), "endangle is not a number");
    
    CircleArc.call(this, x, y, radius, startangle, endangle);
};

DrawableCircleArc.prototype = Object.create(CircleArc.prototype);
DrawableCircleArc.prototype.constructor = DrawableCircleArc;

DrawableCircleArc.prototype.draw = function()
{
    context.beginPath();
    context.arc(this._position.getX(),
                this._position.getY(),
                this._radius,
                this._startangle,
                this._endangle);
    context.stroke();
    context.closePath();
};

DrawableCircleArc.prototype.drawInPath = function()
{
    context.arc(this._position.getX(),
                this._position.getY(),
                this._radius,
                this._startangle,
                this._endangle);
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
};

Line.prototype.YAxis = function()
{
    if (isHorizontal(this))
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

Line.prototype.isCrossing = function(line)
{
    assert((line instanceof Line), "line is not a Line");
    
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


/***************************** DrawableLine class *****************************/


var DrawableLine = function(point1, point2)
{
    assert((point1 instanceof Point), "point1 is not a Point");
    assert((point2 instanceof Point), "point2 is not a Point");
    assert((point1.getX() === point2.getX() || point1.getY() === point2.getY()),
           "points will not create a horizontal nor a vertical line");
    
    Line.call(this, point1, point2);
};

DrawableLine.prototype = Object.create(Line.prototype);
DrawableLine.prototype.constructor = DrawableLine;

DrawableLine.prototype.draw = function()
{
    ctx.beginPath();
    ctx.moveTo(this._point1.getX(), this._point1.getY());
    ctx.lineTo(this._point2.getX(), this._point2.getY());
    ctx.closePath();
    ctx.stroke();
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
    return new Pacman(this._pacmanPosition.getX(), this._pacmanPosition.getY(), this._pacmanDirection);
};

Map.prototype.getGhosts = function()
{
    var ghosts = [];
    
    for(var i=0; i<this._ghostsPosition.length; i++)
    {
        ghosts.push(new Ghost(this._ghostsId[i], this._ghostsPosition[i].getX(), this._ghostsPosition[i].getY(), this._ghostsDirection[i]));
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
    
    if (nextstate != state)
    {
        this._firstdraw = true;
    }
    
    return nextstate;
};

PauseState.prototype.draw = function()
{
    if (this._firstdraw === true)
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
    
    this._maze = new Maze(ghosthouse, lines, links, pacdots, portals);
    this._pacman = pacman;
    this._ghosts = ghosts;
};

PlayingState.prototype.restart = function()
{
    var xmappadding = this._getMapPaddingX();
    var ymappadding = this._getMapPaddingY();
    
    // reinit maze
    var pacdots = this._map.getPacdots();
    
    for(i=0; i<pacdots.length; i++)
    {
        pacdots[i].translate(xmappadding, ymappadding);
    }
    
    this._maze.reinit(pacdots);
    
    // reinit status
    this._status.reinit();
    
    // reinit pacman
    var pacman = this._map.getPacman();
    
    pacman.translate(xmappadding, ymappadding);
    
    this._pacman.reinit(pacman.getPosition().getX(), pacman.getPosition().getY(), pacman.getDirection());
    
    // reinit ghosts
    var ghosts = this._map.getGhosts();
    
    for(var i=0; i<ghosts.length; i++)
    {
        ghosts[i].translate(xmappadding, ymappadding);
    }
    
    for(var i=0; i<ghosts.length; i++)
    {
        this._ghosts[i].reinit(ghosts[i].getPosition().getX(), ghosts[i].getPosition().getY(), ghosts[i].getDirection());
    }
};

PlayingState.prototype.handleInput = function(key)
{
    assert((isVirtualKeyCode(key)), "key is not a virtual key code");
    
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

var Maze = function(ghosthouse, corridors, links, pacdots, portals)
{
    //TODO  check if lines don't overlap with one another => if overlap, create
    //      a new one containing the two lines overlapping (they need to be of
    //      the same type : the 2 with pacdots, or the 2 without pacdots)
    assert((corridors instanceof Array && corridors.length > 0), "corridors is not an array");
    
    this._ghosthouse = ghosthouse;
    this._corridors = corridors;    // lines on which the pacman center can move
    this._links = links;
    this._pacdots = pacdots;
    this._powerpellets = [];
    this._portals = portals;
    
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

Maze.prototype.reinit = function(pacdots)
{
    this._pacdots.length = 0;
    this._pacdots = pacdots;
    this._powerpellets.length = 0;
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

Maze.prototype.containsPoint = function(point, withcorridors, withghosthouse, withlinks)
{
    assert((point instanceof Point), "point is not a Point");
    
    if (withcorridors === true)
    {
        for(var i=0;i<this._corridors.length;i++)
        {
            if (this._corridors[i].getLine().containsPoint(point))
            {
                return true;
            }
        }
    }
    
    if (withghosthouse === true)
    {
        for(var i=0;i<this._ghosthouse.length;i++)
        {
            if (this._ghosthouse[i].getLine().containsPoint(point))
            {
                return true;
            }
        }
    }
    
    if (withlinks === true)
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

Maze.prototype.currentLine = function(point, direction)
{
    assert((point instanceof Point), "point is not a Point");
    assert((isDirection(direction)), "direction value is not valid");
    assert((this.containsPoint(point, true, true, true)), "point is not inside the maze");
    
    var line = null;
    
    for(var i=0; i<this._corridors.length; i++)
    {
        line = this._corridors[i].getLine();
        
        if (((isVertical(direction) && isVertical(line))
          || (isHorizontal(direction) && isHorizontal(line)))
         && line.containsPoint(point))
        {
            /* check if this line overlap with a link line */
            for(var i=0; i<this._links.length; i++)
            {
                if (((isVertical(line) && isVertical(this._links[i].getLine()))
                  || (isHorizontal(line) && isHorizontal(this._links[i].getLine())))
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
        
        if (((isVertical(direction) && isVertical(line))
          || (isHorizontal(direction) && isHorizontal(line)))
         && line.containsPoint(point))
        {
            /* check if this line overlap with a link line */
            for(var i=0; i<this._links.length; i++)
            {
                if (((isVertical(line) && isVertical(this._links[i].getLine()))
                  || (isHorizontal(line) && isHorizontal(this._links[i].getLine())))
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
    
    for(var i=0; i<this._corridors.length; i++)
    {
        line = this._corridors[i].getLine();
        
        if (line.containsPoint(point))
        {
            return line;
        }
    }
    
    for(var i=0; i<this._ghosthouse.length; i++)
    {
        line = this._ghosthouse[i].getLine();
        
        if (line.containsPoint(point))
        {
            return line;
        }
    }
    
    for(var i=0; i<this._links.length; i++)
    {
        line = this._links[i].getLine();
        
        if (line.containsPoint(point))
        {
            return line;
        }
    }
};

Maze.prototype.nextTurn = function(point, direction, nextdirection, withcorridors, withghosthouse, withlinks)
{
    assert((point instanceof Point), "point is not a Point");
    assert((isDirection(direction)), "direction value is not valid");
    assert((isDirection(nextdirection)), "nextdirection value is not valid");
    assert((typeof withghosthouse === "boolean"), "withghosthouse is not a boolean");
    
    if ((isVertical(direction) && isVertical(nextdirection))
     || (isHorizontal(direction) && isHorizontal(nextdirection)))
    {
        return;     /* "undefined" */
    }
    
    var line = this.currentLine(point, direction);
    
    var lines = [];
    var xlimit = null;
    var ylimit = null;
    
    if (direction === Direction.UP)         {xlimit = point.getX(); ylimit = line.getPoint1().getY();}
    else if (direction === Direction.DOWN)  {xlimit = point.getX(); ylimit = line.getPoint2().getY();}
    else if (direction === Direction.LEFT)  {xlimit = line.getPoint1().getX(); ylimit = point.getY();}
    else if (direction === Direction.RIGHT) {xlimit = line.getPoint2().getX(); ylimit = point.getY();}
    
    /* find all the lines on which we could turn */
    
    if (withcorridors === true)
    {
        for(var i=0;i<this._corridors.length;i++)
        {
            var l = this._corridors[i].getLine();
            
            /* if this line is crossing ours */
            if (l.isCrossing(new Line(point, new Point(xlimit, ylimit))))
            {
                /* if there is some place to turn */
                if ((nextdirection === Direction.LEFT && l.containsX(point.getX()-1))
                 || (nextdirection === Direction.RIGHT && l.containsX(point.getX()+1))
                 || (nextdirection === Direction.UP && l.containsY(point.getY()-1))
                 || (nextdirection === Direction.DOWN && l.containsY(point.getY()+1)))
                {
                    lines.push(l);
                }
            }
        }
        }
    
    if (withghosthouse === true)
    {
        for(var i=0;i<this._ghosthouse.length;i++)
        {
            var l = this._ghosthouse[i].getLine();
            
            /* if this line is crossing ours */
            if (l.isCrossing(new Line(point, new Point(xlimit, ylimit))))
            {
                /* if there is some place to turn */
                if ((nextdirection === Direction.LEFT && l.containsX(point.getX()-1))
                 || (nextdirection === Direction.RIGHT && l.containsX(point.getX()+1))
                 || (nextdirection === Direction.UP && l.containsY(point.getY()-1))
                 || (nextdirection === Direction.DOWN && l.containsY(point.getY()+1)))
                {
                    lines.push(l);
                }
            }
        }
    }
    
    if (withlinks === true)
    {
        for(var i=0;i<this._links.length;i++)
        {
            var l = this._links[i].getLine();
            
            /* if this line is crossing ours */
            if (l.isCrossing(new Line(point, new Point(xlimit, ylimit))))
            {
                /* if there is some place to turn */
                if ((nextdirection === Direction.LEFT && l.containsX(point.getX()-1))
                 || (nextdirection === Direction.RIGHT && l.containsX(point.getX()+1))
                 || (nextdirection === Direction.UP && l.containsY(point.getY()-1))
                 || (nextdirection === Direction.DOWN && l.containsY(point.getY()+1)))
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

Maze.prototype.draw = function()
{
    context.fillStyle = "gray";
    this._graphicsborder.draw();
    
    context.fillStyle = "blue";
    this._graphicsbackground.draw();
    
    for(var i=0; i<this._corridors.length; i++)
    {
        this._corridors[i].draw();
    }
    
    for(var i=0; i<this._ghosthouse.length; i++)
    {
        this._ghosthouse[i].draw();
    }
    
    for(var i=0; i<this._links.length; i++)
    {
        this._links[i].draw();
    }
    
    for(var i=0; i<this._pacdots.length; i++)
    {
        this._pacdots[i].draw();
    }
};

Maze.prototype.drawPortals = function()
{
    for(var i=0; i<this._portals.length; i++)
    {
        this._portals[i].draw();
    }
};



/******************************************************************************/
/* -> maze mobile elements classes :                                          */
/*     -> Pacman                                                              */
/*     -> _generateGraphics(), translate(x, y), setPosition(x, y), draw()     */
/******************************************************************************/



/******************************************************************************/
/******************************** Movable class *******************************/
/******************************************************************************/

var Movable = function(x, y, direction)
{
    assert((typeof x === "number"), "x is not a number");
    assert((typeof y === "number"), "y is not a number");
    assert((isDirection(direction)), "direction value is not valid");
    
    this._position = new Point(x, y);
    this._direction = direction;
    
    this._nextdirection = null;     // direction requested
    this._nextturn = null;          // intersection that allows movement in the requested direction
};

Movable.prototype.getPosition = function()
{
    return this._position;
};

Movable.prototype.getDirection = function()
{
    return this._direction;
};

Movable.prototype.getNextDirection = function()
{
    return this._nextdirection;
};

Movable.prototype.setNextDirection = function(nextdirection)
{
    assert((isDirection(nextdirection) || nextdirection === null), "nextdirection value is not valid");

    this._nextdirection = nextdirection;
};

Movable.prototype.getNextTurn = function()
{
    return this._nextturn;
};

Movable.prototype.setNextTurn = function(nextturn)
{
    assert((nextturn instanceof Point || nextturn === null), "nextturn value is not valid");

    this._nextturn = nextturn;
};

Movable.prototype.setDirection = function(direction)
{
    assert((isDirection(direction)), "direction value is not valid");

    this._direction = direction;
};

/******************************************************************************/
/******************************** Pacman class ********************************/
/******************************************************************************/

var Pacman = function(x, y, direction)
{
    assert((typeof x === "number"), "x is not a number");
    assert((typeof y === "number"), "y is not a number");
    assert((isDirection(direction)), "direction value is not valid");
    
    Movable.call(this, x, y, direction);
    
    this._state = PacmanState.NORMAL;
    
    this._animtime = 0;
    this._mouthstartangle = 0;
    this._mouthendangle = 0;
    
    this._graphicscirclearc = null;
    
    this._generateGraphics();
};

Pacman.prototype = Object.create(Movable.prototype);
Pacman.prototype.constructor = Pacman;

Pacman.prototype._generateGraphics = function()
{
    var circlearc = new DrawableCircleArc(this._position.getX(),
                                          this._position.getY(),
                                          PACMAN_RADIUS,
                                          this._mouthstartangle,
                                          this._mouthendangle);
    
    this._graphicscirclearc = circlearc;
};

Pacman.prototype.draw = function()
{
    context.fillStyle = "yellow";
    
    context.beginPath();
    context.moveTo(this._graphicscirclearc.getPosition().getX(),
                   this._graphicscirclearc.getPosition().getY());
    this._graphicscirclearc.drawInPath();
    context.fill();
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

Pacman.prototype.reinit = function(x, y, direction)
{
    assert((typeof x === "number"), "x is not a number");
    assert((typeof y === "number"), "y is not a number");
    assert((isDirection(direction)), "direction value is not valid");
    
    this._position.set(x, y);
    this._direction = direction;
    this._nextdirection = null;
    this._nextturn = null;
    
    this._graphicscirclearc.setPosition(this._position.getX(),
                                        this._position.getY());
};

Pacman.prototype.getMouthstartangle = function()
{
    return this._mouthstartangle;
};

Pacman.prototype.getMouthendangle = function()
{
    return this._mouthendangle;
};

Pacman.prototype.setPosition = function(x, y)
{
    assert((typeof x === "number"), "x is not a number");
    assert((typeof y === "number"), "y is not a number");

    this._position.setPosition(x, y);
    this._graphicscirclearc.setPosition(this._position.getX(),
                                        this._position.getY());
};

Pacman.prototype.translate = function(x, y)
{
    assert((typeof x === "number"), "x is not a number");
    assert((typeof y === "number"), "y is not a number");
    
    this._position.translate(x, y);
    this._graphicscirclearc.translate(x, y);
};





/* TODO
- on aura des pacman.move(maze) et ghost.move(maze, pacman) et des .handle_collision(maze, ghosts), ...
- tte facon soit on a des move(maze, ...) soit on a dans playingstate un gros move() qui utilisera le maze et le pacman et les ghosts en propriétés
- mais pr les collisions, comment faire ? et meme pr les deplacements ? enregistrer le trajet effectué pr chacun (chacun ayant un array de lignes representatn ce chemin) pendant le move() (sans tenir compte des collisions durant le move()), puis appeler pr chacun un handle_collisions() ? mais quand même, faut trouver comment detecter a quel endroit/moment a eu lieu la collision et tt, et agir en consequence... ; ou plutot un handle_collisions() global dans playingstate (sachant que pas de collision entre les fantomes) ; penser a d'abord deplacer le pacman puis les fantomes ensuite, puisqu'ils le suivent ; quoique en fait chacun pourrait avoir son propre handle_collisions() du moment que en parametre on envoie les elements avec lesquels faut checker ça (meme si y'aura des tests redondants ; quoique ici non, y'a que les collision pacman-ghost et pas ghost-ghost)
*/





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
        
        var point = maze.nextTurn(this._position, this._direction, this._nextdirection, true, false, false);
        
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
    
    this._graphicscirclearc.setStartangle(this._mouthstartangle);
    this._graphicscirclearc.setEndangle(this._mouthendangle);
};

Pacman.prototype.move = function(elapsed, maze, status)
{
    assert((elapsed > 0), "elapsed value is not valid");
    
    var movement = Math.round(PACMAN_SPEED * elapsed/1000);
    var limit = 0;
    var turndistance = 0;
    
    if (this._nextdirection !== null && this._nextturn !== null)
    {
        turndistance = this._nextturn.distanceToPoint(this._position);
    }
    
    /* if we will have to turn */
    if (this._nextdirection !== null
     && this._nextturn !== null
     && turndistance <= movement)
    {
        /* check if pacman will eat some pacdots... */
        
        var travelled1 = new Line(this._position, this._nextturn);
        
        var eatenpacdots = [];
        
        for(var i=0; i<maze.getPacdots().length; i++)
        {
            if (travelled1.containsPoint(maze.getPacdot(i).getPosition()))
            {
                status.increaseScore(PACDOT_POINT);
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
            maze.deletePacdot(index);
        }
        
        /* move towards the intersection point */
        
        this.setPosition(this._nextturn.getX(), this._nextturn.getY());
        this._direction = this._nextdirection;
        this._nextdirection = null;
        this._nextturn = null;
        
        movement -= turndistance;
    }
    
    var newx = 0;
    var newy = 0;
    
    var currentline = maze.currentLine(this._position, this._direction);
    
    if (this._direction === Direction.UP)
    {
        limit = currentline.getPoint1().getY();
        newx = this._position.getX();
        newy = (this._position.getY()-movement > limit) ? this._position.getY()-movement : limit ;
    }
    else if (this._direction === Direction.DOWN)
    {
        limit = currentline.getPoint2().getY();
        newx = this._position.getX();
        newy = (this._position.getY()+movement < limit) ? this._position.getY()+movement : limit ;
    }
    else if (this._direction === Direction.LEFT)
    {
        limit = currentline.getPoint1().getX();
        newx = (this._position.getX()-movement > limit) ? this._position.getX()-movement : limit ;
        newy = this._position.getY();
    }
    else
    {
        limit = currentline.getPoint2().getX();
        newx = (this._position.getX()+movement < limit) ? this._position.getX()+movement : limit ;
        newy = this._position.getY();
    }
    
    /* check if pacman will eat some pacdots... */
    
    var travelled2 = new Line(this._position, new Point(newx, newy));
    
    var eatenpacdots = [];
    
    for(var i=0; i<maze.getPacdots().length; i++)
    {
        if (travelled2.containsPoint(maze.getPacdot(i).getPosition()))
        {
            status.increaseScore(PACDOT_POINT);
            eatenpacdots.push(i);
        }
    }
    
    for(var i=0; i<eatenpacdots.length; i++)
    {
        var index = eatenpacdots[eatenpacdots.length-1 - i];
        maze.deletePacdot(index);
    }
    
    this.setPosition(newx, newy);
    
    /* if we enter a teleportation tunnel */
    if (maze.isPortal(this._position.getX(), this._position.getY()))
    {
        var p = maze.associatedPortal(this._position.getX(), this._position.getY());
        
        this.setPosition(p.getPosition().getX(), p.getPosition().getY());
        
        /* search if we can now turn after the teleportation */
        
        if (this._nextdirection !== null
         && this._nextturn === null)
        {
            var nt = maze.nextTurn(this._position, this._direction, this._nextdirection, true, false, false);
            
            this.setNextTurn(nt);
        }
        
        
        //TODO move again, as we reached the limit of the teleportation point
        
        
        //TODO if we will reach the next turn point, turn and then... mais alors
        // et si on rechoppe un teleporteur c chiant... fait un do while() ?
    }
};


/******************************************************************************/
/******************************** Ghost class *********************************/
/******************************************************************************/

var Ghost = function(id, x, y, direction)
{
    assert((typeof x === "number"), "x is not a number");
    assert((typeof y === "number"), "y is not a number");
    assert((isDirection(direction)), "direction value is not valid");
    
    Movable.call(this, x, y, direction);
    
    this._state = GhostState.ATHOME;
    
    this._id = id;
    
    this._newdirtime = 0;       // TEMPORAIRE (tests)
    
    this._animtime = 0;
    this._normalwave = true;
};

Ghost.prototype = Object.create(Movable.prototype);
Ghost.prototype.constructor = Ghost;

/*TODO y'a plusieurs trucs a mettre en constantes */
Ghost.prototype.draw = function()
{
    var baseX = Math.floor(this._position.getX());
    var baseY = Math.floor(this._position.getY());
    
    context.fillStyle = "white";
    
    if (this._id === GhostType.BLINKY)
    {
        context.fillStyle = "red";
    }
    if (this._id === GhostType.PINKY)
    {
        context.fillStyle = "pink";
    }
    if (this._id === GhostType.INKY)
    {
        context.fillStyle = "cyan";
    }
    if (this._id === GhostType.CLYDE)
    {
        context.fillStyle = "orange";
    }

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
    
    if (this._direction === Direction.UP)
    {
        paddingY = -2;
    }
    if (this._direction === Direction.DOWN)
    {
        paddingY = 2;
    }
    if (this._direction === Direction.LEFT)
    {
        paddingX = -2;
    }
    if (this._direction === Direction.RIGHT)
    {
        paddingX = 2;
    }
    
    context.beginPath();
    context.arc(baseX - 1 - eyeradius + paddingX, baseY - GHOST_TOTALHEIGHT/2 + GHOST_WIDTH/2 - 2 + paddingY, irisradius, 0, 2*Math.PI);
    context.fill();
    context.beginPath();
    context.arc(baseX + 1 + eyeradius + paddingX, baseY - GHOST_TOTALHEIGHT/2 + GHOST_WIDTH/2 - 2 + paddingY, irisradius, 0, 2*Math.PI);
    context.fill();
};

Ghost.prototype.changeDirection = function(direction, maze)
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
        
        var withcorridors = false;
        var withghosthouse = false;
        var withlinks = false;
        
        if (this._state === GhostState.NORMAL || this._state === GhostState.FRIGHTENED)
        {
            withcorridors = true;
        }
        
        if (this._state === GhostState.ATHOME)
        {
            withghosthouse = true;
            withlinks = true;
        }
        
        if (this._state === GhostState.EATEN)
        {
            withcorridors = true;
            withghosthouse = true;
            withlinks = true;
        }
        
        var point = maze.nextTurn(this._position, this._direction, this._nextdirection, withcorridors, withghosthouse, withlinks);
        
        this._nextturn = (typeof point === "undefined") ? null : point ;
    }
};

Ghost.prototype.reinit = function(x, y, direction)
{
    assert((typeof x === "number"), "x is not a number");
    assert((typeof y === "number"), "y is not a number");
    assert((isDirection(direction)), "direction value is not valid");
    
    this._state = GhostState.ATHOME;
    this._position.set(x, y);
    this._direction = direction;
    this._nextdirection = null;
    this._nextturn = null;
};

Ghost.prototype.animate = function(elapsed)
{
    this._animtime = (this._animtime + elapsed) % (1000);
    this._normalwave = (this._animtime < 250 || (this._animtime > 500 && this._animtime < 750));
};

Ghost.prototype.setPosition = function(x, y)
{
    assert((typeof x === "number"), "x is not a number");
    assert((typeof y === "number"), "y is not a number");

    this._position.setPosition(x, y);
};

Ghost.prototype.translate = function(x, y)
{
    assert((typeof x === "number"), "x is not a number");
    assert((typeof y === "number"), "y is not a number");
    
    this._position.translate(x, y);
};

Ghost.prototype.move = function(elapsed, maze)
{
    assert((elapsed > 0), "elapsed value is not valid");
    
    var movement = Math.round(GHOST_SPEED * elapsed/1000);
    var limit = 0;
    var turndistance = 0;
    
    if (this._nextdirection !== null && this._nextturn !== null)
    {
        turndistance = this._nextturn.distanceToPoint(this._position);
    }
    
    /* if we will have to turn */
    if (this._nextdirection !== null
     && this._nextturn !== null
     && turndistance <= movement)
    {
        /* move towards the intersection point */
        
        this.setPosition(this._nextturn.getX(), this._nextturn.getY());
        this._direction = this._nextdirection;
        this._nextdirection = null;
        this._nextturn = null;
        
        movement -= turndistance;
        
        /* if we were inside the ghosthouse, and now we leaved it */
        if (this._state === GhostState.ATHOME && maze.containsPoint(this._position, true, false, false))
        {
            this._state = GhostState.NORMAL;
        }
        
        /* if we were outside the ghosthouse and needed to go inside, and now we went inside */
        if (this._state === GhostState.EATEN && maze.containsPoint(this._position, false, true, false))
        {
            this._state = GhostState.ATHOME;
        }
    }
    
    var newx = 0;
    var newy = 0;
    
    var currentline = maze.currentLine(this._position, this._direction);
    
    if (this._direction === Direction.UP)
    {
        limit = currentline.getPoint1().getY();
        newx = this._position.getX();
        newy = (this._position.getY()-movement > limit) ? this._position.getY()-movement : limit ;
    }
    else if (this._direction === Direction.DOWN)
    {
        limit = currentline.getPoint2().getY();
        newx = this._position.getX();
        newy = (this._position.getY()+movement < limit) ? this._position.getY()+movement : limit ;
    }
    else if (this._direction === Direction.LEFT)
    {
        limit = currentline.getPoint1().getX();
        newx = (this._position.getX()-movement > limit) ? this._position.getX()-movement : limit ;
        newy = this._position.getY();
    }
    else
    {
        limit = currentline.getPoint2().getX();
        newx = (this._position.getX()+movement < limit) ? this._position.getX()+movement : limit ;
        newy = this._position.getY();
    }
    
    this.setPosition(newx, newy);
    
    /* if we were inside the ghosthouse, and now we leaved it */
    if (this._state === GhostState.ATHOME && maze.containsPoint(this._position, true, false, false))
    {
        this._state = GhostState.NORMAL;
    }
    
    /* if we were outside the ghosthouse and needed to go inside, and now we went inside */
    if (this._state === GhostState.EATEN && maze.containsPoint(this._position, false, true, false))
    {
        this._state = GhostState.ATHOME;
    }
    
    /* if we enter a teleportation tunnel */
    if (maze.isPortal(this._position.getX(), this._position.getY()))
    {
        var p = maze.associatedPortal(this._position.getX(), this._position.getY());
        
        this.setPosition(p.getPosition().getX(), p.getPosition().getY());
        
        /* search if we can now turn after the teleportation */
        
        if (this._nextdirection !== null
         && this._nextturn === null)
        {
            var withcorridors = false;
            var withghosthouse = false;
            var withlinks = false;
        
            if (this._state === GhostState.NORMAL || this._state === GhostState.FRIGHTENED)
            {
                withcorridors = true;
            }
            
            if (this._state === GhostState.ATHOME)
            {
                withghosthouse = true;
                withlinks = true;
            }
            
            if (this._state === GhostState.EATEN)
            {
                withcorridors = true;
                withghosthouse = true;
                withlinks = true;
            }
            
            var nt = maze.nextTurn(this._position, this._direction, this._nextdirection, withcorridors, withghosthouse, withlinks);
            
            this.setNextTurn(nt);
        }
        
        
        //TODO move again, as we reached the limit of the teleportation point
        
        
        //TODO if we will reach the next turn point, turn and then... mais alors
        // et si on rechoppe un teleporteur c chiant... fait un do while() ?
    }
};

Ghost.prototype.movementAI = function(elapsed, maze, pacman)
{
    /*
        if GhostState.ATHOME/NORMAL/FRIGHTENED/EATEN ...
    */
    
    /*if (this._id === GhostType.BLINKY)
    {
        
    }
    
    if (this._id === GhostType.PINKY)
    {
        
    }
    
    if (this._id === GhostType.INKY)
    {
        
    }
    
    if (this._id === GhostType.CLYDE)
    {
        
    }*/
    
    if (this._newdirtime % 2000 > (this._newdirtime + elapsed) % 2000) // on change une fois toutes les 2s
    {
        var nextdir = 1 + Math.floor(Math.random() * ((4-1)+1));
        
        switch(nextdir)
        {
            case 1: this.changeDirection(Direction.UP, maze);
                    break;
            case 2: this.changeDirection(Direction.RIGHT, maze);
                    break;
            case 3: this.changeDirection(Direction.DOWN, maze);
                    break;
            case 4: this.changeDirection(Direction.LEFT, maze);
                    break;
        }
    }
    
    this._newdirtime = (this._newdirtime + elapsed) % (2000);
};


/* TODO
    - faire le movementAI() de Ghost
        http://www.grospixels.com/site/trucpac.php
        http://gameinternals.com/post/2072558330/understanding-pac-man-ghost-behavior
        http://www.developpez.net/forums/d306886/autres-langages/algorithmes/pacman-algorithme-poursuite/
    
    - avoir en fait un update() pour les elements, et dedans y faire le move() ? (+ animate() si besoin ?)
    - pour l'instant, on suppose que au debut les ghosts ont l'etat ATHOME, mais il serait tt a fait possible que la map les ait positionnés en dehors de la ghosthouse, puisque dans l'original le rouge est deja sorti devant !
      specifier ca dans le litteral ? ou le deduire via la classe Map quand on genere le ghost avec getghosts() ? ou autre ?
    - plus tard faudra ptetre ajouter un etat LEAVINGHOME, pour pas que l'etat ATHOME permette de se balader aleatoirement sur les links... a moins qu'en fait les ghosts
      se baladent pas aleatoirement mais restent a leur position de depart en faisant juste haut/bas/haut/bas... ?
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

