const path = require("path");
import * as fs from "fs";

export function getNodeByToken(token: string) {
  let data = ''
  try {
    // reading a JSON file synchronously
    data = fs.readFileSync(path.resolve(__dirname, "../../data/nodes.json")).toString();
  } catch (error) {
    console.error(error);
    throw error;
  }
  
  // parsing the JSON content
  const nodes = JSON.parse(data);
  const node = nodes.find((node) => node.token === token)
  
  // const node = db.getNodeByToken(token);
  if (!node) throw new Error("Node not found with this token");
  return node
}