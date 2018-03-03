"use strict";

document.addEventListener('DOMContentLoaded', function() {
    //initialize all modals           
    $('.modal').modal();

}, false);

function edit(id) {
    console.log(id)
}

function del(id) {
    let md = $('#modalDel')
    let ok = $('#modalDel .ok')

    md.modal('open');
    ok.unbind("click");

    $(ok).click(function() {
        Materialize.toast(`Delete ${id}`, 4000)
    });

}