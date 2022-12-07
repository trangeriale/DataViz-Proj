//const { filter } = require("d3-array")

//const { svg } = require("d3")

Promise.all([
    d3.csv("https://raw.githubusercontent.com/trangeriale/DataViz-Proj/getPriceData/cpugpu.csv"),
    d3.csv("https://raw.githubusercontent.com/trangeriale/DataViz-Proj/getPriceData/cpu_price.csv"),
    d3.csv("https://raw.githubusercontent.com/trangeriale/DataViz-Proj/getPriceData/gpu_price.csv")
]).then((files) => {
    cpugpu = files[0]
    cpuPrice = files[1]
    gpuPrice = files[2]
    vizData(cpugpu, cpuPrice, gpuPrice)
}).catch((error) => {
    console.log(error)
})

const processRating = (rating) => {
    return parseFloat(rating.slice(0, rating.length - 1))
}

//onsole.log(processRating("50%"))
function vizData(ratingData, priceCPU, priceGPU) {
    /*
    create two axis with work perform from cpugpu set
    price from the price set
    half circle based on rating for each type of device
    how do I query the brand and color code
    case switch? oh or filter func js
    */
    const CPUList = ["AMD Ryzen", "AMD", "Intel"]
    const GPUList = ["AMD", "Intel", "Nvidia"]
    const CPUScale = d3.scaleOrdinal()
        .domain(CPUList)
        .range(["#C4663A", "black", "#015FF5"])
    const GPUScale = d3.scaleOrdinal()
        .domain(GPUList)
        .range(["#FFFFFF", "#2C66AF", "#76B900"])

    const categorizeDevice = (name, list) => {
        return list.filter((d) => name.includes(d))[0]
    }

    //console.log(categorizeDevice("AMD Ryzen 9 3900x", CPUList))
    const priceGPUObj = {}
    for (let price in priceGPU) {
        if (price == priceGPU.length - 1) {
            break
        }
        let priceStr = priceGPU[price].eBayAveragePriceNovember
        priceGPUObj[priceGPU[price].GPU] = parseInt(priceStr.slice(1).replace(',', ''))
    }
    const priceCPUObj = {}
    for (let price in priceCPU) {
        //console.log(priceCPU[price])
        if (price == priceCPU.length - 1) {
            break
        }
        let priceStr = priceCPU[price].Price
        //onsole.log(priceStr)
        priceCPUObj[priceCPU[price].CPU] = parseInt(priceStr.slice(1).replace(',', ''))
    }
    const rescaleFactor = 15;
    const m = 100; //margin
    let height = Math.max(document.documentElement.clientHeight * 95 / 100 - m || 0, window.innerHeight * 95 / 100 - m || 0);
    let width = Math.max(document.documentElement.clientWidth * 95 / 100 - m || 0, window.innerWidth * 95 / 100 - m || 0)

    ratingData.forEach(d => {
        if (priceGPUObj[d.GPU] && priceCPUObj[d.CPU]) {
            d.GPUPrice = priceGPUObj[d.GPU];

            d.CPUPrice = priceCPUObj[d.CPU];
        }
    })

    const workPerformance = d3.extent(ratingData, d => {
        if (d.GPUPrice && d.CPUPrice) {
            return processRating(d.workRating)
        }
    })

    const workPerfScale = d3.scaleLinear().domain(workPerformance)
        .range([height - m, m])

    //  console.log("work", workPerformance)

    const priceDomain = d3.extent(ratingData, d => d.CPUPrice + d.GPUPrice)
    //   console.log("price", priceDomain)

    const priceScale = d3.scaleLinear().domain(priceDomain).range([m / 4, width - 5 * m / 4]).nice()

    const dashBoard = d3.select("body").select("#main-viz")
        .append("svg")
        .attr("class", "pcviz")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("width", width)
        .attr("height", height)

    dashBoard.append("defs").append("SVG:clipPath")
        .attr("id", "clip")
        .append("SVG:rect")
        .attr("width", width - m)
        .attr("height", height - m * 3 / 2)
        .attr("x", m)
        .attr("y", m / 2)

    const dataField = dashBoard.append('g').attr('clip-path', "url('#clip')");

    /*
    append axes label
    */
    dashBoard.append("text")
        .attr("text-anchor", "middle")
        .attr("x", m)
        .attr("y", m / 2)
        .html("PC Rating")
        .attr("tabindex", "0")
        .style("font-size", "1rem")
        .style("font-weight", "800")

    dashBoard.append("text")
        .attr("text-anchor", "middle")
        .attr("x", width - m)
        .attr("y", height - m / 2)
        .html("Build Price")
        .style("font-size", "1rem")
        .style("font-weight", "800")

    const yAxisInit = d3.axisLeft(workPerfScale)
        .tickSize(10)
        .ticks(15, "+f")
        .tickFormat(d => d);

    const yAxis = dashBoard.append("g")
        .attr("id", "y-axis")
        .attr("transform", `translate(${m},${0})`)
        .style("font", "1rem Roboto Mono")
        .call(yAxisInit)

    const xAxisInit =
        d3.axisBottom(priceScale)
            .tickSize(10)
            .ticks(width / 50)
            .tickFormat(d => d);

    const xAxis = dashBoard.append("g").attr("id", "x-axis")
        .attr("transform", `translate(${m},${height - m})`)
        .style("font", "0.75rem Roboto Mono")
        .call(xAxisInit);

    window.addEventListener('resize', () => {
        //width = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
        width = window.innerWidth
        //height = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
        height = window.innerHeight

        dashBoard.selectAll("g.tick text")
            .attr("font-size", "1em")
            .call(d3.axisBottom(priceScale)
                .ticks(width / 50))
    })

    /*     const popOverDataPoint = (eventDataPoint) => {
            console.log(eventDataPoint, "cliciked on");
            const clickedId = `info-${eventDataPoint.srcElement.id}`
            const newDataClicked = dashBoard
                .append("rect")
                .attr("position", "absolute")
                .attr("class", "open")
                .attr("id", clickedId)
                .attr("transform", `translate(${eventDataPoint.x}, ${eventDataPoint.y - m})`)
                .attr("width", "200")
                .attr("height", "200")
            //.style("fill", "red")
    
            compNum += 1
            console.log("click dat", clickedData);
            //console.log(clickedData[0].classList.contains("open"), "open?")
    
            document.addEventListener('click', (event) => {
                let toBeHidden = document.getElementById(clickedId)
                if (event.target.id !== eventDataPoint.srcElement.id || (clickedData.id === `info-${eventDataPoint.id}` && newDataClicked.classList.contains("open"))) {
                    console.log("wahoo");
                    console.log(toBeHidden, "hide")
                    toBeHidden.classList.toggle("open")
                    toBeHidden.setAttribute("style", "display: none")
                } else {
                    toBeHidden.setAttribute("style", "display: inline-block")
                    toBeHidden.classList.toggle("open")
                }
            })
    
            clickedData = newDataClicked;
        } */
    /*  let compareList = []; */

    /*     const clickDataPoint = (dataPoint) => {
            const dataPointElem = document.getElementById(dataPoint.srcElement.id)
    
            compareList.push(dataPointElem)
    
            //add dotted circle outside based on higher rating here
    
            if (compareList.length > 3) {
                compareList.shift();
            }
        } */

    let compNum = 0

    let dataDetail

    const clickDataPoint = (dataPoint) => {
        if (compNum >= 3) {
            d3.select(".dataToCompare:first-of-type").remove()
        }

        dataDetail = d3.select("#data-detail")
            .append("div")
            .attr("class", "dataToCompare")
            .style("padding", "1.5em 1em")
            .style("background-color", "white")
            .style("border", "2px solid #CFCFCF")
            .style("border-radius", "0.5em")
            .style("text-align", "left")
            .style("margin", "0.5em")
        dataDetail.html(`CPU: ${dataPoint.srcElement.__data__.CPU} <br>
                            GPU: ${dataPoint.srcElement.__data__.GPU} <br>
                            CPU Rating: ${dataPoint.srcElement.__data__.CPURating} <br>
                            GPU Rating: ${dataPoint.srcElement.__data__.GPURating} <br>
                            Total price: ${priceCPUObj[dataPoint.srcElement.__data__.CPU]
            + priceGPUObj[dataPoint.srcElement.__data__.GPU]} <br>
            Work rating: ${dataPoint.srcElement.__data__.workRating} `)
        compNum += 1
    }
    const gap = 2;
    let buildPrice;
    let radiusLeft;
    let radiusRight;
    let path;
    let y;

    dataField.append("g").attr("id", "gpuViz")
        .selectAll("path")
        .data(ratingData)
        .enter()
        .append("g")
        .append("path")
        .on("click", (d) => console.log(d))
        .attr("id", (d) => `id-${d.Index}`)
        .attr("class", "datapoint gpuData")
        .attr("d", (d) => {
            if (d.GPUPrice && d.CPUPrice) {
                buildPrice = priceScale(d.GPUPrice + d.CPUPrice)
                radiusLeft = (processRating(d.GPURating)) / rescaleFactor
                y = workPerfScale(processRating(d.workRating))
                path = `M ${buildPrice + m} ${y - radiusLeft} A ${radiusLeft} ${radiusLeft} 0 0 0 ${buildPrice + m} ${y + radiusLeft}`
                return path
            }
        })
        .attr("fill", (d) => GPUScale(categorizeDevice(d.GPU, GPUList)))
        .attr("stroke", "black")
        .on("click", clickDataPoint)

    dataField.append("g").attr("id", "cpuViz")
        .selectAll("path")
        .data(ratingData)
        .enter()
        .append("path")
        .attr("id", (d) => `id-${d.Index}`)
        .on("click", (d) => console.log("d is", d))
        .attr("class", "datapoint cpuData")
        .attr("d", (d) => {
            if (d.GPUPrice && d.CPUPrice) {
                buildPrice = priceScale(d.GPUPrice + d.CPUPrice)
                radiusRight = (processRating(d.CPURating)) / rescaleFactor
                y = workPerfScale(processRating(d.workRating))
                path = `M ${buildPrice + m + gap} ${y - radiusRight} A ${radiusRight} ${radiusRight} 180 0 1 ${buildPrice + m + gap} ${y + radiusRight}`
                return path
            }
        })
        .attr("fill", (d) => CPUScale(categorizeDevice(d.CPU, CPUList)))
        .attr("stroke", "black")
        .on("click", clickDataPoint)

    const view = dashBoard.append("rect").attr("class", "view")
        .attr("fill", "none")
        .attr("x", `${m / 2}`)
        .attr("width", `${width - m / 2}`)
        .attr("height", `${height}`);

    function zoomed({ transform }) {
        //console.log(transform, "transform")
        view.attr("transform", transform);
        let newPriceScale = transform.rescaleX(priceScale);
        let newWorkPerfScale = transform.rescaleY(workPerfScale);

        // update axes with these new boundaries
        xAxis.call(xAxisInit.scale(newPriceScale));
        yAxis.call(yAxisInit.scale(newWorkPerfScale));

        // update circle position
        dashBoard
            .selectAll("path.datapoint.gpuData")
            .attr("d", (d) => {
                if (d.GPUPrice && d.CPUPrice) {
                    buildPrice = newPriceScale(d.GPUPrice + d.CPUPrice)
                    radiusLeft = (processRating(d.GPURating)) / rescaleFactor
                    y = newWorkPerfScale(processRating(d.workRating))
                    path = `M ${buildPrice + m} ${y - radiusLeft} A ${radiusLeft} ${radiusLeft} 0 0 0 ${buildPrice + m} ${y + radiusLeft}`
                    return path
                }
            }
            )

        dashBoard.selectAll("path.datapoint.cpuData")
            .attr("d", (d) => {
                if (d.GPUPrice && d.CPUPrice) {
                    buildPrice = newPriceScale(d.GPUPrice + d.CPUPrice)
                    radiusRight = (processRating(d.CPURating)) / rescaleFactor
                    y = newWorkPerfScale(processRating(d.workRating))
                    path = `M ${buildPrice + m + gap} ${y - radiusRight} A ${radiusRight} ${radiusRight} 180 0 1 ${buildPrice + m + gap} ${y + radiusRight}`
                    return path
                }
            })
    }

    const zoom = d3.zoom()
        .scaleExtent([.5, 20])  // This control how much you can unzoom (x0.5) and zoom (x20)
        .extent([[0, 0], [width, height]])
        .on("zoom", zoomed);

    function reset() {
        dashBoard.transition()
            .duration(750)
            .call(zoom.transform, d3.zoomIdentity);
    }

    Object.assign(dashBoard.call(zoom).node(), { reset });
}