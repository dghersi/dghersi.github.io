// Core/Cloudinary.js - Subida Directa y Compresión para PWA

const CLOUDINARY_CONFIG = {
  cloudName: 'ovirred3',
  uploadPreset: 'ChecklistData'
};

/**
 * Comprime la imagen en el cliente previo al envío
 */
function compressImage(file, maxWidth = 1280, quality = 0.7) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => resolve(blob), 'image/jpeg', quality);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}

/**
 * Sube la evidencia a Cloudinary en: Checklists_PWA/Hallazgos/[CODIGO_EQUIPO]
 */
async function uploadEvidenceToCloudinary(file, codigoEquipo) {
  try {
    const compressedBlob = await compressImage(file);
    const folderPath = `Checklists_PWA/Hallazgos/${codigoEquipo}`;

    const formData = new FormData();
    formData.append('file', compressedBlob);
    formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
    formData.append('folder', folderPath);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
      { method: 'POST', body: formData }
    );

    if (!response.ok) throw new Error('Error al subir imagen a Cloudinary');

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Error en Cloudinary Upload:', error);
    throw error;
  }
}

window.uploadEvidenceToCloudinary = uploadEvidenceToCloudinary;