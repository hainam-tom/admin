

import 'https://code.jquery.com/jquery-3.6.0.min.js'
$(function() {
	$(".btn").click(function() {
		$(".form-signin").toggleClass("form-signin-left");
    $(".form-signup").toggleClass("form-signup-left");
    $(".frame").toggleClass("frame-long");
    $(".signup-inactive").toggleClass("signup-active");
    $(".signin-active").toggleClass("signin-inactive");
    $(".forgot").toggleClass("forgot-left");   
    $(this).removeClass("idle").addClass("active");
	});
});

$(function() {
	$(".btn-signup").click(function() {
  $(".nav").toggleClass("nav-up");
  $(".form-signup-left").toggleClass("form-signup-down");
  $(".success").toggleClass("success-left"); 
  $(".frame").toggleClass("frame-short");
	});
});

$(function() {
	$(".btn-signin").click(function() {
  $(".btn-animate").toggleClass("btn-animate-grow");
  $(".welcome").toggleClass("welcome-left");
  $(".cover-photo").toggleClass("cover-photo-down");
  $(".frame").toggleClass("frame-short");
  $(".profile-photo").toggleClass("profile-photo-down");
  $(".btn-goback").toggleClass("btn-goback-up");
  $(".forgot").toggleClass("forgot-fade");
	});
});
$(function() {
  // Login functionality
  $(".btn-signin").click(function() {
    const username = $(".form-signin input[name='username']").val();
    const password = $(".form-signin input[name='password']").val();

    if (username && password) {
      // Simulate a successful login
      $(".welcome").text(`Welcome, ${username}!`);
      $(".frame").toggleClass("frame-short");
      $(".cover-photo").toggleClass("cover-photo-down");
      $(".profile-photo").toggleClass("profile-photo-down");
      $(".btn-goback").toggleClass("btn-goback-up");
      $(".forgot").toggleClass("forgot-fade");

      // Store user info in local storage
      const userInfo = {
        username: username
      };
      localStorage.setItem('userInfo', JSON.stringify(userInfo));

      // Countdown and redirect
      let countdown = 3;
      const intervalId = setInterval(function() {
        $(".welcome").text(`Redirecting in ${countdown}...`);
        countdown--;
        if (countdown === 0) {
          clearInterval(intervalId);
          window.location.href = "index.html";
        }
      }, 1000);
    } else {
      alert("Please enter a valid username and password.");
      return 0
    }
  });

  // Autofill username on page load
  const storedUserInfo = localStorage.getItem('userInfo');
  if (storedUserInfo) {
    const userInfo = JSON.parse(storedUserInfo);
    $(".form-signin input[name='username']").val(userInfo.username);
    $(".btn-signin").prop('disabled', false); // enable the signin button
  }
  // Signup functionality
  $(".btn-signup").click(function() {
    const fullname = $(".form-signup input[name='fullname']").val();
    const email = $(".form-signup input[name='email']").val();
    const password = $(".form-signup input[name='password']").val();
    const confirmpassword = $(".form-signup input[name='confirmpassword']").val();

    if (fullname && email && password && confirmpassword) {
      // Simulate a successful signup
      $(".success").toggleClass("success-left");
      $(".nav").toggleClass("nav-up");
      $(".form-signup-left").toggleClass("form-signup-down");
      $(".frame").toggleClass("frame-short");

      // Store user info in local storage
      const userInfo = {
        username: email,
        fullname: fullname
      };
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
    } else {
      alert("Please enter all the required fields.");
    }
  });
});