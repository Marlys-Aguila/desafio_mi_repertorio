const express = require("express");
const fs = require("fs");

// instanciar express (crear una app)
const app = express();

// levantar el servidor con express en puerto 3000
app.listen(3000, console.log("Server up and running"));

// middleware
app.use(express.json());

// abrir un html desde el servidor
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// rutas o endpoints

/**
 * GET listar todas las canciones
 */
app.get("/canciones", (req, res) => {
  const canciones = JSON.parse(fs.readFileSync("repertorio.json", "utf-8"));
  res.json(canciones);
});

/**
 * POST guardar una nueva canción
 */
app.post("/canciones", (req, res) => {
  const cancion = req.body;
  const canciones = JSON.parse(fs.readFileSync("repertorio.json", "utf-8"));
  canciones.push(cancion);
  fs.writeFileSync("repertorio.json", JSON.stringify(canciones));
  res.status(201).send("Canción agregada al repertorio con éxito");
});

/**
 * PUT editar alguna canción ingresada
 */
app.put("/canciones/:id", (req, res) => {
  const { id } = req.params;
  const cancion = req.body;
  const canciones = JSON.parse(fs.readFileSync("repertorio.json", "utf-8"));
  const indexCancion = canciones.findIndex((p) => p.id == id);

  if (indexCancion === -1) {
    res.status(404).send({
      status: 404,
      error: "ID no existe",
    });
  } else {
    canciones[indexCancion] = cancion;
    fs.writeFileSync("repertorio.json", JSON.stringify(canciones));
    res.status(200).send("Canción editada en el repertorio con éxito");
  }
});

/**
 * DELETE eliminar una canción
 */
app.delete("/canciones/:id", (req, res) => {
  const { id } = req.params;
  const canciones = JSON.parse(fs.readFileSync("repertorio.json", "utf-8"));
  const indexCancion = canciones.findIndex((p) => p.id == id);
  if (indexCancion === -1) {
    res.status(404).send({
      status: 404,
      error: "ID no existe",
    });
  } else {
    canciones.splice(indexCancion, 1);
    fs.writeFileSync("repertorio.json", JSON.stringify(canciones));
    res.status(200).send("Canción eliminada con éxito");
  }
});
