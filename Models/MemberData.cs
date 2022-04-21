using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace Sample3.Models
{
    public class MemberData
    {
        //--Table Member--//
        public string memberid { get; set; }
        public string FName { get; set; }
        public string ContactNo { get; set; }
        public string Address { get; set; }
        public string member_type { get; set; }

        //--Fund Deposit Table--//
        public string memberid_dep { get; set; }
        public string amount { get; set; }
        public string datedeposit { get; set; }
        public string yearfund { get; set; }
        public string new_depdate { get; set; }
        public string rec_no { get; set; }
    }
}   
