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

  json2row("mensajes.json").then(data => {
    var i = 0;
    let sCupsAnt = "",
      sSolAnt = "",
      sCupsSolAnt = "",
      aDatosAnt = [];
      aMensajesTmp = [] 

    data.forEach(e => {
      //console.log(e[2]);
      if (sCupsSolAnt != (e[1]+ "-"+ e[2]) && sCupsSolAnt != "") {
        console.log(e[1], " ", e[2], " -----------", aDatosAnt," ----", aMensajesTmp.toString(),"       ", sCupsSolAnt );
        aDatosAnt = [];
        aMensajesTmp = []
      }
      sCupsSolAnt = (e[1]+"-"+e[2]);
      sCupsAnt = e[1];
      sSolAnt = e[2];
      aDatosAnt = e.slice(0,19) //(e[1]+ ","+e[2]+ ","+ e[22]); //todo crear un nuevo array con solo algunos elementos
     // aMensajesTmp.push(e[22])
     // aMensajesTmp.sort()

      switch (e[22]) {
        case '01':
        console.log('>>>>>>>>>>>>>>>>>',e[22])
          aDatosAnt[19] = e[22]
          break;
        case '02':
          aDatosAnt[20] = e[22]
          break;
        case 03:
          aDatosAnt[21] = e[22]
          break;
        case 04:
          aDatosAnt[22] = e[22]
          break; 
        case 05:
          aDatosAnt[23] = e[22]
          break;  
        case 06:
          aDatosAnt[24] = e[22]
          break;    
          case 07:
          aDatosAnt[25] = e[22]
          break;
        case 08:
          aDatosAnt[26] = e[22]
          break;
        case 09:
          aDatosAnt[27] = e[22]
          break;
          case 10:
          aDatosAnt[28] = e[22]
          break;
        case 11:
          aDatosAnt[29] = e[22]
          break;
        case 12:
          aDatosAnt[30] = e[22]
          break;      
      }  
      //aDatosAnt[19] = aMensajesTmp
      console.log(sCupsAnt, " ", sSolAnt, " ------#-----", aDatosAnt.toString()," ----", aMensajesTmp.toString(), " <");
      i++;
      if (i == data.length) {
        reloj.timeStop();
      }
    });
    console.log(sCupsAnt, " ", sSolAnt, " ----..-----", aDatosAnt," --", aMensajesTmp.toString());
  });



  let arrayHeaderTmp = ExcelFile.setCabeceraFromArray(["Paso01", "Paso02","Paso03", "Paso04","Paso05", "Paso06","Paso07", "Paso08","Paso09", "Paso10","Paso11", "Paso12"]);

  /* ConnBd.ejecutarSqlPromise(conn, ssql, paramsSql)
    .then(results => {
      ConnBd.getCabecera(conn, results)
        .then(data => {
          arrayHeader = data;
          Array.prototype.push.apply(arrayHeader, arrayHeaderTmp);
          //console.log(arrayHeader);
        })
        .then(() => {
          ConnBd.getAllRows(conn, results, numRows)
            .then(data => {
              arrayData = data.arrayData;
              iRowsAffec = data.iRowsAffec;
              console.log(data.iRowsAffec);
              //  rows2json("mensajes.json", arrayData);
            })
            .then(() => {
               console.log("fin");
              console.log(configExcel);
              ExcelFile.crearLibro("stream", configExcel.name_wb);
              ExcelFile.crearHoja(configExcel.name_ws);
              ExcelFile.getHoja(configExcel.name_ws);
              ExcelFile.setCabecera(arrayHeader);

              let i = 0;
              arrayData.forEach(element => {
                element.forEach(e => {
                  ExcelFile.dataControl(e, i, iRowsAffec);
                  i++;
                  if (i == iRowsAffec) {
                    reloj.timeStop();
                  }
                });
              });
            });
        });

    })
    .catch(e => {
      console.log(e);
    });*/
};

//conectar(tdcs);

ConnBd.open(tdcs);
