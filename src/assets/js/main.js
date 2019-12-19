function set_active_block() {
  $(".one_step_block").hide();
  var active_div = $("div.f1-step.active").attr("id");
  $("fieldset[data-block_id='" + active_div + "']").show();
}

function go_to_previous(previous_block) {
  $("div.f1-step.active").removeClass("active");
  $("#" + previous_block).addClass("active");
  set_active_block();
}

function go_to_next(next_block) {
  $("div.f1-step.active").removeClass("active");
  $("#" + next_block).addClass("active");
  set_active_block();
}

function calculate_progress(progress_block) {
  var block_num = $("#" + progress_block).data("step");
  var new_width = ($("#" + progress_block).offset().left) - ($("div.f1-progress").offset().left) + 170;
  console.log($("#" + progress_block).offset().left);
  $("div.f1-progress-line").attr("style", "width: " + new_width + "px")
}

(function($) {
  "use strict"; // Start of use strict

  // Toggle the side navigation
  $(document).on("click","#sidebarToggle", function(e) {
    e.preventDefault();
    $("body").toggleClass("sidebar-toggled");
    $(".sidebar").toggleClass("toggled");
  });

  // Prevent the content wrapper from scrolling when the fixed side navigation hovered over
  $(document).on('mousewheel DOMMouseScroll wheel', 'body.fixed-nav .sidebar', function(e) {
    if ($window.width() > 768) {
      var e0 = e.originalEvent,
        delta = e0.wheelDelta || -e0.detail;
      this.scrollTop += (delta < 0 ? 1 : -1) * 30;
      e.preventDefault();
    }
  });

  // Scroll to top button appear
  $(document).scroll(function() {
    var scrollDistance = $(this).scrollTop();
    if (scrollDistance > 100) {
      $('.scroll-to-top').fadeIn();
    } else {
      $('.scroll-to-top').fadeOut();
    }
  });

  $(document).ready(function(){
    $("a.scroll-to-top").click(function(){
      $("body").scrollTop(0);
    });
  });


  $(document).on('click', 'a.drpdown_menu', function (event) {
    var cobj = $(this);
    var target_id = cobj.attr('id');
    var target_obj = $("div[data-target='" + target_id + "']");
    var visible_status = target_obj.attr('data-status');
    if (visible_status == "0"){
      cobj.find(".inner_menu_icon").removeClass("fa-angle-right").addClass('fa-angle-down');
      target_obj.attr("data-status", "1");
    } else if (visible_status == "1") {
      cobj.find(".inner_menu_icon").removeClass("fa-angle-down").addClass('fa-angle-right');
      target_obj.attr("data-status", "0");
    }
    target_obj.slideToggle();
  });

  $(document).on("click", ".gototop",function () {
    $("html, body").animate({ scrollTop: 0 }, "slow");
    return false;
  });

  $(document).on("click", ".row_select, .row_select td",  function(){
    var input_id = $(this).parents("tbody.lookup_table_body").attr("name");
    $("#"+input_id).trigger("keyup");
  

  });
  
  

  $('html').click(function () {
    $(document).find('.custom_menu_click_option').hide();
  })

  $(document).on("click", '.li_with_dd', function (e) {
    e.stopPropagation();
  });

  $(document).on("click", '.custom_menu_click', function (e) {
    $(document).find('.custom_menu_click_option').toggle();
  });



  // wizard JS 

  $(document).on("click", ".btn-previous", function () {
    var p_obj = $(this);
    var previous_block = p_obj.data("previous-block");
    calculate_progress(previous_block);
    go_to_previous(previous_block);

  });

  $(document).on("click", ".btn-next", function () {
    var n_obj = $(this);
    
    var next_block = n_obj.data("next-block");
    calculate_progress(next_block);
    go_to_next(next_block);
  });


 $(document).on('click', '.custom_panel_parent_section', function (e) {
    var obj = $(this);
    var parent = obj.parents(".custom_panel_box");
    if(parent.find(".custom_panel_child_section").hasClass("collapse")){
      parent.find('.custom_panel_icon_section i').addClass("fa-minus").removeClass('fa-plus');
      parent.find(".custom_panel_child_section").removeClass("collapse");
    } else {
      parent.find('.custom_panel_icon_section i').addClass('fa-plus').removeClass("fa-minus");
      parent.find(".custom_panel_child_section").addClass("collapse");
    }
 });


  $(document).on("click", "#showAccordion" , function(e){
    $(".fa-compress").removeClass("ecselect");
    $(".fa-expand").addClass("ecselect");
    $(".opti_optiLeftTopAccordion .panel-default .panel-collapse").removeClass('collapse');
    $('.custom_panel_icon_section_feature i').addClass("fa-minus").removeClass('fa-plus');
  });

  $(document).on("click", "#hideAccordion" , function(e){
    $(".fa-compress").addClass("ecselect");
    $(".fa-expand").removeClass("ecselect");
    $(".opti_optiLeftTopAccordion .panel-default .panel-collapse").addClass('collapse');
    $('.custom_panel_icon_section_feature i').removeClass("fa-minus").addClass('fa-plus');
  });


  $(document).on("click", "#showAccordionAcc", function (e) {
    $(".compress_accessory").removeClass("ecselect");
    $(".expand_accessory").addClass("ecselect");
    $(".AccessoryAccordion .panel-default .panel-collapse").removeClass('collapse');
    $('.custom_panel_icon_section_acc i').addClass("fa-minus").removeClass('fa-plus');
  });

  $(document).on("click", "#hideAccordionAcc", function (e) {
    $(".compress_accessory").addClass("ecselect");
    $(".expand_accessory").removeClass("ecselect");
    $(".AccessoryAccordion .panel-default .panel-collapse").addClass('collapse');
    $('.custom_panel_icon_section_acc i').removeClass("fa-minus").addClass('fa-plus');
  });

  $(document).on('click', '#main_operation_type', function (e) {
    var obj = $(this);
    console.log("main = " + obj.val());
    console.log('lenth ' + $(document).find(".output_final_screen_save_button").length);
    
    if (obj.val() == "4" || obj.val() == 4){
      $(document).find(".output_final_screen_save_button").addClass('display_none');
    } else {
      $(document).find(".output_final_screen_save_button").removeClass('display_none');
    }
  });  

})(jQuery); // End of use strict
