
// AMIGO SECRETO - JAVASCRIPT 
// Configuración general
// ===============================================
const CONFIG = {
    MIN_FRIENDS: 3,
    MAX_FRIENDS: 50,
    COUNTDOWN_TIME: 10,
    PARTICLE_COUNT: 30,
    STAR_COUNT: 150,
    TOAST_DURATION: 4000
};

// Estado de la aplicación
let appState = {
    friends: [],
    currentResults: {},
    isDrawing: false,
    currentRound: 1,
    particleSystem: null,
    starField: null,
    countdownTimer: null
};

// ===============================================
// CLASE SISTEMA DE PARTÍCULAS EFECTO DE FONDO
// ===============================================

class ParticleSystem {
    constructor(container) {
        this.container = container;
        this.particles = [];
        this.isRunning = false;
        this.rafId = null;
    }

    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // En esta seccion se establece la posición aleatoria
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 3 + 4) + 's';
        particle.style.animationDelay = Math.random() * 2 + 's';

        // Variaciones de tamaño y color en el código
        const size = Math.random() * 3 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        const opacity = Math.random() * 0.6 + 0.3;
        particle.style.opacity = opacity;
        
        return particle;
    }

    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.container.innerHTML = '';
        
        // Crear partículas iniciales en la pantalla
        for (let i = 0; i < CONFIG.PARTICLE_COUNT; i++) {
            const particle = this.createParticle();
            this.particles.push(particle);
            this.container.appendChild(particle);
        }
        
        this.animate();
    }

    animate() {
        if (!this.isRunning) return;
        
        // Añadir nueva partícula ocasionalmente, es decir que no sea constante
        if (Math.random() < 0.1 && this.particles.length < CONFIG.PARTICLE_COUNT * 1.5) {
            const particle = this.createParticle();
            this.particles.push(particle);
            this.container.appendChild(particle);
        }
        
        // Limpiar partículas viejas para que sean transparentes
        this.particles = this.particles.filter(particle => {
            if (particle.offsetTop > window.innerHeight + 100) {
                particle.remove();
                return false;
            }
            return true;
        });
        
        this.rafId = requestAnimationFrame(() => this.animate());
    }

    stop() {
        this.isRunning = false;
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }
        this.particles.forEach(particle => particle.remove());
        this.particles = [];
    }
}

// ===============================================
// CLASE CAMPO DE ESTRELLAS OPTIMIZADA
// ===============================================

class StarField {
    constructor(container) {
        this.container = container;
        this.stars = [];
        this.isRunning = false;
        this.rafId = null;
    }

    createStar() {
        const star = document.createElement('div');
        star.className = 'star';

        // todos los tipos de estrellas
        const types = ['small', 'medium', 'large'];
        const weights = [0.6, 0.3, 0.1]; // Probabilidades
        const type = this.weightedRandom(types, weights);
        star.classList.add(type);
        
        // Posición y animación
        star.style.left = Math.random() * 100 + '%';
        star.style.animationDuration = (Math.random() * 4 + 6) + 's';
        star.style.animationDelay = Math.random() * 3 + 's';
        
        return star;
    }

    weightedRandom(items, weights) {
        const random = Math.random();
        let weightSum = 0;
        
        for (let i = 0; i < items.length; i++) {
            weightSum += weights[i];
            if (random <= weightSum) {
                return items[i];
            }
        }
        
        return items[items.length - 1];
    }

    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.container.innerHTML = '';
        
        // Crear estrellas iniciales
        for (let i = 0; i < CONFIG.STAR_COUNT; i++) {
            const star = this.createStar();
            this.stars.push(star);
            this.container.appendChild(star);
        }
        
        this.animate();
    }

    animate() {
        if (!this.isRunning) return;
        
        // Añadir nueva estrella ocasionalmente
        if (Math.random() < 0.05 && this.stars.length < CONFIG.STAR_COUNT * 1.2) {
            const star = this.createStar();
            this.stars.push(star);
            this.container.appendChild(star);
        }
        
        // Limpiar estrellas viejas
        this.stars = this.stars.filter(star => {
            if (star.offsetTop > window.innerHeight + 50) {
                star.remove();
                return false;
            }
            return true;
        });
        
        this.rafId = requestAnimationFrame(() => this.animate());
    }

    stop() {
        this.isRunning = false;
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }
        this.stars.forEach(star => star.remove());
        this.stars = [];
    }
}

// ===============================================
// SISTEMA DE NOTIFICACIONES MEJORADO
// ===============================================

class ToastManager {
    constructor() {
        this.container = this.createContainer();
        this.toasts = [];
    }

    createContainer() {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10001;
                display: flex;
                flex-direction: column;
                gap: 10px;
                max-width: 400px;
            `;
            document.body.appendChild(container);
        }
        return container;
    }

    show(message, type = 'info', duration = CONFIG.TOAST_DURATION) {
        const toast = this.createToast(message, type);
        this.container.appendChild(toast);
        this.toasts.push(toast);

        // Animación de entrada
        requestAnimationFrame(() => {
            toast.style.transform = 'translateX(0)';
            toast.style.opacity = '1';
        });

        // Auto-eliminar
        setTimeout(() => {
            this.remove(toast);
        }, duration);

        return toast;
    }

    createToast(message, type) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.style.cssText = `
            background: linear-gradient(145deg, #1a1a1a, #2a2a2a);
            border: 2px solid;
            border-radius: 8px;
            padding: 10px 20px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
            transform: translateX(100%);
            opacity: 0;
            transition: all 0.3s ease;
            cursor: pointer;
        `;

        // Colores por tipo
        const colors = {
            success: '#4caf50',
            error: '#ff4444',
            warning: '#ffc107',
            info: '#2196f3'
        };
        toast.style.borderColor = colors[type] || colors.info;

        // Iconos por tipo
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };

        toast.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 1.2rem;">${icons[type] || icons.info}</span>
                <span style="color: #ffffff; font-size: 0.9rem;">${message}</span>
                <button style="background: none; border: none; color: #888; cursor: pointer; padding: 2px;">✕</button>
            </div>
        `;

        // Event listeners
        const closeBtn = toast.querySelector('button');
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.remove(toast);
        });

        toast.addEventListener('click', () => {
            this.remove(toast);
        });

        return toast;
    }

    remove(toast) {
        if (!toast.parentElement) return;

        toast.style.transform = 'translateX(100%)';
        toast.style.opacity = '0';

        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
            this.toasts = this.toasts.filter(t => t !== toast);
        }, 300);
    }

    clear() {
        this.toasts.forEach(toast => this.remove(toast));
    }
}

// ===============================================
// SISTEMA DE ALERTAS PERSONALIZADAS
// ===============================================

class AlertManager {
    static show(title, message, type = 'alert') {
        return new Promise((resolve) => {
            const overlay = document.createElement('div');
            overlay.className = 'alert-overlay';
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
                animation: fadeIn 0.3s ease;
                backdrop-filter: blur(5px);
            `;

            const modal = document.createElement('div');
            modal.className = `alert-modal ${type}`;
            modal.style.cssText = `
                background: linear-gradient(145deg, #1a1a1a, #2a2a2a);
                border: 2px solid #57f40e;
                border-radius: 15px;
                padding: 30px;
                text-align: center;
                max-width: 400px;
                animation: modalAppear 0.3s ease;
                box-shadow: 0 0 30px rgba(87, 244, 14, 0.4), 0 20px 60px rgba(0, 0, 0, 0.5);
            `;

            if (type === 'confirm') {
                modal.style.borderColor = '#ffc107';
            }

            modal.innerHTML = `
                <div class="alert-content">
                    <h4 style="color: ${type === 'confirm' ? '#ffc107' : '#57f40e'}; font-size: 1.5rem; margin-bottom: 20px;">${title}</h4>
                    <p style="color: #ffffff; margin-bottom: 20px; line-height: 1.5;">${message}</p>
                    <div class="${type === 'confirm' ? 'confirm-buttons' : ''}" style="display: flex; gap: 10px; justify-content: center;">
                        ${type === 'confirm' ? 
                            `<button class="confirm-btn alert-btn" style="background: linear-gradient(145deg, #ff4444, #cc3333);">Sí</button>
                             <button class="cancel-btn alert-btn" style="background: linear-gradient(145deg, #666, #888);">No</button>` :
                            `<button class="alert-btn" style="background: linear-gradient(145deg, #57f40e, #45c20a);">Aceptar</button>`
                        }
                    </div>
                </div>
            `;

            // Estilos para botones
            modal.querySelectorAll('.alert-btn').forEach(btn => {
                btn.style.cssText += `
                    border: none;
                    border-radius: 8px;
                    color: #ffffff;
                    padding: 12px 24px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-size: 1rem;
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                `;
            });

            overlay.appendChild(modal);
            document.body.appendChild(overlay);

            // Event listeners
            if (type === 'confirm') {
                modal.querySelector('.confirm-btn').addEventListener('click', () => {
                    document.body.removeChild(overlay);
                    resolve(true);
                });
                modal.querySelector('.cancel-btn').addEventListener('click', () => {
                    document.body.removeChild(overlay);
                    resolve(false);
                });
            } else {
                modal.querySelector('.alert-btn').addEventListener('click', () => {
                    document.body.removeChild(overlay);
                    resolve(true);
                });
            }

            // Cerrar con ESC
            const handleKeyPress = (e) => {
                if (e.key === 'Escape') {
                    document.removeEventListener('keydown', handleKeyPress);
                    document.body.removeChild(overlay);
                    resolve(false);
                }
            };
            document.addEventListener('keydown', handleKeyPress);
        });
    }
}

// ===============================================
// FUNCIONES PRINCIPALES DE LA APLICACIÓN
// ===============================================

// Instancias globales
let toastManager;

function initializeApp() {
    // Inicializar managers
    toastManager = new ToastManager();
    
    // Inicializar efectos de fondo
    const starsContainer = document.getElementById('stars-container');
    const particlesContainer = document.getElementById('particles-container');
    
    if (starsContainer) {
        appState.starField = new StarField(starsContainer);
        appState.starField.start();
    }
    
    if (particlesContainer) {
        appState.particleSystem = new ParticleSystem(particlesContainer);
        appState.particleSystem.start();
    }
    
    // Event listeners
    setupEventListeners();
    
    // Cargar datos guardados
    loadSavedData();
    
    // Actualizar UI
    updateUI();
    
    console.log('🎮 Amigo Secreto App iniciada correctamente');
    toastManager.show('¡Bienvenido a Amigo Secreto! 🎉', 'success');
}

function setupEventListeners() {
    // Botón agregar amigo
    const addButton = document.querySelector('.button-add');
    const nameInput = document.querySelector('.input-name');
    
    if (addButton) {
        addButton.addEventListener('click', handleAddFriend);
    }
    
    if (nameInput) {
        nameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleAddFriend();
            }
        });
        
        nameInput.addEventListener('input', (e) => {
            // Limpiar caracteres no válidos
            e.target.value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, '');
        });
    }
    
    // Botón sortear
    const sorteoButton = document.querySelector('.sorteo-button');
    if (sorteoButton) {
        sorteoButton.addEventListener('click', handleDrawFriends);
    }
    
    // Responsive: ajustar efectos en dispositivos móviles
    if (window.innerWidth <= 768) {
        CONFIG.PARTICLE_COUNT = 15;
        CONFIG.STAR_COUNT = 75;
    }
}

function handleAddFriend() {
    const nameInput = document.querySelector('.input-name');
    const name = nameInput.value.trim();
    
    // Validaciones
    if (!name) {
        toastManager.show('Por favor, ingresa un nombre', 'warning');
        nameInput.focus();
        return;
    }
    
    if (name.length < 2) {
        toastManager.show('El nombre debe tener al menos 2 caracteres', 'warning');
        nameInput.focus();
        return;
    }
    
    if (name.length > 30) {
        toastManager.show('El nombre es demasiado largo (máximo 30 caracteres)', 'warning');
        nameInput.focus();
        return;
    }
    
    // Verificar duplicados (case insensitive)
    if (appState.friends.some(friend => friend.toLowerCase() === name.toLowerCase())) {
        toastManager.show('Este nombre ya existe en la lista', 'warning');
        nameInput.focus();
        return;
    }
    
    // Verificar límite máximo
    if (appState.friends.length >= CONFIG.MAX_FRIENDS) {
        toastManager.show(`Máximo ${CONFIG.MAX_FRIENDS} amigos permitidos`, 'error');
        return;
    }
    
    // Agregar amigo
    appState.friends.push(name);
    nameInput.value = '';
    nameInput.focus();
    
    // Actualizar UI
    updateUI();
    saveData();
    
    // Feedback
    toastManager.show(`¡${name} agregado exitosamente! 👥`, 'success');
    
    console.log('Amigo agregado:', name, 'Total:', appState.friends.length);
}

function removeFriend(index) {
    if (index < 0 || index >= appState.friends.length) return;
    
    const friendName = appState.friends[index];
    
    AlertManager.show(
        'Confirmar eliminación',
        `¿Estás seguro de que quieres eliminar a "${friendName}"?`,
        'confirm'
    ).then(confirmed => {
        if (confirmed) {
            appState.friends.splice(index, 1);
            updateUI();
            saveData();
            toastManager.show(`${friendName} eliminado de la lista`, 'info');
        }
    });
}

async function handleDrawFriends() {
    // Validaciones
    if (appState.isDrawing) {
        toastManager.show('Ya hay un sorteo en proceso...', 'warning');
        return;
    }
    
    if (appState.friends.length < CONFIG.MIN_FRIENDS) {
        toastManager.show(`Necesitas al menos ${CONFIG.MIN_FRIENDS} amigos para hacer el sorteo`, 'warning');
        return;
    }
    
    // Confirmar inicio
    const confirmed = await AlertManager.show(
        'Iniciar Sorteo',
        `¿Comenzar el sorteo con ${appState.friends.length} amigos?`,
        'confirm'
    );
    
    if (!confirmed) return;
    
    appState.isDrawing = true;
    
    try {
        // Mostrar loading
        showLoadingState();
        
        // Simular proceso de sorteo
        await performDraw();
        
        // Mostrar resultado
        showDrawResult();
        
    } catch (error) {
        console.error('Error en el sorteo:', error);
        toastManager.show('Error durante el sorteo. Intenta nuevamente.', 'error');
        appState.isDrawing = false;
        updateUI();
    }
}

function performDraw() {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Algoritmo de sorteo Fisher-Yates optimizado
            const friends = [...appState.friends];
            const results = {};
            
            // Crear pares asegurando que nadie se saque a sí mismo
            let attempts = 0;
            const maxAttempts = 100;
            
            do {
                // Shufflear array
                for (let i = friends.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [friends[i], friends[j]] = [friends[j], friends[i]];
                }
                
                // Verificar que nadie se saque a sí mismo
                let validDraw = true;
                for (let i = 0; i < appState.friends.length; i++) {
                    if (appState.friends[i] === friends[i]) {
                        validDraw = false;
                        break;
                    }
                }
                
                if (validDraw) {
                    // Crear resultados
                    for (let i = 0; i < appState.friends.length; i++) {
                        results[appState.friends[i]] = friends[i];
                    }
                    break;
                }
                
                attempts++;
            } while (attempts < maxAttempts);
            
            if (attempts >= maxAttempts) {
                throw new Error('No se pudo generar un sorteo válido');
            }
            
            appState.currentResults = results;
            resolve();
        }, 2000);
    });
}

function showLoadingState() {
    const resultContainer = document.getElementById('result-container');
    if (!resultContainer) return;
    
    resultContainer.innerHTML = `
        <div class="loading-card">
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <h3> Realizando sorteo...</h3>
                <p>Mezclando los nombres y asignando amigos secretos</p>
                <div class="tips">
                    <p><i class="fas fa-lightbulb"></i> Cada persona recibirá el nombre de su amigo secreto</p>
                </div>
            </div>
        </div>
    `;
    
    resultContainer.style.display = 'block';
    resultContainer.scrollIntoView({ behavior: 'smooth' });
}

function showDrawResult() {
    const resultContainer = document.getElementById('result-container');
    if (!resultContainer) return;
    
    // Seleccionar un resultado aleatorio para mostrar
    const friendNames = Object.keys(appState.currentResults);
    const randomFriend = friendNames[Math.floor(Math.random() * friendNames.length)];
    const secretFriend = appState.currentResults[randomFriend];
    
    resultContainer.innerHTML = `
        <div class="result-card">
            <div class="result-content">
                <h3>🎉 ¡Sorteo Completado!</h3>
                <div class="result-name-container">
                    <p><strong>${randomFriend}</strong>, tu amigo secreto es:</p>
                    <div class="secret-friend-name">${secretFriend}</div>
                    <div class="celebration-emojis">🎁 🎊 🎈</div>
                </div>
                <div class="restart-info">
                    <p>El sorteo se reiniciará automáticamente en:</p>
                    <div id="countdown">${CONFIG.COUNTDOWN_TIME}</div>
                    <div class="control-buttons">
                        <button class="restart-btn" onclick="restartDraw()">
                            <i class="fas fa-redo"></i> Nuevo Sorteo
                        </button>
                        <button class="continue-btn" onclick="showNextResult()">
                            <i class="fas fa-eye"></i> Ver Otro
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    startCountdown();
    appState.isDrawing = false;
}

function startCountdown() {
    let timeLeft = CONFIG.COUNTDOWN_TIME;
    const countdownElement = document.getElementById('countdown');
    
    if (appState.countdownTimer) {
        clearInterval(appState.countdownTimer);
    }
    
    appState.countdownTimer = setInterval(() => {
        timeLeft--;
        if (countdownElement) {
            countdownElement.textContent = timeLeft;
        }
        
        if (timeLeft <= 0) {
            clearInterval(appState.countdownTimer);
            restartDraw();
        }
    }, 1000);
}

function restartDraw() {
    if (appState.countdownTimer) {
        clearInterval(appState.countdownTimer);
        appState.countdownTimer = null;
    }

    // Limpiar todos los datos del sorteo anterior
    appState.currentResults = {};
    appState.friends = []; // Limpiar la lista de amigos
    appState.isDrawing = false;
    appState.currentRound++;

    // Limpiar datos guardados en localStorage
    try {
        localStorage.removeItem('amigoSecreto');
    } catch (error) {
        console.warn('No se pudo limpiar localStorage:', error);
    }

    const resultContainer = document.getElementById('result-container');
    if (resultContainer) {
        resultContainer.innerHTML = `
            <div class="new-round-card">
                <div class="new-round-content">
                    <h3>🔄 Nueva Ronda</h3>
                    <p>Listo para el próximo sorteo</p>
                    <p><strong>Ronda #${appState.currentRound}</strong></p>
                    <p style="font-size: 0.9rem; opacity: 0.8;">Los nombres anteriores han sido eliminados</p>
                </div>
            </div>
        `;

        setTimeout(() => {
            resultContainer.style.display = 'none';
        }, 3000);
    }

    updateUI();
    toastManager.show('¡Nuevo sorteo iniciado! Los nombres anteriores han sido eliminados 🎲', 'success');
}

function showNextResult() {
    if (!appState.currentResults || Object.keys(appState.currentResults).length === 0) {
        toastManager.show('No hay resultados disponibles', 'warning');
        return;
    }
    
    showDrawResult();
}

function updateUI() {
    updateFriendsList();
    updateCounter();
    updateSorteoButton();
}

function updateFriendsList() {
    const nameList = document.querySelector('.name-list');
    if (!nameList) return;
    
    nameList.innerHTML = '';
    
    appState.friends.forEach((friend, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="friend-card">
                <div class="card-content">
                    <span class="friend-name">${escapeHtml(friend)}</span>
                    <button class="delete-btn" onclick="removeFriend(${index})" title="Eliminar ${escapeHtml(friend)}">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `;
        nameList.appendChild(li);
    });
}

function updateCounter() {
    const contador = document.querySelector('.contador-amigos');
    if (!contador) return;
    
    const count = appState.friends.length;
    const minFriends = CONFIG.MIN_FRIENDS;
    
    contador.className = 'contador-amigos';
    
    if (count === 0) {
        contador.innerHTML = `<i class="fas fa-users"></i> No hay amigos agregados`;
        contador.classList.add('warning');
    } else if (count < minFriends) {
        contador.innerHTML = `<i class="fas fa-users"></i> ${count} amigos (necesitas ${minFriends - count} más)`;
        contador.classList.add('warning');
    } else {
        contador.innerHTML = `<i class="fas fa-users"></i> ${count} amigos listos para sortear`;
        contador.classList.add('ready');
    }
}

function updateSorteoButton() {
    const container = document.querySelector('.sorteo-button');
    if (!container) return;
    
    const canDraw = appState.friends.length >= CONFIG.MIN_FRIENDS && !appState.isDrawing;
    
    container.style.opacity = canDraw ? '1' : '0.6';
    container.style.cursor = canDraw ? 'pointer' : 'not-allowed';
    container.style.pointerEvents = canDraw ? 'auto' : 'none';
}

// ===============================================
// PERSISTENCIA DE DATOS
// ===============================================

function saveData() {
    try {
        const data = {
            friends: appState.friends,
            currentRound: appState.currentRound,
            timestamp: Date.now()
        };
        localStorage.setItem('amigoSecreto', JSON.stringify(data));
    } catch (error) {
        console.warn('No se pudo guardar los datos:', error);
    }
}

function loadSavedData() {
    try {
        const savedData = localStorage.getItem('amigoSecreto');
        if (savedData) {
            const data = JSON.parse(savedData);
            
            // Verificar que los datos no sean muy antiguos (24 horas)
            const dayInMs = 24 * 60 * 60 * 1000;
            if (Date.now() - data.timestamp < dayInMs) {
                appState.friends = data.friends || [];
                appState.currentRound = data.currentRound || 1;
                toastManager.show('Datos previos cargados', 'info');
            }
        }
    } catch (error) {
        console.warn('No se pudo cargar los datos guardados:', error);
    }
}

// ===============================================
// UTILIDADES
// ===============================================

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===============================================
// INICIALIZACIÓN
// ===============================================

// Esperar a que el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// Exponer funciones globales necesarias
window.removeFriend = removeFriend;
window.restartDraw = restartDraw;
window.showNextResult = showNextResult;

// Manejo de errores globales
window.addEventListener('error', (e) => {
    console.error('Error global:', e.error);
    if (toastManager) {
        toastManager.show('Ha ocurrido un error inesperado', 'error');
    }
});

// Optimización para dispositivos móviles
window.addEventListener('orientationchange', debounce(() => {
    updateUI();
}, 300));

window.addEventListener('resize', debounce(() => {
    updateUI();
}, 300));