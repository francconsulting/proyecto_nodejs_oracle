$("title").html("prueba de cambio de titulo");

$(document).ready(function() {
  var t; //= crearTabla();

  $("input[type=submit]").on("click", function(evt) {
    //t =  crearTabla();

    evt.preventDefault();

    // console.log(evt);
    $("#btnEnviar").attr("disabled", true);
    $("#resultado").html("Iniciando la descarga....");

    $(document).ajaxSend(function(evt, jqxhr, opt) {
      //console.log(evt);
      // $("#resultado").html("ajaxSend");
    });
    $(document).ajaxStart(function(evt, jqxhr, opt) {
      //console.log(evt);
      // $("#error").html("Iniciando...");
      // $("#resultado").html("ajaxStart");
    });

    /*var intervalId = setInterval(function() {
      callAjax(
        "http://localhost:3001/prueba",
        function(data) {
          //console.log("-----", data);
          data = JSON.parse(data);
          //callAjax("http://localhost:3001/tdcs")
          if (data.registros == "undefined") {
            data.registros = 0;
          }

          $("#error").html(
            "Recibidos hasta ahora.... " + data.registros + " registros."
          );
          $("#resultado").html(data.datos);
        },
        null,
        "POST",
        "HTML"
      );
    }, 500);*/

    //t =  dataPrueba()
    //dataPrueba();
    callAjax("http://localhost:3001/tdcs");
    /*   callAjax("http://localhost:3001/tdcs", printTabla, null, "post", "html")
      .done(function() {
        //$("#resultado").prepend("Preparando resultados");
        $("#btnEnviar").attr("disabled", false);
      })
      .done(function() {
        // clearInterval(intervalId);
        //$("#resultado").append("Desde otro DONE");
      })
      .fail(function(jqXHR, textStatus, errorThrown) {
        $("#error")
          .addClass("error")
          .text(
            "Se ha producido un error:" +
              jqXHR.status +
              " " +
              jqXHR.statusText +
              " -ESTATUS: " +
              textStatus +
              "- ERRORTHROWN: " +
              errorThrown
          ); //si hay algun error en la llamada muestra un mensaje
        if (jqXHR.status === 0) {
          alert("Not connect: Verify Network.");
        } else if (jqXHR.status == 404) {
          alert("Requested page not found [404]");
        } else if (jqXHR.status == 500) {
          alert("Internal Server Error [500].");
        } else if (textStatus === "parsererror") {
          alert("Requested JSON parse failed.");
        } else if (textStatus === "timeout") {
          alert("Time out error.");
        } else if (textStatus === "abort") {
          alert("Ajax request aborted.");
        } else {
          alert("Uncaught Error: " + jqXHR.responseText);
        }
      });
*/
    /* var promise = doSomething();
    promise.progress(function(prog) {
      console.log(prog);
      $("#resultado").prepend("Desde otro>>>>> DONE>>: ", prog);
    });*/
  });

  function printTabla(datos) {
    $("#resultado").html("ksksksksks");
  }

  $("h1").text("TDC Vivos");

  /*var socket = io.connect("http://localhost:3001");
  socket.on("emit2", function(data) {
    console.log(data);
    socket.emit("message", "hello from the browser");
  });*/

  var arrDatos = [];
  (function(io) {
    "use strict";
    var io = io();
    io.on("mensaje_inicial", function(data) {
      console.log(data);
      $("#info").html(data.message);

      // document.getElementById("hello").innerHTML = data.message;
      io.emit("mi_event_desde_cliente", { nombre: "fm", apellidos: "bv" });
    });
    io.on("rowsRecibidos", function(data) {
      $("#info").html(data.message);
    });

    io.on("filasAfectadas", function(data) {
      console.log(data.datos);
      console.log(data.datos);
      console.log(data.totalRows);
      // mostrarDatos(data.datos);
      // dataSet(data);

      // $("#resultado").html(data.datos);
      $("#error").html(data.message);
    });
    io.on("emit1", function(data) {
      console.log(data.message);
      $("#error").html(data.message);
    });
    io.on("dataset", function(data) {
      dataSet(data);
      //    console.log(data)
      arrDatos = data;
      $("#btnEnviar").attr("disabled", false);
    });
  })(io); //io del parametro => lo lee de dentro de /socket.io/socket.io.js

  function dataSet(datos) {
    //console.log(JSON.stringify(datos.datos[0]))

    var aDatos = [],
      cabecera = [];

    datos.datos.forEach(function(element) {
      // console.log(element)
      element.forEach(function(e) {
        aDatos.push(e);
      });
    });
    console.log(JSON.stringify(datos.cabecera));

    datos.cabecera.forEach(function(element) {
      cabecera.push({ title: element.header });
    });
    console.log(JSON.stringify(cabecera));
    //console.log(misDatos.length)
    crearTabla(JSON.stringify(cabecera), aDatos); //Descomentar
  }

  function crearTabla(cabecera, dataset) {
    var t = $("#tabla").DataTable({
      language: {
        url: "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
      },
      processing: true,
      serverSide: true,
      sLoadingRecords: "Please wait - loading...",
      deferLoading: 500,
      iDisplayLength: 10,
      aLengthMenu: [[10, 25, -1], [10, 25, "Todos"]],
      data: dataset,
      destroy: true,
      columns: [
        { title: "c1" },
        { title: "c2" },
        { title: "c3" },
        { title: "c4" }
      ]
      //columns: cabecera
    });
    t.on("draw.dt", function(data) {
      console.log();
      //  $("#error").append( '  -> Redraw took at: '+(new Date().getTime()-startTime)+'mS' );
      $("#btnEnviar").attr("disabled", false);
    });
    /* t.on('page.dt', function(){
        console.log(t.page.info())
        console.log(t.page.info().page +" de "+t.page.info().pages)
        console.log(tcrearTabla();.data().length +'  '+t.page.info().length)
        //t.page()
        console.log(arrDatos)
      })x
*/
    return t;
  }

  function dataPrueba() {
    t = $("#tabla").DataTable({
      language: {
        url: "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
      },
      iDisplayLength: 10,
      LengthMenu: [[10, -1], [10, "Todos"]],
      processing: true,
      serverSide: true,
      deferRender: true,
      deferLoading: 50,
      sAjaxSource: "http://localhost:3001/tdcs",
      sServerMethod: "POST",
      bJQueryUI: true,
      bPaginate: true,
      bSort: false,
      destroy: true,
      columns: [
        { title: "c1" },
        { title: "c2" },
        { title: "c3" },
        { title: "c4" }
      ]
    });
    return t;

    t.on("preDraw", function(data) {
      startTime = new Date().getTime();
    });
    on(" page.dt", function() {
      console.log(t.page.len(2).draw());
    })
      .on("draw.dt", function(data) {
        console.log();
        $("#error").append(
          "  -> Redraw took at: " + (new Date().getTime() - startTime) + "mS"
        );
        $("#btnEnviar").attr("disabled", false);
      })
      .on("preInit.dt", function() {
        $("#error").append(" Iniciandoooooooooooo");
      });
  }

  function dataArray() {
    console.log(arrDatos);
  }

  function mostrarDatos(data) {
    t.rows().remove();
    var i = 1,
      parar = false;
    // $("#resultado").html("");
    //  console.log(data)
    console.log(parar);
    data.forEach(element => {
      // console.log(element)
      //  t.rows.add(element)
      element.forEach(e => {
        //  console.log(e)
        //$("#resultado").append(i +  "-. " + e+"<br/>")
        // console.log(i)
        if (i < 50) {
          t.row.add([i, e[0], e[1], e[2], e[3], e[4], e[5]]).draw(true);
        }
        i++;
      });

      console.log("----", i);
    });
  }
});
