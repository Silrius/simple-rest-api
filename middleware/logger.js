// Simple request logging middleware
function logger(req, res, next) {
  const time = new Date().toISOString();
  console.log(`[${time}] ${req.method} ${req.url}`);

  // If the request has a body (POST/PUT/PATCH), log it
  if (["POST", "PUT", "PATCH"].includes(req.method)) {
    console.log("Body:", req.body);
  }

  next(); // move to the next handler
}

module.exports = logger;
