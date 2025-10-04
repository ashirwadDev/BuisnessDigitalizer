// middleware/auth.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // store id separately for simple comparisons
      req.userId = decoded.id;
      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) return res.status(401).json({ msg: "User not found" });
      next();
    } catch (err) {
      console.error("Auth middleware error:", err);
      return res.status(401).json({ msg: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ msg: "Not authorized, no token" });
  }
};
