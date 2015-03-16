window.datacontext = function() {
    return {
        getPersonal: getPersonal

    };

    function getPersonal(tickets) {
        $.getJSON("/getalltickets", function(data) {
            tickets(data);
        });
    }


};