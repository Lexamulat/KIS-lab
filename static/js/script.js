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
        // console.log(postData)
        $.post(url, postData, function(data, textStatus) {
            resolve(data)
        }, "json");
    });
}

async function update() {
    const dataCat = await labPost("list")
    await catUpdate(dataCat)
    await Subupdate((dataCat[0].id).toString()) // (take id from first in category and select with this id to SubCat) 


    // Category remove
    $('.CategoryDelete').click(async(e) => {
        e.stopPropagation();

        console.log(e.currentTarget)
        let id = $(e.currentTarget).parent().data('cat_id')

        await labPost("del", id.toString())
        await update()
    })

    // change active status from Category on clic
    $(".l-cat-elem").click(async(t) => {
        $(".l-cat-elem").removeClass('active')
        $(t.currentTarget).addClass("active")

        await Subupdate(JSON.stringify($(t.currentTarget).data('cat_id'))) //(put id from chosen point from category to json for serv)
    })
}

async function Subupdate(cat_id) {
    const dataSubCat = await labPost("Sublist", cat_id)
    await SubcatUpdate(dataSubCat)

    $('.SubCategoryDelete').click(async(c) => {
        // c.stopPropagation();
        let id = $(c.currentTarget).data('id_subc')
            // await labPost("Subdel", JSON.stringify(id))
        let CurrentActiveCat = $('.list-group-item.active').data('cat_id');
        await Subupdate(CurrentActiveCat)
    })
    $(".l-Subcat-elem").click(async(t) => {
        $(".l-Subcat-elem").removeClass('active')
        $(t.currentTarget).addClass("active")

        // await Subupdate(JSON.stringify($(t.currentTarget).data('cat_id'))) //(put id from chosen point from category to json for serv)
    })
}


async function SUBCATADD() {
    var ig = $('.list-group-item.active').data('cat_id'); //find current active from cat for insert in subcat

    let out = {
        name_subc: $("#name_subc").val(),
        url_subc: $("#url_subc").val(),
        id_cat: ig
    }

    document.getElementById("name_subc").value = "";
    document.getElementById("url_subc").value = "";

    let res = await labPost("Subinsert", JSON.stringify(out))
    if (res) {
        LAB.toast("Успешно")
    } else {
        LAB.toast("Ошибка доабвления")
    }

    update()
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

// async function CATEDIT() {
//     let out = {
//         name_cat: $("#CatEditName").val(),
//         url_cat: $("#CatEditUrl").val(),
//         id_cat: $('#l-EditCategory').data("id")
//     }

//     let res = await labPost("edit", JSON.stringify(out))
//     if (res) {
//         LAB.toast("Успешно")
//     } else {
//         LAB.toast("Ошибка редактирвоания")
//     }

//     update()
// }

// filling in the SUBcategory table

function SubcatUpdate(dataSubCat) {
    console.log("SUBCATUPD")
    let list = $("#listSubCategory")
    list.empty()
    for (let i = 0; i < dataSubCat.length; i++) {
        const el = dataSubCat[i];

        let listEl = `
            <div class="list-group-item list-group-item-action l-Subcat-elem data-id_subc=${el.id_subc}">
                ${el.name_subc}
                <button type="button" class="btn btn-danger btn-sm l-button_action SubCategoryDelete" data-id_subc=${el.id_subc}>
                <svg><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-bin"></use></svg>
            </button>  
            <button type="button" class="btn btn-success btn-sm l-button_action SubCategoryEdit" data-toggle="modal" data-target="#l-EditSubCategory" data-modal_id_subc=${el.id_subc} data-modal_id_cat=${el.id_cat} data-modal_name_subc=${el.name_subc} data-modal_url_subc=${el.url_subc}>
                <svg><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-pencil"></use></svg>
            </button>
            </div>`

        list.append(listEl)
    }



    // $('.SubCategoryDelete').click(async(c) => {
    //      c.stopPropagation();
    //     let id = $(c.currentTarget).parent().data('id_subc')
    //     console.log(id)
    //         // await labPost("Subdel", JSON.stringify(id))
    //         // let CurrentActiveCat = $('.list-group-item.active').data('cat_id');

    //     // await Subupdate(JSON.stringify(CurrentActiveCat))
    //     //await update()
    // })

    list.children().first().addClass("active")
        // $(".l-Subcat-elem").click(async(t) => {
        //     $(".l-Subcat-elem").removeClass('active')
        //     $(t.currentTarget).addClass("active")

    //     // await Subupdate(JSON.stringify($(t.currentTarget).data('cat_id'))) //(put id from chosen point from category to json for serv)
    // })
}



// filling in the category table
async function catUpdate(dataCat) {

    let list = $("#listCategory")
    list.empty()

    for (let i = 0; i < dataCat.length; i++) {
        const el = dataCat[i];

        let listEl = `
            <div class="list-group-item list-group-item-action l-cat-elem" data-cat_id=${el.id}>
                ${el.name}
                <button type="button" class="btn btn-danger btn-sm l-button_action CategoryDelete" data-toggle="modal" data-target="#l-DeleteCategory" data-id=${el.id}>
                    <svg><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-bin"></use></svg>
                </button>  
                <button type="button" class="btn btn-success btn-sm l-button_action CategoryEdit" data-toggle="modal" data-target="#l-EditCategory" data-modal_id=${el.id} data-modal_name=${el.name} data-modal_url=${el.url}>
                    <svg><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-pencil"></use></svg>
                </button>
            </div>`

        list.append(listEl)
    }

    list.children().first().addClass("active")
}

async function CATEDIT() {
    let out = {
        name_cat: $("#CatEditName").val(),
        url_cat: $("#CatEditUrl").val(),
        id_cat: $('#l-EditCategory').data("cat_id") //  "id" define in SubCategory placeholder
    }

    let res = await labPost("edit", JSON.stringify(out))
    if (res) {
        LAB.toast("Успешно")
    } else {
        LAB.toast("Ошибка редактирвоания")
    }

    update()
}


// async function SubCategoryDelete() {
//     console.log("subDel")


//     // let id = $(currentTarget).parent().data('id_subc')
//     // console.log(id)
//     // await labPost("Subdel", JSON.stringify(id))
//     // let CurrentActiveCat = $('.l-Subcat-elem.active').data('cat_id');
//     // console.log(CurrentActiveCat)
//         // await Subupdate(JSON.stringify(CurrentActiveCat))
//         //await update()


// }


async function SUBCATEDIT() {
    let out = {
        name_subc: $("#SubCatEditName").val(),
        url_subc: $("#SubCatEditUrl").val(),
        id_subc: $('#l-EditSubCategory').data("id_subc") //  "id_subc" define in SubCategory placeholder
    }

    let res = await labPost("Subedit", JSON.stringify(out))
    if (res) {
        LAB.toast("Успешно")
    } else {
        LAB.toast("Ошибка редактирвоания")
    }


    let CurrentActiveCat = $('.list-group-item.active').data('cat_id');

    await Subupdate(JSON.stringify(CurrentActiveCat))

}

// async function TH() {
//     console.log("test")
//     await labPost("test")
//     console.log("after")
// }


async function labStart() {
    await update()

    // Category modals
    $("#CATADD").click(CATADD)
    $("#CATEDIT").click(CATEDIT)


    //$("#three").click(TH)


    // Category placeholder
    $('#l-EditCategory').on('show.bs.modal', function(event) {
        let button = $(event.relatedTarget)
        let EditingName = button.data('modal_name')
        let EditingUrl = button.data('modal_url')
        let EditingId = button.data('modal_id')

        $(this).find('#CatEditName').val(EditingName)
        $(this).find('#CatEditUrl').val(EditingUrl)
        $(this).data('cat_id', EditingId)
    })

    // Category search
    $('#CatSearch').on('input', async function() {
        let text = $('#CatSearch').val()

        let res = await labPost("search", text)

        catUpdate(res)
        LAB.toast(`Найдено: ${res.length}`)
    });

    // SubCategory modals
    $("#SUBCATADD").click(SUBCATADD)
    $("#SUBCATEDIT").click(SUBCATEDIT)
        // /$(".SubCategoryDelete").click(SubCategoryDelete)

    // SubCategory placeholder
    $('#l-EditSubCategory').on('show.bs.modal', function(event) {
        let button = $(event.relatedTarget)
        let EditingName = button.data('modal_name_subc')
        let EditingUrl = button.data('modal_url_subc')
        let EditingId = button.data('modal_id_subc')

        $(this).find('#SubCatEditName').val(EditingName)
        $(this).find('#SubCatEditUrl').val(EditingUrl)
        $(this).data('id_subc', EditingId)
    })

    // SubCategory search
    $('#SubCatSearch').on('input', async function() {
        let text = $('#SubCatSearch').val()
        let CurrentActiveCat = $('.list-group-item.active').data('cat_id'); //  "id" define in SubCategory placeholder
        let out = {
                name_subc: text,
                CurrentActiveCat: CurrentActiveCat
            }
            // let res = await Subupdate(JSON.stringify(text))
        let res = await labPost("Subsearch", JSON.stringify(out))


        SubcatUpdate(res)
        LAB.toast(`Найдено: ${res.length}`)
    });

}

$(document).ready(labStart)