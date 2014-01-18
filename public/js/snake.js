var environment = {
  nodeHeight: '10',
  nodeWidth: '10',
  width: 100,
  height: 60,
  color: {
    apple_1: '#D78B7D',
    apple_2: '#62868D',
    snake_head: '#62868D'
  },
  init: function() {
    msg.css({'visibility': 'visible'});
    ticker = setInterval(function(){
      player.move();
      
      if (player.growQueue >= 1) {
        player.grow();
        player.growQueue --;
      }
      
      if ((Math.random() < 0.02 && apples.apple.length < 5) || apples.apple.length === 0){
        apples.add();
      }
      
      environment.draw();
    }, interval);
  },
  pause: function(){
    clearInterval(ticker);
  },
  die: function() {
    clearInterval(ticker);
    startButton.text('Restart');
    overlay.fadeIn();

    _gaq.push(['_trackEvent', 'Snake Game', 'Died', score ]);
  },
  reset: function() {
    score = 0;
    scoreboard.text(score);
    apples.apple = [];
    apples.add();
    player.head = [5, 5];
    player.segments = [[4, 5]];
    player.direction = [1, 0];
    environment.draw();
    player.growQueue = 0;
  },
  draw: function() {
    context.clearRect(0, 0, environment.width * environment.nodeWidth, environment.height * environment.nodeHeight);
    
    $.each(apples.apple, function(){
      x0 = this.x * environment.nodeWidth;
      y0 = this.y * environment.nodeHeight; 
            
      context.fillStyle = $(this)[0].color;
      context.fillRect (x0, y0, environment.nodeWidth, environment.nodeHeight);
    });
    
    x0 = player.head[0] * environment.nodeWidth;
    y0 = player.head[1] * environment.nodeHeight;
        
    context.fillStyle = environment.color.snake_head;
    context.fillRect (x0, y0, environment.nodeWidth, environment.nodeHeight);
  
    $.each(player.segments, function(){
      x0 = $(this)[0] * environment.nodeWidth;
      y0 = $(this)[1] * environment.nodeHeight;
            
      rand = Math.floor(Math.random() * 63) + 192;
            
      context.fillStyle = 'rgb(' + rand + ', ' + rand + ', ' + rand + ')';
      context.fillRect (x0, y0, environment.nodeWidth, environment.nodeHeight);
    });

  }
}

var apples = {
  location: [],
  apple: [],
  add: function(){
    randx = Math.floor(Math.random() * environment.width);
    randy = Math.floor(Math.random() * environment.height);
    seed = Math.floor(Math.random() * 10);
    if (seed < 2){
      color = environment.color.apple_2;
      value = 20; 
    }
    else {
      color = environment.color.apple_1;
      value = 10;
    }
    apples.apple.push({x: randx, y: randy, color: color, value: value})
    apples.apple.sort();
  }
}

var player = {
  head: [5, 5],
  segments: [[4, 5]],
  growQueue: 0,
  direction: [1, 0],
  tile: 'null',
  move: function(){
  
    player.segments.unshift([player.head[0], player.head[1]])
    player.segments.pop();

    if (player.tilt) {
      var direction = player.direction.toString();
      var tilt = player.tilt.toString();

      switch(direction) {
        case ('0,-1'):
          if (tilt == '-1,0' || tilt == '1,0') { player.direction = player.tilt}
          break;
        case ('-1,0'):
          if (tilt == '0,-1' || tilt == '0,1') { player.direction = player.tilt}
          break;
        case ('0,1'):
          if (tilt == '-1,0' || tilt == '1,0') { player.direction = player.tilt}
          break;
        case ('1,0'):
          if (tilt == '0,-1' || tilt == '0,1') { player.direction = player.tilt}
          break;
      }
    }
    
    player.head[0] += player.direction[0];
    player.head[1] += player.direction[1];
    
    if (player.head[0] < 0 || player.head[0] > environment.width - 1 || player.head[1] < 0 || player.head[1] > environment.height - 1) {
      environment.die();
    }
    
    $.each(player.segments, function(){
      if ((this[0] === player.head[0]) && (this[1] === player.head[1])){
        environment.die();
      }
    });
    
    var i = 0;
    
    $.each(apples.apple, function(){
      if ((this.x === player.head[0]) && (this.y === player.head[1])){
        player.growQueue += this.value;
        apples.apple.splice(i, 1);
        if (apples.apple.length === 0){
          apples.add();
        }
      }
      i++;
    });
    
  },
  grow: function(){
    score ++;
    scoreboard.text(score);
    last = player.segments.pop();
    player.segments.push([last[0], last[1]]);
    player.segments.push([last[0] - player.direction[0], last[1] - player.direction[1]])  
  }
  
}

var x0, x1, y0, y1, canvas, context, ticker, scoreboard, overlay, msg, startButton;
var score = 0;
var interval = 75;

$(function(){
  
  scoreboard = $('.score');
  
  canvas = $('.game-board');
  context = canvas[0].getContext('2d');
  
  overlay = $('.game-overlay'),
  msg = $('.game-msg');
  
  startButton = $('.btn-start');
  startButton.click(function(){
    overlay.fadeOut(function(){
      environment.reset();
      environment.init();
    });
  });
    
});

$(document).keyup(function(e) {
  if (e.keyCode == 87 && player.direction.toString() != '0,1') { player.direction = [0, -1] }   // w
  if (e.keyCode == 65 && player.direction.toString() != '1,0') { player.direction = [-1, 0] }   // a
  if (e.keyCode == 83 && player.direction.toString() != '0,-1') { player.direction = [0, 1] }   // s
  if (e.keyCode == 68 && player.direction.toString() != '-1,0') { player.direction = [1, 0] }   // d
});

$(function(){
  window.addEventListener("devicemotion", onDeviceMotion, false);
});

function onDeviceMotion(event){
  var accel = event.accelerationIncludingGravity;
  switch (window.orientation) {  
    case 0:  
      if (accel.y > 0 && Math.abs(accel.y) > Math.abs(accel.x)) { player.tilt = [0, -1] }   // w
      if (accel.x < 0 && Math.abs(accel.x) > Math.abs(accel.y)) { player.tilt = [-1, 0] }   // a
      if (accel.y < 0 && Math.abs(accel.y) > Math.abs(accel.x)) { player.tilt = [0, 1] }   // s
      if (accel.x > 0 && Math.abs(accel.x) > Math.abs(accel.y)) { player.tilt = [1, 0] }   // d
          // Portrait 
        break; 
        
    case 90:  
      if (accel.y > 0 && Math.abs(accel.y) > Math.abs(accel.x)) { player.tilt = [-1, 0] }   // w
      if (accel.x < 0 && Math.abs(accel.x) > Math.abs(accel.y)) { player.tilt = [0, 1] }   // a
      if (accel.y < 0 && Math.abs(accel.y) > Math.abs(accel.x)) { player.tilt = [1, 0] }   // s
      if (accel.x > 0 && Math.abs(accel.x) > Math.abs(accel.y)) { player.tilt = [0, -1] }   // d
        // Landscape (Clockwise)
        break;  
        
    case 180:  
      if (accel.y > 0 && Math.abs(accel.y) > Math.abs(accel.x)) { player.tilt = [0, 1] }   // w
      if (accel.x < 0 && Math.abs(accel.x) > Math.abs(accel.y)) { player.tilt = [1, 0] }   // a
      if (accel.y < 0 && Math.abs(accel.y) > Math.abs(accel.x)) { player.tilt = [0, -1] }   // s
      if (accel.x > 0 && Math.abs(accel.x) > Math.abs(accel.y)) { player.tilt = [-1, 0] }   // d
        // Portrait (Upside-down)
        break; 
  
    case -90:  
      if (accel.y > 0 && Math.abs(accel.y) > Math.abs(accel.x)) { player.tilt = [1, 0] }   // w
      if (accel.x < 0 && Math.abs(accel.x) > Math.abs(accel.y)) { player.tilt = [0, -1] }   // a
      if (accel.y < 0 && Math.abs(accel.y) > Math.abs(accel.x)) { player.tilt = [-1, 0] }   // s
      if (accel.x > 0 && Math.abs(accel.x) > Math.abs(accel.y)) { player.tilt = [0, 1] }   // d
        // Landscape  (Counterclockwise)
        break;
    }
  
}