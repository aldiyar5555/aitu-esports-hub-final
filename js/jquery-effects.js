/**
 * AITU Esports Hub - jQuery Effects & DOM Traversal
 */

$(document).ready(function() {
  $('.toggle-roster-btn').on('click', function() {
    const $rosterDetails = $(this).closest('.card-body').find('.roster-details');
    
    $rosterDetails.slideToggle(300, function() {
      if ($(this).is(':visible')) {
        $(this).siblings('.toggle-roster-btn').text('Hide Roster');
      } else {
        $(this).siblings('.toggle-roster-btn').text('Show Roster');
      }
    });
  });

  $(document).on('mouseenter', '.tournament-card', function() {
    $(this).animate({ opacity: 0.94 }, 120);
  }).on('mouseleave', '.tournament-card', function() {
    $(this).animate({ opacity: 1.0 }, 120);
  });
});
