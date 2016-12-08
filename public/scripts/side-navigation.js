     function openNav() {

       
       var mq = window.matchMedia( "(max-width: 375px)" );

        if(mq.matches){ // works for iphone 6
          document.getElementById("mySidenav").style.width = "100%";
        document.getElementById("main").style.marginLeft = "100%";
        }
        else {
        document.getElementById("mySidenav").style.width = "18%";
        document.getElementById("main").style.marginLeft = "18%";

      }
      }

      function closeNav() {

        document.getElementById("mySidenav").style.width = "0";
        document.getElementById("main").style.marginLeft= "0";

      }

      function openrightNav() {

        var mq = window.matchMedia( "(max-width: 375px)" );
                if(mq.matches){ 
          document.getElementById("myrightSidenav").style.width = "100%";
        document.getElementById("main").style.marginRight = "100%";


        }
        else{

        document.getElementById("myrightSidenav").style.width = "18%";
        document.getElementById("main").style.marginRight = "18%";
        document.getElementById("add-widget").style.display = 'none';
        document.getElementById("username").style.display = 'none';


      }
      }

      function closerightNav() {

        document.getElementById("myrightSidenav").style.width = "0";
        document.getElementById("main").style.marginRight= "0";
         document.getElementById("add-widget").style.display = 'inline-block';
          document.getElementById("username").style.display = 'inline-block';
         
      }
