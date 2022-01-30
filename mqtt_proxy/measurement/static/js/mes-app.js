

let files = JSON.parse(document.getElementById('files').textContent).flat();

const imeMeritve = document.querySelector("#meritev").children[0]
const frameRate = document.querySelector("#meritev").children[1]
const duration = document.querySelector("#meritev").children[2]
const date = document.querySelector("#meritev").children[3]
const method = document.querySelector("#meritev").children[4]

const zacetek = document.getElementById('input-number-1');
const konec = document.getElementById('input-number-2');

const zacetekVrednost = zacetek.value = "0"
const konecVrednost = konec.value = "4000"


//Grafi

NUM_POINTS = 100000

let pointData1 = [];
let pointData2 = [];
let pointData3 = [];




const decimation = {
    enabled: true,
    algorithm: 'min-max',

};


// for (let i = 0; i < NUM_POINTS; ++i) {
//     pointData1.push({ x: i, y: null });
//     pointData2.push({ x: i, y: null });
//     pointData3.push({ x: i, y: null });
//     };


let data1 = {
        //labels: labels,
        datasets: [{
            label: 'Amplituda',
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
                legend:{
                    display:false
                },
                
            },
            locale: 'fr-FR',
            scales: {
                x: {
                    type: 'linear',
                    min: Number(zacetekVrednost),
                    max: Number(konecVrednost),
                    
                        ticks: {
                        source: 'auto',
                        maxRotation: 0,
                        minRotation: 0,
                        autoSkip: true,
                    },
                    title: {
                        display: true,
                        text: 'f [Hz]'
                      }
                },
                y: {
                    type: 'logarithmic',
                    title: {
                        display: true,
                        text: 'Amplituda [dB]'
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
    
let data2 = {
        //labels: labels,
        datasets: [{
            label: 'Kot',
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
                legend:{
                    display:false
                }
            },
            locale: 'fr-FR',
            scales: {
                x: {
                    type: 'linear',
                    min: Number(zacetekVrednost),
                    max: Number(konecVrednost),
                        ticks: {
                        source: 'auto',
                        min: Number(zacetek),
                        max: Number(konec),
                        autoSkip: true,
                    },
                    title: {
                        display: true,
                        text: 'f [Hz]'
                      }
                },
                y: {
                    type: 'linear',
                    title: {
                        display: true,
                        text: 'Kot [˚]'
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

 let data3 = {
        //labels: labels,
        datasets: [{
            label: 'Koherenca',
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
                legend:{
                    display:false
                }
            },
            locale: 'fr-FR',
            interaction: {
                intersect: false,
                mode: 'index',
              },
            scales: {
                x: {
                    type: 'linear',
                    min: Number(zacetekVrednost),
                    max: Number(konecVrednost),
                        ticks: {
                        source: 'auto',
                        maxRotation: 0,
                        minRotation: 0,
                        autoSkip: true,
                    },
                    title: {
                        display: true,
                        text: 'f [Hz]'
                      }
                },
                y: {
                    type: 'linear',
                    // min: 0,
                    // max: 1,
                    title: {
                        display: true,
                        text: 'Koherenca'
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
    
    let myChart1 = new Chart(
        document.getElementById('myChart-1'),
        config1
    );
    
    let myChart2 = new Chart(
      document.getElementById('myChart-2'),
      config2
    );

    let myChart3 = new Chart(
        document.getElementById('myChart-3'),
        config3
      );



      function updateCart(chart, points) {
        chart.data.datasets[0].data = points;
        chart.update();}

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
    method.textContent = "Uporabljena metoda: Welch's (število segmentov: " + data.info["segments"]+")" 
    date.textContent = "Datum meritve: " + data.info["date"]

    //graph
    let freq = data.freq
    let coh = data.coh
    
    pointData1 = []
    pointData2 = []
    pointData3 = []

    for (let i = 0; i < freq.length; ++i) {
        // pointData1.push({ x: i, y: null });
        // pointData2.push({ x: i, y: null });
        // pointData1.push({ x: freq[i], y: coh[i] });
        // pointData2.push({ x: freq[i], y: coh[i] });
        pointData3.push({ x: freq[i], y: coh[i] });
        };
    console.log(pointData3)

        // // console.log(myChart3.data.datasets[0].data)
        // updateCart(myChart1, pointData1)
        // updateCart(myChart2, pointData2)
    
    
    // updateCart(myChart1, pointData1)
    // updateCart(myChart2, pointData2)
    updateCart(myChart3, pointData3)

})

};

files.forEach(element =>
    document.getElementById(element).addEventListener("click", function(){get_json(element)})
    )
   
    
    
zacetek.addEventListener("change", function(){UpdateChart(zacetek)});
konec.addEventListener("change", function(){UpdateChart(konec)});

function UpdateChart(point){
    if (point == zacetek){
        config1.options.scales.x.min = Number(point.value)
        config2.options.scales.x.min = Number(point.value)
        config3.options.scales.x.min = Number(point.value)
    }
    else{
        config1.options.scales.x.max = Number(point.value)
        config2.options.scales.x.max = Number(point.value)
        config3.options.scales.x.max = Number(point.value)
    }
    updateCart(myChart1, pointData1)
    updateCart(myChart2, pointData2)
    updateCart(myChart3, pointData3)

}



