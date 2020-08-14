// constantes
const frmEnviar=document.getElementById('frmLogin');
const user=document.getElementById('user');
const pass=document.getElementById('pass');

const btnLogin=document.getElementById('btnLogin');
const formIsValid={
    usuario : false,
    password : false
}

//     A D D   L I S T E N E R S 
btnLogin.addEventListener('click',()=>{
    formIsValid.usuario = validateUsername(user.value);
    if(formIsValid.usuario == false){
        user.classList.add('errorLogin');  
    }

    formIsValid.password = validateUsername(pass.value);
    if(formIsValid.password == false){
        pass.classList.add('errorLogin');  
    }

    const validarForm=Object.values(formIsValid);
    const valid = validarForm.findIndex(valor => valor == false);

    if(valid == -1){
        guardarSS();
        frmEnviar.submit();
    }else{
        document.getElementById('errorLogin').classList.add('errorLoginTralate');
    }
})
 
// quito el fondo rojo de aviso de error si lo tiene
user.addEventListener('focusin', ()=>{
    user.classList.remove('errorLogin');
    document.getElementById('errorLogin').classList.remove('errorLoginTralate');
}) 

pass.addEventListener('focusin', ()=>{
    pass.classList.remove('errorLogin');
    document.getElementById('errorLogin').classList.remove('errorLoginTralate');
}) 

//      F U N C I O N E S
function guardarSS(){
    let userOMDB={
        user:"",
        pass:""
    };
  
    userOMDB.user=user.value;
    userOMDB.pass=pass.value;
 
    // Crea nueva tarea en SesionStorage
    sessionStorage.setItem('UserOMDB',JSON.stringify(userOMDB));
}