
const HOJA_ID = '1YYMbuESzxG9PrCGiVx1m8BqrVnFzItF46sw5v5KQqU0';
const NOMBRE_HOJA = 'Hoja1';

function doPost(e) {
  const sheet = SpreadsheetApp.openById(HOJA_ID).getSheetByName(NOMBRE_HOJA);
  const data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    new Date(),
    data.nombre,
    data.altura,
    data.peso,
    data.envergadura,
    data.talla_pie,
    data.talla_camiseta,
    data.talla_pantalon,
    data.salto_estatico,
    data.salto_carrera,
    data.press_banca,
    data.lateral,
    data.agilidad,
    data.sprint,
    data.tiro_bote,
    data.tiro_crono,
    data.puntos,
    data.rebotes,
    data.asistencias,
    data.bloqueos,
    data.robos,
    data.tapones
  ]);

  return ContentService.createTextOutput('OK');
}

function doGet() {
  const sheet = SpreadsheetApp.openById(HOJA_ID).getSheetByName(NOMBRE_HOJA);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const jugadores = data.slice(1).map(row => {
    const obj = {};
    headers.forEach((key, i) => obj[key] = row[i]);
    return obj;
  });

  return ContentService
    .createTextOutput(JSON.stringify(jugadores))
    .setMimeType(ContentService.MimeType.JSON);
}
