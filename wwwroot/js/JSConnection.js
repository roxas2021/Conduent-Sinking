var set_type, set_url, page_type, proctype;

function ConnController(get_type, get_url, obj, get_pagetype) {

    $.ajax({
        type: get_type,
        url: '/Home/' + get_url,
        data: obj,
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            Success_Controller(data, get_pagetype, get_url);
        },
        error: function (respone) {
            alert(JSON.stringify(respone));
        }
    });
}

function Success_Controller(data, pagetype, proc_type) {
    if (pagetype == "Dashboard") {
        Dashboard_Controller(data, proc_type);
    }
    else if (pagetype == "DisplayFund") {
        DisplayFund_Controller(data, proc_type);
    }
    else if (pagetype == "MemberInfoView") {
        MemberInfoView_Controller(data, proc_type);
    }
}

