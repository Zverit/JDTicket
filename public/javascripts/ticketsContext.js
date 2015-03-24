window.dataContext = (function(ko) {
    return {
        getPersonal: getPersonal,
        addTicket: addTicket,
        getExcel: getExcel
    };

    function getPersonal(tickets) {
        $.getJSON("/getalltickets", function(data) {
            tickets(data);
            console.log(tickets());
        });
    }

    function addTicket(id){
        $.post("/adduserticket/" + id, "", function(data, textStatus) {
            console.log(data);
        }, "json");
    }
    function getExcel(){
        window.location.href = '/excel';
    }

})(ko);