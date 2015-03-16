window.ticketModel = (function (ko, dataContext) {
    var tickets = ko.observableArray();

    dataContext.getPersonal(tickets);
    return {
        tickets: tickets,
        addTicket: function(){
            dataContext.addTicket(this._id);
        dataContext.getPersonal(tickets);},
        getExcel: function(){dataContext.getExcel()}
    };
})(ko, window.dataContext);

$(document).ready(function() {
    ko.applyBindings(window.ticketModel);
});