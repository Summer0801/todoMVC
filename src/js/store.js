/*jshint eqeqeq:false */
(function(window) {
  ("use strict");

  /**
   * Creates a new client side storage object and will create an empty
   * collection if no collection already exists.
   * 创建一个新的客户端存储对象，如果没有就新建一个空集合。
   *
   * @param {string} name The name of our DB we want to use
   * @param {function} callback Our fake DB uses callbacks because in
   * real life you probably would be making AJAX calls
   * @param函数回调我们的假DB，因为现实生活中你可能会做AJAX调用
   */
  function Store(name, callback) {
    callback = callback || function() {};

    this._dbName = name;

    if (!localStorage.getItem(name)) {
      var todos = [];

      localStorage.setItem(name, JSON.stringify(todos));
    }

    callback.call(this, JSON.parse(localStorage.getItem(name)));
  }

  /**
   * Finds items based on a query given as a JS object
   * 根据JS对象查询找到相应项目
   *
   * @param {object} query The query to match against (i.e. {foo: 'bar'})
   * @param {function} callback	 The callback to fire when the query has
   * completed running
   *
   * @example
   * db.find({foo: 'bar', hello: 'world'}, function (data) {
   *	 // data will return any items that have foo: bar and
   *	 // hello: world in their properties
   * });
   */
  Store.prototype.find = function(query, callback) {
    if (!callback) {
      return;
    }

    var todos = JSON.parse(localStorage.getItem(this._dbName));

    callback.call(
      this,
      todos.filter(function(todo) {
        for (var q in query) {
          if (query[q] !== todo[q]) {
            return false;
          }
        }
        return true;
      })
    );
  };

  /**
   * Will retrieve all data from the collection
   * 将从集合中检索所有数据
   *
   * @param {function} callback The callback to fire upon retrieving data
   * 回调函数，在检索数据时触发回调
   */
  Store.prototype.findAll = function(callback) {
    callback = callback || function() {};
    callback.call(this, JSON.parse(localStorage.getItem(this._dbName)));
  };

  /**
   * Will save the given data to the DB. If no item exists it will create a new
   * item, otherwise it'll simply update an existing item's properties
   *将把给定的数据保存到DB中。如果没有项目存在，它将创建一个新的项目，否则它只会更新现有项的属性
   *
   * @param {object} updateData The data to save back into the DB
   * @param {function} callback The callback to fire after saving
   * @param {number} id An optional param to enter an ID of an item to update
   */
  Store.prototype.save = function(updateData, callback, id) {
    var todos = JSON.parse(localStorage.getItem(this._dbName));

    callback = callback || function() {};

    // If an ID was actually given, find the item and update each property
    if (id) {
      for (var i = 0; i < todos.length; i++) {
        if (todos[i].id === id) {
          for (var key in updateData) {
            todos[i][key] = updateData[key];
          }
          break;
        }
      }

      localStorage.setItem(this._dbName, JSON.stringify(todos));
      callback.call(this, todos);
    } else {
      // Generate an ID
      updateData.id = new Date().getTime();

      todos.push(updateData);
      localStorage.setItem(this._dbName, JSON.stringify(todos));
      callback.call(this, [updateData]);
    }
  };

  /**
   * Will remove an item from the Store based on its ID
   *
   * @param {number} id The ID of the item you want to remove
   * @param {function} callback The callback to fire after saving
   */
  Store.prototype.remove = function(id, callback) {
    var todos = JSON.parse(localStorage.getItem(this._dbName));
    for (var i = 0; i < todos.length; i++) {
      if (todos[i].id == id) {
        todos.splice(i, 1);
        break;
      }
    }

    localStorage.setItem(this._dbName, JSON.stringify(todos));
    callback.call(this, todos);
  };

  /**
   * Will drop all storage and start fresh
   *
   * @param {function} callback The callback to fire after dropping the data
   */
  Store.prototype.drop = function(callback) {
    var todos = [];
    localStorage.setItem(this._dbName, JSON.stringify(todos));
    callback.call(this, todos);
  };

  // Export to window
  window.app = window.app || {};
  window.app.Store = Store;
})(window);
