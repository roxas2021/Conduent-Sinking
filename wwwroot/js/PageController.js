
function Dashboard_Controller(data, proc_type) {
    var url = $("#RedirectTo").val();

    if (proc_type == "SearchData") {
        DisplaySearchData(data);
    }
}

function DisplayFund_Controller(data, proc_type) {
    if (proc_type == "LoadPaymentList") {
        DisplayPaymentList(data);
    }
    else if (proc_type == "EditPaymentRec") {
        EditPaymentLog(data);
    }
}

function MemberInfoView_Controller(data, proc_type) {
    var url = $("#RedirectoMember").val();

    if (proc_type == "MemberInfoView") {
    }
}