using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;
using Sample3.Models;
using System.Net.Http.Headers;
using Sample3.Controllers;
using Microsoft.Extensions.Configuration;
using System.IO;
using System.Security.AccessControl;

namespace Sample3.Models
{
    public class ConnDB
    {
        public SqlConnection connstring;
        public SqlCommand cmd;
        public SqlDataReader dr;
        public string query;
        public int count;

        public string ConString()
        {
            var builder = new ConfigurationBuilder().SetBasePath(Directory.GetCurrentDirectory()).AddJsonFile("appsettings.json", optional: true, reloadOnChange: true);
            var config = builder.Build();
            string constring = config.GetConnectionString("MyDatabase");
            return constring;
        }

        public string GetString()
        {
            string query = HomeController.query;
            return query;
        }
        
        public void connectsql()
        {
            connstring = new SqlConnection(ConString());
            cmd = new SqlCommand(GetString(), connstring);
            connstring.Open();
            dr = cmd.ExecuteReader();
        }
        public void connectsql2()
        {
            connstring = new SqlConnection(ConString());
            cmd = new SqlCommand(GetString(), connstring);
            connstring.Open();
        }

        public DataSet GetData()
        {
            connstring = new SqlConnection(ConString());
            cmd = new SqlCommand(GetString(), connstring);
            SqlDataAdapter da = new SqlDataAdapter(cmd);
            connstring.Open();
            DataSet ds = new DataSet();
            da.Fill(ds);
            return ds;
        }
    }
}
