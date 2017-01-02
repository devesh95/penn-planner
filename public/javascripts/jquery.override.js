/**
 * @author Devesh Dayal deveshd@seas.upenn.edu
 */

$(document).ready(function() {
  /**
   * Override jQuery and make new functions
   */

  /**
   * Filter by data property values, allows for filtering even when attributes
   * are added using the data API dynamically to the element.
   * @param  {[primitive]} prop [data property to filter on]
   * @param  {[primitive]} val  [data property value]
   * @return {[jQuery obj]}     [chainable jQuery instance]
   */
  $.fn.filterByData = function(prop, val) {
    return this.filter(
      function() {
        return $(this).data(prop) == val;
      }
    );
  }

  /**
   * Searches the parent chain until an element with matching classname is found
   * @param  {[string]} className [classname of target parent element]
   * @return {[jQuery obj]}     [chainable jQuery instance]
   */
  $.fn.parentWithClass = function(className) {
    var runner = $(this);
    while (runner && runner.length > 0) {
      runner = runner.parent();
      if (runner.hasClass(className)) {
        return runner;
      }
    }
    return [];
  }

});
