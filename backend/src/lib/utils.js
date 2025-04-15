import jwt from "jsonwebtoken";

export const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });

  res.cookie("jwt", token, {
    httpOnly: true, // prevent XSS attacks
    sameSite: "strict", // CSRF attacks (Cross-Site Request Forgery)
    secure: process.env.NODE_ENV !== "development",
    maxAge: process.env.JWT_EXPIRE_NUMBER * 24 * 60 * 60 * 1000, // 7 days with milliseconds
  });

  return token;
};
