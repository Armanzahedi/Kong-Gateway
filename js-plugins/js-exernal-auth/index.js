var fetch = require("node-fetch");

class KongPlugin {
  config;
  constructor(config) {
    this.config = config;
  }

  async access(kong) {
    try {
      var method = await kong.request.getMethod();
      var path = await kong.request.getPath();
      var headers = await kong.request.getHeaders();

      var res = await fetch(this.config.url, {
        method: "POST",
        headers: { "Content-Type": "application/json",...headers },
        body:JSON.stringify({
          method: method,
          path: path
        }),
      });

      if (res.status != 200) {
        return kong.response.error(401, "Access Denied");
      }
    } catch (e) {
      console.log("error", e);
      return kong.response.exit(500, "internal server error");
    }
  }
}
//@ts-ignore
module.exports = {
  Plugin: KongPlugin,
  Name: "js-external-auth",
  Schema: [
    {
      url: { type: "string" },
    },
  ],
  Version: "0.1.0",
  Priority: 2000,
};
