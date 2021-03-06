'use strict';
/*
Puede ser más vendidos, productos recomendados, otros han comprado, productos destacados de una categoría
 */
function Minislider(nombre, tipo, id){
	this.nombre = nombre;
	this.tipo = tipo;
	this.id = id; //ID es donde se introducirá el slider
	this.tamano = 5;
	this.pagina = 0;
	this.paginasTotales;
	let that = this;

	calcularTamano();
	colocarMinislider();
	window.addEventListener('resize', calcularTamano);

	//Genera el html de todo el minislider, luego lo inserta en la ID de este objeto
	function colocarMinislider(){
		httpGet(`/api/get-minislider/${tipo}?pag=${that.pagina}`, (response) => {
			if(response) response = JSON.parse(response);
			else return console.log(`No se ha recibido respuesta para el minislider ${tipo}`);
			
			if(response.error){
				return console.log(response.error); //Si hay un error, no mostrar el minislider directamente
			}
			let productos = response.productos;
			that.paginasTotales = (parseInt(response.paginasTotales)-1);
			//Le quitamos uno para que el último no se muestre porque pueden ser 1 o 2 productos y no queda completo
			let sliderHTML = `<div class="contenedor-minislider">
				<h3 class="titulo-contenedor-minislider">${nombre}</h3>
				<img class="flecha-izquierda-minislider flecha-minislider" src="../images/back.svg">
				<img class="flecha-derecha-minislider flecha-minislider" src="../images/next.svg">
				<div class="minislider">`;
			for(let i = 0; i < productos.length; i++){
				let producto = productos[i],
					tituloOriginal = producto.titulo,
					tituloCorto = ''; //Acortamos el título si fuese demasiado largo para que encaje en la caja	
				if(producto.titulo.length > 60){
					tituloCorto = producto.titulo.substring(0, 60);
					tituloCorto += '...';
				}else tituloCorto = producto.titulo;
				//producto.imagenes es 1 sola imagen que se ha seleccionado de la bd
				sliderHTML += 
					`<div class="contenedor-producto-minislider">					
						<a href="/p/${producto.permalink}" title="${tituloOriginal}">
							<img class="imagen-minislider" src="../public-uploads/${producto.imagenes[1]}" width="100%">
						</a>
						<a class="categoria-minislider" href="/d/${encodeURIComponent(producto.categoria)}">${producto.categoria}</a>						
						<a class="titulo-minislider" href="/p/${producto.permalink}" title="${tituloOriginal}">${tituloCorto}</a>
						<span class="precio-minislider">${producto.precio}€</span>
					</div>`;
			}
			sliderHTML += '</div></div>';
			q(id).innerHTML = sliderHTML;
			addListeners();
		});
	};
	function flechaDerechaMinislider(){
		if(!that.paginasTotales || that.paginasTotales > that.pagina){
			q(`${id} .flecha-derecha-minislider`).removeAttribute('disabled');
			q(`${id} .flecha-derecha-minislider`).style.opacity = 1;
			that.pagina++;
			colocarMinislider();
		}else{
			//Bloquear la flecha
			q(`${id} .flecha-derecha-minislider`).setAttribute('disabled', 'disabled');
			q(`${id} .flecha-derecha-minislider`).style.opacity = 0.5;
		}
	};
	function flechaIzquierdaMinislider(){
		if(that.pagina > 0){
			q(`${id} .flecha-izquierda-minislider`).removeAttribute('disabled');
			q(`${id} .flecha-izquierda-minislider`).style.opacity = 1;
			that.pagina--;
			colocarMinislider();
		}else{
			//Bloquear la flecha
			q(`${id} .flecha-izquierda-minislider`).setAttribute('disabled', 'disabled');
			q(`${id} .flecha-izquierda-minislider`).style.opacity = 0.5;
		}
	};
	function addListeners(){
		q(`${id} .contenedor-minislider`).addEventListener('mouseenter', () => {
			if(q(`${id} .flecha-izquierda-minislider:not([disabled])`))
				q(`${id} .flecha-izquierda-minislider:not([disabled])`).style.opacity = 1;
			if(q(`${id} .flecha-derecha-minislider:not([disabled])`))
				q(`${id} .flecha-derecha-minislider:not([disabled])`).style.opacity = 1;
		});
		q(`${id} .contenedor-minislider`).addEventListener('mouseleave', () => {
			q(`${id} .flecha-izquierda-minislider`).style.opacity = 0.5;
			q(`${id} .flecha-derecha-minislider`).style.opacity = 0.5;
		});
		q(`${id} .flecha-derecha-minislider:not([disabled])`).addEventListener('click', () => {
			flechaDerechaMinislider();
		});
		q(`${id} .flecha-izquierda-minislider:not([disabled])`).addEventListener('click', () => {
			flechaIzquierdaMinislider();
		});
	};
	function calcularTamano(){
		let tamanoPantalla = window.innerWidth;
		if(tamanoPantalla <= 550){
			that.tamano = 2;
		}else if(tamanoPantalla <= 750){
			that.tamano = 3;
		}else if(tamanoPantalla <= 1050){
			that.tamano = 4;
		}else{
			that.tamano = 5;
		}
	};
};