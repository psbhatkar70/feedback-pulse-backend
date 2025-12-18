(function() {
  const scriptTag = document.currentScript;
  const projectKey = scriptTag.getAttribute('data-project-id');

  if (!projectKey) {
    console.error('Feedback Pulse: Project Key missing!');
    return;
  }

  const style = document.createElement('style');
  style.innerHTML = `
    .feedback-button {
      position: fixed; bottom: 20px; right: 20px; 
      padding: 10px 20px; background: #007bff; color: white;
      border: none; border-radius: 5px; cursor: pointer; z-index: 9999;
      font-family: Arial, sans-serif;
    }
    .feedback-modal {
      display: none; position: fixed; bottom: 70px; right: 20px;
      width: 300px; background: white; border: 1px solid #ddd;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1); padding: 15px; z-index: 10000;
      font-family: Arial, sans-serif;
      border-radius: 8px;
    }
    .feedback-input, .feedback-select, .feedback-textarea {
      width: 100%; 
      padding: 8px; 
      margin-bottom: 10px; 
      border: 1px solid #ccc; 
      border-radius: 4px;
      box-sizing: border-box; /* Ensures padding doesn't break width */
    }
    .feedback-textarea { height: 80px; resize: vertical; }
    .feedback-modal h3 { margin-top: 0; margin-bottom: 15px; font-size: 18px; }
  `;
  document.head.appendChild(style);

  const button = document.createElement('button');
  button.className = 'feedback-button';
  button.innerText = 'Feedback';

  const modal = document.createElement('div');
  modal.className = 'feedback-modal';
  
  modal.innerHTML = `
    <h3>Send Feedback</h3>
    
    <input type="text" id="feedback-name" class="feedback-input" placeholder="Your Name" />
    
    <select id="feedback-category" class="feedback-select">
      <option value="" disabled selected>Select Category</option>
      <option value="Bug">Bug</option>
      <option value="Feature">Feature</option>
      <option value="Other">Other</option>
    </select>

    <textarea id="feedback-message" class="feedback-textarea" placeholder="Describe your issue..."></textarea>
    
    <button id="submit-feedback" style="background: #28a745; color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer;">Submit</button>
    <button id="close-feedback" style="background: #dc3545; color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer; margin-left: 10px;">Close</button>
  `;

  document.body.appendChild(button);
  document.body.appendChild(modal);

  button.addEventListener('click', () => {
    modal.style.display = modal.style.display === 'none' ? 'block' : 'none';
  });

  document.getElementById('close-feedback').addEventListener('click', () => {
    modal.style.display = 'none';
  });

  document.getElementById('submit-feedback').addEventListener('click', () => {
    const name = document.getElementById('feedback-name').value.trim();
    const category = document.getElementById('feedback-category').value;
    const message = document.getElementById('feedback-message').value.trim();

    if (!name || !category || !message) {
      alert("Please fill in all fields (Name, Category, and Message).");
      return; 
    }

    fetch('https://feedback-pulse-backend.onrender.com/api/v1/feedback/create', { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: projectKey, 
        name: name,       
        type : category, 
        message: message,
      }),
    })
    .then(response => {
      if (response.ok) {
        alert('Thanks for your feedback!');
        modal.style.display = 'none';
        document.getElementById('feedback-name').value = '';
        document.getElementById('feedback-category').value = '';
        document.getElementById('feedback-message').value = '';
      } else {
        alert('Failed to send feedback.');
      }
    })
    .catch(err => console.error(err));
  });

})();