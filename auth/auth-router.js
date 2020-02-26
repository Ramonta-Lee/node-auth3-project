const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); // npm library

const Users = require("../users/users-model.js");
const { jwtSecret } = require("../config/secrets.js");

// for endpoints beginning with /api/auth
router.post("/register", (req, res) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 10); // 2 ^ n
  user.password = hash;

  Users.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.post("/login", (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user);

        res.status(200).json({
          message: `Welcome ${user.username}!`,
          token
        });
      } else {
        res.status(401).json({ message: "Invalid Credentials" });
      }
    })
    .catch(({ name, code, message, stack }) => {
      res.status(500).json({ name, code, message, stack });
    });
});

// may want to bring this function in from somewhere else
// you can put data in the payload
function generateToken(user) {
  const payload = {
    subject: user.id, // "sub" property
    username: user.username,
    role: user.role || "user"
    // ...other data
  };
  // const secret = process.env.JWT_SECRET || "keep it secret, keep it safe"
  const options = {
    expiresIn: "8h"
    // checkout the library for more options
  };
  return jwt.sign(payload, jwtSecret, options);
}

module.exports = router;
