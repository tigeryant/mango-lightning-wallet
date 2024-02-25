import { getInfo } from "./api/http";

// unused
export async function fetchInfo() {
  const info = await getInfo();
  return { alias: info.alias, balance: parseInt(info.balance) };
}
