const { app } = require("@azure/functions");
const { TableClient } = require("@azure/data-tables");

const tableName = process.env.TABLE_NAME || "urls";
const tableClient = TableClient.fromConnectionString(process.env.AzureWebJobsStorage, tableName);

app.get("getUrls", {
  authLevel: "anonymous",
  route: "urls/{shortUrl?}",
  handler: async (request, context) => {
    context.log(`Get method called ${request.params.shortUrl}`);

    if (request.params.shortUrl) {
      const result = tableClient.getEntity("year", request.params.shortUrl);
      const url = await result;
      return { jsonBody: url };
    }

    const result = tableClient.listEntities();
    const urls = [];
    for await (const entity of result) {
      urls.push(entity);
    }

    return { jsonBody: urls };
  },
});

app.post("createUrl", {
  route: "urls",
  authLevel: "anonymous",
  handler: async (request, context) => {
    const requestBody = await request.json();

    let { shortUrl, longUrl } = requestBody;

    context.log(`Post method called with ${longUrl} and ${shortUrl}`);

    if (!longUrl) {
      return {
        status: 400,
        body: "Please provide a URL to be shortened in the request body",
      };
    }

    if (!shortUrl) {
      shortUrl = `yas.fyi/${
        Math.random().toString(32).substring(2, 5) + Math.random().toString(32).substring(2, 5)
      }`;
    } else {
      shortUrl = `yas.fyi/${shortUrl}`;
    }

    const entity = {
      partitionKey: `year`,
      rowKey: shortUrl.split("/")[1],
      short: shortUrl,
      url: longUrl,
      pageViewCount: 0,
    };

    await tableClient.createEntity(entity);

    return { status: 201, jsonBody: { shortUrl, longUrl } };
  },
});

app.http("deleteUrl", {
  methods: ["DELETE"],
  route: "urls",
  authLevel: "anonymous",
  handler: async (request, context) => {
    context.log(`Delete method called`);

    const body = await request.json();

    await tableClient.deleteEntity("year", body.rowKey);

    return { status: 204 };
  },
});
