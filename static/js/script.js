"use strict";

$(document).ready(function() {
   
    console.log("start")
    updateList()
    console.log("end")
    var options =  {
        content: "added23", // text of the snackbar
        style: "toast", // add a custom class to your snackbar
        timeout: 2000 // time in milliseconds after the snackbar autohides, 0 is disabled
    }
    
    
    // $.snackbar(options);


    $("#CATADD").on('click', function() {
    // var namecat=$("#namecat").val();
    // var urlcat=$("#urlcat").val();

        let out = {
            name_cat: $("#name_cat").val(),
            url_cat: $("#url_cat").val()
        }
        document.getElementById("name_cat").value = "";
        document.getElementById("url_cat").value = "";


        $.post("insert", JSON.stringify(out), function(data, textStatus) {

            if((data)==0){
                
                alert("failed");

                // $("#snak").snackbar("show");

                }else{
                    console.log(options)
                    $.snackbar(options)
                 //alert("succsess") 
                //  $("#snak").snackbar("show");
                 
                }

           
        }, "json");
    });


    $("#two").on('click', function() {

        $.snackbar(options)

    });





    function updateList() {
        
        $.post("list",function(data, textStatus) {
            let list = $("#listCategory")
              list.empty()
              
   var ActiveFlag=true;
    $.each(data, function(key, val) {
        console.log(val)
        if(ActiveFlag==true){
          var  flg="active";
        }else{
          var  flg=""
        }
        let el = `
        <div class="list-group-item list-group-item-action ${flg}">${val.name}
        </div>
        `
            list.append(el)
            ActiveFlag=false
            });

        }, "json");
    }


    
});

