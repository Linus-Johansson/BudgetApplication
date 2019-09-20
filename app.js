// Module pattern
// IFFE:
/*
An Immediately Invoked Function Expression is a good way at protecting the scope of your function and the variables within it.
*/

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
		//TODO
		calculateBudget: function(){
			// 1. calculate total income.
			// 2. calculate total expenses.
			// 3. calculate budgetmonth.
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
        addItemBTN: ".add__btn",
		incContainer: ".income__list",
		expContainer: ".expenses__list"
    };
    return{
        getUserInput: function(){
            return {
                type: document.querySelector(DOMstrings.inputType).value, // will be either inc or exp
                desc: document.querySelector(DOMstrings.inputDescription).value,
                value:parseFloat(document.querySelector(DOMstrings.inputValue).value) 
            }
           
        },
		
		addListItem: function(obj,type){
			
			var html,newHtml, element;
			//1. create html string with placeholder text.
			if(type === "inc"){
				element = DOMstrings.incContainer;
				html = "<div class='item clearfix' id='income-%id%'><div class='item__description'>%description%</div> <div class='right clearfix'><div class='item__value'>%value%</div><div class='item__delete'><button class='item__delete--btn'><i class='ion-ios-close-outline'></i></button></div></div></div>";
			}else if(type === "exp"){
				element = DOMstrings.expContainer;
				html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">%percentage%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			}
			
			// 2. replace placeholdertext with data from obj
				newHtml = html.replace("%id%",obj.id);
				newHtml = newHtml.replace("%description%",obj.desc);
				newHtml = newHtml.replace("%value%",obj.value);
		    //3. insert html into DOM
				
				document.querySelector(element).insertAdjacentHTML("beforeend",newHtml);
				
		},
		
		clearFields: function(){
			var fields,fieldsArr;
			fields = document.querySelectorAll(DOMstrings.inputDescription + ', '+DOMstrings.inputValue);
			
			fieldsArr = Array.prototype.slice.call(fields);// tricking the slice method that it gets an array, even though 'querySelectorAll' returns a list.
			
			fieldsArr.forEach(function (current,index,array){
				current.value ="";
			});
			fieldsArr[0].focus();// sets focus back on first item in fieldsArr, I.E desc input field.
			
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
	var updateBudget = function(){
		// 1.calc budget
        // 2. 
        // 3.display budget in UI
	}
    var ctrlAddItem = function (){
        var input,newItem;
        // 1.get input data from fields
        input = UICtrl.getUserInput();
        
		if(input.desc != "" && !isNaN(input.value) && input.value > 0){
				// 2.add item to budget controller
				newItem = budgetCtrl.addItem(input.type,input.desc,input.value);
				// 3.add new item to UI 
				UICtrl.addListItem(newItem,input.type);
				// 4. clear the fields
				UICtrl.clearFields();
				//5. Calculate & update budget
		updateBudget();
			}else{
				
			}		
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
