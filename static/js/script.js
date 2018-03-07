"use strict";

$(document).ready(function() {
    console.log("start")




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
           

           
        }, "json");
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