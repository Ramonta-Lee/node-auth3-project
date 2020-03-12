const router = require("express").Router();

const Users = require("./users-model.js");

router.get("/", (req, res) => {
  const department = req.decodedToken.department
  Users.findByDepartment(department)
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

module.exports = router;
