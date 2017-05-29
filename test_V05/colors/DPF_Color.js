
var Color = function(){
   ADT_DEF.call(this,'Fraction');
   
   this.state = {
      red: 0,  // 0..255
      green: 0,
      blue: 0,
      initialColor: null
   };
   
   this._updateTimeCounter = 0,
   this.update = function(deltaT){ // override from ADT_DEF
      //console.log( deltaT );

      this._updateTimeCounter += deltaT;
      if (this._updateTimeCounter>300){ // millisec
         this._updateTimeCounter = 0;
         if (this.state.red>0)
            this.state.red--;
         if (this.state.blue>0)
            this.state.blue--;
         if (this.state.green>0)
            this.state.green--;
      }
   };
   

   // support functions
   function min3(a,b,c) { 
      return (a<b)?((a<c)?a:c):((b<c)?b:c); 
   }
   function max3(a,b,c) { 
      return (a>b)?((a>c)?a:c):((b>c)?b:c); 
   }
//   function HueShift(h,s) { 
//      h+=s; 
//      while (h>=360.0) h-=360.0; 
//      while (h<0.0) h+=360.0; 
//      return h; 
//   }
//   function HSV2RGB(hsv) {
//      var rgb={};
//      if (hsv.saturation==0) {
//         rgb.r=rgb.g=rgb.b=Math.round(hsv.value*2.55);
//      } else {
//         hsv.hue/=60;
//         hsv.saturation/=100;
//         hsv.value/=100;
//         i=Math.floor(hsv.hue);
//         f=hsv.hue-i;
//         p=hsv.value*(1-hsv.saturation);
//         q=hsv.value*(1-hsv.saturation*f);
//         t=hsv.value*(1-hsv.saturation*(1-f));
//         switch(i) {
//            case 0: rgb.r=hsv.value; rgb.g=t; rgb.b=p; break;
//            case 1: rgb.r=q; rgb.g=hsv.value; rgb.b=p; break;
//            case 2: rgb.r=p; rgb.g=hsv.value; rgb.b=t; break;
//            case 3: rgb.r=p; rgb.g=q; rgb.b=hsv.value; break;
//            case 4: rgb.r=t; rgb.g=p; rgb.b=hsv.value; break;
//            default: rgb.r=hsv.value; rgb.g=p; rgb.b=q;
//         }
//         rgb.r=Math.round(rgb.r*255);
//         rgb.g=Math.round(rgb.g*255);
//         rgb.b=Math.round(rgb.b*255);
//      }
//      return {
//         red:     rgb.r,
//         green:   rgb.green,
//         blue:    rgb.blue
//      };
//   }
   function RGB2HSV(rgb) {
      hsv = {};
      max = max3(rgb.red,rgb.green,rgb.blue);
      dif = max-min3(rgb.red,rgb.green,rgb.blue);
      hsv.saturation = (max==0.0)?0:(100*dif/max);
      if (hsv.saturation==0) hsv.hue=0;
      else if (rgb.red==max)   hsv.hue=60.0*(rgb.green-rgb.blue)/dif;
      else if (rgb.green==max) hsv.hue=120.0+60.0*(rgb.blue-rgb.red)/dif;
      else if (rgb.blue==max)  hsv.hue=240.0+60.0*(rgb.red-rgb.green)/dif;
      if (hsv.hue<0.0) hsv.hue+=360.0;
      hsv.value=Math.round(max*100/255);
      hsv.hue=Math.round(hsv.hue);
      hsv.saturation=Math.round(hsv.saturation);
      return hsv;
   }
	
   
   // optional
   this.clone = function(otherColor){
      var c = new Color();
      c.state = {
         red: otherColor.state.red,
         green: otherColor.state.green,
         blue: otherColor.state.blue,
         initialColor: { 
               red: otherColor.state.initialColor.red,
               green: otherColor.state.initialColor.green,
               blue: otherColor.state.initialColor.blue
         }
      };
      return c;
   }
   
   this.toString= function(){
      return this.state.red + ' '+ this.state.green + ' '+ this.state.blue ;
   };

   this.operators['new'] = 
      new Operator('new',function(inputs,outputs){
         var c = new Color();
         c.state = {
            red:     ~~(Math.random()*256),
            green:   ~~(Math.random()*256),
            blue:    ~~(Math.random()*256)
         };
         c.state.initialColor = { 
            red: c.state.red,
            green: c.state.green,
            blue: c.state.blue
         };

         console.log( c.state );
         outputs.push( c );
      },[],1, false);
   
   this.operators['refresh'] = 
      new Operator('refresh',function(inputs,outputs){
         inputs[0].state.red = inputs[0].state.initialColor.red;
         inputs[0].state.green = inputs[0].state.initialColor.green;
         inputs[0].state.blue = inputs[0].state.initialColor.blue;
         outputs.push( inputs[0] );
      },[this.type],1, true);

   this.operators['mix mean'] = 
      new Operator('mix mean',function(inputs,outputs){
         var rgb1 = inputs[0].state;
         var rgb2 = inputs[1].state;

         var c = new Color();
         c.state = { 
            red: Math.min( (rgb1.red+rgb2.red)/2, 255),
            green: Math.min( (rgb1.green+rgb2.green)/2, 255),
            blue: Math.min( (rgb1.blue+rgb2.blue)/2, 255)
         };
      
         c.state.initialColor = { 
            red: c.state.red,
            green: c.state.green,
            blue: c.state.blue
         };
      
         outputs.push( c );
   },[this.type,this.type],1, false);
   
   this.operators['mix add'] = 
      new Operator('mix add',function(inputs,outputs){
         var rgb1 = inputs[0].state;
         var rgb2 = inputs[1].state;

         var c = new Color();
         c.state = { 
            red:     Math.min(rgb1.red+rgb2.red, 255),
            green:   Math.min(rgb1.green+rgb2.green, 255),
            blue:    Math.min(rgb1.blue+rgb2.blue, 255)
         };
      
         c.state.initialColor = { 
            red: c.state.red,
            green: c.state.green,
            blue: c.state.blue
         };
      
         outputs.push( c );
   },[this.type,this.type],1, false);
      
   this.operators['RGB'] =   
      new Operator('RGB',function(inputs,outputs){
         var choice = ~~(Math.random()*3);
         var c = new Color();
         if (choice==0){  
            c.state = { red: 255, green: 0, blue: 0 };
         } 
         if (choice==1){
            c.state = { red: 0, green: 255, blue: 0 };
         } 
         if (choice==2){
            c.state = { red: 0, green: 0, blue: 255 };
         }
      
         c.state.initialColor = { 
            red: c.state.red,
            green: c.state.green,
            blue: c.state.blue
         };
         outputs.push( c);
      },[],1, true);
       
   this.operators['CMYK'] =   
      new Operator('CMYK',function(inputs,outputs){   
         var choice = ~~(Math.random()*4);
         var c = new Color();
         if (choice==0){  
            c.state = { red: 0, green: 255, blue: 255 }; // Cyan
         } 
         if (choice==1){
            c.state = { red: 255, green: 0, blue: 255 }; // Magenta
         } 
         if (choice==2){
            c.state = { red: 255, green: 255, blue: 0 }; // Yellow
         }
         if (choice==3){
            c.state = { red: 0, green: 0, blue: 0 }; // blacK
         }
      
         c.state.initialColor = { 
            red: c.state.red,
            green: c.state.green,
            blue: c.state.blue
         };
         outputs.push( c);      
      },[],1, true);

   
   
   var _self = this;
   this.views = []; // erase default view
   this.views.push( function(ctx){
      var w = 100;
      var h = 100;
      ctx.save();

      ctx.strokeStyle= 'black';
      ctx.lineJoin = 'round';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(w/3,h*1/8);
      ctx.lineTo(w/3,h*4/8);
      ctx.lineTo(w/6,h*7/8);
      ctx.lineTo(w/3,h);
      ctx.lineTo(w*2/3,h);
      ctx.lineTo(w*5/6,h*7/8);
      ctx.lineTo(w*2/3,h*4/8);
      ctx.lineTo(w*2/3,h*1/8);
      //ctx.closePath();
      ctx.stroke();
      ctx.clip();
      ctx.lineWidth = 1;


      ctx.beginPath();
      ctx.fillStyle= 'rgb('+ _self.state.red +','+ _self.state.green +','+ _self.state.blue +')';
      ctx.rect(0,0,w,h);
      ctx.fill();
      ctx.closePath();

      ctx.restore();
   });
   
   this.views.push( function(ctx){
      var w = 100;
      var h = 100;
      
      ctx.beginPath();
      ctx.strokeStyle="red";
      ctx.fillStyle="lightgray";
      ctx.rect(0,0,100,100);
      ctx.stroke();
      ctx.fill();

      ctx.beginPath();
      ctx.fillStyle="black";
      ctx.fillText( _self.state.red ,w/4,h/4);
      ctx.fillText( _self.state.green ,w/4,h/2);
      ctx.fillText( _self.state.blue ,w/4,h*3/4);
      ctx.closePath();      
   });
   
   this.views.push( function(ctx){
      ctx.beginPath();
      ctx.strokeStyle="gray";
      ctx.fillStyle="blue";
      ctx.rect(0,0,100,100);
      ctx.stroke();
      ctx.fill();

      var HSV = RGB2HSV( _self.state );
      ctx.beginPath();
      ctx.fillStyle="white";
      ctx.fillText( 'HSV',50,20);
      ctx.fillText( HSV.hue ,       20,40);
      ctx.fillText( HSV.saturation ,20,60);
      ctx.fillText( HSV.value ,     20,80);
      ctx.closePath();   
   });
   
}