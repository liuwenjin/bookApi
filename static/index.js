transweb_cn({
  routerOption: {
    "index": {
      "url": "modules/index.js",
      "children": {
        "testA": webCpu.plugin.bookList
      },
      "callback": function (c, d, t) {
        d.titleData.title = webCpu.initData.title;
        d.titleData.menu = [];
        for(var k in this.menuData) {
          var item = {
            name: k,
            children: []
          }
          var children = this.menuData[k];
          if(children && children.length > 0) {
            for(var i = 0; i < children.length; i++) {
              var tItem = {
                name: children[i].name,
                key: children[i].key,
                callback: function(d) {
                  console.log(d);
                  var key = this.key;
                  var card = webCpu.cards.testA;
                  card.breadcrumb = [d.name, this.name];
                  card.task.query.current = key;
                  webCpu.CardItem.fresh(card);
                }
              }
              item.children.push(tItem);
            }
          }
          d.titleData.menu.push(item);
        }
        var mData = d.titleData.menu;
        if(mData[0] && mData[0].children) {
          webCpu.initData.breadcrumb = [mData[0].name, mData[0].children[0].name];
          webCpu.interface.bookManager.query.current = mData[0].children[0].key;
        }
      }
    },
    "moduleA": {
      "url": "modules/moduleA.js",
      "callback": function (c, d, t) {
        
      }
    },
    "moduleB": {
      "url": "modules/moduleB.js",
      "callback": function (c, d, t) {
        
      }
    }
  }
});