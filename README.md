# Mini Core Logística - MVC (Angular + Node.js + MongoDB)

Esta es una pequeña aplicación funcional diseñada como material pedagógico para demostrar el patrón **Modelo-Vista-Controlador (MVC)** ante un problema concreto de logística y distribución.

## 📋 Descripción del Ejercicio
Calcular el costo total de los envíos realizados por cada repartidor dentro de un rango de fechas determinado, aplicando una tarifa por kilogramo definida según la zona de entrega asignada a cada envío.

---

## 🛠️ Estructura del Monorepo (MVC)

El proyecto utiliza un monorepo dividido en:
* **`backend/`**: Servidor Node.js / Express. Administra la lógica de negocio y base de datos (MongoDB).
  - **Models (`backend/models/`)**: Define la estructura de datos para `Repartidor`, `Zona` y `Envio`.
  - **Controllers (`backend/controllers/`)**: Procesa los filtros y calcula los costos ($\text{peso\_kg} \times \text{tarifa\_por\_kg}$).
* **`frontend/`**: Cliente Angular interactivo.
  - **Views (`app.component.html` + `.css`)**: Muestra un formulario de fechas y la tabla de resultados con un diseño premium y responsive (modo oscuro + glassmorphism).
  - **Controllers (`app.component.ts`)**: Controla las entradas, llamadas HTTP y estados visuales.

---

## 🚀 Instalación y Ejecución Local

Sigue estos pasos para correr la aplicación en tu computadora:

### 1. Prerrequisitos
* Tener instalado **Node.js** (versión 18 o superior).
* Tener un servidor local de **MongoDB** ejecutándose (ej: `mongodb://localhost:27017`) o configurar una base de datos en la nube (MongoDB Atlas).

### 2. Instalar Dependencias
Desde el directorio raíz de la aplicación, instala las dependencias para el frontend y backend ejecutando:
```bash
npm run install:all
```

### 3. Configuración de Variables de Entorno
Crea un archivo `.env` dentro de la carpeta `backend/` si deseas personalizar la URL de la base de datos (por defecto intentará conectarse a `mongodb://localhost:27017/minicore_logistics`):
```env
MONGODB_URI=tu_cadena_conexion_mongodb
PORT=3000
```

### 4. Arrancar los Servidores
Necesitas iniciar tanto el backend como el frontend de manera simultánea:

* **Iniciar Backend (Puerto 3000)**:
  Abra una terminal en la raíz y ejecute:
  ```bash
  npm run start:local-backend
  ```
  *(El backend tiene Seeding Automático: si la base de datos está vacía, sembrará los registros de prueba para Mayo 2025 al iniciar).*

* **Iniciar Frontend (Puerto 4200)**:
  Abra otra terminal en la raíz y ejecute:
  ```bash
  npm run start:local-frontend
  ```

Abre tu navegador en [http://localhost:4200](http://localhost:4200).

---

## 🌐 Despliegue en Producción (Render + MongoDB Atlas)

Este proyecto está listo para ser desplegado de manera unificada en **Render**:
1. El archivo `render.yaml` define el aprovisionamiento automático del servicio.
2. En producción, el servidor Express compila y sirve el frontend Angular de manera estática, eliminando la necesidad de levantar múltiples servidores o configurar CORS complejas.

Para ver las instrucciones detalladas de despliegue paso a paso, consulta la [Guía de Despliegue en Render y MongoDB Atlas](.gemini/antigravity/brain/b0a9c305-8300-4b26-924c-4995a9fe2b53/render_mongo_guide.md).

---

## 🎓 Materiales de Aprendizaje y Recursos
* **Guion del Video Explicativo**: Encuéntralo en [video_script.md](.gemini/antigravity/brain/b0a9c305-8300-4b26-924c-4995a9fe2b53/video_script.md) para grabar tu video de entrega.
* **Referencias y Links**: Listados en [references.md](.gemini/antigravity/brain/b0a9c305-8300-4b26-924c-4995a9fe2b53/references.md) con los videos y documentación oficial para profundizar.
