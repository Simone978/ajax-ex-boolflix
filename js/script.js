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
    callAjax();
  });

  $('input').keypress(function(event){
    if(event.which == 13){
      callAjax();
    }
  });

  $(document).on('click', '.cast', function(){
    var element =$(this);
    var valoreId=$(this).prev().html();
    var results =[];
    cast(valoreId, results, element);

  });
});

// Funzioni


function callAjax(){
  reset_list();
  var titolo = $("#string").val();
  // chiamata ajax
  var urlMovie = "https://api.themoviedb.org/3/search/movie";
  var urlTv = "https://api.themoviedb.org/3/search/tv";
  movieData("film", titolo, urlMovie);
  movieData("serie tv", titolo, urlTv);
}

function reset_list(){
  $('.movie_list').html('');
  $('.tv_list').html('');
  $('.no_film h2').html('');
  $('.no_serie h2').html('');
}

function movieData(type, string, url){
  $.ajax(
    {
    url: ""+url+"",
    method: "GET",
    data: {
          api_key: "07e3257a7ad00294a8c003683909f65c",
          query: string,
          language: "it"
        },
    success: function (data) {
      var dati = data.results;
      if(!dati.length==0){
      print(type, dati);

      }else{
        if(type == 'film'){
        $('.no_film h2').html('Non ci sono ' + type +' corrispondenti alla tua ricerca');
        }else{
        $('.no_serie h2').html('Non ci sono ' + type +' corrispondenti alla tua ricerca');
        }
      }
      },
    error: function (richiesta, stato, errori) {
      alert("E' avvenuto un errore. " + errori);
      }
    }
  );
  resetString();
};


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


function print(type, dati){
 console.log(type);
  var source = $('#movies_data').html();
  var template = Handlebars.compile(source);

  for (var j = 0; j < dati.length; j++) {
    var film = dati[j];
    var context = film;

    var votazione = film.vote_average / 2;
    var voti = Math.ceil(votazione);
    var flag = film.original_language;
    if (flag != "it" && flag != "en" && flag != "fr") {
      flag = "";
    }

    var container = "";
    if(type == "film"){
      container = $('.movie_list');
    }else{
      container = $('.tv_list');
    }
    var posterMovie = '<img class="noimg" src="img/noimage.jpg" alt=""/>';
    if(film.poster_path != null){
      posterMovie = "<img src='https://image.tmdb.org/t/p/w342"+film.poster_path+"'>";
    }
    var riassunto = film.overview;
    if(riassunto.length > 200){
      riassunto = riassunto.substr(0,200);
    }
    var id=film.id;
    // movieId(id, dati);
    var context = {
      movie_id: film.id,
      title: film.title,
      poster: posterMovie,
      name: film.name,
      original_title: film.original_title,
      original_name: film.original_name,
      original_language: film.original_language,
      actors: '',
      flag: flag,
      vote_average: voti,
      stars: printStars(voti),
      riassunto: riassunto + '...',
      tipo: type
     };
     var html = template(context);
     container.append(html);
  }
};

function cast(val, results, element){
  $.ajax(
    {
    url: "https://api.themoviedb.org/3/movie/"+val+"/credits",
    method: "GET",
    data: {
          api_key: "07e3257a7ad00294a8c003683909f65c",
        },
    success: function (data) {
     for (var i = 0; i < 5; i++) {
        results.push(data.cast[i].name+" ");
        element.html(results);
        console.log(results);
        };
    },
    error: function (richiesta, stato, errori) {
      alert("E' avvenuto un errore. " + errori);
      }
    }
  );
};
