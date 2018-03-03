"use strict";

document.addEventListener('DOMContentLoaded', function() {
    //initialize all modals           
    $('.modal').modal();

    // INSERT
    let InsertOK = $('#modalInsert .ok')

    $(InsertOK).click(function() {
        let name = $("#modalInsert_name").val()
        let url = $("#modalInsert_name").val()
        Materialize.toast(`Insert "${name}"`, 4000)
        addLog(`Добавленоа 1 запись.`)
    });


    // Search
    let Search = $('#search')

    $(Search).on('input', function() {
        Materialize.toast(`Search "${Search.val()}"`, 1000)
        addLog(`Найдено 2 записи.`)
    });

}, false);

function edit(id, name_old, url_old) {
    let md = $('#modalEdit')
    let ok = $('#modalEdit .ok')
    let name = $('#modalEdit_name')
    let url = $('#modalEdit_url')

    name.val(name_old)
    url.val(url_old)
    Materialize.updateTextFields();

    md.modal('open');
    ok.unbind("click");

    $(ok).click(function() {
        Materialize.toast(`Edit ${id}`, 4000)
        addLog(`Изменена 1 запись.`)
    });
}

function del(id) {
    let md = $('#modalDel')
    let ok = $('#modalDel .ok')

    md.modal('open');
    ok.unbind("click");


    $(ok).click(function() {
        Materialize.toast(`Delete ${id}`, 4000)
        addLog(`Удалена 1 запись.`)
    });
}

function addLog(str) {
    $('.l-log').append(`<li>${str}</li>`);
}