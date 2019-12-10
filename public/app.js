$("#scrape").on('click', function(e){
    e.preventDefault();
    $.ajax({
        method: "GET",
        url: "/scrape"
    }).then(function(res){
        if(res === 'completed'){
            location.reload() //reloads page w new content added
        }
    })
})

$(".comment").on('click', function(e){
    e.preventDefault();
    let thisId = $(this).attr("data-id");
    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    }).then(function(res){
        console.log(res)
    })
})