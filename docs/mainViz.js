//const { filter } = require("d3-array")

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
        .range(["#C4663A", "red", "#2B66AF"])
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

    //console.log(priceGPUObj)

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

    //console.log(priceCPUObj)
    let height = 1000
    const m = 100
    let width = Math.max(document.documentElement.clientWidth - m || 0, window.innerWidth - m || 0)

    const controllerH = 0
    const controllerW = 600

    //convert rating data from % string to int and find max and min

    // const workPerfScale = d3.scaleLinear().domain(workPerformance)
    //     .range([height - m, m])
    //     .nice()

    // const priceG = d3.extent(priceGPU, d => parseInt(d.eBayAveragePriceNovember.slice(1).replace(',', '')))
    // //console.log(priceG)

    // const priceC = d3.extent(priceCPU, d => parseInt(d.Price.slice(1)))
    // //console.log(priceC)

    // const priceBuild = [priceG[0] + priceC[0], priceG[1] + priceC[1]]
    // //console.log(priceBuild)
    // //const priceScale = d3.scaleLinear().domain(priceBuild).range([m / 4, width - 5 * m / 4]).nice()
    ratingData.forEach(d => {
        if (priceGPUObj[d.GPU] && priceCPUObj[d.CPU]) {
            d.GPUPrice = priceGPUObj[d.GPU]
            //console.log("GPU Price")

            d.CPUPrice = priceCPUObj[d.CPU]
            //console.log(d.CPUPrice)
        }
    })

    const workPerformance = d3.extent(ratingData, d => {
        if (d.GPUPrice && d.CPUPrice) {
            return processRating(d.workRating)
        }
    })
    //const meanWorkPerf = d3.quantile
    const workRatingArray = ratingData.map((d) => processRating(d.workRating))
    //console.log(workRatingArray)

    const percentile90 = d3.quantile(workRatingArray, 0.95)
    //console.log(percentile90)

    // const workPerfScale = d3.scaleLinear()
    //     .domain([d3.quantile(workRatingArray, 0),
    //     d3.quantile(workRatingArray, 0.95),
    //     d3.quantile(workRatingArray, 1)])
    //     .range([height - m, height / 5, m])
    //     .nice()
    const workPerfScale = d3.scaleLinear().domain(workPerformance)
        .range([height - m, m])

    console.log("work", workPerformance)

    const priceDomain = d3.extent(ratingData, d => d.CPUPrice + d.GPUPrice)
    console.log("price", priceDomain)

    const priceScale = d3.scaleLinear().domain(priceDomain).range([m / 4, width - 5 * m / 4]).nice()

    const dashBoard = d3.select("body")
        .append("svg")
        .attr("class", "pcviz")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("width", width)
        .attr("height", height)

    dashBoard.append("text")
        .attr("text-anchor", "middle")
        .attr("x", m)
        .attr("y", m / 2)
        .html("PC Rating")
        .style("font-size", "1em")
        .style("font-weight", "800")
        .append("text")
        .attr("text-anchor", "middle")
        .attr("x", width - m)
        .attr("y", height - m * 1.5)
        .html("Build Price")
        .style("font-size", "1em")
        .style("font-weight", "800")

    dashBoard.append("g")
        .attr("id", "y-axis")
        .attr("transform", `translate(${m},${0})`)
        .call(d3.axisLeft(workPerfScale)
            .tickSize(5)
            .ticks(15, "+f")
            .tickFormat(d => d))
        .append("g")
        .attr("id", "x-axis")
        .attr("transform", `translate(${0},${height - m})`)
        .call(d3.axisBottom(priceScale)
            .tickSize(5)
            .ticks(width / 50)
            .tickFormat(d => d))

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

    let compNum = 0

    let dataDetail

    const clickDataPoint = (dataPoint) => {
        if (compNum >= 3) {
            //console.log("here")
            d3.select(".dataToCompare:first-of-type").remove()
        }

        dataDetail = d3.select("#dataDetail")
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
        //.style("background-color", "white")
    }
    //now draw the arc hurah
    /*
    what I need for the arc:
    M workRating - radius, price A cpuRating, cpuRating (as the radius)
        rotation(?still dont get why it didn't work) 0 0 0 workRating + 2*radius (the end point)
    1. the position to start drawing

    2. need rating for the arc radius.
    position: 
    */
    const gap = 2;
    let buildPrice;
    let radiusLeft;
    let radiusRight;
    let path;
    let y;


    let gpuData = d3.select("svg.pcviz").append("g").attr("id", "gpuViz")
        .selectAll("path")
        .data(ratingData)
        .enter()
        .append("path")
        .on("click", (d) => console.log(d))
        .attr("class", "datapoint")
        .attr("d", (d) => {
            if (d.GPUPrice && d.CPUPrice) {
                buildPrice = priceScale(d.GPUPrice + d.CPUPrice)
                //console.log(pGPU)
                radiusLeft = (processRating(d.GPURating)) / 15

                //console.log("radius", rea)
                y = workPerfScale(processRating(d.workRating))
                //console.log("y", y)
                path = `M ${buildPrice + m} ${y - radiusLeft} A ${radiusLeft} ${radiusLeft} 0 0 0 ${buildPrice + m} ${y + radiusLeft}`
                return path
            }
        })
        .attr("fill", (d) => GPUScale(categorizeDevice(d.GPU, GPUList)))
        .attr("stroke", "black")
        .on("click", clickDataPoint)

    const cpu = d3.select("svg.pcviz").append("g").attr("id", "cpuViz")

    let cpuData = cpu.selectAll("path")
        .data(ratingData)
        .enter()
        .append("path")
        .on("click", (d) => console.log(d))
        .attr("class", "datapoint")
        .attr("d", (d) => {
            if (d.GPUPrice && d.CPUPrice) {
                buildPrice = priceScale(d.GPUPrice + d.CPUPrice)
                radiusRight = (processRating(d.CPURating)) / 10
                y = workPerfScale(processRating(d.workRating))
                //console.log(y)
                path = `M ${buildPrice + m + gap} ${y - radiusRight} A ${radiusRight} ${radiusRight} 180 0 1 ${buildPrice + m + gap} ${y + radiusRight}`
                //path = "M 50,0 A 25 25 0 0 0 50 50"
                return path
            }
        })
        .attr("fill", (d) => CPUScale(categorizeDevice(d.CPU, CPUList)))
        .attr("stroke", "black")
        .on("click", clickDataPoint)

    const limitPrice = document.querySelector("#limitPrice")

    let customizePriceDomain
    let customPriceScale
    let numFiltered
    //add new price as new domain
    limitPrice.addEventListener("change", (e) => {
        const priceLimit = parseFloat(e.target.value)
        customizePriceDomain = [priceDomain[0], priceLimit]
        console.log("customize", customizePriceDomain)
        //priceDomain = customizePriceDomain
        customPriceScale = d3.scaleLinear().domain(customizePriceDomain).range([m / 4, width - 5 * m / 4]).nice()
        //console.log("customize scale", customPriceScale(442))

        dashBoard.select("g#x-axis")
            .call(d3.axisBottom(customPriceScale)
                .tickSize(5)
                .ticks(width / 50)
                .tickFormat(d => d))

        const filteredData = []

        ratingData.forEach(d => {
            if ((d.GPUPrice + d.CPUPrice) <= priceLimit) {
                numFiltered += 1
                filteredData.push(d)
            }
        })
        console.log("fitler", filteredData)
        gpuFiltered = d3.select("svg.pcviz")
            .select("g#gpuViz")
            .selectAll("path.datapoint")
            .data(filteredData)

        //if (numFiltered < ratingData.length) {
        //  console.log("l", filteredData.length)
        gpuFiltered.exit()
            .remove()
        //}

        gpuFiltered.enter()
            .append("path")
            .attr("class", "datapoint")
            .attr("d", (d) => {
                //if (d.GPUPrice && d.CPUPrice) {
                buildPrice = customPriceScale(d.GPUPrice + d.CPUPrice)
                //console.log(pGPU)
                radiusLeft = (processRating(d.GPURating)) / 15

                //console.log("radius", rea)
                y = workPerfScale(processRating(d.workRating))
                //console.log("y", y)
                path = `M ${buildPrice + m} ${y - radiusLeft} A ${radiusLeft} ${radiusLeft} 0 0 0 ${buildPrice + m} ${y + radiusLeft}`
                return path
                //}
            })
            .attr("fill", (d) => GPUScale(categorizeDevice(d.GPU, GPUList)))
            .attr("stroke", "black")
            .on("click", clickDataPoint)

        cpuFiltered = d3.select("svg.pcviz")
            .select("g#cpuViz")
            .selectAll("path.datapoint")
            .data(filteredData)

        //if (numFiltered < filteredData.length) {
        cpuFiltered.exit()
            .remove()
        //}

        cpuFiltered.enter()
            .append("path")
            .on("click", (d) => console.log(d))
            .attr("class", "datapoint")
            .attr("d", (d) => {
                if (d.GPUPrice && d.CPUPrice) {
                    buildPrice = customPriceScale(d.GPUPrice + d.CPUPrice)
                    radiusRight = (processRating(d.CPURating)) / 10
                    y = workPerfScale(processRating(d.workRating))
                    //console.log(y)
                    path = `M ${buildPrice + m + gap} ${y - radiusRight} A ${radiusRight} ${radiusRight} 180 0 1 ${buildPrice + m + gap} ${y + radiusRight}`
                    //path = "M 50,0 A 25 25 0 0 0 50 50"
                    return path
                }
            })
            .attr("fill", (d) => CPUScale(categorizeDevice(d.CPU, CPUList)))
            .attr("stroke", "black")
            .on("click", clickDataPoint)
    })
}