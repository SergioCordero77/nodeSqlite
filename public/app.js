const form = document.getElementById("artist-form");

const loadButton = document.getElementById("load-btn");
const artistOutput = document.getElementById("artist-output");
const artistNameInput = document.getElementById("artist-name");

const artistToDeleteInput = document.getElementById("artist-delete");
const deleteButton = document.getElementById("delete-artist");

const artistDropdown = document.getElementById("artist-dropdown");

const albumInput = document.getElementById("album-name");
const addAlbumButton = document.getElementById("add-album");

//AGEGIR ARTISTA
form.addEventListener("submit", async (event) => {
  event.preventDefault();//per defecte recarregaria la pagina així que evitem això.

  const name = artistNameInput.value.trim();
  if (!name) return;
  
  //Envia el nom al backend
  const res = await fetch("/api/AddArtist", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ data: name })
  });

  const message = await res.text();
  artistOutput.textContent = message;
  if (res.ok) form.reset();
});

//CARREGAR ARTISTES
loadButton.addEventListener("click", async () => {

  let  text = "text a enviar en aquest cas la taula";
  text = "artists";
  // Fem una petició HTTP al servidor (Express)
  // fetch() envia una request al backend
  const res = await fetch("/api/artists", {
    // Tipus de petició
    // POST = enviem dades al servidor
    method: "POST",
    // Capçaleres HTTP
    // Indiquem que estem enviant dades en format JSON
    headers: {
      "Content-Type": "application/json"
    },

    // Cos de la petició (les dades que enviem)
    // Convertim l’objecte JS a text JSON
    body: JSON.stringify({ data: text })
  });

  // El servidor respon amb JSON
  const json = await res.json();
  // Mostrem el resultat a la textarea de sortida
  artistOutput.textContent = JSON.stringify(json.result, null, 2);

});

//ELIMINAR ARTISTA
deleteButton.addEventListener("click", async () => {
  let name = artistToDeleteInput.value.trim();
  if (!name) return;

  //Envia petició al servidor
  const res = await fetch("/api/DeleteArtist", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ data: name })
  });

  const message = await res.text();
  artistOutput.textContent = message;
  if (res.ok) form.reset();
});

//Quan el select dropdown rep focus(quan es fa click o s'entra per teclat)
artistDropdown.addEventListener("focus", async () => 
  {
   artistDropdown.innerHTML=``;
   console.log("Dropdown clicked");
   //Petició al servidor per obtenir tots els artistes de la taula "artists"
   let artistJson = await consultArtistTable("artists");
   //Recorre tots els artistes rebuts del servidor un per un
   artistJson.forEach(artist => 
    {
      const option = document.createElement("option");
      option.value = artist.name;
      option.textContent = artist.name;
      artistDropdown.appendChild(option);
    });
});

//CONSULTAR TAULA
async function consultArtistTable(table){
   const res = await fetch("/api/artists", {
    // Tipus de petició
    // POST = enviem dades al servidor
    method: "POST",
    // Capçaleres HTTP
    // Indiquem que estem enviant dades en format JSON
    headers: {
      "Content-Type": "application/json"
    },
 
    // Cos de la petició (les dades que enviem)
    // Convertim l’objecte JS a text JSON
    body: JSON.stringify({ data: table })
  });
 
  // El servidor respon amb JSON
  const json = await res.json();
  console.log("Received artist data:", json);
  return json.result;
}

//Afegir Album
addAlbumButton.addEventListener("submit", async (event) => {
  event.preventDefault();//per defecte recarregaria la pagina així que evitem això.

  const name = albumInput.value.trim();
  const artist = artistDropdown.value;

  if (!name || !artist) return;
  
  //Envia album al backend
  const res = await fetch("/api/AddAlbum", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name, artist })
  });

  const message = await res.text();
  artistOutput.textContent = message;
  if (res.ok) form.reset();
});
