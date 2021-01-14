/******************browser back functionality****************/
function pushState(state) {
    window.history.pushState(state, null, "");
}
window.onpopstate = function (event) {
    state = null;
    if (event.state) {
        state = event.state;
    }
    if (jQuery.isEmptyObject({ state }) || "start" === state || "/rsvpEnd" === state || "/rsvpDecline" === state) {
        loadStart("false");
    } else {
        //ajaxPost(state, createJsonObj(), "#oval", "false");
    }
};
/********** ajax get requests (start layout on page load) *************/
$(document).ready(function () {
    loadStart("true");

    $('body').on('click', '#iconGallery', function () {
        ajaxGet("/gallery", "true");
    });

    $('body').on('click', '#iconGuestbook', function () {
        ajaxGet("/guestbook", "true");
    });

    $('body').on('click', '#iconInfo', function () {
        ajaxGet("/info", "true");
    });

    $('body').on('click', '#iconTimeline', function () {
        ajaxGet("/timeline", "true");
    });

    $('body').on('click', '#iconWeddingAbc', function () {
        ajaxGet("/weddingAbc", "true");
    });

    $('body').on('click', '#timetablelink', function () {
        ajaxGet("/timeline", "true");
    });

    $('body').on('click', '.arrowback', function () {
        ajaxGet("/menu_expanded", "true");
    });

    $('body').on('click', '#forward_info', function () {
        ajaxGet("info", "true");
    });

    $('body').on('click', '#forward_timeline', function () {
        ajaxGet("timeline", "true");
    });

    $('body').on('click', '#forward_guestbook', function () {
        ajaxGet("guestbook", "true");
    });

    $('body').on('click', '#forward_gallery', function () {
        ajaxGet("gallery", "true");
    });

    $('body').on('click', '#guestbookForward', function () {
        ajaxGet("guestbook_input", "true");
    });

    $('body').on('click', '#forward_weddingAbc', function () {
        ajaxGet("weddingAbc", "true");
    });

});

function loadStart(push) {
    $.ajax({
        url: "/menu", success: function (result) {
            $("#mainDiv").html(result);
        }
    });
    if ("true" === push) {
        pushState("start");
    }
}

/****************** helper funcions *************************/
function ajaxGet(url, push) {
    if (jQuery.isEmptyObject({ url })) {
        url = "empty";
    }
    $.ajax({
        url: url, success: function (result) {
            $("#mainDiv").html(result);
        }
    });

    if ("true" === push) {
        pushState(url);
    }
}

/*******************post calls *******************************/
$(document).ready(function () {
    $('body').on('click', '#guestbookInput', function () {
        // validate name not null
        var name = $("#name").val();
        var message = $("#message").val();
        event.preventDefault();
        ajaxPost("/saveEntry", createJsonObj(), "#mainDiv", "true");
    });
});

function ajaxPost(url, jsonObj, div, pushstate) {
    if ("true" === pushstate) {
        pushState(url);
    }
    // DO POST
    $.ajax({
        type: "POST",
        dataType: "html",
        contentType: "application/json",
        data: JSON.stringify(jsonObj),
        url: url,
    })
        .done(function (response) {
            console.log("Response of update: ", response)
            $(div).html(response);
            //animIn(div, response);
        })
        .fail(function (xhr, textStatus, errorThrown) {
            console.log("ERROR: ", xhr.responseText)
            return xhr.responseText;
        });
}

function createJsonObj(confirm) {
    var name = $("#name").val();
    var message = $("#message").val();

    if (confirm) {
        confirmation = confirm;
    }

    var jsonObj = {
        'name': name,
        'message': message
    };
    return jsonObj;
}