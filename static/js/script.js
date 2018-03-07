"use strict";

$(document).ready(function() {
    console.log("start")


    console.log("12")

    $("#CATADD").on('click', function(p) {


        console.log(p)
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