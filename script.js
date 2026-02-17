// DOM Elements
const canvas = document.getElementById('cardCanvas');
const ctx = canvas.getContext('2d');
const nameInput = document.getElementById('nameInput');
const errorMsg = document.getElementById('errorMsg');
const canvasWrapper = document.getElementById('canvasWrapper');
const canvasSection = document.getElementById('canvasSection');
const downloadBtn = document.getElementById('downloadBtn');
const shareBtn = document.getElementById('shareBtn');
const generateBtn = document.getElementById('generateBtn');

let currentName = '';
let isGenerating = false;

// Configuration
const CONFIG = {
    canvasWidth: 1080,
    canvasHeight: 1920,
    margin: 40,
    colors: {
        bgStart: '#0f0c29',
        bgMid: '#302b63',
        bgEnd: '#24243e',
        primaryGold: '#FFD700',
        secondaryGold: '#FDB931',
        accentRed: '#D90429',
        accentGreen: '#006400',
        accentBlue: '#0077B6',
        accentOrange: '#FB8500',
        white: '#FFFFFF',
        offWhite: '#F8F9FA'
    }
};

// Detect mobile
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    || window.innerWidth < 768;

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    createStars();
    createParticles();
    loadFonts();

    generateBtn.addEventListener('click', handleGenerate);

    nameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleGenerate();
        }
    });

    // Clear error on input
    nameInput.addEventListener('input', () => {
        errorMsg.classList.remove('visible');
    });

    downloadBtn.addEventListener('click', downloadCard);
    shareBtn.addEventListener('click', shareCard);
});

// ===== Font Loading =====
async function loadFonts() {
    try {
        await Promise.all([
            document.fonts.load('80px Amiri'),
            document.fonts.load('50px Amiri'),
            document.fonts.load('30px Amiri'),
            document.fonts.load('16px Tajawal')
        ]);
    } catch (e) {
        console.warn('Font loading issue:', e);
    }
}

// ===== Background Stars =====
function createStars() {
    const container = document.getElementById('stars-container');
    const count = isMobile ? 40 : 70;
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < count; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        const size = Math.random() * 2.5 + 0.5;
        star.style.cssText = `
            width:${size}px;
            height:${size}px;
            left:${Math.random() * 100}%;
            top:${Math.random() * 100}%;
            animation-duration:${Math.random() * 4 + 3}s;
            animation-delay:${Math.random() * 3}s;
        `;
        fragment.appendChild(star);
    }

    container.appendChild(fragment);
}

// ===== Floating Particles =====
function createParticles() {
    const container = document.getElementById('particles-container');
    const count = isMobile ? 6 : 12;
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const size = Math.random() * 4 + 2;
        const gold = Math.random() > 0.5;
        particle.style.cssText = `
            width:${size}px;
            height:${size}px;
            left:${Math.random() * 100}%;
            background:${gold ? 'rgba(255,215,0,0.4)' : 'rgba(255,255,255,0.2)'};
            animation-duration:${Math.random() * 10 + 8}s;
            animation-delay:${Math.random() * 8}s;
        `;
        fragment.appendChild(particle);
    }

    container.appendChild(fragment);
}

// ===== Generate Handler with debounce =====
async function handleGenerate() {
    if (isGenerating) return;

    const name = nameInput.value.trim();
    if (!name) {
        errorMsg.classList.add('visible');
        nameInput.focus();
        // Haptic feedback on supported devices
        if (navigator.vibrate) navigator.vibrate(50);
        return;
    }

    errorMsg.classList.remove('visible');
    isGenerating = true;
    generateBtn.classList.add('loading');

    // Blur input on mobile to hide keyboard
    if (isMobile) {
        nameInput.blur();
    }

    currentName = name;

    // Small delay to show loading state
    await new Promise(r => requestAnimationFrame(r));

    try {
        await generateCard();
    } finally {
        generateBtn.classList.remove('loading');
        isGenerating = false;
    }

    // Show canvas section
    canvasSection.classList.add('visible');

    // Smooth scroll to result
    requestAnimationFrame(() => {
        canvasSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
}

// ===== Canvas Setup =====
function setupCanvas(w, h) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.style.width = '100%';
    canvas.style.maxWidth = '500px';
    canvas.style.height = 'auto';
    canvas.style.aspectRatio = `${w}/${h}`;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);
    return dpr;
}

// ===== Drawing Functions =====

function drawGeometricPattern() {
    ctx.save();
    ctx.globalAlpha = 0.03;
    ctx.strokeStyle = CONFIG.colors.white;
    ctx.lineWidth = 1;

    const step = 80;
    for (let x = 0; x < CONFIG.canvasWidth; x += step) {
        for (let y = 0; y < CONFIG.canvasHeight; y += step) {
            ctx.beginPath();
            ctx.moveTo(x + step / 2, y);
            ctx.lineTo(x + step, y + step / 2);
            ctx.lineTo(x + step / 2, y + step);
            ctx.lineTo(x, y + step / 2);
            ctx.closePath();
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(x + step / 2, y + step / 2, step / 4, 0, Math.PI * 2);
            ctx.stroke();
        }
    }
    ctx.restore();
}

function drawBackground() {
    const gradient = ctx.createLinearGradient(0, 0, 0, CONFIG.canvasHeight);
    gradient.addColorStop(0, CONFIG.colors.bgStart);
    gradient.addColorStop(0.5, CONFIG.colors.bgMid);
    gradient.addColorStop(1, CONFIG.colors.bgEnd);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CONFIG.canvasWidth, CONFIG.canvasHeight);
}

function drawAlBanaq(x, y, size, color1, color2, inverted = false) {
    ctx.save();
    ctx.translate(x, y);
    if (inverted) {
        ctx.scale(1, -1);
        ctx.translate(0, -size);
    }

    ctx.beginPath();
    ctx.moveTo(0, size);
    ctx.lineTo(size / 2, 0);
    ctx.lineTo(size, size);
    ctx.closePath();
    ctx.fillStyle = color1;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(size / 2, size * 0.3);
    ctx.lineTo(size * 0.7, size * 0.7);
    ctx.lineTo(size / 2, size * 0.9);
    ctx.lineTo(size * 0.3, size * 0.7);
    ctx.closePath();
    ctx.fillStyle = color2;
    ctx.fill();

    ctx.fillStyle = CONFIG.colors.white;
    ctx.beginPath();
    ctx.arc(size / 2, size * 0.15, size * 0.05, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
}

function drawAlMaharbe(x, y, size, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    const stepH = size / 3;
    const stepW = size / 3;

    ctx.moveTo(0, size);
    ctx.lineTo(size, size);
    ctx.lineTo(size, size - stepH);
    ctx.lineTo(size - stepW, size - stepH);
    ctx.lineTo(size - stepW, size - stepH * 2);
    ctx.lineTo(size - stepW * 2, size - stepH * 2);
    ctx.lineTo(size - stepW * 2, size - stepH);
    ctx.lineTo(0, size - stepH);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = CONFIG.colors.primaryGold;
    ctx.beginPath();
    ctx.arc(size / 2, size - stepH * 1.5, size * 0.08, 0, Math.PI * 2);
    ctx.fill();
}

function drawModernBorder() {
    const size = 40;
    const w = CONFIG.canvasWidth;
    const h = CONFIG.canvasHeight;
    const { accentRed, accentGreen, accentOrange, secondaryGold } = CONFIG.colors;

    for (let x = 0; x < w; x += size) {
        const iseven = (x / size) % 2 === 0;
        drawAlBanaq(x, 0, size, iseven ? accentRed : accentGreen, secondaryGold, true);
    }

    for (let x = 0; x < w; x += size) {
        const iseven = (x / size) % 2 === 0;
        drawAlBanaq(x, h - size, size, iseven ? accentGreen : accentRed, secondaryGold, false);
    }

    for (let y = size; y < h - size; y += size) {
        const iseven = (y / size) % 2 === 0;
        drawAlMaharbe(0, y, size, iseven ? accentOrange : secondaryGold);
    }

    for (let y = size; y < h - size; y += size) {
        const iseven = (y / size) % 2 === 0;
        ctx.save();
        ctx.translate(w, y);
        ctx.scale(-1, 1);
        drawAlMaharbe(0, 0, size, iseven ? secondaryGold : accentOrange);
        ctx.restore();
    }
}

function drawLantern(x, y, scale = 1) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    // String
    ctx.beginPath();
    ctx.moveTo(0, -300);
    ctx.lineTo(0, 0);
    ctx.strokeStyle = CONFIG.colors.secondaryGold;
    ctx.lineWidth = 3;
    ctx.stroke();

    // Top Ring
    ctx.fillStyle = CONFIG.colors.primaryGold;
    ctx.beginPath();
    ctx.arc(0, 0, 8, 0, Math.PI * 2);
    ctx.fill();

    // Dome
    ctx.beginPath();
    ctx.moveTo(-15, 5);
    ctx.quadraticCurveTo(0, -25, 15, 5);
    ctx.lineTo(20, 15);
    ctx.lineTo(-20, 15);
    ctx.closePath();
    ctx.fillStyle = CONFIG.colors.primaryGold;
    ctx.fill();

    // Body (Glass)
    ctx.beginPath();
    ctx.moveTo(-20, 15);
    ctx.lineTo(-25, 50);
    ctx.lineTo(-10, 90);
    ctx.lineTo(10, 90);
    ctx.lineTo(25, 50);
    ctx.lineTo(20, 15);
    ctx.closePath();

    const glassGrad = ctx.createLinearGradient(-20, 15, 20, 90);
    glassGrad.addColorStop(0, 'rgba(255, 215, 0, 0.8)');
    glassGrad.addColorStop(0.5, 'rgba(255, 165, 0, 0.6)');
    glassGrad.addColorStop(1, 'rgba(255, 69, 0, 0.8)');
    ctx.fillStyle = glassGrad;
    ctx.fill();
    ctx.strokeStyle = CONFIG.colors.primaryGold;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Inner Glow
    ctx.beginPath();
    ctx.arc(0, 50, 10, 0, Math.PI * 2);
    ctx.fillStyle = '#FFF';
    ctx.shadowColor = '#FFD700';
    ctx.shadowBlur = 20;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Bottom Base
    ctx.fillStyle = CONFIG.colors.primaryGold;
    ctx.beginPath();
    ctx.moveTo(-10, 90);
    ctx.lineTo(-5, 105);
    ctx.lineTo(5, 105);
    ctx.lineTo(10, 90);
    ctx.closePath();
    ctx.fill();

    // Tassel
    ctx.beginPath();
    ctx.moveTo(0, 105);
    ctx.lineTo(0, 120);
    ctx.strokeStyle = CONFIG.colors.secondaryGold;
    ctx.stroke();

    ctx.restore();
}

function drawMoon(cx, cy, radius) {
    ctx.save();
    ctx.shadowColor = CONFIG.colors.primaryGold;
    ctx.shadowBlur = 40;

    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);

    const grad = ctx.createLinearGradient(cx - radius, cy - radius, cx + radius, cy + radius);
    grad.addColorStop(0, '#FFF5C3');
    grad.addColorStop(0.5, '#FDB931');
    grad.addColorStop(1, '#996515');
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(cx - radius * 0.35, cy - radius * 0.2, radius * 0.85, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
    ctx.globalCompositeOperation = 'source-over';
}

function drawText() {
    const cx = CONFIG.canvasWidth / 2;
    const cy = CONFIG.canvasHeight / 2;

    ctx.textAlign = 'center';
    ctx.direction = 'rtl';

    // Header
    ctx.font = '80px "Amiri"';
    ctx.fillStyle = CONFIG.colors.primaryGold;
    ctx.shadowColor = 'rgba(0,0,0,1)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.fillText('مبارك عليكم الشهر الفضيل', cx, cy - 200);

    // Subheader
    ctx.font = '45px "Amiri"';
    ctx.fillStyle = CONFIG.colors.offWhite;
    ctx.shadowBlur = 2;
    ctx.fillText('أسأل الله أن يجعله شهر قَبول ورضوان', cx, cy - 100);

    // Name
    ctx.shadowColor = CONFIG.colors.secondaryGold;
    ctx.shadowBlur = 25;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    ctx.font = 'bold 110px "Amiri"';
    ctx.fillStyle = CONFIG.colors.white;
    ctx.fillText(currentName, cx, cy + 100);

    // Footer Greeting
    ctx.font = '35px "Amiri"';
    ctx.fillStyle = '#aaa';
    ctx.shadowBlur = 0;
    ctx.fillText('تقبّل الله منّا ومنكم صالح الأعمال', cx, cy + 250);
}

function drawBranding() {
    const cx = CONFIG.canvasWidth / 2;
    const bottomY = CONFIG.canvasHeight - 60;

    ctx.textAlign = 'center';
    ctx.direction = 'ltr';
    ctx.font = '24px "Tajawal"';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.shadowBlur = 0;

    ctx.fillText('Developed by SAEED JAHASH | i3j.io', cx, bottomY - 35);

    ctx.font = '20px "Tajawal"';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fillText('Support: 0510072172', cx, bottomY);
}

// ===== Main Generate =====
async function generateCard() {
    setupCanvas(CONFIG.canvasWidth, CONFIG.canvasHeight);

    drawBackground();
    drawGeometricPattern();
    drawModernBorder();

    drawMoon(CONFIG.canvasWidth - 150, 200, 100);

    drawLantern(200, 100, 1.8);
    drawLantern(CONFIG.canvasWidth - 300, 50, 1.2);
    drawLantern(500, -20, 1.0);

    drawText();
    drawBranding();
}

// ===== Download =====
function downloadCard() {
    const link = document.createElement('a');
    link.download = `Ramadan_${currentName}.png`;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();

    // Haptic feedback
    if (navigator.vibrate) navigator.vibrate(30);
}

// ===== Share =====
function shareCard() {
    // Try native share API first (better mobile experience)
    if (navigator.share && navigator.canShare) {
        canvas.toBlob(async (blob) => {
            if (!blob) {
                fallbackWhatsAppShare();
                return;
            }

            const file = new File([blob], `Ramadan_${currentName}.png`, { type: 'image/png' });
            const shareData = {
                title: 'تهنئة رمضان',
                text: `رمضان كريم! بطاقة تهنئة خاصة لـ ${currentName}\n\nتم التطوير بواسطة: SAEED JAHASH\nرابط الموقع: https://i3j.io`,
                files: [file]
            };

            try {
                if (navigator.canShare(shareData)) {
                    await navigator.share(shareData);
                    return;
                }
            } catch (e) {
                // User cancelled or error - fall through to WhatsApp
            }

            fallbackWhatsAppShare();
        }, 'image/png');
    } else {
        fallbackWhatsAppShare();
    }
}

function fallbackWhatsAppShare() {
    const text = encodeURIComponent(`رمضان كريم! 🌙 بطاقة تهنئة خاصة لـ ${currentName}\n\nتم التطوير بواسطة: SAEED JAHASH\nرابط الموقع: https://i3j.io`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
}
