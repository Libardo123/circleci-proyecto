/* ==========================================================================
   AETHERIA // ORBIT AI - CLIENT ENGINE & INTERACTIVE TELEMETRY
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initBackgroundCanvas();
  initUtcClock();
  initSectorTabs();
  initTelemetryLoop();
  initAudioSystem();
  initInteractiveTerminal();
  initActionButtons();
});

/* --------------------------------------------------------------------------
   1. CANVAS DE FONDO: CAMPO ESTELAR Y CONSTELACIONES
   -------------------------------------------------------------------------- */
function initBackgroundCanvas() {
  const canvas = document.getElementById('telemetry-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height;
  let stars = [];
  const starCount = 130;
  const mouse = { x: -1000, y: -1000, radius: 120 };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    stars = [];
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.8 + 0.4,
        alpha: Math.random() * 0.8 + 0.2,
        speedX: (Math.random() - 0.5) * 0.25,
        speedY: (Math.random() - 0.5) * 0.25,
        pulseSpeed: Math.random() * 0.02 + 0.005
      });
    }
  }

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  resize();

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Dibujar estrellas
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      s.x += s.speedX;
      s.y += s.speedY;
      s.alpha += Math.sin(Date.now() * s.pulseSpeed) * 0.008;

      if (s.x < 0) s.x = width;
      if (s.x > width) s.x = 0;
      if (s.y < 0) s.y = height;
      if (s.y > height) s.y = 0;

      ctx.fillStyle = `rgba(180, 225, 255, ${Math.max(0.1, Math.min(0.9, s.alpha))})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fill();

      // Interacción con el cursor: conectar estrellas cercanas
      const dx = mouse.x - s.x;
      const dy = mouse.y - s.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < mouse.radius) {
        ctx.strokeStyle = `rgba(0, 242, 254, ${1 - dist / mouse.radius * 0.8})`;
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
      }

      // Conectar entre estrellas cercanas (efecto constelación)
      for (let j = i + 1; j < stars.length; j++) {
        const s2 = stars[j];
        const dist2 = Math.hypot(s.x - s2.x, s.y - s2.y);
        if (dist2 < 65) {
          ctx.strokeStyle = `rgba(121, 40, 202, ${0.2 * (1 - dist2 / 65)})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(s2.x, s2.y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* --------------------------------------------------------------------------
   2. RELOJ UTC EN TIEMPO REAL
   -------------------------------------------------------------------------- */
function initUtcClock() {
  const clockEl = document.getElementById('utc-time-string');
  if (!clockEl) return;

  function updateTime() {
    const now = new Date();
    const hours = String(now.getUTCHours()).padStart(2, '0');
    const minutes = String(now.getUTCMinutes()).padStart(2, '0');
    const seconds = String(now.getUTCSeconds()).padStart(2, '0');
    clockEl.textContent = `${hours}:${minutes}:${seconds} UTC`;
  }

  updateTime();
  setInterval(updateTime, 1000);
}

/* --------------------------------------------------------------------------
   3. PESTAÑAS DE CUADRANTES ESTELARES
   -------------------------------------------------------------------------- */
function initSectorTabs() {
  const tabButtons = document.querySelectorAll('.sector-tabs .tab-btn');
  const panels = document.querySelectorAll('.tab-panel');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');

      // Actualizar botones
      tabButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      // Actualizar paneles
      panels.forEach(p => p.classList.remove('active'));
      const activePanel = document.getElementById(`panel-${targetId}`);
      if (activePanel) {
        activePanel.classList.add('active');
      }

      playTone(520, 'sine', 0.08);
      logToTerminal(`[SPECTROMETRY] Cuadrante cambiado: Enfoque en ${btn.textContent.trim()}`, 'info');
    });
  });
}

/* --------------------------------------------------------------------------
   4. BUCLE DE TELEMETRÍA DINÁMICA
   -------------------------------------------------------------------------- */
function initTelemetryLoop() {
  const valVelocity = document.getElementById('val-velocity');
  const valLatency = document.getElementById('val-latency');
  const valShields = document.getElementById('val-shields');
  const barShields = document.getElementById('bar-shields');

  let baseVelocity = 27540;

  setInterval(() => {
    // Fluctuación de velocidad orbital
    if (valVelocity) {
      const delta = (Math.random() - 0.5) * 8;
      baseVelocity += delta;
      valVelocity.textContent = Math.round(baseVelocity).toLocaleString();
    }

    // Variación aleatoria de ping de latencia
    if (valLatency && Math.random() > 0.4) {
      const ping = 16 + Math.floor(Math.random() * 7);
      valLatency.textContent = ping;
    }
  }, 2400);
}

/* --------------------------------------------------------------------------
   5. SINTETIZADOR DE AUDIO SCI-FI (WEB AUDIO API)
   -------------------------------------------------------------------------- */
let audioCtx = null;
let soundEnabled = false;

function initAudioSystem() {
  const btnToggle = document.getElementById('btn-audio-toggle');
  const audioIcon = document.getElementById('audio-icon');

  if (!btnToggle) return;

  btnToggle.addEventListener('click', () => {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContextClass();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    soundEnabled = !soundEnabled;
    if (soundEnabled) {
      audioIcon.textContent = '🔊';
      btnToggle.style.borderColor = 'var(--accent-cyan)';
      showToast('🔊 Efectos de audio Aetheria activados.');
      playTone(600, 'sine', 0.15);
    } else {
      audioIcon.textContent = '🔇';
      btnToggle.style.borderColor = 'rgba(255, 255, 255, 0.12)';
      showToast('🔇 Audio silenciado.');
    }
  });
}

function playTone(freq, type = 'sine', duration = 0.1) {
  if (!soundEnabled || !audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (err) {
    console.warn('Audio tone error:', err);
  }
}

function playSiren() {
  if (!soundEnabled || !audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(400, audioCtx.currentTime);
    osc.frequency.linearRampToValueAtTime(800, audioCtx.currentTime + 0.3);
    osc.frequency.linearRampToValueAtTime(300, audioCtx.currentTime + 0.6);

    gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.65);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.65);
  } catch (err) {}
}

/* --------------------------------------------------------------------------
   6. TERMINAL INTERACTIVA & STREAMING DE LOGS
   -------------------------------------------------------------------------- */
let isStreamPaused = false;

function initInteractiveTerminal() {
  const terminalLogs = document.getElementById('terminal-logs');
  const terminalForm = document.getElementById('terminal-form');
  const terminalInput = document.getElementById('terminal-input');
  const btnToggleStream = document.getElementById('btn-toggle-stream');
  const btnClearTerminal = document.getElementById('btn-clear-terminal');

  // Streaming de telemetría automática
  const telemetryMessages = [
    { tag: '[QUANTUM]', msg: 'Entrelazamiento cuántico estabilizado al 99.98% de coherencia.', type: 'info' },
    { tag: '[NAV]', msg: 'Calculando vector de corrección Kepleriana (-0.02 m/s²).', type: 'info' },
    { tag: '[SPECTRO]', msg: 'Detección de absorción de metano en atmósfera exoplanetaria.', type: 'info' },
    { tag: '[CIRCLECI]', msg: 'Build pipeline verificado: Todos los tests pasaron exitosamente.', type: 'success' },
    { tag: '[ARRAY]', msg: 'Matriz de antenas Phased-Array alineada con éxito.', type: 'info' },
    { tag: '[SECURITY]', msg: 'Protocolo de cifrado Post-Cuántico Kyber-1024 verificado.', type: 'success' }
  ];

  let messageIdx = 0;
  setInterval(() => {
    if (isStreamPaused) return;
    const current = telemetryMessages[messageIdx % telemetryMessages.length];
    logToTerminal(`${current.tag} ${current.msg}`, current.type);
    messageIdx++;
  }, 5000);

  // Toggle Pausa
  if (btnToggleStream) {
    btnToggleStream.addEventListener('click', () => {
      isStreamPaused = !isStreamPaused;
      btnToggleStream.textContent = isStreamPaused ? '▶ Reanudar Stream' : '⏸ Pausar Stream';
      showToast(isStreamPaused ? 'Stream de logs en pausa.' : 'Stream de logs reanudado.');
    });
  }

  // Limpiar terminal
  if (btnClearTerminal) {
    btnClearTerminal.addEventListener('click', () => {
      if (terminalLogs) {
        terminalLogs.innerHTML = '';
        logToTerminal('[SYSTEM] Consola purgada. Esperando nuevos registros...', 'info');
      }
    });
  }

  // Ejecución de comandos del usuario
  if (terminalForm && terminalInput) {
    terminalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const rawInput = terminalInput.value.trim();
      if (!rawInput) return;

      logToTerminal(`orbit-ai:~$ ${rawInput}`, 'info');
      terminalInput.value = '';
      executeCommand(rawInput.toLowerCase());
    });
  }
}

function logToTerminal(message, type = 'info') {
  const terminalLogs = document.getElementById('terminal-logs');
  if (!terminalLogs) return;

  const now = new Date();
  const timeStr = `[${String(now.getUTCHours()).padStart(2, '0')}:${String(now.getUTCMinutes()).padStart(2, '0')}:${String(now.getUTCSeconds()).padStart(2, '0')} UTC]`;

  const logDiv = document.createElement('div');
  logDiv.className = `log-line ${type}`;

  const timeSpan = document.createElement('span');
  timeSpan.className = 'log-time';
  timeSpan.textContent = timeStr;

  const msgSpan = document.createElement('span');
  msgSpan.className = 'log-msg';
  msgSpan.textContent = ` ${message}`;

  logDiv.appendChild(timeSpan);
  logDiv.appendChild(msgSpan);
  terminalLogs.appendChild(logDiv);

  // Scroll automático
  terminalLogs.scrollTop = terminalLogs.scrollHeight;
}

function executeCommand(cmd) {
  playTone(450, 'square', 0.08);

  switch (cmd) {
    case 'help':
      logToTerminal('--- COMANDOS DISPONIBLES EN ORBIT-AI ---', 'info');
      logToTerminal('• scan      : Dispara escaneo estelar y recarga objetivos de radar', 'info');
      logToTerminal('• flare     : Simula tormenta de eyección de masa coronal solar', 'warn');
      logToTerminal('• circleci  : Muestra la arquitectura del pipeline de CI/CD', 'success');
      logToTerminal('• status    : Reporte consolidado de telemetría de subsistemas', 'info');
      logToTerminal('• clear     : Limpia la pantalla de la consola', 'info');
      break;

    case 'scan':
      document.getElementById('btn-scan-deep-space')?.click();
      break;

    case 'flare':
      document.getElementById('btn-simulate-flare')?.click();
      break;

    case 'circleci':
      logToTerminal('[CIRCLECI v2.1] Arquitectura de Integración Continua:', 'success');
      logToTerminal('  - Job 1: validate_and_test (Docker: cimg/node:20.11)', 'info');
      logToTerminal('  - Job 2: package_artifacts (Crea dist/orbit-ai-release.tar.gz)', 'info');
      logToTerminal('  - Workflow: build_test_and_package [ESTADO: OPERACIONAL]', 'success');
      showToast('🚀 Pipeline CircleCI verificado.');
      break;

    case 'status':
      logToTerminal('[STATUS REPORT] Órbita: 408 km | Núcleo: 2.71 K | Enlace: Óptimo', 'success');
      showToast('📊 Reporte de subsistemas emitido.');
      break;

    case 'clear':
      document.getElementById('btn-clear-terminal')?.click();
      break;

    default:
      logToTerminal(`Comando no reconocido: '${cmd}'. Escribe 'help' para ver la lista.`, 'warn');
  }
}

/* --------------------------------------------------------------------------
   7. BOTONES DE ACCIÓN PRINCIPALES
   -------------------------------------------------------------------------- */
function initActionButtons() {
  const btnScan = document.getElementById('btn-scan-deep-space');
  const btnFlare = document.getElementById('btn-simulate-flare');
  const btnCheck = document.getElementById('btn-system-check');
  const radarTargets = document.getElementById('radar-targets-count');
  const radarContainer = document.getElementById('radar-container');

  // Iniciar Escaneo Estelar
  if (btnScan) {
    btnScan.addEventListener('click', () => {
      playTone(880, 'sine', 0.25);
      showToast('📡 Escaneo estelar de 360° iniciado.');
      logToTerminal('[RADAR] Escaneo en cuadrantes profundos iniciado...', 'info');

      // Animación en el radar
      if (radarContainer) {
        radarContainer.style.borderColor = 'var(--accent-green)';
        setTimeout(() => {
          radarContainer.style.borderColor = 'rgba(0, 242, 254, 0.3)';
        }, 1500);
      }

      setTimeout(() => {
        const found = 3 + Math.floor(Math.random() * 4);
        if (radarTargets) {
          radarTargets.textContent = `${found} OBJETOS EN RANGO`;
        }
        playTone(950, 'sine', 0.15);
        logToTerminal(`[RADAR] Escaneo completado: ${found} firmas electromagnéticas detectadas.`, 'success');
        showToast(`✨ Escaneo completado: ${found} objetos detectados.`);
      }, 1200);
    });
  }

  // Simular Tormenta Solar
  if (btnFlare) {
    btnFlare.addEventListener('click', () => {
      playSiren();
      showToast('⚠️ ALERTA: Eyección de Masa Coronal detectada.', 'warn');
      logToTerminal('[ALERTA DE DEFENSA] Radiación solar extrema detectada.', 'error');

      const valShields = document.getElementById('val-shields');
      const barShields = document.getElementById('bar-shields');
      const cardShields = document.getElementById('card-shields');

      if (valShields && barShields && cardShields) {
        cardShields.style.borderColor = 'var(--accent-red)';
        valShields.textContent = '64.2';
        valShields.style.color = 'var(--accent-red)';
        barShields.style.width = '64.2%';
        barShields.style.background = 'linear-gradient(90deg, #ff3366, #ffb703)';

        logToTerminal('[DEFLECTORES] Escudos absorbiendo radiación de plasma. Integridad: 64.2%.', 'warn');

        // Recuperación progresiva
        setTimeout(() => {
          logToTerminal('[DEFLECTORES] Enrutando energía de emergencia al campo deflector...', 'info');
          valShields.textContent = '82.5';
          barShields.style.width = '82.5%';
        }, 2000);

        setTimeout(() => {
          valShields.textContent = '98.6';
          valShields.style.color = '#ffffff';
          barShields.style.width = '98.6%';
          barShields.style.background = 'linear-gradient(90deg, #7928ca, #ff0080)';
          cardShields.style.borderColor = 'var(--border-glass)';
          logToTerminal('[DEFLECTORES] Escudos normalizados al 98.6%. Tormenta disipada.', 'success');
          showToast('✅ Escudos restaurados a nivel nominal.');
        }, 4000);
      }
    });
  }

  // Test de Diagnóstico
  if (btnCheck) {
    btnCheck.addEventListener('click', () => {
      playTone(660, 'triangle', 0.2);
      showToast('⚙ Iniciando diagnóstico integral...');
      logToTerminal('[DIAGNOSTIC] Comprobando telemetría, CI/CD y enlace DSN...', 'info');

      setTimeout(() => {
        logToTerminal('[DIAGNOSTIC] Subrutinas de cálculo: OK (100%)', 'success');
      }, 500);

      setTimeout(() => {
        logToTerminal('[DIAGNOSTIC] CircleCI Webhook Link: ACTIVO & LISTO PARA DESPLIEGUE', 'success');
        showToast('🎯 Todos los sistemas operando al 100% de eficiencia.');
      }, 1100);
    });
  }
}

/* --------------------------------------------------------------------------
   8. NOTIFICACIONES TOAST FLOTANTES
   -------------------------------------------------------------------------- */
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;

  if (type === 'warn') {
    toast.style.borderColor = 'var(--accent-red)';
    toast.style.boxShadow = '0 10px 25px rgba(255, 51, 102, 0.4)';
  }

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(15px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}
