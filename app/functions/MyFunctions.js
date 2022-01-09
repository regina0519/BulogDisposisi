import { Alert } from "react-native";

class MyFunctions {
    static msgBox = (msg) => Alert.alert('BULOG', msg, [
        { text: 'Ok' }
    ]);

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
    static validateStringFirstCap(str) {
        var splitStr = str.toLowerCase().split(' ');
        for (var i = 0; i < splitStr.length; i++) {
            // You do not need to check if i is larger than splitStr length, as your for does that for you
            // Assign it back to the array
            splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
        }
        // Directly return the joined string
        return splitStr.join(' '); 
     }
    static validateInputNumbersOnly(str) {
        str = str.substr(-1) === " " ? str.trim() + " " : str.trim();
        str = str.trim() === "" ? str.trim() : str;
        return str.replace(/[^0-9]/g, '');
    }
    static validateInputInteger(str, min = undefined) {
        var ret = parseInt(str);
        if (Number.isNaN(ret)) {
            ret = min == undefined ? 0 : min;
        } else {
            ret = min == undefined ? ret : (ret < min ? min : ret);
        }
        return ret + '';
    }
    static validateInputDouble2(str, min = undefined) {
        var ret = parseFloat(str);
        if (Number.isNaN(ret)) {
            if (str == "" || str == "-") {
                if (min == undefined) {
                    return str;
                } else {
                    if (ret < min) {
                        return min + "";
                    } else {
                        return str;
                    }
                }
            } else {
                if (min == undefined) {
                    return "";
                } else {
                    if (ret < min) {
                        return min + "";
                    } else {
                        return "";
                    }
                }
            }
        } else {
            if (str.charAt(str.length - 1) === '.') {
                var tmp = str.substring(0, str.length - 1);
                if (tmp.indexOf(".") == -1) {
                    return ret + '.';
                } else {
                    return ret + '';
                }
            } else {
                if (str.charAt(str.length - 1) === '0') {

                    var tmp = str.substring(0, str.length - 1);
                    if (tmp.indexOf(".") == -1) {
                        if (str.length > 1 && ret == 0) {
                            var tmp2 = str.substring(0, str.length - 1);
                            if (tmp2.indexOf("-") == -1) {
                                ret = min == undefined ? ret : (ret < min ? min : ret);
                            } else {
                                return str;
                            }
                        } else {
                            ret = min == undefined ? ret : (ret < min ? min : ret);
                        }

                    } else {
                        var strTmp = min == undefined ? str : (ret < min ? min + '' : str);
                        return strTmp;
                    }
                } else {

                    ret = min == undefined ? ret : (ret < min ? min : ret);
                }
            }
        }

        return ret + '';
    }
    static validateInputDouble(str) {
        var ret = parseFloat(str);
        if (Number.isNaN(ret)) {
            str = str.match(/^-|^\.|^/g);
            return str[0];
        } else {
            str = str.match(/^-?[0-9]*\.?[0-9]*/g);
            return str[0];
        }
    }
    static stringTruncateIndo(str, min, char, name) {
        let arr = str.split(char);
        if (arr.length <= min + 1) return str;
        let ret = "";
        for (var i = 0; i < min; i++) {
            ret += arr[i];
            if (i < min - 1) ret += char;
        }
        ret += "," + char + "dan " + (arr.length - min) + " " + name + " lainnya";
        return ret;
    };
}
export default MyFunctions;
