const { registerClient } = require("../controllers/clientController");

const clientRoutes = [
  {
    method: "POST",
    path: "/register-client",
    handler: registerClient,
  },
];

module.exports = clientRoutes;
