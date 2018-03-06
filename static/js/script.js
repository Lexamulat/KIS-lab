"use strict";

$(document).ready(function() {
    console.log("start")

    $("#l-order_categoty").change(function(params) {
        let text = $(this).next();
        let newText = ((text.text() == "ASC") ? "DESC" : "ASC")
        text.text(newText)
    });
});