const { saveClient } = require("../models/clientModel");
const redisService = require("../services/redisService");
const rabbitmqService = require("../services/rabbitmqService");
const { getToken } = require("../models/tokenModel");

const registerClient = async (request, h) => {
  const { token, clientData } = request.payload;
  const isValid = await getToken(token);

  if (!isValid) {
    return h.response({ error: "Invalid token" }).code(400);
  }

  await saveClient(clientData);
  const sendEmails = await redisService.get("send_emails");

  if (sendEmails === "true") {
    rabbitmqService.sendToQueue("email_queue", {
      email: clientData.email,
      subject: "Bienvenido",
      message: "Gracias por registrarte!",
    });
  }

  return { message: "Cliente registrado exitosamente" };
};

module.exports = { registerClient };
