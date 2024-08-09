const User = require('../models/User.js');
const AppError = require('../utils/errorUtil.js');

const cookieOptions = {
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  httpOnly: true,
  secure: true, // Note: Set to true if deploying over HTTPS
};

const register = async (req, res, next) => {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
        return next(new AppError("All fields are required", 400));
    }

    try {
        let user = await User.findOne({ email });
        if (user) {
            return next(new AppError("Email already exists!", 400));
        }

        const newUser = await User.create({
            fullName,
            email,
            password,
        });

        let token = await newUser.generateJWTToken();
        newUser.password = undefined; // Ensure password is not sent in response

        res.cookie('jwt', token, {
            httpOnly: true, // Ensure cookie is not accessible via client-side scripts
            secure: process.env.NODE_ENV === 'production', // Set to true in production
            sameSite: 'strict', // Prevents cross-site request forgery
            maxAge: 24 * 60 * 60 * 1000, // Cookie expiry time (1 day)
          });

        res.status(201).json({
            success: true,
            message: "User registered and logged in successfully!",
            user: newUser,
            token: token, // Send the token in the response
        });
    } catch (err) {
        return next(new AppError(err.message, 500));
    }
};


const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new AppError("Email and Password are required", 400));
        }
        
        const user = await User.findOne({ email }).select("+password");
        
        if (!user || !(await user.comparePassword(password))) {
            return next(new AppError("Email or password does not match", 400));
        }

        let token = await user.generateJWTToken();
        user.password = undefined; // Ensure password is not sent in response

        res.cookie('jwt', token, {
            httpOnly: true, // Ensure cookie is not accessible via client-side scripts
            secure: process.env.NODE_ENV === 'production', // Set to true in production
            sameSite: 'strict', // Prevents cross-site request forgery
            maxAge: 24 * 60 * 60 * 1000, // Cookie expiry time (1 day)
          });

        res.status(200).json({
            success: true,
            message: "User logged in successfully!",
            user,
            token, // Send the token in the response
        });
    } catch (err) {
        return next(new AppError(err.message, 500));
    }
};


const logout = (req, res) => {
    res.cookie("token", null, {
      secure: true,
      maxAge: 0,
      httpOnly: true,
    });
  
    res.status(200).json({
      success: true,
      message: "User logged out successfully!",
    });
};

const addToFavourites = (req, res) => {
    // console.log(req.body)
}  
module.exports = {
  register,
  login,
  logout,
  addToFavourites
};
