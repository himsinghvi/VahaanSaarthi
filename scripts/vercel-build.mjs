import { cpSync, mkdirSync, rmSync } from "node:fs";
import { execSync } from "node:child_process";

execSync("npm install --prefix frontend", { stdio: "inherit" });
execSync("npm run build --prefix frontend", { stdio: "inherit" });

rmSync("public", { recursive: true, force: true });
mkdirSync("public", { recursive: true });
cpSync("frontend/dist", "public", { recursive: true });
