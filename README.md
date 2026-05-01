📍 Gestión de Distritos
Aplicación web fullstack para gestionar distritos con búsqueda, paginación, inserción, edición y eliminación. Usa Node.js + Express en el backend, Vite (Vanilla JS) en el frontend y MySQL/MariaDB con stored procedures.

🛠️ Requisitos previos

Node.js v18 o superior
Git
XAMPP (o cualquier servidor MySQL/MariaDB)
phpMyAdmin (incluido en XAMPP)


📦 1. Clonar el repositorio
bashgit clone https://github.com/melody2106/Distritos.git
cd Distritos

🗄️ 2. Configurar la base de datos en phpMyAdmin
Abre phpMyAdmin (http://localhost/phpmyadmin) y ejecuta los siguientes pasos:
2.1 Crear la base de datos y la tabla
Ve a la pestaña SQL y ejecuta:
sqlCREATE DATABASE IF NOT EXISTS ventas;
USE ventas;

CREATE TABLE IF NOT EXISTS distritos (
    id_dis     INT(11)      NOT NULL AUTO_INCREMENT,
    nom_dis    VARCHAR(30)  NOT NULL,
    cod_postal VARCHAR(30)  NULL,
    supervisor VARCHAR(50)  NULL,
    poblacion  INT(11)      NULL,
    PRIMARY KEY (id_dis)
);
2.2 Insertar datos de ejemplo (opcional)
sqlUSE ventas;

INSERT INTO distritos (nom_dis, cod_postal, supervisor, poblacion) VALUES
('Miraflores',   '15047', 'Juan Perez',   85000),
('San Isidro',   '15073', 'Ana Garcia',   60000),
('Barranco',     '15063', 'Sofia Luna',   34000),
('La Molina',    '15024', 'Elena Torres', 140000),
('San Borja',    '15037', 'Luis Merlo',   113000),
('Barranco',     '15063', 'Sofia Luna',   34000),
('Lince',        '15046', 'Pedro Castro', 55000),
('Magdalena',    '15076', 'Rosa Diaz',    60000),
('Pueblo Libre', '15084', 'Jorge Vega',   74000),
('San Miguel',   '15086', 'Lucia Paz',    155000),
('Los Olivos',   '15301', 'Mario Soto',   320000),
('Comas',        '15311', 'Ines Quinto',  520000),
('Chorrillos',   '15067', 'Hugo Ramos',   300000),
('Ate',          '15487', 'Dora Solis',   590000),
('Breña',        '15082', 'Raul Peña',    80000);
2.3 Crear los Stored Procedures

⚠️ Importante: En phpMyAdmin, antes de ejecutar el siguiente bloque, busca el campo "Delimitador" al pie del cuadro SQL y cámbialo de ; a //. Luego pega y ejecuta.

sqlUSE ventas;

DELIMITER //

-- -----------------------------------------------------
-- 1. LISTAR Y BUSCAR con paginación
-- -----------------------------------------------------
DROP PROCEDURE IF EXISTS sp_get_distritos //
CREATE PROCEDURE sp_get_distritos(
    IN p_search VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
    IN p_limit  INT,
    IN p_offset INT
)
BEGIN
    SELECT * FROM distritos
    WHERE nom_dis    COLLATE utf8mb4_general_ci LIKE CONCAT('%', p_search, '%')
       OR cod_postal COLLATE utf8mb4_general_ci LIKE CONCAT('%', p_search, '%')
       OR supervisor COLLATE utf8mb4_general_ci LIKE CONCAT('%', p_search, '%')
       OR CAST(poblacion AS CHAR) COLLATE utf8mb4_general_ci LIKE CONCAT('%', p_search, '%')
    LIMIT p_limit OFFSET p_offset;

    SELECT COUNT(*) AS total FROM distritos
    WHERE nom_dis    COLLATE utf8mb4_general_ci LIKE CONCAT('%', p_search, '%')
       OR cod_postal COLLATE utf8mb4_general_ci LIKE CONCAT('%', p_search, '%')
       OR supervisor COLLATE utf8mb4_general_ci LIKE CONCAT('%', p_search, '%')
       OR CAST(poblacion AS CHAR) COLLATE utf8mb4_general_ci LIKE CONCAT('%', p_search, '%');
END //

-- -----------------------------------------------------
-- 2. INSERTAR
-- -----------------------------------------------------
DROP PROCEDURE IF EXISTS sp_insert_distrito //
CREATE PROCEDURE sp_insert_distrito(
    IN p_nombre    VARCHAR(30),
    IN p_postal    VARCHAR(30),
    IN p_supervisor VARCHAR(50),
    IN p_poblacion INT
)
BEGIN
    INSERT INTO distritos (nom_dis, cod_postal, supervisor, poblacion)
    VALUES (p_nombre, p_postal, p_supervisor, p_poblacion);
END //

-- -----------------------------------------------------
-- 3. ACTUALIZAR
-- -----------------------------------------------------
DROP PROCEDURE IF EXISTS sp_update_distrito //
CREATE PROCEDURE sp_update_distrito(
    IN p_id        INT,
    IN p_nombre    VARCHAR(30),
    IN p_postal    VARCHAR(30),
    IN p_supervisor VARCHAR(50),
    IN p_poblacion INT
)
BEGIN
    UPDATE distritos
    SET nom_dis    = p_nombre,
        cod_postal = p_postal,
        supervisor = p_supervisor,
        poblacion  = p_poblacion
    WHERE id_dis = p_id;
END //

-- -----------------------------------------------------
-- 4. ELIMINAR
-- -----------------------------------------------------
DROP PROCEDURE IF EXISTS sp_delete_distrito //
CREATE PROCEDURE sp_delete_distrito(
    IN p_id INT
)
BEGIN
    DELETE FROM distritos WHERE id_dis = p_id;
END //

DELIMITER ;

⚙️ 3. Configurar el Backend
3.1 Entrar a la carpeta e instalar dependencias
bashcd backend
npm install
3.2 Verificar la conexión a MySQL
Abre el archivo backend/src/config/db.js y asegúrate de que los datos coincidan con tu MySQL:
jsconst pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',       // Si tu MySQL tiene contraseña, ponla aquí
  database: 'ventas'
});
3.3 Iniciar el backend
bashnode index.js
Deberías ver:
Backend corriendo en http://localhost:3000
Puedes verificar que funciona abriendo en el navegador:
http://localhost:3000/api/distritos?page=1&limit=8&search=
Debe devolver un JSON con los distritos.

🖥️ 4. Configurar el Frontend
Abre otra terminal (deja el backend corriendo) y ejecuta:
bashcd frontend
npm install
npm run dev
Deberías ver:
VITE v8.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/

🌐 5. Abrir la aplicación
Abre tu navegador y ve a:
http://localhost:5173/index.html

📁 Estructura del proyecto
Distritos/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js              # Conexión a MySQL
│   │   ├── controllers/
│   │   │   └── distritoController.js
│   │   ├── models/
│   │   │   └── distritoModel.js   # Llama a los stored procedures
│   │   └── routes/
│   │       └── distritoRoutes.js
│   ├── index.js                   # Punto de entrada del servidor
│   └── package.json
└── frontend/
    ├── css/
    │   └── style.css
    ├── js/
    │   ├── main.js                # Lógica principal (tabla, búsqueda, paginación)
    │   └── nuevo.js               # Lógica del formulario de creación
    ├── index.html                 # Página principal
    ├── nuevo.html                 # Página para agregar distrito
    └── vite.config.js             # Proxy /api → localhost:3000

❗ Problemas comunes
ErrorCausaSolución"vite" no se reconoceNo se instalaron las dependenciasEjecutar npm install en la carpeta frontendCannot find module index.jsEstás en la carpeta equivocadaEntrar a cd Distritos/backend primeroIllegal mix of collationsCollation del parámetro no coincide con la tablaUsar el procedure corregido del paso 2.3No se encontraron distritosEl backend no está corriendoIniciar node index.js en backend/success: false — error de sintaxis SQLEl modelo tenía 4 ? en vez de 3Ya corregido en el repositorio

🚀 Resumen de comandos
bash# Terminal 1 — Backend
cd Distritos/backend
npm install
node index.js

# Terminal 2 — Frontend
cd Distritos/frontend
npm install
npm run dev