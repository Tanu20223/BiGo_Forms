document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("trainingForm");
  const trainingTypeSelect = document.getElementById("trainingType");
  const previousJobGroup = document.getElementById("previousJobGroup");
  const submitBtn = form.querySelector('button[type="submit"]'); // ✅ define submit button

  const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwMC3no_08ZawTanj2ZmvSFgFAmhNIqv2fNcTdx1BtkJjS1ex7b5i9Uay4IgPlL4-Kdcg/exec"; // 🔹 replace

  // Show/hide Previous Job
  trainingTypeSelect.addEventListener("change", () => {
    if (trainingTypeSelect.value === "job") {
      previousJobGroup.classList.remove("hidden");
    } else {
      previousJobGroup.classList.add("hidden");
    }
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
     // Disable button immediately
    submitBtn.disabled = true;
    submitBtn.innerText = "Submitting...";

    const formData = {
      formType: "training",
      visitorName: document.getElementById("visitorName").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      altPhone: document.getElementById("altNumber").value,
      area: document.getElementById("area").value,
      reference: document.getElementById("reference").value,
      trainingType: document.getElementById("trainingType").value,
      previousJob: document.getElementById("previousJob").value
    };

    // Save Training data
    await fetch(WEB_APP_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify(formData)
    });

    alert("✅ Training data saved!");
    form.reset();
    previousJobGroup.classList.add("hidden");
    
  })
  .finally(() => {
            // Re-enable button after everything is done
            submitBtn.disabled = false;
            submitBtn.innerText = "Submit";
        });
    });
  

