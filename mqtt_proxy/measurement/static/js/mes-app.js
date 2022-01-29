

let files = JSON.parse(document.getElementById('files').textContent).flat();

const imeMeritve = document.querySelector("#meritev").children[0]
const frameRate = document.querySelector("#meritev").children[1]
const duration = document.querySelector("#meritev").children[2]
const date = document.querySelector("#meritev").children[3]
const method = document.querySelector("#meritev").children[4]




//Grafi

NUM_POINTS = 100000

let pointData1 = [];
let pointData2 = [];
let pointData3 = [];


const decimation = {
    enabled: true,
    algorithm: 'min-max',
/*     algorithm: 'lttb',
    samples: 10000  */
};


for (let i = 0; i < NUM_POINTS; ++i) {
    pointData1.push({ x: i, y: null });
    pointData2.push({ x: i, y: null });
    pointData3.push({ x: i, y: null });
    };


    const data1 = {
        //labels: labels,
        datasets: [{
            label: 'Vhod',
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
                    
                        ticks: {
                        source: 'auto',
                        maxRotation: 0,
                        minRotation: 0,
                        autoSkip: true,
                    }
                },
                y: {
                    type: 'linear',
                } 
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
            label: 'Izhod',
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
                    }
                },
                y: {
                    type: 'linear',

                } 
            },
            
            animation: false,
            spanGaps: true,
            showLine: true,
            normalized: false,
            parsing: false,
        }
    };

    const data3 = {
        //labels: labels,
        datasets: [{
            label: 'Izhod',
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: pointData1,
            radius: 0,
        }]
    };

    let config3 = {
        type: 'line',
        data: data3,
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

    var myChart3 = new Chart(
        document.getElementById('myChart-3'),
        config3
      );



      function updateCart(chart, points) {
        chart.data.datasets[0].data = points;
    
        chart.update()
    }
//AJAX

function get_json(file){

    let URL = "download/" + file


fetch(URL, {
    headers:{
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest', //Necessary to work with request.is_ajax()
    },
})
.then(response => {

    return response.json() //Convert response to JSON
    
})
.then(data => {
    //Perform actions with the response data from the view
    console.log(data)
    imeMeritve.textContent = "Meritev: " + data.info["name"]
    frameRate.textContent = "Frekvenca vzorčenja: " + data.info["rate"] + "Hz"
    duration.textContent = "Trajanje zajema: " + data.info["duration"] + "s"
    method.textContent = "Uporabljena metoda: Welch's"

    //graph

    console.log(pointData1)


})

};

files.forEach(element =>
    document.getElementById(element).addEventListener("click", function(){get_json(element)})
    )
