
const router = require("express").Router();

const authRouter = require("../auth/auth-router.js");

const usersRouter = require("../users/users-router.js");

const restricted = require("../auth/restricted-middleware.js");

router.use("/auth", authRouter);
router.use("/users", restricted, usersRouter);

// Example of how to hash passwords from the headers.
// router.get("/hash", (req, res) => {
//   const authentication = req.headers.authentication;

//   const hash = bcrypt.hashSync(authentication, 13);

//   res.json({ originalValue: authentication, hashedValue: hash });
// });

router.get("/", (req, res) => {
  res.json({ api: "router working" });
});

module.exports = router;
