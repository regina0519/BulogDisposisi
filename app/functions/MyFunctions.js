
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
        //console.log(Number.isNaN(ret));
        return ret + '';
    }
    static validateInputDouble2(str, min = undefined) {
        var ret = parseFloat(str);
        //console.log(Number.isNaN(ret));
        if (Number.isNaN(ret)) {
            //console.log("======NaN");
            //ret = min == undefined ? 0 : min;
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
                //ret = min == undefined ? 0 : min;
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
        //str = str.match(/^-?(([1-9]\d*)|0)(.0*[1-9](0*[1-9])*)?$/g);
        var ret = parseFloat(str);
        if (Number.isNaN(ret)) {
            //console.log("Nan");
            str = str.match(/^-|^\.|^/g);
            //console.log(str);
            return str[0];
            //return min == undefined ? '0' : min + '';
        } else {
            //str = str.match(/^-?(([1-9]\d*)|0)(.(0*[1-9](0*[1-9])*)?)?$/g);
            str = str.match(/^-?[0-9]*\.?[0-9]*/g);
            return str[0];
            //return str == null ? min == undefined ? '0' : ret < min ? min + '' : ret + '' : str;
        }
    }
    static stringTruncateIndo(str, min, char, name) {
        let arr = str.split(char);
        if (arr.length == min + 1) return str;
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
