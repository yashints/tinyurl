const { app } = require("@azure/functions");
const { LogsQueryClient, Durations, LogsQueryResultStatus } = require("@azure/monitor-query");
const { DefaultAzureCredential } = require("@azure/identity");
const { TableClient } = require("@azure/data-tables");

const tableName = process.env.TABLE_NAME || "urls";
const tableClient = TableClient.fromConnectionString(process.env.AzureWebJobsStorage, tableName);

const azureLogAnalyticsWorkspaceId = process.env.AZURE_LOG_ANALYTICS_WORKSPACE_ID;
const logsQueryClient = new LogsQueryClient(new DefaultAzureCredential());

const kustoQuery = `
AppPageViews
| where Name == \'React App\'
| where tostring(split(Url, \'/\')[3]) != \'\'
| summarize pageCount = sum(ItemCount) by short = tostring(split(Url, \'/\')[3])`;

const processTables = async (tables, context) => {
  context.log("Processing tables", tables[0].rows.length);
  for (const row of tables[0].rows) {
    const result = tableClient.getEntity("year", row[0]);
    if (!result.IsError) {
      let tableRow = await result;
      tableRow.pageViewCount = +row[1] + +tableRow.pageViewCount;
      context.log("Upserting row", tableRow);
      await tableClient.upsertEntity(tableRow);
    }
  }
};

app.timer("getPageViews", {
  schedule: "0 0 18 * * *",
  handler: async (myTimer, context) => {
    context.log("Timer function processed request.");

    try {
      const result = await logsQueryClient.queryWorkspace(
        azureLogAnalyticsWorkspaceId,
        kustoQuery,
        {
          duration: Durations.twentyFourHours,
        }
      );

      if (result.status === LogsQueryResultStatus.Success) {
        context.log("Kusto query succeeded. Processing results.");
        const tablesFromResult = result.tables;
        if (tablesFromResult.length === 0) {
          context.log(`No results for query '${kustoQuery}'`);
          return;
        }
        await processTables(tablesFromResult, context);
      } else {
        context.error(`Kusto query failed: ${result.partialError}`);
      }
    } catch (error) {
      context.error(error);
    }
  },
});
