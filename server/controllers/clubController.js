const clubModel = require("../models/clubModel.js");
const nodemailer = require("nodemailer");
const transporter = require("../helpers/Mailing.js");
const jwt = require("jsonwebtoken");
const { passwordHash, comparePassword } = require("../helpers/bcrypt-Auth.js");

// club doesnt have username field, using name instead
const createClub = async (req, res) => {
  try {
    const { name, email, password, description, clubId } = req.body;

    // to check if req has all important fields
    if (!name || !email || !password){
      console.log("Missing required fields");
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }
    // check if the password length is at least 6 characters
    if (password.length < 6) {
      res.status(400).json({
        message: "Password must be at least 6 characters long",
      });
      console.log("Password too short");
      return;
    }

    // check if club with the same name or email or clubId already exists
    const existingClub = await clubModel.findOne({
      $or: [{ name }, { email }, { clubId }],
    });
    if (existingClub) {
      console.log("Club already exists");
      return res.status(400).json({
        message: "Club already exists",
      });
    }

    const newClub = new clubModel({
      name, 
      email,
      password: await passwordHash(password),
      description,
      clubId: clubId || undefined,
    });
    await newClub.save();

    // create jwt token for email verification
    jwt.sign(
      {
        name: name,
        email: email,
        id: newClub._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, emailToken) => {
        if (err) throw err;
        const fullMessage = `Hello ${name},

Please verify your club email by clicking on the link below:
http://localhost:5173/verify-email?token=${emailToken}

Thank you!
`;
        // console.log("full", fullMessage);

        const mailOptions = {
          from: process.env.EMAIL, // sender address
          to: email, // the email you want to receive emails
          subject: "DJS Townhall - Email Verification", // the subject captured
          text: fullMessage, // the message captured
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error("Error sending email: ", error);
            res.status(500).send("Error sending email");
          } else {
            console.log("Email sent: ", info.response);
            res.send("Email sent successfully");
          }
        });
      }
    );
    res.status(201).json({
      message: "Club email verification sent! Please check your inbox.",
      club: newClub,
    });
  } catch (error) {
    console.error("Error registering club:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = {
  createClub,
};
