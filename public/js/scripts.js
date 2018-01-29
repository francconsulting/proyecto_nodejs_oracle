document.title = "Holaaaaaa";

$("title").html("prueba de cambio de titulo");
$(document).ready(function() {
  $("input[type=submit]").on("click", function(evt) {
    // evt.preventDefault();
    console.log(evt);
    /* callAjax("http://localhost:3000/tdc", function(result) {
      console.log(result);
    });*/
  });
  $("h1").text("pruebaaaa");
});
