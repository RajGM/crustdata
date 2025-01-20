// firebaseStorageUtils.js
import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
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