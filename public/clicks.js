const button = document.getElementById('buttonBuscar');
const inputSearch = document.getElementById('inputSearch');
const advancedButton = document.getElementById('buttonAdvanced');
const generateButton = document.getElementById('buttonGenerate');

button.addEventListener('click', function (e) {
  // realizar la busqueda y generar la lista 
  fetch('/peliculas' + `?input=${inputSearch.value}`, { method: 'GET' })
    .then(function (response) {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Request failed.');
    })
    .then((data) => {
      let lista = [];
      data.forEach((peli) => {
        lista.push(createSimpleMovieContainer(peli));
      })

      const divRes = document.getElementById("resultados");
      divRes.innerHTML = "";
      lista.forEach((component) => divRes.appendChild(component));
      clearRandomMovieGenerated();
      setSubtitleText("Resultados de la busqueda de: " + inputSearch.value);
    })
    .catch(function (error) {
      console.log(error);
    });
});

advancedButton.addEventListener('click', function (e) {
  // realizar la busqueda y generar la lista 
  fetch('/peliculas-advanced', { method: 'GET' })
    .then(function (response) {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Request failed.');
    })
    .then((data) => {
      let lista = [];
      data.forEach((peli) => {
        lista.push(createSimpleMovieContainer(peli))
      })
      const divRes = document.getElementById("resultados");
      divRes.innerHTML = "";
      lista.forEach((component) => divRes.appendChild(component));
      clearRandomMovieGenerated();
      setSubtitleText("TOP 15 de las mejores peliculas de crimen y accion segun IMDB entre el 1975 y el 2000")
    })
    .catch(function (error) {
      console.log(error);
    });
});

generateButton.addEventListener('click', function (e) {
  let pelis = [];
  let generatedMovie;
  setSubtitleText("");
  // realizar la busqueda y generar la lista 
  fetch('/pelicula-random', { method: 'GET' })
    .then(function (response) {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Request failed.');
    })
    .then((data) => {
      let lista = [];
      data.forEach((peli) => {
        lista.push(createRandomMovieContainer(peli, false));
        pelis.push(peli);
      })

      const divRes = document.getElementById("resultados");
      divRes.innerHTML = "";
      lista.forEach((component) => divRes.appendChild(component));

      clearRandomMovieGenerated();
      const divGeneratedMovie = document.getElementById("generatedMovie");
      generatedMovie = {
        title: 'TADW Presenta: ' + pelis?.at(0)?.title,
        fullplot: pelis?.at(1)?.fullplot,
        cast: pelis?.at(2)?.cast,
        poster: pelis?.at(3)?.poster,
        year: pelis?.at(4)?.year,
      }
      divGeneratedMovie.appendChild(createRandomMovieContainer(generatedMovie, true));
    })
    .catch(function (error) {
      console.log(error);
    }).finally(() => {
      if (!!generatedMovie.title) {
        postearPelicula(generatedMovie);
      }
    })


});

const postearPelicula = (item) => {
  console.log(item);
  const options = { method: 'POST', body: JSON.stringify(item), headers: { 'Content-Type': 'application/json' } }
  fetch('/create-pelicula', options).then((response) => {
    if (response.ok) {
      return response.json();
    }
    throw new Error('Request failed.');
  }).then((response) => {
    console.log(response);

  }).catch(function (error) {
    console.log(error);
  });

}

const clearRandomMovieGenerated = () => {
  const divGeneratedMovie = document.getElementById("generatedMovie");
  divGeneratedMovie.innerHTML = "";
}

const setSubtitleText = (input) => {
  const subtitleDiv = document.getElementById("subtitle");
  subtitleDiv.innerHTML = "";
  subtitleDiv.appendChild(document.createTextNode(input));
}

const createRandomMovieContainer = (movie, isNew) => {

  let container = document.createElement("div");
  container.className = "randomMovieContainer row";
  container.style.backgroundColor = isNew ? "#ACDDDE" : "#F7D8BA";
  container.style.borderColor = isNew ? "green" : "black";

  let firstContainer = document.createElement("div");
  firstContainer.className = "randomMovieFirstContainer column";

  let generatedMovieFlag = document.createElement("div");
  generatedMovieFlag.className = "generatedMovieFlag column";
  generatedMovieFlag.appendChild(document.createTextNode(`¡NUEVA PELICULA GENERADA Y GUARDADA!`));
  isNew && firstContainer.appendChild(generatedMovieFlag);


  let titleContainer = document.createElement("div");
  titleContainer.className = "column";
  titleContainer.appendChild(document.createTextNode(`Titulo: ${movie.title}`));
  firstContainer.appendChild(titleContainer);

  let yearContainer = document.createElement("div");
  yearContainer.className = "column";
  yearContainer.appendChild(document.createTextNode(`Año de estreno: ${movie.year}`));
  firstContainer.appendChild(yearContainer);

  container.appendChild(firstContainer);

  let plotContainer = document.createElement("div");
  plotContainer.className = "plotContainer column";
  plotContainer.appendChild(document.createTextNode(`Plot: ${movie.fullplot || '-'}`));
  container.appendChild(plotContainer);

  let castContainer = document.createElement("div");
  castContainer.className = "castContainer column";
  castContainer.appendChild(document.createTextNode(`Cast: ${movie.cast}`));
  container.appendChild(castContainer);

  let imgContainer = document.createElement("div");
  imgContainer.className = "imgContainer row";

  let imgElement = document.createElement("img");
  imgElement.src = movie.poster;
  imgElement.style.height = "150px";

  imgContainer.appendChild(imgElement);

  container.appendChild(imgContainer);

  return container;

}

const createSimpleMovieContainer = (movie) => {

  let container = document.createElement("div");
  container.className = "simpleContainer row"

  let firstContainer = document.createElement("div");
  firstContainer.className = "simpleFirstContainer column";

  let titleContainer = document.createElement("div");
  titleContainer.className = "column";
  titleContainer.appendChild(document.createTextNode(`Titulo: ${movie.title}`));
  firstContainer.appendChild(titleContainer);

  let yearContainer = document.createElement("div");
  yearContainer.className = "column";
  yearContainer.appendChild(document.createTextNode(`Año de estreno: ${movie.year}`));
  firstContainer.appendChild(yearContainer);

  container.appendChild(firstContainer);

  let ratingsContainer = document.createElement("div");
  ratingsContainer.className = "simpleFirstContainer column";

  let imdbContainer = document.createElement("div");
  imdbContainer.className = "ratingText column";
  imdbContainer.appendChild(document.createTextNode(`IMDB Rating: ${movie.imdb || '-'}`));
  ratingsContainer.appendChild(imdbContainer);

  let tomatoesContainer = document.createElement("div");
  tomatoesContainer.className = "ratingText column";
  tomatoesContainer.appendChild(document.createTextNode(`Tomatoes Rating: ${movie.tomatoes || "-"}`));
  ratingsContainer.appendChild(tomatoesContainer);

  let metacriticContainer = document.createElement("div");
  metacriticContainer.className = "ratingText column";
  metacriticContainer.appendChild(document.createTextNode(`Metacritic Rating: ${movie.metacritic || "-"}`));
  ratingsContainer.appendChild(metacriticContainer);

  container.appendChild(ratingsContainer);

  let imgContainer = document.createElement("div");
  imgContainer.className = "imgContainer";

  let imgElement = document.createElement("img");
  imgElement.src = movie.poster;
  imgElement.style.height = "150px";

  imgContainer.appendChild(imgElement);

  container.appendChild(imgContainer);

  return container;

}
