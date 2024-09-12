import {User} from '../models/User.js';
import bcryptjs from 'bcryptjs';
import {generateTokenAndSetCookie} from '../utils/generateTokenAndSetCookie.js';
import {sendVerificationEmail} from '../mailtrap/email.js';

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
  res.send('login route');
};
export const logout = async (req, res) => {
  res.send('logout route');
};
