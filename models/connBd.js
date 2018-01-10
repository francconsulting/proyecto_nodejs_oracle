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
"use strict";

var oracledb = require("oracledb"),
  dbConfig = require("./dbconfig.js"),
  //numRows = 100,
  //iRowsAffec = 0,
  //arrayData = [],
  //arrayHeader = [],
  ConnBd = () => {};

oracledb.outFormat = oracledb.ARRAY;
oracledb.poolMax = 4;
oracledb.poolPingInterval = 60;
oracledb.fetchArraySize = 100;

ConnBd.setDatos = filas => {
  arrayData.push(filas);
};

ConnBd.setRows = filas => {
  numRows = filas;
};

/**
 * Apertura de la conexion a la BD.
 * Devuelve la conexion
 * @param {function} cb callback que se ejecuta justo despues de conectar
 */

ConnBd.open = cb => {
  return oracledb.getConnection(
    {
      user: dbConfig.user,
      password: dbConfig.password,
      connectString: dbConfig.connectString,
      stmtCacheSize: 2000
    },
    cb
  );
};

/**
 * Cerrar la conxion a la BD
 * @param {Object} conn
 */
ConnBd.close = conn => {
  setTimeout(() => {
    conn.close(err => {
      if (err) {
        console.log("Error al cerrar la Conexionn");
      }
      console.log("conexion Cerrada");
    });
  }, 1000); //retrasar el cierre de la conexion 1seg
};


module.exports = ConnBd;
