//      C O N S T    Y    L E T S  
const cabIdentificado = document.getElementById('identificado');
const containerBuscador = document.getElementById('containerBuscador');
const btnBuscar = document.getElementById('btnBuscar');
const paginaMostrada=document.getElementById("paginaMostrada");
const yearBuscar=document.getElementById("yearBuscar");
const apiKey="84fa3a67";
let apiURL="http://www.omdbapi.com/?apikey=84fa3a67&s=game%20of&plot=full&page=";
const ResultadoBusquedaPelis=document.getElementById("ResultadoBusquedaPelis");
const ResultadoBusquedaFavoritos=document.getElementById("ResultadoBusquedaFavoritos");

const titleBuscar=document.getElementById("titleBuscar");
let usuarioIdentificado="";
let ResultadoBusquedaPelis_AUX="";
  // definicion objeto tarea en localStorage
let idMasAltoFavoritosAlmacenados=0
let unFavoritoLS={
    user:"",
    titulo:"",
    idOMDB:"",
    imgOMDB:""
};
let totPaginas=0;
let arrayidFavoritos=[];
let indexArray=0;
const hoy = new Date();
const yearActual = hoy.getFullYear();

//      M E N S A G E S   P A R A   A V I S A R   Q U E    H A Y   Q U E   E S T A R   L O G E A D O
let noIdentificado =  "<div><img src='img/stop200x200.png' alt='no identificado'/></div>";
    noIdentificado +=  "<div><h3>Para poder realizar busquedas tiene que estar logeado.</h3></div>";   
    noIdentificado +=  "<div><h3>El sistema le rediccionara en <span id='aredireccionarEn'></span> seg.</h3></div>";                     
                    

//      L O G I C A   D E   P R O G R A M A
ResultadoBusquedaPelis_AUX=document.getElementById("ResultadoBusquedaPelis").innerHTML;
verUsuarioLogeado();


//     A D D   L I S T E N E R S  
btnBuscar.addEventListener('click', (e)=>{
    mostrarLista();
})

yearBuscar.addEventListener('change', (e) =>{
//  Si el año introducido es mayor que el año actual lo actualizo con el año actual
//  Si el año introducido es meno que el año 1895 (Primera pelicula de la historia "Salida de la fabrica"), lo actualizo con 1895
    if(yearBuscar.value>yearActual) yearBuscar.value=yearActual;
    if(yearBuscar.value<1895) yearBuscar.value=1895;

})

// Evento para controlar en que pelicula de la lista ha hecho click en la parte que muestra las peliculas encontradas
ResultadoBusquedaPelis.addEventListener('click', (e)=>{
    //solo voy a consultarUnId si estoy en la lista de resultados, no si estoy en informacion de una pelicula
    let voy=true;
    if(e.target.id=="ResultadoBusquedaPelis" || e.target.id=="btnVolver" || e.target.id=="btnAFavoritos" ||  e.target.id=="" ||  e.target.id=="VerPag" ) voy=false;
   if(voy){
     consultarUnId(e.target.id);
   }
})
// Evento para controlar en que pelicula de la lista ha hecho click en la parte de favoritos
ResultadoBusquedaFavoritos.addEventListener('click', (e)=>{
    //solo voy a consultarUnId si estoy en la lista de resultados, no si estoy en informacion de una pelicula
    let voy=true;
    //console.log("la id2 del elemento:"+e.target.attributes[2].nodeValue);
    if(e.target.id=="borrarDeFavorito" || e.target.attributes[2].nodeValue=="unFavorito" ) voy=false;
    if(voy) consultarUnId(e.target.id);

    if(e.target.id=="borrarDeFavorito"){
      // console.log( e.target.attributes[2].nodeValue);
       let aBorrar=e.target.attributes[2].nodeValue;
       let lsYDiv=aBorrar.split('/');

       localStorage.removeItem(lsYDiv[0]);
       document.getElementById(lsYDiv[0]).remove(); 
       // Busco el el elemento del array para quitarlo
       indexArray=arrayidFavoritos.indexOf(lsYDiv[0]);
       arrayidFavoritos.splice(indexArray,1);
       if(arrayidFavoritos.length==0) document.getElementById('sinFavoritos').classList.remove('oculto'); 
    }
})

//      F U N C I O N E S
function verUsuarioLogeado(){
    let user =JSON.parse(sessionStorage.getItem('UserOMDB'));
    console.log('objeto sessionStorage'+user);
    if(user!=null){
       // console.log (`usuario: ${user.user} pass: ${user.pass}`);
        usuarioIdentificado=user.user+user.pass;
        cabIdentificado.innerHTML=`<span class='icon-user'></span> ${user.user} (${user.pass}) <input id="btnLogOut" class="btn radius5" type="button" value="Salir">`;
        
        //Evento click del boton SALIR
        let btnLogOut=document.getElementById("btnLogOut");
        btnLogOut.addEventListener('click',()=>{
            sessionStorage.removeItem('UserOMDB')
            window.location.href="index.html";
       })
       // Buscar favoritos de este usuario en localStorage
       leerFavoritos();


    }else{
        containerBuscador.innerHTML=noIdentificado;
        let segundos=5;
        // espera 5 segundos para redirigir la pagina al login
        let x = setInterval(function() {
                segundos--;
            document.getElementById('aredireccionarEn').innerHTML=segundos;    
            if(segundos==0){
                window.location.href="index.html";
            }
        }, 1000);
    }
}

function mostrarLista(){
    // Prepara petición AJAX
    let xhr;
    if(window.XMLHttpRequest) xhr = new XMLHttpRequest()
    else xhr = ActiveXObject('Microsoft.XMLHTTP')
    let peliTit=encodeURI(titleBuscar.value);

    apiURL="https://www.omdbapi.com/?apikey=84fa3a67&s="+peliTit+"&plot=full&page="+paginaMostrada.value+"&y="+yearBuscar.value;
    console.log("apiURL:"+apiURL);
    xhr.open('GET',apiURL);

    xhr.addEventListener('load',(data)=>{
        
         const dataJSON = JSON.parse(data.target.response);
      
      //Comprueba la respuesta e informa de porque no hay resultados
        if (dataJSON.Response=="False") {
            ResultadoBusquedaPelis.innerHTML=' <img src="img/atencion.png" alt="No devuelve nada"/>';
           
            switch (dataJSON.Error) {
                case 'Something went wrong.':
                  ResultadoBusquedaPelis.innerHTML+="<p>Su consulta No devuelve ning&uacute;n resultado.</p>";
                  break;

                case 'Too many results.':
                    ResultadoBusquedaPelis.innerHTML+="<p>Su consulta devuelve demasiados resultados.</p>";
                break;
                
                case 'Movie not found!':
                default:
                    ResultadoBusquedaPelis.innerHTML+="<p>No se han encontrado coincidencias.</p>";
                break;
        }   
            ResultadoBusquedaPelis.innerHTML+="<p>Pruebe con otros criterios de b&uacute;squeda.</p>"
       }else{

            // Registros que devuelve la consulta
            let totalResultsNum=parseInt(dataJSON.totalResults); 
            // Total de paginas que se pueden mostrar presentando peliculas de 10 en 10
            totPaginas=Math.ceil(totalResultsNum/10);

            ResultadoBusquedaPelis.innerHTML="<p class='right'>Su consulta devuelve <span>"+totalResultsNum+" </span> resultados.</p>"

            for(i=0;i<dataJSON.Search.length;i++)    {
                let img=(dataJSON.Search[i].Poster=="N/A"?"img/SinFoto.jpg":dataJSON.Search[i].Poster);
                ResultadoBusquedaPelis.innerHTML+="<p id='"+dataJSON.Search[i].imdbID+"' class='unResultado'><img id='"+dataJSON.Search[i].imdbID+"'    class ='sombra' src='"+img +"'/><span id='"+dataJSON.Search[i].imdbID+"' >"+dataJSON.Search[i].Title+"</span> A&ntilde;o "+dataJSON.Search[i].Year +" "+(dataJSON.Search[i].Type=='movie'?'(pelicula)':'(serie)')+".</p>";
            }

            ResultadoBusquedaPelis.innerHTML+="<p class='right'>Viendo p&aacute;gina <span>"+paginaMostrada.value+"</span> de "+totPaginas +".   Ir a p&aacute;gina :<input id='VerPag' value='"+paginaMostrada.value+"'/>";

            //guarda el contenido para restaurarlo despues
            ResultadoBusquedaPelis_AUX=document.getElementById("ResultadoBusquedaPelis").innerHTML;
            // crea el envento Change del input VerPag
            creaEventoChange();
        }
    })

    xhr.send();
}

function creaEventoChange(){
            // Evento para cuando cambia el numero de pagina a Ver
            document.getElementById('VerPag').addEventListener('change', (e)=>{
                // Comprueba si la página es > que el numero máximo de pagina, (lo iguala al némero máximo de pagians), o //si es < negativo o NaN que lo iguala a 1
                console.log("VerPag Cambio, voy a buscar la pagina"+e.target.value);
                if (e.target.value > totPaginas){
                    paginaMostrada.value=totPaginas;
                }else{
                    paginaMostrada.value=e.target.value;
                }
                if(isNaN(e.target.value)||e.target.value<1){
                    paginaMostrada.value=1;
                }
                mostrarLista()
            })

}
function consultarUnId(idConsulta){
        // Prepara petición AJAX
        let xhr;
        if(window.XMLHttpRequest) xhr = new XMLHttpRequest()
        else xhr = ActiveXObject('Microsoft.XMLHTTP')
        
        let ResultadoBusquedaPelis_NUE="<div class='unaPeli'>";
    
        apiURL="https://www.omdbapi.com/?apikey=84fa3a67&i="+idConsulta;
        xhr.open('GET',apiURL);
        indexArray=arrayidFavoritos.indexOf(idConsulta);
        xhr.addEventListener('load',(data)=>{
             const dataJSON = JSON.parse(data.target.response);

             ResultadoBusquedaPelis_NUE+="<div><img class='sombra' src='"+(dataJSON.Poster=="N/A"?laimg="img/SinFoto.jpg":laimg=dataJSON.Poster)+"' /></div>";
             ResultadoBusquedaPelis_NUE+="<div><span class='titulo'>"+dataJSON.Title+"</span></br>";
             ResultadoBusquedaPelis_NUE+="<span>A&ntilde;o: </span>"+dataJSON.Year+" <span>Dur.: </span>"+dataJSON.Runtime+"</br>";
             ResultadoBusquedaPelis_NUE+="<span>Director: </span>"+dataJSON.Director+"</br>";
             ResultadoBusquedaPelis_NUE+="<span>Actores: </span>"+dataJSON.Actors+"</br>";
             ResultadoBusquedaPelis_NUE+="<span>Autor/es: </span>"+dataJSON.Writer+"</br>";
             ResultadoBusquedaPelis_NUE+="<span>Productora: </span>"+dataJSON.Production+"</br>";
             ResultadoBusquedaPelis_NUE+="<span>Pa&iacute;s: </span>"+dataJSON.Country+"</br>";
             ResultadoBusquedaPelis_NUE+="<span>Genero: </span>"+dataJSON.Genre+"</br>";
             ResultadoBusquedaPelis_NUE+="<span>Premios: </span>"+dataJSON.Awards+"</div>";
             ResultadoBusquedaPelis_NUE+="<div class='unaPeli__plot'><span>Sinopsis: </span>"+dataJSON.Plot+"</div>";
             ResultadoBusquedaPelis_NUE+="<div class='unaPeli__botones'><input id='btnVolver' class='btn radius5' type='button' value='Volver'><input id='btnAFavoritos' class='"+(indexArray==-1?'btn':'btnNO')+" radius5' type='button' value='A&ntilde;adir a Favoritos'></div>";
             ResultadoBusquedaPelis_NUE+="</div>";
             document.getElementById("ResultadoBusquedaPelis").innerHTML=ResultadoBusquedaPelis_NUE;

             /// Listener boton Volver
             document.getElementById("btnVolver").addEventListener('click',(e)=>{         
                document.getElementById("ResultadoBusquedaPelis").innerHTML=ResultadoBusquedaPelis_AUX;
                // Recrea el envento Change del input VerPag
                creaEventoChange();               
             })
          
                document.getElementById("btnAFavoritos").addEventListener('click',(e)=>{
                    indexArray=arrayidFavoritos.indexOf(idConsulta);
                     ///Va a Guardar a Favoritos solo si la pelicula no esta ya en el aray de favoritos
                    if(indexArray==-1){
                      guardarUnFavorito(usuarioIdentificado,dataJSON.Title,idConsulta,dataJSON.Poster);   
                    }
                })         
        })
        
        xhr.send();             
}

function guardarUnFavorito(user,title,id,poster){
    idMasAltoFavoritosAlmacenados++;
   let nuevoId="favoritoOMDB"+idMasAltoFavoritosAlmacenados;
   unFavoritoLS.user=user;
   unFavoritoLS.titulo=title;
   unFavoritoLS.idOMDB=id;
   unFavoritoLS.imgOMDB=(poster=="N/A"?"img/SinFoto.jpg":poster);
   localStorage.setItem(nuevoId,JSON.stringify(unFavoritoLS));
   arrayidFavoritos[arrayidFavoritos.length]=id;
  // Añade una nueva Div a la parte de Favoritos
  creaDIV(nuevoId,title,id,poster);
  //Quito la div que avisa que no hay tareas
  document.getElementById('sinFavoritos').classList.add('oculto');
}

function leerFavoritos(){
         idMasAltoFavoritosAlmacenados=0; //Variable para saber cuantar tareas hay creadas      
         for (i=0; i<localStorage.length; i++){
           let laClave=localStorage.key(i);

           if(laClave.substr(0,12)=="favoritoOMDB"){ //Solo las claves que empiecen por "favoritoOMDB"

           let longi=laClave.length;
           longi=longi-12;

            if(idMasAltoFavoritosAlmacenados < parseInt(laClave.substr(12,longi))){
                idMasAltoFavoritosAlmacenados = parseInt(laClave.substr(12,longi));
            }      
             //Divide el objeto localStorage en campos
             let unFavorito=JSON.parse(localStorage.getItem(localStorage.key(i)));
            if(unFavorito.user==usuarioIdentificado){
                document.getElementById('sinFavoritos').classList.add('oculto');

                 //creaDIV(parametros) añade una div con la pelicula Favorita leida
                creaDIV(laClave,unFavorito.titulo,unFavorito.idOMDB,unFavorito.imgOMDB);
                arrayidFavoritos[arrayidFavoritos.length]=unFavorito.idOMDB;
            }

           }
         }
}

function creaDIV(nomClave,title,idOMDB,imgOMDB){
    var nuevaDiv = document.createElement("DIV");
    var nuevoId = nomClave;
  
    nuevaDiv.setAttribute('class', 'unFavorito');
    nuevaDiv.setAttribute('id', nuevoId);                    // Create a <p> node
    nuevaDiv.setAttribute('id2', 'unFavorito');                    // Create a <p> node
    var textoNuevaDiv = document.createTextNode("");      // Create a text node
    nuevaDiv.appendChild(textoNuevaDiv);                                          // Append the text to <p>
    document.getElementById("ResultadoBusquedaFavoritos").appendChild(nuevaDiv);
    let elInner="<div id='"+idOMDB+"' class='unFavorito__title' id2='nada'><img class='img__fav sombra' src='"+imgOMDB+"'/> "+title+"</div>";
    elInner+="<div class='btn unFavorito__btn radius5'><span  id='borrarDeFavorito'  id2='unFavorito' id3='"+nuevoId+"/"+idOMDB+"' class='borrar icon-trash' data-cual='"+nuevoId+"'></span></div>";
    document.getElementById(nuevoId).innerHTML = elInner;
  }