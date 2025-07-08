self.addEventListener('push', (event) => {
    const data = event.data.json();
    console.log('Push received:', data);
  
    const options = {
      body: data.message,
      icon: 'https://via.placeholder.com/50', // Fallback icon
      image: data.imageUrl || '',             // Image displayed in the notification
      requireInteraction: true
    };
  
    self.registration.showNotification(data.title, options);
  });
  