// Custom cursor
const cursor = document.getElementById('cursor');
const cursorBlur = document.getElementById('cursor-blur');

document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    cursorBlur.style.left = e.clientX + 'px';
    cursorBlur.style.top = e.clientY + 'px';
});

document.querySelectorAll('a, button, .btn-primary, .btn-outline, .channel').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'scale(1.8)';
        cursor.style.background = '#e63946';
        cursorBlur.style.transform = 'scale(0.5)';
    });
    el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'scale(1)';
        cursor.style.background = '#ff1744';
        cursorBlur.style.transform = 'scale(1)';
    });
});

// Typewriter effect
const words = ['experiencias digitales', 'arquitecturas robustas', 'productos escalables', 'código impecable'];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
const el = document.getElementById('typewriter');

function type() {
    const current = words[wordIndex];
    if (!isDeleting) {
        el.textContent = current.substring(0, charIndex + 1);
        charIndex++;
        if (charIndex === current.length) {
            isDeleting = true;
            setTimeout(type, 2000);
            return;
        }
    } else {
        el.textContent = current.substring(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
        }
    }
    setTimeout(type, isDeleting ? 40 : 80);
}
type();

// Mobile menu toggle
document.querySelector('.menu-toggle')?.addEventListener('click', () => {
    document.querySelector('#navbar ul').classList.toggle('open');
});

// Particle canvas
const canvas = document.createElement('canvas');
canvas.style.cssText = 'position:fixed;inset:0;z-index:0;pointer-events:none;opacity:0.3';
document.body.prepend(canvas);
const ctx = canvas.getContext('2d');
let particles = [];

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

class Particle {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.4 + 0.1;
        this.hue = Math.random() < 0.33 ? 0 : Math.random() < 0.5 ? 45 : 270;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        const colors = { 0: '255,23,68', 45: '123,47,247', 270: '123,47,247' };
        ctx.fillStyle = `rgba(${colors[this.hue] || '255,23,68'}, ${this.opacity})`;
        ctx.fill();
    }
}

function init() {
    resize();
    particles = Array.from({ length: 50 }, () => new Particle());
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(255,23,68, ${0.03 * (1 - dist / 120)})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(animate);
}

init();
animate();
window.addEventListener('resize', resize);

// Counters animation
const statNumbers = document.querySelectorAll('.stat-number');
let countersDone = false;

function runCounters() {
    if (countersDone) return;
    countersDone = true;
    statNumbers.forEach(el => {
        const target = parseInt(el.dataset.target);
        const duration = 1600;
        const start = performance.now();
        function tick(now) {
            const t = Math.min((now - start) / duration, 1);
            const ease = 1 - Math.pow(1 - t, 3);
            el.textContent = Math.floor(ease * target) + '+';
            if (t < 1) requestAnimationFrame(tick);
            else el.textContent = target + '+';
        }
        requestAnimationFrame(tick);
    });
}

// Skill bars animation
const fills = document.querySelectorAll('.fill');
let barsDone = false;

function runBars() {
    if (barsDone) return;
    barsDone = true;
    fills.forEach(bar => {
        const w = bar.dataset.width || bar.style.width.replace('%', '');
        bar.style.width = '0%';
        setTimeout(() => { bar.style.width = w + '%'; }, 200);
    });
}

// Scroll reveal observer
const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        if (entry.target.closest('#stats')) runCounters();
        if (entry.target.closest('#skills')) runBars();
    });
}, { threshold: 0.2 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Nav active link observer
const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            const link = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
            if (link) link.classList.add('active');
        }
    });
}, { threshold: 0.3 });

document.querySelectorAll('section[id]').forEach(s => navObserver.observe(s));

// Navbar hide/show on scroll
let lastY = 0;
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    const cur = window.scrollY;
    nav.style.transform = cur > lastY && cur > 120 ? 'translateY(-100%)' : 'translateY(0)';
    lastY = cur;
});
