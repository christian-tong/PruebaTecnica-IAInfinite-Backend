const {
  generateToken,
  validateToken,
} = require("../controllers/tokenController");

const tokenRoutes = [
  {
    method: "GET",
    path: "/token",
    handler: generateToken,
  },
  {
    method: "POST",
    path: "/validate-token",
    handler: validateToken,
  },
];

module.exports = tokenRoutes;
