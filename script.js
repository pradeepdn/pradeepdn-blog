const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.getElementById('nav-menu');
if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    navMenu.setAttribute('aria-expanded', String(!expanded));
  });
}
document.addEventListener('click', (e) => {
  const target = e.target;
  if (target instanceof HTMLElement && target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
    const id = target.getAttribute('href');
    const el = id ? document.querySelector(id) : null;
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.pushState(null, '', id);
      if (navMenu?.getAttribute('aria-expanded') === 'true') {
        navToggle?.setAttribute('aria-expanded', 'false');
        navMenu?.setAttribute('aria-expanded', 'false');
      }
    }
  }
});
const themeToggle = document.getElementById('theme-toggle');
const root = document.documentElement;
const THEME_KEY = 'theme-preference';

function getPreferredTheme() {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  return 'dark';
}

function applyTheme(theme) {
  root.setAttribute('data-theme', theme);
}

function toggleTheme() {
  const current = root.getAttribute('data-theme') || 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  localStorage.setItem(THEME_KEY, next);
  applyTheme(next);
  if (themeToggle) themeToggle.textContent = next === 'dark' ? '🌞' : '🌙';
}

applyTheme(getPreferredTheme());
if (themeToggle) {
  themeToggle.addEventListener('click', toggleTheme);
  themeToggle.textContent = (root.getAttribute('data-theme') === 'dark') ? '🌞' : '🌙';
}

// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

// Scroll animation for cards
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, index * 100); // Stagger animation
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all cards
document.querySelectorAll('.card').forEach(card => {
  observer.observe(card);
});

// Flowing gradient background with particles
const canvas = document.getElementById('bg-canvas');
if (canvas instanceof HTMLCanvasElement) {
  const ctx = canvas.getContext('2d');
  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  let width = 0, height = 0;
  let time = 0;
  let particles = [];

  // Adjust particle count based on device
  function getParticleCount() {
    const isMobile = window.innerWidth < 768;
    const isLowPower = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
    if (isMobile || isLowPower) return 50;
    return window.innerWidth < 1024 ? 80 : 150;
  }

  let PARTICLE_COUNT = getParticleCount();

  function themeColors() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark' || 
                  !document.documentElement.getAttribute('data-theme');
    return isDark
      ? {
          gradient1: 'rgba(91,156,255,0.15)',
          gradient2: 'rgba(139,92,246,0.1)',
          gradient3: 'rgba(34,197,94,0.08)',
          accent: 'rgba(91,156,255,0.05)',
          particle: 'rgba(91,156,255,0.4)',
          particleGlow: 'rgba(91,156,255,0.15)'
        }
      : {
          gradient1: 'rgba(37,99,235,0.12)',
          gradient2: 'rgba(147,51,234,0.08)',
          gradient3: 'rgba(16,185,129,0.06)',
          accent: 'rgba(37,99,235,0.04)',
          particle: 'rgba(37,99,235,0.5)',
          particleGlow: 'rgba(37,99,235,0.2)'
        };
  }

  function resize() {
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = Math.floor(width * DPR);
    canvas.height = Math.floor(height * DPR);
    if (ctx) ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

    // Update particle count on resize
    PARTICLE_COUNT = getParticleCount();

    // Reinitialize particles on resize
    initParticles();
  }
  
  function initParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        size: 0.5 + Math.random() * 2,
        opacity: 0.3 + Math.random() * 0.4,
        pulse: Math.random() * Math.PI * 2
      });
    }
  }
  
  resize();
  window.addEventListener('resize', resize);

  function drawFlowingGradient() {
    const colors = themeColors();
    const t = time * 0.001;
    
    // Create flowing radial gradients
    const gradient1 = ctx.createRadialGradient(
      width * 0.3 + Math.sin(t) * 50,
      height * 0.3 + Math.cos(t * 0.7) * 30,
      0,
      width * 0.3 + Math.sin(t) * 50,
      height * 0.3 + Math.cos(t * 0.7) * 30,
      width * 0.8
    );
    gradient1.addColorStop(0, colors.gradient1);
    gradient1.addColorStop(1, 'transparent');

    const gradient2 = ctx.createRadialGradient(
      width * 0.7 + Math.cos(t * 0.5) * 40,
      height * 0.7 + Math.sin(t * 0.8) * 35,
      0,
      width * 0.7 + Math.cos(t * 0.5) * 40,
      height * 0.7 + Math.sin(t * 0.8) * 35,
      width * 0.6
    );
    gradient2.addColorStop(0, colors.gradient2);
    gradient2.addColorStop(1, 'transparent');

    const gradient3 = ctx.createRadialGradient(
      width * 0.5 + Math.sin(t * 0.3) * 60,
      height * 0.2 + Math.cos(t * 0.6) * 25,
      0,
      width * 0.5 + Math.sin(t * 0.3) * 60,
      height * 0.2 + Math.cos(t * 0.6) * 25,
      width * 0.4
    );
    gradient3.addColorStop(0, colors.gradient3);
    gradient3.addColorStop(1, 'transparent');

    // Draw gradients
    ctx.fillStyle = gradient1;
    ctx.fillRect(0, 0, width, height);
    
    ctx.fillStyle = gradient2;
    ctx.fillRect(0, 0, width, height);
    
    ctx.fillStyle = gradient3;
    ctx.fillRect(0, 0, width, height);

    // Add subtle moving accent lines
    ctx.strokeStyle = colors.accent;
    ctx.lineWidth = 1;
    for (let i = 0; i < 3; i++) {
      const y = height * (0.2 + i * 0.3) + Math.sin(t * 0.2 + i) * 20;
      const startX = Math.sin(t * 0.1 + i) * width * 0.1;
      const endX = width + Math.sin(t * 0.1 + i) * width * 0.1;
      
      ctx.beginPath();
      ctx.moveTo(startX, y);
      ctx.lineTo(endX, y);
      ctx.stroke();
    }
  }

  function updateParticles() {
    const t = time * 0.001;
    particles.forEach(particle => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Add subtle wave motion
      particle.vx += Math.sin(t * 0.5 + particle.pulse) * 0.001;
      particle.vy += Math.cos(t * 0.3 + particle.pulse) * 0.001;
      
      // Wrap around screen
      if (particle.x < -10) particle.x = width + 10;
      if (particle.x > width + 10) particle.x = -10;
      if (particle.y < -10) particle.y = height + 10;
      if (particle.y > height + 10) particle.y = -10;
      
      // Apply friction
      particle.vx *= 0.998;
      particle.vy *= 0.998;
      
      // Update pulse for twinkling effect
      particle.pulse += 0.02;
    });
  }
  
  function drawParticles() {
    const colors = themeColors();
    particles.forEach(particle => {
      const alpha = particle.opacity + Math.sin(particle.pulse) * 0.2;
      const size = particle.size + Math.sin(particle.pulse * 0.7) * 0.3;
      
      // Draw glow
      const gradient = ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, size * 3
      );
      gradient.addColorStop(0, colors.particleGlow);
      gradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(
        particle.x - size * 3,
        particle.y - size * 3,
        size * 6,
        size * 6
      );
      
      // Draw particle
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
      ctx.fillStyle = colors.particle;
      ctx.globalAlpha = alpha;
      ctx.fill();
      ctx.globalAlpha = 1;
    });
  }

  let animationId = null;
  let isAnimating = false;

  function animate() {
    if (!isAnimating) return;
    time += 16; // ~60fps
    ctx.clearRect(0, 0, width, height);
    drawFlowingGradient();
    updateParticles();
    drawParticles();
    animationId = requestAnimationFrame(animate);
  }

  function startAnimation() {
    if (!isAnimating) {
      isAnimating = true;
      animate();
    }
  }

  function stopAnimation() {
    isAnimating = false;
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  }

  // Lazy load: Only start animation when canvas is in viewport
  const canvasObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startAnimation();
      } else {
        stopAnimation();
      }
    });
  }, { threshold: 0 });

  canvasObserver.observe(canvas);
}

// Enhanced Skills Section Animation
document.addEventListener('DOMContentLoaded', function() {
  const skillItems = document.querySelectorAll('.skill-item');
  const levelBars = document.querySelectorAll('.level-bar');
  
  // Set CSS custom properties for level bars
  levelBars.forEach(bar => {
    const level = bar.getAttribute('data-level');
    if (level) {
      bar.style.setProperty('--level', level + '%');
    }
  });

  // Intersection Observer for skills animation
  const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger the animation
        setTimeout(() => {
          entry.target.classList.add('animate');
        }, index * 100);
      }
    });
  }, { 
    threshold: 0.3,
    rootMargin: '0px 0px -50px 0px'
  });

  skillItems.forEach(item => {
    skillsObserver.observe(item);
  });

  // Add hover sound effect simulation (visual feedback)
  skillItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
      const icon = this.querySelector('.skill-icon');
      icon.style.transform = 'scale(1.15) rotate(5deg)';
    });
    
    item.addEventListener('mouseleave', function() {
      const icon = this.querySelector('.skill-icon');
      icon.style.transform = '';
    });
  });
});

// Update year in footer
document.addEventListener('DOMContentLoaded', function() {
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
});
