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
  ConnBd = require("../dbcontroller/connBd"),
  fs = require("fs"),
  ExcelFile = require("../commonjs/excelFile"),
  reloj = require("../commonjs/reloj"),
  numRows = 300, //paquete de registros a recibir
  iRowsAffec = 0, //registros recuperados
  arrayHeader = [],
  arrayData = [],
  ssql,
  AppModel = () => {};

//ssql = "select * FROM GIGA_OWNER.t1soatr TDC where rownum <= 5 ";

AppModel.getTdcVivos = callback => {
  fs.readFile(
    "./querys/instruccion_sql.sql",
    { encoding: "utf-8" },
    (err, data) => {
      ssql = data;
    }
  );

  var paramsSql = { distri: "CZZ", rowlimit: 100000 }; //parametros para la consulta

  /*fs.readFile(
    "./querys/consulta TDC vivos.sql",
    { encoding: "utf-8" },
    (err, data) => {
      ssql = data;
    }
  );

  var paramsSql = null; //parametros para la consulta
*/
  var configExcel = {
    tipo: "stream",
    name_wb: "tdcs_vivos_node.xlsx",
    name_ws: "tdc"
  };

  ConnBd.open((err, conn) => {
    if (err) {
      console.log("Error en la conexion");
      return;
    }
    mensaje = "Conectado. Esperando a ejecutar la consulta.....";
    reloj.setMensaje(mensaje);
    //  reloj.timeStart();

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
                // console.log("fin");
                // console.log(configExcel);
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
                //return arrayData
                callback(arrayData);
              });
          });
      })
      .catch(e => {
        console.log(e);
      });
  });
};

module.exports = AppModel;
