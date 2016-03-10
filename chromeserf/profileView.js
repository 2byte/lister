if (location.href.indexOf('#surfer') != -1) {
    var viewLink = $('.console:contains("View Full Profile")');

    location.href = viewLink.attr('href') + '#open-full-profile';
}