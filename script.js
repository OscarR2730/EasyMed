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
    const dniInput = document.getElementById('dni-input').value.trim();
    
    if (dniInput.length >= 8) {
        citaDatos.dni = dniInput.substring(0, 8);
        navegarA('view-specialty');
    } else {
        alert("Por favor, ingresa tu número de DNI de 8 dígitos.");
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
    if(fontSize < 24) { 
        fontSize
        
