//===============================================================================
// © 2018 Optipro.  All rights reserved.
// Original Author: Shashank Jain
// Original Date: 10 March 2018
//==============================================================================

import * as $ from "jquery";

export  class UIHelper{

    // Apply class on the basis of device
    public static deviceClass(){
        let getDeviceWidth = screen.width;
    }

    // check is it mobile or not
    public static isDevice(){ 
        let isMobile:boolean;
        let isIpad:boolean;
        let isDesktop:boolean;

        let getDeviceWidth = screen.width;
        
        if(getDeviceWidth <= 767){
            isMobile = true;
            isIpad = false;
            isDesktop = false;
            document.getElementsByTagName("body")[0].classList.add('body_mobile'); 
        }else if(getDeviceWidth > 767 && getDeviceWidth <= 1023){
            isMobile = false; 
            isIpad = true;
            isDesktop = false;
            document.getElementsByTagName("body")[0].classList.add('body_ipad'); 
        }else{
            isMobile = false; 
            isIpad = false;
            isDesktop = true;
            document.getElementsByTagName("body")[0].classList.add('body_desktop'); 
        }
        // return isMobile;
        // return isIpad;
        // return isDesktop;

        return [isMobile, isIpad, isDesktop];
    }

    // get main content height for mobile and desktop
    public static getMainContentHeight(){
        // let mainContenntHeight:number;
        // if(UIHelper.isMobile()==false){ 
        //     mainContenntHeight = window.innerHeight-85;
        // }else{
        //     mainContenntHeight = window.innerHeight-85
        // }
        // return mainContenntHeight;
    }
}
