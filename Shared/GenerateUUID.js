import * as Crypto from 'expo-crypto';

export default generateUUID = async () => {
    const randomBytes = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        Math.random().toString()
    );
    return randomBytes;
};