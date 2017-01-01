
$(document).ready(function() {
  var schedule = $('#schedule');

  schedule.find('.courses').each(function(idx, courseList) {
    var list = $(courseList).get(0);
    new Sortable(list, {
      animation: 150,
      chosenClass: 'chosen-course',
      ghostClass: 'ghost-course',
      group: 'schedule',
    });
  });

});