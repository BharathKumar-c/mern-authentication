import jwt from 'jsonwebtoken';

export const generateTokenAndSetCookie = (res, userId) => {
  // generate jwt token
  const token = jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: '7d'});

  // set that token into cookie
  res.cookie('token', token, {
    httpOnly: true, // acess cookie in brower.
    secure: process.env.NODE_ENV === 'production', // if node evn is production https. but if node is dev http.
    sameStie: 'strict', // csrf
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7days this token set on cookie.
  });

  return token;
};
