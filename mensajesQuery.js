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
  name_wb: "mensajesSQL.xlsx",
  name_ws: "mensajes"
};

var tdcs = (err, conn) => {
  if (err) {
    console.log("Error en la conexion");
    return;
  }
  mensaje = "Conectado. Esperando a ejecutar la consulta.....";
  reloj.setMensaje(mensaje);
  reloj.timeStart();

  ConnBd.ejecutarSqlPromise(conn, ssql, paramsSql)
    .then(results => {
      /*ConnBd.getCabecera(conn, results)
      .then(data => {
        arrayHeader = data;
        Array.prototype.push.apply(arrayHeader, arrayHeaderTmp);
        //console.log(arrayHeader);
      })
      .then(() => {*/
      ConnBd.getAllRows(conn, results, numRows)
        .then(data => {
          data.arrayData.forEach(element => { //añadir los elemento de cada bloque de registros a un array
            element.forEach(element => {
              arrayData.push(element);
            });
          });
          iRowsAffec = data.iRowsAffec;
          return arrayData;
        })
        .then(arrayData => {
          var i = 0;
          let sCupsAnt = "",
            sSolAnt = "",
            sCupsSolAnt = "",
            aDatosAnt = [],
            aMensajesTmp = [],
            aDatosFinal = [];
          aMensajesTmp.fill(null, 0, 13);
          arrayData.forEach(e => {
            //cuando se cambia a un cups y solicitud distinto
            if (sCupsSolAnt != e[1] + "-" + e[2] && sCupsSolAnt != "") {
                          //console.log(e[1]," ",e[2]," -----------",aDatosAnt.concat(aMensajesTmp)," ----",aMensajesTmp.toString(),            "       ",            sCupsSolAnt          );
              aMensajesTmp.shift(); //eliminar el primer elemento
              aDatosFinal.push(aDatosAnt.concat(aMensajesTmp)); //concatenar datos y añadir al array de datos final
              aDatosAnt = []; //inicializar el array
              aMensajesTmp.fill(null, 0, 13); //poner todos los valores del array a null
            }
            sCupsSolAnt = e[1] + "-" + e[2];
            sCupsAnt = e[1];
            sSolAnt = e[2];
            e[0] = e[1] + "-" + e[2];
            aDatosAnt = e.slice(0, 19); //todo crear un nuevo array con solo algunos elementos

            //rellenar el array de mensajes de la solicitud
            switch (e[22]) {
              case "01":
                aMensajesTmp[parseInt(e[22])] = parseInt(e[22]);
                break;
              case "02":
                aMensajesTmp[parseInt(e[22])] = parseInt(e[22]);
                break;
              case "03":
                aMensajesTmp[parseInt(e[22])] = parseInt(e[22]);
                break;
              case "04":
                aMensajesTmp[parseInt(e[22])] = parseInt(e[22]);
                break;
              case "05":
                aMensajesTmp[parseInt(e[22])] = parseInt(e[22]);
                break;
              case "06":
                aMensajesTmp[parseInt(e[22])] = parseInt(e[22]);
                break;
              case "07":
                aMensajesTmp[parseInt(e[22])] = parseInt(e[22]);
                break;
              case "08":
                aMensajesTmp[parseInt(e[22])] = parseInt(e[22]);
                break;
              case "09":
                aMensajesTmp[parseInt(e[22])] = parseInt(e[22]);
                break;
              case "10":
                aMensajesTmp[parseInt(e[22])] = parseInt(e[22]);
                break;
              case "11":
                aMensajesTmp[parseInt(e[22])] = parseInt(e[22]);
                break;
              case "12":
                aMensajesTmp[parseInt(e[22])] = parseInt(e[22]);
                break;
              default:
                aMensajesTmp[0] = null; //vacial la primera posicion
            }

            //  console.log( sCupsAnt," ",sSolAnt," ------#-----",aDatosAnt.toString()," ----",aMensajesTmp.toString()," <");
            i++;
            if (i == arrayData.length) {
             // reloj.timeStop();
            }
          });
          aMensajesTmp.shift(); //eliminar el primer elemento del array
          aDatosFinal.push(aDatosAnt.concat(aMensajesTmp));
          return aDatosFinal;
        })
        //crear un libro nuevo y escribir en una hoja nueva
        .then(aDatosFinal => {
          
          let aCabeceraTmp = [
            "Id",
            "CUPS",
            "Código interno de solicitud",
            "PM",
            "Fecha recepción",
            "Estado solicitud",
            "Fecha aceptación INFORMES",
            "Estado plazo aceptación legal",
            "Fecha activación",
            "Estado plazo activación legal",
            "Fecha anulación",
            "Fecha rechazo",
            "CORRECTIVO_VU",
            "Estado procesamiento",
            "proceso",
            "motivo",
            "subtipos",
            "no enviar comunicacion",
            "ATR Directo",
            "PASO01",
            "PASO02",
            "PASO03",
            "PASO04",
            "PASO05",
            "PASO06",
            "PASO7",
            "PASO08",
            "PASO09",
            "PASO10",
            "PASO11",
            "PASO12"
          ];
          let arrayHeaderTmp = ExcelFile.setCabeceraFromArray(aCabeceraTmp);

          mensaje = "Iniciando el proceso de creación de fichero xlsx....";
          reloj.setMensaje(mensaje);
          
          /*ExcelFile.crearLibro("stream", configExcel.name_wb);
          ExcelFile.crearHoja(configExcel.name_ws);
          ExcelFile.getHoja(configExcel.name_ws);
          ExcelFile.setCabecera(arrayHeaderTmp);
          iRowsAffec = aDatosFinal.length
         let i = 0;
          aDatosFinal.forEach(e => {
            ExcelFile.dataControl(e, i, iRowsAffec);
            i++;
            //console.log(i, " ", iRowsAffec, " tamaño aDatosFinal: ",aDatosFinal.length);
            if (i == iRowsAffec) {
              reloj.timeStop();
            }
          });      */ 
          
          
          var wb = ExcelFile.setWB ()
                
          wb.xlsx.readFile('mensajes.xlsx').then( ()=> {
            wb.removeWorksheet(2)
            wb.removeWorksheet(3)
            wb.addWorksheet('HojaNueva2');
            let ws = wb.getWorksheet(2);

            let lastRow = ws.lastRow
            //console.log(lastRow.number)
            ws.addRow(aCabeceraTmp).commit()
            aDatosFinal.forEach(element => {
              ws.addRow(element).commit()
            });
            ws.addRow([3,"SAMiiixxxxxxxxx",new Date()]).commit()
            
            for (let x = 0; x < aDatosFinal.length; x++) {
              ws.getRow(x+2).getCell(32).value = {formula: 'A1+B1', result:'VERDADERO'}
              
            }
            
            //ws.getRow(4538).getCell(4).value = {formula: 'D3 + D2', value :'10'}

            wb.xlsx.writeFile('mensajes.xlsx').then( 
                reloj.timeStop()
            )
          })
          

          return {cabecera: aCabeceraTmp, datos:aDatosFinal}
        })
        //leer un libro existente y escribir en una hoja
        .then( (data) => {
                
        });
      /*  });*/
    })
    .catch(e => {
      console.log(e);
    });
};


var escribirEnExcel = () => {
  var wb = ExcelFile.setWB ()
                
                wb.xlsx.readFile('mensajes.xlsx').then( ()=> {
                  //wb.removeWorksheet(2)
                  //wb.addWorksheet('HojaNueva2');
                  let ws = wb.getWorksheet(2);

                  let lastRow = ws.lastRow
                  //console.log(lastRow.number)
                  //ws.addRow(data.cabecera).commit()
                  ws.addRow([3,"SAMiiiiii",new Date()]).commit()
                  ws.getRow(2).getCell(4).value  = 556
                  wb.getWorksheet(1);
                  wb.xlsx.writeFile('mensajes1.xlsx').then( 
                      reloj.timeStop()
                  )
                })
}
escribirEnExcel();
//ConnBd.open(tdcs);
