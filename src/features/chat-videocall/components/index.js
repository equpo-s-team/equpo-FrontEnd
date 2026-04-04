// Funcionalidad para la página index.html

document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticación antes de inicializar
    if (!checkAuthentication()) {
        return; // Si no está autenticado, sale sin inicializar
    }
    initializeIndexPage();
});

/**
 * Inicializa la página de índice
 */
function initializeIndexPage() {
    setGreeting();
    initializeEventListeners();
    loadUserData();
}

/**
 * Establece el saludo personalizado según la hora del día
 */
function setGreeting() {
    const greetingElement = document.getElementById('user-greeting');
    const hour = new Date().getHours();
    let greeting = '';

    if (hour < 12) {
        greeting = 'Buenos días';
    } else if (hour < 18) {
        greeting = 'Buenas tardes';
    } else {
        greeting = 'Buenas noches';
    }

    // Obtener nombre del usuario del localStorage o usar "Usuario"
    const userName = localStorage.getItem('userName') || 'Usuario';
    greetingElement.textContent = `${greeting}, ${userName}`;
}

/**
 * Inicializa los event listeners
 */
function initializeEventListeners() {
    // Botón Nueva Llamada
    const newCallBtn = document.querySelector('.action-btn.primary');
    if (newCallBtn) {
        newCallBtn.addEventListener('click', startNewCall);
    }

    // Botones de llamada en contactos frecuentes
    const contactActionBtns = document.querySelectorAll('.contact-action');
    contactActionBtns.forEach(btn => {
        btn.addEventListener('click', initiateCallToContact);
    });

    // Botones de unirse a reunión
    const joinMeetingBtns = document.querySelectorAll('.meeting-action.primary');
    joinMeetingBtns.forEach(btn => {
        btn.addEventListener('click', joinMeeting);
    });

    // Botones para llamar en llamadas recientes
    const callActionBtns = document.querySelectorAll('.call-action');
    callActionBtns.forEach(btn => {
        btn.addEventListener('click', initiateCall);
    });

    // Botones para agregar contacto
    const addContactBtns = document.querySelectorAll('.btn-add');
    addContactBtns.forEach(btn => {
        btn.addEventListener('click', addContact);
    });

    // Botones de redes sociales en usuarios en línea
    const userBubbles = document.querySelectorAll('.user-bubble');
    userBubbles.forEach(bubble => {
        bubble.addEventListener('click', viewUserProfile);
    });

    // Cerrar sesión
    const logoutBtn = document.querySelector('.logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
}

/**
 * Inicia una nueva llamada
 */
function startNewCall() {
    console.log('Iniciando nueva llamada...');
    
    // Mostrar modal o diálogo para seleccionar contacto
    const contactName = prompt('Ingresa el nombre del contacto a llamar:');
    
    if (contactName) {
        console.log(`Llamando a: ${contactName}`);
        // Aquí iría la lógica para conectar con el servidor WebRTC
        alert(`Iniciando llamada a ${contactName}...`);
        // window.location.href = `/call.html?contact=${encodeURIComponent(contactName)}`;
    }
}

/**
 * Inicia una llamada a un contacto frecuente
 */
function initiateCallToContact(e) {
    const contactItem = e.currentTarget.closest('.contact-item');
    const contactName = contactItem.querySelector('.contact-info h4').textContent;
    
    console.log(`Llamando a: ${contactName}`);
    alert(`Iniciando videollamada con ${contactName}...`);
    // window.location.href = `/call.html?contact=${encodeURIComponent(contactName)}`;
}

/**
 * Inicia un llamada desde el historial
 */
function initiateCall(e) {
    const callItem = e.currentTarget.closest('.call-item');
    const contactName = callItem.querySelector('.call-details h4').textContent;
    
    console.log(`Llamando a: ${contactName}`);
    alert(`Iniciando videollamada con ${contactName}...`);
    // window.location.href = `/call.html?contact=${encodeURIComponent(contactName)}`;
}

/**
 * Se une a una reunión
 */
function joinMeeting(e) {
    e.preventDefault();
    
    const meetingItem = e.currentTarget.closest('.meeting-item');
    const meetingTitle = meetingItem.querySelector('.meeting-details h4').textContent;
    const meetingTime = meetingItem.querySelector('.time-hour').textContent;
    
    console.log(`Uniéndose a: ${meetingTitle} a las ${meetingTime}`);
    alert(`Uniéndose a la reunión: ${meetingTitle}`);
    // window.location.href = `/meeting.html?title=${encodeURIComponent(meetingTitle)}`;
}

/**
 * Agrega un nuevo contacto
 */
function addContact(e) {
    e.preventDefault();
    
    const suggestionItem = e.currentTarget.closest('.suggestion-item');
    const contactName = suggestionItem.querySelector('.suggestion-info h4').textContent;
    
    console.log(`Agregando contacto: ${contactName}`);
    
    // Cambiar el botón a indicador de agregado
    const btn = e.currentTarget;
    btn.innerHTML = '<i class="fas fa-check"></i>';
    btn.disabled = true;
    
    // Aquí iría la lógica para enviar al servidor
    fetch('/api/contacts/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contactName })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Contacto agregado exitosamente:', data);
        alert(`${contactName} ha sido agregado a tus contactos`);
    })
    .catch(error => {
        console.error('Error al agregar contacto:', error);
        btn.innerHTML = '<i class="fas fa-plus"></i>';
        btn.disabled = false;
    });
}

/**
 * Ve el perfil de un usuario
 */
function viewUserProfile(e) {
    const userName = e.currentTarget.querySelector('.user-name').textContent;
    console.log(`Viendo perfil de: ${userName}`);
    // window.location.href = `/profile.html?user=${encodeURIComponent(userName)}`;
}

/**
 * Carga datos del usuario desde el servidor
 */
function loadUserData() {
    // Obtener información del usuario del servidor
    fetch('/api/user/profile')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar perfil');
            }
            return response.json();
        })
        .then(data => {
            console.log('Datos del usuario:', data);
            // Actualizar nombre si es necesario
            if (data.name) {
                localStorage.setItem('userName', data.name);
                setGreeting();
            }
            // Actualizar avatar si existe
            if (data.avatar) {
                const avatarElements = document.querySelectorAll('.profile-avatar');
                avatarElements.forEach(el => {
                    el.src = data.avatar;
                });
            }
        })
        .catch(error => {
            console.log('No se pudo cargar el perfil (probablemente no autenticado):', error);
        });
}

/**
 * Maneja el cierre de sesión
 */
function handleLogout(e) {
    e.preventDefault();
    
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            // Limpiar datos locales primero
            localStorage.removeItem('user');
            localStorage.removeItem('userName');
            localStorage.removeItem('rememberEmail');
            
            // Enviar solicitud de logout al servidor (opcional)
            if (user && user.email) {
                fetch('/users/logout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: user.email })
                }).catch(error => console.log('Error en logout:', error));
            }
            
            // Redirigir al login
            window.location.href = '/login.html';
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            // Limpiar localStorage de todas formas
            localStorage.clear();
            window.location.href = '/login.html';
        }
    }
}

/**
 * Verifica si el usuario está autenticado
 */
function checkAuthentication() {
    const user = localStorage.getItem('user');
    const userName = localStorage.getItem('userName');
    
    if (!user || !userName) {
        console.log('Usuario no autenticado, redirigiendo a login...');
        window.location.href = '/login.html';
        return false;
    }
    
    return true;
}

/**
 * Abre el menú dropdown del perfil
 */
function toggleProfileMenu() {
    const dropdownMenu = document.querySelector('.dropdown-menu');
    if (dropdownMenu) {
        dropdownMenu.classList.toggle('show');
    }
}

/**
 * Cerrar menú dropdown al hacer click fuera
 */
document.addEventListener('click', function(event) {
    const profileNav = document.querySelector('.navbar-profile');
    if (profileNav && !profileNav.contains(event.target)) {
        const dropdownMenu = profileNav.querySelector('.dropdown-menu');
        if (dropdownMenu) {
            dropdownMenu.classList.remove('show');
        }
    }
});

// Placeholder para futuras funcionalidades
console.log('Index.js cargado exitosamente');
