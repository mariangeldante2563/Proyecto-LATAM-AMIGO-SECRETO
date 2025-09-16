// Amigo Secreto - Versión Optimizada
// Array para almacenar los nombres de los amigos
let listaAmigos = [];

// Función para agregar un amigo a la lista
function agregarAmigo() {
    const input = document.getElementById('amigo');
    const nombre = input.value.trim();
    
    // Validar que el nombre no esté vacío
    if (nombre === '') {
        mostrarAlerta('Por favor, ingresa un nombre válido');
        return;
    }
    
    // Validar que el nombre no esté duplicado
    if (listaAmigos.includes(nombre)) {
        mostrarAlerta('Este nombre ya está en la lista');
        input.value = '';
        return;
    }
    
    // Agregar el nombre al array
    listaAmigos.push(nombre);
    
    // Limpiar el input
    input.value = '';
    
    // Actualizar la visualización
    mostrarAmigos();
}

// Función para mostrar los amigos como tarjetas
function mostrarAmigos() {
    const lista = document.getElementById('listaAmigos');
    lista.innerHTML = '';
    
    listaAmigos.forEach((nombre, index) => {
        const tarjeta = document.createElement('li');
        tarjeta.className = 'friend-card';
        
        tarjeta.innerHTML = `
            <div class="card-content">
                <span class="friend-name">${nombre}</span>
                <button class="delete-btn" onclick="eliminarAmigo(${index})" title="Eliminar ${nombre}">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        lista.appendChild(tarjeta);
    });
}

// Función para eliminar un amigo de la lista
function eliminarAmigo(index) {
    listaAmigos.splice(index, 1);
    mostrarAmigos();
}

// Función para sortear un amigo secreto
function sortearAmigo() {
    const resultado = document.getElementById('resultado');
    
    // Validar que haya al menos 2 amigos
    if (listaAmigos.length < 2) {
        mostrarAlerta('Necesitas al menos 2 amigos para hacer el sorteo');
        return;
    }
    
    // Seleccionar un amigo aleatorio
    const indiceAleatorio = Math.floor(Math.random() * listaAmigos.length);
    const amigoSecreto = listaAmigos[indiceAleatorio];
    
    // Mostrar el resultado con animación
    resultado.innerHTML = `
        <li class="result-card">
            <div class="result-content">
                <h3>🎉 Tu Amigo Secreto es:</h3>
                <p class="secret-friend-name">${amigoSecreto}</p>
                <div class="restart-info">
                    <p>Nueva ronda en: <span id="countdown">10</span> segundos</p>
                    <button class="restart-btn" onclick="reiniciarJuego()">Reiniciar Ahora</button>
                </div>
            </div>
        </li>
    `;
    
    // Scroll hacia el resultado
    resultado.scrollIntoView({ behavior: 'smooth' });
    
    // Iniciar cuenta regresiva
    iniciarCuentaRegresiva();
}

// Función para iniciar la cuenta regresiva
function iniciarCuentaRegresiva() {
    let tiempoRestante = 10;
    const countdownElement = document.getElementById('countdown');
    
    const intervalo = setInterval(() => {
        tiempoRestante--;
        if (countdownElement) {
            countdownElement.textContent = tiempoRestante;
        }
        
        if (tiempoRestante <= 0) {
            clearInterval(intervalo);
            reiniciarJuego();
        }
    }, 1000);
}

// Función para reiniciar el juego
function reiniciarJuego() {
    // Limpiar datos
    listaAmigos = [];
    
    // Limpiar visualizaciones
    document.getElementById('listaAmigos').innerHTML = '';
    document.getElementById('resultado').innerHTML = '';
    document.getElementById('amigo').value = '';
    
    // Enfocar el input
    document.getElementById('amigo').focus();
    
    // Mostrar mensaje temporal
    const resultado = document.getElementById('resultado');
    resultado.innerHTML = `
        <li class="new-round-card">
            <div class="new-round-content">
                <h3>🔄 Nueva Ronda Iniciada</h3>
                <p>¡Agrega nuevos amigos para comenzar!</p>
            </div>
        </li>
    `;
    
    // Eliminar mensaje después de 3 segundos
    setTimeout(() => {
        resultado.innerHTML = '';
    }, 3000);
}

// Función para mostrar alertas personalizadas
function mostrarAlerta(mensaje) {
    // Crear overlay
    const overlay = document.createElement('div');
    overlay.className = 'alert-overlay';
    
    // Crear modal de alerta
    const alertModal = document.createElement('div');
    alertModal.className = 'alert-modal';
    alertModal.innerHTML = `
        <div class="alert-content">
            <h4>⚠️ Atención</h4>
            <p>${mensaje}</p>
            <button onclick="cerrarAlerta()" class="alert-btn">Entendido</button>
        </div>
    `;
    
    overlay.appendChild(alertModal);
    document.body.appendChild(overlay);
    
    // Auto-cerrar después de 3 segundos
    setTimeout(() => {
        cerrarAlerta();
    }, 3000);
}

// Función para cerrar alerta
function cerrarAlerta() {
    const overlay = document.querySelector('.alert-overlay');
    if (overlay) {
        document.body.removeChild(overlay);
    }
}

// Sistema de partículas simplificado
class ParticleSystem {
    constructor() {
        this.container = document.getElementById('particles-container');
        this.particles = [];
        this.maxParticles = window.innerWidth > 768 ? 25 : 15; // Reducido para mejor rendimiento
        this.isRunning = false;
    }

    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Posición inicial
        particle.style.left = Math.random() * window.innerWidth + 'px';
        particle.style.bottom = '-10px';
        
        // Duración de animación
        const duration = 8 + Math.random() * 8; // 8-16 segundos
        particle.style.animationDuration = duration + 's';
        
        this.container.appendChild(particle);
        this.particles.push(particle);
        
        // Remover partícula al finalizar
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
                this.particles = this.particles.filter(p => p !== particle);
            }
        }, (duration + 1) * 1000);
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        
        // Crear partículas periódicamente
        this.particleInterval = setInterval(() => {
            if (this.particles.length < this.maxParticles) {
                this.createParticle();
            }
        }, 2000); // Cada 2 segundos
    }

    stop() {
        this.isRunning = false;
        if (this.particleInterval) {
            clearInterval(this.particleInterval);
        }
    }
}

// Sistema de estrellas simplificado
class StarField {
    constructor() {
        this.container = document.getElementById('stars-container');
        this.stars = [];
        this.maxStars = window.innerWidth > 768 ? 30 : 20; // Reducido
        this.isRunning = false;
    }

    createStar() {
        const star = document.createElement('div');
        star.className = 'star';
        
        // Tamaño aleatorio
        const sizes = ['small', 'medium', 'large'];
        star.classList.add(sizes[Math.floor(Math.random() * sizes.length)]);
        
        // Posición
        star.style.left = Math.random() * window.innerWidth + 'px';
        star.style.top = window.innerHeight + 'px';
        
        // Duración
        const duration = 15 + Math.random() * 15; // 15-30 segundos
        star.style.animationDuration = duration + 's';
        
        this.container.appendChild(star);
        this.stars.push(star);
        
        // Remover al finalizar
        setTimeout(() => {
            if (star.parentNode) {
                star.parentNode.removeChild(star);
                this.stars = this.stars.filter(s => s !== star);
            }
        }, (duration + 1) * 1000);
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        
        // Crear estrellas periódicamente
        this.starInterval = setInterval(() => {
            if (this.stars.length < this.maxStars) {
                this.createStar();
            }
        }, 3000); // Cada 3 segundos
    }

    stop() {
        this.isRunning = false;
        if (this.starInterval) {
            clearInterval(this.starInterval);
        }
    }
}

// Instancias globales
let particleSystem;
let starField;

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    const input = document.getElementById('amigo');
    
    // Manejar tecla Enter
    input.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            agregarAmigo();
        }
    });
    
    // Inicializar sistemas de efectos
    if (document.getElementById('particles-container')) {
        particleSystem = new ParticleSystem();
        particleSystem.start();
    }
    
    if (document.getElementById('stars-container')) {
        starField = new StarField();
        starField.start();
    }
    
    // Pausar efectos cuando la página no esté visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            if (particleSystem) particleSystem.stop();
            if (starField) starField.stop();
        } else {
            if (particleSystem) particleSystem.start();
            if (starField) starField.start();
        }
    });
});

// Ajustar al cambiar tamaño de ventana
window.addEventListener('resize', () => {
    if (particleSystem) {
        particleSystem.maxParticles = window.innerWidth > 768 ? 25 : 15;
    }
    if (starField) {
        starField.maxStars = window.innerWidth > 768 ? 30 : 20;
    }
});