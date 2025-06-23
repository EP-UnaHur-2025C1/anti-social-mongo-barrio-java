# Barrio de Java API

API REST para una red social básica desarrollada con Node.js, Express y Sequelize.  
Permite gestionar usuarios, publicaciones (posts), comentarios, tags y manejo de imágenes.



## 1) Instalación

1. Clonar el repositorio:

git clone https://github.com/tuusuario/turepo.git
cd turepo

## 2) Instalar dependencias:

npm install

## 3) Configurar variables de entorno:

Crear un archivo .env en la raíz con el siguiente contenido: 
PORT=3000
UPLOAD_DIR=uploads

## 4) Correr migraciones 

npx sequelize db:migrate

## 5) Iniciar el servidor:

npm start

## Documentación Swagger

Accede a la documentación completa de la API desde:

http://localhost:3005/api-docs

Swagger UI permite probar todos los endpoints con sus parámetros, validaciones y respuestas.

## Estructura del Proyecto 

src/
├── controllers/
├── db/
│   └── models/
├── middlewares/
├── routes/
├── uploads/
├── swagger.js
├── index.js

## Tecnologías

Node.js
Express.js
Sequelize + PostgreSQL
Swagger (OpenAPI 3)
Multer (para imágenes)
Dotoenv
Postman (para testing manual)

## Endpoints principales

| Recurso     | Método     | Ruta                         | Descripción                         |
| ----------- | ---------- | ---------------------------- | ----------------------------------- |
| Usuarios    | POST       | `/users`                     | Crear usuario                       |
| Usuarios    | GET        | `/users`, `/users/:id`       | Listar y ver usuario                |
| Usuarios    | PUT/DELETE | `/users/:id`                 | Actualizar o eliminar usuario       |
| Posts       | CRUD       | `/posts`, `/posts/:id`       | Crear, ver, editar, eliminar posts  |
| Comentarios | CRUD       | `/comments`, `/comments/:id` | Crear, ver, editar, eliminar        |
| Tags        | CRUD       | `/tags`, `/tags/post/:id`    | Crear tag, asociar o consultar tags |
| Tags        | GET        | `/tags/:tagId/posts`         | Ver posts asociados a un tag        |
| Imágenes    | POST       | `/images/upload`             | Subir imagen                        |
| Imágenes    | GET/DELETE | `/images/:filename`          | Ver o eliminar imagen               |

Todos los endpoints están documentados en Swagger

## Validaciones

Se aplican validaciones por middleware para los siguientes recursos:
Usuarios (validateUser)
Posts (validatePost)
Comentarios (validateComment)
Tags (validateTag)

## Autores
Kevin Pallero
Facundo Rodriguez
Lucas Maidana
Comisión 2