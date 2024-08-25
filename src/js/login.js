import "https://code.jquery.com/jquery-3.6.0.min.js";

$(function () {
  $(".btn").click(function () {
    $(".form-signin").toggleClass("form-signin-left");
    $(".form-signup").toggleClass("form-signup-left");
    $(".frame").toggleClass("frame-long");
    $(".signup-inactive").toggleClass("signup-active");
    $(".signin-active").toggleClass("signin-inactive");
    $(".forgot").toggleClass("forgot-left");
    $(this).removeClass("idle").addClass("active");
  });
});

$(function () {
  $(".btn-signup").click(function () {
    $(".nav").toggleClass("nav-up");
    $(".form-signup-left").toggleClass("form-signup-down");
    $(".success").toggleClass("success-left");
    $(".frame").toggleClass("frame-short");
  });
});

$(function () {
  $(".btn-signin").click(function () {
    $(".btn-animate").toggleClass("btn-animate-grow");
    $(".welcome").toggleClass("welcome-left");
    $(".cover-photo").toggleClass("cover-photo-down");
    $(".frame").toggleClass("frame-short");
    $(".profile-photo").toggleClass("profile-photo-down");
    $(".btn-goback").toggleClass("btn-goback-up");
    $(".forgot").toggleClass("forgot-fade");
  });
});

$(function () {
  // Login functionality
  $(".btn-signin").click(function () {
    const username = $(".form-signin input[name='username']").val();
    const password = $(".form-signin input[name='password']").val();

    // Regex validation for username and password
    const usernameRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (usernameRegex.test(username) && passwordRegex.test(password)) {
      // Simulate a successful login
      $(".welcome").text(`Welcome, ${username}!`);
      $(".frame").toggleClass("frame-short");
      $(".cover-photo").toggleClass("cover-photo-down");
      $(".profile-photo").toggleClass("profile-photo-down");
      $(".btn-goback").toggleClass("btn-goback-up");
      $(".forgot").toggleClass("forgot-fade");

      // Store user info in local storage
      const userInfo = {
        username: username,
      };
      localStorage.setItem("userInfo", JSON.stringify(userInfo));

      // Countdown and redirect
      let countdown = 3;
      const intervalId = setInterval(function () {
        $(".welcome").text(`Redirecting in ${countdown}...`);
        countdown--;
        if (countdown === 0) {
          clearInterval(intervalId);
          window.location.href = "index.html";
        }
      }, 1000);
    } else {
      alert("Please enter a valid username and password.");
      return 0;
    }
  });

  // Autofill username on page load
  const storedUserInfo = localStorage.getItem("userInfo");
  if (storedUserInfo) {
    const userInfo = JSON.parse(storedUserInfo);
    $(".form-signin input[name='username']").val(userInfo.username);
    $(".btn-signin").prop("disabled", false); // enable the signin button
  }

  // Signup functionality
  $(".btn-signup").click(function (event) {
    event.preventDefault()
    const fullname = $(".form-signup input[name='fullname']").val();
    const email = $(".form-signup input[name='email']").val();
    const password = $(".form-signup input[name='password']").val();
    const confirmpassword = $(
      ".form-signup input[name='confirmpassword']"
    ).val();
    const phonenumber = $(".form-signup input[name='phonenumber']").val();
    const address = $(".form-signup input[name='address']").val();
    const dateofbirth = $(".form-signup input[name='dateofbirth']").val();

    // Regex validation for signup fields
    const fullnameRegex = /^[a-zA-Z ]{2,}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const phonenumberRegex = /^\d{10}$/;
    const addressRegex = /^[a-zA-Z0-9\s,.-]{2,}$/;
    const dateofbirthRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (
      fullnameRegex.test(fullname) &&
      emailRegex.test(email) &&
      passwordRegex.test(password) &&
      password === confirmpassword &&
      phonenumberRegex.test(phonenumber) &&
      addressRegex.test(address) &&
      dateofbirthRegex.test(dateofbirth)
    ) {
      // Store user info in local storage
      const userInfo = {
        username: email,
        fullname: fullname,
      };
      localStorage.setItem("userInfo", JSON.stringify(userInfo));

      // Send user data to API
      const userData = {
        fullName: fullname,
        email: email,
        password: password,
        phone: phonenumber,
        address: address,
        dateOfBirth: dateofbirth,
      };

      // API call to create a new user
      $.ajax({
        type: "POST",
        url: "localhost:4000/api/users",
        data: JSON.stringify(userData),
        contentType: "application/json",
        success: function (data) {
          console.log("User created successfully!");
        },
        error: function (xhr, status, error) {
          console.log("Error creating user: " + error);
        },
      });
    } else {
      alert("Please enter valid information.");
    }
    // Simulate a successful signup

  });
});
