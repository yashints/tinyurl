const { app } = require("@azure/functions");
const { TableClient } = require("@azure/data-tables");
const { createFileOnGitHub, getFileFromGitHub } = require("./Shared/github");

const tableName = process.env.TABLE_NAME || "urls";
const tableClient = TableClient.fromConnectionString(
  process.env.AzureWebJobsStorage,
  tableName
);

const getUrls = async () => {
  const result = tableClient.listEntities();
  const urls = [];
  for await (const entity of result) {
    urls.push(entity);
  }

  return urls;
};

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

    const urls = await getUrls();
    console.log(urls);
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
        Math.random().toString(32).substring(2, 5) +
        Math.random().toString(32).substring(2, 5)
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

    //write to github
    const urls = await getUrls();
    const ok = await createFileOnGitHub(urls);

    if (ok != 200 && ok != 201) {
      context.log(`Failed to write to GitHub`);
      return {
        status: 500,
        jsonBody: { message: "Failed to write to GitHub" },
      };
    }

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

    //write to github
    const urls = await getUrls();
    const ok = await createFileOnGitHub(urls);

    if (ok != 200 && ok != 201) {
      context.log(`Failed to write to GitHub`);
      return {
        status: 500,
        jsonBody: { message: "Failed to write to GitHub" },
      };
    }

    return { status: 204 };
  },
});
