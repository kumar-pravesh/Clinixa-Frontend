require("dotenv").config();
const app = require("./app");
const sequelize = require("./config/db");

(async () => {
  try {
    await sequelize.authenticate();
    console.log("PostgreSQL connected");

    await sequelize.sync();

    app.listen(process.env.PORT, () => {
      console.log(`Server running on ${process.env.PORT}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error);
  }
})();
