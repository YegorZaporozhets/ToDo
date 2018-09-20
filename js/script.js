$(document).ready(function(){
//Add elements to massive Func--------------------------------------------------
let toDoArr = [];  //Displays massive
let ckArr = []; //Massive of checked items
let allArr = []; //Massive of All items
let unckArr = []; //Massive of unchecked items
let counter = 0;
let allPages = 0;
let currentPage = 1;
let mode = 0; //default mode 0 - All items, mode 1 - only Complete items, mode 2 - only Active items
function checkStatusCk(){
  ckArr = allArr.slice();
  for (i=0; i < ckArr.length; i++) {
    if (ckArr[i].status == false){
      ckArr.splice(i,1);
    i--;
  }
  }
  if (ckArr.length < allArr.length && allArr.length > 0) {
    $('#markelements').html('<input type="checkbox" id="checkAll"><span id="spanid">Mark All as Complete</span>')
  }
  else if (ckArr.length == allArr.length && allArr.length != 0 ) {
    $('#markelements').html('<input type="checkbox" checked id="checkAll"><span id="spanid">Mark All as Active</span>')
  };
};
$('#button').click(function(){
  let now = allArr.length;
  $('#markelements').html('<input type="checkbox" id="checkAll"><span id="spanid">Mark All as Complete</span>')
  if ($('input[name=entery]').val().trim('').length > 0){   //Validation
    allArr.unshift({
      id : counter,
      valueOf : $('input[name=entery]').val().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"),
      status : false
    });

    toDoArr.unshift({
      id : counter,
      valueOf : $('input[name=entery]').val().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"),
      status : false
    });
    counter++;
    $('input[name=entery]').val("");
  }
  else {
    $('input[name=entery]').val("");
  }
  if (now < allArr.length && (mode == 1 || mode == 0)) {
    currentPage = 1;
  }
  checkStatusCk();
});
//Add by ENTER------------------------------------------------------------------
$(document).keydown(function(event){
  if(event.keyCode == 13){
          $('input[name=edit]').focusout();
          $('#button').trigger('click');
    }
  });
// double click editing---------------------------------------------------------
  $(document).on('dblclick', 'li', function(){
    let checked;
    let pastV = toDoArr[toDoArr.findIndex(el => el.id == $(this).attr('id'))].valueOf
    if (toDoArr[toDoArr.findIndex(el => el.id == $(this).attr('id'))].status) {
      checked = 'checked';
    }
    else {
      checked = '';
    };
    $(this).html(
      `<input class="checkEl" type="checkbox" `+ checked +`></input><input type="text" name="edit"  value="`+
      pastV +`"  class="inputtodo"></input><input class="closeBut  btn btn-danger" type="button" value="&#10006"></input>`
    ).find('input[type=text]').focus();


    $('input[name=edit]').on('focusout',function(){
      if ($('input[name=edit]').val().trim('').length > 0){
      toDoArr[toDoArr.findIndex(el => el.id == $(this).parent().attr('id'))].valueOf = $('input[name=edit]').val().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      allArr[allArr.findIndex(el => el.id == $(this).parent().attr('id'))].valueOf = $('input[name=edit]').val().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      }
      else  {
        toDoArr[toDoArr.findIndex(el => el.id == $(this).parent().attr('id'))].valueOf = pastV;
        allArr[allArr.findIndex(el => el.id == $(this).parent().attr('id'))].valueOf = pastV;
      }
      $('head').trigger('click');
    });
  });
//Delete item-------------------------------------------------------------------
  $(document).on('click', '.closeBut', function(){
   let getId = toDoArr.findIndex(el => el.id == $(this).parent().attr('id'));

   toDoArr.splice(getId,1);  //Delete from displays massive

   getId = allArr.findIndex(el => el.id == $(this).parent().attr('id')); //Delete from massive of all items

   allArr.splice(getId,1);


   if (currentPage > Math.ceil(toDoArr.length/5) && currentPage!= 1) {
     currentPage--;
   }
   checkStatusCk();
  });

  //Delete Checked
  $("#deleteChecked").on('click',function(){
    for (i = 0; i < allArr.length; i++) {
      if (allArr[i].status == true){
        allArr.splice(i,1);
        i--;
      };
    };
    for (i = 0; i < toDoArr.length; i++){
      if (toDoArr[i].status == true){
        toDoArr.splice(i,1);
        i--;
      }
    }
    if (currentPage > Math.ceil(toDoArr.length/5) && currentPage!= 1) {
      currentPage--;
    }

  });
  //Check all/uncheck
  $(document).on('click','#checkAll',function(){
    for (i=0; i < allArr.length; i++){
      allArr[i].status = $('#checkAll').prop("checked");
    }
    for (i=0; i < toDoArr.length; i++){
      toDoArr[i].status = $('#checkAll').prop("checked");

    }
    if ($('#checkAll').prop("checked")) {
      $('#spanid').html('Mark All as Active');
    }
    else {
      $('#spanid').html('Mark All as Complete');
    }
  });


  // Check item
  $(document).on('click','.checkEl', function(){
    toDoArr[toDoArr.findIndex(el => el.id == $(this).parent().attr('id'))].status = $(this).prop('checked'); // Check in displays massive
    allArr[allArr.findIndex(el => el.id == $(this).parent().attr('id'))].status = $(this).prop('checked');  //Check in massive of All
    checkStatusCk();
  });
  // Show only checked/unchecked
  $(document).on('click',"#ckItems",function(){
    mode = 2;
    currentPage = 1;
    $("#allItems").removeClass("currentmode");
    $("#ckItems").addClass("currentmode");
    $("#unItems").removeClass("currentmode");
  });
  $(document).on('click',"#unItems",function(){
    mode = 1;
    currentPage = 1;
    $("#allItems").removeClass("currentmode");
    $("#ckItems").removeClass("currentmode");
    $("#unItems").addClass("currentmode");
  });
  $(document).on('click',"#allItems", function(){
    mode = 0;
    currentPage = 1;
    $("#allItems").addClass("currentmode");
    $("#ckItems").removeClass("currentmode");
    $("#unItems").removeClass("currentmode");
  });

// Display paginated list: currentPage ?----------------------------------------

  $(document).on('click','#button, #nextPage, #prevPage, #currentLeft, #currentRight, .closeBut, .checkEl, #ckItems, #unItems, #allItems, input[name=checkAll], #deleteChecked, head, #lastPage, #checkAll, #startPage', function(){
    if (mode == 0) {
      toDoArr = [];
      toDoArr = allArr.slice();
      $('#modeshow').html("All list:")
    }
    else if (mode == 1) {   //unItems only
      unckArr = allArr.slice(); // massive of "status:false"
      for (i=0; i < unckArr.length; i++) {
        if (unckArr[i].status == true){
          unckArr.splice(i,1);
          i--;
        }
        toDoArr = [];
        toDoArr = unckArr.slice();
      }
      $('#modeshow').html("Active list:")
    }
    else if (mode == 2) {
      ckArr = allArr.slice(); // massive of "status:true"
      for (i=0; i < ckArr.length; i++) {
        if (ckArr[i].status == false){
          ckArr.splice(i,1);
          i--;
        }
        toDoArr = [];
        toDoArr = ckArr.slice();
      }
      $('#modeshow').html("Complete list:")
    };

    allPages = Math.ceil(toDoArr.length/5);
    let checked;
    let contentV ='';
    if (toDoArr.length <= 5) {
      for (i=0;i < toDoArr.length;i++) {
        if (toDoArr[i].status) {
          checked = 'checked';
        }
        else {
          checked = '';
        }
        contentV = contentV + `<li id=`+ toDoArr[i].id + ` class="list-group-item `+ checked +`"><input class="checkEl"  type="checkbox" `+
        checked +`></input>` + toDoArr[i].valueOf + `<input class="closeBut btn btn-danger" type="button" value="&#10006"></input></li>`;

      }
    }
    else if (toDoArr.length > 5 && currentPage != allPages) {
    for (i = currentPage * 5 - 5; i < currentPage*5; i++) {
      if (toDoArr[i].status) {
        checked = 'checked';
      }
      else {
        checked = '';
      }

      contentV = contentV + `<li id=`+ toDoArr[i].id + ` class="list-group-item `+ checked +`"><input class="checkEl" type="checkbox" `+
      checked +`></input>` + toDoArr[i].valueOf + `<input class="closeBut btn btn-danger" type="button" value="&#10006"></input></li>`;

    }
  }
    else  if (currentPage == allPages) {
      for (i = currentPage * 5 - 5; i < toDoArr.length; i++) {
        if (toDoArr[i].status) {
          checked = 'checked';
        }
        else {
          checked = '';
        }
        contentV = contentV + `<li id=`+ toDoArr[i].id + ` class="list-group-item `+ checked +`"><input class="checkEl"type="checkbox" `+
        checked +`></input>` + toDoArr[i].valueOf + `<input class="closeBut btn btn-danger" type="button" value="&#10006"></input></li>`;


      }
    }
  $('#listgroup').html(contentV);  //Render
});


//Pagination nav-----------------------------------------------------------------
$('#nextPage').click(function(){
  if (currentPage < allPages) {
    currentPage++;
  }
});
$('#prevPage').click(function(){
  if (currentPage > 1) {
    currentPage--;
  }
});
$("#currentLeft").click(function(){
  currentPage = parseInt($("#currentLeft").val());
});
$("#currentRight").click(function(){
  currentPage = parseInt($("#currentRight").val());
});
$("#lastPage").click(function(){
  currentPage = Math.ceil(toDoArr.length/5);
});
$('#startPage').click(function(){
  currentPage = 1;
});
$(document).on("click", "#button, #nextPage, #prevPage, #currentLeft, #currentRight, .closeBut, .checkEl , #ckItems, #unItems, #allItems, input[name=checkAll], #deleteChecked, head, #lastPage , #checkAll, #startPage" ,function(){ //Update pag. nav
  $(".pegControl").children().hide();


    if (Math.ceil(toDoArr.length/5) == 1 && toDoArr.length >= 1) { //for 1 page
      $("#currentPageVis").val(currentPage);
      $("#currentPageVis").show();

    }
    else if (Math.ceil(toDoArr.length/5) > 1 && currentPage == 1) {  //for 1 page, if pages > 1
      $("#currentPageVis").val(currentPage);
      $("#currentPageVis").show();
      $("#nextPage").show();
      $("#currentRight").val(currentPage+1);
      $("#currentRight").show();
      $("#lastPage").show();

    }
    else if (Math.ceil(toDoArr.length/5) > 1 && currentPage != 1 && currentPage != Math.ceil(toDoArr.length/5)) { //for 1 < page < all pages
      $('#startPage').show();
      $("#currentPageVis").val(currentPage);
      $("#currentPageVis").show();
      $("#prevPage").show();
      $("#nextPage").show();
      $("#currentRight").val(currentPage+1);
      $("#currentRight").show();
      $("#currentLeft").val(currentPage-1);
      $("#currentLeft").show();
      $("#lastPage").show();
    }
    else if (currentPage == Math.ceil(toDoArr.length/5) && currentPage!= 1) { //for last page, if pages > 1
      $('#startPage').show();
      $("#currentPageVis").val(currentPage);
      $("#currentPageVis").show();
      $("#prevPage").show();
      $("#currentLeft").val(currentPage-1);
      $("#currentLeft").show();
    }


});
// Counter
$(document).on('click', function(){
  let allElements = allArr.length; //All items
  let ckElements = 0; //Complete items
  let unElements = 0; //Active items
  for (i = 0; i < allArr.length; i++){
    if (allArr[i].status) {
      ckElements++;
    }
    else {
       unElements++;
    }
  }
  $("#allItems").val(`All: ` + allElements );
  $("#ckItems").val(`Complete: ` + ckElements);
  $("#unItems").val(`Active: ` + unElements);
});
});
