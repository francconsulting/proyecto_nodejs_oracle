document.title = "Holaaaaaa";

$("title").html("prueba de cambio de titulo");
$(document).ready(function() {
  $("input[type=button]").on("click", function(evt) {
    // evt.preventDefault();
    console.log(evt);
    callAjax("/tdc", function(result) {
      console.log(result);
    });
  });
  $("h1").text("pruebaaaa");
});