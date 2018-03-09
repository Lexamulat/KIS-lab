"use strict";

<<<<<<< HEAD
<<<<<<< Updated upstream
=======




>>>>>>> master
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
<<<<<<< HEAD
=======
$(document).ready(function() {
    console.log("start")
    updateList()
    console.log("end")
    var options = {
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


        $.post("insert", JSON.stringify(out), function(data, textStatus) {

            if ((data) == 0) {

                alert("failed");

                // $("#snak").snackbar("show");

            } else {
                console.log(options)
                $.snackbar(options)
                    //alert("succsess") 
                    //  $("#snak").snackbar("show");

            }


>>>>>>> Stashed changes
=======
            console.log(data)
>>>>>>> master
        }, "json");
    });
}

async function update() {
    const dataCat = await labPost("list")

    console.log("----cat")
    console.log(dataCat)
    console.log("----cat")


    catUpdate(dataCat)
        // SubcatUpdate(dataCat)
}

async function Subupdate() {
    const dataSubCat = await labPost("Sublist")

    console.log("----SUBcat")
    console.log(dataSubCat)
    console.log("---SUB-cat")

    // catUpdate(dataCat)
    SubcatUpdate(dataSubCat)
}
// async function CATADD() {
//     const dataCat = await labPost("list")

//     let out = {
//         name_cat: $("#name_cat").val(),
//         url_cat: $("#url_cat").val()
//     }

//     document.getElementById("name_cat").value = "";
//     document.getElementById("url_cat").value = "";

//     let res = await labPost("insert", JSON.stringify(out))
//     if (res) {
//         LAB.toast("Успешно")
//     } else {
//         LAB.toast("Ошибка доабвления")
//     }
// }

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

// filling in the SUBcategory table

function SubcatUpdate(dataSubCat) {
    let list = $("#listSubCategory")
    list.empty()

    for (let i = 0; i < dataSubCat.length; i++) {
        const el = dataSubCat[i];

        let listEl = `
            <div class="list-group-item list-group-item-action l-cat-elem">
                ${el.name_subc}
              
            </div>`

        list.append(listEl)
    }
}


// filling in the category table
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


<<<<<<< Updated upstream
async function labStart() {
    await update()
    await Subupdate()

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
=======
    $("#CATEDIT").on('click', CATEDIT);


});

function CATEDIT() {
    // var namecat=$("#namecat").val();
    // var urlcat=$("#urlcat").val();

    let out = {
            name_cat: $("#CatEditName").val(),
            url_cat: $("#CatEditUrl").val()
        }
        // document.getElementById("name_cat").value = "";
        // document.getElementById("url_cat").value = "";


    $.post("edit", JSON.stringify(out), function(data, textStatus) {

        if ((data) == 0) {

            alert("failed");

            // $("#snak").snackbar("show");

        } else {
            console.log(options)
            $.snackbar(options)
                //alert("succsess") 
                //  $("#snak").snackbar("show");

        }
        updateList()

    }, "json");
}
>>>>>>> Stashed changes
