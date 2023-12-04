const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 3001;
const cors = require("cors");

const { handleTypeError } = require("./middleware/errors");
const { dbConnection } = require("./config/config");

dbConnection();
app.use(express.json());
app.use(cors());

app.use("/posts", require("./routes/posts"));
app.use("/users", require("./routes/users"));
app.use("/comments", require("./routes/comments"));
app.use("uploads", express.static("uploads"));

app.use(handleTypeError);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
