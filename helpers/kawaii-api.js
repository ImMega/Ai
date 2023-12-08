const axios = require("axios").default;

let APIkey = "anonymous";

if(process.env.KAWAII_API) APIkey = process.env.KAWAII_API;

module.exports = {
    getGIF: async (action) => {
        try {
            return (await axios.get(`https://kawaii.red/api/gif/${action}/token=${APIkey}/`)).data.response;
        } catch (err) {
            console.log("\x1b[31m"+err+"\x1b[0m");
        }
    }
}