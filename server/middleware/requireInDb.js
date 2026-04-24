export const requireDBUser = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      message: "User not found in DB",
    });
  }
  next();
};