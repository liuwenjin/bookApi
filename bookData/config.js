var data = {
  secretId: 'AKIDY1LcsIikszCGAvHADCB5oPsPnRAs60Uv',
  secretKey: 'd9ZxVxX0VBhIC7xiLzgJrLkz63ufJsyw',
  proxy: '',
  duration: 60*60,
  appid: 1254183942,
  bucket: 'transweb',
  region: 'ap-beijing',
  root: "book/",
  allowPrefix: 'userData/liuwenjin/*',
  allowActions: [
    'name/cos:*'
  ],
  limit: {
    count: 1000,
    size: 0.1
  },
  folders: []
}
module.exports = data;