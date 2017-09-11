app
.factory('datastatesService', function() { 

    var colorObj = {
            colorAlarm:"red",
            colorCaution:"orange",
            colorHealthy:"green",
        };

    var colorValues = {
        alarmcolor : {color:'#FF0000'},
        cautioncolor : {color:'#FF6D00'},
        stalecolor : {color:'#71A5BC'},
        healthycolor : {color:'#12C700'},
        disconnectedcolor :{color:'#CFCFD5'},
        defaultcolor :{color:'#000000'}
    }

    var colorBoundObj = {
        alarm:{
            color:"#FF0000",
            alert:"ALARM",
            bound:"",
        },
        caution:{
            color:"#FFFF00",
            alert:"CAUTION",
            bound:""
        },
        healthy:{
            color:"#12C700",
            alert:"",
            bound:"NORMAL"
        }
    }

   function getDataColor(alowValue,ahighValue,dataValue,wlowValue,whighValue,valueType){
        var aLowVal,aHighVal,dataVal,wLowVal,wHighVal;
        if(valueType === "number"){
            aLowVal = parseFloat(alowValue);
            aHighVal = parseFloat(ahighValue);
            dataVal = parseFloat(dataValue);
            wLowVal = parseFloat(wlowValue);
            wHighVal = parseFloat(whighValue);
        }else {
            aLowVal = new Date(alowValue);
            aHighVal = new Date(ahighValue);
            dataVal = new Date(dataValue);
            wLowVal = new Date(wlowValue);
            wHighVal = new Date(whighValue);  
        }

        if(alowValue !== null && ahighValue !== null && wlowValue !== null && whighValue !== null){
            if(dataVal < aLowVal || dataVal > aHighVal){
                return colorObj.colorAlarm;
            }else if(dataVal < wLowVal || dataVal >wHighVal){
                return colorObj.colorCaution;
            }else {
                return colorObj.colorHealthy;
            }
        }else if(alowValue === null && ahighValue === null && wlowValue === null && whighValue === null){
            return colorObj.colorHealthy;
        }else if(alowValue === null || ahighValue === null || wlowValue === null || whighValue === null){
            if(alowValue !== null && ahighValue === null && wlowValue === null && whighValue === null){
                if(dataVal < aLowVal ){
                    return colorObj.colorAlarm;
                }else {
                    return colorObj.colorHealthy;
                }
            } else if(alowValue === null && ahighValue !== null && wlowValue === null && whighValue === null){
                if(dataVal > aHighVal ){
                    return colorObj.colorAlarm;
                }else {
                    return colorObj.colorHealthy;
                }
            }else if(alowValue === null && ahighValue === null && wlowValue !== null && whighValue === null){
                if(dataVal < wLowVal ){
                    return colorObj.colorCaution;
                }else {
                    return colorObj.colorHealthy;
                }
            }else if(alowValue ===  null && ahighValue === null && wlowValue === null && whighValue !== null){
                if(dataVal > wHighVal ){
                    return colorObj.colorCaution;
                }else {
                    colorObj.colorHealthy;
                }
            }else if(alowValue !==  null && ahighValue !== null && wlowValue === null && whighValue === null){
                if(dataVal < aLowVal || dataVal > aHighVal){
                    return colorObj.colorAlarm;
                }else {
                    return colorObj.colorHealthy;
                }
            }else if(alowValue !==  null && ahighValue === null && wlowValue !== null && whighValue === null){
                if(dataVal < aLowVal){
                    return colorObj.colorAlarm;
                }else if(dataVal< wLowVal){
                    return colorObj.colorCaution;
                }else {
                    return colorObj.colorHealthy;
                }
            }else if(alowValue ===  null && ahighValue !== null && wlowValue === null && whighValue !== null){
                if(dataVal > aHighVal){
                    return colorObj.colorAlarm;
                }else if(dataVal > wHighVal){
                    return colorObj.colorCaution;
                }else {
                    return colorObj.colorHealthy;
                }
            }else if(alowValue === null && ahighValue === null && wlowValue !== null && whighValue !== null){
                if(dataVal < wLowVal || dataVal > wHighVal){
                    return colorObj.colorCaution;
                }else {
                    return colorObj.colorHealthy;
            }
            }else {
                colorObj.colorHealthy;
            }
        }else {
            colorObj.colorHealthy;
        }
    }


    function getDataColorBound(alowValue,ahighValue,dataValue,wlowValue,whighValue,valueType){
        var aLowVal,aHighVal,dataVal,wLowVal,wHighVal;

        if(valueType === "number"){
            aLowVal = parseFloat(alowValue);
            aHighVal = parseFloat(ahighValue);
            dataVal = parseFloat(dataValue);
            wLowVal = parseFloat(wlowValue);
            wHighVal = parseFloat(whighValue);

        }else {
            aLowVal = new Date(alowValue);
            aHighVal = new Date(ahighValue);
            dataVal = new Date(dataValue);
            wLowVal = new Date(wlowValue);
            wHighVal = new Date(whighValue);  
        }

        if(alowValue !== null && ahighValue !== null && wlowValue !== null && whighValue !== null){
            if(dataVal < aLowVal || dataVal > aHighVal){
                if(dataVal < aLowVal && dataVal < aHighVal){
                   colorBoundObj.alarm.bound = "LOW"; 
                }else if(dataVal > aHighVal && dataVal > aLowVal){
                   colorBoundObj.alarm.bound = "HIGH";
                }
                return colorBoundObj.alarm;
            }else if(dataVal < wLowVal || dataVal > wHighVal){
                if(dataVal < wLowVal && dataVal < wHighVal){
                    colorBoundObj.caution.bound = "LOW";   
                }else if(dataVal > wHighVal && dataVal > wLowVal ){
                    colorBoundObj.caution.bound = "HIGH";  
                }
                return colorBoundObj.caution;
            }else {
                return colorBoundObj.healthy;
            }
        }else if(alowValue === null && ahighValue === null && wlowValue === null && whighValue === null){
            return colorBoundObj.healthy;
        }else if(alowValue === null || ahighValue === null || wlowValue === null || whighValue === null){
            if(alowValue !== null && ahighValue === null && wlowValue === null && whighValue === null){
                if(dataVal < aLowVal ){
                    colorBoundObj.alarm.bound = "LOW"; 
                    return colorBoundObj.alarm;
                }else {
                    return colorBoundObj.healthy;
                }
            } else if(alowValue === null && ahighValue !== null && wlowValue === null && whighValue === null){
                if(dataVal > aHighVal ){
                    colorBoundObj.alarm.bound = "HIGH";
                    return colorBoundObj.alarm;
                }else {
                    return colorBoundObj.healthy;
                }
            }else if(alowValue === null && ahighValue === null && wlowValue !== null && whighValue === null){
                if(dataVal < wLowVal ){
                    colorBoundObj.caution.bound = "LOW";
                    return colorBoundObj.caution;
                }else {
                    return colorBoundObj.healthy;
                }
            }else if(alowValue ===  null && ahighValue === null && wlowValue === null && whighValue !== null){
                if(dataVal > wHighVal ){
                    colorBoundObj.caution.bound = "HIGH"; 
                    return colorBoundObj.caution;
                }else {
                    colorBoundObj.healthy;
                }
            }else if(alowValue !==  null && ahighValue !== null && wlowValue === null && whighValue === null){
                if(dataVal < aLowVal || dataVal > aHighVal){
                    if(dataVal < aLowVal && dataVal < aHighVal){
                        colorBoundObj.alarm.bound = "LOW"; 
                    }else if(dataVal > aHighVal && dataVal > aLowVal){
                        colorBoundObj.alarm.bound = "HIGH";
                    }
                    return colorBoundObj.alarm;
                }else {
                    return colorBoundObj.healthy;
                }
            }else if(alowValue !==  null && ahighValue === null && wlowValue !== null && whighValue === null){
                if(dataVal < aLowVal){
                    colorBoundObj.alarm.bound = "LOW"; 
                    return colorBoundObj.alarm;
                }else if(dataVal< wLowVal){
                    colorBoundObj.caution.bound = "LOW";
                    return colorBoundObj.caution;
                }else {
                    return colorBoundObj.healthy;
                }
            }else if(alowValue ===  null && ahighValue !== null && wlowValue === null && whighValue !== null){
                if(dataVal > aHighVal){
                    colorBoundObj.alarm.bound = "HIGH";
                    return colorBoundObj.alarm;
                }else if(dataVal > wHighVal){
                    colorBoundObj.caution.bound = "HIGH"; 
                    return colorBoundObj.caution;
                }else {
                    return colorBoundObj.healthy;
                }
            }else if(alowValue === null && ahighValue === null && wlowValue !== null && whighValue !== null){
                if(dataVal < wLowVal || dataVal > wHighVal){
                    if(dataVal < wLowVal && dataVal < wHighVal){
                        colorBoundObj.caution.bound = "LOW";   
                    }else if(dataVal > wHighVal && dataVal > wLowVal ){
                        colorBoundObj.caution.bound = "HIGH";  
                    }
                    return colorBoundObj.caution;
                }else {
                    return colorBoundObj.healthy;
                }
            }else {
                colorBoundObj.healthy;
            }
        }else {
            colorBoundObj.healthy;
        }
    }

	return {
        getDataColor : getDataColor,
        colorValues : colorValues,
        colorBoundObj : colorBoundObj,
        getDataColorBound : getDataColorBound
	}
});