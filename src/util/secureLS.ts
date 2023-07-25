import SecureLS from 'secure-ls';
const secureLS = new SecureLS({ encodingType: 'aes', encryptionSecret: 'secret-key'});
export default secureLS;