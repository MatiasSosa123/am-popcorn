import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Función para subir imágenes a Firebase Storage
export const uploadImageToFirebase = async (file: File): Promise<string> => {
  const storage = getStorage();
  
  // Crear una referencia única para el archivo
  const fileExtension = file.name.split('.').pop();
  const fileName = `product_${Date.now()}.${fileExtension}`;
  const storageRef = ref(storage, `products/${fileName}`);
  
  try {
    // Subir el archivo
    const snapshot = await uploadBytes(storageRef, file);
    
    // Obtener la URL de descarga
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    console.log('Imagen subida exitosamente:', downloadURL);
    return downloadURL;
  } catch (error) {
    console.error('Error subiendo imagen a Firebase Storage:', error);
    throw new Error('No se pudo subir la imagen. Intenta nuevamente.');
  }
};