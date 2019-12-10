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

$(".post").on('click', function(e){
    e.preventDefault();
    let thisId = $(this).attr("data-id");
    $.ajax("/articles/" + thisId, {
        method: "POST",
        data: {
            body: $("#message" + thisId).val().trim()
        }
    }).then(function(data){
        console.log(data)
        location.reload()
    })
})

$(".delete").on("click", function(event){
    event.preventDefault();
    let thisId = $(this).attr("data-id");
    $.ajax("/articles/" + thisId,{
        method: "DELETE"
        
    }).then(function (results) {
        console.log(results)
        location.reload();
    })
})