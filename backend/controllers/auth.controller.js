import {User} from '../models/User.js';
import bcryptjs from 'bcryptjs';
import {generateTokenAndSetCookie} from '../utils/generateTokenAndSetCookie.js';
import {sendVerificationEmail, sendWelcomeEmail} from '../mailtrap/email.js';

export const signup = async (req, res) => {
  const {email, password, name} = req.body;

  try {
    if (!email || !password || !name) {
      throw new Error('All fileds are required');
    }

    const userIsExist = await User.findOne({email});

    if (userIsExist) {
      res.status('400').json({sucess: false, message: 'User already exist.'});
    }

    const hashPassword = await bcryptjs.hash(password, 10);

    const user = new User({
      email,
      password: hashPassword,
      name,
      verificationToken: Math.floor(100000 + Math.random() * 900000),
      verificationExpiresAt: Date.now() + 24 * 60 * 60 * 1000, //24 hours
    });

    await user.save();

    // JWT
    generateTokenAndSetCookie(res, user._id);

    // send verification email
    await sendVerificationEmail(user.email, user.verificationToken);

    res.status(201).json({
      sucess: true,
      message: 'User has been created',
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(400).json({sucess: false, message: error.message});
  }
};

export const login = async (req, res) => {
  const {email, password} = req.body;
  try {
    const user = await User.findOne({email});
    if (!user) {
      return res
        .status(400)
        .json({sucess: false, message: 'Credential is invalid'});
    }

    const isValidPassword = await bcryptjs.compare(password, user.password);
    if (!isValidPassword) {
      return res
        .status(400)
        .json({sucess: false, message: 'Credential is invalid'});
    }
    generateTokenAndSetCookie(res, user._id);
    user.lastlogin = new Date();
    await user.save();

    res.status(200).json({
      sucess: true,
      message: 'Logged in successfully',
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log(`error at login ${error}`);
    res.status(400).json({sucess: false, message: error.message});
  }
};

export const logout = async (req, res) => {
  res.clearCookie('token');
  res.status(200).json({sucess: true, message: 'Logout successfully'});
};

export const verifyEmail = async (req, res) => {
  const {code} = req.body;
  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationExpiresAt: {$gt: Date.now()},
    });

    console.log(user);
    if (!user) {
      return res
        .status(400)
        .json({sucess: false, message: 'invalid or expired verification code'});
    }

    user.isVerified = true;
    user.verificationExpiresAt = undefined;
    user.verificationToken = undefined;
    await user.save();

    await sendWelcomeEmail(user.name, user.email);

    res.status(200).json({
      sucess: true,
      message: 'Email verified successfully',
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(500).json({sucess: false, message: error.message});
    console.log(`Error at verify the email ${error.message}`);
  }
};
