"use strict";

$(document).ready(function () {

    console.log("start")
    updateList()
    console.log("end")
    var options = {
        content: "added23", // text of the snackbar
        style: "toast", // add a custom class to your snackbar
        timeout: 2000 // time in milliseconds after the snackbar autohides, 0 is disabled
    }


    // $.snackbar(options);


    $("#CATADD").on('click', function () {
        // var namecat=$("#namecat").val();
        // var urlcat=$("#urlcat").val();

        let out = {
            name_cat: $("#name_cat").val(),
            url_cat: $("#url_cat").val()
        }
        document.getElementById("name_cat").value = "";
        document.getElementById("url_cat").value = "";


        $.post("insert", JSON.stringify(out), function (data, textStatus) {

            if ((data) == 0) {

                alert("failed");

                // $("#snak").snackbar("show");

            } else {
                console.log(options)
                $.snackbar(options)
                //alert("succsess") 
                //  $("#snak").snackbar("show");

            }


        }, "json");
    });


    $("#two").on('click', function () {

        $.snackbar(options)

    });



    var CategoryActivePoint = 0


    function updateList() {

        $.post("list", function (data, textStatus) {
            let list = $("#listCategory")
            list.empty()

            var ActiveFlag = true;
            $.each(data, function (key, val) {
                console.log(val)
                if (ActiveFlag == true) {
                    var flg = "active";
                } else {
                    var flg = ""
                }
                let el = `
                    <div class="list-group-item list-group-item-action ${flg} ClassCategory" data-CatId=${val.id}>${val.name}
                    <button type="button" class="btn btn-danger btn-sm l-button_action CategoryDelete">
                    <svg><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-bin"></use></svg>
                    </button>  
                    <button type="button" class="btn btn-success btn-sm l-button_action CategoryEdit" data-toggle="modal" data-target="#l-EditCategory" data-whatevername=${val.name} data-whateverurl=${val.url}>
                    <svg><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-pencil"></use></svg>
                   </button>
                    </div>
                    `

                    // <button type="button" class="btn btn-success addbtncat" data-toggle="modal" data-target="#l-createCategory" data-whatever="addCat">+</button>



                list.append(el)


                ActiveFlag = false
            })

            $(".ClassCategory").click((t) => {
        
                // console.log($(t.currentTarget).attr("data-Catid"))

                $(".ClassCategory").removeClass('active')

                
                $(t.currentTarget).addClass("active")
            })
         
            $(".CategoryEdit").click((t) => {
                console.log($(t.currentTarget).parent().attr("data-Catid"))

                // console.log($(t.currentTarget).parent())


                $('#l-EditCategory').on('show.bs.modal', function (event) {
                    var button = $(event.relatedTarget) // Button that triggered the modal
                    var recipient = button.data('whatevername') // Extract info from data-* attributes
                    var recipient1 = button.data('whateverurl')
                    // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
                    // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
                    var modal = $(this)
                    
                    modal.find('#CatEditName').val(recipient)
                    modal.find('#CatEditUrl').val(recipient1)
                  })



            })
        
        

        }, "json");
    }

});

