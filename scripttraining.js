document.addEventListener("DOMContentLoaded", () => {
  const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwyhGVfHvCMYT_wzGWqUmn3y2EWoReHErqTi-DZLJnSTKu6l8bqQtF5_AxYfZyRC7jU/exec"; // replace with your deployed web app URL

  const phoneCheckForm = document.getElementById("phoneCheckForm");
  const trainingForm = document.getElementById("trainingForm");
  const followupForm = document.getElementById("followupForm");

  let currentPhone = "";

  // Step 1: Check phone
  phoneCheckForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const phone = document.getElementById("phoneLookup").value.trim();
    if (!phone) return alert("Enter a phone number");
    currentPhone = phone;

    try {
      const res = await fetch(`${WEB_APP_URL}?phone=${encodeURIComponent(phone)}`);
      const data = await res.json();

      if (data.success) {
        phoneCheckForm.classList.add("hidden");
        followupForm.classList.remove("hidden");

        // Fill follow-up form fields
        document.getElementById("f_visitorName").value = data.Name || "";
        document.getElementById("f_email").value = data.Email || "";
        document.getElementById("f_altNumber").value = data["Alternative Phone"] || "";
        document.getElementById("f_area").value = data.Area || "";
        document.getElementById("f_reference").value = data.Reference || "";
        document.getElementById("f_trainingType").value = data["Training Type"] || "";
        document.getElementById("f_previousJob").value = data["Previous Job"] || "";
      } else {
        phoneCheckForm.classList.add("hidden");
        trainingForm.classList.remove("hidden");
        document.getElementById("phone").value = phone; // prefill phone
      }
    } catch (err) {
      alert("Error checking phone number");
      console.error(err);
    }
  });

  // Step 2: Submit Training Form
  trainingForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      formType: "training",
      visitorName: document.getElementById("visitorName").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      altNumber: document.getElementById("altNumber").value,
      area: document.getElementById("area").value,
      reference: document.getElementById("reference").value,
      trainingType: document.getElementById("trainingType").value,
      previousJob: document.getElementById("previousJob").value,
    };

    try {
      const res = await fetch(WEB_APP_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      alert(result.message);
      trainingForm.reset();
      trainingForm.classList.add("hidden");
      location.reload();
    } catch (err) {
      alert("Submission failed!");
      console.error(err);
    }
  });

  // Step 3: Submit Follow-up Form
  followupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      formType: "followup",
      phone: currentPhone,
      interviewBy: document.getElementById("interviewBy").value,
      trainingBy: document.getElementById("trainingBy").value,
      trainingStatus: document.getElementById("trainingStatus").value,
      trainedBy: document.getElementById("trainedBy").value,
      selection: document.getElementById("selection").value,
      finalRemark: document.getElementById("finalRemark").value,
    };

    try {
      const res = await fetch(WEB_APP_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      alert(result.message);

      if (data.selection.toLowerCase() === "yes") {
        window.location.href = "indexbgv.html";
      } else {
        followupForm.reset();
        followupForm.classList.add("hidden");
        location.reload();
      }
    } catch (err) {
      alert("Submission failed!");
      console.error(err);
    }
  });

  // Show/hide Previous Job field
  document.getElementById("trainingType").addEventListener("change", function () {
    const prevJobGroup = document.getElementById("previousJobGroup");
    if (this.value === "job") prevJobGroup.classList.remove("hidden");
    else prevJobGroup.classList.add("hidden");
  });
});

