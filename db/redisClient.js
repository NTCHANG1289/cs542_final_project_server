const REDIS_URL = 'redis://h:pab8f2258b1d8865f093262be75f81ba9a86b03ad4ee7490369beb947e59352aa@ec2-52-54-87-110.compute-1.amazonaws.com:62429';

var redis = require("redis"),
  client = redis.createClient(REDIS_URL);

client.on("connect", function (connect) {
  // console.log("Connect " + connect);
});

client.on("error", function (err) {
  console.log("Error " + err);
});

// client.set("string key", "string val", redis.print);
// client.get('string key', console.log);