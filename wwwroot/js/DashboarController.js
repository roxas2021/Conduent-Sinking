

function Search_Rec() {
    $("#tblmemberdata").empty();
    $("#idsearch").val('');
    $("#member_id").val('');
}

function GetData() {
    var searchdata = $("#idsearch").val();
    var searchtable = $("#tblmemberdata");

    searchtable.empty();

    var obj = {
        searchval: searchdata,
    }

    set_type = "GET";
    set_url = "SearchData";
    page_type = "Dashboard";
    ConnController(set_type, set_url, obj, page_type);
}

function DisplaySearchData(data) {
    var new_data = JSON.parse(data);

    if (new_data != "1") {
        new_data.forEach(function (dt) {
            $("#tblmemberdata").append("<tr>" +
                "<td>" + dt.member_id + "</td>" +
                "<td>" + dt.member_name + "</td>" +
                "<td><input type=" + "submit" + " value=" + "View" + " onclick=" + "DisplayRec()" + "></td>" +
                "</tr>"
            );
        });
    }
    else {
        $("#tblmemberdata").append("<div> No Record Found! </div>");
    }
}


function DisplayRec() {
    var table = document.getElementById("tblMember"), rIndex;

    for (var i = 0; i < table.rows.length; i++) {
        table.rows[i].onclick = function () {
            rIndex = this.rowIndex;

            var memid = this.cells[0].innerHTML;

            $("#member_id").val(memid.trim());

        };
    }
}