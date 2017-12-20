function updateCountdown() {
  let remaining = 140 - jQuery('.message').val().length;
  jQuery('.countdown').text(remaining + ' characters remaining.')
}

jQuery(document).ready(function($) {
  updateCountdown();
  $('.message').change(updateCountdown);
  $('.message').keyup(updateCountdown);
});