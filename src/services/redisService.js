const redis = require("redis");
const client = redis.createClient();
client.connect().catch(console.error);

const get = async (key) => {
  return client.get(key);
};

module.exports = { get };
