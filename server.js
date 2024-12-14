// server.js
const express = require("express");
const geoip = require("geoip-lite");
const { links, defaultLinks } = require("./links");
const useragent = require("useragent");

const app = express();
const port = process.env.PORT || 3000;

function getDeviceType(userAgentString) {
  const agent = useragent.parse(userAgentString);
  return agent.device.family === "Other" ? "desktop" : "mobile";
}

function getGeo(ip) {
  const geoData = geoip.lookup(ip);
  return geoData?.country || null;
}

function getRedirectLink(geo, deviceType) {
  const validLinks = links.filter((link) => {
    return (
      link.geo.toLowerCase() === geo?.toLowerCase() &&
      link[deviceType] === true
    );
  });

  if (validLinks.length > 0) {
    const randomIndex = Math.floor(Math.random() * validLinks.length);
    return validLinks[randomIndex].link;
  } else {
    const randomDefaultIndex = Math.floor(Math.random() * defaultLinks.length);
    return defaultLinks[randomDefaultIndex];
  }
}

app.get("/", (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const userAgent = req.headers["user-agent"] || "";

  const geo = getGeo(ip);
  const deviceType = getDeviceType(userAgent);

  const redirectLink = getRedirectLink(geo, deviceType);

  res.redirect(302, redirectLink);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
