// firebaseStorageUtils.js
import { ref, uploadBytes, getDownloadURL, listAll, deleteObject } from "firebase/storage";
import { storage } from "./firebaseConfig";

/**
 * Uploads a file to Firebase Storage and returns its download URL.
 * @param {File} file - The file to upload.
 * @param {string} path - The storage path where the file will be uploaded.
 * @returns {Promise<string>} - A promise that resolves to the download URL.
 */
export async function uploadFileToFirebase(file, path = 'uploads') {
  if (!file) throw new Error("No file provided");

  const storageRef = ref(storage, `${path}/${file.name}`);

  // Upload the file
  await uploadBytes(storageRef, file);

  // Get the file's download URL
  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL;
}

/**
 * Lists all files in a given Firebase Storage path.
 * @param {string} path - The storage path to list files from.
 * @returns {Promise<Array<{ name: string, url: string }>>} - A promise that resolves to an array of file objects.
 */
export async function listFilesInFirebase(path = 'uploads') {
  const folderRef = ref(storage, path);

  try {
    const listResult = await listAll(folderRef);

    // Map over the items to get their names and download URLs
    const files = await Promise.all(
      listResult.items.map(async (itemRef) => {
        const url = await getDownloadURL(itemRef);
        return { name: itemRef.name, url };
      })
    );

    return files;
  } catch (error) {
    console.error("Error listing files:", error);
    throw error;
  }
}

/**
 * Deletes a file from Firebase Storage.
 * @param {string} filePath - The storage path of the file to delete (e.g., 'uploads/filename.md').
 * @returns {Promise<void>} - A promise that resolves when the file is successfully deleted.
 */
export async function deleteFileInFirebase(filePath) {
  if (!filePath) throw new Error("File path must be provided");

  const fileRef = ref(storage, filePath);

  try {
    // Delete the file
    await deleteObject(fileRef);
    console.log(`File deleted: ${filePath}`);
  } catch (error) {
    console.error(`Error deleting file at ${filePath}:`, error);
    throw error;
  }
}