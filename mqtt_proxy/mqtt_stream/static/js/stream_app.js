let NUM_POINTS = 10000;

//tudi za mqtt!
const roomName = JSON.parse(document.getElementById('room-name').textContent);
//grafi



let pointData1 = [];
let pointData2 = [];

const decimation = {
    enabled: true,
    algorithm: 'min-max',
/*     algorithm: 'lttb',
    samples: 10000  */
};


for (let i = 0; i < NUM_POINTS; ++i) {
    pointData1.push({ x: i, y: null });
    pointData2.push({ x: i, y: null });
    };



const data = {
    //labels: labels,
    datasets: [{
        label: 'My First dataset',
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgb(255, 99, 132)',
        data: pointData1,
        radius: 0,
    }]
};

const config = {
    type: 'line',
    data: data,
    options: {
        plugins: {
            decimation: decimation,
        },
        scales: {
            x: {
                type: 'linear',
                min: 0,
                max: NUM_POINTS,
                    ticks: {
                    source: 'auto',
                    maxRotation: 0,
                    minRotation: 0,
                    autoSkip: true,
                }
            },
            y: {
                type: 'linear',
                min: -3000,
                max: 3000
            } 
        },
        
        animation: false,
        spanGaps: true,
        showLine: true,
        normalized: false,
        parsing: false,
    }
};

var myChart1 = new Chart(
    document.getElementById('myChart-1'),
    config
);

var myChart2 = new Chart(
  document.getElementById('myChart-2'),
  config
);


function updateCart(chart, points) {
    chart.data.datasets[0].data = points;   

    chart.update()
}

//websockets
const chatSocket = new WebSocket(
    'ws://'
    + window.location.host
    + '/ws/'
    + roomName
    + '/data/'
);

chatSocket.binaryType = "arraybuffer"



chatSocket.onmessage = function(e) {
    let bytearray = new Int16Array(e.data);
    let normalArray = Array.from(bytearray);

    let channel1 = []
    let channel2 = []
    //updateCart(myChart1)
    //updateCart(myChart2)
    for (let i = 0; i < normalArray.length; ++i) {
        if (i%2){
            channel1.push(normalArray[i]);
        }else{
            channel2.push(normalArray[i]);
        }

    }
    for (let i = 0; i < NUM_POINTS; ++i) {
        pointData1[i].y = channel1[i]
        pointData2[i].y = channel2[i]
        // pointData1.push({ x: i, y: channel1[i] });
        // pointData2.push({ x: i, y: channel2[i] });
    }
    updateCart(myChart1, pointData1)
    updateCart(myChart2, pointData2)
    //console.log(pointData1)
    //console.log(pointData2)
    //const data = JSON.parse(e.data);
    //document.querySelector('#chat-log').value += (data.message + '\n');
};

chatSocket.onclose = function(e) {
    console.error('Chat socket closed unexpectedly');
};




//MQTT
// Create a client instance
client = new Paho.MQTT.Client("127.0.0.1", Number(9001), "device-status");


// set callback handlers
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;

// connect the client
client.connect({onSuccess:onConnect, userName:"gobreza", password:"Django4064"});


// called when the client connects
function onConnect() {
  // Once a connection has been made, make a subscription and send a message.
  console.log("client connected");
    client.subscribe(roomName + "/control");
    

}

// called when the client loses its connection
function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
    console.log("onConnectionLost:"+responseObject.errorMessage);
  }
}

// called when a message arrives
function onMessageArrived(message) {
  //console.log(message.payloadString)

}

//kontrolna forma
function handleFormSubmit(event) {
    event.preventDefault();
    
    const data = new FormData(event.target);
    
    let formJSON = Object.fromEntries(data.entries());

    for(let prop in formJSON){
        if(formJSON.hasOwnProperty(prop) && formJSON[prop] !== null && !isNaN(formJSON[prop])){
            formJSON[prop] = +formJSON[prop];   
        }
    }
  
    let obj
    if(event.submitter.name === "start"){
        console.log("starting")
        obj = "on"
    }else if(event.submitter.name === "stop"){
        console.log("stopping")
        obj = "off"
    }

    formJSON["stream"] = obj
    formJSON["format"] = "int16"


    message = new Paho.MQTT.Message(JSON.stringify(formJSON));
    message.destinationName = roomName+"/control";
    client.send(message);
    // chatSocket.send(JSON.stringify({
    //     'message': formJSON
    // }));
    console.log(formJSON);
    //const results = document.querySelector('.results pre');
    //results.innerText = JSON.stringify(formJSON, null, 2);
  }
  
  const form = document.querySelector('.contact-form');
  form.addEventListener('submit', handleFormSubmit);





  
 
  