import crypto from 'crypto';

// Ensure ENCRYPTION_KEY is set and of correct length
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

if (!ENCRYPTION_KEY && process.env.NODE_ENV === 'production') {
    throw new Error('ENCRYPTION_KEY environment variable is required in production');
}

// Use a default key for development if not provided (NOT SECURE FOR PRODUCTION)
const KEY_STRING = ENCRYPTION_KEY || '00000000000000000000000000000000';

// Handle both raw 32-char strings and 64-char hex strings
const KEY = KEY_STRING.length === 64
    ? Buffer.from(KEY_STRING, 'hex')
    : Buffer.from(KEY_STRING);

if (KEY.length !== 32) {
    throw new Error(`Invalid ENCRYPTION_KEY length. Expected 32 bytes (32 chars raw or 64 chars hex), got ${KEY.length} bytes.`);
}

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;

export function encrypt(text: string): string {
    try {
        const iv = crypto.randomBytes(IV_LENGTH);
        // Cast to any to bypass strict Buffer/Uint8Array mismatch in some environments
        const cipher = crypto.createCipheriv(ALGORITHM, KEY as any, iv as any);

        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        const authTag = cipher.getAuthTag();

        // Format: iv:authTag:encryptedData
        return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
    } catch (error) {
        console.error('Encryption failed:', error);
        throw new Error('Failed to encrypt data');
    }
}

export function decrypt(text: string): string {
    try {
        const parts = text.split(':');
        if (parts.length !== 3) {
            throw new Error('Invalid encrypted text format');
        }

        const [ivHex, authTagHex, encryptedHex] = parts;

        const iv = Buffer.from(ivHex, 'hex');
        const authTag = Buffer.from(authTagHex, 'hex');
        const encrypted = Buffer.from(encryptedHex, 'hex');

        // Cast to any to bypass strict Buffer/Uint8Array mismatch in some environments
        const decipher = crypto.createDecipheriv(ALGORITHM, KEY as any, iv as any);
        decipher.setAuthTag(authTag as any);

        let decrypted = decipher.update(encrypted as any);
        decrypted = Buffer.concat([decrypted, decipher.final()]);

        return decrypted.toString('utf8');
    } catch (error) {
        // Don't leak specific crypto errors
        console.error('Decryption failed:', error);
        throw new Error('Failed to decrypt data');
    }
}
