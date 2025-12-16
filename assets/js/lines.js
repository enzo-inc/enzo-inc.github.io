(function() {
  const canvas = document.getElementById('line-animation');
  const ctx = canvas.getContext('2d');
  
  let width, height;
  let heroBounds = null;
  const snakes = [];
  const maxSnakes = 16;
  const spawnInterval = 1000; // ms between new snakes
  
  // Colors from your theme
  const colors = [
    'rgba(88, 166, 255, 0.4)',   // cyan
    'rgba(188, 140, 255, 0.3)',  // purple
    'rgba(63, 185, 80, 0.3)',    // green
    'rgba(240, 198, 116, 0.25)', // amber
  ];
  
  function updateHeroBounds() {
    const hero = document.querySelector('.hero');
    if (hero) {
      const rect = hero.getBoundingClientRect();
      // Use viewport coordinates directly for fixed-position canvas
      // Horizontal: full window width, Vertical: hero section only
      heroBounds = {
        left: 0,                    // Full window width
        top: rect.top,              // Hero top
        right: width,               // Full window width
        bottom: rect.bottom,        // Hero bottom
        width: width,               // Full window width
        height: rect.height         // Hero height
      };
    }
  }
  
  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    updateHeroBounds();
  }
  
  class Snake {
    constructor() {
      if (!heroBounds) return;
      
      // Randomly choose to start from top-left or top-right of window
      const startFromRight = Math.random() > 0.5;
      const margin = 50;
      
      if (startFromRight) {
        // Start from top-right corner of window (within hero vertical bounds)
        this.points = [{ 
          x: width - Math.random() * margin, 
          y: heroBounds.top + Math.random() * margin 
        }];
        this.direction = Math.random() > 0.5 ? 'left' : 'down';
      } else {
        // Start from top-left corner of window (within hero vertical bounds)
        this.points = [{ 
          x: Math.random() * margin, 
          y: heroBounds.top + Math.random() * margin 
        }];
        this.direction = Math.random() > 0.5 ? 'right' : 'down';
      }
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.speed = 3.5 + Math.random() * 2;
      this.lineWidth = 2 + Math.random() * 2;
      this.maxLength = 500 + Math.random() * 200;
      this.segmentLength = 100 + Math.random() * 100;
      this.currentSegmentProgress = 0;
      this.tailProgress = 0;
      this.alive = true;
      this.totalLength = 0;
    }
    
    turn() {
      // Make a right-angle turn
      const lastPoint = this.points[this.points.length - 1];
      this.points.push({ x: lastPoint.x, y: lastPoint.y });
      
      if (this.direction === 'right' || this.direction === 'left') {
        this.direction = Math.random() > 0.5 ? 'down' : 'up';
      } else {
        this.direction = Math.random() > 0.5 ? 'right' : 'left';
      }
      this.segmentLength = 30 + Math.random() * 80;
      this.currentSegmentProgress = 0;
    }
    
    update() {
      if (!this.alive || !heroBounds) return;
      
      const lastPoint = this.points[this.points.length - 1];
      
      // Grow the head
      switch (this.direction) {
        case 'right': lastPoint.x += this.speed; break;
        case 'left': lastPoint.x -= this.speed; break;
        case 'down': lastPoint.y += this.speed; break;
        case 'up': lastPoint.y -= this.speed; break;
      }
      
      this.currentSegmentProgress += this.speed;
      this.totalLength += this.speed;
      
      // Turn at segment end or boundary
      // Horizontal: full window width, Vertical: hero section
      const buffer = 20;
      if (this.currentSegmentProgress >= this.segmentLength ||
          lastPoint.x > width + buffer ||           // Right edge of window
          lastPoint.x < -buffer ||                   // Left edge of window
          lastPoint.y > heroBounds.bottom + buffer || // Bottom of hero
          lastPoint.y < heroBounds.top - buffer) {    // Top of hero
        this.turn();
      }
      
      // Start consuming tail after reaching max length
      if (this.totalLength > this.maxLength) {
        this.tailProgress += this.speed * 1.1; // Tail catches up slightly faster
      }
      
      // Die when tail consumes everything
      if (this.tailProgress >= this.totalLength) {
        this.alive = false;
      }
    }
    
    draw() {
      if (!this.alive || this.points.length < 2 || !heroBounds) return;
      
      // Calculate total path length
      let totalPathLength = 0;
      for (let i = 0; i < this.points.length - 1; i++) {
        totalPathLength += this.getSegmentLength(i);
      }
      
      // Don't draw if tail has consumed the path
      const visibleLength = totalPathLength - this.tailProgress;
      if (visibleLength <= 1) return;
      
      ctx.strokeStyle = this.color;
      ctx.lineWidth = this.lineWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      // Calculate where to start drawing (tail position)
      let remainingTail = this.tailProgress;
      let startIdx = 0;
      let startOffset = null;
      
      for (let i = 0; i < this.points.length - 1; i++) {
        const segLen = this.getSegmentLength(i);
        if (segLen === 0) continue; // Skip zero-length segments
        
        if (remainingTail <= segLen) {
          startIdx = i;
          const ratio = remainingTail / segLen;
          startOffset = {
            x: this.points[i].x + (this.points[i + 1].x - this.points[i].x) * ratio,
            y: this.points[i].y + (this.points[i + 1].y - this.points[i].y) * ratio
          };
          break;
        }
        remainingTail -= segLen;
      }
      
      // If we couldn't find a valid start point, don't draw
      if (!startOffset) return;
      
      ctx.beginPath();
      ctx.moveTo(startOffset.x, startOffset.y);
      
      for (let i = startIdx + 1; i < this.points.length; i++) {
        ctx.lineTo(this.points[i].x, this.points[i].y);
      }
      
      ctx.stroke();
    }
    
    getSegmentLength(idx) {
      if (idx >= this.points.length - 1) return 0;
      const dx = this.points[idx + 1].x - this.points[idx].x;
      const dy = this.points[idx + 1].y - this.points[idx].y;
      return Math.sqrt(dx * dx + dy * dy);
    }
  }
  
  function spawnSnake() {
    if (!heroBounds) return;
    if (snakes.filter(s => s.alive).length < maxSnakes) {
      const snake = new Snake();
      if (snake.alive) snakes.push(snake);
    }
  }
  
  function animate() {
    ctx.clearRect(0, 0, width, height);
    
    if (heroBounds) {
      // Clip drawing: full window width, hero height vertically
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, heroBounds.top, width, heroBounds.height);
      ctx.clip();
      
      // Update and draw snakes
      for (let i = snakes.length - 1; i >= 0; i--) {
        snakes[i].update();
        snakes[i].draw();
        
        // Remove dead snakes
        if (!snakes[i].alive) {
          snakes.splice(i, 1);
        }
      }
      
      ctx.restore();
    }
    
    requestAnimationFrame(animate);
  }
  
  // Initialize
  resize();
  window.addEventListener('resize', resize);
  window.addEventListener('scroll', updateHeroBounds);
  
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      updateHeroBounds();
      // Spawn initial snakes
      for (let i = 0; i < 3; i++) {
        setTimeout(spawnSnake, i * 500);
      }
    });
  } else {
    updateHeroBounds();
    // Spawn initial snakes
    for (let i = 0; i < 3; i++) {
      setTimeout(spawnSnake, i * 500);
    }
  }
  
  // Keep spawning
  setInterval(spawnSnake, spawnInterval);
  
  animate();
})();
