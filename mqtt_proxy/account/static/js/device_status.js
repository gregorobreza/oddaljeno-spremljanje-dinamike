// Create a client instance
client = new Paho.MQTT.Client("127.0.0.1", Number(9001), "device-status");
let device_json

// set callback handlers
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;

// connect the client
client.connect({onSuccess:onConnect, userName:"gobreza", password:"Django4064"});


// called when the client connects
function onConnect() {
  // Once a connection has been made, make a subscription and send a message.
  console.log("client connected");
  client.subscribe("raspberry/status");
  message = new Paho.MQTT.Message("status");
  message.destinationName = "raspberry/check";
  client.send(message);
}

// called when the client loses its connection
function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
    console.log("onConnectionLost:"+responseObject.errorMessage);
  }
}

// called when a message arrives
function onMessageArrived(message) {
    if (message.destinationName == "raspberry/status"){
        device_json = JSON.parse(message.payloadString)
        //console.log(device_json)
    }else {
        console.log("onMessageArrived:"+message.payloadString);
    }

}

const value = JSON.parse(document.getElementById('hello-data').textContent);
console.log(value)

const intervalID = setInterval(myCallback, 1000*10);

function myCallback()
{
  console.log("tukile")
  console.log(device_json)
  message = new Paho.MQTT.Message("status");
  message.destinationName = "raspberry/check";
  client.send(message);
  if (device_json === null){
    console.log("disonnected");
  }
  else{
    console.log("connected")
    device_json = null
  }

  

}
