/**
 * Claw'd Easter Egg - A pixel art mascot that walks along the footer
 * hunting and eating code bugs.
 */
(function() {
  'use strict';

  // Respect reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  // Hide on very small screens
  if (window.innerWidth < 480) return;

  // Constants
  const CANVAS_HEIGHT = 80;
  const SPRITE_WIDTH = 48;  // Wider to accommodate arms
  const SPRITE_HEIGHT = 40;
  const GAME_FPS = 12;
  const GAME_INTERVAL = 1000 / GAME_FPS;
  const BUG_SPAWN_INTERVAL = 8000;
  const MAX_BUGS = 5;

  // States
  const State = {
    IDLE: 'idle',
    WALKING: 'walking',
    HUNTING: 'hunting',
    EATING: 'eating'
  };

  // Claw'd sprite data (10 rows x 14 cols to fit body + arms + legs)
  // 0 = empty, 1 = filled (body), 2 = empty (eyes)
  const clawdSprites = {
    // Standing with eyes open
    body: [
      [0,0,0,0,1,1,1,1,1,1,0,0,0,0],
      [0,0,0,1,1,1,1,1,1,1,1,0,0,0],
      [0,0,0,1,1,2,1,1,2,1,1,0,0,0],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [0,0,0,1,1,1,1,1,1,1,1,0,0,0],
      [0,0,0,0,1,1,1,1,1,1,0,0,0,0],
      [0,0,0,1,0,1,0,0,1,0,1,0,0,0],
      [0,0,1,0,0,1,0,0,1,0,0,1,0,0],
      [0,1,0,0,0,1,0,0,1,0,0,0,1,0]
    ],
    // Blinking (eyes closed)
    bodyBlink: [
      [0,0,0,0,1,1,1,1,1,1,0,0,0,0],
      [0,0,0,1,1,1,1,1,1,1,1,0,0,0],
      [0,0,0,1,1,1,1,1,1,1,1,0,0,0],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [0,0,0,1,1,1,1,1,1,1,1,0,0,0],
      [0,0,0,0,1,1,1,1,1,1,0,0,0,0],
      [0,0,0,1,0,1,0,0,1,0,1,0,0,0],
      [0,0,1,0,0,1,0,0,1,0,0,1,0,0],
      [0,1,0,0,0,1,0,0,1,0,0,0,1,0]
    ],
    // Walking frame 1 - legs spread out
    walk1: [
      [0,0,0,0,1,1,1,1,1,1,0,0,0,0],
      [0,0,0,1,1,1,1,1,1,1,1,0,0,0],
      [0,0,0,1,1,2,1,1,2,1,1,0,0,0],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [0,0,0,1,1,1,1,1,1,1,1,0,0,0],
      [0,0,0,0,1,1,1,1,1,1,0,0,0,0],
      [0,0,1,0,0,1,0,0,1,0,0,1,0,0],
      [0,1,0,0,1,0,0,0,0,1,0,0,1,0],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,1]
    ],
    // Walking frame 2 - legs together
    walk2: [
      [0,0,0,0,1,1,1,1,1,1,0,0,0,0],
      [0,0,0,1,1,1,1,1,1,1,1,0,0,0],
      [0,0,0,1,1,2,1,1,2,1,1,0,0,0],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [0,0,0,1,1,1,1,1,1,1,1,0,0,0],
      [0,0,0,0,1,1,1,1,1,1,0,0,0,0],
      [0,0,0,1,0,1,0,0,1,0,1,0,0,0],
      [0,0,0,0,1,0,0,0,0,1,0,0,0,0],
      [0,0,0,1,0,0,0,0,0,0,1,0,0,0]
    ],
    // Eating - mouth open
    eating: [
      [0,0,0,0,1,1,1,1,1,1,0,0,0,0],
      [0,0,0,1,1,1,1,1,1,1,1,0,0,0],
      [0,0,0,1,1,2,1,1,2,1,1,0,0,0],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,0,0,1,1,1,1,1,1],
      [0,0,0,1,1,1,1,1,1,1,1,0,0,0],
      [0,0,0,0,1,1,1,1,1,1,0,0,0,0],
      [0,0,0,1,0,1,0,0,1,0,1,0,0,0],
      [0,0,1,0,0,1,0,0,1,0,0,1,0,0],
      [0,1,0,0,0,1,0,0,1,0,0,0,1,0]
    ],
    // Jump - legs tucked
    jump: [
      [0,0,0,0,1,1,1,1,1,1,0,0,0,0],
      [0,0,0,1,1,1,1,1,1,1,1,0,0,0],
      [0,0,0,1,1,2,1,1,2,1,1,0,0,0],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [0,0,0,1,1,1,1,1,1,1,1,0,0,0],
      [0,0,0,0,1,1,1,1,1,1,0,0,0,0],
      [0,0,1,0,0,0,0,0,0,0,0,1,0,0],
      [0,0,0,1,0,0,0,0,0,0,1,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    ]
  };

  // Programming error text bugs - various languages
  const codeBugs = [
    // Generic
    '404', 'NaN', 'null', 'undefined', 'ERROR',
    // JavaScript
    'TypeError', 'ReferenceError', 'SyntaxError',
    // Python
    'KeyError', 'IndexError', 'ValueError', 'AttributeError',
    // General
    'SEGFAULT', 'panic!', 'Exception', 'FATAL',
    // Fun ones
    '<bug>', '???', 'TODO', 'FIXME', 'deprecated'
  ];

  // Canvas setup
  const canvas = document.createElement('canvas');
  canvas.id = 'clawd-canvas';
  canvas.style.cssText = `
    position: fixed;
    left: 0;
    width: 100%;
    height: ${CANVAS_HEIGHT}px;
    pointer-events: none;
    z-index: 999;
    image-rendering: pixelated;
    image-rendering: crisp-edges;
  `;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  // Position canvas above footer
  function updateCanvasPosition() {
    const footer = document.querySelector('.site-footer');
    if (footer) {
      const footerRect = footer.getBoundingClientRect();
      const bottomOffset = window.innerHeight - footerRect.top;
      canvas.style.bottom = `${bottomOffset}px`;
    } else {
      canvas.style.bottom = '40px';
    }
  }

  // Get text color from CSS variable
  function getTextColor() {
    return getComputedStyle(document.documentElement).getPropertyValue('--text').trim() || '#000000';
  }

  // State
  let width = 0;
  let clawd = {
    x: 100,
    y: CANVAS_HEIGHT - SPRITE_HEIGHT - 2,
    baseY: CANVAS_HEIGHT - SPRITE_HEIGHT - 2,
    direction: 1, // 1 = right, -1 = left
    state: State.WALKING,
    frame: 0,
    stateTimer: 0,
    targetBug: null,
    jumpVelocity: 0,
    isJumping: false
  };
  let bugs = [];
  let eatingParticles = [];
  let lastGameUpdate = 0;
  let lastBugSpawn = 0;
  let bugsEaten = 0;

  // Resize handler
  function resize() {
    width = canvas.width = window.innerWidth;
    canvas.height = CANVAS_HEIGHT;

    // Clamp Claw'd position to viewport
    if (clawd.x > width - SPRITE_WIDTH - 20) {
      clawd.x = width - SPRITE_WIDTH - 20;
    }
    if (clawd.x < 20) {
      clawd.x = 20;
    }
  }

  // Draw pixel sprite
  function drawSprite(sprite, x, y, scaleX, scaleY, flipX) {
    const color = getTextColor();
    const pixelW = scaleX / sprite[0].length;
    const pixelH = scaleY / sprite.length;

    for (let row = 0; row < sprite.length; row++) {
      for (let col = 0; col < sprite[row].length; col++) {
        const val = sprite[row][col];
        if (val === 1) {
          ctx.fillStyle = color;
          const drawCol = flipX ? (sprite[row].length - 1 - col) : col;
          ctx.fillRect(
            Math.floor(x + drawCol * pixelW),
            Math.floor(y + row * pixelH),
            Math.ceil(pixelW),
            Math.ceil(pixelH)
          );
        }
        // val === 2 means eye (empty/white), we just don't draw it
      }
    }
  }

  // Draw text bug with optional fade
  function drawTextBug(bug) {
    const color = getTextColor();
    ctx.globalAlpha = bug.opacity || 1;
    ctx.fillStyle = color;
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Scale effect when being eaten
    if (bug.scale && bug.scale !== 1) {
      ctx.save();
      ctx.translate(bug.x, bug.y);
      ctx.scale(bug.scale, bug.scale);
      ctx.fillText(bug.text, 0, 0);
      ctx.restore();
    } else {
      ctx.fillText(bug.text, bug.x + bug.wiggle, bug.y);
    }
    ctx.globalAlpha = 1;
  }

  // Get current sprite for Claw'd
  function getClawdSprite() {
    if (clawd.isJumping) return clawdSprites.jump;

    switch (clawd.state) {
      case State.IDLE:
        // Occasionally blink
        return (clawd.frame % 30 < 3) ? clawdSprites.bodyBlink : clawdSprites.body;
      case State.EATING:
        return clawdSprites.eating;
      case State.WALKING:
      case State.HUNTING:
        return (clawd.frame % 6 < 3) ? clawdSprites.walk1 : clawdSprites.walk2;
      default:
        return clawdSprites.body;
    }
  }

  // Spawn a bug
  function spawnBug() {
    if (bugs.length >= MAX_BUGS) return;

    const MIN_SPACING = 100;
    let x;
    let attempts = 0;

    do {
      x = Math.random() * (width - 100) + 50;
      attempts++;
    } while (
      attempts < 10 &&
      bugs.some(b => Math.abs(b.x - x) < MIN_SPACING)
    );

    const bug = {
      x: x,
      y: CANVAS_HEIGHT - 12,
      text: codeBugs[Math.floor(Math.random() * codeBugs.length)],
      wiggle: 0,
      opacity: 1,
      scale: 1,
      beingEaten: false
    };
    bugs.push(bug);
  }

  // Create eating particles
  function createEatingParticles(x, y) {
    for (let i = 0; i < 5; i++) {
      eatingParticles.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 4,
        vy: -Math.random() * 3 - 1,
        life: 1,
        char: ['*', '!', '#', '@'][Math.floor(Math.random() * 4)]
      });
    }
  }

  // Update game logic (12fps)
  function updateGame(timestamp) {
    if (timestamp - lastGameUpdate < GAME_INTERVAL) return;
    lastGameUpdate = timestamp;

    clawd.frame++;
    clawd.stateTimer++;

    // Spawn bugs periodically
    if (timestamp - lastBugSpawn > BUG_SPAWN_INTERVAL) {
      spawnBug();
      lastBugSpawn = timestamp;
    }

    // Handle jump physics
    if (clawd.isJumping) {
      clawd.jumpVelocity += 1.2;
      clawd.y += clawd.jumpVelocity;

      if (clawd.y >= clawd.baseY) {
        clawd.y = clawd.baseY;
        clawd.isJumping = false;
        clawd.jumpVelocity = 0;
      }
    }

    // Update eating particles
    for (let i = eatingParticles.length - 1; i >= 0; i--) {
      const p = eatingParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.3;
      p.life -= 0.08;
      if (p.life <= 0) {
        eatingParticles.splice(i, 1);
      }
    }

    // Update bugs being eaten (fade/shrink animation)
    for (let i = bugs.length - 1; i >= 0; i--) {
      const bug = bugs[i];
      if (bug.beingEaten) {
        bug.opacity -= 0.15;
        bug.scale -= 0.1;
        if (bug.opacity <= 0) {
          bugs.splice(i, 1);
        }
      }
    }

    // State machine
    const clawdCenterX = clawd.x + SPRITE_WIDTH / 2;

    switch (clawd.state) {
      case State.IDLE:
        if (clawd.stateTimer > 24) {
          clawd.state = State.WALKING;
          clawd.stateTimer = 0;
        }
        // Check for bugs to hunt
        if (bugs.length > 0) {
          const nearestBug = findNearestBug();
          if (nearestBug && !nearestBug.beingEaten) {
            clawd.targetBug = nearestBug;
            clawd.state = State.HUNTING;
            clawd.stateTimer = 0;
          }
        }
        break;

      case State.WALKING:
        clawd.x += clawd.direction * 6;

        // Turn at edges
        if (clawd.x > width - SPRITE_WIDTH - 20) {
          clawd.direction = -1;
        } else if (clawd.x < 20) {
          clawd.direction = 1;
        }

        // Occasionally stop to idle
        if (Math.random() < 0.008) {
          clawd.state = State.IDLE;
          clawd.stateTimer = 0;
        }

        // Check for bugs to hunt
        if (bugs.length > 0) {
          const nearestBug = findNearestBug();
          if (nearestBug && !nearestBug.beingEaten) {
            clawd.targetBug = nearestBug;
            clawd.state = State.HUNTING;
            clawd.stateTimer = 0;
          }
        }
        break;

      case State.HUNTING:
        // Always check for nearest bug (handles new spawns being closer)
        const nearestBug = findNearestBug();
        if (!nearestBug) {
          clawd.targetBug = null;
          clawd.state = State.WALKING;
          clawd.stateTimer = 0;
          break;
        }
        // Switch to closer bug if one exists
        clawd.targetBug = nearestBug;

        // Move toward bug (faster)
        const bugX = clawd.targetBug.x;
        const dist = Math.abs(bugX - clawdCenterX);

        if (dist > 15) {
          clawd.direction = bugX > clawdCenterX ? 1 : -1;
          clawd.x += clawd.direction * 10;
        } else {
          // Close enough - start eating!
          clawd.state = State.EATING;
          clawd.stateTimer = 0;
          clawd.targetBug.beingEaten = true;
          bugsEaten++;
          createEatingParticles(clawd.targetBug.x, clawd.targetBug.y);
        }
        break;

      case State.EATING:
        if (clawd.stateTimer > 10) {
          clawd.targetBug = null;
          clawd.state = State.WALKING;
          clawd.stateTimer = 0;
        }
        break;
    }

    // Update bug wiggle animation
    bugs.forEach(bug => {
      if (!bug.beingEaten) {
        bug.wiggle = Math.sin(timestamp / 200 + bug.x) * 1.5;
      }
    });
  }

  // Find nearest non-eaten bug
  function findNearestBug() {
    const clawdCenterX = clawd.x + SPRITE_WIDTH / 2;
    let nearest = null;
    let nearestDist = Infinity;

    for (const bug of bugs) {
      if (bug.beingEaten) continue;
      const dist = Math.abs(bug.x - clawdCenterX);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = bug;
      }
    }
    return nearest;
  }

  // Render (60fps)
  function render() {
    ctx.clearRect(0, 0, width, CANVAS_HEIGHT);

    // Draw bugs eaten counter
    const color = getTextColor();
    ctx.fillStyle = color;
    ctx.font = '10px monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(`bugs eaten: ${bugsEaten}`, 10, 10);

    // Draw bugs
    bugs.forEach(bug => {
      drawTextBug(bug);
    });

    // Draw eating particles
    eatingParticles.forEach(p => {
      ctx.globalAlpha = p.life;
      ctx.fillStyle = color;
      ctx.font = '8px monospace';
      ctx.fillText(p.char, p.x, p.y);
    });
    ctx.globalAlpha = 1;

    // Draw Claw'd
    const sprite = getClawdSprite();
    drawSprite(sprite, clawd.x, clawd.y, SPRITE_WIDTH, SPRITE_HEIGHT, clawd.direction === -1);
  }

  // Main loop
  function gameLoop(timestamp) {
    updateGame(timestamp);
    render();
    requestAnimationFrame(gameLoop);
  }

  // Click handler for jump + spawn bugs
  function handleClick(e) {
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX;
    const clickY = e.clientY;

    // Check if click is near Claw'd (use screen coordinates)
    const clawdScreenX = clawd.x;
    const clawdScreenY = rect.top + clawd.y;

    if (clickX >= clawdScreenX && clickX <= clawdScreenX + SPRITE_WIDTH &&
        clickY >= clawdScreenY && clickY <= clawdScreenY + SPRITE_HEIGHT) {
      // Jump!
      if (!clawd.isJumping) {
        clawd.isJumping = true;
        clawd.jumpVelocity = -8;

        // Spawn 1 bug (respects MAX_BUGS threshold)
        spawnBug();
      }
    }
  }

  // Initialize
  function init() {
    resize();
    updateCanvasPosition();
    window.addEventListener('resize', () => {
      resize();
      updateCanvasPosition();
    });
    window.addEventListener('scroll', updateCanvasPosition);

    // Enable pointer events for click detection
    canvas.style.pointerEvents = 'auto';
    canvas.style.cursor = 'pointer';
    document.addEventListener('click', handleClick);

    // Start animation
    lastBugSpawn = performance.now();
    requestAnimationFrame(gameLoop);

    // Spawn initial bug after a delay
    setTimeout(spawnBug, 3000);
  }

  // Wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
