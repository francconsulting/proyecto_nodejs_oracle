"use strict";

var oracledb = require("oracledb"),
  dbConfig = require("./dbconfig.js"),
  ConnBd = () => {};

oracledb.outFormat = oracledb.ARRAY;
oracledb.poolMax = 4;
oracledb.poolPingInterval = 60;
oracledb.fetchArraySize = 100;

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

ConnBd.closeRs = (conn, results) => {
  results.resultSet.close(err => {
    if (err) {
      console.log("Error al cerrar el recordSet");
    }
    console.log("recordset Cerrado");
  });
};

module.exports = ConnBd;
