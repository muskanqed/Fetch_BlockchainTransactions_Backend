require("dotenv").config();
const cors = require('cors')
const DataBaseConnection = require('./Configurations/Connectdatabase')

const express = require("express");
const { _corsOptionsDelegate } = require("./utilities/CorsDelgate");
const server = express();
const port = process.env.PORT || 3000;

server.use(express.json());

server.get("/health", (request, response) => {
  const healthchecker = {
    uptime: process.uptime(),
    message: "Fine",
    timestamp: Date.now(),
  };
  try {
    response.send(healthchecker);
  } catch (error) {
    healthchecker.message = error;
    response.status(503).send();
  }
});

//Connect to database
(async() => {
  await DataBaseConnection()
})()
server.use(cors(_corsOptionsDelegate));
server.use(express.json())

server.use(require('./Routes/index'))
server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
