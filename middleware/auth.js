const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({
    success: false,
    error: 'Unauthorized',
    message: 'You must be logged in to access this resource.'
  });
};

module.exports = { isAuthenticated };