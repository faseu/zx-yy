import LibGenerateTestUserSig from './lib-generate-test-usersig-es.min.js';

/**
 * Refer to the READEME.md for the SDKAppID、SecretKey/SDKSecretKey
 */
let SDKAppID = 1600137080;
let SecretKey = '5ee2f2c475312e069604f71ce178424cc0dc56d681668f8b8e1ca640230e6f45';

/**
 * Expiration time for the signature, it is recommended not to set it too short.
 * Time unit: seconds
 * Default time: 7 x 24 x 60 x 60 = 604800 = 7 days
 */
const EXPIRETIME = 604800;

export function genTestUserSig(params) {
  if (params.SDKAppID) SDKAppID = params.SDKAppID;
  if (params.SecretKey) SecretKey = params.SecretKey;
  const generator = new LibGenerateTestUserSig(SDKAppID, SecretKey, EXPIRETIME);
  const userSig = generator.genTestUserSig(params.userID);

  return {
    SDKAppID,
    SecretKey,
    userSig,
  };
}

export default genTestUserSig;
