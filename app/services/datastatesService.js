app
.factory('datastatesService', function() { 

    var colorObj = {
            colorAlarm:"red",
            colorCaution:"orange",
            colorHealthy:"green",
        };

    var colorValues = {
        alarmcolor : "color:#FF0000",
        cautioncolor : "color:#FF6D00",
        stalecolor : "color:#71A5BC",
        healthycolor : "color:#12C700",
        disconnectedcolor :"color:#CFCFD5",
        defaultcolor :"color:#000000"
    }

   function getDataColor(alowValue,ahighValue,dataValue,wlowValue,whighValue,valueType){
        var aLowVal,aHighVal,dataVal,wLowVal,wHighVal;

        if(valueType === "number"){
            aLowVal = alowValue;
            aHighVal = ahighValue;
            dataVal = dataValue;
            wLowVal = wlowValue;
            wHighVal = whighValue;
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

	return {
        getDataColor : getDataColor,
        colorValues : colorValues
	}
});