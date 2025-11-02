const Club = require("../models/clubModel.js");
const nodemailer = require("nodemailer");
const transporter = require("../helpers/Mailing.js");
const jwt = require("jsonwebtoken");
const { passwordHash, comparePassword } = require("../helpers/bcrypt-Auth.js");

// club doesnt have username field, using name instead
const createClub = async (req, res) => {
  try {
    const { name, email, password, description, clubId } = req.body;

    // to check if req has all important fields
    if (!name || !email || !password) {
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
    const existingClub = await Club.findOne({
      $or: [{ name }, { email }, { clubId }],
    });
    if (existingClub) {
      console.log("Club already exists");
      return res.status(400).json({
        message: "Club already exists",
      });
    }

    const newClub = new Club({
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

// for event-creator page
const verifyClub = async (req, res) => {
  try {
    // req.user comes from verifyToken middleware (decoded JWT)
    const userId = req.user.id;
    const userType = req.user.type;

    // Check if user type is club
    if (userType !== "club") {
      return res.status(403).json({
        authenticated: false,
        message: "Access denied. Only clubs can create events.",
      });
    }

    // Fetch club from database
    const club = await Club.findById(userId);

    if (!club) {
      return res.status(404).json({
        authenticated: false,
        message: "Club not found",
      });
    }

    return res.status(200).json({
      authenticated: true,
      message: "Club is verified",
    });

  } catch (error) {
    console.error("Club admin verification error:", error);
    return res.status(500).json({
      authenticated: false,
      message: "Server error during verification",
    });
  }
};

const getAllClubs = async (req, res) => {
  try {
    // Only return verified clubs for public display
    const clubs = await Club.find({ isVerified: true })
      .select('-password') // Don't send passwords to frontend
      .sort({ createdAt: -1 }); // Newest first
    
    res.status(200).json(clubs);
  } catch (error) {
    console.error("Error fetching clubs:", error);
    res.status(500).json({ message: "Failed to fetch clubs" });
  }
};

module.exports = {
  createClub,
  verifyClub,
  getAllClubs, 
};
