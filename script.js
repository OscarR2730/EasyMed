let citaDatos = {
    dni: '',
    especialidad: '',
    fecha: '',
    hora: ''
};

function navegarA(idVista) {
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
        view.classList.add('hidden');
    });
    const vistaDestino = document.getElementById(idVista);
    vistaDestino.classList.remove('hidden');
    vistaDestino.classList.add('active');
    reiniciarTemporizador();
}

function validarPaso1() {
    const dniInput = document.getElementById('dni-input').value;
    if (dniInput.length === 8) {
        citaDatos.dni = dniInput;
        navegarA('view-specialty');
    } else {
        alert("Por favor, ingresa un número de DNI válido de 8 dígitos.");
    }
}

function validarPaso2() {
    if (citaDatos.especialidad !== '') {
        navegarA('view-datetime');
    } else {
        alert("Por favor, selecciona una especialidad para continuar.");
    }
}

function validarPaso3() {
    if (citaDatos.fecha !== '' && citaDatos.hora !== '') {
        const fechaObj = new Date(citaDatos.fecha);
        fechaObj.setMinutes(fechaObj.getMinutes() + fechaObj.getTimezoneOffset()); 
        
        const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        let fechaFormateada = fechaObj.toLocaleDateString('es-PE', opciones);
        fechaFormateada = fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1);

        document.getElementById('res-specialty').innerText = citaDatos.especialidad;
        document.getElementById('res-date').innerText = fechaFormateada;
        document.getElementById('res-time').innerText = citaDatos.hora;
        
        navegarA('view-confirmation');
    } else {
        alert("Por favor, asegúrate de seleccionar una fecha y un horario.");
    }
}

function finalizarCita() {
    alert("¡Cita confirmada exitosamente!\nSe ha enviado un SMS al número asociado a tu DNI con el ticket de reserva.");
    citaDatos = { dni: '', especialidad: '', fecha: '', hora: '' };
    document.getElementById('dni-input').value = '';
    document.getElementById('date-input').value = '';
    document.querySelectorAll('.card-btn').forEach(btn => btn.classList.remove('selected'));
    navegarA('view-login');
}

function seleccionarCard(tipo, valor, elemento) {
    const contenedor = elemento.parentElement;
    const botones = contenedor.querySelectorAll('.card-btn');
    botones.forEach(btn => btn.classList.remove('selected'));
    
    elemento.classList.add('selected');
    
    if (tipo === 'especialidad') citaDatos.especialidad = valor;
    if (tipo === 'hora') citaDatos.hora = valor;
}

function guardarFecha() {
    citaDatos.fecha = document.getElementById('date-input').value;
}

let fontSize = 16;
document.getElementById('btn-text-increase').addEventListener('click', () => {
    if(fontSize < 24) { fontSize += 2; document.body.style.fontSize = fontSize + 'px'; }
});
document.getElementById('btn-text-decrease').addEventListener('click', () => {
    if(fontSize > 14) { fontSize -= 2; document.body.style.fontSize = fontSize + 'px'; }
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
    const placeholderOriginal = inputTarget.placeholder;
    inputTarget.placeholder = "Escuchando...";
    
    recognition.start();
    
    recognition.onresult = function(event) {
        let textoDictado = event.results[0][0].transcript;
        
        if(inputId === 'dni-input') {
            textoDictado = textoDictado.replace(/\s+/g, '');
            textoDictado = textoDictado.replace(/\D/g, '');
            textoDictado = textoDictado.substring(0, 8);
        }
        
        inputTarget.value = textoDictado;
        inputTarget.placeholder = placeholderOriginal;
        
        if(inputId === 'date-input') { guardarFecha(); }
    };
    
    recognition.onerror = function(event) {
        alert("No se pudo detectar el audio. Asegúrate de dar permisos de micrófono.");
        inputTarget.placeholder = placeholderOriginal;
    };
}

let temporizadorInactividad;
const TIEMPO_LIMITE = 90000;

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
document.onclick = reiniciarTemporizador;
document.onkeypress = reiniciarTemporizador;
