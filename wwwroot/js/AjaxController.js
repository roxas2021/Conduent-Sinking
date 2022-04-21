

function UpdateMemberInfo() {

    var set_memberid = $("#memberid_up").val();
    var set_FName = $("#fname").val();
    var set_ContactNo = $("#contactno").val();
    var set_Address = $("#address").val();
    var set_memtype = $("#memtype").val();
    var type;

    if (set_memtype == "Member") {
        type = 1;
    }
    else {
        type = 2;
    }

    if (set_FName != "") {
        var create_obj = {
            memberid: set_memberid,
            FName: set_FName,
            ContactNo: set_ContactNo,
            Address: set_Address,
            member_type: type
        }
        var str = "UpdateMember";
        SubmitData(create_obj, str);
        forClearData(create_obj);
    }
    else {
        if (set_FName == "") {
            alert("Please Enter Name of Member that you want be Update.");
        }
    }
}

function AddNewMember() {

    var set_memberid = $("#memberid").val();
    var set_FName = $("#fname").val();
    var set_ContactNo = $("#contactno").val();
    var set_Address = $("#address").val();
    var set_memtype = $("#memtype").val();
    var type;

    if (set_memtype == "Member") {
        type = 1;
    }
    else {
        type = 2;
    }

    if (set_memberid != "" && set_FName != "") {
        var create_obj = {
            memberid: set_memberid,
            FName: set_FName,
            ContactNo: set_ContactNo,
            Address: set_Address,
            member_type: type
        }
        var str = "AddNewMember";
        SubmitData(create_obj, str);
    }
    else{
        if (set_memberid == "") {
            alert("Please Enter Member ID First!.");
        }
        else if (set_FName == "") {
            alert("Please Enter Name of the Member.");
        }
    }
}

function SubmitData(obj, str) {
    $.ajax({
        url: '/Home/' + str,
        method: "Post",
        data: obj,

        success: function (data) {
            ClearData(data);
        },
        error: function () {
            console.error(err);
        }
    })
}

function ClearData(data) {
    if (data == "AddNewMember") {

        alert("New Member Successfuly Added");

        $("#memberid").val('');
        $("#fname").val('');
        $("#contactno").val('');
        $("#address").val('');
    }
    else if (data == "UpdateMember") {

        alert("Member Successfully Updated.");

        var set_FName = $("#fname").val();
        var set_ContactNo = $("#contactno").val();
        var set_Address = $("#address").val();
        var set_memtype = $("#memtype").val();

        $("#getfname").text(set_FName);
        $("#getcontactno").text(set_ContactNo);
        $("#getaddress").text(set_Address);
        $("#MemType").text(set_memtype);
    }
    else if (data == "success") {
        alert("Found Records");
    }
}
