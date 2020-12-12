$('#word').bind("enterKey",function(e){
    //do stuff here
    console.log('e', e)
    alert(e)
});

$('#word').keyup(function(e){
    if(e.keyCode == 13)
    {
        $(this).trigger("enterKey");
        alert(e)
    }
});

console.log('hello')

console.log("input", $('input'))