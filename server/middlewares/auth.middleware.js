import jwt from "jsonwebtoken";
import { prisma } from "#config/db.config.js";
import rateLimit from "express-rate-limit";

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      message: "Access Denied. Too many login attempts.",
    });
  },
});

const protect = async (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          name: true,
          email: true,
          isAdmin: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Access Denied");
    }
  } else {
    res.status(401);
    throw new Error("Access Denied");
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error("Not authorized as an administrator");
  }
};

export { protect, admin, loginLimiter };
