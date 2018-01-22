"use strict";

var Reloj = () => {},
  contador = "",
  dtIni = "",
  dtFin = "",
  dtDiff = null,
  mensaje = null;

Reloj.dateTime = () => {
  var fechaHora = new Date();
  var hora = fechaHora.getHours();
  var minutos = fechaHora.getMinutes();
  var segundos = fechaHora.getSeconds();
  if (hora < 10) {
    hora = "0" + hora;
  }
  if (minutos < 10) {
    minutos = "0" + minutos;
  }
  if (segundos < 10) {
    segundos = "0" + segundos;
  }
  //return `"hora":${hora}, "min":${minutos}, "seg" :${segundos}`
  return `${hora}:${minutos}:${segundos}`;
};

Reloj.timeStart = () => {
  Reloj.timeCounter();
  dtIni = Reloj.dateTime();
  Reloj.getMensaje();
  //console.log(dtIni)
};

Reloj.timeStop = () => {
  clearInterval(contador);
  let diferencia = Reloj.crono(dtIni, dtFin);
  if (!diferencia) diferencia = "0 seg";
  console.log(
    "Procesos iniciado a las ",
    dtIni,
    " - Tiempo transcurrido: ",
    diferencia
  );
  console.log("contador parado");
};

Reloj.timeCounter = () => {
  dtDiff = 0;
  contador = setInterval(() => {
    dtFin = Reloj.dateTime();
    dtDiff = Reloj.crono(dtIni, dtFin);
    console.log(
      "Procesos iniciado a las ",
      dtIni,
      " - Tiempo transcurrido: ",
      dtDiff
    );
  }, 1000);
};

Reloj.getTime = () => {
  console.log(dtDiff);
};

Reloj.setMensaje = msg => {
  mensaje = msg;
};

Reloj.getMensaje = () => {
  //return mensaje
  Reloj.printMensaje();
};

Reloj.printMensaje = () => {
  console.log(mensaje);
};

Reloj.crono = (dtIni, dtFin) => {
  var hora1 = dtFin.split(":"),
    hora2 = dtIni.split(":"),
    t1 = new Date(),
    t2 = new Date();

  t1.setHours(hora1[0], hora1[1], hora1[2]);
  t2.setHours(hora2[0], hora2[1], hora2[2]);

  //document.body.innerHTML = "Hora A: " + (t1.getHours() < 10 ? "0" + t1.getHours() : t1.getHours()) + ":" + (t1.getMinutes() < 10 ? "0" + t1.getMinutes() : t1.getMinutes()) + ":" + (t1.getSeconds() < 10 ? "0" + t1.getSeconds() : t1.getSeconds()) + "<br />";
  //document.body.innerHTML += "Hora B: " + (t2.getHours() < 10 ? "0" + t2.getHours() : t2.getHours()) + ":" + (t2.getMinutes() < 10 ? "0" + t2.getMinutes() : t2.getMinutes()) + ":" + (t2.getSeconds() < 10 ? "0" + t2.getSeconds() : t2.getSeconds()) + "<br />";

  t1.setHours(
    t1.getHours() - t2.getHours(),
    t1.getMinutes() - t2.getMinutes(),
    t1.getSeconds() - t2.getSeconds()
  );

  //document.body.innerHTML += "La diferencia es de: " + (t1.getHours() ? t1.getHours() + (t1.getHours() > 1 ? " horas" : " hora") : "") + (t1.getMinutes() ? ", " + t1.getMinutes() + " minutos" : "") + (t1.getSeconds() ? (t1.getHours() || t1.getMinutes() ? " y " : "") + t1.getSeconds() + " segundos" : "");

  return (
    (t1.getHours()
      ? t1.getHours() + (t1.getHours() > 1 ? " horas" : " hora")
      : "") +
    (t1.getMinutes() ? ", " + t1.getMinutes() + " min" : "") +
    (t1.getSeconds()
      ? (t1.getHours() || t1.getMinutes() ? " y " : "") +
        t1.getSeconds() +
        " seg"
      : "")
  );
};

module.exports = Reloj;
