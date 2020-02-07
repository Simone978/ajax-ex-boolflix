// Creare un layout base con una searchbar (una input e un button) in cui possiamo scrivere completamente o parzialmente il nome di un film. Possiamo, cliccando il  bottone, cercare sull’API tutti i film che contengono ciò che ha scritto l’utente.
// Vogliamo dopo la risposta dell’API visualizzare a schermo i seguenti valori per ogni film trovato:
// Titolo
// Titolo Originale
// Lingua
// Voto

// Trasformiamo il voto da 1 a 10 decimale in un numero intero da 1 a 5, così da permetterci di stampare a schermo un numero di stelle piene che vanno da 1 a 5, lasciando le restanti vuote (troviamo le icone in FontAwesome).
// Arrotondiamo sempre per eccesso all’unità successiva, non gestiamo icone mezze piene

// 07e3257a7ad00294a8c003683909f65c
//https://api.themoviedb.org/3/search/movie

$(document).ready(function(){
  $('.search').click(function(){

    reset_list();
    var titolo = $("#string").val();
    console.log(titolo);
    // chiamata ajax
    movieData(titolo);

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
      alert('questa ricerca non ha prodotto risultati');
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

function print(dati){
  var source = $('#movies_data').html();
  var template = Handlebars.compile(source);

  for (var i = 0; i < dati.length; i++) {
    var film = dati[i];
    var context = film;
    var voti = Math.ceil(film.vote_average);
    var votiToFive = 0;
    if(voti == 1 || voti == 2){
      votiToFive = 1;
    }else if(voti == 3 || voti == 4){
      votiToFive = 2;
    }else if(voti == 5 || voti == 6){
      votiToFive = 3;
    }else if(voti == 7 || voti == 8){
      votiToFive = 4;
    }else if(voti == 9 || voti == 10){
      votiToFive = 5;
    }
    var context = {
       title: film.title,
       original_title: film.original_title,
       original_language: film.original_language,
       vote_average: votiToFive
     };
     var html = template(context);
     $('.movie_list').append(html);
  }
}
