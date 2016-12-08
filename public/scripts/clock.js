 function startTime() {
      var today = new Date();
      var start = new Date(today.getUTCFullYear(), 0, 0);
      var diff = today - start;
      var h = today.getUTCHours();
      var m = today.getUTCMinutes();
      var s = today.getUTCSeconds();
      var days = Math.floor(diff/(1000*60*60*24));
      h = checkTime(h);
      m = checkTime(m);
      s = checkTime(s);
      document.getElementById('txt').innerHTML =
      days + "." + h + ":" + m + ":" + s + " " + "UTC";
      var t = setTimeout(startTime, 500);
    }
    function checkTime(i) {
        if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
        return i;
      }