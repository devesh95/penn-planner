/**
 * @author Devesh Dayal deveshd@seas.upenn.edu
 */

$(document).ready(function() {

  // GLOBAL JQUERY STATIC CACHING
  window.schedule = $('#schedule');
  window.addButton = $('#add-course');
  window.gradYear = 2018;

  // first build statics
  buildSemesters();
  // Build tooltips...
  buildToolTips();
  // ...and then marshall the course lists to drag/drop lists
  buildAllLists();
  // finally, set initial plan stats
  setTotalCredits();



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
    setTotalCredits();
    // update plan in db
    savePlan();
  });


  $(document).on('click', '#add-label', showLabelModal);
  $(document).on('click', '.close-modal', hideLabelModal);
  $(document).on('keyup', '.label-name', function(e) {
    if (e.which == 13) {
      hideLabelModal();
      var name = $(this).val();
      var color = $('.label-color').val();
      // TODO: add to label options
    } else if (e.which == 27) {
      hideLabelModal();
    }
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
      label: 'Done',
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
      if ($courseList.find('.course').length == 0) {
        $courseList.append('<li data-credit="1" class="course">' + courseText + '</li>');
      } else {
        $courseList
          .find('.course')
          .last()
          .after('<li data-credit="1" class="course">' + courseText + '</li>');
      }
      // build associated tooltip
      buildToolTips();

      // update stats
      setTotalCredits();

      // update plan in db
      savePlan();

      setButtonProps({
        label: 'Cancel',
        shouldCancel: false
      });
      $('#add-course').trigger('click');

    } else if (e.which == 27) {
      $('#add-course').trigger('click');
    }
  });


  $(document).on('change', '.course-credit', function(e) {
    var $creditSelect = $(e.target);
    var credit = $creditSelect.val();
    var courseIdx = $creditSelect.data('courseIdx');

    var $course = $('.course').filterByData('courseIdx', courseIdx);
    $course.data('credit', credit);

    setTotalCredits();
    // update plan in db
    savePlan();
  });



  /**
   * Helper functions
   */

  function buildSemesters() {
    // set semester labels
    $('.year').get().reverse().forEach(function(semester, idx) {
      $(this).text(Math.round(window.gradYear - (0.5 * idx)));
    });
  }

  function buildToolTips() {
    window.schedule.find('.course').each(function(idx, course) {
      var courseEl = $(course).get(0);
      var $course = $(course);

      // add course idx
      $course.data('courseIdx', idx);
      window.nextCourseIdx = idx + 1;

      var courseText = $course.text();
      var courseCredit = $course.data('credit');
      var isFallCourse = $course.parent().parent().hasClass('fall');

      var tooltip = $('#course-card').clone();
      tooltip.find('.card-title').text(courseText);
      tooltip.find('.course-credit option[value="' + courseCredit + '"]').attr('selected', true);
      tooltip.find('.card-remove, .course-credit').data('courseIdx', idx);

      Tipped.create(courseEl, tooltip, {
        // close: 'overlap',
        fadeIn: 350,
        hideOn: 'dragstart mouseleave',
        hideOnClickOutside: true,
        hideOthers: true,
        offset: {
          y: -3,
          x: isFallCourse ? 48 : -48
        },
        padding: false,
        position: isFallCourse ? 'left' : 'right',
        showDelay: 75,
        stem: false,
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
      onEnd: function() {
        // whenever a course has been re-ordered or dragged around, save plan
        savePlan();
        $('.course').trigger('mouseleave');
      }
    });
  }

  function setButtonProps(props) {
    var button = window.addButton;
    button.find('.label').text(props.label);
    button.data('cancel', props.shouldCancel);
    if (props.shouldCancel) {
      button.find('i').removeClass('fa-plus').addClass('fa-check');
    } else {
      button.find('i').removeClass('fa-check').addClass('fa-plus');
    }
  }

  function setTotalCredits() {
    var total = 0;
    $('.course').each(function() {
      total += Number($(this).data('credit'));
    });
    $('#credit-total').text(total);
  }

  function serializeSemesters() {
    var semesters = new Array(8);
    $('.courses').each(function(idx) {
      semesters[idx] = {
        courses: []
      };
      $(this).find('.course').each(function() {
        semesters[idx].courses.push({
          code: $(this).text(),
          credit: $(this).data('credit')
        });
      });
    });
    return semesters;
  }

  function savePlan() {
    // debounce
    if (!debounce(5000, savePlan)) return;
    // serializes and saves the current plan for the user
    var semesters = serializeSemesters();
    var data = {
      labels: [],
      gradYear: window.gradYear,
      semesters: JSON.stringify(semesters)
    }
    $.post('/data/semesters/save', data)
      .done(function(msg) {
        console.log(msg)
      })
      .fail(function(xhr, status, err) {
        console.log(status, err)
      });
  }
  window.savePlan = savePlan;


  function debounce(time, caller) {
    if (window.debounce) {
      console.log('Bounced for ' + (time / 2) + 'ms');
      setTimeout(caller, (time / 2)); // wait and try again
      return false;
    } else {
      window.debounce = time;
      setTimeout(function() {
        console.log('Debounce cleared.');
        window.debounce = false;
      }, time);
      return true;
    }
  }

  function showLabelModal() {
    var modal = $('#new-label-modal');
    $('.label-color').css({
      'font-size': '14px',
      'text-align': 'center',
      'width': '80%'
    });
    modal.show();
    $('.label-name').focus();
  }

  function hideLabelModal() {
    var modal = $('#new-label-modal');
    modal.hide();
  }

});