// jquery
$(document).ready(function(){
    $('.modal').modal();
  });
      
$(document).ready(function () {
  $(".colorButton-1").css("color", "red")
});

// Drop down feature in navbar
$('.dropdown-trigger').dropdown();

// Carousel 
$(document).ready(function(){
  $('.carousel').carousel();
});

// Parallax
$(document).ready(function(){
  $('.parallax').parallax();
});

// Taptarget
$(document).ready(function(){
  $('.tap-target').tapTarget();
});

// Collapsible
$(document).ready(function(){
  $('.collapsible').collapsible();
});
      
// Collor changing button
$(document).ready(function() {
  $('.colorButton').click(function() {
    $(this).css('background-color', 'red'); // Changes the background color to red
  });
});
$(document).ready(function() {
  $('.colorButton1').click(function() {
    $(this).css('background-color', 'pink'); // Changes the background color to red
  });
});

// Floating action button
$(document).ready(function(){
  $('.fixed-action-btn').floatingActionButton();
});

// Adding a content and deleting it
document.getElementById('contentForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const heading = document.getElementById('heading').value;
  const description = document.getElementById('description').value;
  const picture = document.getElementById('picture').value;

  const response = await fetch('/addContent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ heading, description, picture }),
  });

  if (response.ok) {
    alert('Content added successfully!');
    loadContent(); 
    document.getElementById('contentForm').reset(); 
  } else {
    alert('Error adding content!');
  }
});

async function loadContent() {
  const response = await fetch('/getContent');
  const content = await response.json();

  const contentArea = document.getElementById('contentArea');
  contentArea.innerHTML = '';

  content.forEach(item => {
    contentArea.innerHTML += `
      <div>
        <h3>${item.heading}</h3>
        <p>${item.description}</p>
        <img src="${item.picture}" alt="${item.heading}">
        <button onclick="deleteContent('${item._id}')">Delete</button>
      </div>
    `;
  });
}

// Function to delete content
async function deleteContent(id) {
  const response = await fetch(`/deleteContent/${id}`, {
    method: 'DELETE',
  });

  if (response.ok) {
    alert('Content deleted successfully!');
    loadContent();
  } else {
    alert('Error deleting content!');
  }
}

loadContent();
