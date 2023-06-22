const express = require("express");
const mysql = require("mysql");

const app = express();
const port = 5000; 

const connection = mysql.createConnection({
  host: "localhost",
  user: "figma",
  password: "figma009",
  database: "figma_employee",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
  }
  console.log("Connected to MySQL");
});

app.use(express.json());

app.post("/employees", (req, res) => {
  const { name, designation, department, roll, shift, brandSD, deviceDate, engineerName, inChargeName, items } = req.body;

  const employeeSql = "INSERT INTO employees (name, designation, department, roll, shift, brand_sd, device_date, engineer_name, in_charge_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
  connection.query(
    employeeSql,
    [name, designation, department, roll, shift, brandSD, deviceDate, engineerName, inChargeName],
    (err, emp_result) => {
      
        if (err) {
        console.error("Error in Adding details");
        res.status(500).json({ err: "Error in Adding details" });
      }

      const emp_id = emp_result.insertId;

      const itemSql = "INSERT INTO items (employee_id, item_name, unit_value, time_value) VALUES (?, ?, ?, ?)";
      items.forEach((item) => {
        const { itemName, unitValue, timeValue } = item;
        connection.query(itemSql, [emp_id, itemName, unitValue, timeValue], (err1) => {
          
            if (err1) {
            console.error("Error adding items",err1);
          }

        });
      });

      res.status(201).json({ message: "Employees details added successfully" });
    }
  );
});

app.get("/employees", (req, res) => {
 
  const sql = "SELECT * FROM employees";
  connection.query(sql, (err, results) => {
   
    if (err) {
      res.status(500).json({ err: "Failed to retrieve employees" });
    }

    res.status(200).json(results);
  });
});

app.get("/employees/:department", (req, res) => {

  const department = req.params.department;
  const sql = "SELECT * FROM employees WHERE department = ?";
  connection.query(sql, [department], (err, results) => {
    
    if (err) {
      res.status(500).json({ error: "Failed to retrieve employees by department" });
    }

    res.json(results);
  });
});

app.listen(port, () => {
  console.log(`Server Established on port ${port}`);
});
