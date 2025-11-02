const userModel = require("../models/userModel.js");
const clubModel = require("../models/clubModel.js");
const nodemailer = require("nodemailer");
const transporter = require("../helpers/Mailing.js");
const jwt = require("jsonwebtoken");
const { passwordHash, comparePassword } = require("../helpers/bcrypt-Auth.js");

const authTest = (req, res) => {
  console.log("Auth test endpoint hit");
  res.status(200).json({ message: "Auth test successful" });
};

const registerUser = async (req, res) => {
  try {
    const { username, sapid, phone, email, password } = req.body;
    // check if the password length is at least 6 characters
    if (password.length < 6) {
      res.status(400).json({
        message: "Password must be at least 6 characters long",
      });
      console.log("Password too short");
      return;
    }

    // check if user with the same sapid, phone or email already exists
    const existingUser = await userModel.findOne({
      $or: [{ sapid }, { phone }, { email }],
    });
    if (existingUser) {
      console.log("User already exists");
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const newUser = new userModel({
      username,
      sapid,
      phone,
      email,
      password: await passwordHash(password),
    });
    await newUser.save();

    // create jwt token for email verification
    jwt.sign(
      {
        name: username,
        email: email,
        sapid: sapid,
        id: newUser._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, emailToken) => {
        if (err) throw err;
        const fullMessage = `Hello ${username},

Please verify your email by clicking on the link below:
http://localhost:5173/verify-email?token=${emailToken}

Thank you!
`;

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
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const verifyEmail = async (req, res) => {
  const token = req.params.token;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // wont work if token is expired
    const userId = decoded.id;
    const type = decoded.sapid ? "student" : "club";

    if (!userId) {
      console.log("authController: Invalid token: no user ID " + decoded.id);
      return res.status(400).json({
        message: "Invalid token",
      });
    }

    // Update the user's isVerified status to true
    if (type === "club") {
      await clubModel.findByIdAndUpdate(userId, { isVerified: true });
      return res.status(200).json({
        message: "Email verified successfully",
        type: type,
      });
    } else {
      await userModel.findByIdAndUpdate(userId, { isVerified: true });

      res.status(200).json({
        message: "Email verified successfully",
        type: type,
      });
    }
  } catch (error) {
    console.error("Error verifying email:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const loginUser = async (req, res) => {
  const userType = req.params.userType;
  try {
    const { email, password } = req.body;
    if (userType !== "student" && userType !== "club") {
      console.log("authController: Invalid user type");
      return res.status(400).json({ message: "Invalid user type" });
    }
    let user;
    if (userType === "student") {
      // checks in the userModel for students
      user = await userModel.findOne({ email });
    }

    if (userType === "club") {
      // checks in the clubModel for clubs
      user = await clubModel.findOne({ email });
    }

    // Check if user exists
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    // Check if password matches
    if (!(await comparePassword(password, user.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // check if email is verified
    if (!user.isVerified) {
      return res.status(400).json({
        message:
          "Email not verified.\nPlease verify your email before logging in.",
      });
    }

    jwt.sign(
      { id: user._id, name: user.username, email: user.email, type: userType },
      process.env.JWT_SECRET,
      { expiresIn: "2h" },
      (err, token) => {
        if (err) throw err;
        res
          .cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 2 * 60 * 60 * 1000,
            sameSite: "lax",
          })
          .status(200)
          .json({
            message: "Login successful",
            user: {
              id: user._id,
              name: user.username,
              email: user.email,
            },
          });
      }
    );
  } catch (error) {
    console.error(`Error logging in ${userType}:`, error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = { authTest, registerUser, verifyEmail, loginUser };
