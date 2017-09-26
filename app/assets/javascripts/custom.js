$(window).load(function() {
  $('.preloader').fadeOut('slow');
});

$(document).ready(function() {
  $('.mainMenuIcn').click(function(e) {
    $('body').toggleClass('closeMenu');
  });

  (function($) {
    $(window).on('load', function() {
      $('.content').mCustomScrollbar();
    });
  })(jQuery);
});
