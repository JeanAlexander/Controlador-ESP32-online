const API_URL = "https://utricular-nontemporizingly-dominque.ngrok-free.dev";
const ADC_PIN = 34;

const NGROK_HEADERS = {
  "ngrok-skip-browser-warning": "true"
};

const rawEl = document.getElementById("adc-raw");
const voltEl = document.getElementById("adc-voltage");
const timeEl = document.getElementById("adc-time");
const barEl = document.getElementById("adc-bar");
const statusEl = document.getElementById("esp-status");

async function leerADC() {
  try {
    const res = await fetch(`${API_URL}/adc/${ADC_PIN}`, {
      headers: NGROK_HEADERS
    });
    const data = await res.json();

    if (data.raw === null) throw "No data";

    rawEl.textContent = data.raw;
    voltEl.textContent = `${data.voltage.toFixed(2)} V`;
    timeEl.textContent = data.time;

    // Barra proporcional (0-4095)
    const porcentaje = Math.min(100, (data.raw / 4095) * 100);
    barEl.style.width = `${porcentaje}%`;

    statusEl.textContent = "ESP32 ONLINE";
    statusEl.className = "online";

  } catch {
    rawEl.textContent = "---";
    voltEl.textContent = "--- V";
    barEl.style.width = "0%";

    statusEl.textContent = "ESP32 OFFLINE";
    statusEl.className = "offline";
  }
}

// Actualiza cada 1 segundo
setInterval(leerADC, 1000);
leerADC();
