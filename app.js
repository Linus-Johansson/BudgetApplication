// Module pattern


//BUDGET CONTROLLER
var budgetController = (function(){
 // some code
})();




// UI-CONTROLLER
var UIController = (function(){
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
    var DOM = UICtrl.getDOMstrings();
    var ctrlAddItem = function (){
        // 1.get input data from fields
        var input = UICtrl.getUserInput();
        console.log(input);
        
        // 2.add item to budget controller
        
        // 3.add new item to UI 
        
        // 4.calc budget
        
        // 5.display budget in UI
    }

    document.querySelector(DOM.addItemBTN).addEventListener("click",ctrlAddItem);
    
    // Global event, from anywhere in the doucment.
    document.addEventListener("keypress",function(event){
        if(event.keyCode === 13 || event.which === 13){
            ctrlAddItem();
        } 
       
    });
    
})(budgetController,UIController);
