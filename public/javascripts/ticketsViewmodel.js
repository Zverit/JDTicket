window.ticketModel = function () {
    var datacontext = window.datacontext();

    var firstName = ko.observable("Bert");
    var lastName = ko.observable("Berlington");
    var tickets = ko.observable();

    datacontext.getPersonal(tickets);
    return {
        firstName: firstName,
        lastName: lastName,
        tickets:tickets
    };
};


$(document).ready(function() {

    ko.applyBindings(window.ticketModel());
});