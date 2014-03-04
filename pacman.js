
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
        if (arg.getX1() === arg.getX2())
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    else if (isDirection(arg))
    {
        if (arg === Direction.UP
         || arg === Direction.DOWN)
        {
            return true;
        }
        else
        {
            return false;
        }
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
        if (arg.getY1() === arg.getY2())
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    else if (isDirection(arg))
    {
        if (arg === Direction.LEFT
         || arg === Direction.RIGHT)
        {
            return true;
        }
        else
        {
            return false;
        }
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

LineHV2D.isCrossing = function(line1, line2)
{
    if (!(line1 instanceof LineHV2D))
    {
        throw new TypeError("line1 is not a LineHV2D");
    }
    if (!(line2 instanceof LineHV2D))
    {
        throw new TypeError("line2 is not a LineHV2D");
    }
    
    if ((isHorizontal(line1)
      && line1.getY1() >= line2.getY1() && line1.getY1() <= line2.getY2()
      && line2.getX1() >= line1.getX1() && line2.getX1() <= line1.getX2())
     || (isVertical(line1)
      && line1.getX1() >= line2.getX1() && line1.getX1() <= line2.getX2()
      && line2.getY1() >= line1.getY1() && line2.getY1() <= line1.getY2()))
    {
        return true;
    }
    
    return false;
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
        var rect = {};
        
        rect.x = this._mazelines[i].getX1() - PACMAN_RADIUS;
        rect.y = this._mazelines[i].getY1() - PACMAN_RADIUS;
        
        if (isVertical(this._mazelines[i]))
        {
            rect.w = 2 * PACMAN_RADIUS;
            rect.h = this._mazelines[i].getY2() - this._mazelines[i].getY1() + 2 * PACMAN_RADIUS;
        }
        else
        {
            rect.w = this._mazelines[i].getX2() - this._mazelines[i].getX1() + 2 * PACMAN_RADIUS;
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
        
        if ((isVertical(direction)
          && isVertical(line)
          && line.getX1() === x
          && y >= line.getY1() && y <= line.getY2())
         || (isHorizontal(direction)
          && isHorizontal(line)
          && line.getY1() === y
          && x >= line.getX1() && x <= line.getX2()))
        {
            return line;
        }
    }
    
    return undefined;
};

Map.prototype.mazeNextTurn = function(line, x, y, direction, nextdirection)
{
    var lines = [];
    
    if (((direction === Direction.UP || direction === Direction.DOWN)
      && (nextdirection === Direction.UP || nextdirection === Direction.DOWN))
     || ((direction === Direction.LEFT || direction === Direction.RIGHT)
      && (nextdirection === Direction.LEFT || nextdirection === Direction.RIGHT)))
    {
        return undefined;
    }
    
    for(var i=0;i<this._mazelines;i++)
    {
        if (direction === Direction.UP)
        {
            /* if this line is crossing ours */
             if (LineHV2D.isCrossing(this._mazelines[i], new LineHV2D(x, y, x, line.getY1())))
            {
                /* if there is some place to turn */
                if ((nextdirection === Direction.LEFT && this._mazelines[i].getX1() < x)
                 || (nextdirection === Direction.RIGHT && this._mazelines[i].getX2() > x))
                {
                    lines.push(this._mazelines[i]);
                }
            }
        }
        else if (direction === Direction.DOWN)
        {
            // TODO
        }
        else if (direction === Direction.LEFT)
        {
            // TODO
        }
        else if (direction === Direction.RIGHT)
        {
            // TODO
        }
    }
    
    // TODO trier ensuite les lignes pour prendre la plus proche du (x,y),
    // et prendre l'intersection des 2
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
    
    if (isVertical(direction))
    {
        if (isVertical(this._direction))
        {
            this._direction = direction;
        }
        else
        {
            this._nextdirection = direction;
            /* TODO
                var nextturn = map.prochaintournant(line, direction, x, y, nextdirection)
                nextturnx/y...
            */
        }
    }
    else if (isHorizontal(direction))
    {
        if (isHorizontal(this._direction))
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
    if (elapsed <= 0)
    {
        throw new RangeError("elapsed value is not valid");
    }
    
    var xlimit = 0;
    var ylimit = 0;
    
    /*
        fixed speed : 100 px/s
    */
    var movement = Math.round(100 * elapsed/1000);
    
    var line = map.mazeCurrentLine(this._x, this._y, this._direction);
    if (line === undefined)
    {
        return;
    }
    
    /* TODO
    ===> ptetre pas une bonne idée, mieux vaut faire autrement : la il faut a chaque fois reverifier a chaque avancée si on a traversé une ligne, mieux vaut le faire une seule fois quand on sait qu'on devra tourner, et on enregistre le tournant dans nextturnx et nextturny ?
    changeDirection() cherche nextturnx et nextturny et les enregistre ; encore besoin de nextdirection pour ensuite, car move() verifiera a chaque avancée si le nextturnx et nextturny sont dans notre mouvement d'avancée : si oui on va dans la direction de nextdirection en avançant le max possible, sinon on avance au max possible
    
    
    => creer map.crossedLine(line, x1, y1, x2, y2, direction)
    
    var crossedline = null;
    
    si nextdirection !== null
        truc = crossedLine()
    
    si nextdirection === null ou (nextdirection !== null et crossedline === null)
        trouver le x ou y max pour la ligne courante
        avancer selon
    sinon
            trouver le x ou y max correspondant au croisement entre la ligne
            courante et la ligne qu'on traverse
            avancer selon
            mettre a jour direction et nextdirection
    

    
    si nextdirection === null
        trouver le x ou y max pour la ligne courante
        avancer selon
    sinon
        crossedLine() => verifier si entre la position actuelle et la position actuelle + mouvement on traverse ou touche une ligne sur laquelle on pourrait entrer ET AVANCER (donc pas avancer contre le mur si notre ligne ne fait que toucher une autre, faut pouvoir aller du bon coté)
        s'il n'y a pas de telle ligne
            trouver le x ou y max pour la ligne courante
            avancer selon
        sinon
            trouver le x ou y max correspondant au croisement entre la ligne courante et la ligne qu'on traverse
            avancer selon
            mettre a jour direction et nextdirection
    */
    
    if (this._direction === Direction.UP)
    {
        ylimit = line.getY1();
        this._y = (this._y-movement > ylimit) ? this._y-movement : ylimit ;
        
    }
    else if (this._direction === Direction.DOWN)
    {
        ylimit = line.getY2();
        this._y = (this._y+movement < ylimit) ? this._y+movement : ylimit ;
    }
    else if (this._direction === Direction.LEFT)
    {
        xlimit = line.getX1();
        this._x = (this._x-movement > xlimit) ? this._x-movement : xlimit ;
    }
    else if (this._direction === Direction.RIGHT)
    {
        xlimit = line.getX2();
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
    - use lines with 2 (x;y) points instead of my system with len and direction ; create a class for that, that ensures the first point is the smallest (= the nearest of the origin), the second point the biggest
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
    lines.push(new LineHV2D(MAZE_LINES[i].x1, MAZE_LINES[i].y1, MAZE_LINES[i].x2, MAZE_LINES[i].y2));
}
map = new Map(lines);

canvas.addEventListener("keydown", keyEventListener);
canvas.focus();

lastupdate = performance.now();

/* start the game */

graphicsLoop();
logicLoop();






















