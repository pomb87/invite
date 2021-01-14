var i = 0;
function expand() {
  if (i == 0) {
    document.getElementById("menu").style.transform = "scale(3)";
    $('.plus').removeClass('plus');
     //i=1;
  }
  /** else{   document.getElementById("menu").style.transform="scale(0)"; 
    $('.plus-clicked').addClass('plus').removeClass('plus-clicked');
     i=0;
   }*/
}


$(document).on("click", '[data-toggle="lightbox"]', function(event) {
  event.preventDefault();
  $(this).ekkoLightbox();
});

