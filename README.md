# afterlife-wedding 💍

**[Español](#español) · [English](#english)**

---

## Español

Sitio de la boda (15 de noviembre de 2026). Los invitados escanean un QR, ven el cronograma y los datos para el regalo, y suben sus fotos, que se guardan en el Google Drive de la boda.

Hecho con Next.js 16, React 19 y Tailwind 4.

### Páginas

| Ruta | Qué es |
|---|---|
| `/` | Portada: monograma, cronograma, regalos, palabras de los novios y botón para subir fotos |
| `/upload` | Sacar o elegir fotos, ver la vista previa y subirlas |
| `/gallery` | Álbum. **Deshabilitado** (responde 404); se activa con `GALLERY_ENABLED` en `src/lib/flags.ts` |

En `/upload`, el invitado puede **sacar una foto** o **elegir fotos** de su celular. Antes de subir siempre ve una vista previa y elige **Guardar** o **Descartar**. No se aceptan videos.

No hay panel de administración: las fotos se administran directamente desde Google Drive.

### Requisitos

- Node.js 20.6 o superior
- Un proyecto en Google Cloud con la **Google Drive API** habilitada y un cliente OAuth de tipo "Aplicación web", con esta URI de redirección autorizada:
  `http://localhost:3000/api/auth/callback`

### Configuración local

1. Instala las dependencias:

   ```bash
   npm install
   ```

2. Copia `.env.example` a `.env.local` y completa los valores. Este archivo **no** se sube al repositorio; nunca compartas sus valores:

   ```
   GOOGLE_CLIENT_ID=...
   GOOGLE_CLIENT_SECRET=...
   GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/callback
   ```

3. Conecta el Google Drive de la boda. Se hace una sola vez, con el sitio apagado:

   ```bash
   npm run drive:connect
   ```

   Abre el link que aparece en la terminal e inicia sesión con **la cuenta de Google de la boda**. Al terminar:
   - se crea en ese Drive la carpeta **"Boda Sofi & Santi"**; con la primera subida se crea dentro la subcarpeta **Fotos**, donde se guarda todo lo que suban los invitados;
   - las credenciales quedan guardadas en `.data/google.json`, que no se sube al repositorio.

   La app solo tiene acceso a los archivos que ella misma crea (permiso `drive.file`), no al resto del Drive. Puedes renombrar la carpeta principal en Drive; no renombres ni borres **Fotos**.

### Levantar el sitio

```bash
npm run dev
```

O la versión de producción, más rápida:

```bash
npm run build
npm start
```

El sitio queda en http://localhost:3000.

### Desplegar en Vercel

1. En [vercel.com](https://vercel.com), entra con GitHub, toca **Add New → Project** e importa este repositorio. Vercel detecta Next.js solo.
2. En **Settings → Environment Variables**, agrega:

   | Variable | Valor |
   |---|---|
   | `GOOGLE_CLIENT_ID` | el de `.env.local` |
   | `GOOGLE_CLIENT_SECRET` | el de `.env.local` |
   | `GOOGLE_REFRESH_TOKEN` | el `refreshToken` de `.data/google.json` |
   | `GOOGLE_DRIVE_FOLDER_ID` | el `folderId` de `.data/google.json` |

   En Vercel no existe `.data/google.json`, por eso la app usa estas dos últimas variables.
3. Toca **Deploy**. Cada `git push` a `main` vuelve a desplegar el sitio solo.
4. Opcional: en **Settings → Domains** puedes poner un dominio propio.

`npm run drive:connect` se ejecuta siempre en tu computadora, nunca en Vercel.

### Generar el QR

Con el link definitivo:

```bash
npx qrcode -o qr-boda.png -w 1000 -e H "https://TU-LINK"
```

Genera `qr-boda.png` en alta resolución, listo para imprimir.

### Límites

- Hasta **1000 fotos**, de hasta **40 MB** cada una (el peso original).
- Antes de subirlas, el celular las convierte a JPEG en **2K** (2560 px en el lado más largo); cada una queda en ~0,5–2 MB y como máximo 4 MB.
- Ese tope de 4 MB respeta el límite de 4,5 MB por pedido de Vercel, así que cada foto se sube en un solo pedido.
- Se deja un margen mínimo de 200 MB libres en el Drive. El servidor revisa la cantidad y el espacio libre real antes de cada subida.
- Los números están en `src/lib/limits.ts`.

### Seguridad

- Las fotos se suben a una carpeta privada de Drive.
- Solo se aceptan imágenes; los videos se rechazan, aunque el celular los informe como imagen.
- El sitio envía encabezados de seguridad (CSP, protección contra clickjacking y HSTS en producción).
- Si alguna credencial de Google se filtra, rótala en Google Cloud Console, vuelve a ejecutar `npm run drive:connect` y actualiza las variables en Vercel.

---

## English

Wedding website (November 15, 2026). Guests scan a QR code, see the schedule and gift details, and upload their photos, which are saved to the wedding's Google Drive.

Built with Next.js 16, React 19 and Tailwind 4. The site itself is in Spanish.

### Pages

| Route | What it is |
|---|---|
| `/` | Home: monogram, schedule, gifts, a note from the couple and a button to upload photos |
| `/upload` | Take or pick photos, preview them and upload |
| `/gallery` | Album. **Disabled** (returns 404); enable it with `GALLERY_ENABLED` in `src/lib/flags.ts` |

On `/upload`, guests can **take a photo** or **pick photos** from their phone. They always see a preview first and choose **Guardar** (save) or **Descartar** (discard). Videos are not accepted.

There is no admin panel: photos are managed directly in Google Drive.

### Requirements

- Node.js 20.6 or later
- A Google Cloud project with the **Google Drive API** enabled and a "Web application" OAuth client with this authorized redirect URI:
  `http://localhost:3000/api/auth/callback`

### Local setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env.local` and fill in the values. This file is **not** committed; never share its values:

   ```
   GOOGLE_CLIENT_ID=...
   GOOGLE_CLIENT_SECRET=...
   GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/callback
   ```

3. Connect the wedding's Google Drive. This is a one-time step, done with the site stopped:

   ```bash
   npm run drive:connect
   ```

   Open the link printed in the terminal and sign in with **the wedding's Google account**. When it finishes:
   - a **"Boda Sofi & Santi"** folder is created in that Drive; on the first upload a **Fotos** (photos) subfolder is created inside it, and every guest upload goes there;
   - the credentials are saved to `.data/google.json`, which is not committed.

   The app can only access the files it creates itself (`drive.file` scope), not the rest of the Drive. You can rename the main folder in Drive; don't rename or delete **Fotos**.

### Running the site

```bash
npm run dev
```

Or the faster production build:

```bash
npm run build
npm start
```

The site runs at http://localhost:3000.

### Deploying to Vercel

1. On [vercel.com](https://vercel.com), sign in with GitHub, click **Add New → Project** and import this repository. Vercel detects Next.js automatically.
2. In **Settings → Environment Variables**, add:

   | Variable | Value |
   |---|---|
   | `GOOGLE_CLIENT_ID` | from `.env.local` |
   | `GOOGLE_CLIENT_SECRET` | from `.env.local` |
   | `GOOGLE_REFRESH_TOKEN` | the `refreshToken` in `.data/google.json` |
   | `GOOGLE_DRIVE_FOLDER_ID` | the `folderId` in `.data/google.json` |

   `.data/google.json` doesn't exist on Vercel, so the app reads the last two variables instead.
3. Click **Deploy**. Every `git push` to `main` redeploys automatically.
4. Optional: add your own domain in **Settings → Domains**.

Always run `npm run drive:connect` on your computer, never on Vercel.

### Generating the QR code

With the final link:

```bash
npx qrcode -o qr-boda.png -w 1000 -e H "https://YOUR-LINK"
```

This creates a high-resolution `qr-boda.png`, ready to print.

### Limits

- Up to **1,000 photos**, up to **40 MB** each (original size).
- Before uploading, the phone converts them to **2K** JPEG (2560 px on the longest side); each ends up ~0.5–2 MB, 4 MB at most.
- That 4 MB cap fits Vercel's 4.5 MB request limit, so each photo uploads in a single request.
- At least 200 MB is always kept free on the Drive. The server checks the count and the real free space before each upload.
- The numbers live in `src/lib/limits.ts`.

### Security

- Photos are uploaded to a private Drive folder.
- Only images are accepted; videos are rejected even if the phone reports them as images.
- The site sends security headers (CSP, clickjacking protection, and HSTS in production).
- If a Google credential leaks, rotate it in Google Cloud Console, run `npm run drive:connect` again and update the Vercel variables.
