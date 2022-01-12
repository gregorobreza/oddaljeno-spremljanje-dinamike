// Create a client instance
client = new Paho.MQTT.Client("127.0.0.1", Number(9001), "device-status");

const addresses = JSON.parse(document.getElementById('list').textContent).flat();

let device_map = new Map();

addresses.forEach(element => {
  device_map.set(element, null)
});
// set callback handlers
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;

// connect the client
client.connect({onSuccess:onConnect, userName:"gobreza", password:"Django4064"});


// called when the client connects
function onConnect() {
  // Once a connection has been made, make a subscription and send a message.
  console.log("client connected");
  addresses.forEach(element => {
    client.subscribe(element + "/status");
  });
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
  addresses.forEach(element => {
  if (message.destinationName == element + "/status"){
      device_map.set(element, JSON.parse(message.payloadString))
  }
  });

}

// checking if device online
function myCallback(element)
{
  let device_line = document.getElementById(element)
  message = new Paho.MQTT.Message("status");
  message.destinationName = element + "/check";
  client.send(message);
  
  if (device_map.get(element) === null){
    device_line.lastElementChild.innerHTML = "Offline"
    document.getElementById(element).lastElementChild.style.backgroundColor = "#be5151";
    document.getElementById(element).style.borderColor = "#be5151";
  }
  else{
    document.getElementById(element).lastElementChild.innerHTML = "Online"
    document.getElementById(element).lastElementChild.style.backgroundColor = "green"
    document.getElementById(element).querySelector(".device-info").lastElementChild.children[0].innerHTML = "Ime gostitelja: "+ device_map.get(element)["host name"]
    document.getElementById(element).querySelector(".device-info").lastElementChild.children[1].innerHTML = "MAC: "+ device_map.get(element)["MAC"]
    document.getElementById(element).querySelector(".device-info").lastElementChild.children[3].innerHTML = "Oprema: "+ device_map.get(element)["card"]
    document.getElementById(element).style.borderColor = "green";
    device_map.set(element, null)
  }
  
}

addresses.forEach(element => {
  const intervalID = setInterval(myCallback, 1000*10, element);
});

