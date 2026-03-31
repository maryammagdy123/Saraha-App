import { redisClient } from "../DB/index.js";
import { getFromCache } from "../DB/redis/redis.helper.js";
import { userRepo } from "../DB/Repo/index.js";
import { verifyToken } from "../Utils/index.js";

export const verifyTokenMiddleware = (mode = "strict", roles = []) => {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        if (mode === "strict") {
          return res.status(401).json({
            message: "Authorization token is required",
          });
        }
        return next(); // optional auth if user is anonymous
      }
      //.split(" ")[1]
      const token = authHeader;
      const isBlacklisted = await getFromCache(`BLACKLIST:${token}`);
      if (isBlacklisted) throw new Error("Token revoked");

      if (isBlacklisted) {
        throw new Error("Token revoked");
      }

      const decoded = verifyToken(token);
      const user = await userRepo.findById({ id: decoded.id });
      req.user = user;
      //req.user.id

      // ✅ check roles
      if (roles.length > 0) {
        if (!roles.includes(user.role)) {
          return res.status(403).json({
            message: "Forbidden: not authorized",
          });
        }
      }
      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }
  };
};
