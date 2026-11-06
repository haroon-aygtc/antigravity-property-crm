import { encrypt, decrypt } from '../lib/encryption';

console.log('Running Encryption Verification...');

try {
    const originalText = 'Hello, World! This is a secret message.';
    console.log('Original:', originalText);

    const encrypted = encrypt(originalText);
    console.log('Encrypted:', encrypted);

    const decrypted = decrypt(encrypted);
    console.log('Decrypted:', decrypted);

    if (originalText === decrypted) {
        console.log('✅ SUCCESS: Decrypted text matches original.');
    } else {
        console.error('❌ FAILURE: Decrypted text does NOT match original.');
        process.exit(1);
    }

    // Test Tampering
    try {
        const parts = encrypted.split(':');
        // Tamper with the encrypted data (last part)
        parts[2] = parts[2].substring(0, parts[2].length - 2) + '00';
        const tampered = parts.join(':');
        console.log('Attempting to decrypt tampered data...');
        decrypt(tampered);
        console.error('❌ FAILURE: Decrypting tampered data should have failed.');
        process.exit(1);
    } catch (error) {
        console.log('✅ SUCCESS: Decrypting tampered data failed as expected.');
    }

} catch (error) {
    console.error('❌ UNEXPECTED ERROR:', error);
    process.exit(1);
}
