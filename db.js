const { MongoClient, ObjectId } = require('mongodb')

const connectionUrl = 'mongodb://127.0.0.1:27017'
const dbName = 'peliculas'

let db

const init = () =>
  MongoClient.connect(connectionUrl, { useNewUrlParser: true }).then((client) => {
    db = client.db(dbName)
    let movies = db.collection('movies');
    movies.createIndex({title: "text", fullplot: "text", cast: "text"});
  })

const insertItem = (item) => {
  const collection = db.collection('movies')
  return collection.insertOne(item)
}


const getPelis = (input) => {
  const filter = {$text: {$search: input}}
  const projection = {
    'title': 1,
    '_id': 0,
    'year': 1,
    'imdb': 1,
    'tomatoes': 1,
    'metacritic': 1,
    'poster': 1,
  };
  const coll = db.collection('movies');
  const cursor = coll.find(filter, { projection }).limit(50);
  const result = cursor.toArray();
  return result;
}

const getPeliCompleja = () => {
  const filter = {
    $or: [{ title: { $regex: input } }, { fullplot: { $regex: input } }, { cast: { $in: [input] } }]
  };
  const projection = {
    'title': 1,
    '_id': 0,
    'year': 1,
    'imdb': 1,
    'tomatoes': 1,
    'metacritic': 1,
    'poster': 1,
  };
  const coll = db.collection('movies');
  const cursor = coll.find(filter, { projection });
  const result = cursor.toArray();
  return result;
}

const getPelisRandom = () => {
  const projection = {
    'title': 1,
    'fullplot': 1,
    'cast': 1,
    '_id': 0,
    'year': 1,
    'poster': 1,
  };
  const coll = db.collection('movies');
  const cursor = coll.aggregate([
    {
      '$sample': {
        'size': 5
      }
    }, {
      '$project': projection
    }
  ]);
  const result = cursor.toArray();
  return result;
}


module.exports = { init, insertItem, getPelis, getPeliCompleja, getPelisRandom }
