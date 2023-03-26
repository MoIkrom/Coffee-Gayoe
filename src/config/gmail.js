const { google } = require("googleapis");

const clientId = process.env.CLIENT_ID_GOOGLE;
const clientsecret = process.env.CLIENT_SECRET_GOOGLE;
const refreshToken = process.env.REFRESH_TOKEN_GOOGLE;

const { OAuth2 } = google.auth;
const OAuth2Client = new OAuth2(clientId, clientsecret);
OAuth2Client.setCredentials({
  refresh_token: refreshToken,
});

const accessToken = OAuth2Client.getAccessToken;

module.exports = {
  clientId,
  clientsecret,
  refreshToken,
  accessToken,
};
