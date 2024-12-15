export const generateRandomSalt = () => {
    const array = new Uint32Array(2);
    crypto.getRandomValues(array);
    return array.join("");
}