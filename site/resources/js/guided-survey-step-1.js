/* global analytics */
(function ($, doc, win) {
  win.webmaker = win.webmaker || {};

  var
    baseUrl = win.location.protocol + '//' + win.location.host,
    previousStep = '?prevstep=webmaker_snippet_survey',
    mentorPath = '/for/mentors/' + previousStep,
    learnerPath = '/for/learners/' + previousStep,
    $form = $('#guided-landing-2014');

  function recordSelected() {
    var
      response = $('[name="custom-2722"]:checked').val();
    analytics.event('Selected a welcome survey option', {
      label: response
    });
  }

  function setRedirectUrl() {
    var
      response = $('[name="custom-2722"]:checked').val();
    if (response === 'yeshelplearn' || response === 'yesproteacher') {
      $('[name="redirect_url"]').val(baseUrl + mentorPath);
    } else {
      $('[name="redirect_url"]').val(baseUrl + learnerPath);
    }
  }

  function setNextStep() {
    var
      response = $('[name="custom-2722"]:checked').val();
    if (response === 'yeshelplearn' || response === 'yesproteacher') {
      return baseUrl + mentorPath;
    } else {
      return baseUrl + learnerPath;
    }
  }

  function postEmailAddress() {
    var
      payload = {
        email: $('[name="email"]').val(),
        'custom-2722': $('[name="custom-2722"]:checked').val(),
        opt_in: 1,
        redirect_url: $('[name="redirect_url"]').val()
      },
      request = $.ajax({
        type: 'post',
        url: 'https://sendto.webmaker.org/page/signup/webmaker-firefox-snippet-survey',
        data: payload
      }),
      success = function () {
        win.location = setNextStep();
      },
      error = function () {
        $form.off().submit();
      },
      complete = function () {
        sessionStorage.setItem('wmEmail', payload.email);
        recordSelected();
      };
    $('input[type="submit"]').prop('disabled', 'disabled').val(' Loading…');
    request.always(complete).then(success, error);
  }

  function init() {
    win.postEmailAddress = postEmailAddress;
    $form.on('change', '[name="custom-2722"]', setRedirectUrl);
    $form.on('submit', function (e) {
      e.preventDefault();
      $('button[type="submit"]').prop('disabled', 'disabled').text('Loading…');
      win.postEmailAddress();
    });
  }

  if (doc.getElementById('guided-landing-2014') !== null) {
    init();
  }

})(jQuery, document, window);
