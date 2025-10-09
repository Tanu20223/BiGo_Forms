document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("trainingForm");
  const trainingTypeSelect = document.getElementById("trainingType");
  const previousJobGroup = document.getElementById("previousJobGroup");
  const submitBtn = form.querySelector('button[type="submit"]');
  const phoneInput = document.getElementById("f_phone");

  // Show/hide previous job field
  trainingTypeSelect.addEventListener("change", () => {
    if (trainingTypeSelect.value === "Experienced") {
      previousJobGroup.classList.remove("hidden");
    } else {
      previousJobGroup.classList.add("hidden");
    }
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.innerText = "Submitting...";

    const formData = {
      formType: "training",
      name: document.getElementById("f_visitorName").value.trim(),
      email: document.getElementById("f_email").value.trim(),
      phone: phoneInput.value.trim(),
      trainingType: trainingTypeSelect.value,
      previousJob: document.getElementById("previousJob").value.trim(),
      selection: document.querySelector('input[name="selection"]:checked')?.value || "",
      remark: document.getElementById("remark").value.trim(),
      date: new Date().toLocaleDateString(),
    };

    try {
      const response = await fetch("https://script.google.com/macros/s/AKfycbyOyYWG-ckl19KXrlVUOy-4GaevnsRN6dkt4csc6oU8AsDRA_2nbkfRh5WlD9Kwxlqgnw/exec", {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.status === "success") {
        alert("Form submitted successfully!");

        // ⚡ Save data for auto-fill in BGV form
        if (formData.selection.toLowerCase() === "yes") {
          localStorage.setItem("bgv_name", formData.name);
          localStorage.setItem("bgv_email", formData.email);
          localStorage.setItem("bgv_phone", formData.phone);

          // ⚡ Redirect to BGV form
          alert("Redirecting to BGV form...");
          window.location.href = "index2.html";
        }

        // Reset form if not redirected
        form.reset();
        previousJobGroup.classList.add("hidden");
      } else {
        alert("Error submitting form. Please try again.");
      }
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerText = "Submit";
    }
  });
});
