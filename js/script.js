// Consola Potato logo
console.log(`
  @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
  @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
  @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%#####%@@@@@@@@@@@@@@@@@
  @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%+-       -+%@@@@@@@@@@@@@@
  @@@@@@@@@@@@@@@@@@@@@@@@@@@@@*             *@@@@@@@@@@@@@
  @@@@@@@@@@@@@@@@@@@@@@@@@@@@=               *@@@@@@@@@@@@
  @@@@@@@@@@@@@@@@@@@@@@@@@@@+                 %@@@@@@@@@@@
  @@@@@@@@@@@@@@@@@@@@@@@@@@#                  *@@@@@@@@@@@
  @@@@@@@@@@@@@@@@@@@@@@@@@%                   *@@@@@@@@@@@
  @@@@@@@@@@@@@@@@@@@@@@@@@-                   *@@@@@@@@@@@
  @@@@@@@@@@@@@@@@@@@@@@@#-                    %@@@@@@@@@@@
  @@@@@@@@@@@@@@@@@@@@@*-                     -@@@@@@@@@@@@
  @@@@@@@@@@@@@@@@@%*=                        =@@@@@@@@@@@@
  @@@@@@@@@@@@@@%*-                           *@@@@@@@@@@@@
  @@@@@@@@@@@@#=                              #@@@@@@@@@@@@
  @@@@@@@@@@@=                                @@@@@@@@@@@@@
  @@@@@@@@@%-                                -@@@@@@@@@@@@@
  @@@@@@@@@-                                 +@@@@@@@@@@@@@
  @@@@@@@@#                                  %@@@@@@@@@@@@@
  @@@@@@@@+                                 =@@@@@@@@@@@@@@
  @@@@@@@@*                                 %@@@@@@@@@@@@@@
  @@@@@@@@@-                               #@@@@@@@@@@@@@@@
  @@@@@@@@@%-                             #@@@@@@@@@@@@@@@@
  @@@@@@@@@@@=                          =%@@@@@@@@@@@@@@@@@
  @@@@@@@@@@@@%+                      =#@@@@@@@@@@@@@@@@@@@
  @@@@@@@@@@@@@@@#*=-             -=*%@@@@@@@@@@@@@@@@@@@@@
  @@@@@@@@@@@@@@@@@@@@@%%###**###%@@@@@@@@@@@@@@@@@@@@@@@@@@
  @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
  `)

// Consola Potato título
console.log(`
    ██████╗  ██████╗ ████████╗ █████╗ ████████╗ ██████╗    | Busco una
    ██╔══██╗██╔═══██╗╚══██╔══╝██╔══██╗╚══██╔══╝██╔═══██╗   | Pelinegra
    ██████╔╝██║   ██║   ██║   ███████║   ██║   ██║   ██║   | Y
    ██╔═══╝ ██║   ██║   ██║   ██╔══██║   ██║   ██║   ██║   | Que
    ██║     ╚██████╔╝   ██║   ██║  ██║   ██║   ╚██████╔╝   | No
    ╚═╝      ╚═════╝    ╚═╝   ╚═╝  ╚═╝   ╚═╝    ╚═════╝    | Mienta
  `)

// IIFE para encapsular todo el código y evitar contaminación del ámbito global
;(() => {
  /**
   * Caché de archivos de audio para mejor rendimiento
   * Precarga los archivos para evitar retrasos en la reproducción
   */
  const audioCache = {
    puertazo: new Audio("./assets/audio/puertazo.mp3"),
    pichon: new Audio("./assets/audio/pichon.mp3"),
    hover: new Audio("./assets/audio/bip.mp3"),
  }

  /**
   * Precarga archivos de audio para reproducción inmediata
   * Configura volumen y otras propiedades
   */
  function preloadAudio() {
    audioCache.puertazo.preload = "auto"
    audioCache.pichon.preload = "auto"
    audioCache.hover.preload = "auto"

    // Configurar volumen para el audio de hover
    audioCache.hover.volume = 1
  }

  /**
   * Referencias a elementos DOM principales
   * Almacenadas para evitar múltiples consultas al DOM
   */
  const themeToggle = document.getElementById("theme-toggle")
  const logoImage = document.getElementById("logo-image")
  const eastereggOverlay = document.getElementById("eastereggOverlay")
  const secondEastereggOverlay = document.getElementById("secondEastereggOverlay")
  const homeroVideo = document.getElementById("homeroVideo")
  const secondVideo = document.getElementById("secondVideo")
  const discoBall = document.getElementById("discoBall")
  const closeButton = document.getElementById("closeButton")
  const closeSecondButton = document.getElementById("closeSecondButton")
  const menuButton = document.getElementById("menu-button")
  const navLinks = document.getElementById("nav-links")
  const logoText = document.querySelector(".logo-text")

  /**
   * Configuración inicial de animaciones para el logo
   */
  if (logoImage) {
    logoImage.classList.add("animate-in")
    logoImage.addEventListener("animationend", (e) => {
      logoImage.classList.remove(e.animationName === "fadeInUp" ? "animate-in" : "shake")
    })
  }

  // Precargar audio al inicio
  preloadAudio()

  /**
   * Estado de la aplicación
   * Centraliza variables de estado para mejor gestión
   */
  const state = {
    pPressCount: 0, // Contador para Easter egg con tecla P
    gPressCount: 0, // Contador para Easter egg con tecla G
    clickCount: 0, // Contador para Easter egg con clics
    isEastereggActive: false, // Estado del primer Easter egg
    isSecondEastereggActive: false, // Estado del segundo Easter egg
    isGAudioPlaying: false, // Estado de reproducción de audio G
    gAudioCooldown: false, // Cooldown para audio G
    gAudioTimer1: null, // Temporizador 1 para audio G
    gAudioTimer2: null, // Temporizador 2 para audio G
    MAX_COUNTER: 10, // Límite máximo para contadores
    menuOpen: false, // Estado del menú desplegable
    hoverAudioPlaying: false, // Estado para audio de hover
    hoverAudioCooldown: false, // Cooldown para audio de hover
  }

  /**
   * Temporizadores para gestionar eventos
   * Agrupados para mejor organización
   */
  const timers = {
    pPress: null, // Temporizador para tecla P
    gPress: null, // Temporizador para tecla G
    click: null, // Temporizador para clics
    hoverAudio: null, // Temporizador para audio de hover
  }

  // Bandera para detectar si el usuario ha interactuado con la página
  let userInteracted = false

  /**
   * Manejador de errores de audio
   * Registra detalles del error para depuración
   */
  function handleAudioError(e) {
    const error = e.target.error
    console.error("Error de audio:", {
      code: error.code,
      message: error.message,
      tipo: error instanceof MediaError ? "MediaError" : "Error general",
    })
  }

  /**
   * Habilita audio después de la primera interacción del usuario
   * Soluciona restricciones de autoplay en navegadores
   */
  document.addEventListener("click", () => {
    if (!userInteracted) {
      userInteracted = true
      // Quitar mute de todos los videos
      document.querySelectorAll("video").forEach((video) => {
        video.muted = false
      })
    }
  })

  /**
   * Reproduce sonido al pasar el cursor sobre elementos interactivos
   * Incluye protección contra reproducciones múltiples
   */
  function playHoverSound() {
    if (!userInteracted || state.hoverAudioPlaying || state.hoverAudioCooldown) return

    state.hoverAudioPlaying = true
    state.hoverAudioCooldown = true

    // Clonar el audio para permitir múltiples reproducciones simultáneas
    const hoverSound = audioCache.hover.cloneNode()
    hoverSound.volume = 1

    hoverSound
      .play()
      .then(() => {
        // Establecer un cooldown corto para evitar spam de sonido
        clearTimeout(timers.hoverAudio)
        timers.hoverAudio = setTimeout(() => {
          state.hoverAudioPlaying = false

          // Cooldown más corto para permitir que el sonido se reproduzca con fluidez
          setTimeout(() => {
            state.hoverAudioCooldown = false
          }, 50)
        }, 100)
      })
      .catch((err) => {
        console.error("Error al reproducir sonido hover:", err)
        state.hoverAudioPlaying = false
        state.hoverAudioCooldown = false
      })
  }

  /**
   * Configura efectos de sonido para elementos interactivos
   * Aplica a todos los elementos que necesitan feedback auditivo
   */
  function setupHoverSounds() {
    // Seleccionar todos los elementos que necesitan efecto hover
    const hoverElements = document.querySelectorAll(
      ".logo-text, #menu-text, .footer-link, .nav-links a, .social-link, .theme-toggle-button, .close-button, .close-second-button",
    )

    hoverElements.forEach((element) => {
      element.addEventListener("mouseenter", playHoverSound)
    })
  }

  /**
   * Manejador de eventos de teclado para Easter Eggs
   * Detecta combinaciones específicas de teclas
   */
  document.addEventListener("keydown", (e) => {
    // Ignorar eventos en campos de entrada
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return

    // Easter Egg activado con la tecla "p"
    if (e.key.toLowerCase() === "p" && canActivateEasterEgg()) {
      handleKeyPress("p")
    }
    // Easter Egg activado con la tecla "g"
    else if (e.key.toLowerCase() === "g" && !state.isGAudioPlaying && !state.gAudioCooldown && canActivateEasterEgg()) {
      handleKeyPress("g")
    }
  })

  /**
   * Gestiona pulsaciones de teclas específicas para Easter Eggs
   * Controla contadores y temporizadores para activación
   */
  function handleKeyPress(key) {
    const isP = key === "p"
    const countProperty = isP ? "pPressCount" : "gPressCount"
    const timerProperty = isP ? "pPress" : "gPress"
    const requiredCount = isP ? 5 : 4
    const timeout = isP ? 5000 : 4000

    // Incrementar contador
    state[countProperty]++
    state[countProperty] = Math.min(state[countProperty], state.MAX_COUNTER)

    // Gestionar temporizador y activación
    if (state[countProperty] === 1) {
      clearTimeout(timers[timerProperty])
      timers[timerProperty] = setTimeout(() => (state[countProperty] = 0), timeout)
    } else if (state[countProperty] === requiredCount) {
      clearTimeout(timers[timerProperty])
      state[countProperty] = 0
      isP ? activateEasteregg() : activateGAudio()
    }
  }

  /**
   * Verifica si se pueden activar Easter Eggs
   * Previene activaciones simultáneas
   */
  function canActivateEasterEgg() {
    return !state.isEastereggActive && !state.isSecondEastereggActive && !state.isGAudioPlaying
  }

  /**
   * Activa el Easter Egg de Homero
   * Secuencia coordinada de audio, animación y video
   */
  function activateEasteregg() {
    if (!homeroVideo) return

    state.isEastereggActive = true
    eastereggOverlay.style.display = "flex"
    homeroVideo.pause() // Pausar inicialmente el video

    // Secuencia de activación:
    // 1. Reproducir audio
    playAudio("./assets/audio/puertazo.mp3").then(() => {
      // 2. Animar bola disco
      requestAnimationFrame(() => {
        if (discoBall) {
          discoBall.style.animation = "dropDiscoBall 1s forwards"
        }
        // 3. Iniciar video con retraso
        setTimeout(() => {
          homeroVideo.style.animation = "fadeIn 2s forwards"
          homeroVideo.muted = !userInteracted
          homeroVideo.play().catch((err) => console.error(err))
        }, 800)
      })
    })
  }

  /**
   * Configura Easter Egg activado al hacer clic en el logo
   * Requiere múltiples clics rápidos
   */
  if (logoImage) {
    logoImage.addEventListener("click", () => {
      if (canActivateEasterEgg()) {
        // Reiniciar animación de sacudida
        logoImage.classList.remove("shake")
        setTimeout(() => {
          logoImage.classList.add("shake")
        }, 10)

        // Gestionar contador de clics
        state.clickCount++
        if (state.clickCount === 1) {
          clearTimeout(timers.click)
          timers.click = setTimeout(() => (state.clickCount = 0), 1000)
        } else if (state.clickCount >= 8) {
          clearTimeout(timers.click)
          state.clickCount = 0
          activateSecondEasteregg()
        }
      }
    })
  }

  /**
   * Activa el segundo Easter Egg
   * Muestra video con animación de entrada
   */
  function activateSecondEasteregg() {
    state.isSecondEastereggActive = true
    secondEastereggOverlay.style.display = "flex"
    secondVideo.muted = !userInteracted
    secondVideo.currentTime = 0

    requestAnimationFrame(() => {
      secondVideo.style.animation = "fadeIn 2s forwards"
      playVideo(secondVideo)
    })
  }

  /**
   * Reproduce audio de forma segura
   * Incluye validaciones y manejo de errores
   */
  async function playAudio(src) {
    // Validación de seguridad
    if (!src || !src.startsWith("./assets/audio/")) {
      throw new Error("Ruta de audio inválida")
    }

    // Verificar interacción del usuario
    if (!userInteracted) {
      console.warn("Reproducción bloqueada: el usuario no ha interactuado")
      return
    }

    try {
      // Usar audio precargado del caché
      let audio
      if (src.includes("puertazo.mp3")) {
        audio = audioCache.puertazo.cloneNode()
      } else if (src.includes("pichon.mp3")) {
        audio = audioCache.pichon.cloneNode()
      } else if (src.includes("bip.mp3")) {
        audio = audioCache.hover.cloneNode()
      } else {
        throw new Error("Audio no precargado")
      }

      audio.preload = "auto"
      audio.addEventListener("error", handleAudioError)
      await audio.play()
    } catch (err) {
      console.error("Error al activar Easter egg:", err)
      state.isEastereggActive = false
      eastereggOverlay.style.display = "none"
      throw err
    }
  }

  /**
   * Reproduce video de forma segura
   * Maneja estados de mute según interacción del usuario
   */
  async function playVideo(video) {
    if (!video) {
      console.error("Elemento video no encontrado")
      return
    }

    if (!userInteracted) {
      console.warn("Reproducción bloqueada: el usuario no ha interactuado")
      return
    }

    try {
      video.muted = !userInteracted
      await video.play()
    } catch (err) {
      console.error("Error:", err)
      throw err
    }
  }

  /**
   * Configura el cierre del primer Easter Egg
   * Restablece todos los estados y elementos
   */
  if (closeButton && closeButton instanceof HTMLElement) {
    closeButton.addEventListener("click", () => {
      discoBall.style.removeProperty("animation")
      discoBall.style.top = "-100px" // Resetear posición inicial
      state.isEastereggActive = false
      eastereggOverlay.style.display = "none"
      discoBall.style.animation = ""
      homeroVideo.style.animation = ""
      homeroVideo.pause()
      homeroVideo.muted = true

      if (homeroVideo) {
        homeroVideo.currentTime = 0
      }

      // Limpiar temporizadores
      if (state.gAudioTimer1) clearTimeout(state.gAudioTimer1)
      if (state.gAudioTimer2) clearTimeout(state.gAudioTimer2)
    })
  }

  /**
   * Configura el cierre del segundo Easter Egg
   * Restablece estados y detiene reproducción
   */
  if (closeSecondButton instanceof HTMLElement) {
    closeSecondButton.addEventListener("click", () => {
      state.isSecondEastereggActive = false
      secondEastereggOverlay.style.display = "none"
      secondVideo.style.animation = ""
      secondVideo.pause()
      secondVideo.currentTime = 0
    })
  }

  /**
   * Activa Easter Egg de audio con la tecla "g"
   * Reproduce sonido con sistema de cooldown
   */
  function activateGAudio() {
    // Limpiar temporizadores previos
    if (state.gAudioTimer1) clearTimeout(state.gAudioTimer1)
    if (state.gAudioTimer2) clearTimeout(state.gAudioTimer2)

    state.isGAudioPlaying = true

    playAudio("./assets/audio/pichon.mp3")
      .then(() => {
        // Gestionar estados con temporizadores
        state.gAudioTimer1 = setTimeout(() => {
          state.isGAudioPlaying = false
          state.gAudioCooldown = true

          state.gAudioTimer2 = setTimeout(() => {
            state.gAudioCooldown = false
          }, 2000)
        }, 2000)
      })
      .catch((err) => {
        console.error('Error en audio "G":', err)
        clearTimeout(state.gAudioTimer1)
        clearTimeout(state.gAudioTimer2)
        state.isGAudioPlaying = false
        state.gAudioCooldown = false
      })
  }

  /**
   * Inicializa el tema de la aplicación
   * Recupera preferencia guardada o usa valor predeterminado
   */
  function initializeTheme() {
    console.log("Initializing theme...")
    const savedTheme = localStorage.getItem("theme")
    const validThemes = ["light-mode", "dark-mode"]
    const theme = validThemes.includes(savedTheme) ? savedTheme : "dark-mode"

    // Aplicar tema
    document.documentElement.classList.remove(...validThemes)
    document.documentElement.classList.add(theme)

    updateTheme(theme)
  }

  /**
   * Actualiza elementos visuales según el tema seleccionado
   * Modifica colores, imágenes y metadatos
   */
  function updateTheme(theme) {
    // Actualizar color del tema en meta tag
    const themeColorMeta = document.querySelector('meta[name="theme-color"]')
    if (themeColorMeta) {
      themeColorMeta.setAttribute("content", theme === "light-mode" ? "#ffffff" : "#0a0a0b")
    }

    // Actualizar logo según el tema
    if (logoImage) {
      logoImage.src = theme === "light-mode" ? "./assets/images/papa-negra.png" : "./assets/images/papa-blanca.png"
    }

    // Actualizar color del texto del botón de tema
    const themeToggleButton = document.querySelector(".theme-toggle-button")
    if (themeToggleButton) {
      themeToggleButton.style.color = theme === "dark-mode" ? "#ffffff" : "#000000"
    }
  }

  /**
   * Configura el cambio de tema al hacer clic en el botón
   * Alterna entre modos claro y oscuro
   */
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const root = document.documentElement
      const newTheme = root.classList.contains("light-mode") ? "dark-mode" : "light-mode"

      root.classList.remove("light-mode", "dark-mode")
      root.classList.add(newTheme)
      localStorage.setItem("theme", newTheme)
      updateTheme(newTheme)
    })
  }

  /**
   * Configura el menú desplegable
   * Maneja apertura, cierre y animaciones
   */
  if (menuButton && navLinks) {
    const menuText = document.getElementById("menu-text")

    function toggleMenu(show) {
      state.menuOpen = show
      menuButton.classList.toggle("menu-open", show)

      if (show) {
        navLinks.classList.remove("closing")
        navLinks.classList.add("active")
        menuText.classList.add("menu-text-fade")
        setTimeout(() => {
          menuText.textContent = "Cerrar"
          menuText.classList.remove("menu-text-fade")
        }, 150)
      } else {
        navLinks.classList.add("closing")
        menuText.classList.add("menu-text-fade")
        setTimeout(() => {
          menuText.textContent = "Menú"
          menuText.classList.remove("menu-text-fade")
        }, 150)

        // Esperar a que termine la animación antes de ocultar
        setTimeout(() => {
          navLinks.classList.remove("active", "closing")
        }, 500)
      }
    }

    menuButton.addEventListener("click", () => {
      toggleMenu(!state.menuOpen)
    })

    // Cerrar menú al hacer clic fuera
    document.addEventListener("click", (e) => {
      if (state.menuOpen && !menuButton.contains(e.target) && !navLinks.contains(e.target)) {
        toggleMenu(false)
      }
    })

    // Añadir soporte para cerrar el menú con la tecla Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && state.menuOpen) {
        toggleMenu(false)
      }
    })
  }

  /**
   * Configura comportamiento del texto del logo
   * Gestiona navegación a página principal
   */
  if (logoText) {
    logoText.addEventListener("click", (e) => {
      // Verificar si estamos en la página principal
      const isHomePage =
        window.location.pathname === "/" ||
        window.location.pathname === "/index.html" ||
        window.location.pathname.endsWith("/")

      // Si no estamos en la página principal, redirigir
      if (!isHomePage) {
        window.location.href = "https://potatously.vercel.app"
      }

      // Si estamos en la página principal, prevenir la acción predeterminada
      if (isHomePage) {
        e.preventDefault()
      }
    })
  }

  /**
   * Previene selección de texto en elementos no editables
   * Mejora experiencia en dispositivos táctiles
   */
  document.addEventListener("selectstart", (e) => e.preventDefault())

  /**
   * Inicializa la página al cargar
   * Configura tema, efectos y optimizaciones
   */
  window.addEventListener("load", () => {
    // Inicializar tema
    initializeTheme()

    // Configurar efectos de sonido hover
    setupHoverSounds()

    // Habilitar scroll después de la carga
    requestAnimationFrame(() => {
      document.documentElement.style.overflow = "auto"
      document.body.style.overflow = "auto"
      document.body.style.height = "auto"
    })

    // Sincronizar la animación del social-link
    const socialLink = document.querySelector(".social-link")
    if (socialLink) {
      const computedStyle = window.getComputedStyle(socialLink)
      const animationDelay = Number.parseFloat(computedStyle.animationDelay) || 0
      const animationDuration = Number.parseFloat(computedStyle.animationDuration) || 0
      const currentTime = (performance.now() / 1000) % animationDuration
      socialLink.style.setProperty("--animation-progress", `${currentTime}s`)
    }

    // Verificar si estamos en un dispositivo móvil para optimizar interacciones
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    if (isMobile) {
      // Optimizaciones para dispositivos móviles
      document.body.classList.add("mobile-device")
    }
  })
})()

