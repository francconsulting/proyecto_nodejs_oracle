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
  reloj = require("./commonjs/reloj"),
  numRows = 300, //paquete de registros a recibir
  iRowsAffec = 0, //registros recuperados
  arrayHeader = [],
  arrayData = [],
  ssql,
  filepath = "./descargas/";

//ssql = "select * FROM GIGA_OWNER.t1soatr TDC where rownum <= 5 ";

fs.readFile("consulta TDC vivos.sql", { encoding: "utf-8" }, (err, data) => {
  ssql = data;
});
var paramsSql = null; //parametros para la consulta

/*fs.readFile("instruccion_sql.sql", { encoding: "utf-8" }, (err, data) => {
  ssql = data;
});

var paramsSql = { distri: "CZZ", numrows: 250 }; //parametros para la consulta
*/

var tdcs = (err, conn) => {
  
  let configExcel = {
    tipo: "stream",
    name_wb: "tdcs_vivos_node_" + reloj.getDate() + ".xlsx",
    name_ws: "tdc"
  };

  if (err) {
    console.log("Error en la conexion");
    return;
  }
  mensaje = "Conectado. Esperando a ejecutar la consulta TDCs_VIVOS.....";
  reloj.setMensaje(mensaje);
  reloj.timeStart();

  ConnBd.ejecutarSqlPromise(conn, ssql, paramsSql)
    .then(results => {
      ConnBd.getCabecera(conn, results)
        .then(data => {
          arrayHeader = data;
          //console.log(data);
        })
        .then(() => {
          ConnBd.getAllRows(conn, results, numRows)
            .then(data => {
              arrayData = data.arrayData;
              iRowsAffec = data.iRowsAffec;
              console.log(data.iRowsAffec);
            })
            .then(() => {
              console.log("fin");
              console.log(configExcel);
              ExcelFile.crearLibro("stream", filepath + configExcel.name_wb);
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
      /*ConnBd.getAllRows(conn, results, numRows).then(data => {
      console.log(data.length);
    });*/
    })
    .catch(e => {
      console.log(e);
    });
};

/**
 * Programar trabajo con npm cron
 * https://www.npmjs.com/package/cron
 *
 */
var CronJob = require("cron").CronJob;
var job1 = new CronJob({
  //"00 45 07 * * 1-5",  //se ejecuta de lunes
  cronTime: "00 45 07 * * 1-5", //se ejecuta de lunes
  onTick: function () {
    console.log("Ejecutado desde Cron");
    ConnBd.open(tdcs);
  },
  onComplete: function () {
    console.log(">>>>>>>>>>>>>>>>>>>>>>> Finalizacion del proceso TDCs_VIVOS");
  },
  start: true,
  timeZone: "Europe/Madrid"
});

job1.start();
console.log("job1 corriendo: ", job1.running);

//conectar(tdcs);

//ConnBd.open(tdcs);
