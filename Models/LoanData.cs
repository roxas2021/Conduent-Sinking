using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Sample3.Models
{
    public class LoanData
    {
        public string memberid { get; set; }
        public string amount { get; set; }
        public string int_rate { get; set; }
        public string no_months_pay { get; set; }
        public string pay_start { get; set; }
        public string pay_end { get; set; }
        public string loan_date { get; set; }
        public string dbrecno { get; set; }
        public string yaer_rec { get; set; }
    }
}
