// Local Storage Controller
const StorageCtrl = (function() {
  // Public Methods
  return {
    getItems: () => {
      let items;
      if(localStorage.getItem('items') === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem('items'));
      }
      return items;
    },
    storeItem: item => {
      let items = [];
      if(localStorage.getItem('items') === null) {
        items = [];
        
        // Push new item
        items.push(item)

        // Push items to LocalStorage
        localStorage.setItem('items', JSON.stringify(items))
      } else {
        // Get items from LocalStorage
        items = JSON.parse(localStorage.getItem('items'));
        
        // Push new item
        items.push(item)

        // Push items to LocalStorage
        localStorage.setItem('items', JSON.stringify(items))
      }
    },
    updateItem: updateItem => {
      let items = JSON.parse(localStorage.getItem('items'))
      items.forEach((item, index) => {
        if(updateItem.id === item.id) {
          items.splice(index, 1, updateItem)
        }
      });
      localStorage.setItem('items', JSON.stringify(items))
    },
    deleteItem: itemToDelete => {
      let items = JSON.parse(localStorage.getItem('items'))
      items.forEach((item, index) => {
        if(itemToDelete.id === item.id) {
          items.splice(index, 1)
        }
      });
      localStorage.setItem('items', JSON.stringify(items))
    },
    clearAll: () => {
      localStorage.clear('items')
    }
  }
})();

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
    // items: [
    //   // {id: 0, name: 'Burger', calories: 300},
    //   // {id: 1, name: 'Pizza', calories: 600},
    //   // {id: 2, name: 'Broast', calories: 400}
    // ],
    items: StorageCtrl.getItems(),
    currItem: null,
    currItemNode: '',
    totalCalories: 0
  }

  // Public Methods
  return {
    getItems: () => data.items,
    setCurrentItem: item => {
      data.currItem = item;
    },
    setCurrentItemNode: target => {
      data.currItemNode = target;
    },
    addItem: (name, calories) => {
      // Generate ID
      let ID;
      if(data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }

      // Calories to number
      calories = parseInt(calories)

      // Create new item
      const newItem = new Item(ID, name, calories);

      // Add item to data
      data.items.push(newItem)

      return newItem;
    },
    updateItem: (name, calories) => {
      let found = null;
      data.items.forEach(item => {
        if(item.id === data.currItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      })
      return found;
    },
    deleteItem: curritem => {
      data.items.forEach((item, index) => {
        if(curritem.id === item.id) {
          data.items.splice(index, 1)
          data.currItemNode = '';
        }
      })
    },
    clearAll: () => {
      data.items = [];
      data.currItem = null;
      data.currItemNode = '';
      data.totalCalories = 0;
    },
    getTotalCalories: () => {
      let total = 0;
      data.items.forEach(item => {
        total += item.calories;
      });

      data.totalCalories = parseInt(total);
      
      return data.totalCalories;
    },
    getItemByID: id => {
      let gotItem = null;
      data.items.forEach(item => {
        if(item.id === id) {
          gotItem = item
        }
      })
      return gotItem;
    },
    getCurrentItem: () => data.currItem,
    getCurrentItemNode: () => {
      let node;
      if(data.currItemNode !== null) {
        node = data.currItemNode;
      }
      return node;
    },
    logData: () => data
  }
})();

// UI Controller
const UICtrl = (function() {
  const UISelectors = {
    itemsList: '#items-list',
    addBtn: '#add-item',
    updateBtn: '#update-item',
    deleteBtn: '#delete-item',
    backBtn: '#back-item',
    clearBtn: '#clear-items',
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
        <li class="collection-item" id="item-${item.id}"><strong>${item.name}:</strong> ${item.calories} Calories
        <a href="#" class="secondary-content yellow-text text-darken-4" style="margin-left: 8px;"><i id="delete-item" class="fa fa-trash"></i></a>
        <a href="#" class="secondary-content yellow-text text-darken-4"><i id="edit-item" class="fa fa-edit"></i></a>
        </li>
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
        calories: document.querySelector(UISelectors.itemCalories).value
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
        <a href="#" class="secondary-content yellow-text text-darken-4" style="margin-left: 8px;"><i id="delete-item" class="fa fa-trash"></i>
        </a>
        <a href="#" class="secondary-content yellow-text text-darken-4"><i id="edit-item" class="fa fa-edit"></i></a>
      `
      // Insert item
      document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li)
      
      // Alert Added..
      M.toast({html: 'Item Added!'})
    },
    updateItemToList: item => {
      let itemlist = document.querySelectorAll(UISelectors.itemList + ' li');
      const list = Array.from(itemlist)
      list.forEach(listitem => {
        const itemID = listitem.getAttribute('id')
        if(itemID === `item-${item.id}`) {
          document.querySelector(`#${itemID}`).innerHTML = `
          <strong>${item.name}:</strong> ${item.calories} Calories 
          <a href="#" class="secondary-content yellow-text text-darken-4" style="margin-left: 8px;"><i id="delete-item" class="fa fa-trash"></i>
          </a>
          <a href="#" class="secondary-content yellow-text text-darken-4"><i id="edit-item" class="fa fa-edit"></i></a>
          `;
        }
      })
      // Alert Updated...
      M.toast({html: 'Item Updated!'})
    },
    deleteItem: target => {
      let items = document.querySelectorAll(UISelectors.itemList + ' li');
      if(items.length === 1) {
        UICtrl.hideList()
      }
      target.parentNode.parentNode.remove()

      // Alert Deleted
      M.toast({html: 'Item Deleted!'})
    },
    clearAll: () => {
      let items = document.querySelectorAll(UISelectors.itemList + ' li');
      if(items.length !== 0) {
        items.forEach(item => {
          item.remove()
        })
        UICtrl.hideList()
        
        // Alert Error
        M.toast({html: 'Items Cleared!'})
      } else {
        // Alert Error
        M.toast({html: 'Please add items first!'})
      }
    },
    addTotalCalories: totalCal => {
      document.querySelector(UISelectors.totalCalories).textContent = totalCal;
    },
    clearInputs: () => {
      document.querySelector(UISelectors.itemName).value = '';
      document.querySelector(UISelectors.itemCalories).value = '';
    },
    setItemToForm: () => {
      document.querySelector(UISelectors.itemName).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCalories).value = ItemCtrl.getCurrentItem().calories;
    },
    setEditState: () => {
      document.querySelector(UISelectors.addBtn).style.display = 'none';
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
    },
    clearEditState: () => {
      UICtrl.clearInputs()
      document.querySelector(UISelectors.addBtn).style.display = 'inline';
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
    },
    editActive: target => {
      target.className = 'collection-item active grey darken-2'
    },
    editDeactive: () => {
      // Get current node
      const node = ItemCtrl.getCurrentItemNode();

      if(node !== '') {
        // Get target using current node
        const target = document.querySelector(`#${node.id}`)
        
        // Deactive className
        target.className = 'collection-item'
      }
    },
    hideList: () => {
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },
    hidePreLoader: () => {
      const loader = document.querySelector(UISelectors.preLoader)
      setTimeout(() => {
        loader.style.opacity = '0'
        loader.style.zIndex = '0'
      }, 1500)
    }
  }
})();

// App Controller
const App = (function(ItemCtrl, StorageCtrl, UICtrl) {
  // Load Event Listeners
  const loadEventListeners = () => {
    // Get UISelectors
    const UISelectors = UICtrl.getUISelectors();

    // Hide Preloader
    // window.onload =  UICtrl.hidePreLoader()

    // Disable submit on enter
    document.addEventListener('keypress', e => {
      if(e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
      }
    })

    // Add item event
    document.querySelector(UISelectors.addBtn).addEventListener('click', addItem)

    // Set Edit State event
    document.querySelector(UISelectors.itemList).addEventListener('click', itemEditState)

    // Update item event
    document.querySelector(UISelectors.updateBtn).addEventListener('click', updateItem)

    // Delete item event
    document.querySelector(UISelectors.itemList).addEventListener('click', deleteItem)

    // Back button event
    document.querySelector(UISelectors.backBtn).addEventListener('click', backToNormalState)
    
    // Clear all items event
    document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAll)
  }

  // Add item event
  const addItem = e => {
    // Get inputs
    const inputs = UICtrl.getItemInput();

    if(inputs.calories !== '' && inputs.name !== '') {
      // Add new item
      const newItem = ItemCtrl.addItem(inputs.name, inputs.calories);

      // Add Item in UI
      UICtrl.addItemToList(newItem)

      // Add item to Local Storage
      StorageCtrl.storeItem(newItem)

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();

      // Add total calories in UI
      UICtrl.addTotalCalories(totalCalories)

      // Clear Inputs
      UICtrl.clearInputs();

      e.preventDefault()
    }
  }

  // Set current item
  const setItemToCurrent = e => {
    const listID = e.target.parentNode.parentNode.id;
    // Active current item UI
    UICtrl.editActive(e.target.parentNode.parentNode)

    // Break into array by dash(-)
    const listIDArr = listID.split('-');

    // Get actual ID
    const id = parseInt(listIDArr[1]);

    // Get item to edit
    const itemToEdit = ItemCtrl.getItemByID(id)

    // Set Current item
    ItemCtrl.setCurrentItem(itemToEdit)

    // Set Current item node
    ItemCtrl.setCurrentItemNode(e.target.parentNode.parentNode)
  }

  // Set form to edit state event
  const itemEditState = e => {
    if(e.target.id === 'edit-item') {
      UICtrl.editDeactive()
      setTimeout(() => {
        // Set Current item
        setItemToCurrent(e)

        // Set Current item to form
        UICtrl.setItemToForm()

        // Set Edit State
        UICtrl.setEditState()
      })
      
    }

    e.preventDefault();
  }

  // Update item even
  const updateItem = e => {
    // Get updated values
    const input = UICtrl.getItemInput()

    // Get current list item

    if(input.name != '' && input.calories !== '') {
      // Update Item in Data
      const updatedItem = ItemCtrl.updateItem(input.name, parseInt(input.calories))

      // Update item in LocalStorage
      StorageCtrl.updateItem(updatedItem)

      // Update Item in UI
      UICtrl.updateItemToList(updatedItem)

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
  
      // Add total calories in UI
      UICtrl.addTotalCalories(totalCalories)

      // Get Current Node
      const node = ItemCtrl.getCurrentItemNode()

      // Clear Inputs
      UICtrl.clearInputs()

      // Clear Edit State
      UICtrl.clearEditState()

      // Clear Edit State
      UICtrl.editDeactive(node)
    
      e.preventDefault();
    } else {
    }
  }

  // Delete item event
  const deleteItem = e => {
    if(e.target.id === 'delete-item') {
      // Deactive recent focus effect
      UICtrl.editDeactive()

      // Set current item
      setItemToCurrent(e)

      // Get current item
      const currItem = ItemCtrl.getCurrentItem()

      // Delete item from data
      ItemCtrl.deleteItem(currItem);

      // Delete item form LocalStorage
      StorageCtrl.deleteItem(currItem)

      // Delete item from UI
      UICtrl.deleteItem(e.target);
      
      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();

      // Add total calories in UI
      UICtrl.addTotalCalories(totalCalories)

      UICtrl.clearEditState()
    }
  }

  // Back event
  const backToNormalState = () => {
    // Alert back..
    M.toast({html: 'Nothing changed!'})

    // Clear edit state
    UICtrl.clearEditState()

    // Get current node
    const node = ItemCtrl.getCurrentItemNode()

    // Deactive current focus effect
    UICtrl.editDeactive(node)

  }

  // Clear all items event
  const clearAll = () => {
    // Clear items from data
    ItemCtrl.clearAll();

    // Clear from LocalStorage
    StorageCtrl.clearAll()

    // Clear items from UI
    UICtrl.clearAll();
    
    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();

    // Add total calories in UI
    UICtrl.addTotalCalories(totalCalories)
  }

  // Public Methods
  return {
    init: () => {
      // Hide preloader on page load
      UICtrl.hidePreLoader();

      // Clear Edit State / Init State
      UICtrl.clearEditState();

      // Fetch items from LocalStorage
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

      // Load event listeners
      loadEventListeners();
    }
  }
})(ItemCtrl, StorageCtrl, UICtrl);

App.init()

