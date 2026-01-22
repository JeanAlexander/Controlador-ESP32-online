const API_URL = "https://utricular-nontemporizingly-dominque.ngrok-free.dev";
const PINES = [2, 4, 5, 12, 13, 14, 18, 19, 21, 22];
const contenedor = document.getElementById("pins");

const NGROK_HEADERS = { "ngrok-skip-browser-warning": "true" };
const historial = {};
const timers = {};

// ================== CREAR TARJETAS ==================
PINES.forEach(pin => {
  historial[pin] = [];

  const card = document.createElement("div");
  card.className = "pin-card";
  card.innerHTML = `
    <div class="pin-number">PIN ${pin}</div>
    <div class="conexion" id="conexion-${pin}">Conectando…</div>
    <div class="estado unknown" id="estado-${pin}">UNKNOWN</div>

    <div class="btn-group">
      <button class="on" onclick="cambiarPin(${pin}, 'on')">ON</button>
      <button class="off" onclick="cambiarPin(${pin}, 'off')">OFF</button>
      <button class="toggle" onclick="togglePin(${pin})">↻</button>
    </div>

    <div class="historial" id="historial-${pin}"></div>

    <div>
      <input type="number" id="timer-${pin}" placeholder="seg" min="1">
      <button class="toggle" onclick="setTimer(${pin})">⏱</button>
      <span id="countdown-${pin}" class="countdown"></span>
    </div>
  `;
  contenedor.appendChild(card);

  leerEstado(pin);
});

// ================== FUNCIONES ==================
async function cambiarPin(pin, accion) {
  try {
    const res = await fetch(`${API_URL}/pin/${pin}/${accion}`, { headers: NGROK_HEADERS });
    if (!res.ok) throw new Error();

    actualizarEstado(pin, accion.toUpperCase());
    marcarConexion(pin, true);
  } catch {
    mostrarError(pin);
  }
}

function togglePin(pin) {
  const estado = document.getElementById(`estado-${pin}`).textContent;
  if (estado === "ON") cambiarPin(pin, "off");
  if (estado === "OFF") cambiarPin(pin, "on");
}

function setTimer(pin) {
  const segundos = parseInt(document.getElementById(`timer-${pin}`).value);
  if (!segundos || segundos <= 0) return;

  if (timers[pin]) {
    clearInterval(timers[pin].interval);
    clearTimeout(timers[pin].timeout);
  }

  let restante = segundos;
  document.getElementById(`countdown-${pin}`).textContent = `${restante}s`;

  timers[pin] = {
    interval: setInterval(() => {
      restante--;
      document.getElementById(`countdown-${pin}`).textContent = `${restante}s`;
      if (restante <= 0) clearInterval(timers[pin].interval);
    }, 1000),
    timeout: setTimeout(() => togglePin(pin), segundos * 1000)
  };
}

async function leerEstado(pin) {
  try {
    const res = await fetch(`${API_URL}/pin/${pin}/state`, { headers: NGROK_HEADERS });
    if (!res.ok) throw new Error();
    const data = await res.json();
    actualizarEstado(pin, data.state);
    marcarConexion(pin, true);
  } catch {
    mostrarError(pin);
  }
}

function actualizarEstado(pin, estado) {
  const el = document.getElementById(`estado-${pin}`);
  el.textContent = estado;
  el.className = `estado ${estado === "ON" ? "on" : estado === "OFF" ? "off" : "unknown"}`;
  el.classList.add("active");
  setTimeout(() => el.classList.remove("active"), 600);

  historial[pin].unshift(`${new Date().toLocaleTimeString()} → ${estado}`);
  historial[pin] = historial[pin].slice(0, 5);
  document.getElementById(`historial-${pin}`).innerHTML = historial[pin].join("<br>");
}

function mostrarError(pin) {
  const el = document.getElementById(`estado-${pin}`);
  el.textContent = "ERROR";
  el.className = "estado unknown";
  marcarConexion(pin, false);
}

function marcarConexion(pin, ok) {
  const el = document.getElementById(`conexion-${pin}`);
  el.textContent = ok ? "Conectado" : "Sin conexión";
  el.style.color = ok ? "#4caf50" : "#f44336";
}

// ================== AUTO REFRESH ==================
setInterval(() => PINES.forEach(leerEstado), 2000);
