// Creare un layout base con una searchbar (una input e un button) in cui possiamo scrivere completamente o parzialmente il nome di un film. Possiamo, cliccando il  bottone, cercare sull’API tutti i film che contengono ciò che ha scritto l’utente.
// Vogliamo dopo la risposta dell’API visualizzare a schermo i seguenti valori per ogni film trovato:
// Titolo
// Titolo Originale
// Lingua
// Voto

// 07e3257a7ad00294a8c003683909f65c
//https://api.themoviedb.org/3/search/movie

$(document).ready(function(){
  $('.search').click(function(){
    $('.movie_list').html('');
    var titolo = $("#string").val();
    console.log(titolo);
    // chiamata ajax
    $.ajax(
      {
      url: "https://api.themoviedb.org/3/search/movie",
      method: "GET",
      data: {
            api_key: "07e3257a7ad00294a8c003683909f65c",
            query: titolo,
            language: "it"
          },
      success: function (data) {
        var dati = data.results;
        print(dati);

        },
      error: function (richiesta, stato, errori) {
        alert("E' avvenuto un errore. " + errori);
        }
      }
    );

  });
});

// Funzioni

function print(dati){
  var source = $('#movies_data').html();
  var template = Handlebars.compile(source);

  for (var i = 0; i < dati.length; i++) {
    var film = dati[i];
    var context = {
       title: film.title,
       original_title: film.original_title,
       original_language: film.original_language,
       vote_average: film.vote_average
     };
     var html = template(context);
     $('.movie_list').append(html);
  }
}
