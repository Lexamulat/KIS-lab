"use strict";


document.addEventListener('DOMContentLoaded', function() {
    $('.modal').modal();

    // Get all rows
    updateList()


    // INSERT
    let InsertOK = $('#modalInsert .ok')

    $(InsertOK).click(function() {
        let out = {
            name_cat: $("#modalInsert_name").val(),
            url_cat: $("#modalInsert_url").val()
        }

        $.post("insert", JSON.stringify(out), function(data, textStatus) {
            if (data == 0) {
                Materialize.toast(`Ошибка добавления`, 2000)
            } else {
                Materialize.toast(`Добавлено: ${data}`, 4000)
            }

            updateList()
        }, "json");
    });


    // SEARCH
    let Search = $('#search')

    $(Search).on('input', function() {
        let t = Search.val()

        $.post("search", t.toString(), function(data, textStatus) {
            updateListFromData(data)
            Materialize.toast(`Найдено: ${data.length}`, 2000)
        }, "json");

    });


    // SORT
    $("#l-list_sort-click").click(function() {
        updateList()
    });

    // CREATE
    $("#l-create").click(function() {
        $.post("table", "create", function(data, textStatus) {
            Materialize.toast(`Create: ${data}`, 3000)
        }, "json");
    });
    // DROP
    $("#l-drop").click(function() {
        $.post("table", "drop", function(data, textStatus) {
            Materialize.toast(`Drop: ${data}`, 3000)
        }, "json");
    });

    // RESTORE
    $("#l-restoreDel").click(function() {
        $.post("restore", function(data, textStatus) {
            updateList()
            Materialize.toast(`Востановлена запись`, 3000)
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
        let out = {
            id_cat: id,
            name_cat: name.val(),
            url_cat: url.val()
        }

        $.post("edit", JSON.stringify(out), function(data, textStatus) {
            updateList()
            if (data == 0) {
                Materialize.toast(`Ошибка добавления`, 2000)
            } else {
                Materialize.toast(`Отредактированно: ${data}`, 4000)
            }
        }, "text");
    });
}

function del(id) {
    let md = $('#modalDel')
    let ok = $('#modalDel .ok')

    md.modal('open');
    ok.unbind("click");


    $(ok).click(function() {
        $.post("del", id.toString(), function(data, textStatus) {

            updateList()

            Materialize.toast(`Удалено: ${data}`, 2000)
        }, "text");
    });
}


function updateList() {
    let switchVal = $('#l-list_sort').is(':checked')
    let sortText = switchVal ? "DESC" : "ASC"


    $.post("list", sortText, function(data, textStatus) {
        updateListFromData(data)
    }, "json");
}

function updateListFromData(data) {
    let list = $("#l-table_list")
    list.empty()

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