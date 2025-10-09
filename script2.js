const form = document.getElementById('bgv');
const status = document.getElementById('successMessage');
const submitBtn = form.querySelector('button[type="submit"]');
const bgvType = document.getElementById('bgvType');
const rentalSection = document.getElementById('rentalSection');
const jobSection = document.getElementById('jobSection');

// ⚡ Auto-fill Name, Email, Phone from localStorage
window.addEventListener("DOMContentLoaded", () => {
  const name = localStorage.getItem("bgv_name");
  const email = localStorage.getItem("bgv_email");
  const phone = localStorage.getItem("bgv_phone");

  if (name) document.getElementById("name").value = name;
  if (email) document.getElementById("email").value = email;
  if (phone) document.getElementById("phone").value = phone;

  // Optional: make them read-only
  // document.getElementById("name").readOnly = true;
  // document.getElementById("email").readOnly = true;
  // document.getElementById("phone").readOnly = true;
});

// Show/hide rental or job fields
bgvType.addEventListener('change', () => {
  rentalSection.classList.add('hidden');
  jobSection.classList.add('hidden');
  if (bgvType.value === "rental") rentalSection.classList.remove('hidden');
  if (bgvType.value === "job") jobSection.classList.remove('hidden');
});

form.addEventListener('submit', e => {
  e.preventDefault();
  submitBtn.disabled = true;
  submitBtn.innerText = "Submitting...";

  const toBase64 = (file) => new Promise(resolve => {
    if (!file) return resolve({ base64: null, filename: "" });
    const reader = new FileReader();
    reader.onload = e => resolve({ base64: e.target.result.split(',')[1], filename: file.name });
    reader.readAsDataURL(file);
  });

  const fileIds = [
    'aadharFront','aadharBack','voterFront','voterBack',
    'dlFront','dlBack','panFront','panBack','selfie','receipt'
  ];

  Promise.all(fileIds.map(id => toBase64(document.getElementById(id).files[0]))).then(files => {
    const data = {
      formType: "bgv",
      name: form.name.value,
      email: form.email.value,
      phone: form.phone.value,
      aadharLinkPhone: form.aadharLinkPhone.value,
      fatherName: form.fatherName.value,
      aadharAddress: form.aadharAddress.value,
      currentAddress: form.currentAddress.value,
      residenceType: form.residenceType.value,
      dob: form.dob.value,
      aadharNo: form.aadharNo.value,
      aadharFront: files[0],
      aadharBack: files[1],
      voterNo: form.voterNo.value,
      voterFront: files[2],
      voterBack: files[3],
      dlNo: form.dlNo.value,
      dlFront: files[4],
      dlBack: files[5],
      panNo: form.panNo.value,
      panFront: files[6],
      panBack: files[7],
      selfie: files[8],
      referrer: form.referrer.value,
      bgvType: form.bgvType.value,
      receipt: files[9],
      rentPurpose: form.rentPurpose.value,
      companyName: form.companyName.value,
      position: form.position.value,
      joinDate: form.joinDate.value,
      utrNo: form.utrNo.value,
    };

    return fetch('https://script.google.com/macros/s/AKfycbyOyYWG-ckl19KXrlVUOy-4GaevnsRN6dkt4csc6oU8AsDRA_2nbkfRh5WlD9Kwxlqgnw/exec', {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(data)
    });
  })
  .then(res => res.json())
  .then(result => {
    if (result.status === "success") {
      status.innerText = result.message || "Form submitted successfully!";
      // ⚡ Clear localStorage after success
      localStorage.removeItem("bgv_name");
      localStorage.removeItem("bgv_email");
      localStorage.removeItem("bgv_phone");
    } else {
      status.innerText = "Error: " + (result.message || "Something went wrong.");
    }
    form.reset();
    rentalSection.classList.add('hidden');
    jobSection.classList.add('hidden');
  })
  .catch(err => status.innerText = 'Error: ' + err.message)
  .finally(() => {
    submitBtn.disabled = false;
    submitBtn.innerText = "Submit";
  });
});
