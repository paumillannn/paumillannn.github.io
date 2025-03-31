document.addEventListener('DOMContentLoaded', () => {
    const menuItems = document.querySelectorAll('nav ul li');
    menuItems.forEach(item => {
        const submenu = item.querySelector('.submenu');
        if (submenu) {
            item.addEventListener('mouseenter', () => {
                submenu.style.opacity = '1';
                submenu.style.visibility = 'visible';
                submenu.style.transition = 'opacity 0.3s ease';
            });
            item.addEventListener('mouseleave', () => {
                submenu.style.opacity = '0';
                submenu.style.visibility = 'hidden';
                submenu.style.transition = 'opacity 0.3s ease';
            });
        }
    });

    const contentBoxes = document.querySelectorAll('.content-box');
    contentBoxes.forEach(box => {
        box.addEventListener('mouseover', () => {
            box.style.transform = 'rotate(1deg)';
        });
        box.addEventListener('mouseout', () => {
            box.style.transform = 'rotate(0deg)';
        });
    });

    const numberOfLights = 5; // Número de manchas
    const lights = []; // Array para almacenar las manchas

    // Crear múltiples manchas
    for (let i = 0; i < numberOfLights; i++) {
        const neonLight = document.createElement("div");
        neonLight.classList.add("neon-light");
        document.body.appendChild(neonLight);

        // Posición inicial aleatoria
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;

        // Velocidad aleatoria
        const dx = (Math.random() * 0.5 + 0.2) * (Math.random() < 0.5 ? 1 : -1); // Velocidad horizontal más lenta
        const dy = (Math.random() * 0.5 + 0.2) * (Math.random() < 0.5 ? 1 : -1); // Velocidad vertical más lenta

        lights.push({ element: neonLight, x, y, dx, dy });
    }

    // Animar las manchas
    function animateLights() {
        lights.forEach(light => {
            // Actualizar posición
            light.x += light.dx;
            light.y += light.dy;

            // Rebotar en los bordes
            if (light.x + 300 > window.innerWidth || light.x < 0) light.dx *= -1;
            if (light.y + 400 > window.innerHeight || light.y < 0) light.dy *= -1;

            // Aplicar posición
            light.element.style.left = `${light.x}px`;
            light.element.style.top = `${light.y}px`;
        });

        // Continuar animación
        requestAnimationFrame(animateLights);
    }

    // Función para deformar continuamente las manchas
    function deformLights() {
        lights.forEach(light => {
            const newWidth = Math.random() * 300 + 200; // Ancho aleatorio entre 200 y 500px
            const newHeight = Math.random() * 300 + 200; // Altura aleatoria entre 200 y 500px
            const newBorderRadius = `${Math.random() * 50 + 25}% ${Math.random() * 50 + 25}% ${Math.random() * 50 + 25}% ${Math.random() * 50 + 25}%`; // Forma irregular

            light.element.style.width = `${newWidth}px`;
            light.element.style.height = `${newHeight}px`;
            light.element.style.borderRadius = newBorderRadius;
        });

        // Continuar deformación cada 3 segundos
        setTimeout(deformLights, 3000);
    }

    // Iniciar animación y deformación
    animateLights();
    deformLights();

    const currentPath = window.location.pathname; // Obtiene la ruta actual
    const menuLinks = document.querySelectorAll("nav ul li a");

    menuLinks.forEach(link => {
        if (link.getAttribute("href") === currentPath.split("/").pop()) {
            link.classList.add("active"); // Agrega la clase 'active' al enlace correspondiente
        }
    });
});