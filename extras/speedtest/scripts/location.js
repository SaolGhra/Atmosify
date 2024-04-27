const axios = require("axios");

async function getUserLocation() {
  try {
    const response = await axios.get("https://api64.ipify.org?format=json");
    const { ip } = response.data;

    const ipv6Response = await axios.get(
      "https://api64.ipify.org?format=json&ipv6=true"
    );
    const { ip: ipv6 } = ipv6Response.data;

    const locationResponse = await axios.get(`https://ipapi.co/${ip}/json/`);
    const { city, region, country_name } = locationResponse.data;

    return {
      ip,
      ipv6,
      location: `${city}, ${region}, ${country_name}`,
    };
  } catch (error) {
    console.error("Error retrieving user location:", error);
    return null;
  }
}

module.exports = getUserLocation;
