import jwt from "jsonwebtoken";

export function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  console.log(token);

  if (!token) {
    return res.status(400).json({ message: "Token missing" });
  }

  try {
    const decode = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decode;
    
    

    next();
  } catch (err) {
    return res.status(400).json({ message: "Error in token verfication" });
  }
}

export function checkRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
}
