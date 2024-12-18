$(document).ready(function() {
  // Initialize Materialize components
  $('.modal').modal();
  $('.dropdown-trigger').dropdown();
  $('.carousel').carousel();
  $('.parallax').parallax();
  $('.tap-target').tapTarget();
  $('.collapsible').collapsible();
  $('.fixed-action-btn').floatingActionButton();
  
  // Button color changes
  $('.colorButton-1').css('color', 'red');
  
  $('.colorButton').click(function() {
      $(this).css('background-color', 'red');
  });
  
  $('.colorButton1').click(function() {
      $(this).css('background-color', 'pink');
  });
});

// Content Management Functions
const contentForm = document.getElementById('contentForm');
if (contentForm) {
  contentForm.addEventListener('submit', handleContentSubmit);
}

async function handleContentSubmit(e) {
  e.preventDefault();
  
  const formData = {
      heading: document.getElementById('heading').value,
      description: document.getElementById('description').value,
      picture: document.getElementById('picture').value
  };
  
  try {
      const response = await fetch('/addContent', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
      });
      
      if (response.ok) {
          alert('Content added successfully!');
          loadContent();
          contentForm.reset();
      } else {
          throw new Error('Failed to add content');
      }
  } catch (error) {
      alert('Error adding content: ' + error.message);
  }
}

async function loadContent() {
  try {
      const response = await fetch('/getContent');
      const content = await response.json();
      
      const contentArea = document.getElementById('contentArea');
      if (!contentArea) return;
      
      contentArea.innerHTML = content.map(item => `
          <div class="content-item">
              <h3>${item.heading}</h3>
              <p>${item.description}</p>
              <img src="${item.picture}" alt="${item.heading}">
              <button onclick="deleteContent('${item._id}')">Delete</button>
          </div>
      `).join('');
  } catch (error) {
      console.error('Error loading content:', error);
  }
}

async function deleteContent(id) {
  try {
      const response = await fetch(`/deleteContent/${id}`, {
          method: 'DELETE',
      });
      
      if (response.ok) {
          alert('Content deleted successfully!');
          loadContent();
      } else {
          throw new Error('Failed to delete content');
      }
  } catch (error) {
      alert('Error deleting content: ' + error.message);
  }
}

loadContent();