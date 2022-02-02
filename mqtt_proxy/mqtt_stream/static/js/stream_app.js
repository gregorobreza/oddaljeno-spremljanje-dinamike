let NUM_POINTS = 8000;

//tudi za mqtt!
const roomName = JSON.parse(document.getElementById('room-name').textContent);


document.getElementById('segments').value = '10';


function displaySegments(id, elementValue) {
    document.getElementById(id).style.display = elementValue.value == "welch" ? 'flex' : 'none';
 }


function Duration() {
    if (document.getElementById('duration').checked) {
        document.getElementById('cas-trajanja').style.display = 'flex';
    } 
    else if(document.getElementById('stream').checked || document.getElementById('triger').checked) {
        document.getElementById('cas-trajanja').style.display = 'none';
   }
}

function Segments(){
    if (document.getElementById("method").value == "welch"){
        document.getElementById("welch-segments").style.display = "flex";
    }
    else if(document.getElementById("method").value == ""){
        document.getElementById("welch-segments").style.display = "none";
    }
}

Segments()
Duration()
document.getElementById("nacin").addEventListener("click", Duration);


//grafi

let measurements = new Array

let pointData1 = [];
let pointData2 = [];


function update_x(el){
    el.addEventListener("input", function(event) {
        NUM_POINTS = Number(el.value)
        pointData1 = [];
        pointData2 = [];
        for (let i = 0; i < NUM_POINTS; ++i) {
            pointData1.push({ x: i, y: null });
            pointData2.push({ x: i, y: null });
            };
        config1.options.scales.x.max = NUM_POINTS
        config2.options.scales.x.max = NUM_POINTS
        updateCart(myChart1, pointData1)
        updateCart(myChart2, pointData2)
    });
}

const rate6 = document.querySelector("#chunk-6000")
update_x(rate6)
const rate8 = document.querySelector("#chunk-8000")
update_x(rate8)
const rate12 = document.querySelector("#chunk-12000")
update_x(rate12)
const rate16 = document.querySelector("#chunk-16000")
update_x(rate16)

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



const data1 = {
    //labels: labels,
    datasets: [{
        label: 'Kanal 1',
        backgroundColor: 'rgb(48, 59, 156)',
        borderColor: 'rgb(48, 59, 156)',
        data: pointData1,
        radius: 0,
    }]
};

let config1 = {
    type: 'line',
    data: data1,
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
                    display: false

                },
                title: {
                    display: true,
                    text: 'Čas'
                  }
            },
            y: {
                type: 'linear',
                min: -30,
                max: 30,
                title: {
                    display: true,
                    text: 'Sila [N]'
                  }
            },


        },
        
        animation: false,
        spanGaps: true,
        showLine: true,
        normalized: false,
        parsing: false,
    }
};

const data2 = {
    //labels: labels,
    datasets: [{
        label: 'Kanal 2',
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgb(255, 99, 132)',
        data: pointData1,
        radius: 0,
    }]
};

let config2 = {
    type: 'line',
    data: data2,
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
                    display: false
                },
                title: {
                    display: true,
                    text: 'Čas'
                  },

            },
            y: {
                type: 'linear',
                min: -6.4,
                max: 6.4,
                title: {
                    display: true,
                    text: 'Pospešek [g]'
                  }
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
    config1
);

var myChart2 = new Chart(
  document.getElementById('myChart-2'),
  config2
);


function updateCart(chart, points) {
    chart.data.datasets[0].data = points;

    chart.update()
}



// inicializacija websockets
const chatSocket = new WebSocket(
    'ws://'
    + window.location.host
    + '/ws/'
    + roomName
    + '/data/'
);
// definicija tipa sporocil
chatSocket.binaryType = "arraybuffer"

// ko je paket prejet
chatSocket.onmessage = function(e) {
    // pretvorimo bufer v cela stevila
    let bytearray = new Int16Array(e.data);
    let normalArray = Array.from(bytearray);

    let channel1 = []
    let channel2 = []
    // locimo kanala
    for (let i = 0; i < normalArray.length; ++i) {
        if (i%2){
            channel1.push(normalArray[i]);
        }else{
            channel2.push(normalArray[i]);
        }
    }
    // napolnimo objekt s podatki
    for (let i = 0; i < NUM_POINTS; ++i) {
        pointData1[i].y = channel1[i]*3/(0.1*2**15)
        pointData2[i].y = channel2[i]*3/(0.47*2**15)

    }
    // posodobimo ze prej definirane grafe
    updateCart(myChart1, pointData1)
    updateCart(myChart2, pointData2)

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
    client.subscribe(roomName + "/measurements");
    sendMessage("list_files", "/check/measurements")
    const refresh = document.querySelector("#refresh-measurement")
    refresh.onclick = function checkMessage(){
        message = new Paho.MQTT.Message("list_files");
        message.destinationName = roomName+"/check/measurements";
        client.send(message);
    }

}

function sendMessage(msg, path){
    message = new Paho.MQTT.Message(msg);
    message.destinationName = roomName+path;
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
    if (message.destinationName == roomName + "/measurements"){
        measurements = JSON.parse(message.payloadString)
        const measurementsList = document.querySelector(".measurements")
        while (measurementsList.firstChild) {
            measurementsList.removeChild(measurementsList.firstChild);
          }
        measurements.forEach(element => {
            const measurement = document.createElement("div");
            measurement.className = "measurement";
            const newContent = document.createTextNode(element);
            measurement.appendChild(newContent)
            measurementsList.appendChild(measurement)
            measurement.onclick = function saveFile(){
                message = new Paho.MQTT.Message(element);
                message.destinationName = roomName+"/check/measurements/download";
                client.send(message);
                window.alert("Če meritev še ni shranjena na strežniku, bo prenešena sedaj. Ogledate si jo lahko v aplikaciji za ogled vaših meritev.")
            }

          });
    }

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
    formJSON["channels"] = 2

    message = new Paho.MQTT.Message(JSON.stringify(formJSON));
    message.destinationName = roomName+"/control";
    client.send(message);

    console.log(formJSON);
  }
  
  const form = document.querySelector('.contact-form');
  form.addEventListener('submit', handleFormSubmit);





  
 
  