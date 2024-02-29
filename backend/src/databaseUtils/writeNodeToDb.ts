const path = require("path");
import * as fs from "fs";

// may be async in future
export default function writeNodeToDb({ host, cert, macaroon, token, pubkey }) {
  // the .json file path
  const JSON_FILE = path.resolve(__dirname, "../../data/nodes.json");

  try {
    // reading the JSON file
    const jsonData = fs.readFileSync(JSON_FILE);

    // parsing the JSON content
    const nodes = JSON.parse(jsonData.toString());
    nodes.push({
      host: host,
      cert: cert,
      macaroon: macaroon,
      token: token,
      pubkey: pubkey,
    });

    // updating the JSON file
    fs.writeFileSync(JSON_FILE, JSON.stringify(nodes));
  } catch (error) {
    console.error(error);
    throw error;
  }
}
