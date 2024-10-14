const Hapi = require("@hapi/hapi");
const crypto = require("crypto");
const mysql = require("mysql2/promise");
const redis = require("redis");
const amqp = require("amqplib");

const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: "localhost",
  });

  const db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "prueba_tecnica_db",
  });

  const redisClient = redis.createClient();
  redisClient.connect().catch(console.error);

  const rabbitConnection = await amqp.connect("amqp://localhost");
  const channel = await rabbitConnection.createChannel();
  await channel.assertQueue("email_queue");

  server.route({
    method: "GET",
    path: "/token",
    handler: async (request, h) => {
      const token = crypto.randomBytes(4).toString("hex");

      await db.execute("INSERT INTO tokens (token) VALUES (?)", [token]);
      return { token };
    },
    options: {
      cors: {
        origin: ["*"],
        headers: ["Authorization", "Content-Type"],
      },
    },
  });

  server.route({
    method: "POST",
    path: "/validate-token",
    handler: async (request, h) => {
      const { token } = request.payload;
      const [rows] = await db.execute("SELECT * FROM tokens WHERE token = ?", [
        token,
      ]);
      if (rows.length > 0) {
        return { valid: true };
      } else {
        return { valid: false };
      }
    },
  });

  server.route({
    method: "POST",
    path: "/register-client",
    handler: async (request, h) => {
      const { token, clientData } = request.payload;

      const [rows] = await db.execute("SELECT * FROM tokens WHERE token = ?", [
        token,
      ]);
      if (rows.length === 0) {
        return h.response({ error: "Invalid token" }).code(400);
      }

      await db.execute("INSERT INTO clients (name, email) VALUES (?, ?)", [
        clientData.name,
        clientData.email,
      ]);

      const sendEmails = await redisClient.get("send_emails");
      if (sendEmails === "true") {
        channel.sendToQueue(
          "email_queue",
          Buffer.from(
            JSON.stringify({
              email: clientData.email,
              subject: "Bienvenido",
              message: "Gracias por registrarte!",
            })
          )
        );
      }

      return { message: "Cliente registrado exitosamente" };
    },
    options: {
      cors: {
        origin: ["*"],
        headers: ["Authorization", "Content-Type"],
      },
    },
  });

  await server.start();
  console.log("Servidor en: %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
