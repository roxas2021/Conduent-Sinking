
function ApplyLoan() {
    var memid = $("#getmemberid").text();
    var memtype = $("#MemType").text();

    $("#amount_loan").val('');
    $("#No_pay").val('');

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;

    $("#memid_loan").text(memid);
    $("#pay_start").val(today);
    $("#pay_end").val(today);
    $("#date_proccess").val(today);

    if (memtype == "Member") {
        $("#interest_lon").val(5);
    }
    else {
        $("#interest_lon").val(10);
    }
    $("#SaveLoanData").attr("onclick", "SaveLoan()");
}

function SaveLoan() {
    var memid = $("#getmemberid").text();
    var amount = $("#amount_loan").val();
    var int_ret = $("#interest_lon").val();
    var no_pay = $("#No_pay").val();
    var payment_start = $("#pay_start").val();
    var payment_end = $("#pay_end").val();
    var date_proccess = $("#date_proccess").val();

    if (amount != "" && int_ret != "" && no_pay != "") {

        var data = {
            memberid: memid,
            amount: amount,
            int_rate: int_ret,
            no_months_pay: no_pay,
            pay_start: payment_start,
            pay_end: payment_end,
            loan_date: date_proccess
        }

        set_url = "SaveLoan";
        proctype = "SaveLoan";
        set_type = "GET";

        $("#SaveLoanData").attr("data-dismiss", "modal");
        DataController(data, set_url, proctype, set_type);

    }
    else {
        if (amount == "") {
            alert("Enter Amount First");
        } else if (int_ret == "") {
            alert("Enter Interest Rate to continue.");
        } else if (no_pay == "") {
            alert("Enter No of Months to Pay to continue.");
        }
    }
}

function LoanProcess(data) {
    alert(JSON.stringify(data));
    DisplayLoanData();
}

function DisplayLoanData() {
    var table = $("#tloandata");

    table.empty();

    var id2 = $("#getmemberid").text();
    var f_year = $("#fundyear").val();

    var id = {
        message: id2,
        year: f_year
    }

    set_url = "GetLoanData";
    proc_type = "ViewLoanData";
    set_type = "GET";

    DataController(id, set_url, proc_type, set_type);
}

function LoadLoanData(data) {

    var data = JSON.parse(data);

    data.forEach(function (dt) {

        $("#tloandata").append("<tr>" +
            "<td>" + dt.amount + "</td>" +
            "<td>" + dt.loan_date + "</td>" +
            "<td>" +
            "<input data-toggle=" + "modal" + " data-target=" + "#ApplyLoan" + " type=" + "button" + " value=" + "Edit" + " onclick=" + "EditLoanRec()" + ">" +
            "<input type=" + "button" + " value=" + "Delete" + " onclick=" + "DeleteLoan()" + " style=" + "margin-left:10px" + ">" +
            "<input type=" + "submit" + " value=" + "View" + " onclick=" + "ViewLoanRecord()" + " style=" + "margin-left:10px" + ">" +
            "</td>" +
            "<td style=" + "visibility:hidden" + ">" + dt.dbrecno + "</td>" +
            "</tr>"
        );
    });

}

function DeleteLoan() {
    var id2 = $("#getmemberid").text();
    var f_year = $("#fundyear").val();

    var table = document.getElementById("LoanDataTable"), rIndex;

    for (var i = 0; i < table.rows.length; i++) {

        table.rows[i].onclick = function () {
            rIndex = this.rowIndex;

            var dbrecno = this.cells[3].innerHTML;

            var id = {
                memberid: id2,
                yaer_rec: f_year,
                dbrecno: dbrecno
            }

            set_url = "DeleteLoanRec";
            proctype = "DeleteLoanRec";
            set_type = "GET";
            if (confirm("Are you sure you want to delete this Loan record?")) {
                DataController(id, set_url, proctype, set_type);
            }
        };
    }
}

function DisplayNewLoanRec(data) {
    DisplayLoanData();
}

function EditLoanRec() {
    var id = $("#getmemberid").text();

    var table = document.getElementById("LoanDataTable"), rIndex;

    for (var i = 0; i < table.rows.length; i++) {

        table.rows[i].onclick = function () {
            rIndex = this.rowIndex;

            var dbrecno = this.cells[3].innerHTML;

            var obj = {
                memberid: id,
                dbrecno: dbrecno
            }

            set_url = "EditLoanRec";
            proctype = "EditLoanRec";
            set_type = "GET";
            $("#SaveLoanData").attr("onclick", "SaveEditRec()");
            $("#dbrecno").val(dbrecno);
            DataController(obj, set_url, proctype, set_type);
        };
    }
}

function DisplayLoanEditedRec(data) {

    var id2 = $("#getmemberid").text();
    var newdata = JSON.parse(data);

    var newamount, intrate, no_pay, pay_start, pay_end, date_proc;

    newdata.forEach(function (dt) {
        newamount = dt.amount;
        intrate = dt.int_rate;
        no_pay = dt.no_months_pay;
        pay_start = dt.pay_start;
        pay_end = dt.pay_end;
        date_proc = dt.loan_date;
    });

    $("#memid_loan").text(id2);
    $("#amount_loan").val(newamount);
    $("#interest_lon").val(intrate);
    $("#No_pay").val(no_pay);
    $("#pay_start").val(pay_start);
    $("#pay_end").val(pay_end);
    $("#date_proccess").val(date_proc);
}

function SaveEditRec() {
    var memid = $("#getmemberid").text();
    var amount = $("#amount_loan").val();
    var int_ret = $("#interest_lon").val();
    var no_pay = $("#No_pay").val();
    var payment_start = $("#pay_start").val();
    var payment_end = $("#pay_end").val();
    var date_proccess = $("#date_proccess").val();
    var db_recno = $("#dbrecno").val();

    if (amount != "" && int_ret != "" && no_pay != "") {

        var data = {
            memberid: memid,
            amount: amount,
            int_rate: int_ret,
            no_months_pay: no_pay,
            pay_start: payment_start,
            pay_end: payment_end,
            loan_date: date_proccess,
            dbrecno: db_recno
        }

        set_url = "SaveEditLoan";
        proctype = "SaveEditLoan";
        set_type = "GET";

        $("#SaveLoanData").attr("data-dismiss", "modal");
        DataController(data, set_url, proctype, set_type);
    }
    else {
        if (amount == "") {
            alert("Enter Amount First");
        } else if (int_ret == "") {
            alert("Enter Interest Rate to continue.");
        } else if (no_pay == "") {
            alert("Enter No of Months to Pay to continue.");
        }
    }
}

function DisplayLoanEdited(data) {
    alert("Record successfuly Updated.");
    DisplayLoanData();
}

function ViewLoanRecord() {
    var id = $("#getmemberid").text();
    var table = document.getElementById("LoanDataTable"), rIndex;

    for (var i = 0; i < table.rows.length; i++) {

        table.rows[i].onclick = function () {
            rIndex = this.rowIndex;

            var dbrecno = this.cells[3].innerHTML;

            $("#rec_no").val(dbrecno.trim());
            $("#mem_id").val(id.trim())

        };
    }
}
