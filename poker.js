document.addEventListener("DOMContentLoaded", () => {
    const botonJugar = document.getElementById('play-button');
    const botonTerminar = document.getElementById('end-game-button');
    const botonNuevaCarta = document.getElementById('new-hand-button');
    const botonNuevaPartida = document.getElementById('new-game-button');
    const contenedorResultados = document.getElementById('result-container');
    const contenedorAcciones = document.getElementById('game-actions');

    let nombreJugador = '';
    let mazo = [];
    let manoJugador = [];
    let manoComputadora = [];
    let cartasComunitarias = [];
    let partidaEnCurso = false;

    botonJugar.addEventListener('click', () => {
        if (confirm("¿Quieres jugar?")) {
            nombreJugador = prompt("¿Cuál es tu nombre?", "Jugador");
            if (nombreJugador) {
                contenedorAcciones.style.display = 'flex';
                botonJugar.style.display = 'none';
                botonTerminar.style.display = 'block';
                botonNuevaCarta.style.display = 'block';
                iniciarJuego();
            }
        } else {
            contenedorResultados.innerHTML = "Juego finalizado.";
        }
    });

    botonTerminar.addEventListener('click', () => {
        if (confirm("¿Estás seguro que deseas abandonar la partida?")) {
            contenedorResultados.innerHTML = "¡Gracias por jugar!";
            finalizarJuego();
        }
    });

    botonNuevaCarta.addEventListener('click', () => {
        if (cartasComunitarias.length < 5) {
            mostrarCartaComunitaria();
        } else {
            jugarNuevaMano();
        }
    });

    botonNuevaPartida.addEventListener('click', () => {
        iniciarJuego();
        botonNuevaPartida.style.display = 'none';
        botonTerminar.style.display = 'block';
        botonNuevaCarta.style.display = 'block';
    });

    function iniciarJuego() {
        mazo = crearMazo();
        manoJugador = repartirMano(mazo);
        manoComputadora = repartirMano(mazo);
        cartasComunitarias = [];
        partidaEnCurso = true;
        mostrarCartaComunitaria(3); // Mostrar las primeras 3 cartas (Flop)
    }

    function mostrarCartaComunitaria(cantidad = 1) {
        for (let i = 0; i < cantidad; i++) {
            cartasComunitarias.push(mazo.pop());
        }
        actualizarVista();
    }

    function jugarNuevaMano() {
        const resultado = determinarGanador();
        contenedorResultados.innerHTML = resultado.mensaje;
        botonNuevaPartida.style.display = 'block';
        botonNuevaCarta.style.display = 'none';
        botonTerminar.style.display = 'none';
        partidaEnCurso = false;
    }

    function finalizarJuego() {
        contenedorAcciones.style.display = 'none'; 
        botonJugar.style.display = 'block'; 
        botonNuevaCarta.style.display = 'none';
        botonNuevaPartida.style.display = 'none';
        botonTerminar.style.display = 'none';
        partidaEnCurso = false;
    }

    function crearMazo() {
        const palos = ['Corazones', 'Tréboles', 'Picas', 'Diamantes']; 
        const valores = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        const mazo = [];   
        for (const palo of palos) {
            for (const valor of valores) {
                mazo.push({ palo, valor });
            }
        }
        return mazo.sort(() => Math.random() - 0.5);
    } 

    function repartirMano(mazo) {
        return mazo.splice(0, 2); // Cada jugador recibe 2 cartas
    }

    function actualizarVista() {
        let mensaje = `<div class="carta-container">${nombreJugador}: ${manoAHtml(manoJugador)}</div>`;
        mensaje += `<div class="carta-container">Computadora: ${manoAHtml(manoComputadora)}</div>`;
        mensaje += `<div class="carta-container">Cartas comunitarias: ${manoAHtml(cartasComunitarias)}</div>`;
        contenedorResultados.innerHTML = mensaje;
    }

    function determinarGanador() {
        const mejorManoJugador = obtenerMejorMano([...manoJugador, ...cartasComunitarias]);
        const mejorManoComputadora = obtenerMejorMano([...manoComputadora, ...cartasComunitarias]);

        const evaluacionJugador = evaluarMano(mejorManoJugador);
        const evaluacionComputadora = evaluarMano(mejorManoComputadora);

        const ganador = compararManos(evaluacionJugador, evaluacionComputadora);

        let mensaje = `<div class="carta-container">${nombreJugador}: ${manoAHtml(manoJugador)} (${evaluacionJugador.rango})</div>`;
        mensaje += `<div class="carta-container">Computadora: ${manoAHtml(manoComputadora)} (${evaluacionComputadora.rango})</div>`;
        mensaje += `<div class="carta-container">Cartas comunitarias: ${manoAHtml(cartasComunitarias)}</div>`;
        mensaje += `<p>Ganador: ${ganador}</p>`;

        const registro = {
            manoJugador: manoAString(manoJugador), 
            manoComputadora: manoAString(manoComputadora),  
            cartasComunitarias: manoAString(cartasComunitarias),
            evaluacionJugador: evaluacionJugador.rango,
            evaluacionComputadora: evaluacionComputadora.rango, 
            ganador: ganador  
        };

        return { mensaje, registro };
    }

    function obtenerMejorMano(cartas) {
        // Esta función debería analizar todas las combinaciones posibles de 5 cartas y devolver la mejor mano.
        let mejorMano = [];
        let mejorEvaluacion = { rango: '', valor: [] };

        const combinaciones = obtenerCombinaciones(cartas, 5);

        for (const combinacion of combinaciones) {
            const evaluacion = evaluarMano(combinacion);
            if (compararManos(evaluacion, mejorEvaluacion) === evaluacion.rango) {
                mejorMano = combinacion;
                mejorEvaluacion = evaluacion;
            }
        }
        return mejorMano;
    }

    function obtenerCombinaciones(array, tamaño) {
        if (tamaño > array.length) return [];
        if (tamaño === array.length) return [array];
        if (tamaño === 1) return array.map((item) => [item]);

        const combinaciones = [];
        for (let i = 0; i < array.length - tamaño + 1; i++) {
            const cabeza = array.slice(i, i + 1);
            const colaCombinaciones = obtenerCombinaciones(array.slice(i + 1), tamaño - 1);
            for (const colaCombinacion of colaCombinaciones) {
                combinaciones.push(cabeza.concat(colaCombinacion));
            }
        }
        return combinaciones;
    }

    function evaluarMano(mano) {
        const valoresOrdenados = mano.map(carta => "23456789TJQKA".indexOf(carta.valor)).sort((a, b) => a - b);
        const esColor = mano.every(carta => carta.palo === mano[0].palo);
        const esEscalera = valoresOrdenados.every((val, index) => index === 0 || val === valoresOrdenados[index - 1] + 1);

        const conteoValores = mano.reduce((acumulado, carta) => {
            acumulado[carta.valor] = (acumulado[carta.valor] || 0) + 1;
            return acumulado;
        }, {});

        const valoresUnicos = Object.values(conteoValores).sort((a, b) => b - a);

        if (esEscalera && esColor && valoresOrdenados[0] === 8) {
            return { rango: 'Escalera real', valor: valoresOrdenados };
        } else if (esEscalera && esColor) {
            return { rango: 'Escalera de color', valor: valoresOrdenados };
        } else if (valoresUnicos[0] === 4) {
            return { rango: 'Póker', valor: valoresOrdenados };
        } else if (valoresUnicos[0] === 3 && valoresUnicos[1] === 2) {
            return { rango: 'Full', valor: valoresOrdenados };
        } else if (esColor) {
            return { rango: 'Color', valor: valoresOrdenados };
        } else if (esEscalera) {
            return { rango: 'Escalera', valor: valoresOrdenados };
        } else if (valoresUnicos[0] === 3) {
            return { rango: 'Trío', valor: valoresOrdenados };
        } else if (valoresUnicos[0] === 2 && valoresUnicos[1] === 2) {
            return { rango: 'Dos pares', valor: valoresOrdenados };
        } else if (valoresUnicos[0] === 2) {
            return { rango: 'Un par', valor: valoresOrdenados };
        } else {
            return { rango: 'Carta más alta', valor: valoresOrdenados };
        }
    }

    function compararManos(evaluacionJugador, evaluacionComputadora) {
        const rangos = ['Carta más alta', 'Un par', 'Dos pares', 'Trío', 'Escalera', 'Color', 'Full', 'Póker', 'Escalera de color', 'Escalera real'];
        const indiceRangoJugador = rangos.indexOf(evaluacionJugador.rango);
        const indiceRangoComputadora = rangos.indexOf(evaluacionComputadora.rango);

        if (indiceRangoJugador > indiceRangoComputadora) {
            return nombreJugador;
        } else if (indiceRangoJugador < indiceRangoComputadora) {
            return "Computadora";
        } else {
            for (let i = evaluacionJugador.valor.length - 1; i >= 0; i--) {
                if (evaluacionJugador.valor[i] > evaluacionComputadora.valor[i]) {
                    return nombreJugador;
                } else if (evaluacionJugador.valor[i] < evaluacionComputadora.valor[i]) {
                    return "Computadora";
                }
            }
            return "Empate";
        }
    }

    function manoAString(mano) {
        return mano.map(carta => `${carta.valor} de ${carta.palo}`).join(', ');
    }

    function manoAHtml(mano) {
        return mano.map(carta => `
            <div class="carta ${carta.palo === 'Corazones' || carta.palo === 'Diamantes' ? 'roja' : ''}">
                <div class="valor">${carta.valor}</div>
                <div class="palo">${carta.palo}</div>
            </div>
        `).join('');
    }
});
