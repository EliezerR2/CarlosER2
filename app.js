// API endpoint - deploy api/comments.php to a PHP host and change this URL
const API_URL = 'http://localhost:8000/api/comments.php';

// ==================== COMMENTS (PHP API) ====================

async function fetchComments() {
    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error('API not available');
        const comments = await res.json();
        renderComments(comments);
    } catch {
        // API not available — keep default static testimonials
        console.log('Comments API not available, using static testimonials');
    }
}

function renderComments(comments) {
    const container = document.getElementById('commentsContainer');
    if (!comments.length) return;
    container.innerHTML = comments.map(c => {
        const stars = '★'.repeat(c.rating) + '☆'.repeat(5 - c.rating);
        const initials = c.initials || c.name.substring(0, 2).toUpperCase();
        const roleCompany = c.role + (c.company ? ' · ' + c.company : '');
        return `
        <div class="comment-card">
            <div class="comment-header">
                <div class="author-avatar" style="background:linear-gradient(135deg,${randomColor()},${randomColor()})">${initials}</div>
                <div>
                    <strong>${c.name}</strong>
                    <span>${roleCompany}</span>
                </div>
                <div class="comment-rating">${stars}</div>
            </div>
            <p>"${c.message}"</p>
        </div>`;
    }).join('');
}

function randomColor() {
    const colors = ['#ff1744', '#7b2ff7', '#c4001d', '#5a1fc7', '#ff1744'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Comment form
document.getElementById('commentForm')?.addEventListener('submit', async e => {
    e.preventDefault();
    const status = document.getElementById('commentStatus');
    const btn = e.target.querySelector('button');
    btn.disabled = true;
    btn.textContent = 'enviando...';

    const data = {
        name: document.getElementById('commentName').value,
        role: document.getElementById('commentRole').value,
        company: document.getElementById('commentCompany').value,
        message: document.getElementById('commentMessage').value,
        rating: parseInt(document.getElementById('commentRating').value),
    };

    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Error al enviar');
        status.className = 'form-status success';
        status.textContent = '✅ Comentario enviado. Gracias!';
        e.target.reset();
        fetchComments();
    } catch {
        status.className = 'form-status error';
        status.textContent = '❌ Error al enviar. El servidor PHP no está disponible.';
    }
    btn.disabled = false;
    btn.innerHTML = '<span>$</span> enviar_comentario';
});

// ==================== CONTACT FORM (Formspree) ====================

document.getElementById('contactForm')?.addEventListener('submit', async e => {
    e.preventDefault();
    const status = document.getElementById('contactStatus');
    const btn = e.target.querySelector('button');
    btn.disabled = true;
    btn.textContent = 'enviando...';

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    // Try Formspree first, fallback to mailto
    try {
        const res = await fetch('https://formspree.io/f/xjkgrjwp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Formspree error');
        status.className = 'form-status success';
        status.textContent = '✅ Mensaje enviado con éxito!';
        e.target.reset();
    } catch {
        // Fallback: mailto
        const params = new URLSearchParams({
            subject: data.subject || 'Contacto desde portafolio',
            body: `Nombre: ${data.name}\nEmail: ${data.email}\n\n${data.message}`
        });
        window.location.href = `mailto:tu@email.com?${params}`;
        status.className = 'form-status success';
        status.textContent = '✅ Abriendo cliente de email...';
    }
    btn.disabled = false;
    btn.innerHTML = '<span>$</span> enviar_mensaje';
});

// ==================== TYPEWRITER ====================

const words = ['experiencias digitales', 'arquitecturas robustas', 'productos escalables', 'código impecable'];
let wordIndex = 0, charIndex = 0, isDeleting = false;
const typewriter = document.getElementById('typewriter');

function type() {
    if (!typewriter) return;
    const current = words[wordIndex];
    if (!isDeleting) {
        typewriter.textContent = current.substring(0, charIndex + 1);
        charIndex++;
        if (charIndex === current.length) { isDeleting = true; setTimeout(type, 2000); return; }
    } else {
        typewriter.textContent = current.substring(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) { isDeleting = false; wordIndex = (wordIndex + 1) % words.length; }
    }
    setTimeout(type, isDeleting ? 40 : 80);
}
type();

// ==================== MOBILE MENU ====================

document.querySelector('.menu-toggle')?.addEventListener('click', () => {
    document.querySelector('#navbar ul').classList.toggle('open');
});

// ==================== PARTICLES ====================

const canvas = document.createElement('canvas');
canvas.style.cssText = 'position:fixed;inset:0;z-index:0;pointer-events:none;opacity:0.2';
document.body.prepend(canvas);
const ctx = canvas.getContext('2d');
let particles = [];

function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }

class Particle {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 0.25;
        this.speedY = (Math.random() - 0.5) * 0.25;
        this.opacity = Math.random() * 0.3 + 0.1;
        this.type = Math.random() < 0.5 ? 'red' : 'purple';
    }
    update() {
        this.x += this.speedX; this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.type === 'red' ? `rgba(255,23,68,${this.opacity})` : `rgba(123,47,247,${this.opacity})`;
        ctx.fill();
    }
}

function init() { resize(); particles = Array.from({ length: 40 }, () => new Particle()); }
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 100) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(255,23,68,${0.02 * (1 - dist / 100)})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(animate);
}
init(); animate();
window.addEventListener('resize', resize);

// ==================== COUNTERS ====================

const statNumbers = document.querySelectorAll('.stat-number');
let countersDone = false;

function runCounters() {
    if (countersDone) return;
    countersDone = true;
    statNumbers.forEach(el => {
        const target = parseInt(el.dataset.target);
        const duration = 1500;
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

// ==================== SKILL BARS ====================

const fills = document.querySelectorAll('.fill');
let barsDone = false;

function runBars() {
    if (barsDone) return;
    barsDone = true;
    fills.forEach(bar => {
        const w = bar.dataset.width;
        bar.style.width = '0%';
        setTimeout(() => { bar.style.width = w + '%'; }, 200);
    });
}

// ==================== SCROLL OBSERVERS ====================

const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
    });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

const actionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        if (entry.target.id === 'stats') runCounters();
        if (entry.target.id === 'skills') runBars();
    });
}, { threshold: 0.3 });

document.querySelectorAll('#stats, #skills').forEach(s => actionObserver.observe(s));

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

// ==================== NAVBAR HIDE ====================

let lastY = 0;
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    const cur = window.scrollY;
    nav.style.transform = cur > lastY && cur > 120 ? 'translateY(-100%)' : 'translateY(0)';
    lastY = cur;
});

// ==================== INIT ====================

// Try to fetch comments from the PHP API
if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    // On production, try the API
    fetchComments();
}
