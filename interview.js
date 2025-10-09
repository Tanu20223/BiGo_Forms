const form = document.getElementById('interviewForm');
const experience = document.getElementById('experience');
const extraFields = document.getElementById('extraFields');
const interviewType = document.getElementById('interviewType');

const skillsSection = document.getElementById('skillsSection');
const cvSection = document.getElementById('cvSection');
const modeSection = document.getElementById('modeSection');

// 🔹 Status Message
let status = document.createElement("p");
status.id = "status";
status.style.marginTop = "10px";
status.style.fontWeight = "bold";
form.appendChild(status);

// Show/hide extra fields based on experience
experience.addEventListener("change", () => {
  if (experience.value === "Fresher" || experience.value === "") {
    extraFields.classList.add("hidden");
  } else {
    extraFields.classList.remove("hidden");
  }
});

// Show/hide sections based on Interview Type
interviewType.addEventListener("change", () => {
  if (interviewType.value === "Sir") {
    skillsSection.style.display = "block";
    cvSection.style.display = "block";
    modeSection.style.display = "none";
  } else if (interviewType.value === "Rider") {
    skillsSection.style.display = "none";
    cvSection.style.display = "none";
    modeSection.style.display = "block";
  } else {
    skillsSection.style.display = "block";
    cvSection.style.display = "block";
    modeSection.style.display = "block";
  }
});

// Form Submit
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const selectedType = interviewType.value;

  // For Sir interview, CV is required
  if (selectedType === "Sir") {
    const fileInput = document.getElementById('cv');
    const file = fileInput.files[0];
    if (!file) {
      status.innerText = "⚠️ Please upload your CV before submitting.";
      return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
      sendData(event.target.result.split(',')[1], file.name);
    };
    reader.readAsDataURL(file);
  } else {
    // Rider interview → no CV upload
    sendData(null, null);
  }
});

function sendData(base64Data, filename) {
  const data = {
    formType: "interview",
    interviewType: interviewType.value,
    fullname: form.fullname.value,
    contact: form.contact.value,
    email: form.email.value,
    currentAddress: form.currentAddress.value,
    permanentAddress: form.permanentAddress.value,
    position: form.position.value,
    experience: form.experience.value,
    company: form.company.value,
    ctc: form.ctc.value,
    skills: form.skills.value,
    qualification: form.qualification.value,
    cv_base64: base64Data,
    cv_filename: filename
  };

  fetch('https://script.google.com/macros/s/AKfycbwgmZXenGpjfhNQE3hNIWiWP5MW3lW9pokP-GO0SDQwsLlVtnmQskstjQUqfgOdHC-Ivg/exec', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'text/plain' }
  })
  .then(response => response.json())
  .then(result => {
    status.innerText = result.message || "✅ Submitted successfully!";
    form.reset();
    extraFields.classList.add("hidden");
    skillsSection.style.display = "block";
    cvSection.style.display = "block";
    
  })
  .catch(err => {
    status.innerText = '❌ Error: ' + err.message;
  });
}










