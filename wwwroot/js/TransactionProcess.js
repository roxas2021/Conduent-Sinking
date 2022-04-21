
function LoadAddPayment() {
    $("#amount_pay").val('');

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;

    $("#date_pay").val(today);
    $("#SavePayment").attr("onclick", "AddPayment()");
}

function AddPayment() {
    var memid = $("#memberid").text();
    var loanrec = $("#loanrec").val();
    var amountpay = $("#amount_pay").val();
    var datepay = $("#date_pay").val();
    if (amountpay != "") {
        var obj = {
            member_id: memid.trim(),
            loanrec: loanrec,
            amount_pay: amountpay,
            date_pay: datepay
        }

        set_type = "GET";
        set_url = "AddLoanPayment";
        page_type = "DisplayFund";
        ConnController(set_type, set_url, obj, page_type);
        alert("Payment Successfult Saves.");
        $("#SavePayment").attr("data-dismiss", "modal");
        LoadPaymentList()
    }
    else {
        alert("Please Enter Amount First");
    }
}

function DeletePayment() {
    var id = $("#memberid").text();
    var table = document.getElementById("PaymentTable"), rIndex;

    for (var i = 0; i < table.rows.length; i++) {

        table.rows[i].onclick = function () {
            rIndex = this.rowIndex;

            var recno = this.cells[3].innerHTML;

            var obj = {
                memberid: id,
                recno: recno
            }

            set_type = "GET";
            set_url = "DeletePaymentRec";
            page_type = "DisplayFund";
            if (confirm("Are you sure you want to delete this Payment record?")) {
                ConnController(set_type, set_url, obj, page_type);
                alert("Payment Successfully Deleted.");
                LoadPaymentList();
            }

        };
    }
}

function LoadPaymentList() {
    var id = $("#memberid").text();
    var loanrec = $("#loanrec").val();

    $("#tpaymentdata").empty();

    var obj = {
        memid: id,
        loanrec: loanrec
    }

    set_type = "GET";
    set_url = "LoadPaymentList";
    page_type = "DisplayFund";
    ConnController(set_type, set_url, obj, page_type)
}

function DisplayPaymentList(data) {
    var new_data = JSON.parse(data);

    new_data.forEach(function (dt) {

        $("#tpaymentdata").append("<tr>" +
            "<td>" + dt.amount_pay + "</td>" +
            "<td>" + dt.date_pay + "</td>" +
            "<td>" +
            "<input data-toggle=" + "modal" + " data-target=" + "#AddPayment" + " type=" + "button" + " value=" + "Edit" + " onclick=" + "EditPaymentRec()" + ">" +
            "<input type=" + "button" + " value=" + "Delete" + " onclick=" + "DeletePayment()" + " style=" + "margin-left:10px" + ">" +
            "</td>" +
            "<td style=" + "visibility:hidden" + ">" + dt.rec_no + "</td>" +
            "</tr>"
        );
    });

}

function EditPaymentRec() {
    $("#SavePayment").attr("onclick", "EditPayment()");
    var table = document.getElementById("PaymentTable"), rIndex;

    for (var i = 0; i < table.rows.length; i++) {
        table.rows[i].onclick = function () {
            rIndex = this.rowIndex;

            var amount = this.cells[0].innerHTML;
            var date = this.cells[1].innerHTML;
            var recno = this.cells[3].innerHTML;

            $("#amount_pay").val(parseInt(amount.replace(",", "")));
            $("#date_pay").val(date);
            $("#recno").val(recno);
        };
    }
}

function EditPayment() {
    var memid = $("#memberid").text();
    var recno = $("#recno").val();
    var amountpay = $("#amount_pay").val();
    var datepay = $("#date_pay").val();

    if (amountpay != "") {
        var obj = {
            member_id: memid.trim(),
            rec_no: recno,
            amount_pay: amountpay,
            date_pay: datepay
        }

        set_type = "GET";
        set_url = "EditPaymentRec";
        page_type = "DisplayFund";
        ConnController(set_type, set_url, obj, page_type);
        $("#SavePayment").attr("data-dismiss", "modal");
    }
    else {
        alert("Please Enter Amount First");
    }
}

function EditPaymentLog(data) {
    alert(data);
    LoadPaymentList();
}