const Hapi = require("@hapi/hapi");
const tokenRoutes = require("./routes/tokenRoutes");
const clientRoutes = require("./routes/clientRoutes");

const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: "localhost",
    routes: {
      cors: {
        origin: ["*"],
        headers: ["Authorization", "Content-Type"],
      },
    },
  });

  // Configuración de rutas
  server.route([...tokenRoutes, ...clientRoutes]);

  await server.start();
  console.log("Servidor en: %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
