using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sample3.Models;
using Newtonsoft.Json;
using System.Web;
using System.Data;

namespace Sample3.Controllers
{
    public class HomeController : Controller
    {
        ConnDB conn = new ConnDB();
        public static string query;
        public static int memtpye;
        public string pname;
        public int row;
        public object total2;
        public static int set_memtype=0;
        public static int notfound = 0;
        public decimal loan_amount;
        public static Boolean fund_rec = false;
        public string name;

        List<memberinfo> member = new List<memberinfo>();
        List<LoanData> datalon = new List<LoanData>();
        List<SearchData> search_data = new List<SearchData>();
        List<LoanTrans> loan_trans = new List<LoanTrans>();
        
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Signup()
        {
            return View();
        }

        
        [HttpGet]
        public IActionResult SearchMember([Bind] MemberData data)
        {
            Boolean found = false;
            query = "select * from TblMember where MemberID='" + data.memberid + "' ";
            conn.connectsql();
            var yr = DateTime.Now.Year;

            if (conn.dr.Read())
            {
                found = true;
                ViewData["MemberID"] = conn.dr["MemberID"].ToString();
                ViewData["FName"] = conn.dr["FName"].ToString();
                ViewData["ContactNo"] = conn.dr["ContactNo"].ToString();
                ViewData["Address"] = conn.dr["Address"].ToString();

                ViewData["MemberID2"] = conn.dr["MemberID"].ToString();

                if (Convert.ToInt32(conn.dr["MemberType"].ToString()) == 1)
                {
                    ViewData["MemberType"] = "Member";
                    set_memtype = 1;
                }
                else
                {
                    ViewData["MemberType"] = "None-Member";
                    set_memtype = 2;
                }

                ViewData["FundYear"] = Convert.ToInt32(yr);

                notfound = 1;
                pname = "MemberInfoView";
                conn.connstring.Close();
            }
            else
            {
                TempData["msg"] = "No";
                pname = "Dashboard";
                conn.connstring.Close();
            }

            if (found == true)
            {
                if (set_memtype == 1)
                {
                    query = "select * from TblFundDeposit where MemberID='" + data.memberid + "' And YearFund='" + yr + "' ";
                    conn.connectsql();

                    if (conn.dr.Read())
                    {
                        conn.connstring.Close();

                        query = "select Sum(Amount) from TblFundDeposit where MemberID='" + data.memberid + "' And YearFund='" + yr + "' ";
                        conn.connectsql2();
                        object total = conn.cmd.ExecuteScalar();

                        ViewData["TotalDeposit"] = Convert.ToDecimal(total).ToString("#,##0.00");
                        conn.connstring.Close();
                    }
                }

                query = "select * from TblFundInfo where MemberID='" + data.memberid + "' And FundYear='" + yr + "' ";
                conn.connectsql();

                if (conn.dr.Read())
                {
                    fund_rec = true;
                    ViewData["FundRecNo"] = conn.dr["RecNo"].ToString();
                    ViewData["NoOfHeads"] = conn.dr["NoOfHeads"].ToString();
                    object noheads = conn.dr["NoOfHeads"].ToString();
                    object total = Convert.ToInt32(noheads) * 200;
                    ViewData["TAmount"] = Convert.ToDecimal(total).ToString("#,##0.00");
                }
                else
                {
                    fund_rec = false;
                }

                query = "select * from TblLoan where MemberID='" + data.memberid + "' And YearLoan='" + yr + "' ";
                conn.connectsql();

                while (conn.dr.Read())
                {
                    datalon.Add(new LoanData()
                    {
                        amount = Convert.ToDecimal(conn.dr["Amount"].ToString()).ToString("#,##0.00"),
                        loan_date = conn.dr["DateProcess"].ToString(),
                        dbrecno = conn.dr["RecNo"].ToString(),
                    });
                }
                conn.connstring.Close();


            }

            if (datalon.Count > 0)
            {
                return View(pname, datalon);
            }
            else
            {
                return View(pname);
            }
        }

        public IActionResult MemberInfoView()
        {
            return View();
        }

        [HttpPost]
        public IActionResult LoginMember([Bind] UserData ad)
        {
            query = "select * from UserLogin where Uname='" + ad.memberid + "' ";
            conn.connectsql();

            if (conn.dr.Read())
            {
                pname = "Dashboard";
            }
            else
            {
                TempData["msg"] = "Record not found! Please contact your leader for your valid member record.";
                pname = "Signup";
            }
            conn.connstring.Close();

            return View(pname);
        }

        [HttpPost]
        public IActionResult LoginAdmin([Bind] UserData ad)
        {
            query = "select * from UserLogin where Uname='" + ad.memberid + "'";

            Boolean val = false;

            conn.connectsql();

            if (conn.dr.Read())
            {
                if (Convert.ToInt32(conn.dr["UType"].ToString()) == 1)
                {
                    val = true;
                }
                else
                {
                    TempData["msg"] = "Only registered admin member are allowed to login as Admin.";
                    pname = "AdminLogin";
                }
            }
            else
            {
                TempData["msg"] = "Record not found! Please contact your leader for your valid member record.";
                pname = "AdminLogin";
            }
            conn.connstring.Close();

            if (val == true)
            {
                query = "select * from UserLogin where Uname='" + ad.memberid + "' and Upass='" + ad.upass + "' ";
                conn.connectsql();

                if (conn.dr.Read())
                {
                    pname = "Dashboard";
                }
                else
                {
                    TempData["msg"] = "Invalid Password";
                    pname = "AdminLogin";
                }
                conn.connstring.Close();
            }

            return View(pname);
        }
        
        public IActionResult Privacy()
        {
            return View();
        }
 

        public IActionResult AdminLogin()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        public IActionResult Dashboard()
        {
            return View();
        }

        [HttpPost]
        public JsonResult AddNewMember(MemberData data)
        {
            query = "insert into TblMember (MemberID,FName,ContactNo,Address,MemberType) values('" + data.memberid + "', '" + data.FName + "','" + data.ContactNo + "','" + data.Address + "','" + data.member_type + "')";

            conn.connectsql();
            conn.connstring.Close();

            query = "insert into UserLogin (UName,Utype) values('" + data.memberid + "', '" + 2 + "')";
            conn.connectsql();
            conn.connstring.Close();

            return Json("AddNewMember");
        }

        [HttpPost]
        public JsonResult UpdateMember(MemberData data)
        {
            query = "update TblMember set FName='" + data.FName + "', ContactNo='" + data.ContactNo + "', Address='" + data.Address + "', MemberType='" + data.member_type + "' where MemberID='" + data.memberid + "' ";
            conn.connectsql();
            conn.connstring.Close();

            return Json("UpdateMember");
        }

        public IActionResult DisplayFund()
        {
            return View();
        }

        public JsonResult DisplayList (string message, string year)
        {
            if (member.Count > 0)
            {
                member.Clear();
            }

            query = "select * from TblFundDeposit where MemberID='" + message + "' And YearFund='" + year + "' ";
            conn.connectsql();

             while (conn.dr.Read())
            {
                member.Add(new memberinfo()
                {
                    amount = Convert.ToDecimal(conn.dr["Amount"].ToString()).ToString("#,##0.00"),
                    DateDep = conn.dr["DepositDate"].ToString(),
                    rec_no = conn.dr["RecNo"].ToString(),
                });
            }

            var obj = JsonConvert.SerializeObject(member);

            return Json(obj);
        }

        public JsonResult DeleteDeposit(MemberData data)
        {
            query = "Delete from TblFundDeposit where MemberID='" + data.memberid_dep + "' And YearFund='" + data.yearfund + "' And RecNo='" + data.rec_no + "' ";
            conn.connectsql();
            conn.connstring.Close();

            return Json("");
        }

        public JsonResult EditDeposit(MemberData data)
        {
            query = "update TblFundDeposit set Amount='" + data.amount + "', DepositDate='" + data.new_depdate + "'  where MemberID='" + data.memberid_dep + "' And YearFund='" + data.yearfund + "' And RecNo='" + data.rec_no + "' ";
            conn.connectsql();
            conn.connstring.Close();

            return Json("Record successfully Updated.");
        }

        public JsonResult GetTotalDeposit(string memberid_dep, string yearfund)
        {

            query = "select * from TblFundDeposit where MemberID='" + memberid_dep + "' And YearFund='" + yearfund + "' ";
            conn.connectsql();

            if (conn.dr.Read())
            {
                conn.connstring.Close();

                query = "select Sum(Amount) from TblFundDeposit where MemberID='" + memberid_dep + "' And YearFund='" + yearfund + "' ";
                conn.connectsql2();
                total2 = conn.cmd.ExecuteScalar();

                conn.connstring.Close();
            }

            var newtotal = Convert.ToDecimal(total2).ToString("#,##0.00");

            return Json(newtotal);
        }

        public JsonResult AddNewDeposit(MemberData data)
        {
            query = "insert into TblFundDeposit (MemberID,Amount,DepositDate,YearFund) values('" + data.memberid_dep + "', '" + data.amount + "', '" + data.datedeposit + "', '" + data.yearfund + "')";
            conn.connectsql();
            conn.connstring.Close();

            return Json("New Record Successfully Added.");
        }

        public JsonResult SaveLoan(LoanData data)
        {
            var yr = DateTime.Now.Year;

            query = "insert into TblLoan (MemberID,Amount,IntRate,NoMonthsPay,PaymentStart,PaymentEnd,DateProcess,YearLoan)" +
                " values('" + data.memberid + "', '" + data.amount + "', '" + data.int_rate + "', '" + data.no_months_pay + "', '" + data.pay_start + "', '" + data.pay_end + "', '" + data.loan_date + "', '" + yr + "')";
            conn.connectsql();
            conn.connstring.Close();

            return Json("New Record Successfully Added.");
        }

        public JsonResult GetLoanData(string message, string year)
        {
            if (datalon.Count > 0)
            {
                datalon.Clear();
            }

            query = "select * from TblLoan where MemberID='" + message + "' And YearLoan='" + year + "' ";
            conn.connectsql();

            while (conn.dr.Read())
            {
                datalon.Add(new LoanData()
                {
                    amount = Convert.ToDecimal(conn.dr["Amount"].ToString()).ToString("#,##0.00"),
                    loan_date = conn.dr["DateProcess"].ToString(),
                    dbrecno = conn.dr["RecNo"].ToString(),
                });
            }
            conn.connstring.Close();

            var obj = JsonConvert.SerializeObject(datalon);

            return Json(obj);
        }

        public JsonResult DeleteLoanRec(LoanData data)
        {
            query = "Delete from TblLoan where MemberID='" + data.memberid + "' And YearLoan='" + data.yaer_rec + "' And RecNo='" + data.dbrecno + "' ";
            conn.connectsql();
            conn.connstring.Close();

            return Json("");
        }

        public JsonResult EditLoanRec(string memberid, string dbrecno)
        {
            if(datalon.Count > 0)
            {
                datalon.Clear();
            }

            query = "select * from TblLoan where MemberID ='" + memberid + "' And RecNo='" + dbrecno + "' ";
            conn.connectsql();

            while (conn.dr.Read())
            {
                datalon.Add(new LoanData()
                {
                    amount = conn.dr["Amount"].ToString(),
                    int_rate = conn.dr["IntRate"].ToString(),
                    no_months_pay = conn.dr["NoMonthsPay"].ToString(),
                    pay_start = conn.dr["PaymentStart"].ToString(),
                    pay_end = conn.dr["PaymentEnd"].ToString(),
                    loan_date = conn.dr["DateProcess"].ToString(),
                });
            }

            conn.connstring.Close();

            var obj = JsonConvert.SerializeObject(datalon);

            return Json(obj);
        }

        public JsonResult SaveEditLoan(LoanData data)
        {
            query = "update TblLoan set Amount='" + data.amount + "', IntRate='" + data.int_rate + "', NoMonthsPay='" + data.no_months_pay + "', PaymentStart='" + data.pay_start + "', PaymentEnd='" + data.pay_end + "', DateProcess='" + data.loan_date + "' where MemberID='" + data.memberid + "' And RecNo='" + data.dbrecno + "' ";
            conn.connectsql();

            conn.connstring.Close();

            return Json("");
        }

        [HttpGet]
        public IActionResult GetRecLoanRec([Bind] string str, string recno)
        {
            int i;
            decimal rate;
            decimal mpint;

            query = "select * from TblLoan where MemberID='" + str + "' And RecNo='" + recno + "' ";
            conn.connectsql();

            if (conn.dr.Read())
            {
                TempData["MemberID"] = conn.dr["MemberID"].ToString();
                TempData["Amount"] = Convert.ToDecimal(conn.dr["Amount"].ToString()).ToString("#,##0.00");
                loan_amount = Convert.ToDecimal(conn.dr["Amount"].ToString());
                TempData["IntRate"] = conn.dr["IntRate"].ToString() + "%";
                TempData["NoMonthsPay"] = conn.dr["NoMonthsPay"].ToString();
                TempData["PaymentStart"] = conn.dr["PaymentStart"].ToString();
                TempData["PaymentEnd"] = conn.dr["PaymentEnd"].ToString();
                TempData["DateProcess"] = conn.dr["DateProcess"].ToString();
                TempData["LoanRec"] = recno;

                i = Convert.ToInt32(conn.dr["NoMonthsPay"].ToString());
                rate = Convert.ToDecimal(conn.dr["IntRate"].ToString()) / 100;
                mpint = ((Convert.ToDecimal(conn.dr["Amount"].ToString()) * rate) + Convert.ToDecimal(conn.dr["Amount"].ToString())) / i;
                
                TempData["MPINT"] = mpint.ToString("#,##0.00") ;
                TempData["TIntRate"] = (Convert.ToDecimal(conn.dr["Amount"].ToString()) * rate).ToString("#,##0.00");
                TempData["TAmountPay"] = ((Convert.ToDecimal(conn.dr["Amount"].ToString()) * rate) + (Convert.ToDecimal(conn.dr["Amount"].ToString()))).ToString("#,##0.00") ;
            }
            conn.connstring.Close();

            query = "select * from TblLoanTrans where MemberID='" + str + "' And LoanRecNo='" + recno + "' ";
            conn.connectsql();

            while (conn.dr.Read())
            {
                loan_trans.Add(new LoanTrans()
                {
                    amount_pay = Convert.ToDecimal(conn.dr["AmountPay"].ToString()).ToString("#,##0.00"),
                    date_pay = conn.dr["DatePay"].ToString(),
                    rec_no = conn.dr["RecNo"].ToString(),
                });
            }
            conn.connstring.Close();



            if (loan_trans.Count > 0)
            {
                conn.connstring.Close();

                query = "select Sum(AmountPay) from TblLoanTrans where MemberID='" + str + "' And LoanRecNo='" + recno + "' ";
                conn.connectsql2();
                object total = conn.cmd.ExecuteScalar();

                TempData["TPaid"] = Convert.ToDecimal(total).ToString("#,##0.00");
                conn.connstring.Close();

                TempData["Balance"] = (loan_amount - Convert.ToDecimal(total)).ToString("#,##0.00");
            }   

            return View("DisplayFund", loan_trans);
        }

        public JsonResult SearchData(string searchval)
        {

            Boolean isnumber = int.TryParse(searchval, out int n);

            if (isnumber == true)
            {
                query = "select * from TblMember where MemberID like '" + Convert.ToInt32(searchval) + "%' ";
            }
            else
            {
                query = "select * from TblMember where FName like '" + searchval + "%' ";
            }

            conn.connectsql();

            while (conn.dr.Read())
            {
                search_data.Add(new SearchData()
                {
                    member_id = conn.dr["MemberID"].ToString(),
                    member_name = conn.dr["FName"].ToString()
                });
            }

            conn.connstring.Close();

            var obj = JsonConvert.SerializeObject(search_data);

            if(search_data.Count > 0)
            {
                return Json(obj);
            }
            else
            {
                return Json("1");
            }

        }

        public JsonResult AddLoanPayment(LoanTrans data)
        {
            query = "insert into TblLoanTrans (MemberID, LoanRecNo, AmountPay, DatePay) values('" + data.member_id + "', '" + data.loanrec + "', '" + data.amount_pay + "', '" + data.date_pay + "') ";
            conn.connectsql();
            conn.connstring.Close();

            return Json("");
        }

        public JsonResult DeletePaymentRec(string memberid, string recno)
        {
            query = "delete from TblLoanTrans where MemberID='" + memberid + "' And RecNo='" + recno + "' ";
            conn.connectsql();
            conn.connstring.Close();

            return Json("");
        }

        public JsonResult LoadPaymentList(string memid, string loanrec)
        {
            query = "select * from TblLoanTrans where MemberID='" + memid + "' And LoanRecNo='" + loanrec + "' ";
            conn.connectsql();

            while (conn.dr.Read())
            {
                loan_trans.Add(new LoanTrans()
                {
                    amount_pay = Convert.ToDecimal(conn.dr["AmountPay"].ToString()).ToString("#,##0.00"),
                    date_pay = conn.dr["DatePay"].ToString(),
                    rec_no = conn.dr["RecNo"].ToString(),
                });
            }
            conn.connstring.Close();

            var obj = JsonConvert.SerializeObject(loan_trans);

            return Json(obj);
        }

        public JsonResult EditPaymentRec(LoanTrans data)
        {
            query = "update TblLoanTrans set AmountPay='" + data.amount_pay + "', DatePay='" + data.date_pay + "' where MemberID='" + data.member_id + "' And RecNo='" + data.rec_no + "'  ";
            conn.connectsql();
            conn.connstring.Close();

            return Json("Payment Successfuly Edited.");
        }

        [HttpGet]
        public IActionResult SaveApplySinking([Bind] ApplySinking sink)
        {
            query = "insert into TblFundInfo (MemberID, NoOfHeads, FundYear) Values('" + sink.mem_id + "', '" + sink.noOf_heads + "', '" + sink.year + "')";
            conn.connectsql();

            Boolean found = false;
            query = "select * from TblMember where MemberID='" + sink.mem_id + "' ";
            conn.connectsql();

            if (conn.dr.Read())
            {
                found = true;
                ViewData["MemberID"] = conn.dr["MemberID"].ToString();
                ViewData["FName"] = conn.dr["FName"].ToString();
                ViewData["ContactNo"] = conn.dr["ContactNo"].ToString();
                ViewData["Address"] = conn.dr["Address"].ToString();

                ViewData["MemberID2"] = conn.dr["MemberID"].ToString();

                if (Convert.ToInt32(conn.dr["MemberType"].ToString()) == 1)
                {
                    ViewData["MemberType"] = "Member";
                    set_memtype = 1;
                }
                else
                {
                    ViewData["MemberType"] = "None-Member";
                    set_memtype = 2;
                }

                ViewData["FundYear"] = Convert.ToInt32(sink.year);

                notfound = 1;
                pname = "MemberInfoView";
                conn.connstring.Close();
            }


            if (found == true)
            {
                if (set_memtype == 1)
                {
                    query = "select * from TblFundDeposit where MemberID='" + sink.mem_id + "' And YearFund='" + sink.year + "' ";
                    conn.connectsql();

                    if (conn.dr.Read())
                    {
                        conn.connstring.Close();

                        query = "select Sum(Amount) from TblFundDeposit where MemberID='" + sink.mem_id + "' And YearFund='" + sink.year + "' ";
                        conn.connectsql2();
                        object total = conn.cmd.ExecuteScalar();

                        ViewData["TotalDeposit"] = Convert.ToDecimal(total).ToString("#,##0.00");
                        conn.connstring.Close();
                    }
                }

                query = "select * from TblFundInfo where MemberID='" + sink.mem_id + "' And FundYear='" + sink.year + "' ";
                conn.connectsql();

                if (conn.dr.Read())
                {
                    fund_rec = true;
                    ViewData["FundRecNo"] = conn.dr["RecNo"].ToString();
                    ViewData["NoOfHeads"] = conn.dr["NoOfHeads"].ToString();
                    object noheads = conn.dr["NoOfHeads"].ToString();
                    object total = Convert.ToInt32(noheads) * 200;
                    ViewData["TAmount"] = Convert.ToDecimal(total).ToString("#,##0.00");
                }
                else
                {
                    fund_rec = false;
                }

                query = "select * from TblLoan where MemberID='" + sink.mem_id + "' And YearLoan='" + sink.year + "' ";
                conn.connectsql();

                while (conn.dr.Read())
                {
                    datalon.Add(new LoanData()
                    {
                        amount = Convert.ToDecimal(conn.dr["Amount"].ToString()).ToString("#,##0.00"),
                        loan_date = conn.dr["DateProcess"].ToString(),
                        dbrecno = conn.dr["RecNo"].ToString(),
                    });
                }
                conn.connstring.Close();


            }

            if (datalon.Count > 0)
            {
                return View(pname, datalon);
            }
            else
            {
                return View(pname);
            }
        }
    }
}
