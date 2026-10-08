/**
 * DEEPAN A - Full Stack Developer Portfolio
 * Interactive Scripts & Modern Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initCursorGlow();
  initCanvasParticles();
  initTypewriter();
  initTerminal();
  initSkillFilter();
  initProjectModals();
  initContactForm();
  initClipboardHelper();
  initScrollSpy();
});

/* -------------------------------------------------------------
 * 1. Navbar and Scroll Controls
 * ----------------------------------------------------------- */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const backToTop = document.querySelector('.back-to-top');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    if (backToTop) {
      if (window.scrollY > 400) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }
  });

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const icon = navToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
      }
    });

    // Close mobile menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        const icon = navToggle.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-times');
        }
      });
    });
  }

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/* -------------------------------------------------------------
 * 2. Mouse Cursor Glow Backdrop
 * ----------------------------------------------------------- */
function initCursorGlow() {
  const glow = document.getElementById('cursor-glow');
  if (!glow) return;

  window.addEventListener('mousemove', (e) => {
    glow.style.left = `${e.clientX}px`;
    glow.style.top = `${e.clientY}px`;
  });
}

/* -------------------------------------------------------------
 * 3. Hero Interactive Particle Network Canvas
 * ----------------------------------------------------------- */
function initCanvasParticles() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = canvas.parentElement.offsetWidth);
  let height = (canvas.height = canvas.parentElement.offsetHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
  });

  const particles = [];
  const particleCount = Math.min(Math.floor(width / 22), 65);

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.7,
      vy: (Math.random() - 0.5) * 0.7,
      radius: Math.random() * 2 + 1,
      color: Math.random() > 0.4 ? 'rgba(6, 182, 212, ' : 'rgba(99, 102, 241, '
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color + '0.6)';
      ctx.fill();

      // Connect lines between nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(6, 182, 212, ${0.18 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(render);
  }

  render();
}

/* -------------------------------------------------------------
 * 4. Dynamic Typewriter Effect
 * ----------------------------------------------------------- */
function initTypewriter() {
  const el = document.getElementById('typed-text');
  if (!el) return;

  const roles = [
    'Full Stack Developer',
    'Go (Gin) & Redis Specialist',
    'React & Angular Engineer',
    'Python & REST API Developer',
    'AI & Network Systems Researcher'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let delay = 120;

  function type() {
    const current = roles[roleIndex];

    if (isDeleting) {
      el.textContent = current.substring(0, charIndex - 1);
      charIndex--;
      delay = 60;
    } else {
      el.textContent = current.substring(0, charIndex + 1);
      charIndex++;
      delay = 110;
    }

    if (!isDeleting && charIndex === current.length) {
      delay = 2000; // Pause at full word
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 400;
    }

    setTimeout(type, delay);
  }

  type();
}

/* -------------------------------------------------------------
 * 5. Interactive Hacker CLI / Terminal Sandbox
 * ----------------------------------------------------------- */
function initTerminal() {
  const input = document.getElementById('terminal-cli-input');
  const history = document.getElementById('terminal-history');
  const quickBtns = document.querySelectorAll('.terminal-chip');
  if (!input || !history) return;

  const commands = {
    help: `Available commands:
  • <span style="color:#06b6d4">about</span>       - Print professional profile overview
  • <span style="color:#06b6d4">skills</span>      - List core languages, frameworks & tech stack
  • <span style="color:#06b6d4">projects</span>    - View featured engineering applications
  • <span style="color:#06b6d4">awards</span>      - Inspect conference honors & certifications
  • <span style="color:#06b6d4">education</span>   - University, degree, and academic standing
  • <span style="color:#06b6d4">contact</span>     - Display email, phone, and social channels
  • <span style="color:#06b6d4">resume</span>      - Open / download the official PDF resume
  • <span style="color:#06b6d4">clear</span>       - Clear current terminal screen`,

    about: `<span style="color:#a5b4fc">Deepan A</span> — Computer Science Engineering student and Best Paper Award winner.
Passionate Full-Stack Developer with hands-on expertise across Go (Gin), Python, React, Angular, MongoDB, Redis, and MySQL.
Proven track record designing and shipping real-time CRUD-driven applications end to end.`,

    skills: `<span style="color:#38bdf8;font-weight:700">TECHNICAL PROFICIENCY:</span>
[Languages]   : HTML5, CSS3, JavaScript (ES6+), Python, Go, SQL
[Frameworks]  : React, Angular, Node.js, Gin (Go), RESTful APIs
[Databases]   : MySQL, MongoDB, Redis (In-memory caching & real-time)
[DevOps/Tools]: Git, GitHub, VS Code, Render, REST APIs`,

    projects: `<span style="color:#38bdf8;font-weight:700">FEATURED PROJECTS:</span>
1. <span style="color:#10b981">Pulse Polling</span>: Real-Time Polling Platform
   Stack: React, Go (Gin), MongoDB, Redis
   Live: https://pulsepoll-zara-frontend.onrender.com
   Feature: Real-time vote updates without page reloads via Redis & Go concurrency.

2. <span style="color:#a5b4fc">Employee Leave Management System</span>
   Stack: Angular, Python, MySQL, REST API
   Feature: Role-based access control, leave audit logs & manager approvals.

3. <span style="color:#f59e0b">Self-Healing Network Using AI</span>
   Category: Research & Best Paper Award at NCACI-26
   Feature: Autonomous anomaly detection and self-recovery algorithm.`,

    awards: `🏆 <span style="color:#fbbf24;font-weight:700">Best Paper Award</span> — "Self-Healing Network Using AI" (NCACI-26)
📜 <span style="color:#38bdf8">Web Development Internship Certificate</span> — PUMO Tecno Vision, Chennai
🎓 <span style="color:#a5b4fc">The Complete Web Development Bootcamp Certificate</span> — Verified Online`,

    education: `🎓 <span style="color:#38bdf8;font-weight:700">Annapoorana Engineering College</span>
Degree: Bachelor of Engineering in Computer Science (2023 – 2027)
Academic Standing: CGPA 7.6`,

    contact: `📧 Email: <a href="mailto:deepanrao@aecsalem.edu.in" style="color:#06b6d4">deepanrao@aecsalem.edu.in</a>
📞 Phone: +91 6369297998
🌐 GitHub: <a href="https://github.com/Zaraofxl" target="_blank" style="color:#06b6d4">github.com/Zaraofxl</a>
💼 LinkedIn: <a href="https://www.linkedin.com/in/deepan1205" target="_blank" style="color:#06b6d4">linkedin.com/in/deepan1205</a>`,

    resume: `Opening official resume... <a href="assets/Deepan_A_Resume.pdf" target="_blank" style="color:#06b6d4">Click here if download does not trigger.</a>`
  };

  function executeCommand(cmdRaw) {
    const cmd = cmdRaw.trim().toLowerCase();
    if (!cmd) return;

    if (cmd === 'clear') {
      history.innerHTML = '';
      return;
    }

    if (cmd === 'resume') {
      window.open('assets/Deepan_A_Resume.pdf', '_blank');
    }

    const line = document.createElement('div');
    line.className = 'terminal-line';

    let response = commands[cmd];
    if (!response) {
      if (cmd.startsWith('echo ')) {
        response = escapeHTML(cmd.substring(5));
      } else {
        response = `Command not recognized: '<span style="color:#f87171">${escapeHTML(cmd)}</span>'. Type '<span style="color:#06b6d4">help</span>' for a list of commands.`;
      }
    }

    line.innerHTML = `
      <div><span class="cmd-prompt">deepan@dev:~$</span> <span class="cmd-text">${escapeHTML(cmdRaw)}</span></div>
      <div class="cmd-response">${response}</div>
    `;

    history.appendChild(line);
    const terminalBody = document.querySelector('.terminal-body');
    if (terminalBody) {
      terminalBody.scrollTop = terminalBody.scrollHeight;
    }
  }

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      executeCommand(input.value);
      input.value = '';
    }
  });

  quickBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const cmd = btn.getAttribute('data-cmd');
      if (cmd) {
        input.value = cmd;
        executeCommand(cmd);
        input.value = '';
      }
    });
  });
}

/* -------------------------------------------------------------
 * 6. Skills Categorization Filter
 * ----------------------------------------------------------- */
function initSkillFilter() {
  const filterBtns = document.querySelectorAll('.skills-filter-nav .filter-btn');
  const skillCards = document.querySelectorAll('.skills-grid .skill-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* -------------------------------------------------------------
 * 7. Interactive Project Modals
 * ----------------------------------------------------------- */
function initProjectModals() {
  const modalOverlay = document.getElementById('project-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  const modalClose = document.getElementById('modal-close-btn');

  const projectDetails = {
    'pulse-polling': {
      title: 'Pulse Polling — Real-Time Polling Platform',
      content: `
        <div style="margin-bottom:1.5rem">
          <span class="tech-tag" style="background:rgba(6,182,212,0.15);color:#06b6d4">Production Deployed</span>
          <span class="tech-tag">React</span>
          <span class="tech-tag">Go (Gin)</span>
          <span class="tech-tag">MongoDB</span>
          <span class="tech-tag">Redis</span>
          <span class="tech-tag">Render</span>
        </div>
        <h4 style="color:#f1f5f9;margin-bottom:0.75rem;">System Overview</h4>
        <p style="color:#94a3b8;line-height:1.7;margin-bottom:1.25rem;">
          Pulse Polling is an end-to-end full-stack web application designed for high-concurrency real-time voting. Users can create custom polls with instant shareable links, submit votes, and watch vote distribution update dynamically without manual page refresh.
        </p>

        <h4 style="color:#f1f5f9;margin-bottom:0.75rem;">Architectural Highlights</h4>
        <ul style="color:#cbd5e1;line-height:1.8;padding-left:1.25rem;margin-bottom:1.5rem;">
          <li><strong>Go (Gin) Backend API:</strong> Engineered ultra-lightweight REST endpoints leveraging Go's native goroutines for high-throughput request handling.</li>
          <li><strong>Redis Caching & Instant Lookups:</strong> Deployed in-memory Redis counters for sub-millisecond vote increments and instant tally reads.</li>
          <li><strong>MongoDB Persistence:</strong> Schema designed with flexible collections for polls, options, and vote records to ensure consistency across scale.</li>
          <li><strong>Live Deployment:</strong> Client and API deployed seamlessly on Render with production SSL.</li>
        </ul>

        <div style="background:#0b0f19;border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:1.25rem;margin-bottom:1.5rem;font-family:var(--font-mono);font-size:0.85rem;color:#38bdf8;">
          [Client (React SPA)] ──► [Gin API Gateway (Go)]<br>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├──► [Redis In-Memory Counter (Live Votes)]<br>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└──► [MongoDB Cluster (Persistent State)]
        </div>

        <div style="display:flex;gap:1rem;flex-wrap:wrap;">
          <a href="https://pulsepoll-zara-frontend.onrender.com" target="_blank" class="btn btn-primary btn-sm">
            <i class="fas fa-external-link-alt"></i> Visit Live Demo
          </a>
          <a href="https://github.com/Zaraofxl" target="_blank" class="btn btn-secondary btn-sm">
            <i class="fab fa-github"></i> GitHub Source
          </a>
        </div>
      `
    },
    'leave-management': {
      title: 'Employee Leave Management System',
      content: `
        <div style="margin-bottom:1.5rem">
          <span class="tech-tag" style="background:rgba(99,102,241,0.15);color:#a5b4fc">Enterprise Workflow</span>
          <span class="tech-tag">Angular</span>
          <span class="tech-tag">Python</span>
          <span class="tech-tag">MySQL</span>
          <span class="tech-tag">RESTful API</span>
        </div>
        <h4 style="color:#f1f5f9;margin-bottom:0.75rem;">System Overview</h4>
        <p style="color:#94a3b8;line-height:1.7;margin-bottom:1.25rem;">
          A full-stack enterprise automation system built to streamline employee time-off requests, manager approval pipelines, leave balance computations, and audit logs.
        </p>

        <h4 style="color:#f1f5f9;margin-bottom:0.75rem;">Key Engineering Features</h4>
        <ul style="color:#cbd5e1;line-height:1.8;padding-left:1.25rem;margin-bottom:1.5rem;">
          <li><strong>Role-Based Access Control (RBAC):</strong> Granular permission system strictly segregating Employee, Manager, and HR Administrator access levels.</li>
          <li><strong>Python REST Engine:</strong> Robust backend endpoints handling authentication, automated leave balance deductions, and request status machines.</li>
          <li><strong>Normalized MySQL Schema:</strong> Highly structured relational tables guaranteeing relational integrity across user profiles, departments, and leave histories.</li>
          <li><strong>Angular Dashboard:</strong> Reactive client with clean form validation, interactive calendar views, and dynamic request timelines.</li>
        </ul>

        <div style="display:flex;gap:1rem;flex-wrap:wrap;">
          <a href="https://github.com/Zaraofxl" target="_blank" class="btn btn-primary btn-sm">
            <i class="fab fa-github"></i> View on GitHub
          </a>
        </div>
      `
    },
    'ai-network': {
      title: 'Self-Healing Network Using AI — NCACI-26 Best Paper',
      content: `
        <div style="margin-bottom:1.5rem">
          <span class="tech-tag" style="background:rgba(245,158,11,0.15);color:#fbbf24">🏆 Best Paper Award Winner</span>
          <span class="tech-tag">Python</span>
          <span class="tech-tag">Machine Learning</span>
          <span class="tech-tag">Distributed Systems</span>
          <span class="tech-tag">NCACI-26</span>
        </div>
        <h4 style="color:#f1f5f9;margin-bottom:0.75rem;">Research & System Overview</h4>
        <p style="color:#94a3b8;line-height:1.7;margin-bottom:1.25rem;">
          Presented and awarded at the <strong>2nd National Conference on Advances in Computational Intelligence (NCACI-26)</strong>. This project explores autonomic networking principles where AI models monitor real-time network telemetry, predict impending node failure, and autonomously reroute traffic or trigger self-healing protocols.
        </p>

        <h4 style="color:#f1f5f9;margin-bottom:0.75rem;">Technical Implementation</h4>
        <ul style="color:#cbd5e1;line-height:1.8;padding-left:1.25rem;margin-bottom:1.5rem;">
          <li><strong>Anomaly Detection Pipeline:</strong> Continuously processes packet loss, latency jitter, and bandwidth saturation metrics using ML classification models.</li>
          <li><strong>Automated Remediation:</strong> Executes programmatic failover actions and healing routines without requiring manual sysadmin intervention.</li>
          <li><strong>Academic Recognition:</strong> Honored with the <em>Best Paper Award</em> out of numerous competitive submissions.</li>
        </ul>

        <div style="display:flex;gap:1rem;flex-wrap:wrap;">
          <a href="#contact" class="btn btn-primary btn-sm" onclick="document.getElementById('project-modal').classList.remove('active')">
            <i class="fas fa-paper-plane"></i> Inquire About Research
          </a>
        </div>
      `
    }
  };

  document.querySelectorAll('[data-modal-target]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const target = trigger.getAttribute('data-modal-target');
      const data = projectDetails[target];
      if (data && modalOverlay && modalTitle && modalBody) {
        modalTitle.textContent = data.title;
        modalBody.innerHTML = data.content;
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (modalClose && modalOverlay) {
    modalClose.addEventListener('click', () => {
      modalOverlay.classList.remove('active');
      document.body.style.overflow = '';
    });

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }
}

/* -------------------------------------------------------------
 * 8. Live AJAX Contact Form
 * ----------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback');
  const submitBtn = document.getElementById('contact-submit-btn');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = form.querySelector('[name="name"]').value.trim();
    const email = form.querySelector('[name="email"]').value.trim();
    const subject = form.querySelector('[name="subject"]').value.trim();
    const message = form.querySelector('[name="message"]').value.trim();

    if (!name || !email || !message) {
      showFeedback('Please fill in all required fields.', 'error');
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showFeedback('Please enter a valid email address.', 'error');
      return;
    }

    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending message...';

    try {
      const response = await fetch('api/contact.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        showFeedback(result.message, 'success');
        form.reset();
        showToast('Message sent successfully!');
      } else {
        showFeedback(result.error || 'Failed to send message. Please try again.', 'error');
      }
    } catch (err) {
      showFeedback('A network error occurred. Please contact deepanrao@aecsalem.edu.in directly.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
  });

  function showFeedback(msg, type) {
    if (!feedback) return;
    feedback.textContent = msg;
    feedback.className = `form-feedback ${type}`;
    feedback.style.display = 'block';

    setTimeout(() => {
      if (type === 'success') {
        feedback.style.display = 'none';
      }
    }, 6000);
  }
}

/* -------------------------------------------------------------
 * 9. One-Click Copy to Clipboard & Toast
 * ----------------------------------------------------------- */
function initClipboardHelper() {
  const copyButtons = document.querySelectorAll('.copy-btn');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const copyVal = btn.getAttribute('data-copy');
      if (copyVal) {
        navigator.clipboard.writeText(copyVal).then(() => {
          showToast(`Copied to clipboard: ${copyVal}`);
          const origText = btn.innerHTML;
          btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
          setTimeout(() => {
            btn.innerHTML = origText;
          }, 2000);
        }).catch(() => {
          showToast('Could not copy automatically.');
        });
      }
    });
  });
}

function showToast(message) {
  let toast = document.getElementById('toast-notice');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-notice';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<i class="fas fa-info-circle"></i> ${escapeHTML(message)}`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

/* -------------------------------------------------------------
 * 10. Scroll-Spy Navigation
 * ----------------------------------------------------------- */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY + 180;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

function escapeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
