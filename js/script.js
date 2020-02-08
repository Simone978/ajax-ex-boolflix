// Creare un layout base con una searchbar (una input e un button) in cui possiamo scrivere completamente o parzialmente il nome di un film. Possiamo, cliccando il  bottone, cercare sull’API tutti i film che contengono ciò che ha scritto l’utente.
// Vogliamo dopo la risposta dell’API visualizzare a schermo i seguenti valori per ogni film trovato:
// Titolo
// Titolo Originale
// Lingua
// Voto

// Trasformiamo il voto da 1 a 10 decimale in un numero intero da 1 a 5, così da permetterci di stampare a schermo un numero di stelle piene che vanno da 1 a 5, lasciando le restanti vuote (troviamo le icone in FontAwesome).
// Arrotondiamo sempre per eccesso all’unità successiva, non gestiamo icone mezze piene

// Trasformiamo poi la stringa statica della lingua in una vera e propria bandiera della nazione corrispondente, gestendo il caso in cui non abbiamo la bandiera della nazione ritornata dall’API (le flag non ci sono in FontAwesome).

// Allarghiamo poi la ricerca anche alle serie tv. Con la stessa azione di ricerca dovremo prendere sia i film che corrispondono alla query, sia le serie tv, stando attenti ad avere alla fine dei valori simili (le serie e i film hanno campi nel JSON di risposta diversi, simili ma non sempre identici)
// Qui un esempio di chiamata per le serie tv:
// https://api.themoviedb.org/3/search/tv?api_key=e99307154c6dfb0b4750f6603256716d&language=it_IT&query=scrubs

// 07e3257a7ad00294a8c003683909f65c
//https://api.themoviedb.org/3/search/movie

$(document).ready(function(){

  $('.search').click(function(){

    reset_list();
    var titolo = $("#string").val();
    console.log(titolo);
    // chiamata ajax
    movieData(titolo);
    serieTvData(titolo);

  });

});

// Funzioni

function movieData(string){
  $.ajax(
    {
    url: "https://api.themoviedb.org/3/search/movie",
    method: "GET",
    data: {
          api_key: "07e3257a7ad00294a8c003683909f65c",
          query: string,
          language: "it"
        },
    success: function (data) {
      var dati = data.results;
      if(!dati.length==0){
      print(dati);
    }else{
      alert('Non ci sono film corrispondenti');
    }
      },
    error: function (richiesta, stato, errori) {
      alert("E' avvenuto un errore. " + errori);
      }
    }
  );
  resetString();
};

function serieTvData(string){
  $.ajax(
    {
    url: "https://api.themoviedb.org/3/search/tv",
    method: "GET",
    data: {
          api_key: "07e3257a7ad00294a8c003683909f65c",
          query: string,
          language: "it"
        },
    success: function (data) {
      console.log(data);
      var dati = data.results;
      if(!dati.length==0){
      print(dati);
    }else{
      alert('Non ci sono serie tv corrispondenti');
    }
      },
    error: function (richiesta, stato, errori) {
      alert("E' avvenuto un errore. " + errori);
      }
    }
  );
  resetString();
};

function reset_list(){
  $('.movie_list').html('');
}

function resetString(){
  $('#string').val('');
};

function printStars(votiFilm){
  var somma= '';
  for (var i = 0; i < 5; i++) {
    if ( i < votiFilm) {
      var risultato = '<i class="fas fa-star yellow"></i>';
    } else {
      var risultato = '<i class="far fa-star yellow"></i>';
    }
    somma += risultato;
  }
  return somma;
}


function print(dati){
  var source = $('#movies_data').html();
  var template = Handlebars.compile(source);

  for (var j = 0; j < dati.length; j++) {
    var film = dati[j];
    var context = film;
    var votazione = film.vote_average / 2;
    var voti = Math.ceil(votazione);
    console.log(film.original_name);
    var flag = film.original_language;
    if (flag != "it" && flag != "en" && flag != "fr") {
      flag = "";
    }

    var context = {
      title: film.title,
      name: film.name,
      original_title: film.original_title,
      original_name: film.original_name,
      original_language: film.original_language,
      flag: flag,
      vote_average: voti,
      stars: printStars(voti)
     };
     var html = template(context);
     $('.movie_list').append(html);
  }
}
