document.addEventListener("DOMContentLoaded", () => {
  const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxRhlmWS2RLATtAj09kEY8jX_0TG-4hsrzrolOPebLJp_UFXByRT9GBgxmY96MPcM6Dhw/exec";

  const phoneCheckForm = document.getElementById("phoneCheckForm");
  const trainingForm = document.getElementById("trainingForm");
  const followupForm = document.getElementById("followupForm");
  let currentPhone = "";

  // Step 1: Phone check
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

        // Fill read-only details
        document.getElementById("f_visitorName").value = data.visitorName || "";
        document.getElementById("f_email").value = data.email || "";
        document.getElementById("f_altNumber").value = data.altNumber || "";
        document.getElementById("f_area").value = data.area || "";
        document.getElementById("f_reference").value = data.reference || "";
        document.getElementById("f_trainingType").value = data.trainingType || "";
        document.getElementById("f_previousJob").value = data.previousJob || "";
      } else {
        phoneCheckForm.classList.add("hidden");
        trainingForm.classList.remove("hidden");
      }
    } catch (err) {
      alert("Error checking phone number");
      console.error(err);
    }
  });

  // Step 2: Submit Training Form
  trainingForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!currentPhone) return alert("Phone number missing.");

    const data = {
      formType: "training",
      phone: currentPhone,
      visitorName: document.getElementById("visitorName").value,
      email: document.getElementById("email").value,
      altNumber: document.getElementById("altNumber").value,
      area: document.getElementById("area").value,
      reference: document.getElementById("reference").value,
      trainingType: document.getElementById("trainingType").value,
      previousJob: document.getElementById("previousJob").value,
    };

    await submitData(data, "Training data submitted successfully!");
    trainingForm.reset();
    trainingForm.classList.add("hidden");
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

    await submitData(data, "Follow-up data submitted successfully!");

    if (data.selection.toLowerCase() === "yes") {
      window.location.href = "index2.html";
    } else {
      followupForm.reset();
      followupForm.classList.add("hidden");
      location.reload();
    }
  });

  async function submitData(data, successMsg) {
    try {
      const res = await fetch(WEB_APP_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.status === "success") alert(successMsg);
      else alert("Error: " + (result.message || "Unknown error"));
    } catch (err) {
      alert("Submission failed!");
      console.error(err);
    }
  }
});

