/**
 * @author Devesh Dayal deveshd@seas.upenn.edu
 */

$(document).ready(function() {

  // GLOBAL JQUERY STATIC CACHING
  window.schedule = $('#schedule');
  window.addButton = $('#add-course');



  // Build tooltips...
  buildToolTips();
  // ...and then marshall the course lists to drag/drop lists
  buildAllLists();



  /**
   * Event listeners and handlers
   */

  // Button to remove a course from a course list
  $(document).on('click', '.card-remove', function(e) {
    var $cardButton = $(e.target);
    var courseIdx = $cardButton.data('courseIdx');

    // remove course and card
    var $courseToRemove = $('.course').filterByData('courseIdx', courseIdx);
    $courseToRemove.trigger('mouseleave').remove();
  });


  // Button to add more courses to course lists
  $(document).on('click', '#add-course', function(e) {
    e.preventDefault();
    var button = window.addButton;
    var shouldCancel = button.data('cancel');

    if (shouldCancel) {
      $('.course-input').remove(); // remove all inputs
      setButtonProps({
        label: 'Add Course',
        shouldCancel: false
      });
      return;
    }

    var $courseList = $('.courses');
    $courseList.append('<input class="course-input" type="text" placeholder="ANTH 001">');
    $('.course-input').focus();

    setButtonProps({
      label: 'Cancel',
      shouldCancel: true
    });
  });


  // Text input for new courses
  $(document).on('keyup', '.course-input', function(e) {
    if (e.which == 13) {
      var $inputEl = $(e.target);
      var $courseList = $inputEl.parent();
      var courseText = $inputEl.val();

      // remove all input boxes
      $('.course-input').remove();
      // append the new course to the appropriate semester course list
      $courseList
        .find('.course')
        .last()
        .after('<li class="course">' + courseText + '</li>');
      // build associated tooltip
      buildToolTips();

      // reset the add course button
      setButtonProps({
        label: 'Add Course',
        shouldCancel: false
      });
    }
  });



  /**
   * Helper functions
   */

  function buildToolTips() {
    window.schedule.find('.course').each(function(idx, course) {
      var courseEl = $(course).get(0);
      var $course = $(course);

      // add course idx
      $course.data('courseIdx', idx);
      window.nextCourseIdx = idx + 1;

      var courseText = $course.text();

      var tooltip = $('#course-card').clone();
      tooltip.find('.card-title').text(courseText);
      tooltip.find('.card-remove').data('courseIdx', idx);

      Tipped.create(courseEl, tooltip, {
        close: 'overlap',
        fadeIn: 350,
        hideOn: 'dragstart mouseleave',
        hideOnClickOutside: true,
        hideOthers: true,
        padding: false,
        showDelay: 1000,
      });
    });
  }

  function buildAllLists() {
    window.schedule.find('.courses').each(function(idx, courseList) {
      $(courseList).data('semesterIdx', idx);
      buildList(courseList);
    });
  }

  function buildList($courseList) {
    var list = $($courseList).get(0);
    new Sortable(list, {
      animation: 150,
      chosenClass: 'chosen-course',
      ghostClass: 'ghost-course',
      group: 'schedule',
    });
  }

  function setButtonProps(props) {
    var button = window.addButton;
    button.find('.label').text(props.label);
    button.data('cancel', props.shouldCancel);
    if (props.shouldCancel) {
      button.find('i').removeClass('fa-plus').addClass('fa-times');
    } else {
      button.find('i').removeClass('fa-times').addClass('fa-plus');
    }
  }


});