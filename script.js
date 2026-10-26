let citaDatos = {
    especialidad: '',
    fecha: '',
    hora: ''
};

function navegarA(idVistaOcultarAMostrar) {
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
        view.classList.add('hidden');
    });
    const vistaDestino = document.getElementById(idVistaOcultarAMostrar);
    vistaDestino.classList.remove('hidden');
    vistaDestino.classList.add('active');
    
    if(idVistaOcultarAMostrar === 'view-confirmation') {
        document.getElementById('res-specialty').innerText = citaDatos.especialidad || 'No seleccionada';
        document.getElementById('res-date').innerText = citaDatos.fecha || document.getElementById('date-input').value;
        document.getElementById('res-time').innerText = citaDatos.hora || 'No seleccionada';
    }
    
    reiniciarTemporizador();
}

function seleccionarEspecialidad(especialidad) {
    citaDatos.especialidad = especialidad;
    alert("Seleccionaste: " + especialidad);
    navegarA('view-datetime');
}

function seleccionarHora(hora) {
    citaDatos.fecha = document.getElementById('date-input').value;
    citaDatos.hora = hora;
    if(!citaDatos.fecha) {
        alert("Por favor, elige una fecha primero.");
        return;
    }
    navegarA('view-confirmation');
}

function finalizarCita() {
    alert("¡Cita confirmada exitosamente! Te hemos enviado un SMS con los detalles.");
    navegarA('view-login');
}

let fontSize = 16;
document.getElementById('btn-text-increase').addEventListener('click', () => {
    if(fontSize < 24) { fontSize += 2; document.body.style.fontSize = fontSize + 'px'; }
});
document.getElementById('btn-text-decrease').addEventListener('click', () => {
    if(fontSize > 12) { fontSize -= 2; document.body.style.fontSize = fontSize + 'px'; }
});

document.getElementById('btn-contrast').addEventListener('click', () => {
    document.body.classList.toggle('high-contrast');
});

function iniciarDictado(inputId) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert("Tu navegador no soporta el dictado por voz. Intenta usar Google Chrome.");
        return;
    }
    
    const recognition = new SpeechRecognition();
    recognition.lang = 'es-PE';
    recognition.interimResults = false;
    
    const inputTarget = document.getElementById(inputId);
    inputTarget.placeholder = "Escuchando...";
    
    recognition.start();
    
    recognition.onresult = function(event) {
        const textoDictado = event.results[0][0].transcript;
        inputTarget.value = textoDictado;
        inputTarget.placeholder = "Búsqueda...";
    };
    
    recognition.onerror = function(event) {
        alert("Hubo un error con el micrófono: " + event.error);
        inputTarget.placeholder = "Intenta escribirlo...";
    };
}

let temporizadorInactividad;
const TIEMPO_LIMITE = 60000;

function reiniciarTemporizador() {
    clearTimeout(temporizadorInactividad);
    temporizadorInactividad = setTimeout(() => {
        document.getElementById('timeout-modal').classList.remove('hidden');
    }, TIEMPO_LIMITE);
}

function extenderSesion() {
    document.getElementById('timeout-modal').classList.add('hidden');
    reiniciarTemporizador();
}

window.onload = reiniciarTemporizador;
document.onmousemove = reiniciarTemporizador;
document.onkeypress = reiniciarTemporizador;
