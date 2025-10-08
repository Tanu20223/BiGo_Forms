const form = document.getElementById('bgv'); // ✅ matches your HTML
const status = document.getElementById('successMessage');
const submitBtn = form.querySelector('button[type="submit"]');
const bgvType = document.getElementById('bgvType');
const rentalSection = document.getElementById('rentalSection');
const jobSection = document.getElementById('jobSection');

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

  Promise.all(fileIds.map(id => toBase64(document.getElementById(id).files[0])))
  .then(files => {
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

    return fetch('YOUR_WEBAPP_DEPLOYMENT_URL', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' } // ✅ fixed
    });
  })
  .then(res => res.json())
  .then(result => {
    status.innerText = result.message || "Form submitted successfully!";
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
