const { LineNotify } = require('bottender');

module.exports = new LineNotify({
  clientId: process.env.LINE_NOTIFY_CLIENT_ID,
  clientSecret: process.env.LINE_NOTIFY_CLIENT_SECRET,
  redirectUri: `${process.env.ROOT_PATH}/notify/redirect`,
});