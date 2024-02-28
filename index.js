import express, { json } from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import passport from "passport";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// import Key from "./config/key.js";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
// import Attendance from './models/attendance.js';/
import EmployeeUpload from "./models/excelUpload.js";
import { read, utils } from "xlsx";
// import Employee from './models/excelUpload.js';
import nodemailer from "nodemailer";
import crypto from "crypto";
import loginValidate from "./validation/login.js";
import registerValidate from "./validation/register.js";
import LastLogin from "./models/LastLogin.js";
import User from "./models/user.model.js";
import Employee from "./models/excelUpload.js";
import Analyst from "./models/analyst.model.js";
import Billing from "./models/billing.model.js";
import Attendance from "./models/attendance.model.js";
import cron from "node-cron";
import Task from "./models/task.model.js";
import Manager from "./models/addmanager.model.js";
import Team from "./models/addteam.model.js";
import Status from "./models/status.model.js";
import AddTeam from "./models/addteam.model.js";
// import moment from 'moment';
import passportJwt from "passport-jwt";
import Key from "./config/key.js";
import jwtStrategy from "passport-jwt";
import extractJwt from "passport-jwt";
import moment from "moment";
// import awsServerlessExpressMiddleware from 'aws-serverless-express/middleware.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: "5000mb" })); // adjust the limit as needed
app.use(cookieParser());
app.use(express.urlencoded({ limit: "5000mb", extended: false })); // adjust the limit as needed

app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
// LAMBDA_INITIAL = ""
// // comment when using local, Only for lambda
// app.use((req, res, next) => {
//   // removing stage from url so that it can match to express route
//   const inputString = req.url;
//   const parts = inputString.split('/').filter(Boolean);
//   parts.shift();
//   console.log(parts)
//   const resultString = `/${parts.join('/')}`;
//   console.log("resultString", resultString)
//   req.url = resultString;
//   next()
// })

const API_GATEWAY_INITIALS = "/test/Emp";
app.use((req, res, next) => {
  req.url = req.url.replace(API_GATEWAY_INITIALS, "");
  next();
});

// app.use(awsServerlessExpressMiddleware.eventContext())

// // Applying middleware for api gateway
// app.use((req, res, next) => {
//   console.log(req?.apiGateway?.event)
//   let proxy_path = req?.apiGateway?.event?.pathParameters?.proxy
//   let request_method = req?.apiGateway?.event?.requestContext?.http?.method
//   let request_headers = req?.apiGateway?.event?.headers
//   let query_params = req?.apiGateway?.event?.queryStringParameters
//   console.log(proxy_path,"proxy_path......", request_method)
//   if (proxy_path){
//     req.url = "/"+proxy_path;
//   }
//   if(request_method){
//     req.method = request_method;
//   }
//   if(request_headers){
//     Object.assign(req.headers, request_headers);
//   }
//   if(query_params){
//     Object.assign(req.query, query_params);
//   }
//   if (req.method === 'OPTIONS') {
//     // Set CORS headers
//     res.header('Access-Control-Allow-Origin', '*'); // Replace '*' with your allowed origin
//     res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//     res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

//     // Respond to the OPTIONS request
//     res.status(200).send();
//   } else {
//     next();
//   }
// });
dotenv.config();

const HOST = process.env.SMTP_HOST || "email-smtp.us-east-1.amazonaws.com";
const PORT = process.env.SMTP_PORT || 587;
const USER = process.env.SMTP_USER || "AKIATUPT4BZDUGEXYTWY";
const PASS = process.env.SMTP_PASS || "BGeW6eUx3pr6no+h+frO9mhe5iIPm2R0w/Fxlyv/oAV7";

await mongoose.connect(
  process.env.ATLAS_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) throw err;
    console.log("Connected to MongoDB Atlas !!!");
  }
);

const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: Key.key, // Replace with your actual secret key
};

passport.use(
  new JwtStrategy(options, (jwtPayload, done) => {
    // Check if the user exists in the database based on jwtPayload
    // You can query your database to get user details using jwtPayload.sub (user id)

    // Example:
    User.findById(jwtPayload.sub)
      .then((user) => {
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      })
      .catch((err) => done(err, false));
  })
);
const authenticateToken = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!user) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Attach the user object to the request
    req.user = user;
    next();
  })(req, res, next);
};

// user.js route

const determineRoleFromDesignation = (designation) => {
  // Your logic to determine the role based on the designation
  // For example, if designation is "DEV", return "admin"
  // If designation is "SUPERADMIN", return "superadmin"
  // Otherwise, return "analyst"

  const adminDesignations = ["PROJECT MANAGER"];
  const superAdminDesignation = "SUPERADMIN";

  if (adminDesignations.includes(designation.toUpperCase())) {
    return "admin";
  } else if (designation.toUpperCase() === superAdminDesignation) {
    return "superadmin";
  } else {
    return "analyst";
  }
};

app.post("/register", async (req, res) => {
  try {
    const { errors, isValid } = registerValidate(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    // Check if the email already exists in the user database
    const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser) {
      return res.status(400).json({ emailAlready: "Email already registered" });
    }

    // Check if the email exists in the employee database
    const existingEmployee = await Employee.findOne({
      email_id: req.body.email,
    });

    if (!existingEmployee) {
      return res
        .status(400)
        .json({ emailNotFound: "Email not found in employee database" });
    }

    // Determine the role based on the employee's designation
    const role = determineRoleFromDesignation(existingEmployee.designation);

    // Proceed with user registration
    const newUser = new User({
      name: req.body.name,
      empId: req.body.empId,
      role: role,
      email: req.body.email,
      password: req.body.password,
    });

    // Hash the password before saving it to the database
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, async (err, hash) => {
        if (err) {
          console.log(err);
          throw err;
        }
        newUser.password = hash;

        // Save the new user to the user database
        try {
          const savedUser = await newUser.save();
          res.json(savedUser);
        } catch (error) {
          console.log(error);
          res.status(500).json({ message: "Internal server error" });
        }
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get('/getEmployeeDetails/:empId', async (req, res) => {
  try {
    const empId = req.params.empId;
    const employee = await Employee.findOne({ emp_id: empId });
 
    if (employee) {
      res.json({
        emp_name: employee.emp_name,
        email_id: employee.email_id,
      });
    } else {
      res.status(404).json({ message: 'Employee not found' });
    }
  } catch (error) {
    console.error('Error fetching employee details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
//   const LastLogin = require('../models/LastLogin');

app.post("/login", async (req, res) => {
  try {
    const { errors, isValid } = loginValidate(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    // Check if it's the superadmin login
    if (
      email === "superadmin@objectways.com" &&
      password === "superadmin@123"
    ) {
      const payload = {
        id: "superadmin", // You can use a unique identifier for the superadmin
        name: "Super Admin",
        email: "superadmin@objectways.com",
        empId: "superadmin",
        role: "superadmin",
      };

      jwt.sign(
        payload,
        Key.key,
        {
          expiresIn: 900,
        },
        (err, token) => {
          console.log("Backend Token:", token); // Log the token
          res.cookie("token", token, { httpOnly: true, secure: true }); // Set the token in a cookie
          res.json({
            success: true,
            token: "Bearer " + token,
          });
        }
      );
    } else {
      // If it's not a superadmin login, proceed with the existing logic
      const existingEmployee = await Employee.findOne({ email_id: email });

      if (!existingEmployee) {
        return res
          .status(400)
          .json({ emailNotFound: "Email not found in Employee database" });
      }

      User.findOne({ email }).then((user) => {
        if (!user) {
          return res.status(404).json({ emailNotFound: "Email Not Found" });
        }

        const role = determineRoleFromDesignation(existingEmployee.designation);

        bcrypt.compare(password, user.password).then(async (isMatch) => {
          if (isMatch) {
            try {
              const lastLogin = new LastLogin({
                userId: user._id,
                loginTime: new Date(),
              });

              await lastLogin.save();

              user.lastLogin = lastLogin._id;

              await user.save();

              const payload = {
                id: user.id,
                name: user.name,
                email: user.email,
                empId: user.empId,
                role: role,
              };

              jwt.sign(
                payload,
                Key.key,
                {
                  expiresIn: 900,
                },
                (err, token) => {
                  console.log("Backend Token:", token); // Log the token
                  res.cookie("token", token, { httpOnly: true, secure: true }); // Set the token in a cookie
                  res.json({
                    success: true,
                    token: "Bearer " + token,
                  });
                }
              );
            } catch (error) {
              console.error(error);
              res.status(500).json({ message: "Internal server error" });
            }
          } else {
            return res
              .status(400)
              .json({ passwordIncorrect: "Password is Incorrect" });
          }
        });
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/users", (req, res) => {
  User.find({}, "name")
    .sort([["name", 1]])
    .then((user) => res.json(user))
    .catch((err) => res.status(400).json("Error:" + err));
});
app.get("/all", (req, res) => {
  User.find({}, "empId")
    .then((user) => res.json(user))
    .catch((err) => res.status(400).json("Error:" + err));
});

app.get("/last-login", async (req, res) => {
  try {
    const lastLogins = await LastLogin.find().populate("userId", "name email"); // Assuming you have a reference to the user in LastLogin model

    res.json(lastLogins);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/authentication/user/forget", (req, res) => {
  const { email } = req.body;
  var transporter = nodemailer.createTransport({
    host: HOST,
    port: PORT,
    auth: {
      user: USER,
      pass: PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
    }
    const token = buffer.toString("hex");
    User.findOne({ email }).then((user) => {
      if (!user) {
        return res.status(404).json("User Not Found in the Database");
      }
      user.resetToken = token;
      user.expireToken = Date.now() + 300000;
      user
        .save()
        .then(() => {
          transporter.sendMail({
            to: user.email,
            from: "Team Developers <coder@objectways.com>",
            subject: "Password Reset Request 🔑",
            html: `
                        <div class="es-wrapper-color">
            <!--[if gte mso 9]>
                <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
                    <v:fill type="tile" color="#07023c"></v:fill>
                </v:background>
            <![endif]-->
            <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0">
                <tbody>
                    <tr>
                        <td class="esd-email-paddings" valign="top">
                            <table class="es-content esd-header-popover" cellspacing="0" cellpadding="0" align="center">
                                <tbody>
                                    <tr>
                                        <td class="esd-stripe" align="center">
                                            <table class="es-content-body" style="background-color: #ffffff; background-image: url(https://tlr.stripocdn.email/content/guids/CABINET_0e8fbb6adcc56c06fbd3358455fdeb41/images/vector_0Ia.png); background-repeat: no-repeat; background-position: center center;" width="600" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" background="https://tlr.stripocdn.email/content/guids/CABINET_0e8fbb6adcc56c06fbd3358455fdeb41/images/vector_0Ia.png">
                                                <tbody>
                                                    <tr>
                                                        <td class="esd-structure es-p20t es-p10b es-p20r es-p20l" align="left">
                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                <tbody>
                                                                    <tr>
                                                                        <td width="560" class="es-m-p0r esd-container-frame" align="top" align="center">
                                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td align="center" class="esd-block-image" style="font-size: 0px;"><img src="https://demo.stripocdn.email/content/guids/1666ada9-0df7-4d86-bab9-abd9cfb40541/images/objectways1.png" alt="Logo" style="display: block;" title="Logo" height="55"></td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td class="esd-structure es-p30t es-p30b es-p20r es-p20l" align="left">
                                                            <table width="100%" cellspacing="0" cellpadding="0">
                                                                <tbody>
                                                                    <tr>
                                                                        <td class="es-m-p0r es-m-p20b esd-container-frame" width="560" align="top" align="center">
                                                                            <table width="100%" cellspacing="0" cellpadding="0">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td align="center" class="esd-block-text">
                                                                                            <h1>&nbsp;We got a request to reset your&nbsp;password</h1>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td align="center" class="esd-block-image es-p15t es-p10b" style="font-size: 0px;"><img class="adapt-img" src="https://tlr.stripocdn.email/content/guids/CABINET_dee64413d6f071746857ca8c0f13d696/images/852converted_1x3.png" alt style="display: block;" height="300"></td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td align="center" class="esd-block-text es-p10t es-p10b">
                                                                                            <p>&nbsp;Forgot your password? No problem - it happens to everyone!</p>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td align="center" class="esd-block-button es-p15t es-p15b" style="padding: 0;margin: 0;padding-top: 15px;padding-bottom: 15px;" ><span class="es-button-border" style="border-style: solid solid solid solid;border-color: #26C6DA #26C6DA #26C6DA #26C6DA;background: #26C6DA;border-width: 4px 4px 4px 4px;display: inline-block;border-radius: 10px;width: auto;"><a href="https://www.pmt.objectways.com/authentication/reset/${token}" class="es-button" target="_blank" style="font-weight: normal;-webkit-text-size-adjust: none;-ms-text-size-adjust: none;mso-line-height-rule: exactly;text-decoration: none !important;color: #ffffff;font-size: 20px;border-style: solid;border-color: #26C6DA;border-width: 10px 25px 10px 30px;display: inline-block;background: #26C6DA;border-radius: 10px;font-family: arial, 'helvetica neue', helvetica, sans-serif;font-style: normal;line-height: 120%;width: auto;text-align: center;mso-style-priority: 100 !important;"> Reset Your Password</a></span></td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td align="center" class="esd-block-text es-p10t es-p10b">
                                                                                            <p>If you ignore this message, your password won't be changed.</p>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <table cellpadding="0" cellspacing="0" class="es-content" align="center">
                                <tbody>
                                    <tr>
                                        <td class="esd-stripe" align="center">
                                            <table bgcolor="#10054D" class="es-content-body" align="center" cellpadding="0" cellspacing="0" width="600" style="background-color: #10054d;">
                                                <tbody>
                                                    <tr>
                                                        <td class="esd-structure es-p35t es-p35b es-p20r es-p20l" align="left" background="https://tlr.stripocdn.email/content/guids/CABINET_0e8fbb6adcc56c06fbd3358455fdeb41/images/vector_sSY.png" style="background-image: url(https://tlr.stripocdn.email/content/guids/CABINET_0e8fbb6adcc56c06fbd3358455fdeb41/images/vector_sSY.png); background-repeat: no-repeat; background-position: left center;">
                                                            <!--[if mso]><table width="560" cellpadding="0" cellspacing="0"><tr><td width="69" valign="top"><![endif]-->
                                                            <table cellpadding="0" cellspacing="0" class="es-left" align="left">
                                                                <tbody>
                                                                    <tr>
                                                                        <td width="69" class="es-m-p20b esd-container-frame" align="left">
                                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td align="center" class="esd-block-image es-m-txt-l" style="font-size: 0px;"><a target="_blank" href="https://viewstripo.email"><img src="https://tlr.stripocdn.email/content/guids/CABINET_dee64413d6f071746857ca8c0f13d696/images/group_118_lFL.png" alt style="display: block;" width="69"></a></td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                            <!--[if mso]></td><td width="20"></td><td width="471" valign="top"><![endif]-->
                                                            <table cellpadding="0" cellspacing="0" class="es-right" align="right">
                                                                <tbody>
                                                                    <tr>
                                                                        <td width="471" align="left" class="esd-container-frame">
                                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td align="left" class="esd-block-text">
                                                                                            <h3 style="color: #ffffff;"><b>Here to help.</b></h3>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td align="left" class="esd-block-text es-p10t es-p5b">
                                                                                            <p style="color: #ffffff;">Have a question? Just mail : coder@objectways.com.</p>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                            <!--[if mso]></td></tr></table><![endif]-->
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <table cellpadding="0" cellspacing="0" class="esd-footer-popover es-footer" align="center">
                                <tbody>
                                    <tr>
                                        <td class="esd-stripe" align="center">
                                            <table class="es-footer-body" align="center" cellpadding="0" cellspacing="0" width="600" style="background-color: transparent;">
                                                <tbody>
                                                    <tr>
                                                        <td class="esd-structure es-p20" align="left">
                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                <tbody>
                                                                    <tr>
                                                                        <td width="560" class="esd-container-frame" align="center" valign="top">
                                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td align="center" class="esd-empty-container" style="display: none;"></td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
                        `,
          });
          res.json({ message: "check your email" });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({ message: "Internal server error" });
        });
    });
  });
});

app.post("/authentication/user/reset", (req, res) => {
  const newPass = req.body.password;
  const email = req.body.email;
  const sendToken = req.body.token;

  User.findOne({ resetToken: sendToken, expireToken: { $gt: Date.now() } })
    .then((user) => {
      if (!user) {
        return res
          .status(404)
          .json("Token Has been expired so Please try again");
      }
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newPass, salt, (err, hash) => {
          if (err) {
            console.log(err);
          }
          user.password = hash;
          user.resetToken = undefined;
          user.expireToken = undefined;
          user
            .save()
            .then((user) =>
              res.json(
                "Your New Password Has been updated please login with new password"
              )
            )
            .catch((err) => console.log(err));
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

// all employees route

// POST route for uploading data
app.post("/uploadData", async (req, res) => {
  try {
    const data = req.body;

    // Extract email IDs from the incoming data
    const emailIds = data.map((employeeData) => employeeData.email_id);

    // Find existing employees with the extracted email IDs
    const existingEmployees = await Employee.find({
      email_id: { $in: emailIds },
    });

    // Create a map of existing employees for quick access
    const existingEmployeeMap = new Map(
      existingEmployees.map((emp) => [emp.email_id, emp])
    );

    // Prepare an array for bulk insertion
    const bulkInsertData = [];

    for (const employeeData of data) {
      const existingEmployee = existingEmployeeMap.get(employeeData.email_id);

      if (existingEmployee) {
        // Merge existing employee data with the new data
        const mergedData = { ...existingEmployee.toObject(), ...employeeData };
        bulkInsertData.push({
          updateOne: {
            filter: { _id: existingEmployee._id },
            update: mergedData,
          },
        });
      } else {
        // If no existing employee, create a new one
        bulkInsertData.push({ insertOne: { document: employeeData } });
      }
    }

    // Use insertMany for bulk insertion and updating
    await Employee.bulkWrite(bulkInsertData);

    res.status(200).json({ message: "Data saved to MongoDB" });
  } catch (error) {
    console.error("Error saving data to MongoDB", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/fetch/manager-name", async (req, res) => {
  try {
    // Fetch employees with designation "Project Manager"
    const projectManagers = await Employee.find({
      designation: "Project Manager",
    });

    // Extract both the emp_name and designation from the project managers
    const projectManagerDetails = projectManagers.map((manager) => ({
      emp_name: manager.emp_name,
      designation: manager.designation,
    }));

    res.status(200).json(projectManagerDetails);
  } catch (error) {
    console.error("Error fetching manager data", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET route for fetching data
app.get("/fetchData", async (req, res) => {
  try {
    const employees = await Employee.find({});
    const columns = Object.keys(Employee.schema.paths).filter(
      (col) => col !== "_id"
    );
    const rows = employees.map((emp) => ({ ...emp.toObject(), id: emp._id }));

    res.status(200).json({ columns, rows });
  } catch (error) {
    console.error("Error fetching data from MongoDB", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST route for adding an employee
app.post("/addEmployee", async (req, res) => {
  try {
    const newEmployeeData = req.body;
    const newEmployee = new Employee(newEmployeeData);
    await newEmployee.save();

    res.status(200).json({ message: "Employee added successfully" });
  } catch (error) {
    console.error("Error adding employee to MongoDB", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// DELETE route for deleting an employee
app.delete("/deleteEmployee/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await Employee.findByIdAndDelete(id);
    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    console.error("Error deleting employee from MongoDB", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// PUT route for updating an employee
app.put("/updateEmployee/:id", async (req, res) => {
  const { id } = req.params;
  const updatedEmployeeData = req.body;

  try {
    await Employee.findByIdAndUpdate(id, updatedEmployeeData);
    res.status(200).json({ message: "Employee updated successfully" });
  } catch (error) {
    console.error("Error updating employee in MongoDB", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// analyst.js route
app.get("/analyst", async (req, res) => {
  Analyst.find()
    .then((analyst) => res.json(analyst))
    .catch((err) => res.status(400).json("Error:" + err));
});

// analyst.js projectName call
app.get("/analyst/projectName", async (req, res) => {
  Analyst.find()
    .distinct("projectName") // Fetch distinct project names
    .then((projectNames) => res.json(projectNames)) // Send project names as response
    .catch((err) => res.status(400).json("Error:" + err));
});


app.get("/analyst/counts", async (req, res) => {
  try {
    const { projectName, team, sDate, eDate } = req.query;
    let query = {};

    // If projectName and team are provided, filter analysts based on them
    if (projectName && team) {
      query = { projectName, team };
    } else if (team) {
      query = { team };
    } else if (projectName) {
      query = { projectName };
    }

    // If start and end dates are provided, add date filter to the query
    if (sDate && eDate) {
      query.dateTask = { $gte: new Date(sDate), $lte: new Date(eDate) };
    }

    const analysts = await Analyst.find(query); // Retrieve analyst documents based on the query
    let totalProductionTasks = 0;
    let totalIdleTasks = 0;

    // Iterate through each analyst document to aggregate counts
    analysts.forEach(analyst => {
      totalProductionTasks += analyst.productionTasks || 0;
      totalIdleTasks += analyst.idleTasks || 0;
    });

    // Send the aggregated counts as JSON response
    res.json({ totalProductionTasks, totalIdleTasks });
  } catch (err) {
    // If there's an error, send an error response
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/getBatchByProjectName", async (req, res) => {
  try {
    const { projectName } = req.query;

    // Find the project in Analyst schema
    const analystProject = await Analyst.findOne({ projectName });

    if (!analystProject) {
      return res.status(404).json({ error: "Project not found in Analyst schema" });
    }

    // Find the project in Billing schema
    const billingProject = await Billing.findOne({ projectname: projectName });

    if (!billingProject) {
      return res.status(404).json({ error: "Project not found in Billing schema" });
    }

    // If both projects exist, send the batch value from Billing schema
    const batchValue = billingProject.batch;

    res.json({ batchValue });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// API endpoint to calculate the count of emp_id
app.get('/employeeCount', async (req, res) => {
  try {
    // Use Mongoose aggregation to calculate the count
    const result = await Employee.aggregate([
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
        },
      },
    ]);

    // Extract the count from the result
    const count = result.length > 0 ? result[0].count : 0;

    res.json({ count });
  } catch (error) {
    console.error('Error calculating employee count:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// New route to get overall batch count by team
app.get("/overallBatchCountByTeam", async (req, res) => {
  try {
    console.log("Received request for /overallBatchCountByTeam");
    
    const result = await Billing.aggregate([
      {
        $group: {
          _id: "$team",
          overallBatchCount: { $sum: "$batch" },
        },
      },
    ]);

    console.log("Sending response:", result);
    
    res.json(result);
  } catch (error) {
    console.error('Error getting overall batch count by team:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// analyst.js route
// app.get("/analyst", async (req, res) => {
//   const { idleTasks, productionTasks } = req.query;

//   // Constructing the query object based on the submitted parameters
//   const query = {};
//   if (idleTasks !== undefined) {
//     query.idleTasks = parseInt(idleTasks); // Convert to integer
//   }
//   if (productionTasks !== undefined) {
//     query.productionTasks = parseInt(productionTasks); // Convert to integer
//   }

//   Analyst.find(query)
//     .then((analyst) => res.json(analyst))
//     .catch((err) => res.status(400).json("Error:" + err));
// });


app.get("/analyst/byManagerTask/:managerTask", async (req, res) => {
  const managerTask = req.params.managerTask;

  try {
    const analysts = await Analyst.find({ managerTask });

    if (analysts.length === 0) {
      return res
        .status(404)
        .json({ message: "No analysts found for the specified managerTask." });
    }

    res.json(analysts);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

app.delete("/delete/usertask/:id", async (req, res) => {
  try {
    // Find the task by ID and delete it
    const result = await Analyst.findByIdAndDelete(req.params.id);

    if (!result) {
      return res.status(404).json({ message: "Record not found" });
    }

    return res.status(200).json({ message: "Record deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Fetch teams
app.get("/teams", async (req, res) => {
  try {
    const teams = await Analyst.distinct("team");
    res.json(teams);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Fetch projects based on team
app.get("/projectNames", async (req, res) => {
  try {
    const { team } = req.query;
    let query = team ? { team } : {};

    const projects = await Analyst.distinct("projectName", query);
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/fetch/taskwise", async (req, res) => {
  try {
    const { sDate, eDate, team, projectName } = req.query;

    let matchCondition = {
      dateTask: { $gte: new Date(sDate), $lte: new Date(eDate) },
    };

    if (team) {
      matchCondition.team = team;
    }

    if (projectName) {
      matchCondition.projectName = projectName;
    }

    const result = await Analyst.aggregate([
      {
        $match: matchCondition,
      },
      {
        $unwind: "$sessionOne",
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$dateTask" } },
            task: "$sessionOne.task",
          },
          count: { $sum: 1 },
        },
      },
    ]);

    res.json(result);
  } catch (error) {
    console.error("Error fetching taskwise data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.get("/getBatchByProjectName", async (req, res) => {
  try {
    const { projectName } = req.query;

    // Find the project in Analyst schema
    const analystProject = await Analyst.findOne({ projectName });

    if (!analystProject) {
      return res.status(404).json({ error: "Project not found in Analyst schema" });
    }

    // Find the project in Billing schema
    const billingProject = await Billing.findOne({ projectname: projectName });

    if (!billingProject) {
      return res.status(404).json({ error: "Project not found in Billing schema" });
    }

    // If both projects exist, send the batch value from Billing schema
    const batchValue = billingProject.batch;

    res.json({ batchValue });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// API endpoint to calculate the count of emp_id
app.get('/employeeCount', async (req, res) => {
  try {
    // Use Mongoose aggregation to calculate the count
    const result = await Employee.aggregate([
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
        },
      },
    ]);

    // Extract the count from the result
    const count = result.length > 0 ? result[0].count : 0;

    res.json({ count });
  } catch (error) {
    console.error('Error calculating employee count:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// New route to get overall batch count by team
app.get("/overallBatchCountByTeam", async (req, res) => {
  try {
    console.log("Received request for /overallBatchCountByTeam");
    
    const result = await Billing.aggregate([
      {
        $group: {
          _id: "$team",
          overallBatchCount: { $sum: "$batch" },
        },
      },
    ]);

    console.log("Sending response:", result);
    
    res.json(result);
  } catch (error) {
    console.error('Error getting overall batch count by team:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post("/add", (req, res) => {
  const userData = req.body;
  const newData = new Analyst(userData);
  console.log(userData);
  newData
    .save()
    .then(() => {
      console.log("Data Saved!!!");
      res.json("Data Saved!!!");
    })
    .catch((err) => {
      console.error("Error saving data:", err);
      res.status(400).json("Error: Required all fileds");
    });
});

// Backend code (Express.js route handler)

// Define a route to handle the updating of existing data
app.put('/update/analyst/:id', async (req, res) => {
  try {
      const updatedData = req.body;
      const id = req.params.id;

      // Update the data in the database
      const updatedRecord = await Analyst.findByIdAndUpdate(id, updatedData, { new: true });

      res.json({ message: 'Data updated successfully', data: updatedRecord });
  } catch (error) {
      console.error('Error updating data:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});

app.get("/fetch/src/:min/:max", (req, res) => {
  const min = req.params.min;
  const max = req.params.max;
  const qur = { week: { $gte: min, $lte: max } };

  Analyst.find(qur)
    .then((analyst) => res.json(analyst))
    .catch((err) => res.status(400).json("err" + err));
});

//Fetch individual user Data for users

app.get("/fetch/user-data/", (req, res) => {
  const sDate = req.query.sDate;
  const eDate = req.query.eDate;
  const empId = req.query.empId;
  const team = req.query.team;

  Analyst.find({
    empId: empId,
    team: team,
    createdAt: { $gte: new Date(sDate), $lte: new Date(eDate) },
  })
    .then((analyst) => res.json(analyst))
    .catch((err) => res.status(400).json("err" + err));
});
app.get("/fetch/userdata/", (req, res) => {
  // console.log("entered in the code <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<")

  const empId = req.query.empId;
  // console.log(empId, "<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<")

  Analyst.find({ empId: empId })
    .then((analyst) => res.json(analyst))
    .catch((err) => res.status(400).json("err" + err));
});

//Fetch report of user particular team

app.get("/fetch/report/", async (req, res) => {
  try {
    const { sDate, eDate, name, team, projectName } = req.query;

    // Build the filter object based on the provided query parameters
    const filter = {
      name: name,
      team: team,
      projectName: projectName,
      createdAt: { $gte: new Date(sDate), $lte: new Date(eDate) },
    };

    console.log("Filter Object:", filter); // Log the filter object

    // Fetch data from the database based on the filter
    const reportData = await Analyst.find(filter);

    res.json(reportData);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
app.get("/fetch/report/projectName", async (req, res) => {
  try {
    const { sDate, eDate, team, projectName } = req.query;

    // Build the filter object based on the provided query parameters
    const filter = {
      team: team,
      projectName: projectName,
      createdAt: { $gte: new Date(sDate), $lte: new Date(eDate) },
    };

    console.log("Filter Object:", filter); // Log the filter object

    // Fetch data from the database based on the filter
    const reportData = await Analyst.find(filter);

    res.json(reportData);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//Fetch report by team

app.get("/fetch/report/team/", (req, res) => {
  const sDate = req.query.sDate;
  const eDate = req.query.eDate;
  const team = req.query.team;

  Analyst.find({
    team: team,
    createdAt: { $gte: new Date(sDate), $lte: new Date(eDate) },
  })
    .then((analyst) => res.json(analyst))
    .catch((err) => res.status(400).json("err" + err));
});

//Fetch report by user
app.get("/fetch/report/user/", (req, res) => {
  const sDate = req.query.sDate;
  const eDate = req.query.eDate;
  const name = req.query.name;

  Analyst.find({
    name: name,
    createdAt: { $gte: new Date(sDate), $lte: new Date(eDate) },
  })
    .then((analyst) => res.json(analyst))
    .catch((err) => res.status(400).json("err" + err));
});

//Fetch Report by date
app.get("/fetch/report/date/", (req, res) => {
  const sDate = req.query.sDate;
  const eDate = req.query.eDate;

  Analyst.find({ createdAt: { $gte: new Date(sDate), $lte: new Date(eDate) } })
    .then((analyst) => res.json(analyst))
    .catch((err) => res.status(400).json("err" + err));
});
app.get("/fetch/user-data/", (req, res) => {
  const empId = req.params.empId;
  const sDate = req.query.sDate;
  const eDate = req.query.eDate;
  const team = req.query.team;

  const query = {
    empId: empId,
    team: team,
    createdAt: { $gte: new Date(sDate), $lte: new Date(eDate) },
  };

  Analyst.find(query)
    .then((analyst) => res.json(analyst))
    .catch((err) => res.status(400).json("err" + err));
});

app.get("/fetch", (req, res) => {
  Analyst.find(req.query)
    .then((analyst) => res.json(analyst))
    .catch((err) => res.status(400).json("Error:" + err));
});
app.delete("/del", (req, res) => {
  Analyst.deleteMany()
    .then(() => res.json("Exercise Deleted!!!!"))
    .catch((err) => res.status(400).json("Error:" + err));
});
app.get("/count", (req, res) => {
  const sDate = req.query.sDate;
  const team = req.query.team;
  const fdate = new Date(sDate);

  Analyst.count({ team: team, createdAt: { $gte: new Date(sDate) } })
    .then((analyst) => res.json(analyst))
    .catch((err) => res.status(400).json("Error:" + err));
});

app.get("/fetch/one", (req, res) => {
  const date = req.query.createdAt;
  const empId = "710";
  Analyst.find({ empId: empId, createdAt: { $gte: new Date(date) } })
    .then((analyst) => {
      if (analyst) {
        return res.status(404).json({
          emailnotfound:
            "Already Your file has been submitted please try to Submit tomorrow",
        });
      }
      return null;
    })
    .catch((err) => res.status(400).json("Error:" + err));
});

// billing routes

//Find All Data in Billing
app.get("/billing", (req, res) => {
  const empId = req.query.empId;
  Billing.find({ empId: empId })
    .sort([["reportDate", 1]])
    .then((billing) => res.json(billing))
    .catch((err) => res.status(400).json("Error:" + err));
});
// //Find All Data in Billing
app.get("/admin", (req, res) => {
  Billing.find()
    .sort([["reportDate", 1]])
    .then((billing) => res.json(billing))
    .catch((err) => res.status(400).json("Error:" + err));
});

app.get("/getBatchByProjectName", async (req, res) => {
  try {
    const { projectName } = req.query;

    // Find the project in Analyst schema
    const analystProject = await Analyst.findOne({ projectName });

    if (!analystProject) {
      return res
        .status(404)
        .json({ error: "Project not found in Analyst schema" });
    }

    // Find the project in Billing schema
    const billingProject = await Billing.findOne({ projectname: projectName });

    if (!billingProject) {
      return res
        .status(404)
        .json({ error: "Project not found in Billing schema" });
    }

    // If both projects exist, send the batch value from Billing schema
    const batchValue = billingProject.batch;

    res.json({ batchValue });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// API endpoint to calculate the count of emp_id
app.get("/employeeCount", async (req, res) => {
  try {
    // Use Mongoose aggregation to calculate the count
    const result = await Employee.aggregate([
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
        },
      },
    ]);

    // Extract the count from the result
    const count = result.length > 0 ? result[0].count : 0;

    res.json({ count });
  } catch (error) {
    console.error("Error calculating employee count:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// New route to get overall batch count by team
app.get("/overallBatchCountByTeam", async (req, res) => {
  try {
    console.log("Received request for /overallBatchCountByTeam");

    const result = await Billing.aggregate([
      {
        $group: {
          _id: "$team",
          overallBatchCount: { $sum: "$batch" },
        },
      },
    ]);

    console.log("Sending response:", result);

    res.json(result);
  } catch (error) {
    console.error("Error getting overall batch count by team:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// Assuming you have a route like this in your Express app
app.get("/projectStatus", async (req, res) => {
  try {
    const projectStatusData = await Billing.aggregate([
      {
        $group: {
          _id: "$jobs.status1",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          status1: "$_id",
          count: 1,
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
    ]);

    res.json(projectStatusData);
  } catch (error) {
    console.error("Error fetching project status data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/status1CountByProject", async (req, res) => {
  try {
    const status1CountByProject = await Billing.aggregate([
      {
        $group: {
          _id: { projectname: "$projectname", status1: "$jobs.status1" },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: "$_id.projectname",
          status1Counts: {
            $push: { status1: "$_id.status1", count: "$count" },
          },
        },
      },
    ]);

    res.json(status1CountByProject);
  } catch (error) {
    console.error("Error fetching status1 count by project:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Find by Id
app.get("/billing/:id", (req, res) => {
  Billing.findById(req.params.id)
    .then((billing) => res.json(billing))
    .catch((err) => res.status(400).json("Error:" + err));
});

//Add new Billing Data
app.post("/new", (req, res) => {
  const name = req.body;
  const newData = new Billing(name);
  console.log(name);
  newData
    .save()
    .then(() => res.json("Data Saved Successfully !!!"))
    .catch((err) => res.status(400).json("Error:" + err));
});

// edit Billing Data
app.post("/update/:id", (req, res) => {
  const data = req.body;
  Billing.findByIdAndUpdate(req.params.id, data)
    .then(() => res.json("Updated"))
    .catch((err) => res.status(400).json("Error:" + err));
});

//Delete Billing Data By Id
app.delete("/billing/:id", (req, res) => {
  Billing.findByIdAndDelete(req.params.id)
    .then(() => res.json("Exercise Has been Deleted "))
    .catch((err) => res.status(400).json("Error:" + err));
});

//Find Billing Data By date
app.get("/fetch/date/", (req, res) => {
  const sDate = new Date(req.query.sDate);
  const eDate = new Date(req.query.eDate);

  Billing.find({ reportDate: { $gte: sDate, $lte: eDate } })
    .then((billing) => res.json(billing))
    .catch((err) => res.status(400).json("err" + err));
});

//Find Billing Data by Date & team
app.get("/fetch/report/", (req, res) => {
  const sDate = new Date(req.query.sDate);
  const eDate = new Date(req.query.eDate);
  const team = req.query.team;

  Billing.find({ team: team, reportDate: { $gte: sDate, $lte: eDate } })
    .then((billing) => res.json(billing))
    .catch((err) => res.status(400).json("err" + err));
});

//attendatnce.js route

// Fetch all attendance data
// app.get("/emp-attendance", (req, res) => {
//   Attendance.find()
//     .then((attendance) => res.json(attendance))
//     .catch((err) => res.status(400).json("Error:" + err));
// });

app.get("/emp-attendance", async (req, res) => {
  try {
    const empAttendanceData = await Attendance.find();
    const analystData = await Analyst.find();

    // Compare empIds and find matching records
    const matchingData = empAttendanceData.filter((empAttendance) => {
      const matchingAnalyst = analystData.find(
        (analyst) => analyst.empId === empAttendance.empId
      );
      return matchingAnalyst;
    });

    // Extract specific fields from the matching data
    const result = matchingData.map((empAttendance) => {
      const matchingAnalyst = analystData.find(
        (analyst) => analyst.empId === empAttendance.empId
      );
      return {
        name: empAttendance.name,
        empId: empAttendance.empId,
        projectName: matchingAnalyst.projectName,
        team: matchingAnalyst.team,
        checkInTime: empAttendance.checkInTime,
        checkOutTime: empAttendance.checkOutTime,
        total: empAttendance.total,
        currentDate: empAttendance.currentDate,
      };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.get("/emp-attendance/:managerTask", async (req, res) => {
  try {
    const empAttendanceData = await Attendance.find();
    const analystData = await Analyst.find();

    // Group analystData by managerTask
    const groupedAnalystData = analystData.reduce((acc, analyst) => {
      if (!acc[analyst.managerTask]) {
        acc[analyst.managerTask] = [];
      }
      acc[analyst.managerTask].push(analyst);
      return acc;
    }, {});

    // Get the specified managerTask from the route parameter
    const specifiedManagerTask = req.params.managerTask;

    // Check if the specified managerTask exists in the groupedAnalystData
    if (groupedAnalystData[specifiedManagerTask]) {
      // Filter empAttendanceData based on the specified managerTask
      const matchingData = empAttendanceData.filter((empAttendance) => {
        const matchingAnalyst = groupedAnalystData[specifiedManagerTask].find(
          (analyst) => analyst.empId === empAttendance.empId
        );
        return matchingAnalyst;
      });

      // Extract specific fields from the matching data
      const result = matchingData.map((empAttendance) => {
        const matchingAnalyst = groupedAnalystData[specifiedManagerTask].find(
          (analyst) => analyst.empId === empAttendance.empId
        );
        return {
          name: empAttendance.name,
          empId: empAttendance.empId,
          projectName: matchingAnalyst.projectName,
          team: matchingAnalyst.team,
          checkInTime: empAttendance.checkInTime,
          checkOutTime: empAttendance.checkOutTime,
          total: empAttendance.total,
          currentDate: empAttendance.currentDate,
          managerTask: matchingAnalyst.managerTask,
        };
      });

      res.json(result);
    } else {
      res.status(404).json({ error: "Manager Task not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/compareData", async (req, res) => {
  try {
    // Fetch data from API one (Employee data)
    const employees = await Employee.find({});
    const totalEmployees = employees.length;

    // Fetch data from API two (Attendance data)
    const attendanceData = await Attendance.find({});
    const presentEmployees = attendanceData.length;

    // Calculate the absent employees
    // const absentEmployees = totalEmployees - presentEmployees;

    // Prepare data for the response
    const comparisonData = {
      totalEmployees,
      presentEmployees,
      // absentEmployees,
    };

    res.status(200).json(comparisonData);
  } catch (error) {
    console.error("Error comparing data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
// Save attendance data
// app.post('/att', async (req, res) => {
//   try {
//     const { name, empId, checkInTime, checkOutTime, total } = req.body;

//     // Capture the current date
//     const currentDate = new Date();

//     if (!checkOutTime) {
//       // It's a check-in action
//       const newAttendance = new Attendance({
//         name,
//         empId,
//         checkInTime,
//         currentDate,
//       });

//       await newAttendance.save();
//       res.json('Check-in Data Saved!!!');
//     } else {
//       // It's a check-out action
//       const checkinAttendance = await Attendance.findOne({ empId, checkOutTime: null }).sort({ currentDate: -1 });

//       if (checkinAttendance) {
//         checkinAttendance.checkOutTime = checkOutTime;

//         // Calculate overall time
//         const checkinMoment = moment(checkinAttendance.checkInTime, "hh:mm a");
//         const checkoutMoment = moment(checkOutTime, "hh:mm a");
//         const overAll = moment.duration(checkoutMoment.diff(checkinMoment));

//         checkinAttendance.total = `${overAll.hours()}hrs : ${overAll.minutes()}mins`;

//         await checkinAttendance.save();

//         // Fetch latest check-in and check-out times after saving
//         const latestAttendance = await Attendance.findOne({ empId }).sort({ currentDate: -1 });

//         res.json({
//           message: 'Check-out Data Saved!!!',
//           latestCheckin: latestAttendance.checkInTime || 'N/A',
//           latestCheckout: latestAttendance.checkOutTime || 'N/A',
//         });
//       } else {
//         res.status(400).json('Error: Check-in data not found for check-out');
//       }
//     }
//   } catch (error) {
//     res.status(400).json('Error: ' + error);
//   }
// });

// app.post("/att/checkin", async (req, res) => {
//   try {
//     const { name, empId, checkInTime } = req.body;

//     // Capture the current date
//     const currentDate = new Date();

//     const newAttendance = new Attendance({
//       name,
//       empId,
//       checkInTime,
//       currentDate,
//     });

//     await newAttendance.save();

//     // Fetch latest check-in data after saving
//     const latestCheckin = await Attendance.findOne({
//       empId,
//       checkOutTime: null,
//     }).sort({ currentDate: -1 });

//     res.json({
//       message: "Check-in Data Saved!!!",
//       latestCheckin: latestCheckin ? latestCheckin.checkInTime : "N/A",
//     });
//   } catch (error) {
//     res.status(400).json("Error: " + error);
//   }
// });

// app.post("/att/checkout", async (req, res) => {
//   try {
//     const { empId, checkOutTime } = req.body;

//     // Find the latest check-in data for the employee
//     const checkinAttendance = await Attendance.findOne({
//       empId,
//       checkOutTime: null,
//     }).sort({ currentDate: -1 });

//     if (checkinAttendance) {
//       checkinAttendance.checkOutTime = checkOutTime;

//       // Calculate overall time
//       const checkinMoment = moment(checkinAttendance.checkInTime, "hh:mm a");
//       const checkoutMoment = moment(checkOutTime, "hh:mm a");
//       const overAll = moment.duration(checkoutMoment.diff(checkinMoment));

//       checkinAttendance.total = `${overAll.hours()}hrs : ${overAll.minutes()}mins`;

//       await checkinAttendance.save();

//       // Fetch latest check-out data after saving
//       const latestCheckout = await Attendance.findOne({ empId }).sort({
//         currentDate: -1,
//       });

//       res.json({
//         message: "Check-out Data Saved!!!",
//         latestCheckout: latestCheckout ? latestCheckout.checkOutTime : "N/A",
//       });
//     } else {
//       res.status(400).json("Error: Check-in data not found for check-out");
//     }
//   } catch (error) {
//     res.status(400).json("Error: " + error);
//   }
// });

// app.get("/att/latest", async (req, res) => {
//   try {
//     const empId = req.query.empId;

//     // Fetch the latest check-in and check-out times
//     const latestAttendance = await Attendance.findOne({ empId }).sort({
//       currentDate: -1,
//     });

//     if (latestAttendance) {
//       res.json({
//         latestCheckin: latestAttendance.checkInTime || "N/A",
//         latestCheckout: latestAttendance.checkOutTime || "N/A",
//       });
//     } else {
//       res.json({
//         latestCheckin: "N/A",
//         latestCheckout: "N/A",
//       });
//     }
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// app.get("/fetch/att-data/", (req, res) => {
//   const empId = req.query.empId;
//   Attendance.find({ empId: empId })
//     .sort({ currentDate: -1 }) // Sort by currentDate in descending order
//     .select("checkInTime checkOutTime total currentDate") // Select only specific fields
//     .then((attendance) => res.json(attendance))
//     .catch((err) => res.status(400).json("err" + err));
// });

// Fetch initial mode
app.get("/att/mode", async (req, res) => {
  try {
    const empId = req.query.empId;

    // Fetch the latest check-in and check-out times for the specified empId
    const latestAttendance = await Attendance.findOne({ empId }).sort({
      currentDate: -1,
    });

    const mode = latestAttendance
      ? latestAttendance.checkOutTime
        ? "checkin"
        : "checkout"
      : "checkin";

    res.json({
      mode,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/att/checkin", async (req, res) => {
  try {
    const { name, empId, checkInTime } = req.body;

    // Capture the current date
    const currentDate = new Date();

    // Find existing check-in record for the current day
    const existingCheckin = await Attendance.findOne({
      empId,
      checkOutTime: null,
      currentDate,
    });

    if (existingCheckin) {
      // Update existing check-in record
      existingCheckin.checkInTime = checkInTime;
      await existingCheckin.save();
    } else {
      // Create a new check-in record
      const newAttendance = new Attendance({
        name,
        empId,
        checkInTime,
        currentDate,
      });

      await newAttendance.save();
    }

    // Fetch latest check-in data after saving
    const latestCheckin = await Attendance.findOne({
      empId,
      checkOutTime: null,
    }).sort({ currentDate: -1 });

    res.json({
      message: "Check-in Data Saved!!!",
      latestCheckin: latestCheckin ? latestCheckin.checkInTime : "N/A",
    });
  } catch (error) {
    res.status(400).json("Error: " + error);
  }
});

app.post("/att/checkout", async (req, res) => {
  try {
    const { empId, checkOutTime } = req.body;

    // Find the latest check-in data for the employee
    const checkinAttendance = await Attendance.findOne({
      empId,
      checkOutTime: null,
    }).sort({ currentDate: -1 });

    if (checkinAttendance) {
      // Update check-out time and calculate overall time
      checkinAttendance.checkOutTime = checkOutTime;

      const checkinMoment = moment(checkinAttendance.checkInTime, "hh:mm a");
      const checkoutMoment = moment(checkOutTime, "hh:mm a");
      const overAll = moment.duration(checkoutMoment.diff(checkinMoment));

      checkinAttendance.total = `${overAll.hours()}hrs : ${overAll.minutes()}mins`;

      await checkinAttendance.save();

      // Fetch latest check-out data after saving
      const latestCheckout = await Attendance.findOne({ empId }).sort({
        currentDate: -1,
      });

      res.json({
        message: "Check-out Data Saved!!!",
        latestCheckout: latestCheckout ? latestCheckout.checkOutTime : "N/A",
      });
    } else {
      res.status(400).json("Error: Check-in data not found for check-out");
    }
  } catch (error) {
    res.status(400).json("Error: " + error);
  }
});

app.get("/att/latest", async (req, res) => {
  try {
    const empId = req.query.empId;

    // Fetch the latest check-in and check-out times
    const latestAttendance = await Attendance.findOne({ empId }).sort({
      currentDate: -1,
    });

    if (latestAttendance) {
      res.json({
        latestCheckin: latestAttendance.checkInTime || "N/A",
        latestCheckout: latestAttendance.checkOutTime || "N/A",
      });
    } else {
      res.json({
        latestCheckin: "N/A",
        latestCheckout: "N/A",
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/fetch/att-data", (req, res) => {
  const empId = req.query.empId;
  Attendance.find({ empId })
    .sort({ currentDate: -1 }) // Sort by currentDate in descending order
    .select("checkInTime checkOutTime total currentDate") // Select only specific fields
    .then((attendance) => res.json(attendance))
    .catch((err) => res.status(400).json("err" + err));
});
//task.js route

//add task
app.get("/fetch/task-data", (req, res) => {
  Task.find()
    .then((task) => res.json(task))
    .catch((err) => res.status(400).json("Error:" + err));
});

app.post("/task/new", async (req, res) => {
  try {
    const { createTask } = req.body;

    const newTask = new Task({
      createTask,
    });

    await newTask.save();
    res.json("Task Added!!!");
  } catch (error) {
    res.status(400).json("Error:" + error);
  }
});

//add manager
app.get("/fetch/manager-data", (req, res) => {
  Manager.find()
    .then((manager) => res.json(manager))
    .catch((err) => res.status(400).json("Error:" + err));
});

app.post("/add-manager/new", async (req, res) => {
  try {
    const { createManager } = req.body;

    const newManager = new Manager({
      createManager,
    });

    await newManager.save();
    res.json("Manager Added!!!");
  } catch (error) {
    res.status(400).json("Error:" + error);
  }
});

//add team
app.get("/fetch/addteam-data", (req, res) => {
  AddTeam.find()
    .then((addteam) => res.json(addteam))
    .catch((err) => res.status(400).json("Error:" + err));
});

app.post("/add-team/new", async (req, res) => {
  try {
    const { createTeam } = req.body;

    const newTeam = new AddTeam({
      createTeam,
    });

    await newTeam.save();
    res.json("Team Added!!!");
  } catch (error) {
    res.status(400).json("Error:" + error);
  }
});

//add status
app.get("/fetch/status-data", (req, res) => {
  Status.find()
    .then((status) => res.json(status))
    .catch((err) => res.status(400).json("Error:" + err));
});

app.post("/add-status/new", async (req, res) => {
  try {
    const { createStatus } = req.body;

    const newStatus = new Status({
      createStatus,
    });

    await newStatus.save();
    res.json("Status Added!!!");
  } catch (error) {
    res.status(400).json("Error:" + error);
  }
});

//delete funtions
// Delete task
app.delete("/delete/task/:id", async (req, res) => {
  try {
    const taskId = req.params.id;
    await Task.findByIdAndDelete(taskId);
    res.json("Task Deleted!!!");
  } catch (error) {
    res.status(400).json("Error:" + error);
  }
});

// Delete manager
app.delete("/delete/manager/:id", async (req, res) => {
  try {
    const managerId = req.params.id;
    await Manager.findByIdAndDelete(managerId);
    res.json("Manager Deleted!!!");
  } catch (error) {
    res.status(400).json("Error:" + error);
  }
});

// Delete team
app.delete("/delete/team/:id", async (req, res) => {
  try {
    const teamId = req.params.id;
    await AddTeam.findByIdAndDelete(teamId);
    res.json("Team Deleted!!!");
  } catch (error) {
    res.status(400).json("Error:" + error);
  }
});

app.get("/get-token", authenticateToken, (req, res) => {
  // Access user details through req.user
  console.log("Backend Token:", req.token);

  // Send the token back to the client if needed
  res.json({ token: req.token });
});

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// app.use(express.static(path.join(__dirname, 'client/build')))
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, '/client/build', 'index.html'));
// });

// app.use(express.static(path.join(__dirname, 'public')));

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

export default app;

// import express from 'express';
// import awsServerlessExpressMiddleware from 'aws-serverless-express/middleware.js';

// const app = express();
// app.use(awsServerlessExpressMiddleware.eventContext())
// const logPath = (req, res, next) => {
//   console.log(req?.apiGateway?.event)
//   let proxy_path = req?.apiGateway?.event?.pathParameters?.proxy
//   console.log(proxy_path,"proxy_path......")
//   if (proxy_path){
//     req.url = "/"+proxy_path;
//   }
//   next();
// };

// // Applying middleware globally
// app.use(logPath);

// app.get('/', (req, res) => {
//   res.send('Hello from Lambda!');
// });

// app.get('/login', (req, res) => {
//   res.send('This is get login endpoint');
// });
// app.get('/internal', (req, res) => {
//   res.send('This is get internal endpoint');
// });

// export default app;
