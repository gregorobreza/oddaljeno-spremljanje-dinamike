console.log("hello")

let files = JSON.parse(document.getElementById('files').textContent).flat();


console.log(files)

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
})

};

files.forEach(element =>
    document.getElementById(element).addEventListener("click", function(){get_json(element)})
    )




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