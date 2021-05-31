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

    const optHedgeAmount = optHedge(formDataObj['hedge-odds'],formDataObj['init-wager'],formDataObj['init-profit'])
    const payoutAmount = payout(formDataObj['hedge-odds'],optHedgeAmount)

    $('#result').text(String(optHedgeAmount.toFixed(3)))
    $('#winnings').text(String((payoutAmount - formDataObj['init-wager']).toFixed(3)))

    if (payoutAmount - formDataObj['init-wager'] <= 0) {
        $('#note').text('With this method, you CANNOT ensure profit...')
    }
    else {
        $('#note').text('With this method, you CAN ensure profit...')
    }

    $('#res').show()

})


function toDecimal(odds) {
    let exp = Math.sign(odds)

    return (Math.abs(odds)/100)**exp + 1
}

function payout(odds,money_in) {
    
    return money_in*(toDecimal(odds) - 1)
}

function optHedge(odds,init_wager,init_prof) {
    
    return (init_wager+init_prof)/toDecimal(odds)
}
