/* eslint-disable unicorn/prefer-code-point */
const ENCRYPTION_ALGORITHM = 'AES-GCM';
const ENCRYPTION_LENGTH = 256;

interface EncryptionResult {
  key: string;
  encryptedContent: string;
}

function arrayBufferToBase64(buffer: ArrayBuffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  return btoa(binary);
}

function base64ToArrayBuffer(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return bytes.buffer;
}

export async function encryptContent(content: string): Promise<EncryptionResult> {
  const iv = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.generateKey(
    {
      name: ENCRYPTION_ALGORITHM,
      length: ENCRYPTION_LENGTH,
    },
    true,
    ['encrypt', 'decrypt'],
  );

  const encryptedContent = await crypto.subtle.encrypt(
    {
      name: ENCRYPTION_ALGORITHM,
      iv,
    },
    key,
    new TextEncoder().encode(content),
  );

  const ivString = arrayBufferToBase64(iv);
  const encryptedString = arrayBufferToBase64(encryptedContent);
  const withIV = `${ivString}:${encryptedString}`;

  return {
    key: arrayBufferToBase64(await crypto.subtle.exportKey('raw', key)),
    encryptedContent: withIV,
  };
}

export async function decryptContent(data: EncryptionResult): Promise<string> {
  try {
    const [iv, encryptedContent] = data.encryptedContent.split(':');
    const key = await crypto.subtle.importKey(
      'raw',
      base64ToArrayBuffer(data.key),
      {
        name: ENCRYPTION_ALGORITHM,
      },
      true,
      ['encrypt', 'decrypt'],
    );

    const decryptedContent = await crypto.subtle.decrypt(
      {
        name: ENCRYPTION_ALGORITHM,
        iv: base64ToArrayBuffer(iv),
      },
      key,
      base64ToArrayBuffer(encryptedContent),
    );

    return new TextDecoder().decode(decryptedContent);
  } catch (error) {
    console.error(error);
    throw new Error('Failed to decrypt content. You might not have the correct decryption key.');
  }
}
