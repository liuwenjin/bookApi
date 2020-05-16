transweb_managerContainer({
  border: "none",
  background: "#fff",
  overflow: "auto",
  cardName: "transwebManagerContainer",
  titleHeight: 50,
  titleData: {
    menu: [{
      name: "新增",
      key: 'addBook',
      callback: function () {

      }
    }]
  },
  style: {
    "max-width": 800
  },
  task: {
    data: [],
    configBook: function (folder, key, value, callback) {
      var param = {
        folder: folder,
        key: key,
        value: value
      }
      if (typeof (key) !== "string") {
        param = {
          folder: folder,
          current: webCpu.interface.bookManager.query.current,
          param: JSON.stringify(key)
        }
      }
      webCpu.adapter.configBook(param, function (d) {
        if (typeof (callback) === "function") {
          callback(d);
        }
      });
    },
    promise: {
      beforeRender: function (container, data, task) {

      },
      afterRender: function (container, data, task) {
        webCpu.updateView(container, webCpu.plugin.bookManager);
        $(task.titleArea).find("li[key=upperShelf]").on("click", function () {
          var t = webCpu.cards.transwebManageDataTable.task;
          if (t.selected.length !== 0) {
            task.configBook(t.selected, "status", "0", function (d) {
              webCpu.updateView(container, webCpu.plugin.bookManager);
            });
          }
        });
        $(task.titleArea).find("li[key=lowerShelf]").on("click", function () {
          var t = webCpu.cards.transwebManageDataTable.task;
          if (t.selected.length !== 0) {
            task.configBook(t.selected, "status", "1", function (d) {
              webCpu.updateView(container, webCpu.plugin.bookManager);
            });
          }
        });
        $(task.titleArea).find("li[key=addBook]").on("click", function () {
          var arr = [{
            "key": "name",
            "editor": {
              "type": 'text',
              "placeholder": "输入书籍名称",
              "value": ''
            }
          }];
          var cName = "transwebManagerContainer";
          var ret = webCpu.CardItem.configDialog(webCpu.cards[cName], "新增书籍", arr, function () {
            ret.task.data.current = webCpu.interface.bookManager.query.current;
            webCpu.adapter.createFolder(ret.task.data, function (d) {
              var t = webCpu.cards.transwebManageDataTable.task;
              webCpu.DataTable.render(t);
            });
          }, webCpu.style.dialog);
        });
      }
    }
  }
})