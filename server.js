const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const logger = require("morgan");
const cors = require("cors");
const passport = require("passport");
require("dotenv").config();

/*
 * IMPORTAR RUTAS
 */
const usersRoutes = require("./routes/userRoutes");

const port = process.env.PORT || 3000;
const host = process.env.HOST || "127.0.0.1";
app.use(logger("dev"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cors());
app.use(passport.initialize());
app.use(passport.session());

require("./config/passport")(passport);

app.disable("x-powered-by");

/*
 * LLAMADO DE LAS RUTAS
 */
usersRoutes(app);

server.listen(port, host, function () {
  console.log(`http://${host}:${port}`);
});

// ERROR HANDLER
app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status || 500).send(err.stack);
});

app.get("/", (req, res) => {
  res.send("Ruta raiz del backend");
});

module.exports = {
  app: app,
  server: server,
};

// 200 - ES UN RESPUESTA EXITOSA
// 404 - SIGNIFICA QUE LA URL NO EXISTE
// 500 - ERROR INTERNO DEL SERVIDOR
