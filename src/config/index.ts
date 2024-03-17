import dotenv from "dotenv";
dotenv.config();

const config = {
  launcher: {
    URI: process.env.LAUNCHER_URI || "http://localhost:3000",
    databaseFile: "sensor-sight.json",
  },
};

export { config };
