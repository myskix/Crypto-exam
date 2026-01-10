export const useCryptography = () => {
  // 1. Pembangkitan Kunci dari Access Code (Poin 38)
  const deriveKey = async (accessCode, salt) => {
    const encoder = new TextEncoder();
    const baseKey = await window.crypto.subtle.importKey("raw", encoder.encode(accessCode), "PBKDF2", false, ["deriveKey"]);

    return window.crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: salt,
        iterations: 100000,
        hash: "SHA-256",
      },
      baseKey,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"]
    );
  };

  // 2. Proses Enkripsi (Poin 39 - Untuk Dosen)
  const encryptData = async (plaintext, accessCode) => {
    const encoder = new TextEncoder();
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    const key = await deriveKey(accessCode, salt);
    const encrypted = await window.crypto.subtle.encrypt({ name: "AES-GCM", iv: iv }, key, encoder.encode(plaintext));

    const combined = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
    combined.set(salt);
    combined.set(iv, salt.length);
    combined.set(new Uint8Array(encrypted), salt.length + iv.length);

    return btoa(String.fromCharCode(...combined));
  };

  // 3. Proses Dekripsi (Poin 39 - UNTUK MAHASISWA) - TAMBAHKAN INI
  const decryptData = async (base64Data, accessCode) => {
    try {
      // Ubah kembali Base64 ke Uint8Array secara aman
      const binaryString = window.atob(base64Data);
      const combined = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        combined[i] = binaryString.charCodeAt(i);
      }

      // Pecah kembali gabungan data (Salt: 16, IV: 12, Sisanya: Ciphertext)
      const salt = combined.slice(0, 16);
      const iv = combined.slice(16, 28);
      const encryptedData = combined.slice(28);

      // Bangkitkan kunci yang sama menggunakan salt yang disimpan
      const key = await deriveKey(accessCode, salt);

      const decrypted = await window.crypto.subtle.decrypt({ name: "AES-GCM", iv: iv }, key, encryptedData);

      return new TextDecoder().decode(decrypted);
    } catch (error) {
      console.error("Dekripsi gagal:", error);
      throw new Error("Gagal dekripsi: PIN salah atau data rusak.");
    }
  };

  return { encryptData, decryptData };
};
