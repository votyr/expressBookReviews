const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');

const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

/* =========================
   SESSION (GLOBAL FIX)
========================= */
app.use(session({
  secret: "fingerprint_customer",
  resave: true,
  saveUninitialized: true
}));

/* =========================
   AUTH MIDDLEWARE
========================= */
app.use("/auth/*", function auth(req, res, next) {

  if (!req.session || !req.session.authorization) {
    return res.status(403).json({ message: "User not logged in" });
  }

  const token = req.session.authorization.accessToken;

  try {
    const decoded = jwt.verify(token, "access");
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid Token" });
  }
});

/* =========================
   ROUTES
========================= */
app.use("/", customer_routes);
app.use("/", genl_routes);

/* =========================
   START SERVER
========================= */
const PORT = 5000;
app.listen(PORT, () => console.log("Server running on port 5000"));