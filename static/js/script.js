"use strict";


document.addEventListener('DOMContentLoaded', function() {
    $('.modal').modal();

    // Get all rows
    $.getJSON("list", function(data) {
        updateList(data)
    });
   

    // INSERT
    let InsertOK = $('#modalInsert .ok')

    $(InsertOK).click(function() {
        let name = $("#modalInsert_name").val()
        let url = $("#modalInsert_url").val()
        Materialize.toast(`Insert "${name}"`, 4000)
    });


    // Search
    let Search = $('#search')

    $(Search).on('input', function() {
        let t = Search.val()

        $.post("search", t, function(data, textStatus) {
            updateList(data)
            Materialize.toast(`Найдено: ${data.length}`, 2000)
        }, "json");

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
    });
}

function del(id) {
    let md = $('#modalDel')
    let ok = $('#modalDel .ok')

    md.modal('open');
    ok.unbind("click");


    $(ok).click(function() {       
        $.post("del", id.toString(), function(data, textStatus) {

            $.getJSON("list", function(data) {
                updateList(data)
            });

            Materialize.toast(`Удалено: ${data}`, 2000)
        }, "text");       
    });
}

function updateList(data) {
    let list = $("#l-table_list")

    $.each(data, function(key, val) {
        let el = `
        <tr>
            <td>${val.id}</td>
            <td>${val.name}</td>
            <td>${val.url}</td>
            <td>
                <i class="material-icons left l-table_edit" onclick="edit(${val.id}, '${val.name}', '${val.url}')">edit</i>
                <i class="material-icons right l-table_del" onclick="del(${val.id})">delete</i>
            </td>
        </tr>
        `

        list.append(el)
    });
}