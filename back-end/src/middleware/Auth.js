export default function authMiddleware(req, res, next) {
  // If you already have a user session/cookie, replace this logic with real auth check
  const userId = req.header("x-user-id") || req.query.userId || req.body.userId;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Attach userId to request for downstream use
  req.userId = userId;
  next();
}
