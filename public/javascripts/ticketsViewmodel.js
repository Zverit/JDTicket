window.ticketModel = (function (ko, dataContext) {
    var tickets = ko.observableArray();
    var check = ko.observable();

    dataContext.getPersonal(tickets);

    function checkCount(ticket){
        return check(this.count > 0);
    }
    return {
        tickets: tickets,
        checkCount: checkCount,
        addTicket: function(){
            dataContext.addTicket(this._id);
        dataContext.getPersonal(tickets);},
        getExcel: function(){dataContext.getExcel()}
    };
})(ko, window.dataContext);

$(document).ready(function() {
    ko.applyBindings(window.ticketModel);
});