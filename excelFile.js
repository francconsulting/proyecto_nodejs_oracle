"use strict";

var Excel = require("exceljs"),
  ExcelFile = () => {};

var wb = null, //workbook
  ws = null; //worksheet
var options = {
  filename: "libro1.xlsx",
  useStyles: true,
  useSharedStrings: true
};

/**
 *
 * @param {*} tipo  String que indica el tipo de archivo stream u objeto
 * @param {*} nombreArchivo   String con el nombre del archivo y extension (xls, xlsx, xlsb)
 */
ExcelFile.crearLibro = (tipo, nombreArchivo) => {
  options.filename = "./" + (nombreArchivo || options.filename);
  if (tipo == "stream") {
    wb = new Excel.stream.xlsx.WorkbookWriter(options);
  }
  wb.creator = "fmbv"; //propietario
  wb.created = new Date(); //fecha creacion
};

ExcelFile.crearHoja = nombreHoja => {
  var nameSheet = nombreHoja || "hoja 1";
  wb.addWorksheet(nameSheet);
};

ExcelFile.getHoja = nombreHoja => {
  ws = wb.getWorksheet(nombreHoja);
};

ExcelFile.setCabecera = arrayCabecera => {
  ws.columns = arrayCabecera;
};

ExcelFile.addRow = data => {
  ws.addRow(data).commit();
};

ExcelFile.wsClose = () => {
  ws.commit();
};

ExcelFile.wbClose = () => {
  wb.commit().then(() => {
    console.log("Libro actualizado. Ya lo puede visualizar");
  });
};

/**
 *
 * @param {Array} data Elemento a guardar en la fila del excel
 * @param {integer} nfila  numero de la fila actual
 * @param {integer} nFilas tamaño del array a guardar
 */
ExcelFile.dataControl = (data, nfila, nFilas) => {
  let percent = (nfila + 1) * 100 / nFilas;
  if (percent < 1) {
    percent = percent.toPrecision(2);
  } else if (percent < 10 && percent == 100) {
    percent = percent.toPrecision(3);
  } else if (percent < 100) {
    percent = percent.toPrecision(4);
  }
  console.log("guardando....", percent, "% ", nfila + 1, "de", nFilas);
  ExcelFile.addRow(data);
  if (nfila + 1 == nFilas) {
    ExcelFile.wsClose();
    ExcelFile.wbClose();
  }
};

module.exports = ExcelFile;
