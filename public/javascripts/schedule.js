
$(document).ready(function() {
  var schedule = $('#schedule');

  schedule.find('.courses').each(function(idx, courseList) {
    var list = $(courseList).get(0);
    new Sortable(list, {
      chosenClass: 'chosen-course',         // CSS class
      group: 'schedule',                  // allow dragging within groups
    });
  });

});