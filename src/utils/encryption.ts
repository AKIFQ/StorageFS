import { AES, enc } from "crypto-js";

export const encryptFile = async (file: File, password: string): Promise<string> => {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      const encrypted = AES.encrypt(base64, password).toString();
      resolve(encrypted);
    };
    reader.readAsDataURL(file);
  });
};

export const decryptFile = (encrypted: string, password: string): string => {
  const decrypted = AES.decrypt(encrypted, password);
  return decrypted.toString(enc.Utf8);
};
