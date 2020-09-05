// Item Controller
const ItemCtrl = (function() {
  // Item Constructor
  const Item = function(id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  }

  // Data Structure / State
  const data = {
    items: [
      // {id: 0, name: 'Burger', calories: 300},
      // {id: 1, name: 'Pizza', calories: 600},
      // {id: 2, name: 'Broast', calories: 400}
    ],
    currItem: null,
    totalCalories: 0
  }

  // Public Methods
  return {
    getItems: () => data.items,
    addItem: (name, calories) => {
      console.log(name, calories)
      // Generate ID
      let ID;
      if(data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }

      // Create new item
      const newItem = new Item(ID, name, calories);

      // Push item to data
      data.items.push(newItem)
      // Add Item to UI

      return newItem;
    },
    getTotalCalories: () => {
      let total = 0;
      data.items.forEach(item => {
        total += item.calories;
      });

      data.totalCalories = total;
      console.log(total)
      return data.totalCalories;
    }
  }
})();

// UI Controller
const UICtrl = (function() {
  const UISelectors = {
    itemsList: '#items-list',
    addItem: '#item-form',
    itemName: '#item-name',
    itemCalories: '#item-calories',
    itemList : '#items-list',
    totalCalories: '#totalCalories',
    preLoader: '#preLoader'
  }

  // Public Methods
  return {
    populateItemsList: items => {
      let output = ''

      items.forEach(item => {
        output += `
        <li class="collection-item" id="item-${item.id}"><strong>${item.name}:</strong> ${item.calories} Calories <a href="#" class="secondary-content yellow-text text-darken-4" style="margin-left: 8px;"><i id="delete-item-li" class="fa fa-trash"></i></a><a href="#" class="secondary-content yellow-text text-darken-4"><i id="edit-item" class="fa fa-edit"></i></a></li>
        `;
      });

      document.querySelector(UISelectors.itemsList).innerHTML = output;
    },
    getUISelectors: () => {
      return UISelectors;
    },
    getItemInput: () => {
      return {
        name: document.querySelector(UISelectors.itemName).value,
        calories: parseInt(document.querySelector(UISelectors.itemCalories).value)
      };
    },
    addItemToList: item => {
      // Show list
      document.querySelector(UISelectors.itemList).style.display = 'block';
      // Create li element
      const li = document.createElement('li');
      // Add Class
      li.className = 'collection-item';
      // Add ID
      li.id = `item-${item.id}`;
      // Add HTML
      li.innerHTML = `
      <strong>${item.name}:</strong> ${item.calories} Calories 
        <a href="#" class="secondary-content yellow-text text-darken-4" style="margin-left: 8px;"><i id="delete-item-li" class="fa fa-trash"></i>
        </a>
        <a href="#" class="secondary-content yellow-text text-darken-4"><i id="edit-item" class="fa fa-edit"></i></a>
      `
      // Insert item
      document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li)
    },
    addTotalCalories: totalCal => {
      document.querySelector(UISelectors.totalCalories).textContent = totalCal;
    },
    clearInputs: () => {
      document.querySelector(UISelectors.itemName).value = '';
      document.querySelector(UISelectors.itemCalories).value = '';
    },
    hideList: () => {
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },
    hidePreLoader: () => {
      console.log('hide')
      const loader = document.querySelector(UISelectors.preLoader)
      loader.style.opacity = '0'
      setTimeout(() => {
        loader.style.display = 'none'
      }, 500)
    }
  }
})();

// App Controller
const App = (function(ItemCtrl, UICtrl) {
  // Load Event Listeners
  const loadEventListeners = () => {
    // Get UISelectors
    const UISelectors = UICtrl.getUISelectors();
    // Add item event
    document.querySelector(UISelectors.addItem).addEventListener('submit', addItem)
  }

  // Add item event
  const addItem = e => {
    console.log('Item added...')
    // Get inputs
    const inputs = UICtrl.getItemInput();

    // Add new item
    const newItem = ItemCtrl.addItem(inputs.name, inputs.calories);

    // Add Item in UI
    UICtrl.addItemToList(newItem)

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();

    // Add total calories in UI
    UICtrl.addTotalCalories(totalCalories)

    // Clear Inputs
    UICtrl.clearInputs();

    e.preventDefault()
  }

  // Public Methods
  return {
    init: () => {
      // Fetch Items
      const items = ItemCtrl.getItems()

      if(items.length !== 0) {
        // Populate list with items
        UICtrl.populateItemsList(items)

        // Populate total calories;
        ItemCtrl.getTotalCalories();
      } else {
        UICtrl.hideList();
      }
      
      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();

      // Add total calories in UI
      UICtrl.addTotalCalories(totalCalories)

      // Hide Preloader
      UICtrl.hidePreLoader()

      // Load event listeners
      loadEventListeners();
    }
  }
})(ItemCtrl, UICtrl);

App.init()