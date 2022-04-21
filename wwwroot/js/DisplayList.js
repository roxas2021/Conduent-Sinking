
function GetData() {
    LoadDepositData();
}

function LoadDepositData() {

    var table = $("#tdata");

    table.empty();

    var id2 = $("#getmemberid").text();
    var f_year = $("#fundyear").val();

    var id = {
        message: id2,
        year: f_year
    }

    set_url = "DisplayList";
    proc_type = "ViewFund";
    set_type = "GET";

    DataController(id, set_url, proc_type, set_type)
}

function DeleteRecord() {

    var id2 = $("#getmemberid").text();
    var f_year = $("#fundyear").val();


    var table = document.getElementById("dataTable"), rIndex;

    for (var i = 0; i < table.rows.length; i++) {

        table.rows[i].onclick = function () {
            rIndex = this.rowIndex;

            var recno = this.cells[3].innerHTML;

            var id = {
                memberid_dep: id2,
                yearfund: f_year,
                rec_no: recno
            }

            set_url = "DeleteDeposit";
            proctype = "DeleteDeposit";
            set_type = "GET";
            if (confirm("Are you sure you want to delete this deposit record?")) {
                DataController(id, set_url, proctype, set_type);
            }
        };
    }
}

function EditDeposit() {

    var id2 = $("#memberid_new").text();
    var f_year = $("#fundyear").val();
    var new_date = $("#new_datedep").val();
    var amount_dep = $("#amount").val();
    var recno = $("#recno_dep").val();

    if (amount_dep != "" && new_date != "") {
        var id = {
            memberid_dep: id2,
            yearfund: f_year,
            rec_no: recno,
            new_depdate: new_date,
            amount: amount_dep
        }

        set_url = "EditDeposit";
        proctype = "EditDeposit";
        set_type = "GET";

        $("#editdep").attr("data-dismiss", "modal");
        DataController(id, set_url, proctype, set_type);
    }
    else {
        if (amount_dep == "") {
            alert("Please Enter Amount First!.");
        }
        else if (new_date == "") {
            alert("Please Select Date First!.");
        }
    }
}

function AddDeposit() {
    var memberid = $("#memberid_dep").val();
    var amount = $("#amount_dep").val();
    var datedep = $("#date_dep").val();
    var yeardep = new Date();

    if (amount != "" && datedep != "") {
        var obj = {
            memberid_dep: memberid,
            amount: amount,
            datedeposit: datedep,
            yearfund: yeardep.getFullYear()
        }

        set_url = "AddNewDeposit";
        proctype = "AddNewDeposit";
        set_type = "GET";

        $("#SaveDeposit").attr("data-dismiss", "modal");
        DataController(obj, set_url, proctype, set_type );
    }
    else {
        if (amount == "") {
            alert("Please Enter Amount First!.");
        }
        else if (datedep == "") {
            alert("Please Select Date First!.");
        }
    }
}

function GetTotal() {

    var id2 = $("#getmemberid").text();
    var f_year = $("#fundyear").val();

    var id = {
        memberid_dep: id2,
        yearfund: f_year,
    }

    set_url = "GetTotalDeposit";
    proctype = "GetTotalDeposit";
    set_type = "GET";

    DataController(id, set_url, proctype, set_type);
}

function DataController(obj, obj_2, obj_3, obj_4) {

    $.ajax({
        type: obj_4,
        url: '/Home/'+ obj_2,
        data: obj,
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            if (obj_3 == "ViewFund") {
                DisplayFundData(data);
            }
            else if (obj_3 == "DeleteDeposit") {
                DeleteDepositView(data);
            }
            else if (obj_3 == "EditDeposit") {
                EditDepositRec(data);
            }
            else if (obj_3 == "GetTotalDeposit") {
                DisplayTotal(data);
            }
            else if (obj_3 == "AddNewDeposit") {
                AddDepositView(data);
            }
            else if (obj_3 == "SaveLoan") {
                LoanProcess(data);
            }
            else if (obj_3 == "ViewLoanData") {
                LoadLoanData(data);
            }
            else if (obj_3 == "DeleteLoanRec") {
                DisplayNewLoanRec(data);
            }
            else if (obj_3 == "EditLoanRec") {
                DisplayLoanEditedRec(data);
            }
            else if (obj_3 == "SaveEditLoan") {
                DisplayLoanEdited(data);
            }

        },
        error: function (respone) {
            alert(respone);
        }

    });

}

function DisplayFundData(data) {

    var data = JSON.parse(data);

    data.forEach(function (dt) {

        $("#tdata").append("<tr>" +
            "<td>" + dt.amount + "</td>" +
            "<td>" + dt.DateDep + "</td>" +
            "<td><input data-toggle=" + "modal" + " data-target=" + "#EditDeposit" + " type=" + " button" + " value=" + "Edit" + " onclick=" + "EditRecord()" + " data-dismiss=" + "modal" + ">" +
            "<input type=" + " button" + " value=" + "Delete" + " onclick=" + "DeleteRecord()" + " style=" + "margin-left:10px" + "></td>" +
            "<td style=" + "visibility:hidden" + ">" + dt.rec_no + "</td>" +
            "</tr>"
        );
    });
    
}

function EditRecord() {

    var memid = $("#getmemberid").text();

    $("#memberid_new").text(memid);

    var table = document.getElementById("dataTable"), rIndex;

    for (var i = 0; i < table.rows.length; i++) {

        table.rows[i].onclick = function () {
            rIndex = this.rowIndex;

            var amount = this.cells[0].innerHTML;
            var date = this.cells[1].innerHTML;
            var recno = this.cells[3].innerHTML;

            $("#amount").val(parseInt(amount.replace(",", "")));
            $("#recno_dep").val(recno);
            $("#new_datedep").val(date);
        };
    }

}

function CreateElement() {

    var x = document.createElement("INPUT");
    x.setAttribute("type", "number");
    x.setAttribute("class", "form-control newradius");
    x.setAttribute("value", "");
    x.setAttribute("id", "amount_dep");
    document.getElementById("for_amount").appendChild(x);

    var y = document.createElement("INPUT");
    y.setAttribute("type", "date");
    y.setAttribute("class", "form-control newradius");
    y.setAttribute("value", "");
    y.setAttribute("id", "date_dep");
    document.getElementById("for_date").appendChild(y);
}

function DeleteDepositView(data) {
    LoadDepositData();
    GetTotal();
}

function EditDepositRec(data) {
    alert(JSON.stringify(data));
    GetTotal();
}

function DisplayTotal(data) {
    $("#TotalAmount").text(data);
}

function AddDepositView(data) {
    alert(JSON.stringify(data));
    GetTotal();
}
