var lienzo=null, canvas=null;
function iniciar()
{
    canvas=document.getElementById('lienzo');
    lienzo=canvas.getContext('2d');
}

window.addEventListener("load", iniciar, false);