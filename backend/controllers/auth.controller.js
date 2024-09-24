import bcryptjs from 'bcryptjs';
import crypto from 'crypto';

import {User} from '../models/User.js';
import {generateTokenAndSetCookie} from '../utils/generateTokenAndSetCookie.js';
import {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,


  
  sendRequestSuccessEmail,
} from '../mailtrap/email.js';

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

export const forgetPassword = async (req, res) => {
  const {email} = req.body;
  try {
    const user = await User.findOne({email});
    if (!user) {
      return res
        .status(400)
        .json({sucess: false, message: 'The email is not exist'});
    }

    //generate reset toke
    const resetPasswordToken = crypto.randomBytes(20).toString('hex');
    const resetPasswordExpiresAt = Date.now() + 1 * 24 * 60 * 60 * 1000; // will expire reset password with in 1hours.

    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpiresAt = resetPasswordExpiresAt;

    await user.save();

    const resetPasswordLink = `${process.env.CLIENT_URL}/reset-password/${resetPasswordToken}`;

    // send email for reset password
    await sendPasswordResetEmail(email, resetPasswordLink);

    res
      .status(200)
      .json({sucess: true, message: 'Password reset link sent to your email'});
  } catch (error) {
    res.status(400).json({
      sucess: false,
      message: error.message,
    });
    console.log(`Error for forget password ${error.message}`);
  }
};

export const resetPassword = async (req, res) => {
  const {token} = req.params;
  const {password} = req.body;
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: {$gt: Date.now()},
    });
    if (!user) {
      return res.status(400).json({
        sucess: false,
        message: 'Invalid or expired reset password',
      });
    }

    // update password
    const hashPassword = await bcryptjs.hash(password, 10);
    user.password = hashPassword;
    user.resetPasswordExpiresAt = undefined;
    user.resetPasswordToken = undefined;
    await user.save();

    // send password reset success mail
    await sendRequestSuccessEmail(user.email);

    res
      .status(200)
      .json({sucess: true, message: 'Password reset successfully'});
  } catch (error) {
    console.log(error.message);
    res.status(400).json({sucess: false, message: error.message});
  }
};

export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(400).json({success: false, message: 'user not found'});
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log('Error is checkauth', error);
    res.status(400).json({success: false, message: error.message});
  }
};
