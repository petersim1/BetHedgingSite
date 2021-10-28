$('#open-modal').click(function() {
    $('.modal').show()
    $('#main').css({opacity:'0.2'})
    $('footer').hide()
})

window.onclick = function(event) {

    if (event.target.id != 'open-modal') {
        if (!event.target.closest('.container-modal')) {
            $(".modal").hide();
            $('#main').css({opacity:'1'})
            $('footer').show()
        }

    }
}

$('.get-example').click(function() {

    let ind = $('.get-example').index(this)

    $($('.scenario').get(ind)).toggle()
})



$("#getRes").submit(function() {

    var formDataObj = {}

    $(this).serializeArray().forEach(function(element) {
        formDataObj[element['name']] = Number(element['value'])
    })

    const initWager = formDataObj['init-wager']
    const initProfit = formDataObj['init-profit']
    const hedgeOdds = formDataObj['hedge-odds']

    console.log(formDataObj)

    globalThis.initWager = initWager;
    globalThis.initProfit = initProfit;
    globalThis.hedgeOdds = hedgeOdds;

    const optHedgeAmount = optHedge(hedgeOdds,initWager,initProfit)
    const payoutAmount = payout(hedgeOdds,optHedgeAmount)

    $('#result').text(String(optHedgeAmount.toFixed(2)))
    $('#winnings').text(String((payoutAmount - initWager).toFixed(2)))

    $('#res').show()

    if (payoutAmount - initWager <= 0) {
        $('#note').text('NO profitable strategy...')
        $('#slider').hide()
    }
    else {
        $('#note').text('With this method, you CAN ensure profit...')
        $('#slider').show()
    }

    // genPlot(formDataObj['init-wager'],formDataObj['init-profit'],formDataObj['hedge-odds'])
    // genTable(formDataObj['init-wager'],formDataObj['init-profit'],formDataObj['hedge-odds'])
    $('input[type=range]').attr('value',optHedgeAmount)
    $('input[type=range]').attr('min',0)
    $('input[type=range]').attr('max',initProfit)

    $('#hedgeWager').text(optHedgeAmount.toFixed(2))
    $('#hedgeWinsp').text((payout(hedgeOdds,$('input[type=range]').attr('value'))-initWager).toFixed(2))
    $('#hedgeLosesp').text((initProfit-$('input[type=range]').attr('value')).toFixed(2))
     
})


const updateVal = (val) => {
    $('#hedgeWager').text(Number(val).toFixed(2))
    $('#hedgeWinsp').text(Number(payout(hedgeOdds,val)-initWager).toFixed(2))
    $('#hedgeLosesp').text(Number(initProfit - val).toFixed(2))
    $('input[type=range]').attr('value',val)
}

// const genData = (initWager,initProfit,hedgeOdds) => {

//     const numSteps = 20
//     const increment = (initProfit)/(numSteps-1)
//     const netZero = netZeroWager(hedgeOdds,initWager)
//     const optHedgeAmount = optHedge(hedgeOdds,initWager,initProfit)

//     console.log(netZero)

//     let data = [
//         {name:"Hedge Bet Wins",values:[]},
//         {name:"Hedge Bet Loses",values:[]}
//     ] 

//     for (let i=0;i<numSteps;i++) {
//         if (i*increment>netZero && (i-1)*increment<netZero) {
//             data[0].values.push({x:netZero,y:0})
//             data[1].values.push({x:netZero,y:initProfit-netZero})
//         }
//         if (i*increment>optHedgeAmount && (i-1)*increment<optHedgeAmount) {
//             data[0].values.push({x:optHedgeAmount,y:payout(hedgeOdds,optHedgeAmount) - initWager})
//             data[1].values.push({x:optHedgeAmount,y:initProfit - optHedgeAmount})
//         }
//         data[0].values.push({x:i*increment,y:payout(hedgeOdds,i*increment)-initWager})
//         data[1].values.push({x:i*increment,y:initProfit - i*increment})
//     }

//     return data
// }


// const genPlot = (initWager,initProfit,hedgeOdds) => {
    
//     const data = genData(initWager,initProfit,hedgeOdds)

//     const svgWidth = document.querySelector('#viz').clientWidth

//     const margin = {top:60,bottom:70,left:80,right:30}
//     const svgHeight = 350
//     const width = svgWidth - margin.left - margin.right
//     const height = svgHeight - margin.top - margin.bottom
//     const legendMargin = 20
//     const legendFont = 16

//     d3.select('svg').selectAll("*").remove()
//     const svg = d3.select('svg')
//         .append("g")
//         .attr("transform", `translate(${margin.left},${margin.top})`);
//     const myColor = d3.scaleOrdinal(d3.schemeTableau10)

//     const yScale = d3
//         .scaleLinear()
//         .domain([-initWager,d3.max(data, d => d3.max(d.values, g => g.y) )])
//         .rangeRound([height, 0]);
//     const yAxis = d3
//         .axisLeft(yScale)
//         .ticks(5)
//         .tickFormat((val) => `$${val}`)
//     const yAx = svg.append('g')
//         .attr('class','y-axis')
//         .call(yAxis);
//     yAx.selectAll("line").attr("stroke", "rgba(255, 255, 255, 0.2)");
//     yAx.selectAll("text").attr("fill", "white").attr("font-size", ".8rem");

//     const xScale = d3
//         .scaleLinear()
//         .domain([0,initProfit])
//         .rangeRound([0, width]);
//     const xAxis = d3
//         .axisBottom(xScale)
//         .ticks(5)
//         .tickFormat((val) => `$${val}`)
//     const xAx = svg.append("g")
//         .attr('class','x-axis')
//         .attr("transform", `translate(0, ${yScale(0)})`)
//         .call(xAxis);
//     xAx.selectAll("line").attr("stroke", "rgba(255, 255, 255, 0.2)");
//     xAx.selectAll("text")
//         .attr("color", "white").attr("font-size", ".8rem")
//         .attr("transform", 'translate(-10, 0) rotate(-45)')
//         .attr('text-anchor','end');
//     svg
//         .append("text")
//         .attr("class", "x-label")
//         .attr("fill","white")
//         .attr("font-size", "1rem")
//         .attr("text-anchor", "middle")
//         .attr("x", width/2)
//         .attr("y", height + margin.bottom-legendFont)
//         .text("Amount Hedged");
//     svg
//         .append("text")
//         .attr("class", "y-label")
//         .attr("fill","white")
//         .attr("font-size", "1rem")
//         .attr("text-anchor", "middle")
//         .attr("x",-height/2)
//         .attr("y", -margin.left + legendFont)
//         .attr("transform","rotate(-90)")
//         .text("Net Profit");

//     const line = d3
//         .line()
//         .x((d) => xScale(d.x))
//         .y((d) => yScale(d.y));
    


//     svg
//         .selectAll(".line")
//         .data(data)
//         .enter()
//         .append("path")
//         .attr("fill", "none")
//         .attr("stroke", (d,i) => myColor(i))
//         .attr("stroke-width", 3)
//         .attr("d", (d) => line(d.values));


//     const LegendHolder = d3.select('svg')
//         .append('g')
//         .attr('class','legend')
//         .attr("transform", `translate(${margin.left+20},0)`);

//     const textPos = (i) => {
//         const y = i*1.35*legendFont + 1.35*legendFont - 3.5/2

//         return `translate(0,${y})`
//     }

//     LegendHolder
//         .selectAll('.legend')
//         .data(data)
//         .enter()
//         .append('text')
//         .attr("transform", (d, i)  => textPos(i))
//         .style("text-anchor", "right")
//         .attr("fill", (d,i) => myColor(i))
//         .text((d) => d.name)

// }

// const genTable = (initWager,initProfit,hedgeOdds) => {
    
//     const data = genData(initWager,initProfit,hedgeOdds)

//     const flat = []
//     data.forEach((d,i) => {
//         d.values.forEach((v,j) => {
//             if (i===0) {
//                 flat.push({"Hedge Wager":Math.round(v.x,3)})
//             }
//             flat[j][d.name] = Math.round(v.y,3)
//         })
//     })

//     d3.select('table').selectAll("*").remove()
//     const table = d3.select('table');
//     const thead = table.append('thead');
//     const tbody = table.append('tbody');

//     const columns = ['Hedge Wager']
//     data.forEach(item => {
//         columns.push(item.name)
//     })

//     thead.append('tr')
//         .style('border-bottom','solid 1px')
// 		.selectAll('th')
// 		.data(columns)
//         .enter()
// 		.append('th')
//         .style('padding-left','5px')
//         .style('padding-right','5px')
// 		.text((d) => d);

//     let rows = tbody.selectAll('tr')
//         .data(flat)
//         .enter()
//         .append('tr')
//         .style('border-bottom-style','solid')
//         .style('border-bottom-width','1px')
//         .selectAll('td')
//         .data((row) => columns.map(col => {
//             return {column:col,value:row[col]}
//         }))
//         .enter()
//         .append('td')
//         .text(function (d) { return d.value; });

// }



const toDecimal = (odds) => {
    let exp = Math.sign(odds)

    return (Math.abs(odds)/100)**exp + 1
}

const payout = (odds,moneyIn) => {
    
    return moneyIn*(toDecimal(odds) - 1)
}

const optHedge = (odds,initWager,initProfit) => {
    
    return (initWager+initProfit)/toDecimal(odds)
}

const netZeroWager = (odds,initWager) => {

    return initWager/(toDecimal(odds) - 1)
}