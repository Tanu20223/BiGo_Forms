const form = document.getElementById('interviewForm');
const status = document.getElementById('status');
const submitBtn = form.querySelector('button[type="submit"]'); // ✅ define submit button

form.addEventListener('submit', e => {
    e.preventDefault();

    // Disable button immediately
    submitBtn.disabled = true;
    submitBtn.innerText = "Submitting...";

    const fileInput = document.getElementById('cv');
    const file = fileInput.files[0];

    const reader = new FileReader();
    reader.onload = function(event) {
        const base64Data = event.target.result.split(',')[1]; // base64 only

        const data = {
            formType: "interview",
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
            mode: form.mode.value,
            cv_base64: base64Data,
            cv_filename: file.name
        };

        fetch('https://script.google.com/macros/s/AKfycbwMC3no_08ZawTanj2ZmvSFgFAmhNIqv2fNcTdx1BtkJjS1ex7b5i9Uay4IgPlL4-Kdcg/exec', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'text/plain' }
        })
        .then(response => response.json())
        .then(result => {
            status.innerText = result.message || "CV uploaded successfully!";
            form.reset();
        })
        .catch(err => {
            status.innerText = 'Error: ' + err.message;
        });
    };

    reader.readAsDataURL(file);
});
