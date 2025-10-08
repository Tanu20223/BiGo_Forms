document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("handoverForm");

  const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbx4yXD5S23Suxb8IQGPRkOS9NGB1ggv5sJtbKvTmz_cLiA3ooAO04iMc4vrSVH9iCnVSg/exec";

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Collect checked accessories
    const accessories = Array.from(document.querySelectorAll('input[name="accessories"]:checked'))
                             .map(cb => cb.value);

    const formData = {
      formType: "accessories",
      riderName: document.getElementById("riderName").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      accessories: accessories.join(", "), // comma-separated
      handoverBy: document.getElementById("handoverBy").value,
      remarks: document.getElementById("remarks").value
    };

    try {
      const response = await fetch(WEB_APP_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.status === "success") {
        alert("✅ Accessories handover saved!");
        form.reset();
      } else {
        alert("❌ Error: " + result.message);
      }
    } catch (error) {
      alert("❌ Request Failed: " + error.message);
      console.error(error);
    }
  });
});



