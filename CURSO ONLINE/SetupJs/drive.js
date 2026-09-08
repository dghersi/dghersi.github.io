import { DRIVE_SCOPE, DRIVE_FOLDER_NAME } from "./config.js";

// ==========================================
// ESTADO INTERNO DEL MÓDULO
// ==========================================
let driveAccessToken = null;
let tokenClient = null;

// ==========================================
// FUNCIONES DE AUTENTICACIÓN (OAuth)
// ==========================================

export function driveConectado() {
  return !!driveAccessToken;
}

export function iniciarTokenClient(clientId, onConectado, onError) {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: clientId,
    scope: DRIVE_SCOPE,
    callback: (resp) => {
      if (resp.error) { onError(resp.error); return; }
      driveAccessToken = resp.access_token;
      onConectado();
    }
  });
}

export function solicitarAccesoDrive() {
  if (!tokenClient) throw new Error("El cliente de OAuth aún no se inicializó.");
  tokenClient.requestAccessToken();
}

function requiereDrive() {
  if (!driveAccessToken) throw new Error('No estás conectado a Google Drive. Ve arriba y presiona "Conectar con Google Drive".');
}

// ==========================================
// FUNCIONES DE LÓGICA — archivos en Drive
// ==========================================

export async function obtenerCarpetaCursos() {
  let folderId = localStorage.getItem("drive_folder_id");
  if (folderId) return folderId;
  const q = encodeURIComponent(`name='${DRIVE_FOLDER_NAME}' and mimeType='application/vnd.google-apps.folder' and trashed=false`);
  const res = await fetch(`https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id,name)`, {
    headers: { Authorization: `Bearer ${driveAccessToken}` }
  });
  if (res.status === 401) throw new Error("Tu sesión de Drive expiró. Vuelve a conectar.");
  const data = await res.json();
  if (data.files && data.files.length > 0) {
    folderId = data.files[0].id;
  } else {
    const createRes = await fetch("https://www.googleapis.com/drive/v3/files", {
      method: "POST",
      headers: { Authorization: `Bearer ${driveAccessToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({ name: DRIVE_FOLDER_NAME, mimeType: "application/vnd.google-apps.folder" })
    });
    const createData = await createRes.json();
    folderId = createData.id;
  }
  localStorage.setItem("drive_folder_id", folderId);
  return folderId;
}

async function crearArchivoDrive(nombre, contenido, folderId) {
  const boundary = "cursos_boundary_" + Date.now();
  const metadata = { name: nombre, parents: [folderId], mimeType: "text/markdown" };
  const body =
    `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}\r\n` +
    `--${boundary}\r\nContent-Type: text/markdown; charset=UTF-8\r\n\r\n${contenido}\r\n` +
    `--${boundary}--`;
  const res = await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id", {
    method: "POST",
    headers: { Authorization: `Bearer ${driveAccessToken}`, "Content-Type": `multipart/related; boundary=${boundary}` },
    body
  });
  if (res.status === 401) throw new Error("Tu sesión de Drive expiró. Vuelve a conectar.");
  if (!res.ok) throw new Error("Error creando archivo en Drive: " + (await res.text()).slice(0, 200));
  const data = await res.json();
  return data.id;
}

async function actualizarArchivoDrive(fileId, contenido) {
  const res = await fetch(`https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${driveAccessToken}`, "Content-Type": "text/markdown; charset=UTF-8" },
    body: contenido
  });
  if (res.status === 401) throw new Error("Tu sesión de Drive expiró. Vuelve a conectar.");
  if (!res.ok) throw new Error("Error actualizando archivo en Drive: " + (await res.text()).slice(0, 200));
}

export async function leerArchivoDrive(fileId) {
  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
    headers: { Authorization: `Bearer ${driveAccessToken}` }
  });
  if (res.status === 401) throw new Error("Tu sesión de Drive expiró. Vuelve a conectar.");
  if (!res.ok) throw new Error("Error leyendo archivo de Drive: " + (await res.text()).slice(0, 200));
  return await res.text();
}

export async function guardarSesionEnDrive(slug, numSesion, contenidoMarkdown, fileIdExistente) {
  requiereDrive();
  if (fileIdExistente) {
    await actualizarArchivoDrive(fileIdExistente, contenidoMarkdown);
    return fileIdExistente;
  }
  const folderId = await obtenerCarpetaCursos();
  const nombre = `${slug}_sesion_${numSesion}.md`;
  return await crearArchivoDrive(nombre, contenidoMarkdown, folderId);
}
