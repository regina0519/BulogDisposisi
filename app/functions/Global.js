
class Global {
    static #curUserId = "";
    static #userKey = "";
    static #passKey = "";

    static getCurUserId() {
        return this.#curUserId;
    }
    static setCurUserId(id) {
        this.#curUserId = id;
    }

    static getUserKey() {
        return this.#userKey;
    }
    static setUserKey(uKey) {
        this.#userKey = uKey;
    }

    static getPassKey() {
        return this.#passKey;
    }
    static setPassKey(pKey) {
        this.#passKey = pKey;
    }



}
export default Global;
