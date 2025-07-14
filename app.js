
const API_URL = 'https://script.google.com/macros/s/AKfycbxQ1Jk1kcJslzkQ1yqynmjin9-xZqgAQcwz1Ram5S_4xJv_ocLgdiFzLHJbIXQDMZLCrw/exec';

document.getElementById("playerForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const jugador = {
    nombre: document.getElementById("nombre").value.trim(),
    categoria: document.getElementById("categoria").value,
    altura: document.getElementById("altura").value,
    peso: document.getElementById("peso").value,
    envergadura: document.getElementById("envergadura").value,
    talla_pie: document.getElementById("talla_pie").value.trim(),
    talla_camiseta: document.getElementById("talla_camiseta").value.trim(),
    talla_pantalon: document.getElementById("talla_pantalon").value.trim(),
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
    tapones: document.getElementById("tapones").value,
  };

  if (!jugador.nombre || !jugador.categoria) {
    alert("Nombre y categoría son obligatorios.");
    return;
  }

  if (jugador.talla_pie && !/^\d{2}(\.\d)?$/.test(jugador.talla_pie)) {
    alert("Talla de pie inválida. Usa formato 42 o 42.5");
    return;
  }

  if (jugador.talla_camiseta && !/^(XS|S|M|L|XL|XXL)$/i.test(jugador.talla_camiseta)) {
    alert("Talla de camiseta debe ser XS, S, M, L, XL o XXL");
    return;
  }

  if (jugador.lateral && !/^\d+(\.\d{1,2})?$/.test(jugador.lateral)) {
    alert("Desplazamiento lateral debe ser número con hasta 2 decimales");
    return;
  }

  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(jugador),
    headers: {
      "Content-Type": "application/json",
    },
  }).then(() => {
    mostrarJugadores();
    document.getElementById("playerForm").reset();
  }).catch((err) => {
    console.error("Error al guardar:", err);
    alert("Error al guardar jugador");
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
      item.innerHTML = `${jug.nombre} (${jug.categoria}) - Puntos: ${jug.puntos}, Rebotes: ${jug.rebotes}
        <button onclick='mostrarGraficoJugador(${JSON.stringify(jug)})'>📊</button>`;
      lista.appendChild(item);
    });
  } catch (error) {
    console.error("Error al cargar jugadores:", error);
  }
}

mostrarJugadores();
