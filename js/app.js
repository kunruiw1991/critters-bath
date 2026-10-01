/**
 * 萌宠爱洗澡 · Critter Splash! (Where's My Water? — Smiling Critters Edition)
 * High-DPI HTML5 Canvas Diggable Terrain & Multi-Phase Fluid Physics Engine
 */

(() => {
  'use strict';

  // Canvas & Terrain Grid Constants
  const CW = 760;
  const CH = 520;
  const CELL = 4;
  const GW = Math.floor(CW / CELL); // 190
  const GH = Math.floor(CH / CELL); // 130

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

  const REQUIRED_BATH_DROPS = 25;
  const DUCK_REQUIRED_DROPS = 5;

  // Bathtub Chamber & Funnel Geometry (Bottom-Right Corner)
  const FUNNEL = {
    x: 535,
    y: 412,
    r: 44
  };
  const TUB_CHAMBER = {
    x: 565,
    y: 362,
    w: 175,
    h: 142
  };

  // 8 Handcrafted Smiling Critters Levels
  const LEVELS = [
    {
      id: 1,
      name: '日犬 DogDay',
      enName: 'DogDay',
      icon: 'icons/dogday.jpg',
      scent: '☀️ 阳光香草浴',
      themeColor: '#ffb300',
      title: '阳光初浴 · S型引水渠',
      quote: '“身上沾满泥巴啦！按住鼠标在棕色泥土上拖动，顺着岩石斜坡挖出S型水道，收集3只小黄鸭再流进右下角浴缸吧！”',
      winQuote: '“汪呜～暖洋洋的阳光香草泡泡浴太舒服啦！谢谢你帮我引来清澈的泉水！”',
      tip: '第1关秘籍：从左上角水池往下挖，顺着两层灰色石板斜坡引导水流，经过 3 只小黄鸭流进右下角 🚿 浴缸漏斗！',
      labels: [],
      setup(api) {
        api.fillDirtRect(24, 24, 712, 472);
        // Carve top-left water reservoir
        api.carveRoundedRect(65, 36, 165, 62, 20);
        // Slanted rock shelves for S-curve
        api.drawRockLine(45, 165, 455, 205, 16);
        api.drawRockLine(710, 290, 245, 335, 16);
        // Carve air pockets around ducks so player sees targets clearly
        api.carveCircle(285, 135, 26);
        api.carveCircle(555, 225, 26);
        api.carveCircle(165, 355, 26);
        // Spawn clean water
        api.spawnPool(78, 44, 140, 46, DROP_WATER, 100);
        // 3 Ducks
        api.addDuck(285, 135);
        api.addDuck(555, 225);
        api.addDuck(165, 355);
      },
      hintPaths: [
        [[150, 92], [285, 135], [490, 185], [555, 225], [480, 275], [215, 318], [165, 355], [350, 395], [535, 412]]
      ]
    },
    {
      id: 2,
      name: '跳跳兔 Hoppy',
      enName: 'Hoppy Hopscotch',
      icon: 'icons/hoppy.jpg',
      scent: '🌿 薄荷柠檬浴',
      themeColor: '#43a047',
      title: '双泉汇流 · 岩石V型谷',
      quote: '“刚跳完泥坑运动会！上面左右有两个清水池，把它们都挖通汇合到中间漏斗，就能装满我的运动活力浴缸啦！”',
      winQuote: '“耶！薄荷柠檬浴冰爽又提神，我现在能一口气再跳三百下！”',
      tip: '第2关秘籍：分别挖开左上和右上两个清水池，让两股水流穿过小黄鸭，在中央石槽汇合后导入右下角浴缸！',
      labels: [],
      setup(api) {
        api.fillDirtRect(24, 24, 712, 472);
        // Left & Right reservoirs
        api.carveRoundedRect(65, 36, 145, 60, 18);
        api.carveRoundedRect(425, 36, 145, 60, 18);
        // Rock V-chutes
        api.drawRockLine(55, 185, 265, 255, 16);
        api.drawRockLine(610, 185, 395, 255, 16);
        api.drawRockLine(225, 345, 480, 395, 16);
        // Air pockets for ducks
        api.carveCircle(155, 148, 25);
        api.carveCircle(485, 148, 25);
        api.carveCircle(330, 295, 26);
        // Pools
        api.spawnPool(75, 44, 125, 44, DROP_WATER, 58);
        api.spawnPool(435, 44, 125, 44, DROP_WATER, 58);
        // Ducks
        api.addDuck(155, 148);
        api.addDuck(485, 148);
        api.addDuck(330, 295);
      },
      hintPaths: [
        [[135, 90], [155, 148], [295, 235], [330, 295]],
        [[495, 90], [485, 148], [365, 235], [330, 295], [505, 375], [535, 412]]
      ]
    },
    {
      id: 3,
      name: '抱抱熊 Bobby',
      enName: 'Bobby BearHug',
      icon: 'icons/bobby.jpg',
      scent: '🌹 玫瑰花瓣浴',
      themeColor: '#e53935',
      title: '爱心机关 · 开启红色闸门',
      quote: '“通往浴缸的隧道被红色铁闸门挡住啦！先引水去触碰左边的 🔴 红色铃铛开关，闸门就会自动升起哦！”',
      winQuote: '“好香的玫瑰花瓣泡泡！给你一个大大的香喷喷熊抱～”',
      tip: '第3关秘籍：先挖水冲击左侧 🔴 红色开关打开右下方的红色闸门，再把水引向右下角浴缸漏斗！',
      labels: [{ x: 155, y: 185, text: '🔴 触发开关', color: '#ff8a80' }],
      setup(api) {
        api.fillDirtRect(24, 24, 712, 472);
        api.carveRoundedRect(70, 36, 165, 62, 20);
        // Rock dividers
        api.drawRockLine(50, 255, 285, 295, 16);
        api.drawRockLine(430, 225, 430, 330, 18);
        api.drawRockLine(430, 445, 430, 490, 18);
        // Switch chamber & duck pockets
        api.carveCircle(155, 215, 28);
        api.carveCircle(295, 155, 25);
        api.carveCircle(355, 355, 26);
        api.carveCircle(485, 395, 26);
        // Switch & Gate
        api.addSwitch('red', '#ff5252', 155, 215);
        api.addGate('red', '#ff5252', 420, 330, 22, 115, 420, 225);
        // Water & Ducks
        api.spawnPool(80, 44, 145, 46, DROP_WATER, 105);
        api.addDuck(295, 155);
        api.addDuck(355, 355);
        api.addDuck(485, 395);
      },
      hintPaths: [
        [[135, 92], [155, 215], [305, 268], [355, 355]],
        [[185, 92], [295, 155], [355, 355], [435, 385], [485, 395], [535, 412]]
      ]
    },
    {
      id: 4,
      name: '贪吃猪 PickyPiggy',
      enName: 'PickyPiggy',
      icon: 'icons/picky.jpg',
      scent: '🍑 蜜桃果冻浴',
      themeColor: '#ec407a',
      title: '排毒引清 · 避开噩梦毒水',
      quote: '“哎呀！地底下有一滩紫色的 🧪 噩梦毒水！千万别让毒水混进我的蜜桃浴缸，快从右边绕开它或者用『✨净水除苔』净化它！”',
      winQuote: '“哼哼～粉嫩嫩的蜜桃果冻泡泡浴，闻起来像刚出炉的水蜜桃派一样甜！”',
      tip: '第4关秘籍：沿着右侧泥土挖出一条干净通道绕开左侧的紫色毒水池（或者用「✨净水除苔」直接把毒水变成清水）！',
      labels: [{ x: 145, y: 205, text: '🧪 噩梦毒水池', color: '#ea80fc' }],
      setup(api) {
        api.fillDirtRect(24, 24, 712, 472);
        // Clean pool top
        api.carveRoundedRect(80, 36, 165, 62, 20);
        // Toxic Ooze pocket on middle-left with rock basin
        api.carveRoundedRect(85, 220, 125, 54, 16);
        api.drawRockLine(75, 282, 225, 282, 16);
        api.drawRockLine(225, 210, 225, 282, 16);
        // Left bottom drain pocket for toxic ooze
        api.carveRoundedRect(35, 385, 150, 85, 18);
        api.drawRockLine(195, 370, 195, 485, 16);
        // Duck pockets on the safe right route
        api.carveCircle(320, 140, 26);
        api.carveCircle(435, 240, 26);
        api.carveCircle(480, 355, 26);
        // Spawn fluids
        api.spawnPool(90, 44, 145, 46, DROP_WATER, 105);
        api.spawnPool(95, 228, 105, 38, DROP_OOZE, 26);
        // Ducks
        api.addDuck(320, 140);
        api.addDuck(435, 240);
        api.addDuck(480, 355);
      },
      hintPaths: [
        [[215, 88], [320, 140], [435, 240], [480, 355], [535, 412]]
      ]
    },
    {
      id: 5,
      name: '聪聪象 Bubba',
      enName: 'Bubba Bubbaphant',
      icon: 'icons/bubba.jpg',
      scent: '🌊 海盐薄荷浴',
      themeColor: '#29b6f6',
      title: '以毒攻藻 · 酸液蚀穿绿藻',
      quote: '“根据化学原理：清水遇到 🌿 绿藻会让绿藻疯长堵路，但 🧪 紫色毒水能把绿藻彻底腐蚀溶解！先放毒水烧穿绿藻，再放清水吧！”',
      winQuote: '“太精彩的流体力学实验了！海盐薄荷浴让我的大脑更加清醒啦！”',
      tip: '第5关秘籍：先挖通右上角 🧪 毒水池，让毒水腐蚀掉中间的 🌿 绿藻并流进左下角废液坑；路通后再挖开左上角 💧 清水池！',
      labels: [
        { x: 475, y: 30, text: '🧪 蚀藻毒水', color: '#ea80fc' },
        { x: 390, y: 192, text: '🌿 吸水绿藻', color: '#81c784' }
      ],
      setup(api) {
        api.fillDirtRect(24, 24, 712, 472);
        // Top-left Clean Pool
        api.carveRoundedRect(65, 36, 155, 60, 18);
        // Top-right Toxic Ooze Pool
        api.carveRoundedRect(410, 36, 130, 52, 16);
        // Central funnel walls with Green Algae plug
        api.drawRockLine(260, 160, 345, 235, 16);
        api.drawRockLine(520, 160, 435, 235, 16);
        // Carve channel and place Algae blockade
        api.carveRoundedRect(345, 195, 90, 48, 12);
        api.fillCellTypeRect(352, 208, 76, 24, ALGAE);
        // Bottom-left waste trap for leftover ooze
        api.carveRoundedRect(85, 385, 165, 85, 18);
        api.drawRockLine(265, 360, 265, 485, 16);
        // Ducks
        api.carveCircle(215, 150, 25);
        api.carveCircle(390, 295, 25);
        api.carveCircle(485, 375, 25);
        api.addDuck(215, 150);
        api.addDuck(390, 295);
        api.addDuck(485, 375);
        // Fluids
        api.spawnPool(75, 44, 135, 44, DROP_WATER, 105);
        api.spawnPool(420, 42, 110, 38, DROP_OOZE, 30);
      },
      hintPaths: [
        [[155, 88], [215, 150], [360, 190], [390, 225], [390, 295], [485, 375], [535, 412]]
      ]
    },
    {
      id: 6,
      name: '独角兽 CraftyCorn',
      enName: 'CraftyCorn',
      icon: 'icons/craftycorn.jpg',
      scent: '🌈 彩虹云朵浴',
      themeColor: '#ab47bc',
      title: '蒸汽升空 · 冰火冷凝魔法',
      quote: '“中间有高耸的岩石墙挡路！让水滴落到左下角的 🔥 炙热炭火上化作 💨 水蒸气飘过墙头，碰到顶棚的 ❄️ 寒冰就会重新化作彩虹雨落下啦！”',
      winQuote: '“哇！从云端落下的彩虹温泉雨太浪漫啦，我的灵感源源不断！”',
      tip: '第6关秘籍：把左上方的水往下挖到 🔥 红炭火上变成 💨 蒸汽升空，再挖通上方通道让蒸汽接触右侧顶棚的 ❄️ 寒冰凝结回水滴！',
      labels: [
        { x: 165, y: 462, text: '🔥 炙热炭火 (蒸发成蒸汽)', color: '#ff8a65' },
        { x: 445, y: 72, text: '❄️ 寒冰顶棚 (凝结成清水)', color: '#80deea' }
      ],
      setup(api) {
        api.fillDirtRect(24, 24, 712, 472);
        // Mid-left clean water reservoir (isolated from steam shaft by solid dirt wall!)
        api.carveRoundedRect(55, 150, 120, 62, 18);
        // Tall central rock barrier separating left & right halves
        api.drawRockLine(295, 145, 295, 490, 18);
        // Rising steam shaft on the right side of left chamber (x: 215..275)
        api.carveRoundedRect(215, 48, 62, 330, 18);
        // Bottom-left Hot Coals boiler chamber
        api.carveRoundedRect(75, 355, 202, 78, 18);
        api.fillCellTypeRect(85, 422, 180, 18, COALS);
        api.drawRockLine(65, 444, 280, 444, 14);
        // Top ceiling Ice Condenser chamber on the right
        api.carveRoundedRect(340, 42, 215, 76, 20);
        api.fillCellTypeRect(355, 30, 185, 20, ICE);
        // Ducks
        api.carveCircle(115, 275, 25);
        api.carveCircle(246, 95, 25);
        api.carveCircle(450, 245, 26);
        api.addDuck(115, 275);
        api.addDuck(246, 95);
        api.addDuck(450, 245);
        // Spawn clean water
        api.spawnPool(65, 160, 100, 44, DROP_WATER, 105);
      },
      hintPaths: [
        [[115, 202], [115, 275], [125, 385]],
        [[246, 75], [385, 72]],
        [[445, 105], [450, 245], [500, 355], [535, 412]]
      ]
    },
    {
      id: 7,
      name: '酷酷鸡 KickinChicken',
      enName: 'KickinChicken',
      icon: 'icons/kickin.jpg',
      scent: '🍋 酷爽柑橘浴',
      themeColor: '#fdd835',
      title: '高压水龙头 · 双重闸门冲浪',
      quote: '“看到上方的 🚰 高压水龙头了吗？它能持续喷出冲浪泉水！依次冲击 🔵 蓝开关和 🟢 绿开关，一路帅气冲进浴缸吧！”',
      winQuote: '“酷毙了老铁！这柑橘冲浪浴够劲，我的羽毛都闪闪发光啦！”',
      tip: '第7关秘籍：上方水池 + 🚰 高压水龙头源源不断供水！先引水碰左中部的 🔵 蓝开关，再顺着斜坡碰 🟢 绿开关，直达浴缸！',
      labels: [{ x: 375, y: 42, text: '🚰 高压水龙头', color: '#80deea' }],
      setup(api) {
        api.fillDirtRect(24, 24, 712, 472);
        api.carveRoundedRect(65, 36, 160, 60, 18);
        api.carveCircle(375, 72, 30);
        // Rock ramps
        api.drawRockLine(55, 215, 265, 255, 16);
        api.drawRockLine(565, 195, 355, 255, 16);
        api.drawRockLine(210, 350, 430, 395, 16);
        // Switches & Gates
        api.carveCircle(210, 200, 26);
        api.carveCircle(415, 210, 26);
        api.addSwitch('blue', '#29b6f6', 210, 200);
        api.addSwitch('green', '#66bb6a', 415, 210);
        api.addGate('blue', '#29b6f6', 285, 260, 110, 20, 165, 260);
        api.addGate('green', '#66bb6a', 455, 335, 22, 115, 455, 225);
        // Continuous Faucet Spout
        api.addSpout(375, 72, 0.45, 1.35, DROP_WATER);
        // Ducks
        api.carveCircle(155, 140, 24);
        api.carveCircle(335, 315, 25);
        api.carveCircle(495, 390, 25);
        api.addDuck(155, 140);
        api.addDuck(335, 315);
        api.addDuck(495, 390);
        // Pool
        api.spawnPool(75, 44, 140, 44, DROP_WATER, 90);
      },
      hintPaths: [
        [[145, 88], [155, 140], [210, 200], [335, 260], [335, 315]],
        [[375, 88], [415, 210], [335, 260], [335, 315], [445, 382], [495, 390], [535, 412]]
      ]
    },
    {
      id: 8,
      name: '瞌睡猫 CatNap',
      enName: 'CatNap',
      icon: 'icons/catnap.jpg',
      scent: '💜 薰衣草月光温泉',
      themeColor: '#7e57c2',
      title: '月光温泉 · 终极泡泡盛典',
      quote: '“呼噜噜……睡前最喜欢泡一壶温暖的薰衣草月光浴了。烧穿绿藻、打开紫色月光闸门，帮我把温泉水引过来好吗？”',
      winQuote: '“呼噜噜……暖呼呼的薰衣草泡泡浴，今晚全员都能做一个甜美的香香好梦啦……🌙✨”',
      tip: '第8关终极秘籍：既可以用右上角 🧪 毒水烧穿中间 🌿 绿藻（或用 ✨ 净水铲），再引左上角清水触发 🟣 紫色开关，开启月光温泉！',
      labels: [
        { x: 185, y: 168, text: '🟣 月光开关', color: '#ce93d8' },
        { x: 402, y: 158, text: '🌿 绿藻封路', color: '#81c784' }
      ],
      setup(api) {
        api.fillDirtRect(24, 24, 712, 472);
        // Top-left Clean Pool + Faucet
        api.carveRoundedRect(65, 36, 165, 60, 18);
        api.addSpout(115, 56, 0.35, 1.25, DROP_WATER);
        // Top-right Ooze pocket above Algae
        api.carveRoundedRect(370, 36, 120, 50, 16);
        // Algae barrier in middle-right chute
        api.carveRoundedRect(355, 160, 95, 44, 12);
        api.fillCellTypeRect(362, 170, 80, 22, ALGAE);
        // Rock channels
        api.drawRockLine(55, 220, 260, 260, 16);
        api.drawRockLine(245, 350, 435, 395, 16);
        // Purple switch & gate
        api.carveCircle(185, 195, 26);
        api.addSwitch('purple', '#ab47bc', 185, 195);
        api.addGate('purple', '#ab47bc', 455, 335, 22, 115, 455, 225);
        // Ducks
        api.carveCircle(165, 130, 24);
        api.carveCircle(340, 298, 25);
        api.carveCircle(495, 390, 25);
        api.addDuck(165, 130);
        api.addDuck(340, 298);
        api.addDuck(495, 390);
        // Pools
        api.spawnPool(75, 44, 145, 44, DROP_WATER, 95);
        api.spawnPool(380, 42, 100, 36, DROP_OOZE, 26);
      },
      hintPaths: [
        [[155, 88], [165, 130], [185, 195], [340, 298], [440, 380], [495, 390], [535, 412]]
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
  const headerCritterIcon = document.getElementById('headerCritterIcon');
  const sideCritterImg = document.getElementById('sideCritterImg');
  const critterMoodBadge = document.getElementById('critterMoodBadge');
  const sideLevelBadge = document.getElementById('sideLevelBadge');
  const sideScentBadge = document.getElementById('sideScentBadge');
  const sideCritterName = document.getElementById('sideCritterName');
  const sideLevelTitle = document.getElementById('sideLevelTitle');
  const critterSpeechBubble = document.getElementById('critterSpeechBubble');
  const duckCountText = document.getElementById('duckCountText');
  const bathProgressText = document.getElementById('bathProgressText');
  const bathProgressBar = document.getElementById('bathProgressBar');
  const statCleanDrops = document.getElementById('statCleanDrops');
  const statOozeDrops = document.getElementById('statOozeDrops');
  const statSteamDrops = document.getElementById('statSteamDrops');
  const statTotalDucks = document.getElementById('statTotalDucks');
  const levelTipText = document.getElementById('levelTipText');
  const floatingToast = document.getElementById('floatingToast');

  let toastTimer = null;
  function showToast(msg, duration = 2300) {
    floatingToast.textContent = msg;
    floatingToast.classList.remove('hidden');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      floatingToast.classList.add('hidden');
    }, duration);
  }

  // Terrain Grid Helpers
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
        r: 23,
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
        r: 18,
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
        maxEmit: 85
      });
    }
  };

  // Load a Specific Level
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

    state.grid.fill(ROCK);
    for (let gy = 2; gy < GH - 2; gy++) {
      for (let gx = 2; gx < GW - 2; gx++) {
        setCell(gx, gy, EMPTY);
      }
    }

    lvl.setup(builderApi);

    // Always carve Bathtub Chamber & Intake Funnel in Bottom-Right
    builderApi.carveRoundedRect(
      TUB_CHAMBER.x - 8,
      TUB_CHAMBER.y - 6,
      TUB_CHAMBER.w + 10,
      TUB_CHAMBER.h + 8,
      18
    );
    builderApi.carveCircle(FUNNEL.x, FUNNEL.y, FUNNEL.r + 14, EMPTY, true);

    state.terrainDirty = true;
    updateSidebarUI();
    renderLevelNav();
    document.getElementById('winModal').classList.add('hidden');
  }

  // Render Offscreen Terrain Texture when Dirty
  function rebuildTerrainLayer() {
    tCtx.clearRect(0, 0, CW, CH);

    const bgGrad = tCtx.createLinearGradient(0, 0, 0, CH);
    bgGrad.addColorStop(0, '#102840');
    bgGrad.addColorStop(1, '#091929');
    tCtx.fillStyle = bgGrad;
    tCtx.fillRect(0, 0, CW, CH);

    // Subtle tile grid lines in carved areas
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
            tCtx.fillStyle = '#c88746';
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

  // Carve / Fill / Purify Along Pointer Segment
  function applyToolAtPoint(px, py, customRadius = null) {
    if (px > TUB_CHAMBER.x - 10 && py > TUB_CHAMBER.y - 10) {
      return;
    }

    if (state.activeTool === 'dig') {
      const radius = customRadius || 24;
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
        state.terrainDirty = true;
        sfx.playDig();
        for (let i = 0; i < 2; i++) {
          state.sparkles.push({
            x: px + (Math.random() - 0.5) * 18,
            y: py + (Math.random() - 0.5) * 18,
            vx: (Math.random() - 0.5) * 2.5,
            vy: -Math.random() * 2.2,
            color: '#d7995b',
            r: 3,
            life: 16
          });
        }
      }
    } else if (state.activeTool === 'fill') {
      const radius = 16;
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
      const radius = 36;
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
          r: 4,
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

  // Check if a point is blocked by terrain or closed gate
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

  // Fluid Physics & Element Interaction Step
  function stepPhysics() {
    state.frameTick++;

    // 1. Emit from active spouts
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

    // 2. Animate Gates
    state.gates.forEach(g => {
      if (g.isOpen && g.openProgress < 1) {
        g.openProgress = Math.min(1, g.openProgress + 0.05);
        g.x = g.startX + (g.openX - g.startX) * g.openProgress;
        g.y = g.startY + (g.openY - g.startY) * g.openProgress;
      }
    });

    // 3. Spatial Hash Grid for Fast Liquid Repulsion & Ooze Contamination
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

    // 4. Update Each Droplet Position, Slope Sliding, Phase Change & Goals
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

        // Smooth Sliding along Horizontal, Vertical & Diagonal Slopes!
        if (isBlockedAt(d.x + d.vx, d.y) === EMPTY) {
          d.x += d.vx;
          d.vy *= -0.2;
        } else if (isBlockedAt(d.x, d.y + d.vy) === EMPTY) {
          d.y += d.vy;
          d.vx *= -0.35;
        }

        // Downhill diagonal step probing for liquid (or uphill for steam)
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
          // Rising steam diagonal ceiling slide
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
          showToast('🔔 机关触发！彩色闸门已开启！');
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
            duck.scaleAnim = 1.25;
            if (duck.dropsAbsorbed >= DUCK_REQUIRED_DROPS) {
              duck.collected = true;
              sfx.playDuckQuack();
              showToast('🐤 收集到 1 只萌宠小黄鸭！');
              for (let p = 0; p < 10; p++) {
                state.sparkles.push({
                  x: duck.x,
                  y: duck.y,
                  vx: (Math.random() - 0.5) * 4,
                  vy: (Math.random() - 0.5) * 4,
                  color: '#ffd54f',
                  r: 4.5,
                  life: 26
                });
              }
              updateSidebarUI();
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
            x: TUB_CHAMBER.x + 55 + Math.random() * 75,
            y: TUB_CHAMBER.y + 78,
            vx: (Math.random() - 0.5) * 1.5,
            vy: -1.5 - Math.random(),
            color: '#80deea',
            r: 4,
            life: 25
          });
          updateSidebarUI();
          if (!state.levelWon && state.bathDropsCollected >= REQUIRED_BATH_DROPS) {
            onLevelComplete();
          }
          continue;
        } else if (d.type === DROP_OOZE) {
          d.vx = -2.2;
          d.vy = -1.5;
          if (state.frameTick % 30 === 0) {
            showToast('⚠️ 浴缸滤网拦截了噩梦毒水！请用「✨净水除苔」净化它！');
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

    if (state.frameTick % 12 === 0) {
      updateWaterCounters();
    }
  }

  // Handle Level Completion & Persistence
  function onLevelComplete() {
    state.levelWon = true;
    sfx.playWinFanfare();

    const lvl = LEVELS[state.currentLevelIdx];
    const earnedDucks = state.ducks.filter(d => d.collected).length;
    const prevBest = state.progressByLevel[lvl.id] || 0;
    state.progressByLevel[lvl.id] = Math.max(prevBest, earnedDucks);
    localStorage.setItem('critter_splash_progress_v1', JSON.stringify(state.progressByLevel));

    renderLevelNav();
    updateSidebarUI();

    document.getElementById('winCritterImg').src = lvl.icon;
    document.getElementById('winTitleText').textContent = `${lvl.name} 洗好泡泡澡啦！`;
    document.getElementById('winQuoteText').textContent = lvl.winQuote;
    document.getElementById('winDuckScore').textContent = `${earnedDucks} / 3 只`;

    const winDucksDisplay = document.getElementById('winDucksDisplay');
    winDucksDisplay.innerHTML = '';
    for (let i = 0; i < 3; i++) {
      const div = document.createElement('div');
      div.className = 'win-duck-item' + (i < earnedDucks ? ' earned' : '');
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
        <img src="${lvl.icon}" alt="${lvl.name}" />
        <strong>${lvl.name}</strong>
        <span>${'🐤'.repeat(Math.max(1, ducks))} 香喷喷</span>
      `;
      grid.appendChild(card);
    });
    document.getElementById('finaleModal').classList.remove('hidden');
  }

  // Render Complete Scene onto Main Canvas
  function renderScene() {
    if (state.terrainDirty) {
      rebuildTerrainLayer();
    }

    ctx.clearRect(0, 0, CW, CH);
    ctx.drawImage(terrainCanvas, 0, 0);

    // Draw Level Callout Labels (Coals, Ice, Algae, Switches)
    const lvl = LEVELS[state.currentLevelIdx];
    if (lvl.labels) {
      lvl.labels.forEach(lb => {
        ctx.save();
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = lb.color || '#ffffff';
        ctx.fillText(lb.text, lb.x, lb.y);
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

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(sw.triggered ? '✓' : '🔔', sw.x, sw.y);
      ctx.restore();
    });

    state.gates.forEach(g => {
      ctx.save();
      ctx.fillStyle = g.color;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
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
      ctx.arc(sp.x, sp.y, 16, 0, Math.PI * 2);
      ctx.fillStyle = '#0288d1';
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#b3e5fc';
      ctx.stroke();
      ctx.font = '16px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🚰', sp.x, sp.y);
      ctx.restore();
    });

    // Draw 3 Rubber Ducks with Water Progress Rings
    state.ducks.forEach((duck, idx) => {
      if (duck.collected) return;
      duck.scaleAnim += (1 - duck.scaleAnim) * 0.15;
      const bobY = Math.sin(state.frameTick * 0.07 + duck.bobOffset) * 3;

      ctx.save();
      ctx.translate(duck.x, duck.y + bobY);
      ctx.scale(duck.scaleAnim, duck.scaleAnim);

      ctx.beginPath();
      ctx.arc(0, 0, duck.r + 3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 213, 79, 0.16)';
      ctx.fill();

      const ratio = Math.min(1, duck.dropsAbsorbed / DUCK_REQUIRED_DROPS);
      ctx.beginPath();
      ctx.arc(0, 0, duck.r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * ratio);
      ctx.strokeStyle = '#29b6f6';
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.font = '26px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🐤', 0, 1);

      ctx.font = 'bold 10px sans-serif';
      ctx.fillStyle = '#fff59d';
      ctx.fillText(`${idx + 1}号鸭`, 0, duck.r + 10);
      ctx.restore();
    });

    // Draw Bathtub Chamber & Intake Funnel in Bottom-Right
    drawBathtubChamber();

    // Render Fluid Droplets
    for (let i = 0; i < state.drops.length; i++) {
      const d = state.drops[i];
      ctx.beginPath();
      if (d.type === DROP_WATER) {
        ctx.arc(d.x, d.y, 6.2, 0, Math.PI * 2);
        ctx.fillStyle = '#29b6f6';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(d.x - 1.8, d.y - 1.8, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = '#b3e5fc';
        ctx.fill();
      } else if (d.type === DROP_OOZE) {
        ctx.arc(d.x, d.y, 6.4, 0, Math.PI * 2);
        ctx.fillStyle = '#8e24aa';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(d.x - 1.5, d.y - 1.5, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = '#ea80fc';
        ctx.fill();
      } else if (d.type === DROP_STEAM) {
        ctx.arc(d.x, d.y, 7.2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(224, 247, 250, 0.72)';
        ctx.fill();
      }
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

  function drawBathtubChamber() {
    const lvl = LEVELS[state.currentLevelIdx];
    const fillRatio = Math.min(1, state.bathDropsCollected / REQUIRED_BATH_DROPS);

    ctx.save();

    // Chamber warm tiled backdrop
    ctx.fillStyle = 'rgba(16, 46, 74, 0.92)';
    ctx.strokeStyle = '#4fc3f7';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(TUB_CHAMBER.x, TUB_CHAMBER.y, TUB_CHAMBER.w, TUB_CHAMBER.h, 16);
    ctx.fill();
    ctx.stroke();

    // Pipe connecting Intake Funnel to Bathtub Showerhead
    ctx.strokeStyle = '#90a4ae';
    ctx.lineWidth = 11;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(FUNNEL.x, FUNNEL.y);
    ctx.lineTo(TUB_CHAMBER.x + 25, FUNNEL.y);
    ctx.lineTo(TUB_CHAMBER.x + 25, TUB_CHAMBER.y + 24);
    ctx.lineTo(TUB_CHAMBER.x + 88, TUB_CHAMBER.y + 24);
    ctx.stroke();

    // Intake Funnel Mouth (Left of Chamber)
    ctx.fillStyle = '#ffca28';
    ctx.strokeStyle = '#fff8e1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(FUNNEL.x - 22, FUNNEL.y - 18);
    ctx.lineTo(FUNNEL.x + 22, FUNNEL.y - 18);
    ctx.lineTo(FUNNEL.x + 10, FUNNEL.y + 12);
    ctx.lineTo(FUNNEL.x - 10, FUNNEL.y + 12);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Pulsing guide label above Funnel
    const bounce = Math.sin(state.frameTick * 0.1) * 3;
    ctx.fillStyle = '#ffd54f';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('⬇️ 浴缸进水口', FUNNEL.x, FUNNEL.y - 25 + bounce);

    // Draw Critter Avatar sitting inside the Bathtub
    const avatarX = TUB_CHAMBER.x + 92;
    const avatarY = TUB_CHAMBER.y + 72 + Math.sin(state.frameTick * 0.08) * 2.5;
    const img = critterImages[lvl.id];
    if (img && img.complete) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(avatarX, avatarY, 31, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(img, avatarX - 31, avatarY - 31, 62, 62);
      ctx.restore();

      ctx.beginPath();
      ctx.arc(avatarX, avatarY, 31, 0, Math.PI * 2);
      ctx.strokeStyle = fillRatio >= 1 ? '#ffd54f' : '#81d4fa';
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    // Clawfoot Bathtub Lower Basin
    const tubX = TUB_CHAMBER.x + 20;
    const tubY = TUB_CHAMBER.y + 82;
    const tubW = 138;
    const tubH = 48;

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(tubX, tubY, tubW, tubH, [6, 6, 22, 22]);
    ctx.clip();

    ctx.fillStyle = 'rgba(225, 245, 254, 0.22)';
    ctx.fillRect(tubX, tubY, tubW, tubH);

    const waterH = Math.max(6, tubH * fillRatio);
    ctx.fillStyle = 'rgba(41, 182, 246, 0.84)';
    ctx.fillRect(tubX, tubY + tubH - waterH, tubW, waterH);

    if (fillRatio > 0.08) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
      for (let bx = tubX + 10; bx < tubX + tubW - 8; bx += 14) {
        const by = tubY + tubH - waterH + Math.sin(state.frameTick * 0.08 + bx) * 2;
        ctx.beginPath();
        ctx.arc(bx, by, 6.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.roundRect(tubX, tubY, tubW, tubH, [6, 6, 22, 22]);
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(
      `🛁 ${Math.min(100, Math.round(fillRatio * 100))}%`,
      tubX + tubW * 0.5,
      tubY + tubH * 0.62
    );

    ctx.restore();
  }

  // Auto-Carve Hint Path Helper
  function autoCarveHintSolution() {
    const lvl = LEVELS[state.currentLevelIdx];
    if (!lvl.hintPaths) return;

    const prevTool = state.activeTool;
    state.activeTool = 'dig';

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
        applyToolSegment(x0, y0, x1, y1, 27);
      }
    });

    state.activeTool = prevTool;
    state.terrainDirty = true;

    addBonusCleanWater(40);
    showToast('💡 已为你自动挖通黄金引水水道并补充清水！');
  }

  function addBonusCleanWater(amount = 45) {
    const lvl = LEVELS[state.currentLevelIdx];
    const spawnX = lvl.id === 6 ? 115 : 135;
    const spawnY = lvl.id === 6 ? 175 : 62;
    builderApi.carveCircle(spawnX, spawnY, 26, EMPTY, false);
    builderApi.spawnPool(spawnX - 35, spawnY - 14, 70, 28, DROP_WATER, amount);
    state.terrainDirty = true;
    sfx.playSplash();
    showToast(`🌧️ 加水喷头已注入 +${amount} 滴清澈洗澡水！`);
  }

  // Update Sidebar UI & Level Buttons
  function updateSidebarUI() {
    const lvl = LEVELS[state.currentLevelIdx];
    headerCritterIcon.src = lvl.icon;
    sideCritterImg.src = lvl.icon;
    sideLevelBadge.textContent = `第 ${lvl.id} 关`;
    sideScentBadge.textContent = lvl.scent;
    sideCritterName.textContent = lvl.name;
    sideLevelTitle.textContent = lvl.title;
    critterSpeechBubble.textContent = lvl.quote;
    levelTipText.textContent = lvl.tip;

    const earnedDucks = state.ducks.filter(d => d.collected).length;
    duckCountText.textContent = `${earnedDucks} / 3 只`;
    for (let i = 0; i < 3; i++) {
      const slot = document.getElementById(`duckSlot${i}`);
      if (slot) {
        slot.classList.toggle('collected', i < earnedDucks);
      }
    }

    const pct = Math.min(100, Math.round((state.bathDropsCollected / REQUIRED_BATH_DROPS) * 100));
    bathProgressText.textContent = `${pct}% (${Math.min(REQUIRED_BATH_DROPS, state.bathDropsCollected)} / ${REQUIRED_BATH_DROPS} 滴)`;
    bathProgressBar.style.width = `${pct}%`;

    if (pct >= 100) {
      critterMoodBadge.textContent = '✨ 香喷喷';
    } else if (pct > 0) {
      critterMoodBadge.textContent = '🫧 洗澡中';
    } else {
      critterMoodBadge.textContent = '🧼 等洗澡';
    }

    updateWaterCounters();
  }

  function updateWaterCounters() {
    let clean = 0;
    let ooze = 0;
    let steam = 0;
    for (let i = 0; i < state.drops.length; i++) {
      const t = state.drops[i].type;
      if (t === DROP_WATER) clean++;
      else if (t === DROP_OOZE) ooze++;
      else if (t === DROP_STEAM) steam++;
    }
    statCleanDrops.textContent = `${clean} 滴`;
    statOozeDrops.textContent = `${ooze} 滴`;
    statSteamDrops.textContent = `${steam} 团`;

    const totalDucks = Object.values(state.progressByLevel).reduce((a, b) => a + b, 0);
    statTotalDucks.textContent = `${totalDucks} / ${LEVELS.length * 3}`;
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
        <img src="${lvl.icon}" alt="${lvl.name}" />
        <span>LV.${lvl.id} ${lvl.name.split(' ')[0]}</span>
        <span class="pill-ducks">${earned > 0 ? '🐤'.repeat(earned) : ''}</span>
      `;
      btn.addEventListener('click', () => loadLevel(idx));
      levelNavBar.appendChild(btn);
    });
  }

  // Pointer Events on Canvas
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

  // Tool & Helper Button Bindings
  document.querySelectorAll('.tool-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.activeTool = btn.dataset.tool;
      const toolNames = {
        dig: '⛏️ 已切换至「挖土开路」模式',
        fill: '🧱 已切换至「填土堵漏」模式',
        purify: '✨ 已切换至「净水除苔」模式（涂抹毒水或绿藻即可净化）'
      };
      showToast(toolNames[state.activeTool] || '');
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
    showToast('🔄 本关地形与水源已重置！');
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

  document.getElementById('btnGuideModal').addEventListener('click', () => {
    document.getElementById('guideModal').classList.remove('hidden');
  });

  document.getElementById('btnGuideClose').addEventListener('click', () => {
    document.getElementById('guideModal').classList.add('hidden');
  });

  const btnSoundToggle = document.getElementById('btnSoundToggle');
  btnSoundToggle.addEventListener('click', () => {
    sfx.enabled = !sfx.enabled;
    btnSoundToggle.textContent = sfx.enabled ? '🔊 音效: 开' : '🔇 音效: 关';
  });

  // Main Animation Loop
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
