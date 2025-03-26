// src/utils/pkcetoggle.ts
import fs from "fs";
import path from "path";

// Define the path to your JSON file
const filePath = path.join(process.cwd(), "src/data", "pkceStatus.json");

function readStatusFromFile(): boolean {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    const json = JSON.parse(data);
    return json.pkceEnabled;
  } catch (error) {
    // If there's an error (e.g., file doesn't exist), return default value
    console.error("Error reading PKCE status file:", error);
    return false;
  }
}

function writeStatusToFile(status: boolean): void {
  try {
    const data = { pkceEnabled: status };
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
  } catch (error) {
    console.error("Error writing PKCE status file:", error);
  }
}

export function getPkceStatus(): boolean {
  return readStatusFromFile();
}

export function setPkceStatus(enable: boolean): void {
  writeStatusToFile(enable);
}