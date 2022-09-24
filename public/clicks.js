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
      let lista = "";
      data.forEach((peli) => {
        lista = lista + "<p>" + peli.title + ", estrenada el año " + peli.year + "</p>";
      })
      const divRes = document.getElementById("resultados");
      divRes.innerHTML = lista;
      return;
    })
    .catch(function (error) {
      console.log(error);
    });
});

generateButton.addEventListener('click', function (e) {
  let pelis = [];
  let generatedMovie;
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

const createRandomMovieContainer = (movie, isNew) => {

  let container = document.createElement("div");
  container.style.cssText = "display: flex; flex-direction: row; align-items: space-around; justify-content: center; align-self:center; height: 150px; width: 100%; margin: 2em 0; border: 2px solid; border-radius: 1em;"
  container.style.backgroundColor = isNew ? "#ACDDDE" : "#F7D8BA";
  container.style.borderColor = isNew ? "green" : "black";

  let firstContainer = document.createElement("div");
  firstContainer.style.cssText = "display:flex; flex-direction: column; margin-right: 40px; width: 25%; justify-content: center;"

  let generatedMovieFlag = document.createElement("div");
  generatedMovieFlag.style.cssText = "display:flex; flex-direction: column; font-weight: bold; color: green; margin-bottom: 1em;"
  generatedMovieFlag.appendChild(document.createTextNode(`¡NUEVA PELICULA GENERADA Y GUARDADA!`));
  isNew && firstContainer.appendChild(generatedMovieFlag);


  let titleContainer = document.createElement("div");
  titleContainer.style.cssText = "display:flex; flex-direction: column;";
  titleContainer.appendChild(document.createTextNode(`Titulo: ${movie.title}`));
  firstContainer.appendChild(titleContainer);

  let yearContainer = document.createElement("div");
  yearContainer.style.cssText = "display:flex; flex-direction: column;";
  yearContainer.appendChild(document.createTextNode(`Año de estreno: ${movie.year}`));
  firstContainer.appendChild(yearContainer);

  container.appendChild(firstContainer);

  let plotContainer = document.createElement("div");
  plotContainer.style.cssText = "display:flex; flex-direction: column; margin-right: 40px; height: 150px; width: 40%; justify-content: center; overflow-y: hidden;";
  plotContainer.appendChild(document.createTextNode(`Plot: ${movie.fullplot || '-'}`));
  container.appendChild(plotContainer);

  let castContainer = document.createElement("div");
  castContainer.style.cssText = "display:flex; flex-direction: column; max-height: 150px; width: 25%; justify-content: center";
  castContainer.appendChild(document.createTextNode(`Cast: ${movie.cast}`));
  container.appendChild(castContainer);

  let imgContainer = document.createElement("div");
  imgContainer.style.display = "flex";
  imgContainer.style.flexDirection = "row";
  imgContainer.style.justifyContent = "center";
  imgContainer.style.width = "10%";

  let imgElement = document.createElement("img");
  imgElement.src = movie.poster;
  imgElement.style.height = "150px";

  imgContainer.appendChild(imgElement);

  container.appendChild(imgContainer);

  return container;

}

const createSimpleMovieContainer = (movie) => {

  let container = document.createElement("div");
  container.style.display = "flex";
  container.style.flexDirection = "row";
  container.style.alignItems = "space-around";
  container.style.justifyContent = "center";
  container.style.height = "150px";
  container.style.alignSelf = "center";
  container.style.backgroundColor = "#F7D8BA";
  container.style.width = "100%";
  container.style.marginBottom = "2em";
  container.style.marginTop = "2em";
  container.style.border = "2px solid";
  container.style.borderColor = "black";
  container.style.borderRadius = "1em";

  let firstContainer = document.createElement("div");
  firstContainer.style.display = "flex";
  firstContainer.style.flexDirection = "column";
  firstContainer.style.marginRight = "40px";
  firstContainer.style.width = "33%";
  firstContainer.style.justifyContent = "center";

  let titleContainer = document.createElement("div");
  titleContainer.style.display = "flex";
  titleContainer.style.flexDirection = "column";
  titleContainer.appendChild(document.createTextNode(`Titulo: ${movie.title}`));
  firstContainer.appendChild(titleContainer);

  let yearContainer = document.createElement("div");
  yearContainer.style.display = "flex";
  yearContainer.style.flexDirection = "column";
  yearContainer.appendChild(document.createTextNode(`Año de estreno: ${movie.year}`));
  firstContainer.appendChild(yearContainer);

  container.appendChild(firstContainer);

  let ratingsContainer = document.createElement("div");
  ratingsContainer.style.display = "flex";
  ratingsContainer.style.flexDirection = "column";
  ratingsContainer.style.marginRight = "40px";
  ratingsContainer.style.height = "150px";
  ratingsContainer.style.width = "33%";
  ratingsContainer.style.justifyContent = "center";

  let imdbContainer = document.createElement("div");
  imdbContainer.style.display = "flex";
  imdbContainer.style.flexDirection = "column";
  imdbContainer.style.justifyContent = "center";
  imdbContainer.style.marginBottom = "1em";
  imdbContainer.appendChild(document.createTextNode(`IMDB Rating: ${movie.imdb || '-'}`));
  ratingsContainer.appendChild(imdbContainer);

  let tomatoesContainer = document.createElement("div");
  tomatoesContainer.style.display = "flex";
  tomatoesContainer.style.flexDirection = "column";
  tomatoesContainer.style.justifyContent = "center";
  tomatoesContainer.style.marginBottom = "1em";
  tomatoesContainer.appendChild(document.createTextNode(`Tomatoes Rating: ${movie.tomatoes || "-"}`));
  ratingsContainer.appendChild(tomatoesContainer);

  let metacriticContainer = document.createElement("div");
  metacriticContainer.style.display = "flex";
  metacriticContainer.style.flexDirection = "column";
  metacriticContainer.style.justifyContent = "center";
  metacriticContainer.appendChild(document.createTextNode(`Metacritic Rating: ${movie.metacritic || "-"}`));
  ratingsContainer.appendChild(metacriticContainer);

  container.appendChild(ratingsContainer);

  let imgContainer = document.createElement("div");
  imgContainer.style.display = "flex";
  imgContainer.style.flexDirection = "row";
  imgContainer.style.justifyContent = "center";
  imgContainer.style.width = "33%";

  let imgElement = document.createElement("img");
  imgElement.src = movie.poster;
  imgElement.style.height = "150px";

  imgContainer.appendChild(imgElement);

  container.appendChild(imgContainer);

  return container;

}
