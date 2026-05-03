window.requestAnimationFrame = (function () {
  return window.requestAnimationFrame       ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame    ||
         function (callback) {
           window.setTimeout(callback, 17);
         };
})();

const KEY_LEFT  = 37;
const KEY_UP    = 38;
const KEY_RIGHT = 39;
const KEY_DOWN  = 40;
const KEY_P     = 80;
const KEY_ENTER = 13;

const ARRIBA    = 0;
const DERECHA   = 1;
const ABAJO     = 2;
const IZQUIERDA = 3;

var lienzo = null;
var canvas = null;

var lastPress = null;
var dir       = DERECHA;
var score     = 0;
var pause     = true;
var gameover  = true;

function Rectangle(x, y, width, height, color) {
  this.x      = (x      == null) ? 0          : x;
  this.y      = (y      == null) ? 0          : y;
  this.width  = (width  == null) ? 0          : width;
  this.height = (height == null) ? this.width : height;
  this.color  = (color  == null) ? "#000"     : color;
}

Rectangle.prototype.intersects = function (rect) {
  if (rect != null) {
    return (this.x < rect.x + rect.width  &&
            this.x + this.width  > rect.x &&
            this.y < rect.y + rect.height &&
            this.y + this.height > rect.y);
  }
  return false;
};

Rectangle.prototype.fill = function (ctx) {
  if (ctx != null) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
};

var body = [];
var food = new Rectangle(80, 80, 10, 10, '#f00');
var wall = [];

var medios = [];
var numMediosCargados = 0;

Array.longitud = function (obj) {
  return Object.getOwnPropertyNames(obj).length - 1;
};

function cargaMedio() {
  numMediosCargados++;
}

function random(max) {
  return Math.floor(Math.random() * max);
}

function reset() {
  score = 0;
  dir   = DERECHA;

  body.length = 0;
  body.push(new Rectangle(40, 40, 10, 10, "#0f0"));
  body.push(new Rectangle(0,  0,  10, 10, "#0f0"));
  body.push(new Rectangle(0,  0,  10, 10, "#0f0"));

  food.x = random(canvas.width  / 10 - 1) * 10;
  food.y = random(canvas.height / 10 - 1) * 10;

  lastPress = null;
  gameover  = false;
  pause     = false;
}

function paint(ctx) {
  var gradiente = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradiente.addColorStop(0.5, '#0000FF');
  gradiente.addColorStop(1,   '#000000');
  ctx.fillStyle = gradiente;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#fff';
  ctx.font      = 'bold 12px verdana, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('Score: ' + score, 10, 15);

  for (var i = 0; i < body.length; i++) {
    if (medios['iBody'] && numMediosCargados >= Array.longitud(medios)) {
      ctx.drawImage(medios['iBody'], body[i].x, body[i].y);
    } else {
      body[i].fill(ctx);
    }
  }

  if (medios['iFood'] && numMediosCargados >= Array.longitud(medios)) {
    ctx.drawImage(medios['iFood'], food.x, food.y);
  } else {
    food.fill(ctx);
  }

  for (var j = 0, l = wall.length; j < l; j++) {
    if (medios['iWall'] && numMediosCargados >= Array.longitud(medios)) {
      ctx.drawImage(medios['iWall'], wall[j].x, wall[j].y);
    } else {
      wall[j].fill(ctx);
    }
  }

  if (pause || gameover) {
    ctx.fillStyle = '#fff';
    ctx.font      = 'bold 16px verdana, sans-serif';
    ctx.textAlign = 'center';
    if (gameover) {
      ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
      ctx.font = '12px verdana, sans-serif';
      ctx.fillText('Pulsa ENTER para jugar de nuevo', canvas.width / 2, canvas.height / 2 + 20);
    } else {
      ctx.fillText('PAUSE', canvas.width / 2, canvas.height / 2);
    }
    ctx.textAlign = 'left';
  }
}

function act() {
  if (gameover && lastPress === KEY_ENTER) {
    reset();
    return;
  }

  if (!pause && !gameover) {
    if (lastPress === KEY_UP    && dir !== ABAJO)     dir = ARRIBA;
    if (lastPress === KEY_RIGHT && dir !== IZQUIERDA) dir = DERECHA;
    if (lastPress === KEY_DOWN  && dir !== ARRIBA)    dir = ABAJO;
    if (lastPress === KEY_LEFT  && dir !== DERECHA)   dir = IZQUIERDA;

    for (var i = body.length - 1; i > 0; i--) {
      body[i].x = body[i - 1].x;
      body[i].y = body[i - 1].y;
    }

    if (dir === DERECHA)   body[0].x += 10;
    if (dir === IZQUIERDA) body[0].x -= 10;
    if (dir === ARRIBA)    body[0].y -= 10;
    if (dir === ABAJO)     body[0].y += 10;

    if (body[0].x >= canvas.width)  body[0].x = 0;
    if (body[0].y >= canvas.height) body[0].y = 0;
    if (body[0].x < 0)              body[0].x = canvas.width  - 10;
    if (body[0].y < 0)              body[0].y = canvas.height - 10;

    if (body[0].intersects(food)) {
      score++;
      food.x = random(canvas.width  / 10 - 1) * 10;
      food.y = random(canvas.height / 10 - 1) * 10;
      body.push(new Rectangle(0, 0, 10, 10, "#0f0"));
      if (medios['aComer']) {
        medios['aComer'].currentTime = 0;
        medios['aComer'].play();
      }
    }

    for (var b = 2; b < body.length; b++) {
      if (body[0].intersects(body[b])) {
        gameover = true;
        if (medios['aMorir']) {
          medios['aMorir'].currentTime = 0;
          medios['aMorir'].play();
        }
      }
    }

    for (var w = 0; w < wall.length; w++) {
      if (food.intersects(wall[w])) {
        food.x = random(canvas.width  / 10 - 1) * 10;
        food.y = random(canvas.height / 10 - 1) * 10;
      }
      if (body[0].intersects(wall[w])) {
        gameover = true;
        if (medios['aMorir']) {
          medios['aMorir'].currentTime = 0;
          medios['aMorir'].play();
        }
      }
    }
  }

  if (lastPress === KEY_P && !gameover) {
    pause     = !pause;
    lastPress = null;
  }
}

function run() {
  setTimeout(run, 150);
  act();
}

function repaint() {
  requestAnimationFrame(repaint);
  paint(lienzo);
}

function canPlayOgg() {
  var aud = new Audio();
  if (aud.canPlayType('audio/ogg').replace(/no/, '')) return true;
  return false;
}

function iniciar() {
  canvas = document.getElementById('lienzo');
  lienzo = canvas.getContext('2d');

  wall = [];
  wall.push(new Rectangle(100,  50, 10, 10, "#999"));
  wall.push(new Rectangle(100, 100, 10, 10, "#999"));
  wall.push(new Rectangle(200,  50, 10, 10, "#999"));
  wall.push(new Rectangle(200, 100, 10, 10, "#999"));

  medios = [];
  numMediosCargados = 0;

  medios['iBody'] = new Image();
  medios['iBody'].src = 'recursos/imgs/body.png';
  medios['iBody'].addEventListener('load', cargaMedio, false);

  medios['iFood'] = new Image();
  medios['iFood'].src = 'recursos/imgs/fruit.png';
  medios['iFood'].addEventListener('load', cargaMedio, false);

  medios['iWall'] = new Image();
  medios['iWall'].src = 'recursos/imgs/wall.png';
  medios['iWall'].addEventListener('load', cargaMedio, false);

  medios['aComer'] = new Audio();
  medios['aMorir'] = new Audio();

  if (canPlayOgg()) {
    medios['aComer'].src = 'recursos/sounds/chomp.ogg';
    medios['aMorir'].src = 'recursos/sounds/dies.ogg';
  } else {
    medios['aComer'].src = 'recursos/sounds/chomp.m4a';
    medios['aMorir'].src = 'recursos/sounds/dies.m4a';
  }
  medios['aComer'].addEventListener('canplaythrough', cargaMedio, false);
  medios['aMorir'].addEventListener('canplaythrough', cargaMedio, false);

  setTimeout(function() {
    run();
    repaint();
  }, 2000);
}

document.addEventListener('keydown', function (evt) {
  lastPress = evt.keyCode;
}, false);

window.addEventListener('load', iniciar, false);