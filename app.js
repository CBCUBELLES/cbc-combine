
const API_URL = 'https://script.google.com/macros/s/AKfycbxQ1Jk1kcJslzkQ1yqynmjin9-xZqgAQcwz1Ram5S_4xJv_ocLgdiFzLHJbIXQDMZLCrw/exec'; // ← Reemplaza esto con tu URL real

document.getElementById("playerForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const jugador = {
    nombre: document.getElementById("nombre").value,
    altura: document.getElementById("altura").value,
    peso: document.getElementById("peso").value,
    envergadura: document.getElementById("envergadura").value,
    talla_pie: document.getElementById("talla_pie").value,
    talla_camiseta: document.getElementById("talla_camiseta").value,
    talla_pantalon: document.getElementById("talla_pantalon").value,
    salto_estatico: document.getElementById("salto_estatico").value,
    salto_carrera: document.getElementById("salto_carrera").value,
    press_banca: document.getElementById("press_banca").value,
    lateral: document.getElementById("lateral").value,
    agilidad: document.getElementById("agilidad").value,
    sprint: document.getElementById("sprint").value,
    tiro_bote: document.getElementById("tiro_bote").value,
    tiro_crono: document.getElementById("tiro_crono").value,
    puntos: document.getElementById("puntos").value,
    rebotes: document.getElementById("rebotes").value,
    asistencias: document.getElementById("asistencias").value,
    bloqueos: document.getElementById("bloqueos").value,
    robos: document.getElementById("robos").value,
    tapones: document.getElementById("ayudas").value,
  };

  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(jugador),
    headers: {
      "Content-Type": "application/json",
    },
  }).then(() => {
    mostrarJugadores();
    this.reset();
  });
});

async function mostrarJugadores() {
  const lista = document.getElementById("jugadoresList");
  lista.innerHTML = "";
  try {
    const res = await fetch(API_URL);
    const jugadores = await res.json();
    jugadores.forEach((jug) => {
      const item = document.createElement("li");
      item.innerHTML = `${jug.nombre} - Puntos: ${jug.puntos}, Rebotes: ${jug.rebotes} <button onclick='mostrarGraficoJugador(${JSON.stringify(jug)})'>📊</button>`;
      lista.appendChild(item);
    });
  } catch (error) {
    console.error("Error al cargar jugadores:", error);
  }
}

mostrarJugadores();







let chartInstance = null;
let jugadoresSeleccionados = [];

const categoriaColores = {'PRE-MINI': '#2196f3', 'MINI': '#4caf50', 'PRE-INFANTIL': '#ff9800', 'INFANTIL': '#795548', 'CADETE': '#9c27b0', 'JUNIOR': '#607d8b', 'SUB-20': '#3f51b5', 'SENIOR': '#e91e63', 'VETERANOS': '#009688', 'PRE-MINI FEMENINO': '#64b5f6', 'MINI FEMENINO': '#81c784', 'PRE-INFANTIL FEMENINO': '#ffb74d', 'INFANTIL FEMENINO': '#a1887f', 'CADETE FEMENINO': '#ce93d8', 'JUNIOR FEMENINO': '#90a4ae', 'SUB-20 FEMENINO': '#7986cb', 'SENIOR FEMENINO': '#f06292', 'VETERANOS FEMENINO': '#80cbc4'};

function mostrarGraficoJugador(jugador) {
  if (jugadoresSeleccionados.length >= 2) jugadoresSeleccionados.shift();
  jugadoresSeleccionados.push(jugador);
  renderizarGrafico();
}

function renderizarGrafico() {
  const ctx = document.getElementById('playerChart').getContext('2d');
  const graficoSeccion = document.getElementById('graficoJugador');
  graficoSeccion.classList.remove('hidden');

  function porcentaje(str) {
    const match = /^(\d+)\s+de\s+(\d+)$/.exec(str);
    if (!match) return 0;
    const x = parseInt(match[1]);
    const y = parseInt(match[2]);
    return y > 0 ? Math.round((x / y) * 100) : 0;
  }

  const labels = [
    'Altura', 'Peso', 'Envergadura', 'Salto Estático', 'Salto Carrera',
    'Press Banca', 'Lateral', 'Agilidad', 'Sprint',
    'Tiro Bote', 'Tiro Crono',
    'Puntos', 'Rebotes', 'Asistencias', 'Bloqueos', 'Robos', 'Tapones'
  ];

  const datasets = jugadoresSeleccionados.map(jugador => {
    const color = categoriaColores[jugador.categoria] || 'rgba(0,0,0,0.5)';
    return {
      label: jugador.nombre + ' (' + jugador.categoria + ')',
      data: [
        parseFloat(jugador.altura) || 0,
        parseFloat(jugador.peso) || 0,
        parseFloat(jugador.envergadura) || 0,
        parseFloat(jugador.salto_estatico) || 0,
        parseFloat(jugador.salto_carrera) || 0,
        parseFloat(jugador.press_banca) || 0,
        parseFloat(jugador.lateral) || 0,
        parseFloat(jugador.agilidad) || 0,
        parseFloat(jugador.sprint) || 0,
        parseFloat(jugador.tiro_bote) || 0,
        parseFloat(jugador.tiro_crono) || 0,
        porcentaje(jugador.puntos),
        porcentaje(jugador.rebotes),
        porcentaje(jugador.asistencias),
        porcentaje(jugador.bloqueos),
        porcentaje(jugador.robos),
        porcentaje(jugador.tapones)
      ],
      backgroundColor: color + '33',
      borderColor: color,
      borderWidth: 2
    };
  });

  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(ctx, {
    type: 'radar',
    data: {
      labels,
      datasets
    },
    options: {
      responsive: true,
      scales: {
        r: {
          angleLines: { display: false },
          suggestedMin: 0
        }
      }
    }
  });
}

function cerrarGrafico() {
  document.getElementById('graficoJugador').classList.add('hidden');
  jugadoresSeleccionados = [];
  if (chartInstance) chartInstance.destroy();
}
