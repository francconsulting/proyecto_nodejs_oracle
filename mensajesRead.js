/**
 * ejecutar siempre esto en la ventana donde se inicia node
 *  export LD_LIBRARY_PATH=/opt/oracle/instantclient:$LD_LIBRARY_PATH
 *
 * parta ejecutar manualmente con aumento de memoria de nodejs necesario para
 * que corra de forma correcta la api:
 *      node tdcVivosgetRows.js --max_old_space_size=8192 --optimize_for_size --stack_size=8192
 *
 * Para ejecutarlo automaticamente, se ha introducido en el package.json la
 * linea "dev" en escript. Se debe ejecutar el siguiente comando:
 *      npm run dev
 *
 */

var //oracledb = require("oracledb"),
  //dbConfig = require("./dbconfig.js"),
  ConnBd = require("./connBd.js"),
  fs = require("fs"),
  ExcelFile = require("./excelFile"),
  reloj = require("./reloj"),
  numRows = 300, //paquete de registros a recibir
  iRowsAffec = 0, //registros recuperados
  arrayHeader = [],
  arrayData = [],
  ssql;

//ssql = "select * FROM GIGA_OWNER.t1soatr TDC where rownum <= 5 ";

fs.readFile(
  "Consulta Solicitudes para mensajes.sql",
  { encoding: "utf-8" },
  (err, data) => {
    ssql = data;
  }
);
var paramsSql = { TIPOSOL: "A3", fecha_desde: "2018-01-01" }; //parametros para la consulta

/*fs.readFile("instruccion_sql.sql", { encoding: "utf-8" }, (err, data) => {
  ssql = data;
});
var paramsSql = { numrows: 255 };
*/
var configExcel = {
  tipo: "stream",
  name_wb: "mensajes.xlsx",
  name_ws: "mensajes"
};

/** //UTILES */
/*var rows2json = (namefile, datos) => {
  fs.writeFile(namefile, JSON.stringify(datos), () => {
    console.log("fin creacion del fichero ", namefile);
  });
};*/

/**
 * Lectura de Json y convertir a array
 */
var json2row = fileName => {
  return new Promise((resolve, reject) => {
    fs.readFile(fileName, { encoding: "UTF-8" }, (err, data) => {
      jsonArray = JSON.parse(data);
      var i = 0;
      jsonArray.forEach(element => {
        // toExcel(element)

        element.forEach(e => {
          i++;
          arrayData.push(e);
        });
      });
      resolve(arrayData);
    });
  });
  /*fs.readFile(fileName, { encoding: "UTF-8" }, (err, data) => {
    jsonArray = JSON.parse(data);
    var i = 0;
    jsonArray.forEach(element => {
      // toExcel(element)

      element.forEach(e => {
        i++;
        arrayData.push(e);
      });
    });
    ExcelFile.crearLibro("stream", "milibrito.xlsx");
    ExcelFile.crearHoja("hoja1");
    ExcelFile.getHoja("hoja1");

    var i = 0;
    arrayData.forEach(e => {
      ExcelFile.dataControl(e, i, arrayData.length);

      i++;
      if (i == arrayData.length) {
        reloj.timeStop();
      }
    });
  });*/
};
/** -//UTILES  */

var tdcs = (err, conn) => {
  if (err) {
    console.log("Error en la conexion");
    return;
  }
  mensaje = "Conectado. Esperando a ejecutar la consulta.....";
  reloj.setMensaje(mensaje);
  reloj.timeStart();

  var wb = ExcelFile.setWB ()
  wb.xlsx.readFile('mensajes.xlsx').then( ()=> {
    
    let ws = wb.getWorksheet(1);
    let lastRow = ws.lastRow
    console.log(lastRow.number)
    ws.addRow([3,"SAM",new Date()]).commit()
    ws.getRow(4538).getCell(4).value = {formula: 'D3 + D2', value :'10'}
    wb.xlsx.writeFile('mensajes.xlsx').then(
     reloj.timeStop()
    )
  })
  
};

//conectar(tdcs);

ConnBd.open(tdcs);
