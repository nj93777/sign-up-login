const validation = new JustValidate("#signup");

validation
  .addField("#name", [
    {
      rule: "required",
    },
  ])
  .addField("#email", [
    {
      rule: "required",
    },
    {
      rule: "email",
    },
    {
      validator: (value) => {
        return fetch("validate-email.php?email=" + encodeURIComponent(value))
          .then(function(response) {
            return response.json();
          })
          .then(function(json) {
            if (!json.available) {
              validation.showErrors({
                '#email': 'Email already taken'
              });
            }
            return json.available;
          });
      },
      errorMessage: "Email already taken"
    }
  ])
  .addField("#password", [
    {
      rule: "required",
    },
    {
      rule: "password",
    },
  ])
  .addField("#password_confirmation", [
    {
      validator: (value, fields) => {
        return value === fields["#password"].elem.value;
      },
      errorMessage: "Passwords should match",
    },
  ])
  .onValidate((isValid, event) => {
    // Prevent form submission if there are validation errors
    if (!isValid) {
      event.preventDefault();
    }
  })
  .onSuccess((event) => {
    event.preventDefault();
    // Check for email availability one more time before submission
    const emailField = document.querySelector("#email");
    fetch("validate-email.php?email=" + encodeURIComponent(emailField.value))
      .then(response => response.json())
      .then(json => {
        if (json.available) {
          document.getElementById("signup").submit();
        } else {
          validation.showErrors({
            '#email': 'Email already taken'
          });
        }
      });
  });
