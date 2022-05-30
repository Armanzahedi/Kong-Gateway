var fetch = require("node-fetch");
// import kong from"../../kong-typedef"
class KongPlugin {
  config;
  constructor(config) {
    this.config = config;
  }

  blockId;

  async access(kong) {
    try {
      var reqMethod = await kong.request.getMethod();
      var reqPath = await kong.request.getPath();
      var reqHeaders = await kong.request.getHeaders();


      var res = await fetch(this.config.requestInterceptorUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json",...reqHeaders },
        body:JSON.stringify({
          method: reqMethod,
          path: reqPath,
        }),
      })
      var data = await res.json();

      this.blockId = data.blockId;

      await kong.ctx.shared.set("block",data.blockId);
      var blockId = await kong.ctx.get("block");

      console.log("-------------------------------------------------req-ctx",blockId);
      console.log("-------------------------------------------------req-class",this.blockId);

      if (res.status != 200) {
        return kong.response.error(401, "Access Denied");
      }
    } catch (e) {
      console.log("error", e);
      return kong.response.exit(500, "internal server error");
    }
  }
  async response(kong) {
    if (await kong.response.getSource() == "service") {
      var blockId = await kong.ctx.shared.get("block");
      var res = await fetch(this.config.responseInterceptorUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body:JSON.stringify({
          blockId: blockId
        }),
      })

      console.log("-------------------------------------------------res-ctx",blockId);
      console.log("-------------------------------------------------req-class",this.blockId);
    }
  }
}
//@ts-ignore
module.exports = {
  Plugin: KongPlugin,
  Name: "js-metering",
  Schema: [
    {
      requestInterceptorUrl: { type: "string" },
    },{
      responseInterceptorUrl: { type: "string" }
    }
  ],
  Version: "0.1.0",
  Priority: 1000,
};
