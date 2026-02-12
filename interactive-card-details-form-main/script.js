 // =========================
    // SELECTORS
    // =========================
    const form = document.getElementById("card-form");
    const thankYou = document.getElementById("thank-you");
    const continueBtn = document.getElementById("continue-btn");

    const inputName = document.getElementById("cardholder-name");
    const inputNumber = document.getElementById("card-number");
    const inputMonth = document.getElementById("month");
    const inputYear = document.getElementById("year");
    const inputCvc = document.getElementById("cvc");

    const cardName = document.querySelector(".cardholder-name");
    const cardNumber = document.querySelector(".card-number");
    const cardMonth = document.querySelector(".month");
    const cardYear = document.querySelector(".year");
    const cardCvc = document.querySelector(".cvc");

    // =========================
    // UI HELPERS
    // =========================
    function showError(input, message) {
      const formGroup = input.closest(".form");
      input.style.border = "2px solid red";
      formGroup.querySelector(".error-msg").textContent = message;
    }

    function clearError(input) {
      const formGroup = input.closest(".form");
      input.style.border = "2px solid transparent";
      formGroup.querySelector(".error-msg").textContent = "";
    }

    // =========================
    // FORMATTERS
    // =========================
    function formatCardNumber(value) {
      return value.replace(/\D/g, '').slice(0,16).replace(/(.{4})/g,'$1 ').trim();
    }

    // =========================
    // VALIDATORS
    // =========================
    function validateName(value) {
      return /^[a-zA-Z ]+$/.test(value);
    }

    function validateCardNumber(value) {
      return /^\d{4} \d{4} \d{4} \d{4}$/.test(value);
    }

    function validateMonth(value) {
      const num = parseInt(value);
      return num >= 1 && num <= 12;
    }

    function validateYear(value) {
      const num = parseInt(value);
      return num >= 0 && num <= 99;
    }

    function validateCvc(value) {
      return /^\d{3}$/.test(value);
    }

    // =========================
    // UPDATE CARD PREVIEW
    // =========================
    function updateCard(input) {
      switch(input.id) {
        case "cardholder-name":
          cardName.textContent = input.value || "Jane Appleseed"; break;
        case "card-number":
          cardNumber.textContent = input.value || "0000 0000 0000 0000"; break;
        case "month":
          cardMonth.textContent = input.value ? input.value + "/" : "00/"; break;
        case "year":
          cardYear.textContent = input.value || "00"; break;
        case "cvc":
          cardCvc.textContent = input.value || "000"; break;
      }
    }

    // =========================
    // EVENT LISTENERS
    // =========================
    // Input listeners for live preview + clearing error
    [inputName, inputNumber, inputMonth, inputYear, inputCvc].forEach(input => {
      input.addEventListener("input", () => {
        if(input.id === "card-number") input.value = formatCardNumber(input.value);
        updateCard(input);
        clearError(input);
      });
    });
    // Validate name on focus out
// Name
inputName.addEventListener("blur", () => {
  if(inputName.value.trim() === "") {
    showError(inputName, "Can't be blank");
  } else if(!validateName(inputName.value)) {
    showError(inputName, "Wrong format");
  } else {
    clearError(inputName);
  }
});

// Card Number
inputNumber.addEventListener("blur", () => {
  inputNumber.value = formatCardNumber(inputNumber.value);
  if(inputNumber.value.trim() === "") {
    showError(inputNumber, "Can't be blank");
  } else if(!validateCardNumber(inputNumber.value)) {
    showError(inputNumber, "Wrong format");
  } else {
    clearError(inputNumber);
  }
});

// Month
inputMonth.addEventListener("blur", () => {
  if(inputMonth.value.trim() === "") {
    showError(inputMonth, "Can't be blank");
  } else if(!validateMonth(inputMonth.value)) {
    showError(inputMonth, "Wrong format");
  } else {
    clearError(inputMonth);
  }
});

// Year
inputYear.addEventListener("blur", () => {
  if(inputYear.value.trim() === "") {
    showError(inputYear, "Can't be blank");
  } else if(!validateYear(inputYear.value)) {
    showError(inputYear, "Wrong format");
  } else {
    clearError(inputYear);
  }
});

// CVC
inputCvc.addEventListener("blur", () => {
  if(inputCvc.value.trim() === "") {
    showError(inputCvc, "Can't be blank");
  } else if(!validateCvc(inputCvc.value)) {
    showError(inputCvc, "Wrong format");
  } else {
    clearError(inputCvc);
  }
});

    // Final validation
    function validateAll() {
      let valid = true;

      if(inputName.value.trim() === "" || !validateName(inputName.value)) {
        showError(inputName, "Wrong format or blank");
        valid = false;
      }
      if(inputNumber.value.trim() === "" || !validateCardNumber(inputNumber.value)) {
        showError(inputNumber, "Wrong format or blank");
        valid = false;
      }
      if(inputMonth.value.trim() === "" || !validateMonth(inputMonth.value)) {
        showError(inputMonth, "Wrong month");
        valid = false;
      }
      if(inputYear.value.trim() === "" ||   !validateYear(inputYear.value)) {
        showError(inputYear, "Wrong year");
        valid = false;
      }
      if(inputCvc.value.trim() === "" || !validateCvc(inputCvc.value)) {
        showError(inputCvc, "Wrong CVC");
        valid = false;
      }

      return valid;
    }

    // Submit
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if(validateAll()) {
        form.style.display = "none";
        thankYou.style.display = "block";
      }
    });

    
    continueBtn.addEventListener("click", () => {
      form.reset();
      [inputName, inputNumber, inputMonth, inputYear, inputCvc].forEach(updateCard);
      form.style.display = "block";
      thankYou.style.display = "none";
    });