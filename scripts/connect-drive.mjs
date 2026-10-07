// One-time setup: authorizes the wedding Google account and creates the photos folder.
// Usage: npm run drive:connect  (with the site stopped, since it listens on the redirect URI's port)
import { randomBytes } from 'crypto';
import { mkdir, writeFile } from 'fs/promises';
import http from 'http';
import path from 'path';
import { google } from 'googleapis';

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } = process.env;
if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REDIRECT_URI) {
  console.error('Faltan GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET o GOOGLE_REDIRECT_URI en .env.local');
  process.exit(1);
}

const redirect = new URL(GOOGLE_REDIRECT_URI);
const auth = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI);
const state = randomBytes(16).toString('hex');
const url = auth.generateAuthUrl({
  access_type: 'offline',
  prompt: 'consent',
  // drive.file: the app only sees files/folders it created itself (least privilege).
  scope: ['https://www.googleapis.com/auth/drive.file'],
  state,
});

const server = http.createServer(async (req, res) => {
  const params = new URL(req.url ?? '/', redirect.origin).searchParams;
  if (!req.url?.startsWith(redirect.pathname) || params.get('state') !== state || !params.get('code')) {
    res.writeHead(400).end('Solicitud inválida.');
    return;
  }
  try {
    const { tokens } = await auth.getToken(params.get('code'));
    if (!tokens.refresh_token) throw new Error('Google no devolvió refresh_token.');
    auth.setCredentials(tokens);
    const folder = await google.drive({ version: 'v3', auth }).files.create({
      requestBody: { name: 'Boda Sofi & Santi', mimeType: 'application/vnd.google-apps.folder' },
      fields: 'id',
    });
    const file = path.join(process.cwd(), '.data', 'google.json');
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, JSON.stringify({ refreshToken: tokens.refresh_token, folderId: folder.data.id }), { mode: 0o600 });
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' }).end('¡Listo! Ya podés cerrar esta pestaña.');
    console.log('Drive conectado. Carpeta "Boda Sofi & Santi" creada. Credenciales guardadas en .data/google.json');
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' }).end('No se pudo conectar. Mirá la terminal.');
    console.error(err.message);
    process.exitCode = 1;
  }
  server.close();
});

server.listen(Number(redirect.port || 80), redirect.hostname, () => {
  console.log('Abrí este link e iniciá sesión con la cuenta de la boda:\n\n' + url + '\n');
});
