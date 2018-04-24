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

ExcelFile.setWB = () => {
  var wb = new Excel.Workbook();
  return wb;
};

ExcelFile.getLibro = nombreArchivo => {
  var wb = new Excel.Workbook();
  wb.xlsx.readFile(nombreArchivo).then(function(data) {
    // use workbook
    console.log("#####################");

    console.log(ExcelFile.getHojasLibro(data));

    let filas = data._worksheets[1]._rows,
      aFilas = [],
      aFila = [];

    filas.forEach(fila => {
      fila._cells.forEach(element => {
        console.log(element);
        // aFila.push(element._value.model.value);
        aFila.push(element._value.model.value);
      });
      aFilas.push(aFila);
    });
    /* console.log("-->", aFilas[0]);
    console.log("-->", aFilas[1]);*/

    let fila = data._worksheets[1]._rows[1]._cells;

    console.log("---------------------");
    fila.forEach(element => {
      console.log(element._address, " - ", element._value);
    });
    //console.log(ExcelFile.getCabecera(data, "mensajes"));
  });
};

ExcelFile.getCabecera = (dataBook, nameHoja) => {
  let cabecera = "",
    aCabecera = [],
    hojas = dataBook._worksheets;

  hojas.forEach(element => {
    if (nameHoja == element.name) {
      cabecera = dataBook._worksheets[element.id]._rows[0]._cells;
    }
  });
  cabecera.forEach(element => {
    // console.log(element.id)
    aCabecera.push(element.value);
  });
  //console.log(aCabecera);
  return aCabecera;
};

ExcelFile.getRows = (dataBook, nameHoja) => {
  let fila = "",
    aFilas = [],
    hojas = dataBook._worksheets;

  hojas.forEach(element => {
    if (nameHoja == element.name) {
      cabecera = dataBook._worksheets[element.id]._rows[0]._cells;
    }
  });
  cabecera.forEach(element => {
    aCabecera.push(element.value);
  });
  //console.log(aCabecera);
  return aCabecera;
};
/**
 *
 * @param {*} dataBook  Libro recuperado
 */
ExcelFile.getHojasLibro = dataBook => {
  let hojas = dataBook._worksheets,
    aHojas = [];
  hojas.forEach(element => {
    aHojas.push(element.name);
  });

  return aHojas;
};

ExcelFile.getHoja = nombreHoja => {
  return (ws = wb.getWorksheet(nombreHoja));
};

ExcelFile.setCabecera = arrayCabecera => {
  ws.columns = arrayCabecera;
};

ExcelFile.setCabeceraFromArray = arrayCabecera => {
  //console.log(arrayCabecera);
  let arrayHeader = [],
    anchoCols = 0;
  arrayHeader = arrayCabecera.map(item => {
    return { name: item };
  });
  arrayHeader = arrayHeader.map(item => {
    item.name.length < 15
      ? (anchoCols = 15)
      : (anchoCols = item.name.length + 1);
    return { header: item.name, key: item.name, width: anchoCols };
  });
  return arrayHeader;
};

ExcelFile.addRow = data => {
  ws.addRow(data).commit();
};
ExcelFile.getLastRow = ws => {
  console.log(ws.lastRow);
  return ws.lastRow;
};

ExcelFile.wsClose = () => {
  ws.commit();
};

ExcelFile.wbClose = () => {
  wb.commit().then(() => {
    console.log("Libro " + options.filename + " actualizado. Ya lo puede visualizar");
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
  if (percent % 1 == 0) {
  console.log("guardando....", percent, "% ", nfila + 1, "de", nFilas);
  }
  ExcelFile.addRow(data);
  if (nfila + 1 == nFilas) {
    ExcelFile.wsClose();
    ExcelFile.wbClose();
  }
};

module.exports = ExcelFile;
