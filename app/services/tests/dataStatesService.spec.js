describe('Testing datastatesService', function () {
    var datastatesService;

    beforeEach(function () {
        // load the module
        module('app');

        // get your service
        inject(function (_datastatesService_) {
            datastatesService = _datastatesService_;
        });
    });

    //datastatesService should exist in the application
    it('should define datastatesService', function() {
    	expect(datastatesService).toBeDefined();
    });

    it('should define the default value for colorValues', function() {
        var colorValues = {
            alarmcolor : {color:'#FF0000'},
            cautioncolor : {color:'#FF6D00'},
            stalecolor : {color:'#71A5BC'},
            healthycolor : {color:'#12C700'},
            disconnectedcolor :{color:'#CFCFD5'},
            defaultcolor :{color:'#000000'}
        }
        expect(datastatesService.colorValues).toBeDefined();
        expect(datastatesService.colorValues).toEqual(colorValues);
    });

    it('should define the default value for colorBoundObj', function() {
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
        expect(datastatesService.colorBoundObj).toBeDefined();
        expect(datastatesService.colorBoundObj).toEqual(colorBoundObj);
    });

    it('should define the function getDataColor', function () {
        expect(datastatesService.getDataColor).toBeDefined();
    });

    it('should return green color when data is in bound', function () {
        var alowValue = 0,
            ahighValue = 1.1,
            dataValue = 0.5,
            wlowValue = 0.1,
            whighValue = 1,
            valueType = 'number';

        expect(datastatesService.getDataColor(alowValue,ahighValue,dataValue,wlowValue,whighValue,valueType))
            .toEqual('green');
    });

    it('should return orange color when data is in warning zone', function () {
        var alowValue = 0,
            ahighValue = 1.1,
            dataValue = 1.05,
            wlowValue = 0.1,
            whighValue = 1,
            valueType = 'number';

        expect(datastatesService.getDataColor(alowValue,ahighValue,dataValue,wlowValue,whighValue,valueType))
            .toEqual('orange');
    });

    it('should return red color when data is in alarm zone', function () {
        var alowValue = 0,
            ahighValue = 1.1,
            dataValue = -1.05,
            wlowValue = 0.1,
            whighValue = 1,
            valueType = 'number';

        expect(datastatesService.getDataColor(alowValue,ahighValue,dataValue,wlowValue,whighValue,valueType))
            .toEqual('red');
    });

    it('should return green color when there are no alarm and warning values', function () {
        var alowValue = null,
            ahighValue = null,
            dataValue = 0.5,
            wlowValue = null,
            whighValue = null,
            valueType = 'number';

        expect(datastatesService.getDataColor(alowValue,ahighValue,dataValue,wlowValue,whighValue,valueType))
            .toEqual('green');
    });

    it('should return green color when there is just alarm low value and data is in bound', function () {
        var alowValue = 0,
            ahighValue = null,
            dataValue = 0.5,
            wlowValue = null,
            whighValue = null,
            valueType = 'number';

        expect(datastatesService.getDataColor(alowValue,ahighValue,dataValue,wlowValue,whighValue,valueType))
            .toEqual('green');
    });

    it('should return red color when there is just alarm low value and data is not in bound', function () {
        var alowValue = 0,
            ahighValue = null,
            dataValue = -0.5,
            wlowValue = null,
            whighValue = null,
            valueType = 'number';

        expect(datastatesService.getDataColor(alowValue,ahighValue,dataValue,wlowValue,whighValue,valueType))
            .toEqual('red');
    });

    it('should return green color when there is just alarm high value and data is in bound', function () {
        var alowValue = null,
            ahighValue = 1,
            dataValue = 0.5,
            wlowValue = null,
            whighValue = null,
            valueType = 'number';

        expect(datastatesService.getDataColor(alowValue,ahighValue,dataValue,wlowValue,whighValue,valueType))
            .toEqual('green');
    });

    it('should return red color when there is just alarm high value and data is not in bound', function () {
        var alowValue = null,
            ahighValue = 1,
            dataValue = 1.5,
            wlowValue = null,
            whighValue = null,
            valueType = 'number';

        expect(datastatesService.getDataColor(alowValue,ahighValue,dataValue,wlowValue,whighValue,valueType))
            .toEqual('red');
    });

    it('should return green color when there is just warning low value and data is in bound', function () {
        var alowValue = null,
            ahighValue = null,
            dataValue = 0.5,
            wlowValue = 0.2,
            whighValue = null,
            valueType = 'number';

        expect(datastatesService.getDataColor(alowValue,ahighValue,dataValue,wlowValue,whighValue,valueType))
            .toEqual('green');
    });

    it('should return orange color when there is just warning low value and data is not in bound', function () {
        var alowValue = null,
            ahighValue = null,
            dataValue = 0.1,
            wlowValue = 0.2,
            whighValue = null,
            valueType = 'number';

        expect(datastatesService.getDataColor(alowValue,ahighValue,dataValue,wlowValue,whighValue,valueType))
            .toEqual('orange');
    });

    it('should return green color when there is just warning high value and data is in bound', function () {
        var alowValue = null,
            ahighValue = null,
            dataValue = 0.5,
            wlowValue = null,
            whighValue = 0.8,
            valueType = 'number';

        expect(datastatesService.getDataColor(alowValue,ahighValue,dataValue,wlowValue,whighValue,valueType))
            .toEqual('green');
    });

    it('should return orange color when there is just warning high value and data is not in bound', function () {
        var alowValue = null,
            ahighValue = null,
            dataValue = 1.5,
            wlowValue = null,
            whighValue = 0.8,
            valueType = 'number';

        expect(datastatesService.getDataColor(alowValue,ahighValue,dataValue,wlowValue,whighValue,valueType))
            .toEqual('orange');
    });

    it('should return green color when there are alarm high and low values and data is in bound', function () {
        var alowValue = 0,
            ahighValue = 1,
            dataValue = 0.5,
            wlowValue = null,
            whighValue = null,
            valueType = 'number';

        expect(datastatesService.getDataColor(alowValue,ahighValue,dataValue,wlowValue,whighValue,valueType))
            .toEqual('green');
    });

    it('should return red color when there are alarm high and low values and data is not in bound', function () {
        var alowValue = 0,
            ahighValue = 1,
            dataValue = 1.5,
            wlowValue = null,
            whighValue = null,
            valueType = 'number';

        expect(datastatesService.getDataColor(alowValue,ahighValue,dataValue,wlowValue,whighValue,valueType))
            .toEqual('red');
    });

    it('should return green color when there are alarm and warning low values and data is in bound', function () {
        var alowValue = 0,
            ahighValue = null,
            dataValue = 0.5,
            wlowValue = 0.1,
            whighValue = null,
            valueType = 'number';

        expect(datastatesService.getDataColor(alowValue,ahighValue,dataValue,wlowValue,whighValue,valueType))
            .toEqual('green');
    });

    it('should return orange color when there are alarm and warning low values and data is not in bound(Caution)', function () {
        var alowValue = 0,
            ahighValue = null,
            dataValue = 0.1,
            wlowValue = 0.2,
            whighValue = null,
            valueType = 'number';

        expect(datastatesService.getDataColor(alowValue,ahighValue,dataValue,wlowValue,whighValue,valueType))
            .toEqual('orange');
    });

    it('should return red color when there there are alarm and warning low values and data is not in bound(Alarm)', function () {
        var alowValue = 0,
            ahighValue = null,
            dataValue = -0.5,
            wlowValue = 0.2,
            whighValue = null,
            valueType = 'number';

        expect(datastatesService.getDataColor(alowValue,ahighValue,dataValue,wlowValue,whighValue,valueType))
            .toEqual('red');
    });

    it('should return green color when there are warning high and low values and data is in bound', function () {
        var alowValue = null,
            ahighValue = null,
            dataValue = 0.5,
            wlowValue = 0.1,
            whighValue = 0.8,
            valueType = 'number';

        expect(datastatesService.getDataColor(alowValue,ahighValue,dataValue,wlowValue,whighValue,valueType))
            .toEqual('green');
    });

    it('should return orange color when there are warning high and low values and data is not in bound', function () {
        var alowValue = null,
            ahighValue = null,
            dataValue = 0.9,
            wlowValue = 0.1,
            whighValue = 0.8,
            valueType = 'number';

        expect(datastatesService.getDataColor(alowValue,ahighValue,dataValue,wlowValue,whighValue,valueType))
            .toEqual('orange');
    });

    it('should return green color when there are alarm and warning high values and data is in bound', function () {
        var alowValue = null,
            ahighValue = 1,
            dataValue = 0.5,
            wlowValue = null,
            whighValue = 0.8,
            valueType = 'number';

        expect(datastatesService.getDataColor(alowValue,ahighValue,dataValue,wlowValue,whighValue,valueType))
            .toEqual('green');
    });

    it('should return orange color when there are alarm and warning high values and data is not in bound(Caution)', function () {
        var alowValue = null,
            ahighValue = 1,
            dataValue = 0.9,
            wlowValue = null,
            whighValue = 0.8,
            valueType = 'number';

        expect(datastatesService.getDataColor(alowValue,ahighValue,dataValue,wlowValue,whighValue,valueType))
            .toEqual('orange');
    });

    it('should return red color when there there are alarm and warning high values and data is not in bound(Alarm)', function () {
        var alowValue = null,
            ahighValue = 1,
            dataValue = 1.5,
            wlowValue = null,
            whighValue = 0.8,
            valueType = 'number';

        expect(datastatesService.getDataColor(alowValue,ahighValue,dataValue,wlowValue,whighValue,valueType))
            .toEqual('red');
    });

    it('should define the function getDataColorBound', function () {
        expect(datastatesService.getDataColorBound).toBeDefined();
    });

    it('should return healthy object when data is in bound', function () {
        var alowValue = 0,
            ahighValue = 1.1,
            dataValue = 0.5,
            wlowValue = 0.1,
            whighValue = 1,
            valueType = 'number';

        expect(datastatesService.getDataColorBound(alowValue,ahighValue,dataValue,wlowValue,whighValue,valueType))
            .toEqual(datastatesService.colorBoundObj.healthy);
    });

    it('should return caution object when data is in warning zone(HIGH)', function () {
        var alowValue = 0,
            ahighValue = 1.1,
            dataValue = 1.05,
            wlowValue = 0.1,
            whighValue = 1,
            valueType = 'number';

        expect(datastatesService.getDataColorBound(alowValue,ahighValue,dataValue,wlowValue,whighValue,valueType))
            .toEqual(datastatesService.colorBoundObj.caution);
        expect(datastatesService.colorBoundObj.caution.bound).toEqual("HIGH");
    });

    it('should return caution object when data is in warning zone(LOW)', function () {
        var alowValue = 0,
            ahighValue = 1.1,
            dataValue = 0.05,
            wlowValue = 0.1,
            whighValue = 1,
            valueType = 'number';

        expect(datastatesService.getDataColorBound(alowValue,ahighValue,dataValue,wlowValue,whighValue,valueType))
            .toEqual(datastatesService.colorBoundObj.caution);
        expect(datastatesService.colorBoundObj.caution.bound).toEqual("LOW");
    });

    it('should return alarm object when data is in alarm zone(LOW)', function () {
        var alowValue = 0,
            ahighValue = 1.1,
            dataValue = -1.05,
            wlowValue = 0.1,
            whighValue = 1,
            valueType = 'number';

        expect(datastatesService.getDataColorBound(alowValue,ahighValue,dataValue,wlowValue,whighValue,valueType))
            .toEqual(datastatesService.colorBoundObj.alarm);
        expect(datastatesService.colorBoundObj.alarm.bound).toEqual("LOW");
    });

    it('should return alarm object when data is in alarm zone(HIGH)', function () {
        var alowValue = 0,
            ahighValue = 1.1,
            dataValue = 1.15,
            wlowValue = 0.1,
            whighValue = 1,
            valueType = 'number';

        expect(datastatesService.getDataColorBound(alowValue,ahighValue,dataValue,wlowValue,whighValue,valueType))
            .toEqual(datastatesService.colorBoundObj.alarm);
        expect(datastatesService.colorBoundObj.alarm.bound).toEqual("HIGH");
    });

    it('should return healthy object when there are no alarm and warning values', function () {
        var alowValue = null,
            ahighValue = null,
            dataValue = 0.5,
            wlowValue = null,
            whighValue = null,
            valueType = 'number';

        expect(datastatesService.getDataColorBound(alowValue,ahighValue,dataValue,wlowValue,whighValue,valueType))
            .toEqual(datastatesService.colorBoundObj.healthy);
    });

    it('should return healthy object when there is just alarm low value and data is in bound', function () {
        var alowValue = 0,
            ahighValue = null,
            dataValue = 0.5,
            wlowValue = null,
            whighValue = null,
            valueType = 'number';

        expect(datastatesService.getDataColorBound(alowValue,ahighValue,dataValue,wlowValue,whighValue,valueType))
            .toEqual(datastatesService.colorBoundObj.healthy);
    });

    it('should return alarm object when there is just alarm low value and data is not in bound', function () {
        var alowValue = 0,
            ahighValue = null,
            dataValue = -0.5,
            wlowValue = null,
            whighValue = null,
            valueType = 'number';

        expect(datastatesService.getDataColorBound(alowValue,ahighValue,dataValue,wlowValue,whighValue,valueType))
            .toEqual(datastatesService.colorBoundObj.alarm);
        expect(datastatesService.colorBoundObj.alarm.bound).toEqual("LOW");
    });

    it('should return healthy object when there is just alarm high value and data is in bound', function () {
        var alowValue = null,
            ahighValue = 1,
            dataValue = 0.5,
            wlowValue = null,
            whighValue = null,
            valueType = 'number';

        expect(datastatesService.getDataColorBound(alowValue,ahighValue,dataValue,wlowValue,whighValue,valueType))
            .toEqual(datastatesService.colorBoundObj.healthy);
    });

    it('should return alarm object when there is just alarm high value and data is not in bound', function () {
        var alowValue = null,
            ahighValue = 1,
            dataValue = 1.5,
            wlowValue = null,
            whighValue = null,
            valueType = 'number';

        expect(datastatesService.getDataColorBound(alowValue,ahighValue,dataValue,wlowValue,whighValue,valueType))
            .toEqual(datastatesService.colorBoundObj.alarm);
        expect(datastatesService.colorBoundObj.alarm.bound).toEqual("HIGH");
    });

    it('should return healthy object when there is just warning low value and data is in bound', function () {
        var alowValue = null,
            ahighValue = null,
            dataValue = 0.5,
            wlowValue = 0.2,
            whighValue = null,
            valueType = 'number';

        expect(datastatesService.getDataColorBound(alowValue,ahighValue,dataValue,wlowValue,whighValue,valueType))
            .toEqual(datastatesService.colorBoundObj.healthy);
    });

    it('should return caution object when there is just warning low value and data is not in bound', function () {
        var alowValue = null,
            ahighValue = null,
            dataValue = 0.1,
            wlowValue = 0.2,
            whighValue = null,
            valueType = 'number';

        expect(datastatesService.getDataColorBound(alowValue,ahighValue,dataValue,wlowValue,whighValue,valueType))
            .toEqual(datastatesService.colorBoundObj.caution);
        expect(datastatesService.colorBoundObj.caution.bound).toEqual("LOW");
    });

    it('should return healthy object when there is just warning high value and data is in bound', function () {
        var alowValue = null,
            ahighValue = null,
            dataValue = 0.5,
            wlowValue = null,
            whighValue = 0.8,
            valueType = 'number';

        expect(datastatesService.getDataColorBound(alowValue,ahighValue,dataValue,wlowValue,whighValue,valueType))
            .toEqual(datastatesService.colorBoundObj.healthy);
    });

    it('should return caution object when there is just warning high value and data is not in bound', function () {
        var alowValue = null,
            ahighValue = null,
            dataValue = 1.5,
            wlowValue = null,
            whighValue = 0.8,
            valueType = 'number';

        expect(datastatesService.getDataColorBound(alowValue,ahighValue,dataValue,wlowValue,whighValue,valueType))
            .toEqual(datastatesService.colorBoundObj.caution);
        expect(datastatesService.colorBoundObj.caution.bound).toEqual("HIGH");
    });

    it('should return healthy object when there are alarm high and low values and data is in bound', function () {
        var alowValue = 0,
            ahighValue = 1,
            dataValue = 0.5,
            wlowValue = null,
            whighValue = null,
            valueType = 'number';

        expect(datastatesService.getDataColorBound(alowValue,ahighValue,dataValue,wlowValue,whighValue,valueType))
            .toEqual(datastatesService.colorBoundObj.healthy);
    });

    it('should return alarm object when there are alarm high and low values and data is not in bound(HIGH)', function () {
        var alowValue = 0,
            ahighValue = 1,
            dataValue = 1.5,
            wlowValue = null,
            whighValue = null,
            valueType = 'number';

        expect(datastatesService.getDataColorBound(alowValue,ahighValue,dataValue,wlowValue,whighValue,valueType))
            .toEqual(datastatesService.colorBoundObj.alarm);
        expect(datastatesService.colorBoundObj.alarm.bound).toEqual("HIGH");
    });

    it('should return alarm object when there are alarm high and low values and data is not in bound(LOW)', function () {
        var alowValue = 0,
            ahighValue = 1,
            dataValue = -1.5,
            wlowValue = null,
            whighValue = null,
            valueType = 'number';

        expect(datastatesService.getDataColorBound(alowValue,ahighValue,dataValue,wlowValue,whighValue,valueType))
            .toEqual(datastatesService.colorBoundObj.alarm);
        expect(datastatesService.colorBoundObj.alarm.bound).toEqual("LOW");
    });

    it('should return healthy object when there are alarm and warning low values and data is in bound', function () {
        var alowValue = 0,
            ahighValue = null,
            dataValue = 0.5,
            wlowValue = 0.1,
            whighValue = null,
            valueType = 'number';

        expect(datastatesService.getDataColorBound(alowValue,ahighValue,dataValue,wlowValue,whighValue,valueType))
            .toEqual(datastatesService.colorBoundObj.healthy);
    });

    it('should return caution object when there are alarm and warning low values and data is not in bound(Low)', function () {
        var alowValue = 0,
            ahighValue = null,
            dataValue = 0.1,
            wlowValue = 0.2,
            whighValue = null,
            valueType = 'number';

        expect(datastatesService.getDataColorBound(alowValue,ahighValue,dataValue,wlowValue,whighValue,valueType))
            .toEqual(datastatesService.colorBoundObj.caution);
        expect(datastatesService.colorBoundObj.caution.bound).toEqual("LOW");
    });

    it('should return alarm object when there there are alarm and warning low values and data is not in bound(Low)', function () {
        var alowValue = 0,
            ahighValue = null,
            dataValue = -0.5,
            wlowValue = 0.2,
            whighValue = null,
            valueType = 'number';

        expect(datastatesService.getDataColorBound(alowValue,ahighValue,dataValue,wlowValue,whighValue,valueType))
            .toEqual(datastatesService.colorBoundObj.alarm);
        expect(datastatesService.colorBoundObj.alarm.bound).toEqual("LOW");
    });

    it('should return healthy object when there are warning high and low values and data is in bound', function () {
        var alowValue = null,
            ahighValue = null,
            dataValue = 0.5,
            wlowValue = 0.1,
            whighValue = 0.8,
            valueType = 'number';

        expect(datastatesService.getDataColorBound(alowValue,ahighValue,dataValue,wlowValue,whighValue,valueType))
            .toEqual(datastatesService.colorBoundObj.healthy);
    });

    it('should return caution object when there are warning high and low values and data is not in bound(HIGH)', function () {
        var alowValue = null,
            ahighValue = null,
            dataValue = 0.9,
            wlowValue = 0.1,
            whighValue = 0.8,
            valueType = 'number';

        expect(datastatesService.getDataColorBound(alowValue,ahighValue,dataValue,wlowValue,whighValue,valueType))
            .toEqual(datastatesService.colorBoundObj.caution);
        expect(datastatesService.colorBoundObj.caution.bound).toEqual("HIGH");
    });

    it('should return caution object when there are warning high and low values and data is not in bound(LOW)', function () {
        var alowValue = null,
            ahighValue = null,
            dataValue = 0.05,
            wlowValue = 0.1,
            whighValue = 0.8,
            valueType = 'number';

        expect(datastatesService.getDataColorBound(alowValue,ahighValue,dataValue,wlowValue,whighValue,valueType))
            .toEqual(datastatesService.colorBoundObj.caution);
        expect(datastatesService.colorBoundObj.caution.bound).toEqual("LOW");
    });

    it('should return healthy object when there are alarm and warning high values and data is in bound', function () {
        var alowValue = null,
            ahighValue = 1,
            dataValue = 0.5,
            wlowValue = null,
            whighValue = 0.8,
            valueType = 'number';

        expect(datastatesService.getDataColorBound(alowValue,ahighValue,dataValue,wlowValue,whighValue,valueType))
            .toEqual(datastatesService.colorBoundObj.healthy);
    });

    it('should return caution object when there are alarm and warning high values and data is not in bound(HIGH)', function () {
        var alowValue = null,
            ahighValue = 1,
            dataValue = 0.9,
            wlowValue = null,
            whighValue = 0.8,
            valueType = 'number';

        expect(datastatesService.getDataColorBound(alowValue,ahighValue,dataValue,wlowValue,whighValue,valueType))
            .toEqual(datastatesService.colorBoundObj.caution);
        expect(datastatesService.colorBoundObj.caution.bound).toEqual("HIGH");
    });

    it('should return alarm object when there there are alarm and warning high values and data is not in bound(HIGH)', function () {
        var alowValue = null,
            ahighValue = 1,
            dataValue = 1.5,
            wlowValue = null,
            whighValue = 0.8,
            valueType = 'number';

        expect(datastatesService.getDataColorBound(alowValue,ahighValue,dataValue,wlowValue,whighValue,valueType))
            .toEqual(datastatesService.colorBoundObj.alarm);
        expect(datastatesService.colorBoundObj.alarm.bound).toEqual("HIGH");
    });
 
});