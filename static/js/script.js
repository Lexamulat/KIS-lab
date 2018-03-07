"use strict";

$(document).ready(function() {
    
    console.log("start")
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


        // document.getElementById("CATADD").onclick = function(e){
        //     document.getElementById("name_cat").value = "";
        //     document.getElementById("url_cat").value = "";
        //   }



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

    // //alert("failed");
    // $("#snak").snackbar("toggle");
    // $("#snak").snackbar("toggle");

    // $("#snak").snackbar("toggle");

    });
   
});










// // INSERT
// let InsertOK = $('#CaInsert .ok')

// $(InsertOK).click(function() {
//     let out = {
//         name_cat: $("#modalInsert_name").val(),
//         url_cat: $("#modalInsert_url").val()
//     }

//     $.post("insert", JSON.stringify(out), function(data, textStatus) {
//         if (data == 0) {
//             Materialize.toast(`Ошибка добавления`, 2000)
//         } else {
//             Materialize.toast(`Добавлено: ${data}`, 4000)
//         }

//         updateList()
//     }, "json");
// });