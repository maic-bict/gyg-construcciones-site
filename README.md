# Repo: Sitio web y API de leads — G y G Construcciones y Remodelaciones

Estructura propuesta:
- / (root)
  - index.html, services.html, cotizar.html, contacto.html, portafolio.html, b2b.html
  - /services/*.html (páginas detalladas por servicio)
  - styles.css
  - app.js (frontend actualizado para enviar leads)
  - /images/
  - /server
    - server.js
    - package.json
    - .env.example
    - leads.json (creado automáticamente por el servidor)

1) Configurar el backend (local)
- Copia server/.env.example a server/.env y completa:
  - SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
  - EMAIL_TO = garciamaicolrojas28@gmail.com
  - EMAIL_FROM = "G y G <no-reply@tudominio.com>"
- En la carpeta /server:
  - npm install
  - npm start
- Verificar: GET http://localhost:4000/api/health

2) Configurar frontend (local)
- En la raíz, abre index.html en un navegador o sirve con un servidor estático (p.ej. `npx http-server`).
- Para que el frontend llame al backend local (si backend en puerto 4000 y frontend en diferente puerto), puedes definir en la página principal (antes de incluir app.js) una variable global:
  <script>window.__API_URL__ = 'http://localhost:4000/api/leads'</script>

3) Despliegue recomendado (producción)
- Frontend (sitio estático): Netlify o Vercel (gratuitos para sitios estáticos)
  - Subir repo a GitHub
  - En Netlify: New site from Git -> elegir el repo -> build settings (none) -> publicar
  - En Vercel: Import Project -> seleccionar repo -> Deploy (Framework: Other / Static)
  - Si tu frontend y backend se alojan en dominios diferentes, actualiza window.__API_URL__ a la URL pública del backend antes de desplegar (o usar variable de entorno del host).
- Backend (API de leads): Render / Railway / Heroku / VPS
  - Render: New -> Web Service -> conectar repo -> carpeta `server` -> start command: `npm start` -> agregar variables de entorno (SMTP, EMAIL_TO, etc.)
  - Alternativa: desplegar el backend como función serverless (Vercel/Netlify Functions) — requiere adaptar código.

4) Opciones FTP (hosting tradicional)
- Sube todo el contenido estático (archivos HTML/CSS/JS/images) al directorio público de tu hosting (public_html) mediante FTP/SFTP (FileZilla).
- El backend Express debe desplegarse aparte en un servicio que permita Node.js (Render, VPS, Heroku). Si tu hosting soporta Node.js puedes subirlo ahí.

5) Notas de seguridad & producción
- No guardar credenciales en el repo; usar variables de entorno en el servicio de despliegue.
- Para emails en producción usar SendGrid / Mailgun / Amazon SES o SMTP de tu proveedor.
- Para almacenar leads de forma confiable usar una base de datos (Postgres, MySQL, Firestore) en lugar de un archivo JSON cuando crezca el volumen.
- Asegura HTTPS (Netlify / Vercel lo hacen automáticamente).

6) Conversión a WordPress o Webflow (resumen)
- WordPress:
  - Instalar WP en tu hosting.
  - Elegir tema ligero (Astra, GeneratePress) o crear child theme.
  - Crear páginas y copiar el HTML/texto al editor (o usar Gutenberg / Elementor).
  - Para formularios usar WPForms o Contact Form 7 y:
    - Conectar a tu endpoint /api/leads mediante webhook (add-on) o usar SMTP para notificaciones.
- Webflow:
  - Crear nuevo proyecto y duplicar la estructura (nav, secciones).
  - Subir assets, crear CMS collection si quieres portafolio dinámico.
  - Para formularios: usar Webflow Forms (envía por correo) o usar Zapier / Integromat para POST a /api/leads.

7) Próximos pasos que puedo hacer por ti (indica lo que prefieres)
- A) Adaptar la API a serverless (Vercel/Netlify function) — te entrego el archivo /api/leads.js listo.
- B) Desplegar el backend por ti en Render (necesitaré acceso al repo y variables de entorno).
- C) Generar las páginas detalladas por cada servicio (yo las creo y agrego a /services).
- D) Crear un repositorio en GitHub desde aquí con todos los archivos (si quieres puedo guiarte en los comandos o generar el repo por ti si me das el permiso), y preparar un flujo de deploy automático.

---

Fin del README. Sigue las instrucciones y, si quieres, hago la tarea siguiente por ti: desplegar el backend en Render y el frontend en Netlify/Vercel y dejarlo todo funcionando — dime cuál opción prefieres y si me autorizas a preparar los archivos de deploy (por ejemplo, _Procfile_ o configuración de Render).