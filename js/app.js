/**
 * Critter Splash! (Where's My Water? — Smiling Critters Edition)
 * 100% Pure Visual / Zero-Text Kid-Friendly Edition (with Animated Finger Guide 👆)
 */

(() => {
  'use strict';

  // Canvas & Terrain Grid Constants
  const CW = 820;
  const CH = 540;
  const CELL = 4;
  const GW = Math.floor(CW / CELL); // 205
  const GH = Math.floor(CH / CELL); // 135

  // Terrain Cell Types
  const EMPTY = 0;
  const DIRT = 1;
  const ROCK = 2;
  const ALGAE = 3;
  const COALS = 4;
  const ICE = 5;

  // Fluid Particle Types
  const DROP_WATER = 'water';
  const DROP_OOZE = 'ooze';
  const DROP_STEAM = 'steam';

  const REQUIRED_BATH_DROPS = 22;
  const DUCK_REQUIRED_DROPS = 4;

  // Bathtub Chamber & Funnel Geometry (Bottom-Right Corner)
  const FUNNEL = {
    x: 575,
    y: 425,
    r: 46
  };
  const TUB_CHAMBER = {
    x: 608,
    y: 372,
    w: 185,
    h: 146
  };

  // 8 Handcrafted Smiling Critters Levels (100% Visual Icon-Driven)
  const LEVELS = [
    {
      id: 1,
      icon: 'icons/dogday.jpg',
      iconsOverlay: [],
      setup(api) {
        api.fillDirtRect(24, 24, 772, 492);
        api.carveRoundedRect(65, 36, 175, 66, 22);
        api.drawRockLine(45, 170, 485, 212, 16);
        api.drawRockLine(755, 298, 255, 345, 16);
        api.carveCircle(300, 140, 28);
        api.carveCircle(585, 232, 28);
        api.carveCircle(175, 365, 28);
        api.spawnPool(78, 44, 150, 48, DROP_WATER, 105);
        api.addDuck(300, 140);
        api.addDuck(585, 232);
        api.addDuck(175, 365);
      },
      hintPaths: [
        [[150, 92], [300, 140], [515, 190], [585, 232], [500, 282], [225, 325], [175, 365], [375, 405], [575, 425]]
      ]
    },
    {
      id: 2,
      icon: 'icons/hoppy.jpg',
      iconsOverlay: [],
      setup(api) {
        api.fillDirtRect(24, 24, 772, 492);
        api.carveRoundedRect(65, 36, 155, 62, 20);
        api.carveRoundedRect(455, 36, 155, 62, 20);
        api.drawRockLine(55, 190, 285, 265, 16);
        api.drawRockLine(645, 190, 415, 265, 16);
        api.drawRockLine(235, 355, 515, 405, 16);
        api.carveCircle(165, 152, 27);
        api.carveCircle(515, 152, 27);
        api.carveCircle(350, 305, 28);
        api.spawnPool(75, 44, 135, 46, DROP_WATER, 60);
        api.spawnPool(465, 44, 135, 46, DROP_WATER, 60);
        api.addDuck(165, 152);
        api.addDuck(515, 152);
        api.addDuck(350, 305);
      },
      hintPaths: [
        [[145, 90], [165, 152], [310, 245], [350, 305], [535, 385], [575, 425]],
        [[525, 90], [515, 152], [385, 245], [350, 305]]
      ]
    },
    {
      id: 3,
      icon: 'icons/bobby.jpg',
      iconsOverlay: [],
      setup(api) {
        api.fillDirtRect(24, 24, 772, 492);
        api.carveRoundedRect(70, 36, 175, 64, 20);
        api.drawRockLine(50, 265, 300, 305, 16);
        api.drawRockLine(460, 230, 460, 340, 18);
        api.drawRockLine(460, 455, 460, 505, 18);
        api.carveCircle(165, 222, 30);
        api.carveCircle(315, 160, 27);
        api.carveCircle(380, 365, 28);
        api.carveCircle(518, 405, 28);
        api.addSwitch('red', '#ff5252', 165, 222);
        api.addGate('red', '#ff5252', 450, 340, 22, 118, 450, 230);
        api.spawnPool(80, 44, 155, 48, DROP_WATER, 110);
        api.addDuck(315, 160);
        api.addDuck(380, 365);
        api.addDuck(518, 405);
      },
      hintPaths: [
        [[145, 92], [165, 222], [325, 275], [380, 365], [465, 395], [518, 405], [575, 425]],
        [[195, 92], [315, 160], [380, 365]]
      ]
    },
    {
      id: 4,
      icon: 'icons/picky.jpg',
      iconsOverlay: [{ x: 155, y: 210, emoji: '☠️' }],
      setup(api) {
        api.fillDirtRect(24, 24, 772, 492);
        api.carveRoundedRect(80, 36, 175, 64, 20);
        api.carveRoundedRect(90, 228, 130, 56, 16);
        api.drawRockLine(78, 292, 235, 292, 16);
        api.drawRockLine(235, 218, 235, 292, 16);
        api.carveRoundedRect(38, 395, 155, 90, 18);
        api.drawRockLine(205, 380, 205, 500, 16);
        api.carveCircle(340, 145, 28);
        api.carveCircle(465, 250, 28);
        api.carveCircle(515, 368, 28);
        api.spawnPool(90, 44, 155, 48, DROP_WATER, 110);
        api.spawnPool(100, 236, 110, 40, DROP_OOZE, 26);
        api.addDuck(340, 145);
        api.addDuck(465, 250);
        api.addDuck(515, 368);
      },
      hintPaths: [
        [[225, 90], [340, 145], [465, 250], [515, 368], [575, 425]]
      ]
    },
    {
      id: 5,
      icon: 'icons/bubba.jpg',
      iconsOverlay: [
        { x: 505, y: 30, emoji: '🧪' },
        { x: 415, y: 195, emoji: '🌿' }
      ],
      setup(api) {
        api.fillDirtRect(24, 24, 772, 492);
        api.carveRoundedRect(65, 36, 165, 62, 18);
        api.carveRoundedRect(440, 36, 135, 54, 16);
        api.drawRockLine(280, 165, 368, 242, 16);
        api.drawRockLine(550, 165, 462, 242, 16);
        api.carveRoundedRect(368, 200, 94, 50, 12);
        api.fillCellTypeRect(376, 214, 78, 24, ALGAE);
        api.carveRoundedRect(90, 395, 175, 90, 18);
        api.drawRockLine(280, 370, 280, 500, 16);
        api.carveCircle(230, 155, 27);
        api.carveCircle(415, 305, 27);
        api.carveCircle(518, 385, 27);
        api.addDuck(230, 155);
        api.addDuck(415, 305);
        api.addDuck(518, 385);
        api.spawnPool(75, 44, 145, 46, DROP_WATER, 110);
        api.spawnPool(450, 42, 115, 38, DROP_OOZE, 30);
      },
      hintPaths: [
        [[165, 90], [230, 155], [385, 198], [415, 232], [415, 305], [518, 385], [575, 425]]
      ]
    },
    {
      id: 6,
      icon: 'icons/craftycorn.jpg',
      iconsOverlay: [
        { x: 175, y: 472, emoji: '🔥' },
        { x: 475, y: 74, emoji: '❄️' }
      ],
      setup(api) {
        api.fillDirtRect(24, 24, 772, 492);
        api.carveRoundedRect(55, 155, 130, 64, 18);
        api.drawRockLine(315, 150, 315, 505, 18);
        api.carveRoundedRect(230, 48, 66, 340, 18);
        api.carveRoundedRect(75, 365, 218, 82, 18);
        api.fillCellTypeRect(88, 434, 192, 18, COALS);
        api.drawRockLine(65, 456, 298, 456, 14);
        api.carveRoundedRect(365, 42, 225, 78, 20);
        api.fillCellTypeRect(380, 30, 195, 20, ICE);
        api.carveCircle(120, 285, 27);
        api.carveCircle(263, 98, 27);
        api.carveCircle(480, 255, 28);
        api.addDuck(120, 285);
        api.addDuck(263, 98);
        api.addDuck(480, 255);
        api.spawnPool(65, 165, 110, 46, DROP_WATER, 110);
      },
      hintPaths: [
        [[120, 208], [120, 285], [130, 395]],
        [[263, 78], [410, 74]],
        [[475, 108], [480, 255], [535, 365], [575, 425]]
      ]
    },
    {
      id: 7,
      icon: 'icons/kickin.jpg',
      iconsOverlay: [],
      setup(api) {
        api.fillDirtRect(24, 24, 772, 492);
        api.carveRoundedRect(65, 36, 170, 62, 18);
        api.carveCircle(400, 74, 32);
        api.drawRockLine(55, 222, 285, 262, 16);
        api.drawRockLine(600, 202, 380, 262, 16);
        api.drawRockLine(225, 360, 460, 405, 16);
        api.carveCircle(225, 208, 28);
        api.carveCircle(445, 218, 28);
        api.addSwitch('blue', '#29b6f6', 225, 208);
        api.addSwitch('green', '#66bb6a', 445, 218);
        api.addGate('blue', '#29b6f6', 305, 268, 118, 20, 175, 268);
        api.addGate('green', '#66bb6a', 485, 345, 22, 118, 485, 230);
        api.addSpout(400, 74, 0.45, 1.35, DROP_WATER);
        api.carveCircle(165, 145, 26);
        api.carveCircle(358, 325, 27);
        api.carveCircle(530, 400, 27);
        api.addDuck(165, 145);
        api.addDuck(358, 325);
        api.addDuck(530, 400);
        api.spawnPool(75, 44, 150, 46, DROP_WATER, 95);
      },
      hintPaths: [
        [[155, 90], [165, 145], [225, 208], [358, 268], [358, 325], [475, 392], [530, 400], [575, 425]],
        [[400, 90], [445, 218], [358, 268]]
      ]
    },
    {
      id: 8,
      icon: 'icons/catnap.jpg',
      iconsOverlay: [{ x: 430, y: 162, emoji: '🌿' }],
      setup(api) {
        api.fillDirtRect(24, 24, 772, 492);
        api.carveRoundedRect(65, 36, 175, 62, 18);
        api.addSpout(120, 58, 0.35, 1.25, DROP_WATER);
        api.carveRoundedRect(395, 36, 128, 52, 16);
        api.carveRoundedRect(380, 165, 100, 46, 12);
        api.fillCellTypeRect(388, 176, 84, 22, ALGAE);
        api.drawRockLine(55, 228, 278, 268, 16);
        api.drawRockLine(260, 360, 465, 405, 16);
        api.carveCircle(198, 202, 28);
        api.addSwitch('purple', '#ab47bc', 198, 202);
        api.addGate('purple', '#ab47bc', 485, 345, 22, 118, 485, 230);
        api.carveCircle(175, 135, 26);
        api.carveCircle(362, 308, 27);
        api.carveCircle(530, 400, 27);
        api.addDuck(175, 135);
        api.addDuck(362, 308);
        api.addDuck(530, 400);
        api.spawnPool(75, 44, 155, 46, DROP_WATER, 100);
        api.spawnPool(405, 42, 105, 38, DROP_OOZE, 26);
      },
      hintPaths: [
        [[165, 90], [175, 135], [198, 202], [362, 308], [470, 390], [530, 400], [575, 425]]
      ]
    }
  ];

  // Web Audio Synthesizer
  class SoundEngine {
    constructor() {
      this.enabled = true;
      this.ctx = null;
      this.lastDigTime = 0;
      this.lastDropTime = 0;
    }

    ensureCtx() {
      if (!this.enabled) return null;
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    }

    playDig() {
      const now = performance.now();
      if (now - this.lastDigTime < 55) return;
      this.lastDigTime = now;
      const ctx = this.ensureCtx();
      if (!ctx || ctx.state !== 'running') return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(145 + Math.random() * 65, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(75, ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.055);
    }

    playSplash() {
      const now = performance.now();
      if (now - this.lastDropTime < 70) return;
      this.lastDropTime = now;
      const ctx = this.ensureCtx();
      if (!ctx || ctx.state !== 'running') return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      const base = 420 + Math.random() * 260;
      osc.frequency.setValueAtTime(base, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(base * 1.45, ctx.currentTime + 0.07);
      gain.gain.setValueAtTime(0.07, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.075);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    }

    playDuckQuack() {
      const ctx = this.ensureCtx();
      if (!ctx || ctx.state !== 'running') return;
      const t = ctx.currentTime;
      [520, 680, 880].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t + idx * 0.07);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.18, t + idx * 0.07 + 0.06);
        gain.gain.setValueAtTime(0.14, t + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.07 + 0.08);
        osc.connect(gain).connect(ctx.destination);
        osc.start(t + idx * 0.07);
        osc.stop(t + idx * 0.07 + 0.09);
      });
    }

    playSwitchOpen() {
      const ctx = this.ensureCtx();
      if (!ctx || ctx.state !== 'running') return;
      const t = ctx.currentTime;
      [440, 660].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t + i * 0.08);
        gain.gain.setValueAtTime(0.14, t + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.08 + 0.14);
        osc.connect(gain).connect(ctx.destination);
        osc.start(t + i * 0.08);
        osc.stop(t + i * 0.08 + 0.15);
      });
    }

    playWinFanfare() {
      const ctx = this.ensureCtx();
      if (!ctx || ctx.state !== 'running') return;
      const notes = [523.25, 659.25, 783.99, 1046.5];
      const t = ctx.currentTime;
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t + i * 0.11);
        gain.gain.setValueAtTime(0.16, t + i * 0.11);
        gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.11 + 0.28);
        osc.connect(gain).connect(ctx.destination);
        osc.start(t + i * 0.11);
        osc.stop(t + i * 0.11 + 0.3);
      });
    }
  }

  const sfx = new SoundEngine();

  // Main Game State
  const state = {
    currentLevelIdx: 0,
    activeTool: 'dig',
    grid: new Uint8Array(GW * GH),
    terrainDirty: true,
    drops: [],
    ducks: [],
    switches: [],
    gates: [],
    spouts: [],
    sparkles: [],
    bathDropsCollected: 0,
    levelWon: false,
    hasDugThisLevel: false,
    progressByLevel: JSON.parse(localStorage.getItem('critter_splash_progress_v1') || '{}'),
    isPointerDown: false,
    lastPointer: null,
    frameTick: 0
  };

  // Preload Critter Images
  const critterImages = {};
  LEVELS.forEach(lvl => {
    const img = new Image();
    img.src = lvl.icon;
    critterImages[lvl.id] = img;
  });

  // Offscreen Canvas for Fast Terrain Rendering
  const terrainCanvas = document.createElement('canvas');
  terrainCanvas.width = CW;
  terrainCanvas.height = CH;
  const tCtx = terrainCanvas.getContext('2d');

  // DOM References
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const levelNavBar = document.getElementById('levelNavBar');
  const sideCritterImg = document.getElementById('sideCritterImg');
  const critterMoodBadge = document.getElementById('critterMoodBadge');
  const bathProgressBar = document.getElementById('bathProgressBar');
  const floatingToast = document.getElementById('floatingToast');

  let toastTimer = null;
  function showToast(emojiMsg, duration = 1500) {
    floatingToast.textContent = emojiMsg;
    floatingToast.classList.remove('hidden');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      floatingToast.classList.add('hidden');
    }, duration);
  }

  function getCell(gx, gy) {
    if (gx < 0 || gx >= GW || gy < 0 || gy >= GH) return ROCK;
    return state.grid[gy * GW + gx];
  }

  function setCell(gx, gy, val) {
    if (gx < 0 || gx >= GW || gy < 0 || gy >= GH) return;
    state.grid[gy * GW + gx] = val;
  }

  // Level Setup Builder API
  const builderApi = {
    fillDirtRect(x, y, w, h) {
      const x0 = Math.max(2, Math.floor(x / CELL));
      const y0 = Math.max(2, Math.floor(y / CELL));
      const x1 = Math.min(GW - 3, Math.floor((x + w) / CELL));
      const y1 = Math.min(GH - 3, Math.floor((y + h) / CELL));
      for (let gy = y0; gy <= y1; gy++) {
        for (let gx = x0; gx <= x1; gx++) {
          setCell(gx, gy, DIRT);
        }
      }
    },

    fillCellTypeRect(x, y, w, h, type) {
      const x0 = Math.max(2, Math.floor(x / CELL));
      const y0 = Math.max(2, Math.floor(y / CELL));
      const x1 = Math.min(GW - 3, Math.floor((x + w) / CELL));
      const y1 = Math.min(GH - 3, Math.floor((y + h) / CELL));
      for (let gy = y0; gy <= y1; gy++) {
        for (let gx = x0; gx <= x1; gx++) {
          setCell(gx, gy, type);
        }
      }
    },

    carveCircle(cx, cy, r, targetType = EMPTY, allowRockOverwrite = false) {
      const gx0 = Math.max(2, Math.floor((cx - r) / CELL));
      const gy0 = Math.max(2, Math.floor((cy - r) / CELL));
      const gx1 = Math.min(GW - 3, Math.ceil((cx + r) / CELL));
      const gy1 = Math.min(GH - 3, Math.ceil((cy + r) / CELL));
      const rSq = r * r;
      for (let gy = gy0; gy <= gy1; gy++) {
        const py = gy * CELL + CELL * 0.5;
        for (let gx = gx0; gx <= gx1; gx++) {
          const px = gx * CELL + CELL * 0.5;
          const dx = px - cx;
          const dy = py - cy;
          if (dx * dx + dy * dy <= rSq) {
            const cur = getCell(gx, gy);
            if (allowRockOverwrite || cur === DIRT || cur === ALGAE || cur === EMPTY) {
              setCell(gx, gy, targetType);
            }
          }
        }
      }
    },

    carveRoundedRect(x, y, w, h, radius = 16) {
      const gx0 = Math.max(2, Math.floor(x / CELL));
      const gy0 = Math.max(2, Math.floor(y / CELL));
      const gx1 = Math.min(GW - 3, Math.ceil((x + w) / CELL));
      const gy1 = Math.min(GH - 3, Math.ceil((y + h) / CELL));
      for (let gy = gy0; gy <= gy1; gy++) {
        const py = gy * CELL + CELL * 0.5;
        for (let gx = gx0; gx <= gx1; gx++) {
          const px = gx * CELL + CELL * 0.5;
          const cx = Math.max(x + radius, Math.min(x + w - radius, px));
          const cy = Math.max(y + radius, Math.min(y + h - radius, py));
          const dx = px - cx;
          const dy = py - cy;
          if (dx * dx + dy * dy <= radius * radius) {
            setCell(gx, gy, EMPTY);
          }
        }
      }
    },

    drawRockLine(x1, y1, x2, y2, thickness = 16) {
      const dist = Math.hypot(x2 - x1, y2 - y1);
      const steps = Math.max(1, Math.ceil(dist / 3));
      const r = thickness * 0.5;
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const px = x1 + (x2 - x1) * t;
        const py = y1 + (y2 - y1) * t;
        this.carveCircle(px, py, r, ROCK, true);
      }
    },

    spawnPool(x, y, w, h, type, count) {
      const cols = Math.max(4, Math.round(Math.sqrt((count * w) / Math.max(1, h))));
      const rows = Math.max(2, Math.ceil(count / cols));
      let spawned = 0;
      for (let r = 0; r < rows && spawned < count; r++) {
        for (let c = 0; c < cols && spawned < count; c++) {
          const px = x + ((c + 0.5) / cols) * w + (Math.random() - 0.5) * 3;
          const py = y + ((r + 0.5) / rows) * h + (Math.random() - 0.5) * 3;
          state.drops.push({
            x: px,
            y: py,
            vx: (Math.random() - 0.5) * 0.3,
            vy: 0,
            type
          });
          spawned++;
        }
      }
    },

    addDuck(x, y) {
      state.ducks.push({
        x,
        y,
        r: 25,
        dropsAbsorbed: 0,
        collected: false,
        bobOffset: Math.random() * Math.PI * 2,
        scaleAnim: 1
      });
    },

    addSwitch(id, color, x, y) {
      state.switches.push({
        id,
        color,
        x,
        y,
        r: 20,
        triggered: false
      });
    },

    addGate(id, color, x, y, w, h, openX, openY) {
      state.gates.push({
        id,
        color,
        x,
        y,
        startX: x,
        startY: y,
        w,
        h,
        openX,
        openY,
        isOpen: false,
        openProgress: 0
      });
    },

    addSpout(x, y, vx, vy, type = DROP_WATER) {
      state.spouts.push({
        x,
        y,
        vx,
        vy,
        type,
        active: true,
        emitted: 0,
        maxEmit: 90
      });
    }
  };

  function loadLevel(idx) {
    state.currentLevelIdx = (idx + LEVELS.length) % LEVELS.length;
    const lvl = LEVELS[state.currentLevelIdx];

    state.drops = [];
    state.ducks = [];
    state.switches = [];
    state.gates = [];
    state.spouts = [];
    state.sparkles = [];
    state.bathDropsCollected = 0;
    state.levelWon = false;
    state.hasDugThisLevel = false;

    state.grid.fill(ROCK);
    for (let gy = 2; gy < GH - 2; gy++) {
      for (let gx = 2; gx < GW - 2; gx++) {
        setCell(gx, gy, EMPTY);
      }
    }

    lvl.setup(builderApi);

    builderApi.carveRoundedRect(
      TUB_CHAMBER.x - 8,
      TUB_CHAMBER.y - 6,
      TUB_CHAMBER.w + 10,
      TUB_CHAMBER.h + 8,
      18
    );
    builderApi.carveCircle(FUNNEL.x, FUNNEL.y, FUNNEL.r + 14, EMPTY, true);

    state.terrainDirty = true;
    updateVisualHUD();
    renderLevelNav();
    document.getElementById('winModal').classList.add('hidden');
  }

  function rebuildTerrainLayer() {
    tCtx.clearRect(0, 0, CW, CH);

    const bgGrad = tCtx.createLinearGradient(0, 0, 0, CH);
    bgGrad.addColorStop(0, '#102840');
    bgGrad.addColorStop(1, '#091929');
    tCtx.fillStyle = bgGrad;
    tCtx.fillRect(0, 0, CW, CH);

    tCtx.strokeStyle = 'rgba(129, 212, 250, 0.06)';
    tCtx.lineWidth = 1;
    for (let x = 0; x < CW; x += 28) {
      tCtx.beginPath();
      tCtx.moveTo(x, 0);
      tCtx.lineTo(x, CH);
      tCtx.stroke();
    }
    for (let y = 0; y < CH; y += 28) {
      tCtx.beginPath();
      tCtx.moveTo(0, y);
      tCtx.lineTo(CW, y);
      tCtx.stroke();
    }

    for (let gy = 0; gy < GH; gy++) {
      const py = gy * CELL;
      for (let gx = 0; gx < GW; gx++) {
        const cell = state.grid[gy * GW + gx];
        if (cell === EMPTY) continue;
        const px = gx * CELL;

        if (cell === DIRT) {
          const isEdge =
            getCell(gx - 1, gy) === EMPTY ||
            getCell(gx + 1, gy) === EMPTY ||
            getCell(gx, gy - 1) === EMPTY ||
            getCell(gx, gy + 1) === EMPTY;

          if (isEdge) {
            tCtx.fillStyle = '#d4924c';
          } else {
            const checker = ((gx >> 1) + (gy >> 1)) % 3;
            tCtx.fillStyle = checker === 0 ? '#8d5524' : checker === 1 ? '#7f4b1e' : '#965c28';
          }
          tCtx.fillRect(px, py, CELL, CELL);
        } else if (cell === ROCK) {
          const isEdge =
            getCell(gx - 1, gy) === EMPTY ||
            getCell(gx + 1, gy) === EMPTY ||
            getCell(gx, gy - 1) === EMPTY ||
            getCell(gx, gy + 1) === EMPTY;
          tCtx.fillStyle = isEdge ? '#78909c' : ((gx + gy) % 2 === 0 ? '#455a64' : '#37474f');
          tCtx.fillRect(px, py, CELL, CELL);
        } else if (cell === ALGAE) {
          tCtx.fillStyle = (gx + gy) % 2 === 0 ? '#43a047' : '#66bb6a';
          tCtx.fillRect(px, py, CELL, CELL);
        } else if (cell === COALS) {
          tCtx.fillStyle = (gx + gy) % 2 === 0 ? '#ff5722' : '#ff9800';
          tCtx.fillRect(px, py, CELL, CELL);
        } else if (cell === ICE) {
          tCtx.fillStyle = (gx + gy) % 2 === 0 ? '#4dd0e1' : '#b2ebf2';
          tCtx.fillRect(px, py, CELL, CELL);
        }
      }
    }

    state.terrainDirty = false;
  }

  function applyToolAtPoint(px, py, customRadius = null) {
    if (px > TUB_CHAMBER.x - 10 && py > TUB_CHAMBER.y - 10) {
      return;
    }

    if (state.activeTool === 'dig') {
      const radius = customRadius || 26;
      const gx0 = Math.max(2, Math.floor((px - radius) / CELL));
      const gy0 = Math.max(2, Math.floor((py - radius) / CELL));
      const gx1 = Math.min(GW - 3, Math.ceil((px + radius) / CELL));
      const gy1 = Math.min(GH - 3, Math.ceil((py + radius) / CELL));
      const rSq = radius * radius;
      let dugAny = false;

      for (let gy = gy0; gy <= gy1; gy++) {
        const cy = gy * CELL + CELL * 0.5;
        for (let gx = gx0; gx <= gx1; gx++) {
          const cx = gx * CELL + CELL * 0.5;
          const dx = cx - px;
          const dy = cy - py;
          if (dx * dx + dy * dy <= rSq) {
            if (getCell(gx, gy) === DIRT) {
              setCell(gx, gy, EMPTY);
              dugAny = true;
            }
          }
        }
      }

      if (dugAny) {
        state.hasDugThisLevel = true;
        state.terrainDirty = true;
        sfx.playDig();
        for (let i = 0; i < 2; i++) {
          state.sparkles.push({
            x: px + (Math.random() - 0.5) * 18,
            y: py + (Math.random() - 0.5) * 18,
            vx: (Math.random() - 0.5) * 2.5,
            vy: -Math.random() * 2.2,
            color: '#d7995b',
            r: 3.5,
            life: 16
          });
        }
      }
    } else if (state.activeTool === 'fill') {
      const radius = 18;
      const gx0 = Math.max(2, Math.floor((px - radius) / CELL));
      const gy0 = Math.max(2, Math.floor((py - radius) / CELL));
      const gx1 = Math.min(GW - 3, Math.ceil((px + radius) / CELL));
      const gy1 = Math.min(GH - 3, Math.ceil((py + radius) / CELL));
      const rSq = radius * radius;
      let filledAny = false;

      for (let gy = gy0; gy <= gy1; gy++) {
        const cy = gy * CELL + CELL * 0.5;
        for (let gx = gx0; gx <= gx1; gx++) {
          const cx = gx * CELL + CELL * 0.5;
          const dx = cx - px;
          const dy = cy - py;
          if (dx * dx + dy * dy <= rSq && getCell(gx, gy) === EMPTY) {
            setCell(gx, gy, DIRT);
            filledAny = true;
          }
        }
      }
      if (filledAny) {
        state.terrainDirty = true;
        sfx.playDig();
      }
    } else if (state.activeTool === 'purify') {
      const radius = 38;
      const gx0 = Math.max(2, Math.floor((px - radius) / CELL));
      const gy0 = Math.max(2, Math.floor((py - radius) / CELL));
      const gx1 = Math.min(GW - 3, Math.ceil((px + radius) / CELL));
      const gy1 = Math.min(GH - 3, Math.ceil((py + radius) / CELL));
      const rSq = radius * radius;
      let changed = false;

      for (let gy = gy0; gy <= gy1; gy++) {
        const cy = gy * CELL + CELL * 0.5;
        for (let gx = gx0; gx <= gx1; gx++) {
          const cx = gx * CELL + CELL * 0.5;
          const dx = cx - px;
          const dy = cy - py;
          if (dx * dx + dy * dy <= rSq && getCell(gx, gy) === ALGAE) {
            setCell(gx, gy, EMPTY);
            changed = true;
          }
        }
      }

      state.drops.forEach(d => {
        const dx = d.x - px;
        const dy = d.y - py;
        if (dx * dx + dy * dy <= rSq && d.type === DROP_OOZE) {
          d.type = DROP_WATER;
          changed = true;
        }
      });

      if (changed) {
        state.terrainDirty = true;
        sfx.playSplash();
        state.sparkles.push({
          x: px,
          y: py,
          vx: 0,
          vy: -1.5,
          color: '#80deea',
          r: 4.5,
          life: 20
        });
      }
    }
  }

  function applyToolSegment(x0, y0, x1, y1, customRadius = null) {
    const dist = Math.hypot(x1 - x0, y1 - y0);
    const steps = Math.max(1, Math.ceil(dist / 5));
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      applyToolAtPoint(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, customRadius);
    }
  }

  function isBlockedAt(px, py) {
    const gx = Math.floor(px / CELL);
    const gy = Math.floor(py / CELL);
    const cell = getCell(gx, gy);
    if (cell === DIRT || cell === ROCK || cell === ALGAE || cell === COALS || cell === ICE) {
      return cell;
    }
    for (let i = 0; i < state.gates.length; i++) {
      const g = state.gates[i];
      if (px >= g.x && px <= g.x + g.w && py >= g.y && py <= g.y + g.h) {
        return ROCK;
      }
    }
    return EMPTY;
  }

  function stepPhysics() {
    state.frameTick++;

    state.spouts.forEach(sp => {
      if (sp.active && state.frameTick % 4 === 0 && sp.emitted < sp.maxEmit) {
        state.drops.push({
          x: sp.x + (Math.random() - 0.5) * 4,
          y: sp.y + (Math.random() - 0.5) * 4,
          vx: sp.vx + (Math.random() - 0.5) * 0.25,
          vy: sp.vy,
          type: sp.type
        });
        sp.emitted++;
      }
    });

    state.gates.forEach(g => {
      if (g.isOpen && g.openProgress < 1) {
        g.openProgress = Math.min(1, g.openProgress + 0.05);
        g.x = g.startX + (g.openX - g.startX) * g.openProgress;
        g.y = g.startY + (g.openY - g.startY) * g.openProgress;
      }
    });

    const BUCKET = 14;
    const BW = Math.ceil(CW / BUCKET);
    const BH = Math.ceil(CH / BUCKET);
    const buckets = new Map();

    const activeDrops = state.drops;
    for (let i = 0; i < activeDrops.length; i++) {
      const d = activeDrops[i];
      const bx = Math.max(0, Math.min(BW - 1, Math.floor(d.x / BUCKET)));
      const by = Math.max(0, Math.min(BH - 1, Math.floor(d.y / BUCKET)));
      const key = by * BW + bx;
      let arr = buckets.get(key);
      if (!arr) {
        arr = [];
        buckets.set(key, arr);
      }
      arr.push(i);
    }

    const minDist = 10.5;
    const minDistSq = minDist * minDist;

    for (let i = 0; i < activeDrops.length; i++) {
      const d1 = activeDrops[i];
      const bx = Math.max(0, Math.min(BW - 1, Math.floor(d1.x / BUCKET)));
      const by = Math.max(0, Math.min(BH - 1, Math.floor(d1.y / BUCKET)));

      for (let ny = Math.max(0, by - 1); ny <= Math.min(BH - 1, by + 1); ny++) {
        for (let nx = Math.max(0, bx - 1); nx <= Math.min(BW - 1, bx + 1); nx++) {
          const arr = buckets.get(ny * BW + nx);
          if (!arr) continue;
          for (let k = 0; k < arr.length; k++) {
            const j = arr[k];
            if (j <= i) continue;
            const d2 = activeDrops[j];
            const dx = d2.x - d1.x;
            const dy = d2.y - d1.y;
            const dSq = dx * dx + dy * dy;
            if (dSq > 0.0001 && dSq < minDistSq) {
              const dist = Math.sqrt(dSq);
              const overlap = (minDist - dist) / minDist;
              const nxDir = dx / dist;
              const nyDir = dy / dist;
              const force = overlap * 0.42;

              d1.vx -= nxDir * force;
              d1.vy -= nyDir * force;
              d2.vx += nxDir * force;
              d2.vy += nyDir * force;

              if (
                (d1.type === DROP_OOZE && d2.type === DROP_WATER) ||
                (d2.type === DROP_OOZE && d1.type === DROP_WATER)
              ) {
                d1.type = DROP_OOZE;
                d2.type = DROP_OOZE;
              }
            }
          }
        }
      }
    }

    const survivingDrops = [];
    for (let i = 0; i < activeDrops.length; i++) {
      const d = activeDrops[i];

      if (d.type === DROP_STEAM) {
        d.vy -= 0.18;
        d.vx += (Math.random() - 0.5) * 0.1;
      } else {
        d.vy += 0.25;
      }

      d.vx *= 0.988;
      d.vy *= 0.988;
      const maxSpeed = 5.6;
      const speed = Math.hypot(d.vx, d.vy);
      if (speed > maxSpeed) {
        d.vx = (d.vx / speed) * maxSpeed;
        d.vy = (d.vy / speed) * maxSpeed;
      }

      const nextX = d.x + d.vx;
      const nextY = d.y + d.vy;

      const hitCell = isBlockedAt(nextX, nextY);
      if (hitCell === EMPTY) {
        d.x = nextX;
        d.y = nextY;
      } else {
        const gx = Math.floor(nextX / CELL);
        const gy = Math.floor(nextY / CELL);

        if (hitCell === COALS && d.type !== DROP_STEAM) {
          d.type = DROP_STEAM;
          d.vy = -2.4;
          d.vx = (Math.random() - 0.5) * 1.4;
          state.sparkles.push({
            x: d.x,
            y: d.y,
            vx: (Math.random() - 0.5) * 1.5,
            vy: -1.8,
            color: '#e0f7fa',
            r: 4,
            life: 18
          });
        } else if (hitCell === ICE && d.type === DROP_STEAM) {
          d.type = DROP_WATER;
          d.vy = 1.8;
          d.vx = (Math.random() - 0.5) * 1.2;
          state.sparkles.push({
            x: d.x,
            y: d.y,
            vx: (Math.random() - 0.5) * 1.5,
            vy: 1.5,
            color: '#4fc3f7',
            r: 4,
            life: 18
          });
        } else if (hitCell === ALGAE) {
          if (d.type === DROP_OOZE) {
            for (let ay = gy - 2; ay <= gy + 2; ay++) {
              for (let ax = gx - 2; ax <= gx + 2; ax++) {
                if (getCell(ax, ay) === ALGAE) {
                  setCell(ax, ay, EMPTY);
                }
              }
            }
            state.terrainDirty = true;
            state.sparkles.push({
              x: d.x,
              y: d.y,
              vx: (Math.random() - 0.5) * 2,
              vy: -1.8,
              color: '#ab47bc',
              r: 5,
              life: 22
            });
            continue;
          } else if (d.type === DROP_WATER) {
            const dirs = [
              [0, -1],
              [-1, 0],
              [1, 0],
              [0, 1]
            ];
            for (let m = 0; m < dirs.length; m++) {
              const nx = gx + dirs[m][0];
              const ny = gy + dirs[m][1];
              if (getCell(nx, ny) === EMPTY) {
                setCell(nx, ny, ALGAE);
                state.terrainDirty = true;
                break;
              }
            }
            continue;
          }
        }

        if (isBlockedAt(d.x + d.vx, d.y) === EMPTY) {
          d.x += d.vx;
          d.vy *= -0.2;
        } else if (isBlockedAt(d.x, d.y + d.vy) === EMPTY) {
          d.y += d.vy;
          d.vx *= -0.35;
        }

        if (d.type !== DROP_STEAM) {
          const openDR = isBlockedAt(d.x + 6, d.y + 4) === EMPTY;
          const openDL = isBlockedAt(d.x - 6, d.y + 4) === EMPTY;
          if (openDR && !openDL) {
            d.vx += 0.45;
            d.x += 2.0;
            d.y += 1.5;
          } else if (openDL && !openDR) {
            d.vx -= 0.45;
            d.x -= 2.0;
            d.y += 1.5;
          } else if (openDR && openDL) {
            const dir = d.vx >= 0 ? 1 : -1;
            d.vx += dir * 0.4;
            d.x += dir * 1.8;
            d.y += 1.5;
          } else if (isBlockedAt(d.x, d.y) !== EMPTY && d.y > 20) {
            d.y -= 3;
          }
        } else {
          const openUR = isBlockedAt(d.x + 6, d.y - 4) === EMPTY;
          const openUL = isBlockedAt(d.x - 6, d.y - 4) === EMPTY;
          if (openUR && !openUL) {
            d.vx += 0.45;
            d.x += 2.0;
            d.y -= 1.5;
          } else if (openUL && !openUR) {
            d.vx -= 0.45;
            d.x -= 2.0;
            d.y -= 1.5;
          }
        }
      }

      // Check Trigger Switches
      for (let s = 0; s < state.switches.length; s++) {
        const sw = state.switches[s];
        if (!sw.triggered && Math.hypot(d.x - sw.x, d.y - sw.y) <= sw.r + 7) {
          sw.triggered = true;
          sfx.playSwitchOpen();
          showToast('🔔 ➡️ 🔓');
          state.gates.forEach(g => {
            if (g.id === sw.id) g.isOpen = true;
          });
        }
      }

      // Check Rubber Duck Collection
      if (d.type === DROP_WATER) {
        for (let k = 0; k < state.ducks.length; k++) {
          const duck = state.ducks[k];
          if (!duck.collected && Math.hypot(d.x - duck.x, d.y - duck.y) <= duck.r + 6) {
            duck.dropsAbsorbed++;
            duck.scaleAnim = 1.3;
            if (duck.dropsAbsorbed >= DUCK_REQUIRED_DROPS) {
              duck.collected = true;
              sfx.playDuckQuack();
              showToast('🐤 ✨');
              for (let p = 0; p < 12; p++) {
                state.sparkles.push({
                  x: duck.x,
                  y: duck.y,
                  vx: (Math.random() - 0.5) * 4.5,
                  vy: (Math.random() - 0.5) * 4.5,
                  color: '#ffd54f',
                  r: 5,
                  life: 26
                });
              }
              updateVisualHUD();
            }
          }
        }
      }

      // Check Bathtub Intake Funnel
      if (Math.hypot(d.x - FUNNEL.x, d.y - FUNNEL.y) <= FUNNEL.r) {
        if (d.type === DROP_WATER) {
          state.bathDropsCollected++;
          sfx.playSplash();
          state.sparkles.push({
            x: TUB_CHAMBER.x + 55 + Math.random() * 80,
            y: TUB_CHAMBER.y + 82,
            vx: (Math.random() - 0.5) * 1.5,
            vy: -1.5 - Math.random(),
            color: '#80deea',
            r: 4.5,
            life: 25
          });
          updateVisualHUD();
          if (!state.levelWon && state.bathDropsCollected >= REQUIRED_BATH_DROPS) {
            onLevelComplete();
          }
          continue;
        } else if (d.type === DROP_OOZE) {
          d.vx = -2.2;
          d.vy = -1.5;
          if (state.frameTick % 35 === 0) {
            showToast('☠️ ➡️ ✨');
          }
        }
      }

      if (d.x > 4 && d.x < CW - 4 && d.y > 4 && d.y < CH - 4) {
        survivingDrops.push(d);
      }
    }

    state.drops = survivingDrops;

    for (let i = state.sparkles.length - 1; i >= 0; i--) {
      const sp = state.sparkles[i];
      sp.x += sp.vx;
      sp.y += sp.vy;
      sp.life--;
      if (sp.life <= 0) state.sparkles.splice(i, 1);
    }
  }

  function onLevelComplete() {
    state.levelWon = true;
    sfx.playWinFanfare();

    const lvl = LEVELS[state.currentLevelIdx];
    const earnedDucks = state.ducks.filter(d => d.collected).length;
    const prevBest = state.progressByLevel[lvl.id] || 0;
    state.progressByLevel[lvl.id] = Math.max(prevBest, earnedDucks);
    localStorage.setItem('critter_splash_progress_v1', JSON.stringify(state.progressByLevel));

    renderLevelNav();
    updateVisualHUD();

    document.getElementById('winCritterImg').src = lvl.icon;

    const winDucksDisplay = document.getElementById('winDucksDisplay');
    winDucksDisplay.innerHTML = '';
    for (let i = 0; i < 3; i++) {
      const div = document.createElement('div');
      div.className = 'win-duck-big' + (i < earnedDucks ? ' earned' : '');
      div.textContent = '🐤';
      winDucksDisplay.appendChild(div);
    }

    setTimeout(() => {
      if (state.currentLevelIdx === LEVELS.length - 1) {
        showGrandFinaleModal();
      } else {
        document.getElementById('winModal').classList.remove('hidden');
      }
    }, 650);
  }

  function showGrandFinaleModal() {
    const grid = document.getElementById('finaleCrittersGrid');
    grid.innerHTML = '';
    LEVELS.forEach(lvl => {
      const ducks = state.progressByLevel[lvl.id] ?? 3;
      const card = document.createElement('div');
      card.className = 'finale-critter-tile';
      card.innerHTML = `
        <img src="${lvl.icon}" alt="" />
        <span>${'🐤'.repeat(Math.max(1, ducks))}</span>
      `;
      grid.appendChild(card);
    });
    document.getElementById('finaleModal').classList.remove('hidden');
  }

  function renderScene() {
    if (state.terrainDirty) {
      rebuildTerrainLayer();
    }

    ctx.clearRect(0, 0, CW, CH);
    ctx.drawImage(terrainCanvas, 0, 0);

    // Draw Pure Emoji Overlays (🔥, ❄️, 🌿, ☠️)
    const lvl = LEVELS[state.currentLevelIdx];
    if (lvl.iconsOverlay) {
      lvl.iconsOverlay.forEach(ic => {
        ctx.save();
        ctx.font = '24px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(ic.emoji, ic.x, ic.y);
        ctx.restore();
      });
    }

    // Draw Switches & Gates
    state.switches.forEach(sw => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(sw.x, sw.y, sw.r + 4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(sw.x, sw.y, sw.r, 0, Math.PI * 2);
      ctx.fillStyle = sw.triggered ? '#66bb6a' : sw.color;
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();

      ctx.font = '18px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(sw.triggered ? '🔓' : '🔔', sw.x, sw.y);
      ctx.restore();
    });

    state.gates.forEach(g => {
      ctx.save();
      ctx.fillStyle = g.color;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(g.x, g.y, g.w, g.h, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = 'rgba(0,0,0,0.28)';
      if (g.w > g.h) {
        for (let sx = g.x + 8; sx < g.x + g.w - 6; sx += 16) {
          ctx.fillRect(sx, g.y + 3, 6, g.h - 6);
        }
      } else {
        for (let sy = g.y + 8; sy < g.y + g.h - 6; sy += 16) {
          ctx.fillRect(g.x + 3, sy, g.w - 6, 6);
        }
      }
      ctx.restore();
    });

    // Draw Pressurized Water Spouts / Faucets
    state.spouts.forEach(sp => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(sp.x, sp.y, 18, 0, Math.PI * 2);
      ctx.fillStyle = '#0288d1';
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#b3e5fc';
      ctx.stroke();
      ctx.font = '20px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🚰', sp.x, sp.y);
      ctx.restore();
    });

    // Draw 3 Rubber Ducks (Pure Visual, Zero Text)
    state.ducks.forEach(duck => {
      if (duck.collected) return;
      duck.scaleAnim += (1 - duck.scaleAnim) * 0.15;
      const bobY = Math.sin(state.frameTick * 0.07 + duck.bobOffset) * 3.5;

      ctx.save();
      ctx.translate(duck.x, duck.y + bobY);
      ctx.scale(duck.scaleAnim, duck.scaleAnim);

      ctx.beginPath();
      ctx.arc(0, 0, duck.r + 4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 213, 79, 0.2)';
      ctx.fill();

      const ratio = Math.min(1, duck.dropsAbsorbed / DUCK_REQUIRED_DROPS);
      ctx.beginPath();
      ctx.arc(0, 0, duck.r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * ratio);
      ctx.strokeStyle = '#29b6f6';
      ctx.lineWidth = 4.5;
      ctx.stroke();

      ctx.font = '32px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🐤', 0, 2);
      ctx.restore();
    });

    // Draw Bathtub Chamber & Intake Funnel in Bottom-Right
    drawBathtubChamber();

    // Render Fluid Droplets
    for (let i = 0; i < state.drops.length; i++) {
      const d = state.drops[i];
      ctx.beginPath();
      if (d.type === DROP_WATER) {
        ctx.arc(d.x, d.y, 6.5, 0, Math.PI * 2);
        ctx.fillStyle = '#29b6f6';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(d.x - 1.8, d.y - 1.8, 2.3, 0, Math.PI * 2);
        ctx.fillStyle = '#b3e5fc';
        ctx.fill();
      } else if (d.type === DROP_OOZE) {
        ctx.arc(d.x, d.y, 6.6, 0, Math.PI * 2);
        ctx.fillStyle = '#8e24aa';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(d.x - 1.5, d.y - 1.5, 2.3, 0, Math.PI * 2);
        ctx.fillStyle = '#ea80fc';
        ctx.fill();
      } else if (d.type === DROP_STEAM) {
        ctx.arc(d.x, d.y, 7.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(224, 247, 250, 0.75)';
        ctx.fill();
      }
    }

    // Animated Finger Guide (👆) for Young Kids before first dig
    if (!state.hasDugThisLevel && lvl.hintPaths && lvl.hintPaths.length > 0) {
      drawAnimatedFingerGuide(lvl.hintPaths[0]);
    }

    // Render Sparkles
    for (let i = 0; i < state.sparkles.length; i++) {
      const sp = state.sparkles[i];
      ctx.save();
      ctx.globalAlpha = Math.max(0, sp.life / 25);
      ctx.fillStyle = sp.color;
      ctx.beginPath();
      ctx.arc(sp.x, sp.y, sp.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function drawAnimatedFingerGuide(poly) {
    if (!poly || poly.length < 2) return;
    ctx.save();

    // Soft glowing dotted trail along the first 2 segments
    ctx.strokeStyle = 'rgba(255, 213, 79, 0.45)';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.setLineDash([10, 12]);
    ctx.beginPath();
    ctx.moveTo(poly[0][0], poly[0][1]);
    const maxIdx = Math.min(poly.length - 1, 2);
    for (let i = 1; i <= maxIdx; i++) {
      ctx.lineTo(poly[i][0], poly[i][1]);
    }
    ctx.stroke();

    // Animated moving finger 👆 along the first segment
    const t = ((state.frameTick * 0.015) % 1);
    const x0 = poly[0][0];
    const y0 = poly[0][1];
    const x1 = poly[1][0];
    const y1 = poly[1][1];
    const fx = x0 + (x1 - x0) * t;
    const fy = y0 + (y1 - y0) * t;

    ctx.font = '34px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('👆', fx, fy + 12);
    ctx.restore();
  }

  function drawBathtubChamber() {
    const lvl = LEVELS[state.currentLevelIdx];
    const fillRatio = Math.min(1, state.bathDropsCollected / REQUIRED_BATH_DROPS);

    ctx.save();

    ctx.fillStyle = 'rgba(16, 46, 74, 0.92)';
    ctx.strokeStyle = '#4fc3f7';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(TUB_CHAMBER.x, TUB_CHAMBER.y, TUB_CHAMBER.w, TUB_CHAMBER.h, 18);
    ctx.fill();
    ctx.stroke();

    // Pipe connecting Intake Funnel to Bathtub Showerhead
    ctx.strokeStyle = '#90a4ae';
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(FUNNEL.x, FUNNEL.y);
    ctx.lineTo(TUB_CHAMBER.x + 26, FUNNEL.y);
    ctx.lineTo(TUB_CHAMBER.x + 26, TUB_CHAMBER.y + 24);
    ctx.lineTo(TUB_CHAMBER.x + 94, TUB_CHAMBER.y + 24);
    ctx.stroke();

    // Intake Funnel Mouth
    ctx.fillStyle = '#ffca28';
    ctx.strokeStyle = '#fff8e1';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(FUNNEL.x - 24, FUNNEL.y - 18);
    ctx.lineTo(FUNNEL.x + 24, FUNNEL.y - 18);
    ctx.lineTo(FUNNEL.x + 11, FUNNEL.y + 13);
    ctx.lineTo(FUNNEL.x - 11, FUNNEL.y + 13);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Bouncing Visual Arrow above Funnel (Zero Text)
    const bounce = Math.sin(state.frameTick * 0.1) * 4;
    ctx.font = '22px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('⬇️', FUNNEL.x, FUNNEL.y - 28 + bounce);

    // Critter Avatar sitting inside the Bathtub
    const avatarX = TUB_CHAMBER.x + 96;
    const avatarY = TUB_CHAMBER.y + 74 + Math.sin(state.frameTick * 0.08) * 2.5;
    const img = critterImages[lvl.id];
    if (img && img.complete) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(avatarX, avatarY, 34, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(img, avatarX - 34, avatarY - 34, 68, 68);
      ctx.restore();

      ctx.beginPath();
      ctx.arc(avatarX, avatarY, 34, 0, Math.PI * 2);
      ctx.strokeStyle = fillRatio >= 1 ? '#ffd54f' : '#81d4fa';
      ctx.lineWidth = 3.5;
      ctx.stroke();
    }

    // Clawfoot Bathtub Lower Basin
    const tubX = TUB_CHAMBER.x + 20;
    const tubY = TUB_CHAMBER.y + 84;
    const tubW = 146;
    const tubH = 50;

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(tubX, tubY, tubW, tubH, [6, 6, 24, 24]);
    ctx.clip();

    ctx.fillStyle = 'rgba(225, 245, 254, 0.22)';
    ctx.fillRect(tubX, tubY, tubW, tubH);

    const waterH = Math.max(6, tubH * fillRatio);
    ctx.fillStyle = 'rgba(41, 182, 246, 0.85)';
    ctx.fillRect(tubX, tubY + tubH - waterH, tubW, waterH);

    if (fillRatio > 0.06) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      for (let bx = tubX + 10; bx < tubX + tubW - 8; bx += 14) {
        const by = tubY + tubH - waterH + Math.sin(state.frameTick * 0.08 + bx) * 2;
        ctx.beginPath();
        ctx.arc(bx, by, 7, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.roundRect(tubX, tubY, tubW, tubH, [6, 6, 24, 24]);
    ctx.stroke();

    // Pure Emoji Icon on Tub Front
    ctx.font = '20px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(fillRatio >= 1 ? '🥰🫧' : '🛁', tubX + tubW * 0.5, tubY + tubH * 0.65);

    ctx.restore();
  }

  function autoCarveHintSolution() {
    const lvl = LEVELS[state.currentLevelIdx];
    if (!lvl.hintPaths) return;

    const prevTool = state.activeTool;
    state.activeTool = 'dig';
    state.hasDugThisLevel = true;

    for (let gy = 2; gy < GH - 2; gy++) {
      for (let gx = 2; gx < GW - 2; gx++) {
        if (getCell(gx, gy) === ALGAE) {
          setCell(gx, gy, EMPTY);
        }
      }
    }

    lvl.hintPaths.forEach(poly => {
      for (let i = 0; i < poly.length - 1; i++) {
        const [x0, y0] = poly[i];
        const [x1, y1] = poly[i + 1];
        applyToolSegment(x0, y0, x1, y1, 28);
      }
    });

    state.activeTool = prevTool;
    state.terrainDirty = true;

    addBonusCleanWater(40);
    showToast('💡 ✨ 💧');
  }

  function addBonusCleanWater(amount = 45) {
    const lvl = LEVELS[state.currentLevelIdx];
    const spawnX = lvl.id === 6 ? 120 : 145;
    const spawnY = lvl.id === 6 ? 180 : 62;
    builderApi.carveCircle(spawnX, spawnY, 26, EMPTY, false);
    builderApi.spawnPool(spawnX - 35, spawnY - 14, 70, 28, DROP_WATER, amount);
    state.terrainDirty = true;
    sfx.playSplash();
    showToast('🌧️ 💧');
  }

  function updateVisualHUD() {
    const lvl = LEVELS[state.currentLevelIdx];
    sideCritterImg.src = lvl.icon;

    const earnedDucks = state.ducks.filter(d => d.collected).length;
    for (let i = 0; i < 3; i++) {
      const slot = document.getElementById(`duckSlot${i}`);
      if (slot) {
        slot.classList.toggle('collected', i < earnedDucks);
      }
    }

    const pct = Math.min(100, Math.round((state.bathDropsCollected / REQUIRED_BATH_DROPS) * 100));
    bathProgressBar.style.width = `${pct}%`;

    if (pct >= 100) {
      critterMoodBadge.textContent = '🥰';
    } else if (pct > 0) {
      critterMoodBadge.textContent = '🫧';
    } else {
      critterMoodBadge.textContent = '🧼';
    }
  }

  function renderLevelNav() {
    levelNavBar.innerHTML = '';
    LEVELS.forEach((lvl, idx) => {
      const btn = document.createElement('button');
      const earned = state.progressByLevel[lvl.id] || 0;
      btn.className =
        'level-pill' +
        (idx === state.currentLevelIdx ? ' active' : '') +
        (earned > 0 ? ' completed' : '');
      btn.innerHTML = `
        <img src="${lvl.icon}" alt="" />
        ${earned > 0 ? `<span class="pill-ducks">${'🐤'.repeat(earned)}</span>` : ''}
      `;
      btn.addEventListener('click', () => loadLevel(idx));
      levelNavBar.appendChild(btn);
    });
  }

  function getCanvasCoords(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: ((clientX - rect.left) / rect.width) * CW,
      y: ((clientY - rect.top) / rect.height) * CH
    };
  }

  canvas.addEventListener('pointerdown', e => {
    e.preventDefault();
    state.isPointerDown = true;
    const pt = getCanvasCoords(e);
    state.lastPointer = pt;
    applyToolAtPoint(pt.x, pt.y);
  });

  window.addEventListener('pointermove', e => {
    if (!state.isPointerDown) return;
    const pt = getCanvasCoords(e);
    if (state.lastPointer) {
      applyToolSegment(state.lastPointer.x, state.lastPointer.y, pt.x, pt.y);
    } else {
      applyToolAtPoint(pt.x, pt.y);
    }
    state.lastPointer = pt;
  });

  window.addEventListener('pointerup', () => {
    state.isPointerDown = false;
    state.lastPointer = null;
  });

  document.querySelectorAll('.toy-btn[data-tool]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.toy-btn[data-tool]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.activeTool = btn.dataset.tool;
      const icons = { dig: '⛏️', fill: '🧱', purify: '✨' };
      showToast(icons[state.activeTool] || '⛏️');
    });
  });

  document.getElementById('btnAddWater').addEventListener('click', () => {
    addBonusCleanWater(45);
  });

  document.getElementById('btnAutoHint').addEventListener('click', () => {
    autoCarveHintSolution();
  });

  document.getElementById('btnResetLevel').addEventListener('click', () => {
    loadLevel(state.currentLevelIdx);
    showToast('🔄');
  });

  document.getElementById('btnWinReplay').addEventListener('click', () => {
    loadLevel(state.currentLevelIdx);
  });

  document.getElementById('btnWinNext').addEventListener('click', () => {
    loadLevel(state.currentLevelIdx + 1);
  });

  document.getElementById('btnFinaleClose').addEventListener('click', () => {
    document.getElementById('finaleModal').classList.add('hidden');
  });

  const btnSoundToggle = document.getElementById('btnSoundToggle');
  btnSoundToggle.addEventListener('click', () => {
    sfx.enabled = !sfx.enabled;
    btnSoundToggle.textContent = sfx.enabled ? '🔊' : '🔇';
  });

  function loop() {
    stepPhysics();
    stepPhysics();
    renderScene();
    requestAnimationFrame(loop);
  }

  window.__CRITTER_SPLASH__ = {
    state,
    loadLevel,
    autoCarveHintSolution,
    addBonusCleanWater
  };

  loadLevel(0);
  requestAnimationFrame(loop);
})();
