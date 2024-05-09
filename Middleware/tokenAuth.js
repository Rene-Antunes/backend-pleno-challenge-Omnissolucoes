const jwt = require("jsonwebtoken")
const JWT_SECRET_KEY = "jwt-secret-key"

//used to validate user token
exports.tokenValidator = (req, res, next) => {
  let token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({
        ok: false,
        message: 'Token is not found',
      })
  }
  try {
    token = token.split(" ")[1];
    if (!token) {
      return res.status(401).json({
          ok: false,
          message: 'Token is not found',
        })
      
    }

    const payload = jwt.verify(token, JWT_SECRET_KEY);
    if (!payload) {
      return res.status(401).json({
        ok: false,
        message: 'Failed to get authorization data',
      })
      
    }

    req.user = payload
    next()
  } catch (error) {
    res.status(401).json({
      ok: false,
      message: String(error),
    });
  }
}
