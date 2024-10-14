# Proyecto de Registro de Clientes - Backend

Este proyecto es una aplicación para el registro de clientes siguiendo una arquitectura de microservicios. Está desarrollado en **Node.js** con **Hapi** como framework para el backend. Utiliza **Redis** para el almacenamiento de parámetros y **RabbitMQ** para la comunicación entre servicios. La base de datos utilizada es **MySQL**.

## Descripción del Proyecto

El proyecto permite el registro de clientes, donde el usuario ingresa su información y, tras la validación del token de seguridad, se guarda en la base de datos. Un microservicio de seguridad se encarga de generar y validar un token, mientras que el microservicio de clientes valida los datos y decide si enviar un correo de bienvenida.

## Diagrama de Arquitectura

![Diagrama de Arquitectura](./DiagramaCompleto.png)

## Requisitos para Ejecutar el Proyecto

- **Node.js**: v14 o superior.
- **Docker** y **Docker Compose**.
- **Redis** y **RabbitMQ** (estos servicios se ejecutan en contenedores Docker).
- **MySQL**: Deberás tener una base de datos MySQL configurada.

## Instalación y Configuración

### Paso 1: Clonar el Repositorio

```bash
# Clonar el repositorio de GitHub
git clone https://github.com/christian-tong/PruebaTecnica-IAInfinite-Backend.git
cd PruebaTecnica-IAInfinite-Backend
```

### Paso 2: Configurar el Backend

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

### Paso 3: Crear la Base de Datos

Antes de que el proyecto pueda funcionar correctamente, es necesario crear las tablas en la base de datos MySQL. Para ello, debes seguir estos pasos utilizando el archivo `db.sql` proporcionado:

1. **Acceder al Servidor MySQL**:
   - Si tienes MySQL instalado localmente, abre la terminal y accede a tu servidor MySQL utilizando el siguiente comando:
     
     ```bash
     mysql -u root -p
     ```
     - Aquí, `root` es el usuario administrador de MySQL. Si estás utilizando otro usuario, reemplázalo en consecuencia. Después de ejecutar el comando, se te pedirá la contraseña del usuario.

2. **Seleccionar o Crear la Base de Datos**:
   - Si no tienes una base de datos creada para este proyecto, puedes crearla con el siguiente comando:
     
     ```sql
     CREATE DATABASE IF NOT EXISTS prueba_tecnica_db;
     ```
   - Luego, selecciona la base de datos que acabas de crear o que ya tienes configurada:
     
     ```sql
     USE prueba_tecnica_db;
     ```

3. **Copiar el Contenido de `db.sql`**:
   - Abre el archivo `db.sql` con cualquier editor de texto. Este archivo contiene todas las instrucciones SQL necesarias para crear las tablas que el proyecto utilizará.
   - Copia todo el contenido del archivo. El archivo debería incluir comandos como `CREATE TABLE` que configuran las tablas para almacenar clientes, registros de correos, parámetros globales, y más.

4. **Pegar y Ejecutar las Instrucciones en MySQL**:
   - Vuelve a la consola de MySQL, donde ya deberías estar conectado a la base de datos. Pega el contenido que copiaste del archivo `db.sql` en la terminal y presiona **Enter** para ejecutar los comandos.
   - Esto creará todas las tablas necesarias en la base de datos que el proyecto utilizará para registrar clientes, administrar correos electrónicos, y almacenar parámetros globales.

5. **Verificar que las Tablas se Crearon Correctamente**:
   - Puedes verificar que las tablas se hayan creado correctamente con el siguiente comando:
     
     ```sql
     SHOW TABLES;
     ```
   - Esto te mostrará una lista de las tablas en tu base de datos `prueba_tecnica_db`, que deberían incluir `clients`, `email_logs`, `global_parameters`, y `tokens`.

Con esto, habrás configurado correctamente la base de datos para que el proyecto pueda interactuar con ella.

### Paso 4: Ejecutar Servicios con Docker

Para ejecutar Redis y RabbitMQ mediante Docker, utiliza el siguiente archivo `docker-compose.yml`:

```yaml
version: '3.8'
services:
  redis-server:
    image: redis
    container_name: redis-server
    ports:
      - "6379:6379"

  rabbitmq-server:
    image: rabbitmq:3-management
    container_name: rabbitmq-server
    ports:
      - "15672:15672" # Interfaz de gestión de RabbitMQ
      - "5672:5672"   # Puerto para la comunicación entre servicios
```

Ejecuta el siguiente comando para iniciar los servicios:

```bash
docker-compose up -d
```

### Paso 5: Ejecutar el Backend

1. **Iniciar el servidor**:
   ```bash
   node .\src\server.js
   ```

El backend estará disponible en `http://localhost:3000`.

## Comandos Útiles de Docker

- **Ver contenedores activos**:
  ```bash
  docker ps
  ```
- **Detener todos los contenedores**:
  ```bash
  docker-compose down
  ```
- **Ver logs de RabbitMQ**:
  ```bash
  docker logs rabbitmq-server
  ```

## Proceso de Registro

1. El cliente solicita un token al microservicio de seguridad (GET `/token`).
2. El token se valida cuando el cliente envía sus datos (POST `/validate-token`).
3. Tras validar el token, se registra al cliente en la base de datos.
4. Si la configuración lo permite, se envía una solicitud a RabbitMQ para registrar un correo de bienvenida.

## Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue primero para discutir los cambios que deseas realizar.

## Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo LICENSE para más detalles.

