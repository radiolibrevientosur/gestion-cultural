# Aplicación de Gestión Cultural

Una iniciativa del Licenciado Douglas Donaire, especialista en gestión cultural, para facilitar la administración y organización de eventos culturales, artistas y actividades relacionadas.

## 🎯 Descripción

Esta aplicación web moderna está diseñada para ayudar a gestores culturales, organizadores de eventos y profesionales del sector cultural a administrar eficientemente sus actividades, eventos y contactos artísticos.

## 🚀 Características Principales

- **Gestión de Eventos Culturales**
  - Creación y edición de eventos con información detallada
  - Soporte para eventos recurrentes
  - Compartir eventos en redes sociales
  - Generación de tarjetas visuales con QR

- **Directorio de Artistas**
  - Registro de cumpleaños y trayectorias
  - Información de contacto
  - Sistema de favoritos

- **Gestión de Tareas**
  - Tablero Kanban para seguimiento
  - Asignación de responsables
  - Priorización de actividades

- **Calendario Integrado**
  - Vista mensual/semanal
  - Filtros por tipo de evento
  - Exportación a calendarios externos

## 🛠️ Tecnologías Utilizadas

### Frontend
- React 18.3.1 con TypeScript
- Vite como bundler
- TailwindCSS para estilos
- Lucide React para iconos

### Librerías Principales
- `@hookform/resolvers`: Validación de formularios
- `date-fns`: Manipulación de fechas
- `react-hook-form`: Manejo de formularios
- `react-share`: Compartir en redes sociales
- `zod`: Validación de esquemas
- `browser-image-compression`: Optimización de imágenes
- `fullcalendar`: Calendario interactivo
- `recharts`: Visualización de datos

### Almacenamiento
- LocalStorage para persistencia de datos
- Compresión de imágenes integrada

## 🎨 Diseño y UX

- Tema claro/oscuro automático
- Diseño responsive
- Interfaz intuitiva y accesible
- Feedback visual para acciones importantes

## 📦 Instalación

```bash
# Clonar el repositorio
git clone [https://github.com/radiolibrevientosur/gestion-cultural]

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build
```

## 🔧 Configuración

La aplicación utiliza variables de entorno para configuración. Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_APP_TITLE=Gestión Cultural
VITE_APP_VERSION=1.0.0
```

## 📱 Funcionalidades Móviles

- Diseño responsive optimizado para dispositivos móviles
- Soporte para subida de imágenes desde la galería
- Interfaz adaptativa según el dispositivo

## 🔒 Seguridad

- Validación de datos en frontend
- Sanitización de entradas de usuario
- Compresión y validación de imágenes
- Almacenamiento seguro de datos sensibles

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor, sigue estos pasos:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Equipo

- **Licenciado Douglas Donaire** - *Especialista en Gestión Cultural* - Líder del Proyecto

## 📞 Contacto

Para más información sobre el proyecto o consultas técnicas, contactar a:

- Email: [douglasdonaire@gmail.com]
- Twitter: [@douglasdonaire]

## 🙏 Agradecimientos

- A todos los gestores culturales que han proporcionado feedback
- A la comunidad de desarrolladores que mantienen las librerías utilizadas
- A los artistas y organizaciones culturales que han probado la aplicación

---

Desarrollado con ❤️ para la comunidad cultural