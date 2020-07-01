// 全局声明，以免有错误提示
declare class http{
    onreadystatechange:Function;
    status:number;
    readyState:number;
    responseText:string;
    statusText:string;
    open(method, address, flag:boolean);
    send(data?); 
    setRequestHeader(s1,s2);  
}

declare module Audio {
    sourcePool:any;
};

declare class ActiveXObject extends http{
    constructor(s:string);
}

declare module canvas{
    function toTempFilePathSync(obj)
}
declare namespace tt {
    function getGameRecorderManager();
    function getUserInfo(obj)
    function login(obj)
    function checkSession(obj)
    function createMoreGamesButton(obj)
    function getSystemInfo(obj);
    //-------------------
    function getSystemInfoSync(): any;
    function request(any):void;
    function connectSocket(any):void;
    function getNetworkType(any);
    function onNetworkStatusChange(callback: Function);
    function onMemoryWarning(callback: Function);
    function shareAppMessage(data:any);
    function createBannerAd(data:any)
    function createRewardedVideoAd(data:any)
    function onShareAppMessage(func:Function);
    function showShareMenu(obj);
    function createInterstitialAd(obj)
    function wladGetAds(num,func:Function);
    function updateShareMenu(obj);
    function getShareInfo(obj)
    function setStorageSync(obj,data)
    function getStorageSync(obj)
    function clearStorageSync();
    function removeStorageSync(key)
    function previewImage(obj)
    function navigateToMiniProgram(obj)
    function getLaunchOptionsSync();
    function onShow(fun:Function)
    function getOpenDataContext();
    function vibrateShort();
  
}
declare namespace wx {
    function getSystemInfoSync(): any;
    function request(any):void;
    function connectSocket(any):void;
    function getNetworkType(any);
    function onNetworkStatusChange(callback: Function);
    function onMemoryWarning(callback: Function);
    function shareAppMessage(data:any);
    function createBannerAd(data:any)
    function createRewardedVideoAd(data:any)
    function onShareAppMessage(func:Function);
    function showShareMenu(obj);
    function createInterstitialAd(obj)
    function wladGetAds(num,func:Function);
    function updateShareMenu(obj);
    function getShareInfo(obj)
    function setStorageSync(obj,data)
    function getStorageSync(obj)
    function clearStorageSync();
    function removeStorageSync(key)
    function previewImage(obj)
    function navigateToMiniProgram(obj)
    function getLaunchOptionsSync();
    function onShow(fun:Function)
    function getOpenDataContext();
    function vibrateShort();
}

declare namespace qg{
    function getSystemInfoSync():any;
    function createRewardedVideoAd(obj);
    function createBannerAd(obj)
    function createInterstitialAd(obj)
    function vibrateShort();
}

declare class AdvOTImage{
    static start(func:Function);
    static change(func:Function);
    static navigateToMiniProgram();
}

// declare namespace msgpack{
//     function decode(str: Uint8Array):any;
//     function encode(str): any;
// }
declare function require(moduleName: string): any;	

declare module dcodeIO{
    module ByteBuffer{
        function allocate(number ?:number):any;
        function wrap(buffer:any):any;
    }
    
}

declare module pako{
    function inflate(a):any;
}

declare namespace jsb{
   export class AssetsManager{

    }
}

