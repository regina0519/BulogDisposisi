import { Alert } from "react-native";
import MyFunctions from "./MyFunctions";

class DateIndonesia{

    static getHariFull(date){
        let dt=new Date(date);
        const hariFull=["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];
        return hariFull[dt.getDay()];
    }
    static getHariShort(date){
        return this.getHariFull(date).substr(0,3);
    }
    static getBulanFull(date){
        let dt=new Date(date);
        const bulanFull=["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
        return bulanFull[dt.getMonth()];
    }
    static getBulanShort(date){
        return this.getBulanFull(date).substr(0,3);
    }
    static getDateFull(date){
        //let dt=new Date(date);
        let dt=Date.parse(date);
        return this.getHariFull(dt)+", "+MyFunctions.leadingZero(dt.getDate())+" "+this.getBulanFull(dt)+" "+dt.getFullYear();
    }
    static getDateOnlyFull(date){
        let dt=new Date(date);
        return MyFunctions.leadingZero(dt.getDate())+" "+this.getBulanFull(dt)+" "+dt.getFullYear();
    }
    static getDateShort(date){
        let dt=new Date(date);
        return this.getHariShort(dt)+", "+MyFunctions.leadingZero(dt.getDate())+"-"+this.getBulanShort(dt)+"-"+dt.getFullYear();
    }
    static getDateOnlyShort(date){
        let dt=new Date(date);
        return MyFunctions.leadingZero(dt.getDate())+"-"+this.getBulanShort(dt)+"-"+dt.getFullYear();
    }
    static getDateTimeFull(date){
        let dt=new Date(date);
        return this.getDateFull(dt)+" "+MyFunctions.leadingZero(dt.getHours())+":"+MyFunctions.leadingZero(dt.getMinutes())+":"+MyFunctions.leadingZero(dt.getSeconds());
    }
    static getDateTimeShort(date){
        let dt=new Date(date);
        return this.getDateShort(dt)+" "+MyFunctions.leadingZero(dt.getHours())+":"+MyFunctions.leadingZero(dt.getMinutes());
    }
    static getDateTimeOnlyFull(date){
        let dt=new Date(date);
        return this.getDateOnlyFull(dt)+" "+MyFunctions.leadingZero(dt.getHours())+":"+MyFunctions.leadingZero(dt.getMinutes())+":"+MyFunctions.leadingZero(dt.getSeconds());
    }
    static getDateTimeOnlyShort(date){
        let dt=new Date(date);
        return this.getDateOnlyShort(dt)+" "+MyFunctions.leadingZero(dt.getHours())+":"+MyFunctions.leadingZero(dt.getMinutes());
    }
}
export default DateIndonesia;
