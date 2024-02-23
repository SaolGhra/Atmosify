async function fetchNews() {
  try {
    const response = await $.ajax({
      url: 'keys/getNewsData.php',
      dataType: 'json'
    });

    // Log the entire response to see its structure
    console.log(response);

    // Check if there are articles for today
    if (response && response.today && response.today.response && response.today.response.results && response.today.response.results.length > 0) {
      console.log('Displaying today\'s articles.');
      displayNews(response.today.response.results);
    }

    // Check if there are articles for tomorrow
    if (response && response.tomorrow && response.tomorrow.response && response.tomorrow.response.results && response.tomorrow.response.results.length > 0) {
      console.log('Displaying tomorrow\'s articles.');
      // Append tomorrow's articles to the news container
      displayNews(response.tomorrow.response.results, true);
    }

    // If no articles for today or tomorrow, display yesterday's articles
    if ((!response.today || response.today.response.results.length === 0) && (!response.tomorrow || response.tomorrow.response.results.length === 0)) {
      console.log('No news articles available for today or tomorrow. Displaying yesterday\'s articles.');
      displayNews(response.yesterday.response.results);
    }

  } catch (error) {
    console.error('Error fetching news:', error);
  }
}

function displayNews(newsArticles, append = false) {
  const newsContainer = document.querySelector('.news-container');

  if (!newsContainer) {
    console.error('Error: .news-container not found.');
    return;
  }

  // Clear existing content if append is false
  if (!append) {
    newsContainer.innerHTML = '';
  }

  if (!newsArticles || !Array.isArray(newsArticles)) {
    console.error('Error: Invalid newsArticles data.');
    return;
  }

  if (newsArticles.length === 0) {
    console.log('No news articles available.');
    return;
  }

  newsArticles.forEach(article => {
    const articleDiv = document.createElement('div');
    articleDiv.classList.add('article');

    const titleElement = document.createElement('h3');
    titleElement.textContent = article.webTitle;

    const publicationDateElement = document.createElement('p');
    publicationDateElement.textContent = `Published on: ${new Date(article.webPublicationDate).toLocaleString()}`;

    const linkElement = document.createElement('a');
    linkElement.href = article.webUrl;
    linkElement.textContent = 'Read more';
    linkElement.target = '_blank';

    articleDiv.appendChild(titleElement);
    articleDiv.appendChild(publicationDateElement);
    articleDiv.appendChild(linkElement);

    newsContainer.appendChild(articleDiv);
  });

  console.log('News displayed successfully.');
}

document.addEventListener('DOMContentLoaded', fetchNews);
