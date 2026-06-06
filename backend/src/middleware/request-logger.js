import fs from "fs";
import path from "path";
import morgan from "morgan";

const logFilePath = path.join(process.cwd(), "log.md");

// Create stream for morgan to write to
const logStream = fs.createWriteStream(logFilePath, { flags: "a" });

// Custom markdown format
// Output example: | GET | /api/v1/health | 200 | 5ms | 2026-06-06T... |
morgan.format(
  "markdown",
  "| :method | :url | :status | :response-time ms | :date[iso] |"
);

// We define a function to initialize the logger
export const requestLogger = () => {
  // Write table header if file is empty
  if (!fs.existsSync(logFilePath) || fs.statSync(logFilePath).size === 0) {
    fs.writeFileSync(
      logFilePath,
      "# Backend Request Logs\n\n| Method | URL | Status | Duration | Timestamp |\n|---|---|---|---|---|\n"
    );
  }

  return morgan("markdown", { stream: logStream });
};
