const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const mysql = require("mysql2");
const https = require("https"); // Import the https module
const fs = require("fs"); // Import the fs module
const server = express();
const cors = require("cors");

const bcrypt = require('bcrypt');

// Load SSL/TLS certificate and key
const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/ccjeflabsolutions.online/privkey.pem'), // Replace '/path/to/private.key' with the path to your private key file
  cert: fs.readFileSync('/etc/letsencrypt/live/ccjeflabsolutions.online/fullchain.pem'), // Replace '/path/to/certificate.crt' with the path to your certificate file
  secureProtocol: 'TLSv1_2_method',
  ciphers: 'ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384',

};

// Create HTTPS server with SSL/TLS configuration
const httpsServer = https.createServer(options, server);

// Middleware to enable CORS
server.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow requests from any origin
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Allow specific HTTP methods
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specific headers
  next();
});

const allowedOrigins = ['https://ccjeflabsolutions.online'];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

server.use(cors(corsOptions));

server.use("/", router);

const path = require("path");
const nodemailer = require("nodemailer");

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

const pool = mysql.createPool({
  host: "153.92.15.7",
  user: "u212454050_invetoryDB",
  password: "Ccjeflabsolutions24",
  database: "u212454050_inventoryDB",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('Connected to database');
    connection.release();
  }
});

// -----------------------------------------
// EMAIL FUNCTION

server.post("/send-email", (req, res) => {
  const { content } = req.body;

  // Create a transporter using nodemailer
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    service: "gmail",
    auth: {
      user: "labsolutionsccjef@gmail.com",
      pass: "jqro oblg gkme qfdx",
    },
  });

  // Define the email options
  const mailOptions = {
    from: "labsolutionsccjef@gmail.com",
    to: "allenbumanlag@gmail.com",
    subject: "Consumables Status Alert",
    text: content,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.status(500).send("Error sending email");
    } else {
      console.log("Email sent:", info.response);
      res.status(200).send("Email sent successfully");
    }
  });
});





//---------------------------------------------------------------------------------------
// -------------------------------- API FOR USERS ----------------------------------

server.get("/api/users", async (req, res) => {
  try {
    // Set the Content-Type header to application/json
    res.setHeader("Content-Type", "application/json");

    // Your SQL query
    var sql = "SELECT * FROM tblaccount";

    // Execute the SQL query
    pool.query(sql, function (error, result) {
      if (error) {
        console.log("Error executing SQL query:", error);
        // If there's an error, send an error response
        res.status(500).json({ status: false, error: "Error executing SQL query" });
      } else {
        // Send the query result as JSON
        res.json(result);
      }
    });
  } catch (error) {
    // If there's an error, send an error response
    console.log("Error connecting to DB:", error);
    res.status(500).json({ status: false, error: "Error connecting to DB" });
  }
});

//SEARCH USERS BASED ON COURSE ID
server.get("/api/users/:id", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  var AccountID = req.params.id;
  var sql = "SELECT * FROM tblaccount WHERE AccountID=" + AccountID;
  pool.query(sql, function (error, result) {
    if (error) {
      console.log("Error Connecting to DB");
    } else {
      res.json({ status: true, data: result });
    }
  });
});

server.get("/api/users/check/:studentNum", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  var studentNum = req.params.studentNum;
  var sql = "SELECT * FROM tblaccount WHERE StudentNum='" + studentNum + "'";
  pool.query(sql, function (error, result) {
    if (error) {
      console.log("Error Checking Student Number");
      res
        .status(500)
        .json({ status: false, message: "Error checking student number" });
    } else {
      if (result.length > 0) {
        res.json({ status: true, isRegistered: true });
      } else {
        res.json({ status: true, isRegistered: false });
      }
    }
  });
});

server.get("/api/users/search/:studentNum", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  var studentNum = req.params.studentNum;
  var sql = "SELECT * FROM tblaccount WHERE StudentNum='" + studentNum + "'";
  pool.query(sql, function (error, result) {
    if (error) {
      console.log("Error Searching Student Number:", error);
      res.status(500).json({ status: false, message: "Error searching student number" });
    } else {
      if (result.length > 0) {
        res.json({ status: true, user: result[0] });
      } else {
        res.status(404).json({ status: false, message: "User not found" });
      }
    }
  });
});


//ADD USERS
server.post("/api/users/add", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  let details = {
    UserName: req.body.UserName,
    Password: req.body.Password,
    LastName: req.body.LastName,
    FirstName: req.body.FirstName,
    Birthdate: req.body.Birthdate,
    StudentNum: req.body.StudentNum,
    isActive: req.body.isActive,
    isActive: 0,
    AccessLevelID: 1,
  };
  let sql = "INSERT INTO tblaccount SET ?";
  pool.query(sql, details, (error) => {
    if (error) {
      console.error("Error creating user:", error);
      res.send({ status: false, message: "User Created Failed!" });
    } else {
      res.send({ status: true, message: "User Created Successfully!" });
    }
  });
});
// UPDATE USERS
server.put("/api/users/update/:id", (req, res) => {
  res.setHeader("Content-Type", "application/json");
   let sql = 
    "UPDATE tblaccount SET LastName='" +
    req.body.LastName + 
    "', FirstName='" +
    req.body.FirstName +
    "', Birthdate='" +
    req.body.Birthdate +
    "', StudentNum='" +
    req.body.StudentNum +
    "', isActive='" +
    req.body.isActive +
    "', StudentNum='" +
    req.body.StudentNum +
    "', UserName='" +
    req.body.UserName +
    "', Password='" +
    req.body.Password +
    "', AccessLevelID='" +
    req.body.AccessLevelID +
    "' WHERE AccountID=" +
    req.params.id;

  pool.query(sql, (error) => {
    if (error) {
      console.error("Error updating user:", error);
      res.send({ status: false, message: "User Update Failed!" });
    } else {
      res.send({ status: true, message: "User Updated Successfully!" });
    }
  });
});
// DELETE USERS
server.delete("/api/users/delete/:id", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  var id = req.params.id;
  let sql = "DELETE FROM tblaccount WHERE AccountID=" + id;
  pool.query(sql, (error) => {
    if (error) {
      console.error("Error deleting user:", error);
      res.send({ status: false, message: "User Deletion Failed!" });
    } else {
      res.send({ status: true, message: "User Deleted Successfully!" });
    }
  });
});

server.post("/api/login", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  try {
    const { UserName, Password } = req.body;

    // Check if both username and password are provided
    if (!UserName || !Password) {
      return res.status(400).json({ status: false, message: "Username and password are required." });
    }

    // Retrieve user from the database based on the provided username
    const sql = "SELECT * FROM tblaccount WHERE UserName = ?";
    pool.query(sql, [UserName], async (error, results) => {
      if (error) {
        console.error("Error retrieving user:", error);
        return res.status(500).json({ status: false, message: "Error retrieving user." });
      }

      // If user with provided username doesn't exist
      if (results.length === 0) {
        return res.status(401).json({ status: false, message: "Invalid username or password." });
      }

      // Retrieve the user's data
      const user = results[0];

      // Compare the provided password with the password from the database
      if (Password !== user.Password) {
        return res.status(401).json({ status: false, message: "Invalid username or password." });
      }

      // If username and password are correct, send a success response
      res.json({ status: true, message: "Login successful.", user: user });
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ status: false, message: "Error logging in." });
  }
});


// -----------------------------

//------------------------------------------- API FOR COURSES ------------------------------------------------
server.get("/api/courses", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool', err);
      res.status(500).json({ status: false, message: 'Internal server error' });
      return;
    }
    connection.query("SELECT * FROM tblcourses", (error, result) => {
      connection.release();
      if (error) {
        console.error("Error executing query", error);
        res.status(500).json({ status: false, message: 'Internal server error' });
        return;
      }
      res.json({ status: true, data: result });
    });
  });
});

server.post("/api/courses/add", (req, res) => {
  let details = {
    CourseCode: req.body.CourseCode,
    CourseName: req.body.CourseName,
  };
  pool.query("INSERT INTO tblcourses SET ?", details, (error) => {
    if (error) {
      res.status(500).json({ status: false, message: "Course Created Failed!" });
    } else {
      res.json({ status: true, message: "Course Created Successfully!" });
    }
  });
});

server.get("/api/courses/:id", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool', err);
      res.status(500).json({ status: false, message: 'Internal server error' });
      return;
    }
    var CourseID = req.params.id;
    connection.query("SELECT * FROM tblcourses WHERE CourseID=?", CourseID, (error, result) => {
      connection.release();
      if (error) {
        console.error("Error executing query", error);
        res.status(500).json({ status: false, message: 'Internal server error' });
        return;
      }
      res.json({ status: true, data: result });
    });
  });
});

server.put("/api/courses/update/:id", (req, res) => {
  let sql =
    "UPDATE tblcourses SET CourseCode=?, CourseName=? WHERE CourseID=?";
  let values = [
    req.body.CourseCode,
    req.body.CourseName,
    req.params.id
  ];
  pool.query(sql, values, (error, result) => {
    if (error) {
      console.error("Error updating course:", error);
      res.status(500).json({ status: false, message: "Course Update Failed!" });
    } else {
      res.json({ status: true, message: "Course Update Success!" });
    }
  });
});

server.delete("/api/courses/delete/:id", (req, res) => {
  let sql = "DELETE FROM tblcourses where CourseID=?";
  let values = [req.params.id];
  pool.query(sql, values, (error) => {
    if (error) {
      res.status(500).json({ status: false, message: "Record Delete Failed!" });
    } else {
      res.json({ status: true, message: "Record Deleted Successfully!" });
    }
  });
});

//---------------------------------------------------------------------------------------
// -------------------------------- API FOR EQUIPMENT ----------------------------------

server.get("/api/equipments", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool', err);
      res.status(500).json({ status: false, message: 'Internal server error' });
      return;
    }
    connection.query("SELECT * FROM tblequipment", (error, result) => {
      connection.release();
      if (error) {
        console.error("Error executing query", error);
        res.status(500).json({ status: false, message: 'Internal server error' });
        return;
      }
      res.json({ status: true, data: result });
    });
  });
});

server.post("/api/equipments/add", (req, res) => {
  let details = {
    EquipmentName: req.body.EquipmentName,
    Quantity: req.body.Quantity,
    CourseID: req.body.CourseID,
    CalibrationSchedule: req.body.CalibrationSchedule || null,
  };
  pool.query("INSERT INTO tblequipment SET ?", details, (error) => {
    if (error) {
      res.status(500).json({ status: false, message: "Equipment Created Failed!" });
    } else {
      res.json({ status: true, message: "Equipment Created Successfully!" });
    }
  });
});

server.get("/api/equipments/:id", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool', err);
      res.status(500).json({ status: false, message: 'Internal server error' });
      return;
    }
    var CourseID = req.params.id;
    connection.query("SELECT * FROM tblequipment WHERE CourseID=?", CourseID, (error, result) => {
      connection.release();
      if (error) {
        console.error("Error executing query", error);
        res.status(500).json({ status: false, message: 'Internal server error' });
        return;
      }
      res.json({ status: true, data: result });
    });
  });
});

server.put("/api/equipments/update/:id", (req, res) => {
  let sql =
    "UPDATE tblequipment SET EquipmentName=?, Quantity=?, CourseID=?, CalibrationSchedule=? WHERE EquipmentID=?";
  let values = [
    req.body.EquipmentName,
    req.body.Quantity,
    req.body.CourseID,
    req.body.CalibrationSchedule || null,
    req.params.id
  ];
  pool.query(sql, values, (error, result) => {
    if (error) {
      console.error("Error updating equipment:", error);
      res.status(500).json({ status: false, message: "Equipment Update Failed!" });
    } else {
      res.json({ status: true, message: "Equipment Update Success!" });
    }
  });
});

server.delete("/api/equipments/delete/:id", (req, res) => {
  let sql = "DELETE FROM tblequipment where EquipmentID=?";
  let values = [req.params.id];
  pool.query(sql, values, (error) => {
    if (error) {
      res.status(500).json({ status: false, message: "Record Delete Failed!" });
    } else {
      res.json({ status: true, message: "Record Deleted Successfully!" });
    }
  });
});
//---------------------------------------------------------------------------------------
// -------------------------------- API FOR CONSUMABLES ----------------------------------

server.get("/api/consumables", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool', err);
      res.status(500).json({ status: false, message: 'Internal server error' });
      return;
    }
    connection.query("SELECT * FROM tblconsumable", (error, result) => {
      connection.release();
      if (error) {
        console.error("Error executing query", error);
        res.status(500).json({ status: false, message: 'Internal server error' });
        return;
      }
      res.json({ status: true, data: result });
    });
  });
});

server.post("/api/consumables/add", (req, res) => {
  let details = {
    ConsumableName: req.body.ConsumableName,
    Quantity: req.body.Quantity,
    CourseID: req.body.CourseID,
    ExpirationDate: req.body.ExpirationDate || null,
  };
  pool.query("INSERT INTO tblconsumable SET ?", details, (error) => {
    if (error) {
      res.status(500).json({ status: false, message: "Consumable Created Failed!" });
    } else {
      res.json({ status: true, message: "Consumable Created Successfully!" });
    }
  });
});

server.get("/api/consumables/:id", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool', err);
      res.status(500).json({ status: false, message: 'Internal server error' });
      return;
    }
    var CourseID = req.params.id;
    connection.query("SELECT * FROM tblconsumable WHERE CourseID=?", CourseID, (error, result) => {
      connection.release();
      if (error) {
        console.error("Error executing query", error);
        res.status(500).json({ status: false, message: 'Internal server error' });
        return;
      }
      res.json({ status: true, data: result });
    });
  });
});

server.put("/api/consumables/update/:id", (req, res) => {
  let sql =
    "UPDATE tblconsumable SET ConsumableName=?, Quantity=?, CourseID=?, ExpirationDate=? WHERE ConsumableID=?";
  let values = [
    req.body.ConsumableName,
    req.body.Quantity,
    req.body.CourseID,
    req.body.ExpirationDate || null,
    req.params.id
  ];
  pool.query(sql, values, (error, result) => {
    if (error) {
      console.error("Error updating consumable:", error);
      res.status(500).json({ status: false, message: "Consumable Update Failed!" });
    } else {
      res.json({ status: true, message: "Consumable Update Success!" });
    }
  });
});

server.delete("/api/consumables/delete/:id", (req, res) => {
  let sql = "DELETE FROM tblconsumable where ConsumableID=?";
  let values = [req.params.id];
  pool.query(sql, values, (error) => {
    if (error) {
      res.status(500).json({ status: false, message: "Record Delete Failed!" });
    } else {
      res.json({ status: true, message: "Record Deleted Successfully!" });
    }
  });
});

//---------------------------------------------------------------------------------------
// -------------------------------- API FOR EQUIPMENT TRANSACTIONS ----------------------------------

server.get("/api/equipmentTrans", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool', err);
      res.status(500).json({ status: false, message: 'Internal server error' });
      return;
    }
    connection.query("SELECT * FROM tbltransactionequipment", (error, result) => {
      connection.release();
      if (error) {
        console.error("Error executing query", error);
        res.status(500).json({ status: false, message: 'Internal server error' });
        return;
      }
      res.json({ status: true, data: result });
    });
  });
});

server.post("/api/equipmentTrans/add", (req, res) => {
  let details = {
    TransactionEquipID: req.body.TransactionEquipID,
    CourseID: req.body.CourseID,
    EquipmentID: req.body.EquipmentID,
    AccountID: req.body.AccountID,
    Quantity: req.body.Quantity,
    DateCreated: req.body.DateCreated,
    DateReturned: req.body.DateReturned,
    DueDate: req.body.DueDate
  };
  pool.query("INSERT INTO tbltransactionequipment SET ?", details, (error) => {
    if (error) {
      res.status(500).json({ status: false, message: "Transaction Creation Failed!" });
    } else {
      res.json({ status: true, message: "Transaction Created Successfully!" });
    }
  });
});

server.put("/api/equipmentTrans/update/:id", (req, res) => {
  let sql =
    "UPDATE tbltransactionequipment SET CourseID=?, EquipmentID=?, AccountID=?, Quantity=?, DateCreated=?, DateReturned=?, DueDate=? WHERE TransactionEquipID=?";
  let values = [
    req.body.CourseID,
    req.body.EquipmentID,
    req.body.AccountID,
    req.body.Quantity,
    req.body.DateCreated,
    req.body.DateReturned,
    req.body.DueDate,
    req.params.id
  ];
  pool.query(sql, values, (error, result) => {
    if (error) {
      console.error("Error updating transaction:", error);
      res.status(500).json({ status: false, message: "Transaction Update Failed!" });
    } else {
      res.json({ status: true, message: "Transaction Update Success!" });
    }
  });
});

server.delete("/api/equipmentTrans/delete/:id", (req, res) => {
  let sql = "DELETE FROM tbltransactionequipment where TransactionEquipID=?";
  let values = [req.params.id];
  pool.query(sql, values, (error) => {
    if (error) {
      res.status(500).json({ status: false, message: "Transaction Delete Failed!" });
    } else {
      res.json({ status: true, message: "Transaction Deleted Successfully!" });
    }
  });
});
//---------------------------------------------------------------------------------------
// -------------------------------- API FOR CONSUMABLE TRANSACTIONS ----------------------------------

server.get("/api/consumableTrans", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool', err);
      res.status(500).json({ status: false, message: 'Internal server error' });
      return;
    }
    connection.query("SELECT * FROM tbltransactionconsumable", (error, result) => {
      connection.release();
      if (error) {
        console.error("Error executing query", error);
        res.status(500).json({ status: false, message: 'Internal server error' });
        return;
      }
      res.json({ status: true, data: result });
    });
  });
});

server.post("/api/consumableTrans/add", (req, res) => {
  let details = {
    TransactionConsumeID: req.body.TransactionConsumeID,
    CourseID: req.body.CourseID,
    ConsumableID: req.body.ConsumableID,
    AccountID: req.body.AccountID,
    Quantity: req.body.Quantity,
    DateCreated: req.body.DateCreated,
    DateReturned: req.body.DateReturned,
  };
  pool.query("INSERT INTO tbltransactionconsumable SET ?", details, (error) => {
    if (error) {
      res.status(500).json({ status: false, message: "Transaction Creation Failed!" });
    } else {
      res.json({ status: true, message: "Transaction Created Successfully!" });
    }
  });
});

server.put("/api/consumableTrans/update/:id", (req, res) => {
  let sql =
    "UPDATE tbltransactionconsumable SET CourseID=?, ConsumableID=?, AccountID=?, Quantity=?, DateCreated=?, DateReturned=? WHERE TransactionConsumeID=?";
  let values = [
    req.body.CourseID,
    req.body.ConsumableID,
    req.body.AccountID,
    req.body.Quantity,
    req.body.DateCreated,
    req.body.DateReturned,
    req.params.id
  ];
  pool.query(sql, values, (error, result) => {
    if (error) {
      console.error("Error updating transaction:", error);
      res.status(500).json({ status: false, message: "Transaction Update Failed!" });
    } else {
      res.json({ status: true, message: "Transaction Update Success!" });
    }
  });
});

server.delete("/api/consumableTrans/delete/:id", (req, res) => {
  let sql = "DELETE FROM tbltransactionconsumable where TransactionConsumeID=?";
  let values = [req.params.id];
  pool.query(sql, values, (error) => {
    if (error) {
      res.status(500).json({ status: false, message: "Transaction Delete Failed!" });
    } else {
      res.json({ status: true, message: "Transaction Deleted Successfully!" });
    }
  });
});

//---------------------------------------------------------------------------------------
// -------------------------------- API FOR FACILITIES/ROOMS ----------------------------------

server.get("/api/room", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool', err);
      res.status(500).json({ status: false, message: 'Internal server error' });
      return;
    }
    connection.query("SELECT * FROM tblrooms", (error, result) => {
      connection.release();
      if (error) {
        console.error("Error executing query", error);
        res.status(500).json({ status: false, message: 'Internal server error' });
        return;
      }
      res.json({ status: true, data: result });
    });
  });
});

server.post("/api/room/add", (req, res) => {
  let details = {
    RoomID: req.body.RoomID,
    RoomName: req.body.RoomName,
    RoomDesc: req.body.RoomDesc,
  };
  pool.query("INSERT INTO tblrooms SET ?", details, (error) => {
    if (error) {
      res.status(500).json({ status: false, message: "Facility Created Failed!" });
    } else {
      res.json({ status: true, message: "Facility Created Successfully!" });
    }
  });
});

server.get("/api/room/:id", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool', err);
      res.status(500).json({ status: false, message: 'Internal server error' });
      return;
    }
    var RoomID = req.params.id;
    connection.query("SELECT * FROM tblrooms WHERE RoomID=?", RoomID, (error, result) => {
      connection.release();
      if (error) {
        console.error("Error executing query", error);
        res.status(500).json({ status: false, message: 'Internal server error' });
        return;
      }
      res.json({ status: true, data: result });
    });
  });
});

server.put("/api/room/update/:id", (req, res) => {
  let sql =
    "UPDATE tblrooms SET RoomName=?, RoomDesc=?, RoomStatus=? WHERE RoomID=?";
  let values = [
    req.body.RoomName,
    req.body.RoomDesc,
    req.body.RoomStatus,
    req.params.id
  ];
  pool.query(sql, values, (error, result) => {
    if (error) {
      console.error("Error updating facility:", error);
      res.status(500).json({ status: false, message: "Facility Update Failed!" });
    } else {
      res.json({ status: true, message: "Facility Update Success!" });
    }
  });
});

server.delete("/api/room/delete/:id", (req, res) => {
  let sql = "DELETE FROM tblrooms where RoomID=?";
  let values = [req.params.id];
  pool.query(sql, values, (error) => {
    if (error) {
      res.status(500).json({ status: false, message: "Facility Delete Failed!" });
    } else {
      res.json({ status: true, message: "Facility Deleted Successfully!" });
    }
  });
});

//---------------------------------------------------------------------------------------
// -------------------------------- API FOR ACCESS LEVEL ----------------------------------

server.get("/api/access", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool', err);
      res.status(500).json({ status: false, message: 'Internal server error' });
      return;
    }
    connection.query("SELECT * FROM tblaccesslevel", (error, result) => {
      connection.release();
      if (error) {
        console.error("Error executing query", error);
        res.status(500).json({ status: false, message: 'Internal server error' });
        return;
      }
      res.json({ status: true, data: result });
    });
  });
});

server.post("/api/access/add", (req, res) => {
  let details = {
    AccessLevelID: req.body.AccessLevelID,
    AccessName: req.body.AccessName,
  };
  pool.query("INSERT INTO tblaccesslevel SET ?", details, (error) => {
    if (error) {
      res.status(500).json({ status: false, message: "Access Created Failed!" });
    } else {
      res.json({ status: true, message: "Access Created Successfully!" });
    }
  });
});

server.get("/api/access/:id", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool', err);
      res.status(500).json({ status: false, message: 'Internal server error' });
      return;
    }
    var AccessLevelID = req.params.id;
    connection.query("SELECT * FROM tblaccesslevel WHERE AccessLevelID=?", AccessLevelID, (error, result) => {
      connection.release();
      if (error) {
        console.error("Error executing query", error);
        res.status(500).json({ status: false, message: 'Internal server error' });
        return;
      }
      res.json({ status: true, data: result });
    });
  });
});

server.put("/api/access/update/:id", (req, res) => {
  let sql =
    "UPDATE tblaccesslevel SET AccessName=? WHERE AccessLevelID=?";
  let values = [
    req.body.AccessName,
    req.params.id
  ];
  pool.query(sql, values, (error, result) => {
    if (error) {
      console.error("Error updating access:", error);
      res.status(500).json({ status: false, message: "Access Update Failed!" });
    } else {
      res.json({ status: true, message: "Access Update Success!" });
    }
  });
});

server.delete("/api/access/delete/:id", (req, res) => {
  let sql = "DELETE FROM tblaccesslevel where AccessLevelID=?";
  let values = [req.params.id];
  pool.query(sql, values, (error) => {
    if (error) {
      res.status(500).json({ status: false, message: "Access Delete Failed!" });
    } else {
      res.json({ status: true, message: "Access Deleted Successfully!" });
    }
  });
});

//---------------------------------------------------------------------------------------
// -------------------------------- ESTABLISHING SERVER PORT ----------------------------------

// Establish the Port
const PORT_HTTPS = process.env.PORT_HTTPS || 3000; // Use the environment port or 443 if not available
httpsServer.listen(PORT_HTTPS, () => {
  console.log(`HTTPS Server is running on port ${PORT_HTTPS}`);
});
// Serve the static files from the Angular app
server.use(express.static(path.join(__dirname, "dist", "client")));

// Handle all other routes and return the Angular app
server.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "client", "/login/index.html"));
});