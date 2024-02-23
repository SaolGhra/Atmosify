function getMultipleRandomQuotes() {
  const numQuotes = 30;
  const quoteContainer = document.querySelector('.inspirational-posting-container');

  // Clear existing quotes
  quoteContainer.innerHTML = '';

  // Fetch and display 25 random quotes
  for (let i = 0; i < numQuotes; i++) {
    fetchRandomQuote(quoteContainer);
  }
}

function fetchRandomQuote(quoteContainer) {
  // API endpoint for a random inspirational quote
  const apiUrl = 'https://api.quotable.io/random';

  // Fetch the quote from the API
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => displayQuote(quoteContainer, data))
    .catch(error => console.error('Error fetching quote:', error));
}

function displayQuote(quoteContainer, quoteData) {
  // Append the fetched quote to the container
  const quoteElement = document.createElement('inspirational-posting-content');
  quoteElement.innerHTML = `
    <p class="quote-content">${quoteData.content}</p>
    <p class="quote-author">- ${quoteData.author}</p>
    <hr>
  `;
  quoteContainer.appendChild(quoteElement);
}