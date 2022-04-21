
function ClearMemberData() {
    var set_memberid = $("#getmemberid").text();
    var set_FName = $("#getfname").text();
    var set_ContactNo = $("#getcontactno").text();
    var set_Address = $("#getaddress").text();
    var set_memtype = $("#MemType").text();

    $("#memid").text(set_memberid.trim());
    $("#memberid_up").val(set_memberid.trim());
    $("#fname").val(set_FName.trim());
    $("#contactno").val(set_ContactNo.trim());
    $("#address").val(set_Address.trim());
    $("#memtype").val(set_memtype);
}

function AddDepositForm() {
    $("#amount_dep").val('');
    var set_memberid = $("#getmemberid").text();

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;

    $("#memid_dep").text(set_memberid.trim());
    $("#memberid_dep").val(set_memberid.trim());
    $("#date_dep").val(today);

}

function ApplySinking() {
    var title = $("#fundyear").val();
    var mem_id = $("#getmemberid").text();
    var year = $("#fundyear").val();

    $("#setmem_id").val(mem_id.trim());
    $("#set_year").val(year);
    $("#Sinking").text("Apply Sinking for this Year " + title);
}
