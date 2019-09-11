// Module pattern


//BUDGET CONTROLLER
var budgetController = (function(){
 // some code
var Expense = function(id, desc,value){
        this.id = id;
        this.desc = desc;
        this.value = value;
    };

    var Income = function(id, desc,value){
        this.id = id;
        this.desc = desc;
        this.value = value;
    };

    var data ={
        allItems: {
            exp: [],
            inc: [],
        },
        totals:{
            totalInc: 0,
            totalExp: 0
        }
    };

    return{
        addItem: function(type,desc,val){
            var newItem, ID;
            // create new ID 
            if(data.allItems[type].length >0){
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }else{
                ID = 0;
            }
          
            // create new item based on  'inc' or 'exp' type
            if(type === "exp"){
                newItem = new Expense(ID,desc,val);
            }else if(type === "inc"){
                newItem = new Income(ID,desc,val);
            }
            // push it into our datastructure 
            data.allItems[type].push(newItem);
            // return the new item.
            return newItem;

        },
        testing: function(){
           console.log(data);
        }
    }

})();

// UI-CONTROLLER
var UIController = (function(){
    // object containing querySelector strings 
    var DOMstrings = {
        inputType: ".add__type",
        inputDescription: ".add__description",
        inputValue: ".add__value",
        addItemBTN: ".add__btn"
    };
    return{
        getUserInput: function(){
            return {
                type: document.querySelector(DOMstrings.inputType).value, // will be either inc or exp
                desc: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
            }
           
        },
        getDOMstrings:function(){
            return DOMstrings;
        }
    }

})();


// GLOBAL-APP-CONTROLLER
var controller = (function(budgetCtrl,UICtrl){
    // get access to DOMstrings declared in UI-Controller.
    var setupEventListners = function(){
        var DOM = UICtrl.getDOMstrings();
        document.querySelector(DOM.addItemBTN).addEventListener("click",ctrlAddItem);
    
        // Global event, from anywhere in the doucment.
        document.addEventListener("keypress",function(event){
            if(event.keyCode === 13 || event.which === 13){
                ctrlAddItem();
            } 
        });
    }
    var ctrlAddItem = function (){
        var input,newItem;
        // 1.get input data from fields
        input = UICtrl.getUserInput();
        
        // 2.add item to budget controller
        newItem = budgetCtrl.addItem(input.type,input.desc,input.value);
        // 3.add new item to UI 
        
        // 4.calc budget
        
        // 5.display budget in UI
    }

    return{
        init: function(){
            console.log("Application has started.");
            setupEventListners();
            
        }
    }
   
})(budgetController,UIController);

// initalizes the eventlistners.
controller.init();
