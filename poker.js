document.addEventListener("DOMContentLoaded", () => {
    const botonJugar = document.getElementById('play-button');
    const botonTerminar = document.getElementById('end-game-button');
    const botonNuevaMano = document.getElementById('new-hand-button');
    const contenedorResultados = document.getElementById('result-container');
    const contenedorAcciones = document.getElementById('game-actions');

    let nombreJugador = '';

    botonJugar.addEventListener('click', () => {
        if (confirm("¿Quieres jugar?")) {
            nombreJugador = prompt("¿Cuál es tu nombre?", "Jugador");
            if (nombreJugador) {
                contenedorAcciones.style.display = 'flex';
                botonJugar.style.display = 'none';
                jugarNuevaMano();
            }
        } else {
            contenedorResultados.innerHTML = "Juego finalizado.";
        }
    });

    botonTerminar.addEventListener('click', () => {
        if (confirm("¿Estás seguro que deseas abandonar la partida?")) {
            contenedorResultados.innerHTML = "¡Gracias por jugar!";
            contenedorAcciones.style.display = 'none'; 
            botonJugar.style.display = 'block'; 
        }
    });

    botonNuevaMano.addEventListener('click', () => {
        jugarNuevaMano();
    });

    function jugarNuevaMano() {
        const resultado = jugarPoker(nombreJugador);
        contenedorResultados.innerHTML = resultado.mensaje;
        console.log(resultado.registro);
    }

    function jugarPoker(nombreJugador) {
        const mazo = crearMazo();
        const manoJugador = repartirMano(mazo);
        const manoComputadora = repartirMano(mazo);

        const evaluacionJugador = evaluarMano(manoJugador);
        const evaluacionComputadora = evaluarMano(manoComputadora);

        const ganador = determinarGanador(evaluacionJugador, evaluacionComputadora);

        let mensaje = `<div class="carta-container">${nombreJugador}: ${manoAHtml(manoJugador)} (${evaluacionJugador.rango})</div>`;
        mensaje += `<div class="carta-container">Computadora: ${manoAHtml(manoComputadora)} (${evaluacionComputadora.rango})</div>`;
        mensaje += `<p>Ganador: ${ganador}</p>`;

        const registro = {
            manoJugador: manoAString(manoJugador),
            manoComputadora: manoAString(manoComputadora),
            evaluacionJugador: evaluacionJugador.rango,
            evaluacionComputadora: evaluacionComputadora.rango,
            ganador: ganador
        };

        return { mensaje, registro };
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
        return mazo.splice(0, 5);
    }

    function evaluarMano(mano) {
        // rangos
        const rangos = ['Carta más alta', 'Un par', 'Dos pares', 'Trío', 'Escalera', 'Color', 'Full', 'Póker', 'Escalera de color', 'Escalera real'];
        return { rango: rangos[Math.floor(Math.random() * rangos.length)] };
    }

    function determinarGanador(evaluacionJugador, evaluacionComputadora) {
        const rangos = ['Carta más alta', 'Un par', 'Dos pares', 'Trío', 'Escalera', 'Color', 'Full', 'Póker', 'Escalera de color', 'Escalera real'];
        const indiceRangoJugador = rangos.indexOf(evaluacionJugador.rango);
        const indiceRangoComputadora = rangos.indexOf(evaluacionComputadora.rango);

        if (indiceRangoJugador > indiceRangoComputadora) {
            return nombreJugador;
        } else if (indiceRangoJugador < indiceRangoComputadora) {
            return "Computadora";
        } else {
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