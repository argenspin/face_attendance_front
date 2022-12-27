import CryptoJS, { AES } from "crypto-js";

export function encryptData(loggedUser,refresh_token){
    const data = AES.encrypt(
        JSON.stringify(loggedUser),
        refresh_token).toString();
    return data;
}

export function decryptData(loggedUser,refresh_token){
    let data = 'none';
    if(loggedUser && refresh_token) //Important...without this checking no component is not rendered
    {
    const bytes = AES.decrypt(loggedUser, refresh_token);
    const data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return data;
    }
    return data;
}

//The below line of code is used in some places to decrypt the loggedUser as it is stored by encrypting the username after logging in
//const loggedUser = decryptData(localStorage.getItem('loggedUser'),localStorage.getItem('refresh'))

