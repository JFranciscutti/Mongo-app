const express = require('express')
const { insertItem, getPelis, getPelisRandom, getPeliCompleja } = require('./db')
const Joi = require("@hapi/joi");

const router = express.Router();

router.get('/public', (req, res) => {
  res.sendFile(__dirname + "/public");
});

const itemSchema = Joi.object({
  title: Joi.string().required(),
  fullplot: Joi.string(),
  year: Joi.string().required(),
  cast: Joi.string(),
  poster: Joi.string(),
})

// Obtener las peliculas solicitadas
router.get('/peliculas', (req, res) => {
  getPelis(req.query.input)
    .then((items) => {
      items = items.map((item) => ({
        title: item.title,
        year: item.year,
        imdb: item.imdb?.rating || "-",
        tomatoes: item.tomatoes?.critic?.rating || "-",
        metacritic: item.metacritic || "-",
        poster: item.poster,
      }))
      res.json(items)
    })
    .catch((err) => {
      console.log(err)
      res.status(500).end()
    })
})

//obtener peliculas con una query compleja, pero hardcodeada
router.get('/peliculas-advanced', (req, res) => {
  getPeliCompleja()
    .then((items) => {
      items = items.map((item) => ({
        title: item.title,
        year: item.year
      }))
      res.json(items)
    })
    .catch((err) => {
      console.log(err)
      res.status(500).end()
    })
})

router.get('/pelicula-random', (req, res) => {
  getPelisRandom()
    .then((items) => {
      items = items.map((item) => ({
        title: item.title,
        year: item.year,
        poster: item.poster,
        cast: item.cast || "-",
        fullplot: item.fullplot || "-",
      }))
      res.json(items)
    })
    .catch((err) => {
      console.log(err)
      res.status(500).end()
    })
})

// Postear una pelicula
router.post('/create-pelicula', (req, res) => {
  if (!!req.body) {
    insertItem(req.body)
      .then(() => {
        res.json(req.body);
        res.status(200).end()
      })
      .catch((err) => {
        console.log(err)
        res.status(500).end()
      })
  } else {
    res.status(500).end()
  }
})


module.exports = router
