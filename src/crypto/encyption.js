import SimpleCrypto from "simple-crypto-js";
import { GLOBALVARS } from "../globalvariable/GLOBALVARS";

const decrypt = (plainText) => {
  var _secretKey = GLOBALVARS.PASSKEY;
  var simpleCrypto = new SimpleCrypto(_secretKey);
  var decryptedText = simpleCrypto.decrypt(plainText);
  return decryptedText;
};

const encrypt = (plainText) => {
  var _secretKey = GLOBALVARS.PASSKEY;
  var simpleCrypto = new SimpleCrypto(_secretKey);
  var encryptedText = simpleCrypto.encrypt(plainText);
  return encryptedText;
};
export const cryptography = {
  decrypt,
  encrypt,
};
