transweb_cn({
  titleData: {
    title: "#",
    menu: [],
    rightMenu: [{
      name: "管理",
      children: [{
        name: "书籍管理",
        callback: function () {
          var app = webCpu.plugin.signIn;
          var logined = webCpu.interface.bookManager.logined;
          var user = webCpu.interface.bookManager.query.user;
          if(logined && user === webCpu.interface.bookManager.logined) {
            app = webCpu.plugin.managerContainer;
          }
          webCpu["CardItem"].renderCardDialog(webCpu.cards.main, app, {
            title: "书籍管理",
            closeType: "back",
            closeCallback: function() {
              webCpu.CardItem.fresh(webCpu.cards.testA);
            }
          });
        }
      }, {
        name: "书柜管理",
        callback: function () {
          var app = webCpu.plugin.signIn;
          var logined = webCpu.interface.bookManager.logined;
          var user = webCpu.interface.bookManager.query.user;
          if(logined && user === webCpu.interface.bookManager.logined) {
            app = webCpu.plugin.managerContainer;
          }
          webCpu["CardItem"].renderCardDialog(webCpu.cards.main, app, {
            title: "书柜管理",
            closeType: "back",
            closeCallback: function() {
              webCpu.CardItem.fresh(webCpu.cards.testA);
            }
          });
        }
      }]
    }]
  },
  titleHeight: 50,
  titleStyle: {
    "background-color": "#f6f6f6",
    "box-shadow": "0px 1px 0px #f0f0f0"
  },
  task: {
    "style": {
      "padding": '5px 15px',
      "overflow": "auto"
    },
    template: '<div component="CardItem" cardName="testA" style="width: 100%; height: 100%; position: relative; text-align: center;"></div>',
    promise: {
      beforeRender: function (container, data, task) {

      },
      afterRender: function (container, data, task) {
        
      }
    }
  }
});