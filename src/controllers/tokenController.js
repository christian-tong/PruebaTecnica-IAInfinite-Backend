const crypto = require("crypto");
const { saveToken, getToken } = require("../models/tokenModel");

const generateToken = async (request, h) => {
  const token = crypto.randomBytes(4).toString("hex");
  await saveToken(token);
  return { token };
};

const validateToken = async (request, h) => {
  const { token } = request.payload;
  const isValid = await getToken(token);
  return { valid: !!isValid };
};

module.exports = { generateToken, validateToken };
