function redimensionaBarra()
{
	if(!medio.ended)
	{
		var total=parseInt(medio.currentTime*maximo / medio.duration);
		progreso.style.width=total+'px';
	}
	else
	{
		progreso.style.width='0px';
		play.value='\u25BA';
		window.clearInterval(bucle);
	}
}

function desplazarMedio(e)
{
	if(!medio.paused && !medio.ended)
	{
		var ratonX=e.pageX-barra.offsetLeft;
		var nuevoTiempo=ratonX*medio.duration/maximo;
		medio.currentTime=nuevoTiempo;
		progreso.style.width=ratonX+'px';
	}
}

function accionPlay()
{
	if(!medio.paused && !medio.ended) 
	{
		medio.pause();
		play.value='\u25BA';
		window.clearInterval(bucle);
	}
	else
	{
		medio.play();
		play.value='||';
		bucle=setInterval(redimensionaBarra, 1000);
	}
}

function accionReiniciar()
{
	if(!medio.paused || medio.currentTime > 0)
	{
		medio.currentTime=0;
		medio.play();
		play.value='||';
		window.clearInterval(bucle);
		bucle=setInterval(redimensionaBarra, 1000);
	}
}

function accionRetrasar()
{
	if(medio.currentTime - 5 >= 0)
		medio.currentTime -= 5;
	else
		medio.currentTime = 0;
}

function accionAdelantar()
{
	if(medio.currentTime + 5 <= medio.duration)
		medio.currentTime += 5;
	else
		medio.currentTime = medio.duration;
}

function accionSilenciar()
{
	if(!medio.muted)
	{
		medio.muted = true;
		silenciar.value = 'escuchar';
	}
	else
	{
		medio.muted = false;
		silenciar.value = 'silenciar';
	}
}

function accionMenosVolumen()
{
	if(medio.volume >= 0.1)
		medio.volume = Math.round((medio.volume - 0.1) * 10) / 10;
}

function accionMasVolumen()
{
	if(medio.volume <= 0.9)
		medio.volume = Math.round((medio.volume + 0.1) * 10) / 10;
}

function iniciar() 
{
	maximo=700;
	
	medio=document.getElementById('medio');
	barra=document.getElementById('barra');
	progreso=document.getElementById('progreso');
	play=document.getElementById('play');
	reiniciar=document.getElementById('reiniciar');
	retrasar=document.getElementById('retrasar');
	adelantar=document.getElementById('adelantar');
	silenciar=document.getElementById('silenciar');
	menosVolumen=document.getElementById('menosVolumen');
	masVolumen=document.getElementById('masVolumen');

	play.addEventListener('click', accionPlay, false);
	reiniciar.addEventListener('click', accionReiniciar, false);
	retrasar.addEventListener('click', accionRetrasar, false);
	adelantar.addEventListener('click', accionAdelantar, false);
	silenciar.addEventListener('click', accionSilenciar, false);
	menosVolumen.addEventListener('click', accionMenosVolumen, false);
	masVolumen.addEventListener('click', accionMasVolumen, false);
	barra.addEventListener('click', desplazarMedio, false);
}

window.addEventListener('load', iniciar, false);
