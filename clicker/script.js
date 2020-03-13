var money = 0,
  clickGain = 1,
  autoGain = 1,
  interval;

var element = {
  clicker   : document.getElementById("clicker"),
  money     : document.getElementById("money"),
}



function addMoney() {
  money = money + clickGain;
}
function updateMoney(check=true) {
  text = "$" + money;
  element.money.innerHTML = text;
  if(check){checkPrices();}
}
function autoMoney(amount) {
  clearInterval(interval);
  interval = setInterval(function(){ money = money + autoGain; updateMoney(); }, 200 / amount);
}

//called when a shop Element was bought
function checkPrices() {
  //Check price for each shop element
  //unlock purchase button if enough money
  for(let i=0;i<shop.length;i++){
    if(money >= shop[i].price){
      shop[i].element.disabled = false;
    }
  }
}
//called when a shop Element was bought
function onBuy(obj) {
  //update money
  money -= obj.price;
  updateMoney(check=false);
  //lock every purchase buttons in shop
  for(let i=0;i<shop.length;i++){
    shop[i].element.disabled = true;
  }
}



class ShopElement{
  // Object for elements in the shop.
  // New Instance Token:
  //  id -> main element id (in Html)
  //  up -> the new price formula function
  //  o  -> the onClick function
  
  constructor (id,up,o) { //constructor: called on "new ShopElement"
    this.id = id;
    this.element = document.getElementById(id);
    this.element.onclick = this.purchase.bind(this);
    this.text_element = this.element.getElementsByTagName("b")[0];
    
    this._updatePrice = up;
    this._onClick = o;
    
    this.price = 0;
    this.purchaseLvl = 1;
    this.updatePrice();
  }
  
  onClick(){this._onClick(this);}
  updatePrice(){this._updatePrice(this);}
  
  updateText(){
    this.text_element.innerHTML = "<b>" +'$'+this.price+': ' + "</b>";
  }
  
  // Update Every new purchase
  update(){
    this.updatePrice(); //calculate new price
    this.updateText();  //update displayed txt
  }
  // called on Element clicked
  purchase(){
    this.purchaseLvl += 1;
    this.onClick();
    onBuy(this);
    this.update()
    checkPrices();
  }
  
}


//alls buttons functions ( newPriceFormula , onClick )
function newPrice1(obj){obj.price = clickGain * 25 * obj.purchaseLvl;}
function newPrice2(obj){obj.price = 200 * obj.purchaseLvl;}
function newPrice3(obj){obj.price = autoGain * 30 * obj.purchaseLvl + 500;}
function onClick1(obj){clickGain*=2;}
function onClick2(obj){autoMoney(this.purchaseLvl);}
function onClick3(obj){autoGain*=2;}

function newPrice4(obj){obj.price = obj.price * 2 + 2;}
function onClick4(obj){autoGain += 5;}



//all shop's buttons
shop = [
  new ShopElement("b1",newPrice1,onClick1),
  new ShopElement("b2",newPrice2,onClick2),
  new ShopElement("b3",newPrice3,onClick3),
  new ShopElement("b4",newPrice4,onClick4),
];

// FIRST UPDATE
updateMoney(); //money txt
for (let i=0;i<shop.length;i++){
  shop[i].update() //buttons txt & price
}

//set main clicker function onClick
element.clicker.onclick = function() { 
  element.clicker.disabled = true;
  addMoney(); updateMoney(); 
  element.clicker.disabled = false;
};
