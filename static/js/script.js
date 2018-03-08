"use strict";

const LAB = {
    toast: function(text) {
        $.snackbar({
            content: text,
            style: "toast",
            timeout: 2000
        })
    },
}

function labPost(url, postData) {
    return new Promise(resolve => {
        $.post(url, postData, function(data, textStatus) {
            resolve(data)
        }, "json");
    });
}

async function update() {
    const dataCat = await labPost("list")

    catUpdate(dataCat)
}

async function CATADD() {
    const dataCat = await labPost("list")

    let out = {
        name_cat: $("#name_cat").val(),
        url_cat: $("#url_cat").val()
    }

    document.getElementById("name_cat").value = "";
    document.getElementById("url_cat").value = "";

    let res = await labPost("insert", JSON.stringify(out))
    if (res) {
        LAB.toast("Успешно")
    } else {
        LAB.toast("Ошибка доабвления")
    }
}

async function CATADD() {
    const dataCat = await labPost("list")

    let out = {
        name_cat: $("#name_cat").val(),
        url_cat: $("#url_cat").val()
    }

    document.getElementById("name_cat").value = "";
    document.getElementById("url_cat").value = "";

    let res = await labPost("insert", JSON.stringify(out))
    if (res) {
        LAB.toast("Успешно")
    } else {
        LAB.toast("Ошибка доабвления")
    }

    update()
}

async function CATEDIT() {
    let out = {
        name_cat: $("#CatEditName").val(),
        url_cat: $("#CatEditUrl").val(),
        id_cat: $('#l-EditCategory').data("id")
    }

    let res = await labPost("edit", JSON.stringify(out))
    if (res) {
        LAB.toast("Успешно")
    } else {
        LAB.toast("Ошибка редактирвоания")
    }

    update()
}

function catUpdate(dataCat) {
    let list = $("#listCategory")
    list.empty()

    for (let i = 0; i < dataCat.length; i++) {
        const el = dataCat[i];

        let listEl = `
            <div class="list-group-item list-group-item-action l-cat-elem" data-cat_id=${el.id}>
                ${el.name}
                <button type="button" class="btn btn-danger btn-sm l-button_action CategoryDelete">
                    <svg><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-bin"></use></svg>
                </button>  
                <button type="button" class="btn btn-success btn-sm l-button_action CategoryEdit" data-toggle="modal" data-target="#l-EditCategory" data-modal_id=${el.id} data-modal_name=${el.name} data-modal_url=${el.url}>
                    <svg><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-pencil"></use></svg>
                </button>
            </div>`

        list.append(listEl)
    }

    list.children().first().addClass("active")


    // Category remove
    $('.CategoryDelete').click(async(e) => {
        let id = $(e.currentTarget).parent().data('cat_id')
        await labPost("del", id.toString())
        update()
    })


    $(".l-cat-elem").click((t) => {
        $(".l-cat-elem").removeClass('active')
        $(t.currentTarget).addClass("active")
    })
}


async function labStart() {
    await update()

    // Category modals
    $("#CATADD").click(CATADD)
    $("#CATEDIT").click(CATEDIT)

    // Category placeholder
    $('#l-EditCategory').on('show.bs.modal', function(event) {
        let button = $(event.relatedTarget)
        let EditingName = button.data('modal_name')
        let EditingUrl = button.data('modal_url')
        let EditingId = button.data('modal_id')

        $(this).find('#CatEditName').val(EditingName)
        $(this).find('#CatEditUrl').val(EditingUrl)
        $(this).data('id', EditingId)
    })

    // Category search
    $('#CatSearch').on('input', async function() {
        let text = $('#CatSearch').val()

        let res = await labPost("search", text)

        catUpdate(res)
        LAB.toast(`Найдено: ${res.length}`)
    });

    // Move active
    $(".l-cat-elem").click((t) => {
        $(".l-cat-elem").removeClass('active')
        $(t.currentTarget).addClass("active")
    })
}

$(document).ready(labStart)