
  jQuery(document).ready(function($) {
     $(".refine__section-head").click(function(){
     $(this).parent().find('.refine__body').slideToggle("fast");
       $(this).toggleClass("open");
     })
  });
