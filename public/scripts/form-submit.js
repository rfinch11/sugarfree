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
        uploaded = await window.uploadImagesToSupabasePrivate(files);
      } catch (err) {
        console.error('Image upload failed:', err);
      }
    }

    // Collect form fields to send to the Edge Function
    const formData = {
      name: document.getElementById('name').value,
      type: form.elements['activityType']?.value || '',
      location: document.getElementById('location').value,
      description: document.getElementById('description').value,
      link: document.getElementById('link').value,
      tips: document.getElementById('tips').value,
      eventDate: document.getElementById('eventDate').value,
      startTime: document.getElementById('startTime').value,
      endTime: document.getElementById('endTime').value,
      recurring: document.getElementById('recurring').checked,
      frequency: document.getElementById('frequency').value,
      registrationRequired: document.getElementById('registrationRequired').checked,
      created: new Date().toISOString(),
      photos: uploaded.map(u => ({ url: u.url })),
      photoFilePaths: uploaded.map(u => u.fallback_url)
    };

    fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert('Submission successful!');
          form.reset();
          if (typeof previewContainer !== 'undefined') previewContainer.innerHTML = '';
        } else {
          alert('Submission failed: ' + data.error);
        }
      })
      .catch(err => {
        console.error(err);
        alert('Submission error');
      })
      .finally(() => {
        submitBtn.disabled = false;
      });
  });
});

