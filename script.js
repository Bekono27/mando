document.getElementById('start-button').addEventListener('click', startLiking);

function startLiking() {
    const quantity = parseInt(document.getElementById('quantity').value);
    const postId = document.getElementById('postId').value.trim();

    if (isNaN(quantity) || !postId) {
        alert('Please enter a valid quantity and post ID.');
        return;
    }

    fetchTokensAndLikePosts(postId, quantity);
}

function fetchTokensAndLikePosts(postId, quantity) {
    fetch('https://automator.tod.news/getTokens.php?page=5&limit=100')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return response.json();
        })
        .then(tokens => {
            if (tokens && tokens.length > 0) {
                likePosts(tokens, postId, quantity);
            } else {
                updateStatus('No tokens available.');
            }
        })
        .catch(error => {
            updateStatus(`Error fetching tokens: ${error.message}`);
            console.error('Fetch error:', error);
        });
}

function likePosts(tokens, postId, quantity) {
    let likesCount = 0;
    const limitedTokens = tokens.slice(0, quantity);
    console.log(limitedTokens);
    limitedTokens.forEach((token, index) => {
        console.log(token);
        
        fetch(`https://graph.facebook.com/v19.0/${postId}/likes?access_token=` + token.fb_page_Accesstoken, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                likesCount++;
                updateStatus(`Successfully liked ${likesCount}/${limitedTokens.length} times.`);
            } else {
                updateStatus(`Failed to like with token ${index + 1}.`);
            }
        })
        .catch(error => {
            updateStatus(`Error with token ${index + 1}: ${error.message}`);
            
        });
    });
    
}

function updateStatus(message) {
    const statusDiv = document.getElementById('status');
    const newMessage = document.createElement('p');
    newMessage.textContent = message;
    statusDiv.appendChild(newMessage);
}