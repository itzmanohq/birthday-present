// ==========================================================
// A LITTLE UNIVERSE MADE FOR YOU - MASTER SCRIPT
// Pure Vanilla JavaScript (ES6+) - Responsive, Zero Frameworks
// ==========================================================

// ===============================
// BIRTHDAY PERSONALIZATION
// ===============================

const birthdayConfig = {
    // 1. Recipient Name
    name: "VAANI SREE✨",

    // 2. Intro Subtitle
    subtitle: "Someone special has a little surprise waiting...",

    // 3. Message Cards (Phase 04 - Screen 5)
    messageCards: [
        {
            number: "01",
            title: "Not Another Proposal",
            content: "Just here to wish you as someone you once knew."
        },
        {
            number: "02",
            title: "You Were Right!",
            content: "I didn't listen to you, so life had to make me listen."
        },
        {
            number: "03",
            title: "I Owe You",
            content: "I owe you the smile that you always gave me."
        },
        {
            number: "04",
            title: "I Wish You",
            content: "I wish you happiness, and I always will."
        }
    ],

    // 4. Final Birthday Letter (Screen 8)
    finalMessage: `Happy Birthday, [NAME].

I hope this year brings you countless moments worth remembering,
unexpected happiness, and everything you've been quietly wishing for.

This little universe was made just for you.`,

    // 5. Hidden Moon Easter Egg Message
    secretMessage: "Some surprises are better when you discover them yourself. Thank you for being such a wonderful light in this world. 🌙✨",

    // 6. Interactive Journey Timeline (Screen 6)
    timeline: [
        {
            tag: "Then",
            title: "The First Spark",
            desc: "You became my favorite within a short time. I loved seeing you smile, and you felt like a wish from God. For the first time, I became so close to a girl, and it was a completely new experience for me."
        },
        {
            tag: "Somewhere along the way",
            title: "Quiet Comfort",
            desc: "We used to share jokes during breaks. For that, I used to prepare jokes at home like it was homework. I felt comfortable while talking to you, and that was a new feeling for me. 😊✨"
        },
        {
            tag: "One of those random moments",
            title: "Pure Magic",
            desc: "Do you remember the evening when I called you an angel? The way you smiled that day still makes me fall for you. ✨"
        },
        {
            tag: "Today",
            title: "Your Universe",
            desc: "This is a special day. I wish you to be happy throughout your life, even in bad situations. I want you to be brave and calm. According to me, no one can stay sad around you. Celebrate all the days of the year as your special days, with joy. ✨"
        }
    ]
};

// ==========================================================
// 1. GLOBAL STATE & SCREEN NAVIGATION
// ==========================================================
const screenOrder = [
    'screen-intro',
    'screen-constellation',
    'screen-photo',
    'screen-music',
    'screen-cards',
    'screen-timeline',
    'screen-cake',
    'screen-final',
    'screen-question'
];

const state = {
    currentScreen: 'screen-intro',
    unlockedScreenIndex: 0,
    isReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    warpSpeed: false,
    starsBrightened: false,
    constellationCompleted: false,
    connectedStars: [],
    photoRevealed: false,
    isPlayingAudio: false,
    moonClickCount: 0,
    candleBlown: false,
    audioContext: null,
    analyser: null
};

// Global screen transition manager
function goToScreen(targetScreenId) {
    const currentElem = document.getElementById(state.currentScreen);
    const targetElem = document.getElementById(targetScreenId);
    if (!targetElem) return;

    if (currentElem) {
        currentElem.classList.remove('active-screen');
    }

    state.currentScreen = targetScreenId;
    targetElem.classList.add('active-screen');

    const targetIdx = screenOrder.indexOf(targetScreenId);
    if (targetIdx > state.unlockedScreenIndex) {
        state.unlockedScreenIndex = targetIdx;
    }

    updateNavHeader();
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (targetScreenId === 'screen-constellation' && window.onActivateConstellation) {
        setTimeout(window.onActivateConstellation, 80);
    } else if (targetScreenId === 'screen-photo' && window.onActivatePhotoReveal) {
        setTimeout(window.onActivatePhotoReveal, 80);
    }
}

function updateNavHeader() {
    const nav = document.getElementById('universe-nav');
    const container = document.getElementById('nav-steps-container');
    if (!nav || !container) return;

    if (state.currentScreen === 'screen-intro') {
        nav.classList.add('hidden');
    } else {
        nav.classList.remove('hidden');
    }

    container.innerHTML = '';
    screenOrder.slice(1).forEach((scrId, idx) => {
        const dot = document.createElement('div');
        dot.className = 'nav-step-dot';
        const actualIdx = idx + 1;
        if (scrId === state.currentScreen) {
            dot.classList.add('active');
        } else if (actualIdx <= state.unlockedScreenIndex) {
            dot.classList.add('passed');
            dot.addEventListener('click', () => goToScreen(scrId));
        }
        container.appendChild(dot);
    });
}

// ==========================================================
// 2. CANVAS STARFIELD BACKGROUND SYSTEM
// ==========================================================
class Starfield {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.stars = [];
        this.shootingStars = [];
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.mouseX = this.width / 2;
        this.mouseY = this.height / 2;
        this.targetMouseX = this.mouseX;
        this.targetMouseY = this.mouseY;

        this.init();
    }

    init() {
        this.resize();
        this.createStars();
        this.bindEvents();
        this.render();
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    createStars() {
        const count = this.width < 768 ? 90 : 180;
        this.stars = [];

        for (let i = 0; i < count; i++) {
            this.stars.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                size: Math.random() * 1.8 + 0.4,
                alpha: Math.random() * 0.7 + 0.3,
                baseAlpha: Math.random() * 0.7 + 0.3,
                twinkleSpeed: Math.random() * 0.02 + 0.005,
                twinklePhase: Math.random() * Math.PI * 2,
                vx: (Math.random() - 0.5) * 0.08,
                vy: (Math.random() - 0.5) * 0.08,
                layer: Math.random() * 0.5 + 0.5,
                color: Math.random() > 0.8 ? '#fde49e' : (Math.random() > 0.6 ? '#f4a8b7' : '#ffffff')
            });
        }
    }

    bindEvents() {
        window.addEventListener('resize', () => {
            this.resize();
            this.createStars();
        });

        window.addEventListener('pointermove', (e) => {
            this.targetMouseX = e.clientX;
            this.targetMouseY = e.clientY;
        });

        setInterval(() => {
            if (!state.isReducedMotion && Math.random() > 0.35 && this.shootingStars.length < 2) {
                this.addShootingStar();
            }
        }, 3500);
    }

    addShootingStar() {
        const startX = Math.random() * this.width * 0.8;
        const startY = Math.random() * this.height * 0.4;
        const length = Math.random() * 180 + 100;
        const speed = Math.random() * 10 + 14;

        this.shootingStars.push({
            x: startX,
            y: startY,
            length: length,
            speed: speed,
            angle: Math.PI / 4 + (Math.random() - 0.5) * 0.2,
            opacity: 1,
            decay: Math.random() * 0.02 + 0.015
        });
    }

    render() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        this.mouseX += (this.targetMouseX - this.mouseX) * 0.05;
        this.mouseY += (this.targetMouseY - this.mouseY) * 0.05;
        const offsetX = (this.mouseX - this.width / 2) * 0.025;
        const offsetY = (this.mouseY - this.height / 2) * 0.025;

        const brightnessMultiplier = state.starsBrightened ? 1.8 : (state.warpSpeed ? 2.5 : 1);
        const speedMultiplier = state.warpSpeed ? 8 : 1;

        for (let star of this.stars) {
            star.twinklePhase += star.twinkleSpeed;
            star.alpha = Math.max(0.1, Math.min(1, (star.baseAlpha + Math.sin(star.twinklePhase) * 0.3) * brightnessMultiplier));

            if (!state.isReducedMotion) {
                star.x += star.vx * speedMultiplier;
                star.y += star.vy * speedMultiplier;

                if (star.x < 0) star.x = this.width;
                if (star.x > this.width) star.x = 0;
                if (star.y < 0) star.y = this.height;
                if (star.y > this.height) star.y = 0;
            }

            const drawX = star.x + offsetX * star.layer;
            const drawY = star.y + offsetY * star.layer;

            this.ctx.beginPath();
            this.ctx.arc(drawX, drawY, star.size * (state.warpSpeed ? 1.5 : 1), 0, Math.PI * 2);
            this.ctx.fillStyle = star.color;
            this.ctx.globalAlpha = star.alpha;
            this.ctx.fill();

            if (star.size > 1.4) {
                this.ctx.beginPath();
                this.ctx.arc(drawX, drawY, star.size * 2.5, 0, Math.PI * 2);
                this.ctx.fillStyle = star.color;
                this.ctx.globalAlpha = star.alpha * 0.25;
                this.ctx.fill();
            }
        }

        for (let i = this.shootingStars.length - 1; i >= 0; i--) {
            const ss = this.shootingStars[i];
            const tailX = ss.x - Math.cos(ss.angle) * ss.length;
            const tailY = ss.y - Math.sin(ss.angle) * ss.length;

            const grad = this.ctx.createLinearGradient(tailX, tailY, ss.x, ss.y);
            grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
            grad.addColorStop(0.7, 'rgba(253, 228, 158, 0.4)');
            grad.addColorStop(1, 'rgba(255, 255, 255, 0.95)');

            this.ctx.beginPath();
            this.ctx.moveTo(tailX, tailY);
            this.ctx.lineTo(ss.x, ss.y);
            this.ctx.strokeStyle = grad;
            this.ctx.lineWidth = 2;
            this.ctx.globalAlpha = ss.opacity;
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.arc(ss.x, ss.y, 2.5, 0, Math.PI * 2);
            this.ctx.fillStyle = '#ffffff';
            this.ctx.globalAlpha = ss.opacity;
            this.ctx.fill();

            ss.x += Math.cos(ss.angle) * ss.speed;
            ss.y += Math.sin(ss.angle) * ss.speed;
            ss.opacity -= ss.decay;

            if (ss.opacity <= 0 || ss.x > this.width + 100 || ss.y > this.height + 100) {
                this.shootingStars.splice(i, 1);
            }
        }

        this.ctx.globalAlpha = 1;
        requestAnimationFrame(() => this.render());
    }
}

// ==========================================================
// 3. GLOBAL INTERACTIVE PARTICLE SYSTEM
// ==========================================================
class ParticleSystem {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.render();
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    burst(x, y, count = 18, colors = ['#fde49e', '#f4a8b7', '#80e5ff', '#ffffff'], options = {}) {
        if (state.isReducedMotion) return;
        const actualCount = this.width < 768 ? Math.max(8, Math.floor(count * 0.7)) : count;

        for (let i = 0; i < actualCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * (options.speed || 4.5) + 1;
            const size = Math.random() * (options.size || 3.5) + 1.2;
            const color = colors[Math.floor(Math.random() * colors.length)];

            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed + (options.gravity || 0),
                size: size,
                color: color,
                alpha: 1,
                decay: Math.random() * 0.025 + 0.015,
                shape: options.hearts && Math.random() > 0.5 ? 'heart' : 'circle'
            });
        }
    }

    render() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vx *= 0.97;
            p.vy *= 0.97;
            p.alpha -= p.decay;

            if (p.alpha <= 0) {
                this.particles.splice(i, 1);
                continue;
            }

            this.ctx.save();
            this.ctx.globalAlpha = p.alpha;
            this.ctx.fillStyle = p.color;

            if (p.shape === 'heart') {
                this.drawHeart(p.x, p.y, p.size * 2);
            } else {
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                this.ctx.fill();
            }
            this.ctx.restore();
        }

        requestAnimationFrame(() => this.render());
    }

    drawHeart(x, y, size) {
        this.ctx.beginPath();
        const topCurveHeight = size * 0.3;
        this.ctx.moveTo(x, y + topCurveHeight);
        this.ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + topCurveHeight);
        this.ctx.bezierCurveTo(x - size / 2, y + (size + topCurveHeight) / 2, x, y + (size + topCurveHeight) / 1.5, x, y + size);
        this.ctx.bezierCurveTo(x, y + (size + topCurveHeight) / 1.5, x + size / 2, y + (size + topCurveHeight) / 2, x + size / 2, y + topCurveHeight);
        this.ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight);
        this.ctx.closePath();
        this.ctx.fill();
    }
}

// ==========================================================
// 4. CURSOR GLOW & TAP-TO-STARDUST SYSTEM
// ==========================================================
function setupCursorAndTouches(particleSys) {
    const glow = document.getElementById('cursor-glow');
    const dot = document.getElementById('cursor-dot');
    let mouseX = -100;
    let mouseY = -100;
    let currentX = -100;
    let currentY = -100;

    window.addEventListener('pointermove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (dot) {
            dot.style.left = `${mouseX}px`;
            dot.style.top = `${mouseY}px`;
        }
    });

    function updateCursor() {
        currentX += (mouseX - currentX) * 0.15;
        currentY += (mouseY - currentY) * 0.15;
        if (glow) {
            glow.style.left = `${currentX}px`;
            glow.style.top = `${currentY}px`;
        }
        requestAnimationFrame(updateCursor);
    }
    updateCursor();

    // Universal Tap to Stardust (Every click/tap emits stardust)
    window.addEventListener('pointerdown', (e) => {
        particleSys.burst(e.clientX, e.clientY, 10, ['#fde49e', '#f4a8b7', '#ffffff']);
    }, { passive: true });
}

// ==========================================================
// 5. SCREEN 1: INTRO / UNIVERSE CONTROLLER
// ==========================================================
function setupScreenIntro(particleSys) {
    const btnEnter = document.getElementById('btn-enter');
    const subtitleElem = document.getElementById('intro-subtitle');

    if (subtitleElem && birthdayConfig.subtitle) {
        subtitleElem.textContent = birthdayConfig.subtitle;
    }

    if (btnEnter) {
        btnEnter.addEventListener('click', () => {
            const rect = btnEnter.getBoundingClientRect();
            particleSys.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 30, ['#fde49e', '#f4a8b7', '#ffffff']);

            state.warpSpeed = true;
            btnEnter.style.transform = 'scale(1.1)';
            btnEnter.style.filter = 'brightness(1.4)';

            setTimeout(() => {
                state.warpSpeed = false;
                btnEnter.style.transform = '';
                btnEnter.style.filter = '';
                goToScreen('screen-constellation');
            }, 600);
        });
    }
}

// ==========================================================
// 6. SCREEN 2: INTERACTIVE CONSTELLATION
// ==========================================================
function setupConstellation(particleSys) {
    const container = document.getElementById('constellation-container');
    const canvas = document.getElementById('constellation-canvas');
    const starLayer = document.getElementById('constellation-star-layer');
    const progressBar = document.getElementById('constellation-progress-bar');
    const counterText = document.getElementById('constellation-counter');
    const revealCard = document.getElementById('constellation-reveal-card');
    const nameElem = document.getElementById('constellation-her-name');
    const continueBtn = document.getElementById('btn-constellation-continue');
    const secretToast = document.getElementById('secret-star-toast');

    if (!container || !canvas || !starLayer) return;
    const ctx = canvas.getContext('2d');

    if (nameElem) {
        nameElem.textContent = birthdayConfig.name;
    }

    const constellationPath = [
        { id: 1, nx: 0.50, ny: 0.78 },
        { id: 2, nx: 0.28, ny: 0.52 },
        { id: 3, nx: 0.22, ny: 0.32 },
        { id: 4, nx: 0.38, ny: 0.20 },
        { id: 5, nx: 0.50, ny: 0.36 },
        { id: 6, nx: 0.62, ny: 0.20 },
        { id: 7, nx: 0.78, ny: 0.32 },
        { id: 8, nx: 0.72, ny: 0.52 }
    ];

    const distractorStars = [
        { id: 101, nx: 0.12, ny: 0.15 },
        { id: 102, nx: 0.88, ny: 0.18 },
        { id: 103, nx: 0.10, ny: 0.70 },
        { id: 104, nx: 0.86, ny: 0.75 },
        { id: 105, nx: 0.32, ny: 0.88 },
        { id: 106, nx: 0.68, ny: 0.88 },
        { id: 107, nx: 0.16, ny: 0.45 },
        { id: 108, nx: 0.84, ny: 0.48 }
    ];

    const secretStar = { id: 999, nx: 0.92, ny: 0.38, isSecret: true };
    const allStars = [...constellationPath, ...distractorStars, secretStar];
    let currentIndex = 0;

    function resizeCanvas() {
        const rect = container.getBoundingClientRect();
        canvas.width = rect.width || 400;
        canvas.height = rect.height || 380;
    }

    function renderStarNodes() {
        starLayer.innerHTML = '';
        resizeCanvas();

        allStars.forEach(star => {
            const btn = document.createElement('button');
            btn.className = 'c-star';
            btn.dataset.id = star.id;
            btn.style.left = `${star.nx * 100}%`;
            btn.style.top = `${star.ny * 100}%`;
            btn.setAttribute('aria-label', `Constellation Star ${star.id}`);

            if (star.isSecret) {
                btn.classList.add('secret-star');
            }

            const core = document.createElement('span');
            core.className = 'c-star-core';
            btn.appendChild(core);

            btn.addEventListener('click', (e) => handleStarClick(star, btn, e));
            starLayer.appendChild(btn);
        });

        updateTargetHint();
        drawConstellationLines();
    }

    function updateTargetHint() {
        const starButtons = starLayer.querySelectorAll('.c-star');
        starButtons.forEach(btn => btn.classList.remove('target-next'));

        if (currentIndex < constellationPath.length && !state.constellationCompleted) {
            const nextTargetId = constellationPath[currentIndex].id;
            const targetBtn = starLayer.querySelector(`[data-id="${nextTargetId}"]`);
            if (targetBtn) {
                targetBtn.classList.add('target-next');
            }
        }
    }

    function handleStarClick(star, btn, event) {
        const rect = btn.getBoundingClientRect();
        const clickX = rect.left + rect.width / 2;
        const clickY = rect.top + rect.height / 2;

        if (star.isSecret) {
            particleSys.burst(clickX, clickY, 25, ['#80e5ff', '#9d8df1', '#ffffff']);
            if (secretToast) {
                secretToast.classList.remove('hidden');
                setTimeout(() => secretToast.classList.add('hidden'), 3500);
            }
            return;
        }

        if (state.constellationCompleted) return;

        const expectedStar = constellationPath[currentIndex];
        if (star.id === expectedStar.id) {
            state.connectedStars.push(star);
            btn.classList.add('connected');
            currentIndex++;

            particleSys.burst(clickX, clickY, 20, ['#fde49e', '#f4a8b7', '#ffffff']);
            
            const progressPct = (currentIndex / constellationPath.length) * 100;
            progressBar.style.width = `${progressPct}%`;
            counterText.textContent = `${currentIndex} / ${constellationPath.length} stars aligned`;

            drawConstellationLines();
            updateTargetHint();

            if (currentIndex === constellationPath.length) {
                completeConstellation();
            }
        } else {
            btn.classList.remove('shake-soft');
            void btn.offsetWidth;
            btn.classList.add('shake-soft');
            particleSys.burst(clickX, clickY, 6, ['#7a88a6']);
        }
    }

    function drawConstellationLines() {
        const w = canvas.width;
        const h = canvas.height;
        ctx.clearRect(0, 0, w, h);

        if (state.connectedStars.length > 1) {
            ctx.beginPath();
            const first = state.connectedStars[0];
            ctx.moveTo(first.nx * w, first.ny * h);

            for (let i = 1; i < state.connectedStars.length; i++) {
                const s = state.connectedStars[i];
                ctx.lineTo(s.nx * w, s.ny * h);
            }

            if (state.constellationCompleted) {
                ctx.closePath();
            }

            ctx.shadowColor = '#f4a8b7';
            ctx.shadowBlur = 15;
            ctx.strokeStyle = '#fde49e';
            ctx.lineWidth = 2.5;
            ctx.stroke();

            ctx.shadowBlur = 0;
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1;
            ctx.stroke();
        }
    }

    function completeConstellation() {
        state.constellationCompleted = true;
        drawConstellationLines();

        const rect = container.getBoundingClientRect();
        particleSys.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 50, ['#fde49e', '#f4a8b7', '#9d8df1', '#ffffff'], { size: 4, hearts: true });

        setTimeout(() => {
            if (revealCard) {
                revealCard.classList.remove('hidden');
            }
        }, 500);
    }

    if (continueBtn) {
        continueBtn.addEventListener('click', () => {
            goToScreen('screen-photo');
        });
    }

    window.onActivateConstellation = () => {
        resizeCanvas();
        drawConstellationLines();
    };

    window.addEventListener('resize', () => {
        if (state.currentScreen === 'screen-constellation') {
            resizeCanvas();
            drawConstellationLines();
        }
    });

    renderStarNodes();

    window.resetConstellation = function() {
        state.constellationCompleted = false;
        state.connectedStars = [];
        currentIndex = 0;
        progressBar.style.width = '0%';
        counterText.textContent = `0 / ${constellationPath.length} stars aligned`;
        if (revealCard) revealCard.classList.add('hidden');
        renderStarNodes();
    };
}

// ==========================================================
// 7. SCREEN 3: PHOTO REVEAL & TAP-TO-STARDUST
// ==========================================================
function setupPhotoReveal(particleSys) {
    const frame = document.getElementById('photo-frame');
    const canvas = document.getElementById('photo-scratch-canvas');
    const photoImg = document.getElementById('reveal-photo-img');
    const placeholder = document.getElementById('photo-placeholder');
    const draggerCue = document.getElementById('dragger-cursor-cue');
    const hudBar = document.getElementById('photo-progress-fill');
    const hudText = document.getElementById('photo-progress-text');
    const successBanner = document.getElementById('photo-reveal-success');
    const continueBtn = document.getElementById('btn-photo-continue');
    const wrapper = document.getElementById('photo-inner-wrapper');

    if (!canvas || !frame || !wrapper) return;
    const ctx = canvas.getContext('2d');
    let isDrawing = false;
    let isRevealed = false;
    let lastX = null;
    let lastY = null;

    // Grid coverage tracking (smooth 60fps)
    const gridCols = 8;
    const gridRows = 8;
    const totalPoints = gridCols * gridRows;
    let visitedPoints = new Set();

    if (photoImg) {
        photoImg.onerror = () => {
            photoImg.classList.add('hidden');
            if (placeholder) placeholder.classList.remove('hidden');
        };
    }

    function initCanvasMask() {
        const rect = wrapper.getBoundingClientRect();
        canvas.width = rect.width || 360;
        canvas.height = rect.height || 360;

        ctx.fillStyle = '#060a17';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < 60; i++) {
            const rx = Math.random() * canvas.width;
            const ry = Math.random() * canvas.height;
            const rSize = Math.random() * 1.5;
            ctx.beginPath();
            ctx.arc(rx, ry, rSize, 0, Math.PI * 2);
            ctx.fillStyle = Math.random() > 0.5 ? '#9d8df1' : '#fde49e';
            ctx.globalAlpha = Math.random() * 0.6 + 0.2;
            ctx.fill();
        }
        ctx.globalAlpha = 1;
    }

    function eraseAt(x, y) {
        if (isRevealed) return;

        ctx.globalCompositeOperation = 'destination-out';
        const brushRadius = 45;

        // Smooth line connection if moving fast
        if (lastX !== null && lastY !== null) {
            ctx.lineWidth = brushRadius * 2;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(x, y);
            ctx.stroke();
        }

        // Radial feathered eraser dab
        const grad = ctx.createRadialGradient(x, y, 0, x, y, brushRadius);
        grad.addColorStop(0, 'rgba(0,0,0,1)');
        grad.addColorStop(0.7, 'rgba(0,0,0,0.85)');
        grad.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, brushRadius, 0, Math.PI * 2);
        ctx.fill();

        lastX = x;
        lastY = y;

        // Stardust trail
        const frameRect = frame.getBoundingClientRect();
        particleSys.burst(frameRect.left + x, frameRect.top + y, 3, ['#fde49e', '#f4a8b7', '#ffffff']);

        // Update star cue position
        if (draggerCue && draggerCue.style.display !== 'none') {
            draggerCue.style.left = `${x}px`;
            draggerCue.style.top = `${y}px`;
            draggerCue.style.opacity = '1';
        }

        // Update grid coverage
        const col = Math.floor((x / canvas.width) * gridCols);
        const row = Math.floor((y / canvas.height) * gridRows);
        for (let r = Math.max(0, row - 1); r <= Math.min(gridRows - 1, row + 1); r++) {
            for (let c = Math.max(0, col - 1); c <= Math.min(gridCols - 1, col + 1); c++) {
                visitedPoints.add(`${c}-${r}`);
            }
        }

        const pct = Math.min(100, Math.round((visitedPoints.size / totalPoints) * 100 * 1.6));
        if (hudBar) hudBar.style.width = `${pct}%`;
        if (hudText) hudText.textContent = `${pct}% revealed`;

        if (visitedPoints.size >= totalPoints * 0.32) {
            completePhotoReveal();
        }
    }

    function completePhotoReveal() {
        if (isRevealed) return;
        isRevealed = true;
        state.photoRevealed = true;

        canvas.style.opacity = '0';
        setTimeout(() => { canvas.style.display = 'none'; }, 500);

        if (draggerCue) draggerCue.style.display = 'none';
        if (frame) frame.classList.add('revealed', 'brightened');
        if (successBanner) successBanner.classList.remove('hidden');

        const rect = frame.getBoundingClientRect();
        particleSys.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 45, ['#fde49e', '#f4a8b7', '#9d8df1', '#ffffff'], { size: 4, hearts: true });
    }

    function getCoords(e) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = rect.width ? (canvas.width / rect.width) : 1;
        const scaleY = rect.height ? (canvas.height / rect.height) : 1;
        return {
            x: Math.max(0, Math.min(canvas.width, (e.clientX - rect.left) * scaleX)),
            y: Math.max(0, Math.min(canvas.height, (e.clientY - rect.top) * scaleY))
        };
    }

    // Trigger glowing ripple on tap
    function triggerPhotoRipple(e) {
        const rect = wrapper.getBoundingClientRect();
        const ripple = document.createElement('span');
        ripple.className = 'photo-tap-ripple';
        ripple.style.left = `${e.clientX - rect.left}px`;
        ripple.style.top = `${e.clientY - rect.top}px`;
        wrapper.appendChild(ripple);
        setTimeout(() => ripple.remove(), 750);

        particleSys.burst(e.clientX, e.clientY, 20, ['#fde49e', '#f4a8b7', '#80e5ff', '#ffffff'], { size: 4, hearts: true });

        frame.classList.add('brightened');
        setTimeout(() => frame.classList.remove('brightened'), 500);
    }

    wrapper.addEventListener('pointerdown', (e) => {
        if (isRevealed) {
            triggerPhotoRipple(e);
            return;
        }

        isDrawing = true;
        try { wrapper.setPointerCapture(e.pointerId); } catch(err) {}
        const coords = getCoords(e);
        lastX = coords.x;
        lastY = coords.y;
        eraseAt(coords.x, coords.y);
    });

    wrapper.addEventListener('pointermove', (e) => {
        if (!isDrawing || isRevealed) return;
        const coords = getCoords(e);
        eraseAt(coords.x, coords.y);
    });

    function endDrag(e) {
        isDrawing = false;
        lastX = null;
        lastY = null;
        try { wrapper.releasePointerCapture(e.pointerId); } catch(err) {}
    }

    wrapper.addEventListener('pointerup', endDrag);
    wrapper.addEventListener('pointercancel', endDrag);

    if (continueBtn) {
        continueBtn.addEventListener('click', () => {
            goToScreen('screen-music');
        });
    }

    window.onActivatePhotoReveal = () => {
        if (!isRevealed) initCanvasMask();
    };

    window.resetPhotoReveal = function() {
        isRevealed = false;
        state.photoRevealed = false;
        visitedPoints.clear();
        canvas.style.display = 'block';
        canvas.style.opacity = '1';
        frame.classList.remove('revealed', 'brightened');
        if (draggerCue) {
            draggerCue.style.display = 'block';
            draggerCue.style.left = '50%';
            draggerCue.style.top = '50%';
            draggerCue.style.opacity = '1';
        }
        if (successBanner) successBanner.classList.add('hidden');
        if (hudBar) hudBar.style.width = '0%';
        if (hudText) hudText.textContent = 'Drag star across photo to reveal';
        initCanvasMask();
    };
}

// ==========================================================
// 8. SCREEN 4: MUSIC PLAYER & CELESTIAL SYNTHESIZER
// ==========================================================
function setupMusicPlayer(particleSys) {
    const audio = document.getElementById('birthday-audio-element');
    const playBtn = document.getElementById('btn-audio-play');
    const iconPlay = document.getElementById('icon-play');
    const iconPause = document.getElementById('icon-pause');
    const progressBar = document.getElementById('audio-progress-bar');
    const progressFill = document.getElementById('audio-progress-fill');
    const progressThumb = document.getElementById('audio-progress-thumb');
    const currentTimeElem = document.getElementById('audio-current-time');
    const durationTimeElem = document.getElementById('audio-duration-time');
    const muteBtn = document.getElementById('btn-audio-mute');
    const iconVolOn = document.getElementById('icon-volume-on');
    const iconVolOff = document.getElementById('icon-volume-off');
    const volumeSlider = document.getElementById('audio-volume-slider');
    const visualizerCanvas = document.getElementById('music-visualizer-canvas');
    const continueBtn = document.getElementById('btn-music-continue');
    const playerCard = document.querySelector('.music-player-card');

    if (!audio || !playBtn) return;
    const vCtx = visualizerCanvas.getContext('2d');
    let synthTimer = null;
    let synthStep = 0;

    const melodyNotes = [
        293.66, 293.66, 329.63, 293.66, 392.00, 369.99,
        293.66, 293.66, 329.63, 293.66, 440.00, 392.00,
        293.66, 293.66, 587.33, 493.88, 392.00, 369.99, 329.63,
        523.25, 523.25, 493.88, 392.00, 440.00, 392.00
    ];
    const melodyDurations = [
        0.4, 0.4, 0.8, 0.8, 0.8, 1.6,
        0.4, 0.4, 0.8, 0.8, 0.8, 1.6,
        0.4, 0.4, 0.8, 0.8, 0.8, 0.8, 1.6,
        0.4, 0.4, 0.8, 0.8, 0.8, 2.0
    ];

    function initAudioContext() {
        if (!state.audioContext) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) {
                state.audioContext = new AudioCtx();
                state.analyser = state.audioContext.createAnalyser();
                state.analyser.fftSize = 64;
            }
        }
        if (state.audioContext && state.audioContext.state === 'suspended') {
            state.audioContext.resume();
        }
    }

    function playSynthNote(freq, dur) {
        if (!state.audioContext) return;
        const now = state.audioContext.currentTime;
        const osc = state.audioContext.createOscillator();
        const gain = state.audioContext.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        const vol = volumeSlider ? parseFloat(volumeSlider.value) : 0.8;
        gain.gain.setValueAtTime(0.28 * vol, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + dur * 1.4);

        osc.connect(gain);
        gain.connect(state.audioContext.destination);
        if (state.analyser) gain.connect(state.analyser);

        osc.start(now);
        osc.stop(now + dur * 1.5);
    }

    function startSynthMelody() {
        synthStep = 0;
        function nextNote() {
            if (!state.isPlayingAudio) return;
            const freq = melodyNotes[synthStep % melodyNotes.length];
            const dur = melodyDurations[synthStep % melodyDurations.length];
            playSynthNote(freq, dur);
            synthStep++;
            synthTimer = setTimeout(nextNote, dur * 1000 * 0.9);
        }
        nextNote();
    }

    function formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    function updatePlayState(playing) {
        state.isPlayingAudio = playing;
        if (playing) {
            iconPlay.classList.add('hidden');
            iconPause.classList.remove('hidden');
            if (playerCard) playerCard.classList.add('music-playing');
        } else {
            iconPlay.classList.remove('hidden');
            iconPause.classList.add('hidden');
            if (playerCard) playerCard.classList.remove('music-playing');
            if (synthTimer) clearTimeout(synthTimer);
        }
    }

    playBtn.addEventListener('click', () => {
        initAudioContext();

        if (state.isPlayingAudio) {
            audio.pause();
            updatePlayState(false);
        } else {
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    updatePlayState(true);
                }).catch(() => {
                    updatePlayState(true);
                    startSynthMelody();
                });
            } else {
                updatePlayState(true);
            }
        }
    });

    function updateDurationDisplay() {
        if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
            durationTimeElem.textContent = formatTime(audio.duration);
        }
    }

    audio.addEventListener('timeupdate', () => {
        if (audio.duration && !isNaN(audio.duration)) {
            const pct = (audio.currentTime / audio.duration) * 100;
            progressFill.style.width = `${pct}%`;
            progressThumb.style.left = `${pct}%`;
            currentTimeElem.textContent = formatTime(audio.currentTime);
            updateDurationDisplay();
        }
    });

    audio.addEventListener('loadedmetadata', updateDurationDisplay);
    audio.addEventListener('durationchange', updateDurationDisplay);
    audio.addEventListener('canplay', updateDurationDisplay);

    audio.addEventListener('ended', () => {
        updatePlayState(false);
        progressFill.style.width = '0%';
        progressThumb.style.left = '0%';
        currentTimeElem.textContent = '0:00';
    });

    progressBar.addEventListener('click', (e) => {
        const rect = progressBar.getBoundingClientRect();
        const clickRatio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        if (audio.duration) {
            audio.currentTime = clickRatio * audio.duration;
        }
    });

    if (volumeSlider) {
        volumeSlider.addEventListener('input', (e) => {
            const vol = parseFloat(e.target.value);
            audio.volume = vol;
            if (vol === 0) {
                iconVolOn.classList.add('hidden');
                iconVolOff.classList.remove('hidden');
            } else {
                iconVolOn.classList.remove('hidden');
                iconVolOff.classList.add('hidden');
            }
        });
    }

    if (muteBtn) {
        muteBtn.addEventListener('click', () => {
            audio.muted = !audio.muted;
            if (audio.muted) {
                iconVolOn.classList.add('hidden');
                iconVolOff.classList.remove('hidden');
            } else {
                iconVolOn.classList.remove('hidden');
                iconVolOff.classList.add('hidden');
            }
        });
    }

    function renderVisualizer() {
        const w = visualizerCanvas.width;
        const h = visualizerCanvas.height;
        vCtx.clearRect(0, 0, w, h);

        const barCount = 18;
        const barWidth = (w / barCount) * 0.65;
        const gap = (w / barCount) * 0.35;

        if (state.isPlayingAudio && state.analyser) {
            const dataArray = new Uint8Array(state.analyser.frequencyBinCount);
            state.analyser.getByteFrequencyData(dataArray);

            for (let i = 0; i < barCount; i++) {
                const val = dataArray[i * 2] || 0;
                const barHeight = Math.max(4, (val / 255) * h * 0.85);
                const x = i * (barWidth + gap) + gap / 2;
                const y = h - barHeight;

                const grad = vCtx.createLinearGradient(0, y, 0, h);
                grad.addColorStop(0, '#fde49e');
                grad.addColorStop(0.5, '#f4a8b7');
                grad.addColorStop(1, '#9d8df1');

                vCtx.fillStyle = grad;
                vCtx.beginPath();
                vCtx.roundRect ? vCtx.roundRect(x, y, barWidth, barHeight, 4) : vCtx.rect(x, y, barWidth, barHeight);
                vCtx.fill();
            }
        } else {
            const time = Date.now() * 0.002;
            for (let i = 0; i < barCount; i++) {
                const idleHeight = state.isPlayingAudio 
                    ? Math.sin(time * 3 + i * 0.4) * 20 + 25 
                    : Math.sin(time + i * 0.3) * 6 + 10;
                const x = i * (barWidth + gap) + gap / 2;
                const y = h - idleHeight;

                vCtx.fillStyle = state.isPlayingAudio ? '#f4a8b7' : 'rgba(157, 141, 241, 0.25)';
                vCtx.beginPath();
                vCtx.roundRect ? vCtx.roundRect(x, y, barWidth, idleHeight, 3) : vCtx.rect(x, y, barWidth, idleHeight);
                vCtx.fill();
            }
        }

        requestAnimationFrame(renderVisualizer);
    }
    renderVisualizer();

    if (continueBtn) {
        continueBtn.addEventListener('click', () => {
            goToScreen('screen-cards');
        });
    }

    window.resetMusicPlayer = function() {
        audio.pause();
        audio.currentTime = 0;
        updatePlayState(false);
        progressFill.style.width = '0%';
        progressThumb.style.left = '0%';
        currentTimeElem.textContent = '0:00';
    };
}

// ==========================================================
// 9. SCREEN 5: MEMORY / MESSAGE CARDS (PHASE 04)
// ==========================================================
function setupMessageCards(particleSys) {
    const grid = document.getElementById('memory-cards-grid');
    const continueBtn = document.getElementById('btn-cards-continue');
    if (!grid) return;

    grid.innerHTML = '';

    const cards = birthdayConfig.messageCards || [];

    cards.forEach((cardData) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', `${cardData.title}. Click to read.`);

        card.innerHTML = `
            <div class="card-inner">
                <div class="card-face card-front">
                    <div class="card-front-top">
                        <span class="card-star-glyph">✦</span>
                        <span class="card-number">${cardData.number}</span>
                    </div>
                    <div class="card-front-center">
                        <h3 class="card-front-title">${cardData.title}</h3>
                    </div>
                    <span class="card-front-hint">Tap to open ✧</span>
                </div>
                <div class="card-face card-back">
                    <div class="card-back-header">
                        <h4 class="card-back-title">${cardData.title}</h4>
                    </div>
                    <p class="card-back-text">${cardData.content}</p>
                </div>
            </div>
        `;

        function flipCard() {
            const isFlipped = card.classList.toggle('flipped');
            const rect = card.getBoundingClientRect();
            particleSys.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 16, ['#fde49e', '#f4a8b7', '#ffffff']);

            if (isFlipped) {
                document.body.style.backgroundColor = '#010207';
                setTimeout(() => document.body.style.backgroundColor = '', 300);
            }
        }

        card.addEventListener('click', flipCard);
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                flipCard();
            }
        });

        grid.appendChild(card);
    });

    if (continueBtn) {
        continueBtn.addEventListener('click', () => {
            goToScreen('screen-timeline');
        });
    }

    window.resetMessageCards = function() {
        const cardElements = grid.querySelectorAll('.memory-card');
        cardElements.forEach(c => c.classList.remove('flipped'));
    };
}

// ==========================================================
// 10. SCREEN 6: INTERACTIVE TIMELINE
// ==========================================================
function setupTimeline(particleSys) {
    const timelineList = document.getElementById('timeline-list');
    const continueBtn = document.getElementById('btn-timeline-continue');
    if (!timelineList) return;

    timelineList.innerHTML = '';

    birthdayConfig.timeline.forEach((item, idx) => {
        const row = document.createElement('div');
        row.className = `timeline-item ${idx === 0 ? 'active' : ''}`;

        row.innerHTML = `
            <button class="timeline-node" type="button" aria-label="Toggle memory: ${item.title}">
                <span class="node-dot"></span>
            </button>
            <div class="timeline-card" tabindex="0" role="button" aria-expanded="${idx === 0 ? 'true' : 'false'}">
                <div class="timeline-header">
                    <div>
                        <span class="timeline-tag">${item.tag}</span>
                        <h3 class="timeline-title">${item.title}</h3>
                    </div>
                    <span class="timeline-chevron">▼</span>
                </div>
                <div class="timeline-body">
                    <p>${item.desc}</p>
                </div>
            </div>
        `;

        function toggleItem() {
            const wasActive = row.classList.contains('active');
            row.classList.toggle('active');
            row.querySelector('.timeline-card').setAttribute('aria-expanded', !wasActive);

            const rect = row.getBoundingClientRect();
            particleSys.burst(rect.left + 24, rect.top + 24, 12, ['#fde49e', '#f4a8b7']);
        }

        row.querySelector('.timeline-node').addEventListener('click', toggleItem);
        row.querySelector('.timeline-card').addEventListener('click', toggleItem);
        row.querySelector('.timeline-card').addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleItem();
            }
        });

        timelineList.appendChild(row);
    });

    if (continueBtn) {
        continueBtn.addEventListener('click', () => {
            goToScreen('screen-cake');
        });
    }

    window.resetTimeline = function() {
        const items = timelineList.querySelectorAll('.timeline-item');
        items.forEach((item, idx) => {
            if (idx === 0) item.classList.add('active');
            else item.classList.remove('active');
        });
    };
}

// ==========================================================
// 11. SCREEN 7: BIRTHDAY CAKE & INSTANT CANDLE WISH
// ==========================================================
function setupBirthdayCake(particleSys) {
    const flame = document.getElementById('candle-flame');
    const smoke = document.getElementById('candle-smoke');
    const promptBadge = document.getElementById('cake-prompt-badge');
    const cakeElem = document.getElementById('birthday-cake');
    const darkenOverlay = document.getElementById('screen-darken-overlay');

    if (!flame || !cakeElem) return;
    let isBlown = false;

    function blowOutCandle() {
        if (isBlown) return;
        isBlown = true;
        state.candleBlown = true;

        const rect = flame.getBoundingClientRect();
        const posX = rect.left + rect.width / 2;
        const posY = rect.top + rect.height / 2;

        // 1. Instant flame extinction animation (0ms lag!)
        flame.classList.add('extinguishing');

        // 2. Instant rising smoke
        if (smoke) smoke.classList.remove('hidden');
        if (promptBadge) promptBadge.style.opacity = '0';

        // 3. Instant magical burst of stardust & hearts
        particleSys.burst(posX, posY, 50, ['#fde49e', '#f4a8b7', '#9d8df1', '#ffffff'], { size: 4.5, speed: 5.5, hearts: true });

        // 4. Instant smooth backdrop dim
        if (darkenOverlay) darkenOverlay.classList.add('active');

        // 5. Crisp smooth transition to Screen 8
        setTimeout(() => {
            flame.style.display = 'none';
            if (darkenOverlay) darkenOverlay.classList.remove('active');
            goToScreen('screen-final');
        }, 500);
    }

    flame.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        blowOutCandle();
    });

    cakeElem.addEventListener('pointerdown', (e) => {
        blowOutCandle();
    });

    flame.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            blowOutCandle();
        }
    });

    let touchStartX = 0;
    let touchStartY = 0;
    cakeElem.addEventListener('touchstart', (e) => {
        if (e.touches.length > 0) {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }
    }, { passive: true });

    cakeElem.addEventListener('touchmove', (e) => {
        if (isBlown) return;
        if (e.touches.length > 0) {
            const diffX = Math.abs(e.touches[0].clientX - touchStartX);
            const diffY = Math.abs(e.touches[0].clientY - touchStartY);
            if (diffX > 20 || diffY > 20) {
                blowOutCandle();
            }
        }
    }, { passive: true });

    window.resetCake = function() {
        isBlown = false;
        state.candleBlown = false;
        flame.style.display = 'block';
        flame.classList.remove('extinguishing');
        if (smoke) smoke.classList.add('hidden');
        if (promptBadge) promptBadge.style.opacity = '1';
        if (darkenOverlay) darkenOverlay.classList.remove('active');
    };
}

// ==========================================================
// 12. SCREEN 8: FINAL BIRTHDAY REVEAL & EASTER EGG
// ==========================================================
function setupFinalReveal(particleSys) {
    const finalName = document.getElementById('final-her-name');
    const finalMsgBody = document.getElementById('final-message-content');
    const moonIcon = document.getElementById('easter-egg-moon');
    const modal = document.getElementById('easter-egg-modal');
    const secretText = document.getElementById('secret-message-text');
    const closeBtn = document.getElementById('btn-close-secret');
    const closeActionBtn = document.getElementById('btn-secret-close-action');
    const finalContinueBtn = document.getElementById('btn-final-continue');

    if (finalName) {
        finalName.textContent = birthdayConfig.name;
    }

    if (finalMsgBody) {
        const formattedMsg = birthdayConfig.finalMessage.replace(/\[NAME\]/g, birthdayConfig.name);
        finalMsgBody.textContent = formattedMsg;
    }

    if (secretText) {
        secretText.textContent = birthdayConfig.secretMessage;
    }

    if (moonIcon) {
        moonIcon.addEventListener('click', () => {
            state.moonClickCount++;
            const rect = moonIcon.getBoundingClientRect();
            particleSys.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 10, ['#fde49e', '#80e5ff']);

            if (state.moonClickCount >= 3) {
                moonIcon.classList.add('egg-activated');
                state.starsBrightened = true;
                particleSys.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 40, ['#80e5ff', '#9d8df1', '#fde49e', '#ffffff'], { size: 4 });

                setTimeout(() => {
                    if (modal) modal.classList.remove('hidden');
                }, 600);
            }
        });
    }

    function closeModal() {
        if (modal) modal.classList.add('hidden');
        state.starsBrightened = false;
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (closeActionBtn) closeActionBtn.addEventListener('click', closeModal);
    if (modal) {
        modal.querySelector('.modal-backdrop').addEventListener('click', closeModal);
    }

    if (finalContinueBtn) {
        finalContinueBtn.addEventListener('click', () => {
            goToScreen('screen-question');
        });
    }
}

// ==========================================================
// 13. SCREEN 9: FINAL PHASE - A FINAL THOUGHT & REPLAY
// ==========================================================
function setupFinalQuestion(particleSys) {
    const questionBox = document.getElementById('question-box');
    const btnYes = document.getElementById('btn-question-yes');
    const btnNo = document.getElementById('btn-question-no');
    const envelopeYes = document.getElementById('envelope-answer-yes');
    const confirmNote = document.getElementById('envelope-confirm-note');
    const cardNo = document.getElementById('card-answer-no');
    const replayWrapper = document.getElementById('question-replay-wrapper');
    const replayBtn = document.getElementById('btn-replay-universe');
    const darkenOverlay = document.getElementById('screen-darken-overlay');

    let isAnswered = false;
    let fadeOutTimeout = null;
    let finishTimeout = null;
    let replayTimeout = null;

    function handleAnswer(isYes) {
        if (isAnswered) return;
        isAnswered = true;

        // 1. Fade the question and buttons away
        if (questionBox) {
            questionBox.classList.add('fade-out');
        }

        // 2. Dim background subtly
        if (darkenOverlay) {
            darkenOverlay.classList.add('subtle-dim');
        }

        if (isYes) {
            if (!envelopeYes) return;

            // Step 1: Reveal envelope in open state with letter slid up
            setTimeout(() => {
                if (questionBox) questionBox.classList.add('hidden');
                envelopeYes.classList.remove('hidden', 'closing', 'sealed');
                envelopeYes.classList.add('revealing', 'opened');

                const rect = envelopeYes.getBoundingClientRect();
                const posX = rect.left + rect.width / 2;
                const posY = rect.top + rect.height / 2;
                particleSys.burst(posX, posY, 22, ['#fde49e', '#ffffff', '#f4a8b7', '#80e5ff'], { size: 3.2, speed: 2.2 });
            }, 500);

            // Step 2: After user reads the message, slowly & intentionally animate envelope closing
            fadeOutTimeout = setTimeout(() => {
                envelopeYes.classList.remove('opened');
                envelopeYes.classList.add('closing');

                const rect = envelopeYes.getBoundingClientRect();
                const posX = rect.left + rect.width / 2;
                const posY = rect.top + rect.height / 2;
                particleSys.burst(posX, posY, 10, ['#fde49e', '#ffffff'], { size: 2, speed: 1 });
            }, 4400);

            // Step 3: Transition to closed envelope with subtle green glow and check mark
            finishTimeout = setTimeout(() => {
                envelopeYes.classList.remove('closing');
                envelopeYes.classList.add('sealed');

                const rect = envelopeYes.getBoundingClientRect();
                const posX = rect.left + rect.width / 2;
                const posY = rect.top + rect.height / 2;
                particleSys.burst(posX, posY, 28, ['#4ade80', '#86efac', '#fde49e', '#ffffff'], { size: 3.2, speed: 2.4 });

                if (confirmNote) {
                    confirmNote.classList.remove('hidden');
                    confirmNote.classList.add('fade-in');
                }

                // Smoothly reveal replay button below without removing the closed envelope card
                replayTimeout = setTimeout(() => {
                    if (replayWrapper) {
                        replayWrapper.classList.remove('hidden');
                        replayWrapper.classList.add('fade-in');
                    }
                }, 1000);
            }, 5700);

        } else {
            // NO path: playful & warm animation
            if (!cardNo) return;

            setTimeout(() => {
                if (questionBox) questionBox.classList.add('hidden');
                cardNo.classList.remove('hidden');
                void cardNo.offsetWidth;
                cardNo.classList.add('revealing');

                const rect = cardNo.getBoundingClientRect();
                const posX = rect.left + rect.width / 2;
                const posY = rect.top + rect.height / 2;
                particleSys.burst(posX, posY, 16, ['#f4a8b7', '#fde49e', '#ffffff'], { size: 2.8, speed: 1.6 });
            }, 500);

            // Disappear smoothly after few seconds
            fadeOutTimeout = setTimeout(() => {
                cardNo.classList.remove('revealing');
                cardNo.classList.add('dissolving');

                const rect = cardNo.getBoundingClientRect();
                const posX = rect.left + rect.width / 2;
                const posY = rect.top + rect.height / 2;
                particleSys.burst(posX, posY, 8, ['#fde49e', '#ffffff'], { size: 2, speed: 0.8 });
            }, 4500);

            // Smooth transition to replay button
            finishTimeout = setTimeout(() => {
                cardNo.classList.add('hidden');
                cardNo.classList.remove('dissolving');

                if (darkenOverlay) {
                    darkenOverlay.classList.remove('subtle-dim');
                }

                if (replayWrapper) {
                    replayWrapper.classList.remove('hidden');
                    replayWrapper.classList.add('fade-in');
                }
            }, 6500);
        }
    }

    if (btnYes) {
        btnYes.addEventListener('click', () => handleAnswer(true));
    }

    if (btnNo) {
        btnNo.addEventListener('click', () => handleAnswer(false));
    }

    function triggerFullReplay() {
        if (fadeOutTimeout) clearTimeout(fadeOutTimeout);
        if (finishTimeout) clearTimeout(finishTimeout);
        if (replayTimeout) clearTimeout(replayTimeout);

        isAnswered = false;
        state.moonClickCount = 0;
        state.unlockedScreenIndex = 0;

        const moonIcon = document.getElementById('easter-egg-moon');
        if (moonIcon) moonIcon.classList.remove('egg-activated');

        if (window.resetConstellation) window.resetConstellation();
        if (window.resetPhotoReveal) window.resetPhotoReveal();
        if (window.resetMusicPlayer) window.resetMusicPlayer();
        if (window.resetMessageCards) window.resetMessageCards();
        if (window.resetTimeline) window.resetTimeline();
        if (window.resetCake) window.resetCake();
        if (window.resetFinalQuestion) window.resetFinalQuestion();

        goToScreen('screen-intro');
    }

    if (replayBtn) {
        replayBtn.addEventListener('click', triggerFullReplay);
    }

    window.resetFinalQuestion = function() {
        if (fadeOutTimeout) clearTimeout(fadeOutTimeout);
        if (finishTimeout) clearTimeout(finishTimeout);
        if (replayTimeout) clearTimeout(replayTimeout);

        isAnswered = false;

        if (questionBox) {
            questionBox.classList.remove('fade-out', 'hidden');
        }

        if (envelopeYes) {
            envelopeYes.classList.add('hidden');
            envelopeYes.classList.remove('revealing', 'opened', 'closing', 'sealed');
        }

        if (confirmNote) {
            confirmNote.classList.add('hidden');
            confirmNote.classList.remove('fade-in');
        }

        if (cardNo) {
            cardNo.classList.add('hidden');
            cardNo.classList.remove('revealing', 'dissolving');
        }

        if (replayWrapper) {
            replayWrapper.classList.add('hidden');
            replayWrapper.classList.remove('fade-in');
        }

        if (darkenOverlay) {
            darkenOverlay.classList.remove('subtle-dim');
        }
    };
}

// ==========================================================
// 14. APP INITIALIZATION ENTRY POINT
// ==========================================================
document.addEventListener('DOMContentLoaded', () => {
    // 1. Starfield Canvas Background
    const starfield = new Starfield('starfield-canvas');

    // 2. Global Particle Canvas
    const particleSys = new ParticleSystem('particle-canvas');

    // 3. Desktop Cursor & Universal Tap-to-Stardust
    setupCursorAndTouches(particleSys);

    // 4. Screen 1: Intro / Universe
    setupScreenIntro(particleSys);

    // 5. Screen 2: Interactive Constellation
    setupConstellation(particleSys);

    // 6. Screen 3: Photo Reveal & Tap Stardust
    setupPhotoReveal(particleSys);

    // 7. Screen 4: Music Player
    setupMusicPlayer(particleSys);

    // 8. Screen 5: Message Cards (Phase 04)
    setupMessageCards(particleSys);

    // 9. Screen 6: Interactive Timeline
    setupTimeline(particleSys);

    // 10. Screen 7: Birthday Cake & Instant Wish
    setupBirthdayCake(particleSys);

    // 11. Screen 8: Final Birthday Reveal
    setupFinalReveal(particleSys);

    // 12. Screen 9: Final Question & Replay
    setupFinalQuestion(particleSys);

    console.log("✨ A Little Universe Made For You is ready.");
});
