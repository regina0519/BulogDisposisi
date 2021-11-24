
class MyFunctions {
    static leadingZero(number, zero = 2) {
        return String(number).padStart(zero, '0');
    }
    static formatMoney2(number, decPlaces, decSep, thouSep) {
        decPlaces = isNaN(decPlaces = Math.abs(decPlaces)) ? 2 : decPlaces,
            decSep = typeof decSep === "undefined" ? "." : decSep;
        thouSep = typeof thouSep === "undefined" ? "," : thouSep;
        var sign = number < 0 ? "-" : "";
        var i = String(parseInt(number = Math.abs(Number(number) || 0).toFixed(decPlaces)));
        var j = (j = i.length) > 3 ? j % 3 : 0;

        return sign +
            (j ? i.substr(0, j) + thouSep : "") +
            i.substr(j).replace(/(\decSep{3})(?=\decSep)/g, "$1" + thouSep) +
            (decPlaces ? decSep + Math.abs(number - i).toFixed(decPlaces).slice(2) : "");
    }
    static formatMoney(number) {
        return Number(number)
            .toFixed(2)
            .replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }

    static validateString(str) {
        str = str.substr(-1) === " " ? str.trim() + " " : str.trim();
        str = str.trim() === "" ? str.trim() : str;
        return str;
    }
    static validateNumber(str) {
        str = str.substr(-1) === " " ? str.trim() + " " : str.trim();
        str = str.trim() === "" ? str.trim() : str;
        return str.replace(/[^0-9]/g, '');
    }
}
export default MyFunctions;
