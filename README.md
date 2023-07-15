<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Ejecutar en Desarrollo
1. Clonar el Repositorio
2. Ejecutar
``` bash
npm install
```
3. Tener Nest CLI instalado
```bash
npm i -g @nestjs/cli
```


4. Levantar la Base de Datos
```bash
docker compose up -d
```

5. Clonar el archivo __.env.template__ y renombrar la copia a __.env__

6. Llenar las variables de entorno definidas en el __.env__

7. Iniciar el Proyecto
```bash
yarn start:dev
```

8. Reconstruir la base de datos con la semilla
```http
http://localhost:3000/api/v2/seed
```

## Stack Usado
* MongoDB
* Nest JS

# Production Build
1. Crear el archivo ```.env.prod```
2. Llenar las variables de entorno de produccion
3. Crear la nueva imagen
```bash
docker-compose -f docker-compose.prod.yaml --env-file .env.prod up --build
```