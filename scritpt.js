const API_URL = "https://utricular-nontemporizingly-dominque.ngrok-free.dev";
const PINES = [2, 4, 5, 12, 13, 14, 18, 19, 21, 22];
const contenedor = document.getElementById("pins");

// Crear UI
PINES.forEach(pin => {
  const card = document.createElement("div");
  card.className = "pin-card";
  card.innerHTML = `
    <div class="pin-number">PIN ${pin}</div>
    <div class="estado unknown" id="estado-${pin}">UNKNOWN</div>
    <button class="btn-on" onclick="cambiarPin(${pin}, 'on')">ON</button>
    <button class="btn-off" onclick="cambiarPin(${pin}, 'off')">OFF</button>
  `;
  contenedor.appendChild(card);
});

// Headers obligatorios para NGROK
const NGROK_HEADERS = {
  "ngrok-skip-browser-warning": "true"
};

// Cambiar pin
function cambiarPin(pin, accion) {
  fetch(`${API_URL}/pin/${pin}/${accion}`, {
    headers: NGROK_HEADERS
  })
    .then(res => res.json())
    .then(() => leerEstado(pin))
    .catch(() => mostrarError(pin));
}

// Leer estado
function leerEstado(pin) {
  fetch(`${API_URL}/pin/${pin}/state`, {
    headers: NGROK_HEADERS
  })
    .then(res => res.json())
    .then(data => {
      const el = document.getElementById(`estado-${pin}`);
      el.textContent = data.state;
      el.className =
        "estado " +
        (data.state === "ON" ? "on" :
         data.state === "OFF" ? "off" :
         "unknown");
    })
    .catch(() => mostrarError(pin));
}

function mostrarError(pin) {
  const el = document.getElementById(`estado-${pin}`);
  el.textContent = "ERROR";
  el.className = "estado unknown";
}

// Actualizar cada 2s
setInterval(() => {
  PINES.forEach(leerEstado);
}, 2000);
s