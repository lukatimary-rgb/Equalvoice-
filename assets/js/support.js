// Geolocation functionality
const getLocationBtn = document.getElementById('getLocationBtn');
const userLocationInput = document.getElementById('userLocation');
const latitudeInput = document.getElementById('latitude');
const longitudeInput = document.getElementById('longitude');

if (getLocationBtn) {
  getLocationBtn.addEventListener('click', (e) => {
    e.preventDefault();
    
    if (!navigator.geolocation) {
      userLocationInput.value = 'Geolocation not supported by your browser';
      return;
    }
    
    getLocationBtn.textContent = '⏳ Getting location...';
    getLocationBtn.disabled = true;
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const accuracy = Math.round(position.coords.accuracy);
        
        latitudeInput.value = latitude;
        longitudeInput.value = longitude;
        
        // Display location with coordinates and accuracy
        userLocationInput.value = `Lat: ${latitude.toFixed(6)}, Lon: ${longitude.toFixed(6)} (±${accuracy}m)`;
        
        getLocationBtn.textContent = '✓ Location captured';
        getLocationBtn.style.background = 'rgba(68, 215, 182, 0.14)';
        getLocationBtn.style.color = '#44d7b6';
      },
      (error) => {
        let errorMessage = 'Unable to retrieve location';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied. Please enable location access in browser settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
        }
        userLocationInput.value = errorMessage;
        getLocationBtn.textContent = '📍 Try Again';
        getLocationBtn.disabled = false;
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  });
}

// Support form submission
const supportForm = document.getElementById('supportForm');
const supportMessage = document.getElementById('supportMessage');

if (supportForm) {
  supportForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const supportData = {
      timestamp: new Date().toISOString(),
      location: userLocationInput.value,
      latitude: latitudeInput.value,
      longitude: longitudeInput.value,
      supportNeeded: supportForm.querySelector('select').value,
      contactMethod: supportForm.querySelectorAll('select')[1].value,
      message: supportForm.querySelector('textarea').value
    };
    
    // Store in local storage
    const supportRequests = JSON.parse(localStorage.getItem('support_requests') || '[]');
    supportRequests.push(supportData);
    localStorage.setItem('support_requests', JSON.stringify(supportRequests));
    
    // Show success message
    supportMessage.textContent = '✓ Support request submitted successfully. First responders will use your location if needed.';
    supportMessage.style.background = 'rgba(68, 215, 182, 0.08)';
    supportMessage.style.borderColor = 'rgba(68, 215, 182, 0.18)';
    supportMessage.style.color = '#44d7b6';
    supportMessage.style.display = 'block';
    
    // Reset form
    supportForm.reset();
    supportMessage.textContent = '';
    supportMessage.style.display = 'none';
    
    setTimeout(() => {
      supportForm.reset();
    }, 2000);
  });
}
