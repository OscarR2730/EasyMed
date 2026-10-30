window.citaDatos = {
    dni: '',
    especialidad: '',
    fecha: '',
    hora: ''
};

window.navegarA = function(idVista) {
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
        view.classList.add('hidden');
    });
    const vistaDestino = document.getElementById(idVista);
    if (vistaDestino) {
        vistaDestino.classList.remove('hidden');
        vistaDestino.classList.add('active');
    }
    window.reiniciarTemporizador();
};

window.validarPaso1 = function() {
    const input = document.getElementById('dni-input');
    if (!input) return;
    
    let valorDni = input.value.replace(/\s+/g, '');
    
    if (valorDni.length >= 8) {
        window.citaDatos.dni = valorDni.substring(0, 8);
        window.navegarA('view-specialty');
    } else {
        alert("Por favor, ingresa tu número de DNI de 8 dígitos.");
    }
};

window.validarPaso2 = function() {
    if (window.citaDatos.especialidad !== '') {
        window.navegarA('view-datetime');
    } else {
        alert("Por favor, selecciona una especialidad para continuar.");
    }
};

window.validarPaso3 = function() {
    if (window.citaDatos.fecha !== '' && window.citaDatos.hora !== '') {
        const fechaObj = new Date(window.citaDatos.fecha);
        fechaObj.setMinutes(fechaObj.getMinutes() + fechaObj.getTimezoneOffset()); 
        
        const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        let fechaFormateada = fechaObj.toLocaleDateString('es-PE', opciones);
        fechaFormateada = fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1);

        document.getElementById('res-specialty').innerText = window.citaDatos.especialidad;
        document.getElementById('res-date').innerText = fechaFormateada;
        document.getElementById('res-time').innerText = window.citaDatos.hora;
        
        window.navegarA('view-confirmation');
    } else {
        alert("Por favor, asegúrate de seleccionar una fecha y un horario.");
    }
};

window.finalizarCita = function() {
    alert("¡Cita confirmada exitosamente!\nSe ha enviado un SMS al número asociado a tu DNI con el ticket de reserva.");
    window.citaDatos = { dni: '', especialidad: '', fecha: '', hora: '' };
    document.getElementById('dni-input').value = '';
    document.getElementById('date-input').value = '';
    document.querySelectorAll('.card-btn').forEach(btn => btn.classList.remove('selected'));
    window.navegarA('view-login');
};

window.seleccionarCard = function(tipo, valor, elemento) {
    const contenedor = elemento.parentElement;
    const botones = contenedor.querySelectorAll('.card-btn');
    botones.forEach(btn => btn.classList.remove('selected'));
    
    elemento.classList.add('selected');
    
    if (tipo === 'especialidad') window.citaDatos.especialidad = valor;
    if (tipo === 'hora') window.citaDatos.hora = valor;
};

window.guardarFecha = function() {
    const dateInput = document.getElementById('date-input');
    if (dateInput) {
        window.citaDatos.fecha = dateInput.value;
    }
};

window.iniciarDictado = function(inputId) {
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
        
        if(inputId === 'date-input') { window.guardarFecha(); }
    };
    
    recognition.onerror = function(event) {
        alert("No se pudo detectar el audio. Asegúrate de dar permisos de micrófono.");
        inputTarget.placeholder = placeholderOriginal;
    };
};

let temporizadorInactividad;
window.reiniciarTemporizador = function() {
    clearTimeout(temporizadorInactividad);
    temporizadorInactividad = setTimeout(() => {
        const modal = document.getElementById('timeout-modal');
        if (modal) modal.classList.remove('hidden');
    }, 90000); 
};

window.extenderSesion = function() {
    const modal = document.getElementById('timeout-modal');
    if (modal) modal.classList.add('hidden');
    window.reiniciarTemporizador();
};

document.onmousemove = window.reiniciarTemporizador;
document.onclick = window.reiniciarTemporizador;
document.onkeypress = window.reiniciarTemporizador;

document.addEventListener('DOMContentLoaded', () => {
    let currentFontSize = 16;
    
    const btnIncrease = document.getElementById('btn-text-increase');
    const btnDecrease = document.getElementById('btn-text-decrease');
    const btnContrast = document.getElementById('btn-contrast');

    if (btnIncrease) {
        btnIncrease.addEventListener('click', () => {
            if (currentFontSize < 24) { 
                currentFontSize += 2; 
                document.documentElement.style.setProperty('--base-font-size', currentFontSize + 'px');
            }
        });
    }

    if (btnDecrease) {
        btnDecrease.addEventListener('click', () => {
            if (currentFontSize > 12) { 
                currentFontSize -= 2; 
                document.documentElement.style.setProperty('--base-font-size', currentFontSize + 'px');
            }
        });
    }

    if (btnContrast) {
        btnContrast.addEventListener('click', () => {
            document.body.classList.toggle('high-contrast');
        });
    }
});
