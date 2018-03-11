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
        $.post(url, JSON.stringify(postData), function(data, textStatus) {
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
        let id2 = $(e.currentTarget).data('id')

        await labPost("del", id2.toString())
        await update()
    })

    // change active status from Category on clic
    $(".l-cat-elem").click(async(t) => {
        $(".l-cat-elem").removeClass('active')
        $(t.currentTarget).addClass("active")
            // console.log($(t.currentTarget).data('cat_id'))
        await Subupdate(JSON.stringify($(t.currentTarget).data('cat_id'))) //(put id from chosen point from category to json for serv)
    })
}

async function Subupdate(cat_id) {
    const dataSubCat = await labPost("Sublist", cat_id)
    await SubcatUpdate(dataSubCat)
        //console.log(dataSubCat[0].id_subc)

    await ModelUpdate((dataSubCat[0].id_subc).toString())

    $('.SubCategoryDelete').click(async(c) => {
        //c.stopPropagation();
        let id = $(c.currentTarget).data('id_subc')

        await labPost("Subdel", id.toString())
        let CurrentActiveCat = $('.list-group-item.l-cat-elem.active').data('cat_id');

        await Subupdate(CurrentActiveCat.toString())
    })
    $(".l-Subcat-elem").click(async(t) => {
        $(".l-Subcat-elem").removeClass('active')
        $(t.currentTarget).addClass("active")
        await ModelUpdate(JSON.stringify($(t.currentTarget).data('id_subc')))
    })
}


async function ModelUpdate(id_subc) {
    const dataModel = await labPost("Modlist", id_subc)
    await ModelUpdateWriter(dataModel)




    $('.ModDelete').click(async(c) => {
        //c.stopPropagation();
        let id = $(c.currentTarget).data('id_mod')
        console.log("del")
        await labPost("Moddel", id.toString())
        let CurrentActiveSubCat = $('.list-group-item.l-Subcat-elem.active').data('id_subc');

        await ModelUpdate(CurrentActiveSubCat.toString())
    })

    $(".l-mod-elem").click(async(t) => {
        $(".l-mod-elem").removeClass('active')
        $(t.currentTarget).addClass("active")
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

    let res = await labPost("Subinsert", out)
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

    let res = await labPost("insert", out)
    if (res) {
        LAB.toast("Успешно")
    } else {
        LAB.toast("Ошибка доабвления")
    }

    update()
}

async function MODADD() {
    let CurrentActiveSubCat = $('.list-group-item.l-Subcat-elem.active').data('id_subc');

    let out = {
        name_mod: $("#ModName").val(),
        price: $("#ModPrice").val(),
        description: $("#ModDescription").val(),
        picture: picture1.getAttribute('src'),
        id_subcat: CurrentActiveSubCat
    }

    let res = await labPost("Modinsert", out)
    update()
}





// filling in the SUBcategory table

function SubcatUpdate(dataSubCat) {

    let list = $("#listSubCategory")
    list.empty()
    for (let i = 0; i < dataSubCat.length; i++) {
        const el = dataSubCat[i];

        let listEl = `
            <div class="list-group-item list-group-item-action l-Subcat-elem" data-id_subc=${el.id_subc}>
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

    list.children().first().addClass("active")

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
                <button type="button" class="btn btn-success btn-sm l-button_action CategoryEdit" data-toggle="modal" data-target="#l-EditCategory" data-modal_id=${el.id} data-modal_name="${el.name}" data-modal_url="${el.url}">
                    <svg><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-pencil"></use></svg>
                </button>
            </div>`

        list.append(listEl)
    }

    list.children().first().addClass("active")
}


// async function ModelUpdate(dataCat)
async function ModelUpdateWriter(dataModel) {

    let list = $("#listModel")
    list.empty()

    for (let i = 0; i < dataModel.length; i++) {
        const el = dataModel[i];

        let listEl = `
        <div class="list-group-item list-group-item-action flex-column align-items-start  l-mod-elem">

        <div class="row l-model_item">

            <img src="${el.picture}" class="rounded float-left l-model_item-img">
            <div class="l-model_item-about">
                <div class="d-flex w-100 justify-content-between">
                    <h5 class="mb-1">${el.name_mod}</h5>

                    <span>
                        <button type="button" class="btn btn-danger btn-sm l-button_action   ModDelete" data-id_mod=${el.id_mod}>
                            <svg><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-bin"></use></svg>
                        </button>
                        <button type="button" class="btn btn-success btn-sm l-button_action  ModEdit" data-toggle="modal" data-target="#l-EditModel" data-modal_id_mod="${el.id_mod}" data-modal_name_mod="${el.name_mod}" data-modal_price="${el.price}" data-modal_description="${el.description}" data-modal_pricture="${el.picture}">
                            <svg><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-pencil"></use></svg>
                        </button>
                    </span>
                </div>
                <p class="mb-1">${el.description}</p>
                <h3>${el.price} ₽</h3>
            </div>
        </div>

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

    let res = await labPost("edit", out)
    if (res) {
        LAB.toast("Успешно")
    } else {
        LAB.toast("Ошибка редактирвоания")
    }

    update()
}

async function SUBCATEDIT() {
    let out = {
        name_subc: $("#SubCatEditName").val(),
        url_subc: $("#SubCatEditUrl").val(),
        id_subc: $('#l-EditSubCategory').data("id_subc") //  "id_subc" define in SubCategory placeholder
    }

    let res = await labPost("Subedit", out)
    if (res) {
        LAB.toast("Успешно")
    } else {
        LAB.toast("Ошибка редактирвоания")
    }


    let CurrentActiveCat = $('.list-group-item.active').data('cat_id');

    await Subupdate(JSON.stringify(CurrentActiveCat))

}


async function MODEDIT() {

    console.log("editmod")

    let out = {
        id_mod: $('#l-EditModel').data("id_mod"),
        name_mod: $("#ModEditName").val(),
        price: $("#ModEditPrice").val(),
        description: $("#ModEditDescription").val(),
        picture: picture.getAttribute('src')
    }

    let res = await labPost("Modedit", out)
}

async function labStart() {
    await update()
        // $("#upload").change(readURL);
        // Category modals
    $("#CATADD").click(CATADD)
    $("#CATEDIT").click(CATEDIT)


    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function(e) {
                $('#picture').attr('src', e.target.result);
            }

            reader.readAsDataURL(input.files[0]);
        }
    }

    $("#imgInp").change(function() {
        readURL(this);
    });

    function readURL1(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function(e) {
                $('#picture1').attr('src', e.target.result);
            }

            reader.readAsDataURL(input.files[0]);
        }
    }

    $("#imgInp1").change(function() {
        readURL1(this);
    });

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
        let res = await labPost("Subsearch", out)
            //await Subupdate(JSON.stringify(CurrentActiveCat))

        SubcatUpdate(res)
        LAB.toast(`Найдено: ${res.length}`)
    });



    //Model modals
    $("#MODADD").click(MODADD)
    $("#MODEDIT").click(MODEDIT)

    // SubCategory placeholder
    $('#l-EditModel').on('show.bs.modal', function(event) {
        let button = $(event.relatedTarget)
        let EditingName = button.data('modal_name_mod')
        let EditingPrice = button.data('modal_price')
        let EditingDescription = button.data('modal_description')
        let EditingPicture = button.data('modal_pricture')
        let EditingId = button.data('modal_id_mod')

        $(this).find('#ModEditName').val(EditingName)
        $(this).find('#ModEditDescription').val(EditingDescription)
        $(this).find('#ModEditPrice').val(EditingPrice)
        $("#picture").attr("src", EditingPicture)
        $(this).data('id_mod', EditingId)
    })

    $('#ModSearch').on('input', async function() {
        let text = $('#ModSearch').val()
        let res = await labPost("search", text)
        catUpdate(res)
        LAB.toast(`Найдено: ${res.length}`)
    });

}

$(document).ready(labStart)