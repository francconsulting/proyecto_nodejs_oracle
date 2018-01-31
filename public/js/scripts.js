$("title").html("prueba de cambio de titulo");
$(document).ready(function() {
  $("input[type=submit]").on("click", function(evt) {
    evt.preventDefault();
    // console.log(evt);
    $("#resultado").html("Iniciando la descarga....");
<<<<<<< HEAD
   
    $(document).ajaxSend(function(evt, jqxhr,opt){
      console.log(evt)
      $("#resultado").html('ajaxSend')
    })
    $(document).ajaxStart(function(evt, jqxhr,opt){
      console.log(evt)
      $("#resultado").html('ajaxStart')
    })
    
    callAjax("http://localhost:3000/tdcs", printTabla, null, "post", "html")
    .done(function(){$("#resultado").prepend('Desde otro DONE1')})
    .done(function(){ $("#resultado").append('Desde otro DONE2')})
=======
>>>>>>> 0879470b9a39c1a2e4ce28dfeb12d506ef53651c

    $(document).ajaxSend(function(evt, jqxhr, opt) {
      //console.log(evt);
      $("#resultado").html("ajaxSend");
    });
    $(document).ajaxStart(function(evt, jqxhr, opt) {
      //console.log(evt);
      $("#resultado").html("ajaxStart");
    });

    callAjax("http://localhost:3000/tdcs", printTabla, null, "post", "html")
      .done(function() {
        $("#resultado").prepend("Desde otro DONE");
      })
      .done(function() {
        $("#resultado").append("Desde otro DONE");
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

    /* var promise = doSomething(); 
    promise.progress(function(prog) { 
      console.log(prog);
      $("#resultado").prepend('Desde otro DONE: ',prog) 
    })*/
  });

  function printTabla(datos) {
    $("#resultado").html(datos);
  }
  $("h1").text("TDC Vivos");

  function doSomething() {
    var dfd = $.Deferred();
    var count = 0;
    var intervalId = setInterval(function() {
      // dfd.notify(count++);
      count > 5 && clearInterval(intervalId);
    }, 500);
    dfd.notify(
      callAjax("http://localhost:3000/tdcs", printTabla, null, "post", "html")
    );
    return dfd.promise();
  }
});
