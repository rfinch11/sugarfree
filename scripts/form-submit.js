document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('activity-form');
  const submitBtn = form.querySelector('button[type="submit"]');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;

    // Upload selected images
    const files = document.getElementById('photos').files;
    let uploaded = [];
    if (files && files.length) {
      try {
        uploaded = await uploadImagesToSupabasePrivate(files);
      } catch (err) {
        console.error('Image upload failed:', err);
      }
    }

    // Collect form fields
    const fields = {
      Type: form.elements['activityType']?.value || '',
      Name: document.getElementById('name').value,
      Location: document.getElementById('location').value,
      Description: document.getElementById('description').value,
      Link: document.getElementById('link').value,
      'Parent Tips': document.getElementById('tips').value,
      'Event Date': document.getElementById('eventDate').value,
      'Start Time': document.getElementById('startTime').value,
      'End Time': document.getElementById('endTime').value,
      Recurring: document.getElementById('recurring').checked,
      Frequency: document.getElementById('frequency').value,
      'Registration Required': document.getElementById('registrationRequired').checked,
      Photos: uploaded.map(u => u.url)
    };

    const captchaToken = grecaptcha.getResponse();

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields, captchaToken })
      });

      const data = await res.json();
      if (res.ok) {
        alert('Submission successful!');
        form.reset();
        if (typeof previewContainer !== 'undefined') previewContainer.innerHTML = '';
        grecaptcha.reset();
      } else {
        alert(data.error || 'Submission failed');
      }
    } catch (err) {
      console.error(err);
      alert('Submission error');
    } finally {
      submitBtn.disabled = false;
    }
  });
});

