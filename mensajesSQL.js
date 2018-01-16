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
            arrayData = data.arrayData;
            iRowsAffec = data.iRowsAffec;
            console.log(data.iRowsAffec);
            //  rows2json("mensajes.json", arrayData);
          })
          .then(() => {
            var i = 0;
            let sCupsAnt = "",
              sSolAnt = "",
              sCupsSolAnt = "",
              aDatosAnt = [],
              aMensajesTmp = [],
              aDatosFinal = [];
              aMensajesTmp.fill(null, 0, 13);

            arrayData.forEach( e=> {
              if (sCupsSolAnt != e[1] + "-" + e[2] && sCupsSolAnt != "") {
                //console.log(e[1]," ",e[2]," -----------",aDatosAnt.concat(aMensajesTmp)," ----",aMensajesTmp.toString(),            "       ",            sCupsSolAnt          );
                aMensajesTmp.shift();
                aDatosFinal.push(aDatosAnt.concat(aMensajesTmp));
                aDatosAnt = [];
                //aMensajesTmp = []
                aMensajesTmp.fill(null, 0, 13);
              }
              sCupsSolAnt = e[1] + "-" + e[2];
              sCupsAnt = e[1];
              sSolAnt = e[2];
              e[0] = e[1] + "-" + e[2];
              aDatosAnt = e.slice(0, 19); //(e[1]+ ","+e[2]+ ","+ e[22]); //todo crear un nuevo array con solo algunos elementos
              // aMensajesTmp.push(e[22])
              // aMensajesTmp.sort()
      
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
                  aMensajesTmp[0] = Null;
              }
              
              //  console.log( sCupsAnt," ",sSolAnt," ------#-----",aDatosAnt.toString()," ----",aMensajesTmp.toString()," <");
              i++;aMensajesTmp.fill(null, 0, 13);
              if (i == arrayData.length) {
                reloj.timeStop();
              }
            })
            aMensajesTmp.shift();
            aDatosFinal.push(aDatosAnt.concat(aMensajesTmp));
            
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
             console.log("fin");
            console.log(configExcel);
            ExcelFile.crearLibro("stream", configExcel.name_wb);
            ExcelFile.crearHoja(configExcel.name_ws);
            ExcelFile.getHoja(configExcel.name_ws);
            ExcelFile.setCabecera(arrayHeaderTmp);

             i = 0;

              aDatosFinal.forEach(e => {
                ExcelFile.dataControl(e, i, iRowsAffec);
                i++;
                if (i == iRowsAffec) {
                  reloj.timeStop();
                }
              });
 
          });
    /*  });*/

  })
  .catch(e => {
    console.log(e);
  });











  
    
   
};

//conectar(tdcs);

ConnBd.open(tdcs);
