
function EditRecord() {

    var table = document.getElementById("dataTable"), rIndex;

    for (var i = 0; i < table.rows.length; i++) {

        table.rows[i].onclick = function () {
            rIndex = this.rowIndex;
            console.log(rIndex);

            var amount = this.cells[0].innerHTML;
            var date = this.cells[1].innerHTML

            $("#amount").val(amount);
            $("#date").val(date);
            $("#amount_dep").val(amount);
        };
    }

    var setmemberid = $("#memberid").text();

    $("#memberid_new").text(setmemberid);

}


