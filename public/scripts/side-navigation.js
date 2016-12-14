       

      /* Global variables to define mobile and tablet widths and height*/
       var mq = window.matchMedia( "(max-width: 375px)" );
       var mq_nexus_5x = window.matchMedia("(max-width: 412px)");
       var iphone6pluspotrait = window.matchMedia("(max-width: 414px)");
       var mq_galaxy_landscape = window.matchMedia("(max-width: 640px)");
       var mq_height = window.matchMedia("(max-height: 360px)");
       var mq_nexus_landscape = window.matchMedia("(max-width: 732px)");
       var mq_nexus_landscape_height = window.matchMedia("(max-height: 412px)");
       var mq_nexus5_landscape = window.matchMedia("(max-width: 640px)");
       var mq_nexus5_landscape_height = window.matchMedia("(max-height: 360px)");
       var mq_iphone4_landscape = window.matchMedia("(max-width: 480px)");
       var mq_iphone4_landscape_height = window.matchMedia("(max-height: 320px)");
       var mq_iphone5_landscape = window.matchMedia("(max-width: 568px)");
       var mq_iphone5_landscape_height = window.matchMedia("(max-height: 320px)");
       var mq_iphone6_landscape = window.matchMedia("(max-width: 667px)");
       var mq_iphone6_landscape_height = window.matchMedia("(max-height: 375px)");
       var mq_iphone6plus_landscape = window.matchMedia("(max-width: 736px)");
       var mq_iphone6plus_landscape_height = window.matchMedia("(max-height: 414px)");
       var mq_iphone6plus_landscape = window.matchMedia("(max-width: 736px)");
       var mq_iphone6plus_landscape_height = window.matchMedia("(max-height: 414px)");
       var mq_ipad = window.matchMedia("(max-width: 768px)");
       var mq_mozilla = window.matchMedia("(max-width: 800px)");
       var mq_ipad_landscape = window.matchMedia("(max-width: 1024px");
       var mq_ipad_pro = window.matchMedia("(max-width: 1024px)");
       var mq_ipad_landscape = window.matchMedia("(max-width: 1366px)");
       var lg_optimus_width = window.matchMedia("(max-width: 640px)");
       var lg_optimus_height = window.matchMedia("(max-height: 384px)");


     function openLeftNav() {
        if(mq.matches || mq_nexus_5x.matches || iphone6pluspotrait.matches ){ 
          document.getElementById("s-icons").style.display = 'none';
          document.getElementById("mySidenav").style.width = "100%";
          document.getElementById("main").style.marginLeft = "100%";
          document.getElementById("rclosebtn").style.fontSize ="21px";
          document.getElementById("main-img").src = '/media/logos/Quindar_Icon_Black.svg';
        }
        else if(mq_iphone4_landscape.matches && mq_iphone4_landscape_height.matches && window.matchMedia("(orientation: landscape)").matches){
         document.getElementById("mySidenav").style.width = "45%";
         document.getElementById("main").style.marginLeft = "45%";
         document.getElementById("mySidenav").style.height = "100%";
         document.getElementById("closebtn").style.width = "100%";
         document.getElementById("closebtn").style.height = "100%";
         document.getElementById("closebtn").style.top = "-14px";
         document.getElementById("closebtn").style.right = "-154px";
         document.getElementById("closebtn").style.fontSize = "21px";
          document.getElementById("main-img").src = "/media/logos/Quindar_Icon_Black.svg";
       }
        else if(mq_iphone5_landscape.matches && mq_iphone5_landscape_height.matches && window.matchMedia("(orientation: landscape)").matches){
         document.getElementById("mySidenav").style.width = "37%";
         document.getElementById("main").style.marginLeft = "37%";
         document.getElementById("mySidenav").style.height = "100%";
         document.getElementById("closebtn").style.width = "100%";
         document.getElementById("closebtn").style.height = "100%";
         document.getElementById("closebtn").style.top = "-14px";
         document.getElementById("closebtn").style.right = "-154px";
         document.getElementById("closebtn").style.fontSize = "21px";
          document.getElementById("main-img").src = "/media/logos/Quindar_Icon_Black.svg";
       }
       else if(mq_nexus5_landscape.matches && mq_nexus5_landscape_height.matches && window.matchMedia("(orientation: landscape)").matches){
         document.getElementById("mySidenav").style.width = "38%";
         document.getElementById("main").style.marginLeft = "38%";
         document.getElementById("mySidenav").style.height = "100%";
         document.getElementById("closebtn").style.width = "100%";
         document.getElementById("closebtn").style.height = "100%";
         document.getElementById("closebtn").style.top = "-10px";
         document.getElementById("closebtn").style.right = "-180px";
         document.getElementById("closebtn").style.fontSize = "21px";
          document.getElementById("main-img").src = "/media/logos/Quindar_Icon_Black.svg";
       }
       else if(mq_galaxy_landscape.matches && mq_height.matches && window.matchMedia("(orientation: landscape)").matches){
         document.getElementById("mySidenav").style.width = "40%";
         document.getElementById("main").style.marginLeft = "40%";
         document.getElementById("mySidenav").style.height = "100%";
         document.getElementById("closebtn").style.width = "100%";
         document.getElementById("closebtn").style.height = "100%";
         document.getElementById("closebtn").style.top ="-14px";
         document.getElementById("closebtn").style.right ="-204px";
         document.getElementById("closebtn").style.fontSize ="21px";
          document.getElementById("main-img").src = "/media/logos/Quindar_Icon_Black.svg";
       }
       else if(mq_nexus_landscape.matches && mq_nexus_landscape_height.matches && window.matchMedia("(orientation: landscape)").matches){
         document.getElementById("mySidenav").style.width = "40%";
         document.getElementById("main").style.marginLeft = "40%";
         document.getElementById("mySidenav").style.height = "100%";
         document.getElementById("closebtn").style.width = "100%";
         document.getElementById("closebtn").style.height = "100%";
         document.getElementById("closebtn").style.top = "-14px";
         document.getElementById("closebtn").style.right = "-204px";
         document.getElementById("closebtn").style.fontSize = "21px";
          document.getElementById("main-img").src = "/media/logos/Quindar_Icon_Black.svg";
       }
       else if(mq_iphone6plus_landscape.matches && mq_iphone6plus_landscape_height.matches && window.matchMedia("(orientation: landscape)").matches){
         document.getElementById("mySidenav").style.width = "35%";
         document.getElementById("main").style.marginLeft = "35%";
         document.getElementById("mySidenav").style.height = "100%";
         document.getElementById("closebtn").style.width = "100%";
         document.getElementById("closebtn").style.height = "100%";
         document.getElementById("closebtn").style.top = "-14px";
         document.getElementById("closebtn").style.right = "-204px";
         document.getElementById("closebtn").style.fontSize = "21px";
         document.getElementById("main-img").src = "/media/logos/Quindar_Icon_Black.svg";
       }
       else if(mq_ipad.matches){
          document.getElementById("top-header").style.display = 'none';
         document.getElementById("mySidenav").style.width = "100%";
         document.getElementById("main").style.marginLeft = "100%";
         document.getElementById("searchbar").style.width = "595px";
         document.getElementById("closebtn").style.fontSize ="21px";
       }
       else if(mq_mozilla.matches){
         document.getElementById("mySidenav").style.width = "100%";
         document.getElementById("main").style.marginLeft = "100%";
         document.getElementById("searchbar").style.width = "595px";
         document.getElementById("closebtn").style.fontSize ="21px";
       }

      else if(mq_ipad_landscape.matches && window.matchMedia("(orientation: landscape)").matches){
         document.getElementById("mySidenav").style.width = "30%";
         document.getElementById("main").style.marginLeft = "30%";
         document.getElementById("closebtn").style.fontSize ="21px";
          document.getElementById("QRegular").style.display = 'none';
       }
       else if(mq_ipad_pro.matches){
         document.getElementById("mySidenav").style.width = "30%";//18%
         document.getElementById("main").style.marginLeft = "30%";//18%
         document.getElementById("QRegular").style.display = 'none';
         document.getElementById("closebtn").style.fontSize ="21px";
         document.getElementById("input-search").style.fontSize = "18px";
         document.getElementById("left-menu-item1").style.fontSize = "18px";
         document.getElementById("left-menu-item2").style.fontSize = "18px";
         document.getElementById("left-menu-item3").style.fontSize = "18px";
         document.getElementById("left-menu-item4").style.fontSize = "18px";
       }
       else {
        document.getElementById("mySidenav").style.width = "18%";//18%
        document.getElementById("main").style.marginLeft = "18%";//18%
        document.getElementById("closebtn").style.fontSize ="36px";
        document.getElementById("input-search").style.fontSize = "18px";
        document.getElementById("left-menu-item1").style.fontSize = "18px";
        document.getElementById("left-menu-item2").style.fontSize = "18px";
        document.getElementById("left-menu-item3").style.fontSize = "18px";
        document.getElementById("left-menu-item4").style.fontSize = "18px";
      }
    }

    function closeLeftNav() {
     if(mq.matches || mq_nexus_5x.matches || iphone6pluspotrait.matches ){ 
       document.getElementById("mySidenav").style.width = "0";
       document.getElementById("main").style.marginRight = "0";
       document.getElementById("s-icons").style.display = 'inline-block';
       document.getElementById("main-img").src = "/media/logos/Quindar_Icon_Black.svg";
     }
     else if(mq_galaxy_landscape.matches && window.matchMedia("(orientation: landscape)").matches){
       document.getElementById("mySidenav").style.width = "0";
       document.getElementById("main").style.marginLeft = "0";
       document.getElementById("main-img").src = "/media/logos/Quindar_Icon_Black.svg";
     }
     else if(mq_nexus_landscape.matches && window.matchMedia("(orientation: landscape)").matches){
       document.getElementById("mySidenav").style.width = "0";
       document.getElementById("main").style.marginLeft = "0";
       document.getElementById("main-img").src = "/media/logos/Quindar_Icon_Black.svg";
     }
     else if(mq_ipad.matches){
        document.getElementById("top-header").style.display = 'block';
       document.getElementById("mySidenav").style.width = "0";
       document.getElementById("main").style.marginRight = "0";
     }

      else if(mq_mozilla.matches){
       document.getElementById("s-icons").style.display = 'inline-block';
       document.getElementById("mySidenav").style.width = "0";
       document.getElementById("main").style.marginRight = "0";
     }
     else if(mq_ipad_landscape.matches && window.matchMedia("(orientation: landscape)").matches){
      document.getElementById("s-icons").style.display = 'inline-block';
       document.getElementById("mySidenav").style.width = "0";
       document.getElementById("main").style.marginRight = "0";
       document.getElementById("QRegular").style.display = 'inline-block';
     }
     else if(mq_ipad_pro.matches){
       document.getElementById("s-icons").style.display = 'inline-block';
       document.getElementById("mySidenav").style.width = "0";
       document.getElementById("main").style.marginRight = "0";
       document.getElementById("QRegular").style.display = 'inline-block';
     }

      document.getElementById("mySidenav").style.width = "0";
      document.getElementById("main").style.marginLeft= "0";
  }

  function openRightNav() {
    if(mq.matches || mq_nexus_5x.matches || iphone6pluspotrait.matches){ 
      document.getElementById("s-icons").style.display = 'none';
      document.getElementById("myrightSidenav").style.width = "100%";
      document.getElementById("main").style.marginRight = "100%";
      document.getElementById("rclosebtn").style.fontSize ="21px";
      document.getElementById("main-img").src = "/media/logos/Quindar_Icon_Black.svg";
    }
    else if(mq_iphone4_landscape.matches && mq_iphone4_landscape_height.matches && window.matchMedia("(orientation: landscape)").matches){
     document.getElementById("myrightSidenav").style.width = "45%";
     document.getElementById("main").style.marginRight = "45%";
     document.getElementById("myrightSidenav").style.height = "100%";
     document.getElementById("rclosebtn").style.width = "100%";
     document.getElementById("rclosebtn").style.height = "100%";
     document.getElementById("rclosebtn").style.top = "-9px";
     document.getElementById("rclosebtn").style.right = "-154px";
     document.getElementById("rclosebtn").style.fontSize = "21px";
     document.getElementById("main-img").src = "/media/logos/Quindar_Icon_Black.svg";
   }
    else if(mq_iphone5_landscape.matches && mq_iphone5_landscape_height.matches && window.matchMedia("(orientation: landscape)").matches){
     document.getElementById("myrightSidenav").style.width = "37%";
     document.getElementById("main").style.marginRight = "37%";
     document.getElementById("myrightSidenav").style.height = "100%";
     document.getElementById("rclosebtn").style.width = "100%";
     document.getElementById("rclosebtn").style.height = "100%";
     document.getElementById("rclosebtn").style.top = "-9px";
     document.getElementById("rclosebtn").style.right = "-154px";
     document.getElementById("rclosebtn").style.fontSize = "21px";
     document.getElementById("main-img").src = "/media/logos/Quindar_Icon_Black.svg";
   }
    else if(mq_nexus5_landscape.matches && mq_nexus5_landscape_height.matches && window.matchMedia("(orientation: landscape)").matches){
      document.getElementById("myrightSidenav").style.width = "38%";
      document.getElementById("main").style.marginRight = "38%";
      document.getElementById("myrightSidenav").style.height = "100%";
      document.getElementById("rclosebtn").style.width = "100%";
      document.getElementById("rclosebtn").style.height = "100%";
      document.getElementById("rclosebtn").style.top = "-10px";
      document.getElementById("rclosebtn").style.right = "-180px";
      document.getElementById("rclosebtn").style.fontSize = "21px";
      document.getElementById("main-img").src = "/media/logos/Quindar_Icon_Black.svg";
    }
   else if(mq_galaxy_landscape.matches && mq_height.matches && window.matchMedia("(orientation: landscape)").matches){
     document.getElementById("myrightSidenav").style.width = "40%";
     document.getElementById("main").style.marginRight = "40%";
     document.getElementById("myrightSidenav").style.height = "100%";
     document.getElementById("rclosebtn").style.width = "100%";
     document.getElementById("rclosebtn").style.height = "100%";
     document.getElementById("rclosebtn").style.top = "-4px";
     document.getElementById("rclosebtn").style.right = "-198px";
     document.getElementById("rclosebtn").style.fontSize ="21px";
     document.getElementById("main-img").src = "/media/logos/Quindar_Icon_Black.svg";
   }
   else if(mq_nexus_landscape.matches && mq_nexus_landscape_height.matches && window.matchMedia("(orientation: landscape)").matches){
     document.getElementById("myrightSidenav").style.width = "40%";
     document.getElementById("main").style.marginRight = "40%";
     document.getElementById("myrightSidenav").style.height = "100%";
     document.getElementById("rclosebtn").style.width = "100%";
     document.getElementById("rclosebtn").style.height = "100%";
     document.getElementById("rclosebtn").style.top = "-4px";
     document.getElementById("rclosebtn").style.right = "-198px";
     document.getElementById("rclosebtn").style.fontSize ="21px";
     document.getElementById("main-img").src = "/media/logos/Quindar_Icon_Black.svg";
   }
   else if(mq_iphone6plus_landscape.matches && mq_iphone6plus_landscape_height.matches && window.matchMedia("(orientation: landscape)").matches){
     document.getElementById("myrightSidenav").style.width = "37%";
     document.getElementById("main").style.marginRight = "37%";
     document.getElementById("myrightSidenav").style.height = "100%";
     document.getElementById("rclosebtn").style.width = "100%";
     document.getElementById("rclosebtn").style.height = "100%";
     document.getElementById("rclosebtn").style.top = "-4px";
     document.getElementById("rclosebtn").style.right = "-198px";
     document.getElementById("rclosebtn").style.fontSize ="21px";
     document.getElementById("main-img").src = "/media/logos/Quindar_Icon_Black.svg";
   }
   else if(mq_ipad.matches){
     document.getElementById("top-header").style.display = 'none';
     document.getElementById("myrightSidenav").style.width = "100%";
     document.getElementById("main").style.marginRight = "100%";
     document.getElementById("rclosebtn").style.fontSize ="21px";
   }
   else if(mq_mozilla.matches){
     document.getElementById("top-header").style.display = 'none';
     document.getElementById("myrightSidenav").style.width = "100%";
     document.getElementById("main").style.marginRight = "100%";
     document.getElementById("rclosebtn").style.fontSize ="21px";
   }
  
  else if(mq_ipad_landscape.matches && window.matchMedia("(orientation: landscape)").matches){
      document.getElementById("myrightSidenav").style.width = "30%";
      document.getElementById("main").style.marginRight = "30%";
      document.getElementById("add-widget").style.display = 'none';
      document.getElementById("username").style.display = 'none';
      document.getElementById("rclosebtn").style.fontSize ="21px";
   }
  else if(mq_ipad_pro.matches) {
      document.getElementById("myrightSidenav").style.width = "30%";//18%
      document.getElementById("main").style.marginRight = "30%";//18%
      document.getElementById("add-widget").style.display = 'none';
      document.getElementById("username").style.display = 'none';
      document.getElementById("rclosebtn").style.fontSize ="21px";
  }
   else {
    document.getElementById("myrightSidenav").style.width = "18%";
    document.getElementById("main").style.marginRight = "18%";
    document.getElementById("add-widget").style.display = 'none';
    // document.getElementById("username").style.display = 'none';
    document.getElementById("rclosebtn").style.fontSize ="36px";
  }
}

function closeRightNav() {
  if(mq.matches || mq_nexus_5x.matches || iphone6pluspotrait.matches){ 
    document.getElementById("myrightSidenav").style.width = "0";
    document.getElementById("main").style.marginRight = "0";
    document.getElementById("username").style.display = 'none';
    document.getElementById("s-icons").style.display = 'inline-block';
    document.getElementById("main-img").src = "/media/logos/Quindar_Icon_Black.svg";
  }
  else if(mq_iphone5_landscape.matches && mq_iphone5_landscape_height.matches && window.matchMedia("(orientation: landscape)").matches){
    document.getElementById("myrightSidenav").style.width = "0";
    document.getElementById("main").style.marginRight = "0";
    document.getElementById("username").style.display = 'none';
    document.getElementById("s-icons").style.display = 'inline-block';
    document.getElementById("main-img").src = "/media/logos/Quindar_Icon_Black.svg";
  }
  else if(mq_galaxy_landscape.matches && mq_height.matches && window.matchMedia("(orientation: landscape)").matches){
    document.getElementById("myrightSidenav").style.width = "0";
    document.getElementById("main").style.marginRight = "0";
    document.getElementById("username").style.display = 'none';
    document.getElementById("s-icons").style.display = 'inline-block';
    document.getElementById("main-img").src = "/media/logos/Quindar_Icon_Black.svg";
  }
  else if(mq_nexus_landscape.matches && mq_nexus_landscape_height.matches && window.matchMedia("(orientation: landscape)").matches){
    document.getElementById("myrightSidenav").style.width = "0";
    document.getElementById("main").style.marginRight = "0";
    document.getElementById("username").style.display = 'none';
    document.getElementById("s-icons").style.display = 'inline-block';
    document.getElementById("main-img").src = "/media/logos/Quindar_Icon_Black.svg";
  }
  else if(mq_iphone6plus_landscape.matches && mq_iphone6plus_landscape_height.matches && window.matchMedia("(orientation: landscape)").matches){
    document.getElementById("myrightSidenav").style.width = "0";
    document.getElementById("main").style.marginRight = "0";
    document.getElementById("username").style.display = 'none';
    document.getElementById("s-icons").style.display = 'inline-block';
    document.getElementById("main-img").src = "/media/logos/Quindar_Icon_Black.svg";
  }
  else if(mq_ipad.matches){
    document.getElementById("top-header").style.display = 'block';
    document.getElementById("myrightSidenav").style.width = "0";
    document.getElementById("main").style.marginRight = "0";
    document.getElementById("s-icons").style.display = 'inline-block';
  }
    else if(mq_mozilla.matches){
    document.getElementById("top-header").style.display = 'block';
    document.getElementById("myrightSidenav").style.width = "0";
    document.getElementById("main").style.marginRight = "0";
    // document.getElementById("username").style.display = 'none';
    document.getElementById("s-icons").style.display = 'inline-block';
  }
   else if(mq_ipad_landscape.matches && window.matchMedia("(orientation: landscape)").matches){
      document.getElementById("myrightSidenav").style.width = "0";
      document.getElementById("main").style.marginRight= "0";
      document.getElementById("add-widget").style.display = 'inline-block';
      document.getElementById("username").style.display = 'inline-block';
      document.getElementById("rclosebtn").style.fontSize ="21px";
   }
 else if(mq_ipad_pro.matches){
         document.getElementById("myrightSidenav").style.width = "0";
    document.getElementById("main").style.marginRight= "0";
    document.getElementById("add-widget").style.display = 'inline-block';
     document.getElementById("username").style.display = 'inline-block';
  }
  else{
    document.getElementById("myrightSidenav").style.width = "0";
    document.getElementById("main").style.marginRight= "0";
    document.getElementById("add-widget").style.display = 'inline-block';
  }
}
