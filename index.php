<?php
$page = $_GET['page'] ?? 'inicio';
$title = match($page) {
    'proyectos' => 'Proyectos',
    'contacto'  => 'Contacto',
    default     => 'Inicio',
};
$projects = [
    [
        'title' => 'Sistema de Gestión',
        'tech'  => 'PHP, MySQL, Bootstrap',
        'desc'  => 'Plataforma web para administración de inventarios y usuarios.',
    ],
    [
        'title' => 'API RESTful',
        'tech'  => 'PHP, Laravel, PostgreSQL',
        'desc'  => 'API con autenticación JWT y documentación Swagger.',
    ],
    [
        'title' => 'Blog Personal',
        'tech'  => 'PHP, JavaScript, CSS3',
        'desc'  => 'Blog con panel admin, editor markdown y comentarios.',
    ],
];
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $title ?> - Mi Portafolio</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <nav>
            <a href="?page=inicio" class="logo">&lt;Dev /&gt;</a>
            <ul>
                <li><a href="?page=inicio"    <?= $page === 'inicio'    ? 'class="active"' : '' ?>>Inicio</a></li>
                <li><a href="?page=proyectos" <?= $page === 'proyectos' ? 'class="active"' : '' ?>>Proyectos</a></li>
                <li><a href="?page=contacto"  <?= $page === 'contacto'  ? 'class="active"' : '' ?>>Contacto</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <?php if ($page === 'inicio'): ?>
            <section class="hero">
                <div class="hero-content">
                    <h1>Hola, soy <span class="highlight">Desarrollador</span></h1>
                    <p class="subtitle">Desarrollador web especializado en PHP, MySQL y tecnologías modernas.</p>
                    <div class="hero-actions">
                        <a href="?page=proyectos" class="btn btn-primary">Ver Proyectos</a>
                        <a href="?page=contacto" class="btn btn-secondary">Contactar</a>
                    </div>
                </div>
            </section>

            <section class="skills">
                <h2>Habilidades</h2>
                <div class="skills-grid">
                    <div class="skill-card">
                        <h3>Backend</h3>
                        <p>PHP, Laravel, Node.js, REST APIs</p>
                    </div>
                    <div class="skill-card">
                        <h3>Frontend</h3>
                        <p>HTML, CSS, JavaScript, Bootstrap</p>
                    </div>
                    <div class="skill-card">
                        <h3>Bases de Datos</h3>
                        <p>MySQL, PostgreSQL, MongoDB</p>
                    </div>
                    <div class="skill-card">
                        <h3>Herramientas</h3>
                        <p>Git, Docker, Linux, Composer</p>
                    </div>
                </div>
            </section>

        <?php elseif ($page === 'proyectos'): ?>
            <section class="projects">
                <h1>Proyectos</h1>
                <div class="projects-grid">
                    <?php foreach ($projects as $p): ?>
                        <article class="project-card">
                            <h2><?= $p['title'] ?></h2>
                            <span class="tech"><?= $p['tech'] ?></span>
                            <p><?= $p['desc'] ?></p>
                        </article>
                    <?php endforeach; ?>
                </div>
            </section>

        <?php elseif ($page === 'contacto'): ?>
            <section class="contact">
                <h1>Contacto</h1>
                <form action="enviar.php" method="POST">
                    <input type="text" name="nombre" placeholder="Tu nombre" required>
                    <input type="email" name="email" placeholder="Tu email" required>
                    <textarea name="mensaje" rows="5" placeholder="Tu mensaje" required></textarea>
                    <button type="submit" class="btn btn-primary">Enviar</button>
                </form>
                <div class="contact-links">
                    <a href="mailto:tu@email.com">tu@email.com</a>
                    <a href="https://github.com/tuusuario" target="_blank">GitHub</a>
                    <a href="https://linkedin.com/in/tuusuario" target="_blank">LinkedIn</a>
                </div>
            </section>
        <?php endif; ?>
    </main>

    <footer>
        <p>&copy; <?= date('Y') ?> - Desarrollado con PHP</p>
    </footer>
</body>
</html>
