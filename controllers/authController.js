const User = require("../models/user");
const bcrypt = require("bcrypt");
const { sendEmail } = require("../utils/emailService");
const validator = require("validator");

const authController = {
    register: async (req, res) => {
        try {
            // get the details from request body
            const { name, email, password } = req.body;

            // validate input
            if (!name || !email || !password) {
                return res.status(400).json({ message: "All fields are required" });
            }

            // validate the email format
            if (!validator.isEmail(email)) {
                return res.status(400).json({ message: "Invalid email format" });
            }

            // check the password must be 8 to 16 characters
            if (8 > password.length || password.length > 16) {
                return res.status(400).json({ message: "Password must be 8 to 16 characters" });
            }

            // check password have atleast one lowercase
            if (!/[a-z]/.test(password)) {
                return res.status(400).json({ message: "Password must have atleast one lowercase" });
            }

            // check password have atleast one uppercase
            if (!/[A-Z]/.test(password)) {
                return res.status(400).json({ message: "Password must have atleast one uppercase" });
            }

            // check password have atleast one number
            if (!/[0-9]/.test(password)) {
                return res.status(400).json({ message: "Password must have atleast one number" });
            }

            // check the user already exists
            const existingUser = await User.findOne({ email });

            if (existingUser) {
                if (existingUser.isVerified) {
                    return res.status(400).json({ message: "User already exists" });
                }

                // handling of expired OTP
                if (existingUser.otpExpires < Date.now()) {
                    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
                    existingUser.otp = newOtp;
                    existingUser.otpExpires = new Date(Date.now() + 10 * 60 * 1000);

                    // save existingUser to the database with new OTP
                    await existingUser.save();

                    // send new OTP via email
                    await sendEmail(email, "Your OTP", `OTP for registering in M - Notes : ${newOtp}`)

                    // send response to the user for new OTP
                    return res.status(200).json({ message: "OTP has been sent to your email" });
                }
                return res.status(400).json({ message: "Verification pending. Check your email for OTP" });
            }

            // encrypt the password before newUser
            const hashedPassword = await bcrypt.hash(password, 10);

            // generate OTP for verification
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

            // create new user 
            const newUser = new User({
                name,
                email,
                password: hashedPassword,
                otp,
                otpExpires
            })

            // save user in the database with OTP
            await newUser.save();

            // send OTP for verification via email
            await sendEmail(email, "Your OTP", `OTP for registering in M - Notes : ${otp}`);

            // send response to the user
            return res.status(201).json({ message: "OTP sent to your email for verification" });
        }
        catch (error) {
            return res.status(500).json({ message: "Registration failed" });
        }
    },
    verifyOtp: async (req, res) => {
        try {
            // get OTP & email from request body
            const { email, otp } = req.body;

            // validate input
            if (!email || !otp) {
                return res.status(400).json({ message: "All fields are required" });
            }

            // check the user exists in database
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            // check the user already verified
            if (user.isVerified) {
                return res.status(400).json({ message: "User already verified" });
            }

            // validate OTP
            if (user.otp !== otp || user.otpExpires < Date.now()) {
                return res.status(400).json({ message: "Invalid or expired OTP" });
            }

            // clear the OTP fields
            user.isVerified = true;
            user.otp = undefined;
            user.otpExpires = undefined;

            // save the user to the database
            await user.save();

            // send response to the user
            return res.status(200).json({ message: "User verified and registered successfully" });
        }
        catch (error) {
            return res.status(500).json({ message: "OTP Verification failed" });
        }
    },
    login: async (req, res) => {
        try {
            res.status(200).json({ message: "Login okay" });
        }
        catch (error) {
            return res.status(500).json({ message: "Login failed" });
        }
    },
    logout: async (req, res) => {
        try {
            res.status(200).json({ message: "Logout okay" });
        }
        catch (error) {
            return res.status(500).json({ message: "Logout failed" });
        }
    },
    me: async (req, res) => {
        try {
            res.status(200).json({ message: "Profile okay" });
        }
        catch (error) {
            return res.status(500).json({ message: "Failed to retrieve user" });
        }
    }
}

module.exports = authController;