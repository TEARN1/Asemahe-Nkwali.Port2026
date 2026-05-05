import { setGalaxyState, updateStarColors, rebuildShapes, setTargetSpeed, getTargetSpeed, takeScreenshot } from './galaxy.js';

// --- THEME DATA ---
const themes = {
    default: {
        p: '#00f2ff', s: '#7000ff', stars: [0xffffff, 0x00f2ff, 0x7000ff],
        font: "'Space Grotesk', sans-serif", radius: '16px', radiusSm: '8px',
        transform: 'uppercase', style: 'normal', blur: '12px', spacing: '1px'
    },
    terminal: {
        p: '#00FF41', s: '#003B00', stars: [0x00FF41, 0x008F11, 0x003B00],
        font: "'Courier Prime', monospace", radius: '0px', radiusSm: '0px',
        transform: 'none', style: 'normal', blur: '2px', spacing: '0px',
        bgDark: 'radial-gradient(circle at center, #001100 0%, #000000 100%)'
    },
    logistics: {
        p: '#0055ff', s: '#002266', stars: [0xffffff, 0x0055ff, 0x002266],
        font: "'Work Sans', sans-serif", radius: '4px', radiusSm: '2px',
        transform: 'uppercase', style: 'normal', blur: '15px', spacing: '1px',
        bgDark: 'radial-gradient(circle at center, #001133 0%, #000000 100%)'
    },
    matrix: {
        p: '#00FF41', s: '#008F11', stars: [0x00FF41, 0x008F11, 0x003B00],
        font: "'Courier Prime', monospace", radius: '0px', radiusSm: '0px',
        transform: 'uppercase', style: 'normal', blur: '0px', spacing: '2px'
    }
};

let currentBrand = 'default';
let isDarkMode = true;

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    emailjs.init("wZ2bF3cSKuEfDbcsu"); // Initialize with your key
    initTheme();
    initCursor();
    initScrollReveal();
    initInteraction();
    initChatbot();
    initMusic();
    initForms();
    initGatekeeper();
    initPreloader();
    initCommandPalette();
    initTerminal();
    initRecruiterMode();
    initDiagnostics();
    initSimulations();
    initHeroLog();
    initShipmentTracker();
    initFocusToggle();
    initClock();
    initScrollProgress();
    initExpTimer();
    initProjectFilters();
    initAnalytics();
});

// --- ADVANCED ANALYTICS ENGINE ---
// NOTE: To enable persistent database logging, initialize Supabase below.
// Tables required:
// 1. analytics_sessions (id, started_at, ended_at, duration, user_agent, clicks_count)
// 2. analytics_events (session_id, event_type, target_text, timestamp)

const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
const supabase = (typeof createClient !== 'undefined') ? createClient(supabaseUrl, supabaseKey) : null;

const sessionData = {
    id: crypto.randomUUID(),
    startTime: Date.now(),
    clicks: [],
    path: [window.location.pathname],
    isSent: false
};

function initAnalytics() {
    // 1. Track Clicks
    document.addEventListener('click', (e) => {
        const target = e.target.closest('button, a, .card, .skill-tag');
        if (target) {
            const event = {
                type: 'click',
                text: target.innerText?.trim() || target.getAttribute('aria-label') || target.id,
                time: new Date().toISOString()
            };
            sessionData.clicks.push(event);
            if (supabase) supabase.from('analytics_events').insert([{ session_id: sessionData.id, ...event }]);
        }
    });

    // 2. Track Mode Switches
    const slider = document.getElementById('focus-slider');
    if (slider) {
        slider.addEventListener('change', () => {
            const mode = slider.checked ? 'TECH' : 'LOGISTICS';
            sessionData.clicks.push({ type: 'mode_switch', text: mode, time: new Date().toISOString() });
        });
    }

    // 3. Auto-Log Session Start
    if (supabase) {
        supabase.from('analytics_sessions').insert([{
            id: sessionData.id,
            started_at: new Date(sessionData.startTime).toISOString(),
            user_agent: navigator.userAgent
        }]);
    }

    // 4. Send Report on Exit (Reliable visibility change)
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden' && !sessionData.isSent) {
            sendFinalReport();
        }
    });
}

function sendFinalReport() {
    sessionData.isSent = true;
    const duration = Math.floor((Date.now() - sessionData.startTime) / 1000);
    const clickSummary = sessionData.clicks.map(c => `[${c.type}] ${c.text}`).join(' -> ');

    const reportParams = {
        session_id: sessionData.id,
        duration: `${duration} seconds`,
        interactions: sessionData.clicks.length,
        click_path: clickSummary || 'No interactions',
        user_agent: navigator.userAgent,
        to_email: 'asemahlenkwali@gmail.com' // Send to you
    };

    // 1. Update Supabase
    if (supabase) {
        supabase.from('analytics_sessions').update({
            ended_at: new Date().toISOString(),
            duration: duration,
            clicks_count: sessionData.clicks.length
        }).eq('id', sessionData.id);
    }

    // 2. Send Email Insight via EmailJS
    // Note: This relies on an EmailJS template 'session_report' existing
    emailjs.send('service_07w6w6d', 'template_session_report', reportParams)
        .then(() => console.log('Analytics: Insight transmitted successfully.'))
        .catch(err => console.warn('Analytics: Transmission deferred.'));
}

// --- PROJECT FILTERS ---
function initProjectFilters() {
    const btns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.project-card-container');

    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            btns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            cards.forEach(card => {
                const tags = card.getAttribute('data-tags') || '';
                if(filter === 'all' || tags.includes(filter)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
            playSound('click');
        });
    });
}

// --- EXPERIENCE TIMER ---
function initExpTimer() {
    const timer = document.getElementById('exp-timer');
    const startDate = new Date('2024-05-01'); // May 2024
    const update = () => {
        const now = new Date();
        const diff = now - startDate;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const mins = Math.floor((diff / (1000 * 60)) % 60);
        const secs = Math.floor((diff / 1000) % 60);
        timer.innerText = `${days} DAYS | ${hours}h ${mins}m ${secs}s`;
    };
    setInterval(update, 1000);
    update();
}

// --- SCROLL PROGRESS ---
function initScrollProgress() {
    const bar = document.getElementById('scroll-progress');
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        bar.style.width = scrolled + "%";
    });
}

// --- SYSTEM CLOCK ---
function initClock() {
    const timeEl = document.getElementById('local-time');
    const update = () => {
        const now = new Date();
        timeEl.innerText = now.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };
    setInterval(update, 1000);
    update();
}

// --- FOCUS TOGGLE ---
function initFocusToggle() {
    const slider = document.getElementById('focus-slider');
    const labelL = document.getElementById('label-logistics');
    const labelT = document.getElementById('label-tech');
    const hudStat = document.querySelector('.mode-specific-stat');

    slider.addEventListener('change', () => {
        const isTech = slider.checked;

        // VISUAL OVERRIDE: Add transition class
        document.body.classList.add('mode-switching');

        // SOUND OVERRIDE
        playModeSound(isTech ? 'tech' : 'logistics');

        setTimeout(() => {
            labelL.classList.toggle('active', !isTech);
            labelT.classList.toggle('active', isTech);

            document.body.classList.toggle('tech-mode', isTech);
            document.body.classList.toggle('logistics-mode', !isTech);

            // Update HUD
            if(hudStat) {
                hudStat.innerText = isTech ? "SERVER_PINGS: <0.02ms" : "INV_ACCURACY: 99.5%";
            }

            applyTheme(); // Refresh variables

            document.body.classList.remove('mode-switching');
        }, 300);

        playSound('click');
    });
}

function playModeSound(mode) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (mode === 'logistics') {
        // Deep mechanical thud
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(60, now);
        osc.frequency.exponentialRampToValueAtTime(30, now + 0.5);
    } else {
        // High digital ping
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.3);
    }

    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    osc.start();
    osc.stop(now + 0.5);
}

// --- SHIPMENT TRACKER ---
function initShipmentTracker() {
    const tracker = document.getElementById('shipment-tracker');
    const steps = [
        document.getElementById('step-1'),
        document.getElementById('step-2'),
        document.getElementById('step-3'),
        document.getElementById('step-4'),
        document.getElementById('step-5')
    ];

    // Show tracker after hero log finishes
    setTimeout(() => {
        tracker.style.display = 'block';
        let current = 0;
        const interval = setInterval(() => {
            steps.forEach(s => s.classList.remove('active'));
            steps[current].classList.add('active');
            current++;
            if(current >= steps.length) current = 0;
        }, 5000);
    }, 5000);
}

// --- HERO LOG ---
function initHeroLog() {
    const log = document.getElementById('hero-log');
    const messages = [
        "INITIALIZING ASEMAHLE.OS...",
        "LOADING LOGISTICS KERNEL...",
        "SYNCING MSD 365 MASTER DATA...",
        "ESTABLISHING FULL-STACK UPLINK...",
        "SYSTEM OPTIMIZED. WELCOME."
    ];
    let i = 0;
    const interval = setInterval(() => {
        log.innerText = messages[i];
        i++;
        if(i >= messages.length) clearInterval(interval);
    }, 1000);
}

// --- PROJECT SIMULATIONS ---
function initSimulations() {
    const bars = document.querySelectorAll('#dashboard-sim .chart-bar');
    setInterval(() => {
        bars.forEach(bar => {
            const h = Math.floor(Math.random() * 80) + 10;
            bar.style.height = `${h}%`;
        });
    }, 2000);
}

// --- SKILL DIAGNOSTICS ---
function initDiagnostics() {
    const overlay = document.getElementById('diagnostic-overlay');
    const tags = document.querySelectorAll('.skill-tag, .skill-badge');

    tags.forEach(tag => {
        tag.addEventListener('click', () => {
            const skill = tag.textContent.trim();
            overlay.style.display = 'block';
            overlay.innerHTML = `RUNNING DIAGNOSTIC...<br>SKILL: ${skill}<br>STATUS: EXPERT / CERTIFIED`;

            setTimeout(() => {
                overlay.style.display = 'none';
            }, 3000);

            playSound('hover');
        });
    });
}

// --- RECRUITER MODE ---
function initRecruiterMode() {
    const btn = document.getElementById('recruiter-btn');
    const sections = [
        document.getElementById('experience'),
        document.getElementById('skills'),
        document.getElementById('contact')
    ];

    btn.addEventListener('click', () => {
        const isHighlighting = btn.classList.toggle('active');
        btn.innerText = isHighlighting ? "Exit Fast-Track" : "Fast-Track for Recruiters ⚡";

        sections.forEach(sec => {
            if (sec) sec.classList.toggle('recruiter-highlight', isHighlighting);
        });

        if (isHighlighting) {
            document.getElementById('experience').scrollIntoView({behavior: 'smooth'});
            playSound('click');
        }
    });
}

// --- LOGISTICS TERMINAL ---
function initTerminal() {
    const terminal = document.getElementById('logistics-terminal');
    const logs = [
        "Analyzing CCBSA throughput latency...",
        "Optimizing Blue Yonder picking paths...",
        "Validating MSD 365 recursive logic fixed...",
        "Scanning for inventory discrepancies... None found.",
        "System efficiency audit: 100% operational.",
        "Warp drive initialized for career acceleration.",
        "Connecting to Midrand logistics hub...",
        "Processing primary distribution manifests...",
        "Syncing with Secondary Distribution (SD) flows..."
    ];

    setInterval(() => {
        const line = document.createElement('div');
        line.className = 'terminal-line';
        line.innerHTML = `${logs[Math.floor(Math.random() * logs.length)]} <span class="status-tag">OK</span>`;
        terminal.appendChild(line);
        terminal.scrollTop = terminal.scrollHeight;
        if(terminal.children.length > 10) terminal.removeChild(terminal.firstChild);
    }, 4000);
}

// --- COMMAND PALETTE ---
function initCommandPalette() {
    const cp = document.getElementById('command-palette');
    const input = document.getElementById('cp-input');
    const results = document.getElementById('cp-results');

    const triggerTruck = () => {
        const truck = document.getElementById('truck-easter-egg');
        truck.style.left = '110vw';
        setTimeout(() => { truck.style.left = '-300px'; }, 4500);
        playSound('click');
    };

    const commands = [
        { name: 'Go to Home', action: () => window.scrollTo({top: 0, behavior: 'smooth'}), key: 'H' },
        { name: 'View Projects', action: () => document.getElementById('projects').scrollIntoView({behavior: 'smooth'}), key: 'P' },
        { name: 'Skills & Tech Stack', action: () => document.getElementById('about').scrollIntoView({behavior: 'smooth'}), key: 'S' },
        { name: 'Target Roles', action: () => document.getElementById('career-focus').scrollIntoView({behavior: 'smooth'}), key: 'R' },
        { name: 'Contact Info', action: () => document.getElementById('contact').scrollIntoView({behavior: 'smooth'}), key: 'C' },
        { name: 'Toggle Theme Mode', action: () => document.getElementById('mode-toggle').click(), key: 'M' },
        { name: 'Download CV', action: () => window.print(), key: 'D' },
        { name: 'Deploy Shipment (Easter Egg)', action: () => triggerTruck(), key: 'SHIP' }
    ];

    window.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            cp.classList.add('open');
            input.focus();
        }
        if (e.key === 'Escape') cp.classList.remove('open');
    });

    input.addEventListener('input', () => {
        const query = input.value.toLowerCase();
        results.innerHTML = '';
        const filtered = commands.filter(c => c.name.toLowerCase().includes(query));
        filtered.forEach(c => {
            const div = document.createElement('div');
            div.className = 'cp-item';
            div.innerHTML = `<span>${c.name}</span> <span class="cp-shortcut">${c.key}</span>`;
            div.onclick = () => { c.action(); cp.classList.remove('open'); input.value = ''; };
            results.appendChild(div);
        });
    });

    // Populate initial list
    input.dispatchEvent(new Event('input'));
}

// --- THEME ENGINE ---
function initTheme() {
    const brandSelect = document.getElementById('brand-select');
    const modeToggle = document.getElementById('mode-toggle');
    const screenshotBtn = document.getElementById('screenshot-btn');

    brandSelect.addEventListener('change', (e) => {
        currentBrand = e.target.value;
        applyTheme();
    });

    modeToggle.addEventListener('click', () => {
        isDarkMode = !isDarkMode;
        modeToggle.innerText = isDarkMode ? '☀' : '☾';
        applyTheme();
    });

    screenshotBtn.addEventListener('click', () => {
        const dataURL = takeScreenshot();
        const link = document.createElement('a');
        link.download = `portfolio-hologram-${Date.now()}.png`;
        link.href = dataURL;
        link.click();
    });

    // Initial check for day/night
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 18) {
        isDarkMode = false;
        modeToggle.innerText = '☾';
    }
    applyTheme();
}

function applyTheme() {
    const theme = themes[currentBrand];
    const target = document.body.style;
    document.body.setAttribute('data-brand', currentBrand);
    document.body.setAttribute('data-profile', currentBrand === 'default' ? 'terminal' : currentBrand);

    target.setProperty('--primary', theme.p);
    target.setProperty('--secondary', theme.s);
    target.setProperty('--accent-color', theme.p);
    target.setProperty('--font-primary', theme.font);
    target.setProperty('--border-radius-lg', theme.radius);
    target.setProperty('--border-radius-sm', theme.radiusSm);
    target.setProperty('--heading-transform', theme.transform);
    target.setProperty('--heading-style', theme.style);
    target.setProperty('--glass-blur', theme.blur);
    target.setProperty('--letter-spacing', theme.spacing);

    if (isDarkMode) {
        target.setProperty('--text-main', '#ffffff');
        target.setProperty('--text-muted', '#a0a0a0');
        target.setProperty('--glass-bg', 'rgba(20, 20, 35, 0.4)');
        target.setProperty('--bg-gradient', theme.bgDark || 'radial-gradient(circle at center, #1a1a2e 0%, #000000 100%)');
        target.setProperty('--bg-panel', 'rgba(0, 0, 0, 0.5)');
    } else {
        target.setProperty('--text-main', '#1a1a1a');
        target.setProperty('--text-muted', '#555555');
        target.setProperty('--glass-bg', 'rgba(255, 255, 255, 0.6)');
        target.setProperty('--bg-gradient', 'radial-gradient(circle at center, #f0f4f8 0%, #d9e2ec 100%)');
        target.setProperty('--bg-panel', 'rgba(255, 255, 255, 0.85)');
    }

    setGalaxyState(currentBrand, isDarkMode);
    updateStarColors(theme.stars, isDarkMode);
    rebuildShapes(currentBrand, theme, isDarkMode);
}

// --- CURSOR ---
function initCursor() {
    const dot = document.querySelector('[data-cursor-dot]');
    const outline = document.querySelector('[data-cursor-outline]');

    // Accessibility
    dot.setAttribute('aria-hidden', 'true');
    outline.setAttribute('aria-hidden', 'true');

    window.addEventListener('mousemove', (e) => {
        dot.style.left = `${e.clientX}px`;
        dot.style.top = `${e.clientY}px`;
        outline.animate({ left: `${e.clientX}px`, top: `${e.clientY}px` }, { duration: 500, fill: "forwards" });
    });

    const interactive = document.querySelectorAll('a, button, select, input, textarea, .card');
    interactive.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
    });
}

// --- SCROLL REVEAL ---
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) entry.target.classList.add('active');
        });
    }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });

    revealElements.forEach(el => observer.observe(el));
}

// --- INTERACTION ---
function initInteraction() {
    // Holographic Scan Effect
    const profileImg = document.querySelector('.profile-photo');
    if (profileImg) {
        profileImg.addEventListener('mouseenter', () => document.body.classList.add('scanning'));
        profileImg.addEventListener('mouseleave', () => document.body.classList.remove('scanning'));
    }

    // 3D Tilt
    const cards = document.querySelectorAll('.card:not(.project-card-front):not(.project-card-back), .project-card-container');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });

    // Magnetic Buttons
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });

    // Flip Cards
    document.querySelectorAll('.project-card-container').forEach(container => {
        container.addEventListener('click', (e) => {
            if(e.target.tagName === 'A' || e.target.classList.contains('preview-btn')) return;
            container.classList.toggle('flipped');
            playSound('click');
        });
    });

    // Preview Modal
    const modal = document.getElementById('preview-modal');
    const frame = document.getElementById('preview-frame');
    document.querySelectorAll('.preview-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const url = btn.closest('.project-card-container').getAttribute('data-url');
            if(url && url !== '#') {
                frame.src = url;
                modal.style.display = 'flex';
            } else {
                alert("Preview not available for this project.");
            }
        });
    });
    document.getElementById('close-preview').addEventListener('click', () => {
        modal.style.display = 'none';
        frame.src = '';
    });

    // Warp Button
    const warpBtn = document.getElementById('warpBtn');
    warpBtn.addEventListener('click', () => {
        const isWarp = getTargetSpeed() > 1;
        setTargetSpeed(isWarp ? 0.2 : 10.0);
        warpBtn.innerText = isWarp ? "Engage Warp Speed" : "Disengage Warp";
    });

    // Wind Toggle
    const windTrigger = document.getElementById('wind-trigger');
    let windActive = false;
    windTrigger.addEventListener('click', () => {
        windActive = !windActive;
        windTrigger.classList.toggle('active', windActive);
        document.querySelectorAll('.wind-affected').forEach((card, i) => {
            setTimeout(() => {
                if(windActive) card.classList.add('wind-active');
                else card.classList.remove('wind-active');
            }, i * 50);
        });
        setTargetSpeed(windActive ? 15.0 : 0.2);
    });

    // Hamburger
    const hamburger = document.getElementById('hamburger-btn');
    const navLinks = document.querySelector('.nav-links');
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
    });

    // Hacker Bio
    const hackerBio = document.getElementById('hacker-bio');
    hackerBio.addEventListener('click', () => {
        const original = hackerBio.innerText;
        let iter = 0;
        const interval = setInterval(() => {
            hackerBio.innerText = original.split('').map((l, i) => i < iter ? original[i] : String.fromCharCode(65 + Math.random() * 26)).join('');
            if(iter >= original.length) clearInterval(interval);
            iter += 2;
        }, 20);
    });

    // Skill Filter
    const skillTags = document.querySelectorAll('.skill-tag');
    const projectCards = document.querySelectorAll('.project-grid .project-card-container');
    skillTags.forEach(tag => {
        tag.addEventListener('click', () => {
            const isActive = tag.classList.contains('active-filter');
            skillTags.forEach(t => t.classList.remove('active-filter'));
            if (!isActive) {
                tag.classList.add('active-filter');
                const filter = tag.textContent.toLowerCase().split(' ')[0];
                projectCards.forEach(card => {
                    const tags = card.getAttribute('data-tags') || '';
                    card.style.display = tags.includes(filter) ? 'flex' : 'none';
                });
            } else {
                projectCards.forEach(card => card.style.display = 'flex');
            }
        });
    });
}

// --- AUDIO FEEDBACK ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playSound(type) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain); gain.connect(audioCtx.destination);

    if (type === 'hover') {
        osc.type = 'sine'; osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.1);
        gain.gain.setValueAtTime(0.01, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.start(); osc.stop(now + 0.1);
    } else if (type === 'click') {
        osc.type = 'triangle'; osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.15);
        gain.gain.setValueAtTime(0.05, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.start(); osc.stop(now + 0.15);
    }
}

// --- CHATBOT ---
function initChatbot() {
    const btn = document.getElementById('chatbot-btn');
    const win = document.getElementById('chat-window');
    const input = document.getElementById('chat-input');
    const send = document.getElementById('chat-send');
    const messages = document.getElementById('chat-messages');

    btn.addEventListener('click', () => win.classList.toggle('open'));
    document.getElementById('close-chat').addEventListener('click', () => win.classList.remove('open'));

    function addMsg(text, sender) {
        const div = document.createElement('div');
        div.className = `chat-msg ${sender}`; div.textContent = text;
        messages.appendChild(div); messages.scrollTop = messages.scrollHeight;
    }

    function handleChat() {
        const text = input.value.trim();
        if(!text) return;
        addMsg(text, 'user'); input.value = '';
        setTimeout(() => addMsg(getAIResponse(text), 'bot'), 500);
    }

    send.addEventListener('click', handleChat);
    input.addEventListener('keypress', (e) => e.key === 'Enter' && handleChat());
}

function getAIResponse(input) {
    const text = input.toLowerCase();
    if (text.includes('who') || text.includes('name')) return "I am Asemahle Nkwali's digital assistant. He is a Systems Architect, Full-Stack Developer, and GenAI Architect based in Johannesburg.";
    if (text.includes('skill') || text.includes('stack')) return "He specializes in React, Next.js, Neuro-symbolic AI, and Logistics Systems like MSD 365, Blue Yonder, and Outperform. He even understands physical operations, like Forklift Operation!";
    if (text.includes('contact') || text.includes('email')) return "You can reach him at asemahlenkwali@gmail.com or +27 69 457 8973. He is currently a Logistics Support Controller at CCBSA.";
    if (text.includes('certification') || text.includes('cert')) return "Asemahle is certified in GenAI (WeThinkCode_), Data Engineering on Azure (Microsoft), and holds a Management Higher Certificate.";
    if (text.includes('coke') || text.includes('coca-cola') || text.includes('bottle')) return "Asemahle was a key planner for Coca-Cola, optimizing production lines and ensuring 98% on-time delivery. Check out the moving conveyor belt in his experience section!";
    if (text.includes('joke')) return "Why do programmers prefer dark mode? Because light attracts bugs.";
    return "I'm not sure about that, but you should check out his work reducing decision latency by 40% at CCBSA or his Nomimi AI project.";
}

// --- MUSIC ---
function initMusic() {
    const btn = document.getElementById('play-music-btn');
    const audio = document.getElementById('bg-music');
    const status = btn.nextElementSibling.querySelector('span');
    let isPlaying = false;

    btn.addEventListener('click', () => {
        if(!isPlaying) {
            audio.play(); btn.innerText = "⏸";
            status.innerText = "LIVE"; status.style.color = "#00ff00";
        } else {
            audio.pause(); btn.innerText = "▶";
            status.innerText = "OFFLINE"; status.style.color = "var(--primary)";
        }
        isPlaying = !isPlaying;
    });
}

// --- FORMS ---
function initForms() {
    const form = document.querySelector('.contact-form');
    const btn = form.querySelector('button');

    btn.addEventListener('click', () => {
        const name = document.getElementById('from_name').value;
        const email = document.getElementById('from_email').value;
        const message = document.getElementById('message').value;

        if(!name || !email || !message) return alert("Please fill in required fields.");

        btn.innerText = "Transmitting...";
        btn.disabled = true;

        const duration = Math.floor((Date.now() - sessionData.startTime) / 1000);
        const templateParams = {
            from_name: name,
            from_email: email,
            reply_to: email,
            message: `${message}\n\n--- RECRUITER INSIGHTS ---\n- Session Duration: ${duration}s\n- Click Path: ${sessionData.clicks.map(c => c.text).join(' -> ')}`
        };

        emailjs.send('service_07w6w6d', 'template_dpzjmqc', templateParams)
            .then(() => {
                btn.innerText = "Transmission Sent";
                form.reset();
                setTimeout(() => { btn.innerText = "Send Transmission"; btn.disabled = false; }, 3000);
            })
            .catch((err) => {
                console.error("EmailJS Error:", err);
                btn.innerText = "Transmission Failed";
                btn.style.background = "#ff0000";
                setTimeout(() => { btn.innerText = "Send Transmission"; btn.disabled = false; btn.style.background = ""; }, 3000);
            });
    });
}

// --- GATEKEEPER ---
function initGatekeeper() {
    const btn = document.getElementById('unlock-btn');
    const overlay = document.getElementById('gatekeeper-overlay');
    if (sessionStorage.getItem('portfolio_unlocked')) {
        overlay.style.display = 'none';
        document.body.classList.remove('locked');
    }
    btn.addEventListener('click', () => {
        const name = document.getElementById('visitor_name').value;
        if(!name) return alert("Identification required.");
        sessionStorage.setItem('portfolio_unlocked', 'true');
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.style.display = 'none';
            document.body.classList.remove('locked');
        }, 800);
    });
}

// --- PRELOADER ---
function initPreloader() {
    window.addEventListener('load', () => {
        const preloader = document.getElementById('preloader');
        const bar = document.getElementById('progress-bar');
        if(bar) bar.style.width = '100%';
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => preloader.style.visibility = 'hidden', 800);
        }, 2000);
    });
}

// Global functions for inline HTML calls (if any)
window.toggleExpand = (id, btn) => {
    const content = document.getElementById(id);
    const isShowing = content.classList.toggle('show');
    btn.textContent = isShowing ? 'Show Fewer Roles' : 'Read More Roles';
};
