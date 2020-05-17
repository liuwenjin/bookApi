webCpu.interface = {
  menuData: {
      url: "config/find",
      query: {
        object: "sUserIndex"
      },
      requestType: "get",
      dataType: "json",
      flag: 1
    },
    bookIntroduce: {
      url: "config/find",
      query: {
        object: "storage",
        // current: "study",
        prefix: "bookData/liuwenjin"
      },
      requestType: "get",
      dataType: "json",
      flag: 1
    },
    bookManager: {
      url: "config/find",
      query: {
        object: "storage",
        // current: "study",
        prefix: "bookData/liuwenjin"
      },
      requestType: "get",
      dataType: "json",
      flag: 1
    },
    configBook: {
      url: "/configFolder",
      requestType: "post",
      dataType: "json",
      query: {
        key: "name",
        value: ""
      },
      flag: 1
    },
    pageManager: {
      url: "index",
      query: {
        folder: ""
      },
      requestType: "get",
      dataType: "json",
      flag: 1
    },
    configPage: {
      url: "/configFile",
      requestType: "post",
      dataType: "json",
      query: {
        key: "name",
        value: ""
      },
      flag: 1
    },
    bookIndex: {
      url: "/bookIndex",
      requestType: "post",
      dataType: "json",
      query: {
        data: []
      },
      flag: 1
    },
    removeFolder: {
      url: "/removeFolder",
      requestType: "post",
      dataType: "json",
      query: {
        key: "name",
        value: ""
      },
      flag: 1
    },
    removeFile: {
      url: "/removeFile",
      requestType: "post",
      dataType: "json",
      query: {
        key: "name",
        value: ""
      },
      flag: 1
    },
    createFolder: {
      url: "/createFolder",
      requestType: "post",
      dataType: "json",
      flag: 1
    },
    uploadFile: {
      url: "/uploadFile",
      requestType: "post",
      dataType: "json",
      flag: 1
    },
    login: {
      url: "config/verify",
      query: {
        object: "userIndex",
        key: "liuwenjin",
        value: "e417cf050bbbd0d651a48091002531fe", //123456
        flag: 1
      },
      requestType: "post",
      dataType: "json",
      flag: 1
    }
}

webCpu.plugin = {
  signIn: {
    url: "cards/signIn.js",
    key: "transweb_signIn",
  },
  bookManager: {
    url: "cards/manageDataTable.js",
    key: "manageDataTable",
    interface: "bookManager",
    callback: function (c, d, t) {
      d.task.query.key = "";
      d.task.dataFilter = function (tData) {
        tData = tData.data || tData;
        var ret = [];
        for (var k in tData) {
          if (k === "index") {
            continue;
          }
          var item = tData[k];
          item.children.map(function (t) {
            item.url = webCpu.indexToPageUrl(t, "", k);
            return item;
          });
          item.id = k;
          ret.push(item);
        }
        if (tData.index) {
          ret.sort(function (a, b) {
            return tData.index.indexOf(a.id) - tData.index.indexOf(b.id);
          })
        }
        return ret;
      }
    }
  },
  pageManager: {
    url: "cards/pageDataTable.js",
    key: "pageDataTable",
    interface: "pageManager"
  },
  managerContainer: {
    url: "cards/managerContainer.js",
    key: "transweb_managerContainer"
  },
  bookList: {
    "key": 'transweb_bookList',
    "url": "cards/bookList.js",
    "interface": "bookManager",
    "callback": function (c, d, t) {
      delete d.task.query.key;
      d.task.dataFilter = function (tData) {
        tData = tData.data || tData;
        var ret = [];
        for (var k in tData) {
          if (k === "index") {
            continue;
          }
          var item = tData[k];
          item.id = k;
          item.children = item.children || [];
          var temp = item.children.map(function (t) {
            t.url = webCpu.indexToPageUrl(t, "", k);
            return t;
          });
          item.children = temp;
          ret.push(item);
        }
        if (tData.index) {
          ret.sort(function (a, b) {
            return tData.index.indexOf(a.id) - tData.index.indexOf(b.id);
          })
        }
        return ret;
      }
      d.task.promise.clickCallback = function (key, info) {
        webCpu.startReadBook(key, info);
      }
      d.breadcrumb = webCpu.initData.breadcrumb;
    }
  },
  bookContent: {
    "key": 'transweb_bookContent',
    "url": "cards/bookContent.js"
  },
  bookIntroduce: {
    url: "cards/bookIntroduce.js",
    key: "transweb_bookIntroduce",
    interface: "bookIntroduce",
    callback: function (c, d, t) {

    }
  },
  transwebBook: {
    url: "cards/book.js",
    key: "transweb_book"
  },
  articleEditor: {
    url: "cards/articleEditor.js",
    key: "transweb_articleEditor",
    callback: function (c, d, t) {
      d.task.type = "markdown"
    }
  }
}

webCpu.initData = {
  breadcrumb: [],
  title: "藏书阁"
}

webCpu.style = {
  dialog: {
    "width": "300px",
    "height": "150px",
    "border": "solid 1px #f2f2f2",
    "box-shadow": "1px 1px 1px #000",
    "background": "#fff",
    "border-radius": "3px",
    "padding-left": "20px"
  },
  configBookDialog: {
    "width": "300px",
    "height": "300px",
    "border": "solid 1px #f2f2f2",
    "box-shadow": "1px 1px 1px #000",
    "background": "#fff",
    "border-radius": "3px",
    "padding-left": "20px"
  },
  article: {
    "max-width": "900px",
    "width": "95%",
    "height": "98%",
    "border": "solid 1px #f2f2f2",
    "box-shadow": "1px 1px 1px #000",
    "background": "#fff",
    "border-radius": "3px",
    "padding-left": "20px"
  },
  editor: {
    "max-width": "900px",
    "width": "100%",
    "height": "100%",
    "box-shadow": "1px 1px 1px #000",
    "background": "#fff",
    "padding-left": "20px"
  }
}