
const HOJA_ID = '1YYMbuESzxG9PrCGiVx1m8BqrVnFzItF46sw5v5KQqU0';
const NOMBRE_HOJA = 'Hoja1';
const HEADERS = [
  'timestamp', 'nombre', 'categoria', 'altura', 'peso', 'envergadura',
  'talla_pie', 'talla_camiseta', 'talla_pantalon',
  'salto_estatico', 'salto_carrera', 'press_banca',
  'lateral', 'agilidad', 'sprint',
  'tiro_bote', 'tiro_crono',
  'puntos', 'rebotes', 'asistencias', 'bloqueos', 'robos', 'tapones'
];

function doPost(e) {
  try {
    const hoja = SpreadsheetApp.openById(HOJA_ID).getSheetByName(NOMBRE_HOJA);
    const data = JSON.parse(e.postData.contents);

    // Crear encabezados si la hoja está vacía
    if (hoja.getLastRow() === 0) {
      hoja.appendRow(HEADERS);
    }

    const fila = [
      new Date(),
      data.nombre,
      data.categoria,
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
    ];

    hoja.appendRow(fila);
    return ContentService.createTextOutput("OK").setMimeType(ContentService.MimeType.TEXT);

  } catch (error) {
    return ContentService.createTextOutput("Error: " + error)
                         .setMimeType(ContentService.MimeType.TEXT);
  }
}

function doGet() {
  try {
    const hoja = SpreadsheetApp.openById(HOJA_ID).getSheetByName(NOMBRE_HOJA);
    const datos = hoja.getDataRange().getValues();
    const headers = datos[0];
    const registros = datos.slice(1).map(fila => {
      const obj = {};
      headers.forEach((key, i) => obj[key] = fila[i]);
      return obj;
    });

    return ContentService
      .createTextOutput(JSON.stringify(registros))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput("Error: " + error)
                         .setMimeType(ContentService.MimeType.TEXT);
  }
}
