const axios = require("axios");

axios.defaults.baseURL = "https://api.github.com/repos/yashints/tinyurl/contents/urls.json";
axios.defaults.headers.common["Accept"] = "application/vnd.github+json";
axios.defaults.headers.common["Authorization"] = "Bearer " + process.env.GITHUB_TOKEN;
axios.defaults.headers.common["X-GitHub-Api-Version"] = "2022-11-28";

const createFileOnGitHub = async (data) => {
  console.log("Creating file on GitHub");
  const base64Data = Buffer.from(JSON.stringify(data)).toString("base64");

  const body = {
    message: `Updated urls.json ${Date.now()}`,
    committer: {
      name: "Yaser Adel Mehraban",
      email: "adel.mehrban@gmail.com",
    },
    content: base64Data,
  };

  const file = await getFileFromGitHub();
  if (file) {
    body.sha = file.sha;
  }
  console.log(body);
  console.log(data);
  const res = await axios.put("", body);
  return res.status;
};

const getFileFromGitHub = async () => {
  const response = await axios.get();
  return response.data;
};

module.exports = { createFileOnGitHub, getFileFromGitHub };
