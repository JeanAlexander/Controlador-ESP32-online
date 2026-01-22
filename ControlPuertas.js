const API_URL = "https://utricular-nontemporizingly-dominque.ngrok-free.dev";
const NGROK_HEADERS = { "ngrok-skip-browser-warning": "true" };

// ================== MAPEO PUERTA → PIN ==================
const PUERTAS = {
  entrada: 2,

  p1_oficina: 4,
  p1_almacen: 5,
  ascensor_1: 12,

  p2_oficina: 13,
  p2_sala: 14,
  ascensor_2: 18
};

// ================== INICIALIZAR ==================
Object.keys(PUERTAS).forEach(id => {
  leerEstadoPuerta(id);
});

// ================== FUNCIONES ==================
async function toggleDoor(id) {
  const pin = PUERTAS[id];
  const door = document.getElementById(id);

  const estaCerrada = door.classList.contains("closed");
  const accion = estaCerrada ? "on" : "off"; // ON = abrir, OFF = cerrar

  try {
    const res = await fetch(
      `${API_URL}/pin/${pin}/${accion}`,
      { headers: NGROK_HEADERS }
    );
    if (!res.ok) throw new Error();

    actualizarUI(id, accion === "on");
  } catch (e) {
    console.error("Error con puerta", id);
    alert("❌ Error de conexión con ESP32");
  }
}

async function leerEstadoPuerta(id) {
  const pin = PUERTAS[id];
  const door = document.getElementById(id);

  try {
    const res = await fetch(
      `${API_URL}/pin/${pin}/state`,
      { headers: NGROK_HEADERS }
    );
    if (!res.ok) throw new Error();

    const data = await res.json();
    const abierta = data.state === "ON";
    actualizarUI(id, abierta);
  } catch {
    console.warn("No se pudo leer estado de", id);
  }
}

// ================== UI ==================
function actualizarUI(id, abierta) {
  const door = document.getElementById(id);
  const button = door.querySelector("button");

  if (abierta) {
    door.classList.remove("closed");
    button.textContent = "Cerrar";
  } else {
    door.classList.add("closed");
    button.textContent = "Abrir";
  }
}

// ================== AUTO REFRESH ==================
setInterval(() => {
  Object.keys(PUERTAS).forEach(leerEstadoPuerta);
}, 2000);
