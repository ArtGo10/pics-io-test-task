const form = document.querySelector('.comments-form');
const commentsContainer = document.querySelector('.comments-container');
const loadingSpinner = document.querySelector('.loading-spinner');

form.comment.value = localStorage.getItem('text-area-comment') ?? '';

function handleDeleteComment(event) {
    const commentEl = document.querySelector(`[data-id='comment-${event.target.dataset.id}']`);
    if (commentEl) commentEl.remove();
}

function addClickListenerToDeleteButtons() {
    const deleteCommentBtns = document.querySelectorAll('.comment-delete-button');
    deleteCommentBtns.forEach(btn => btn.addEventListener('click', handleDeleteComment));
}

function renderComments(comments) {
    if (!comments.length || comments.length === 0) return;
    commentsContainer.innerHTML = comments.map(comment =>
        `<div class="comment-wrapper" data-id=${`comment-${comment.id}`}>
            <div class="comment-author">
                <span class="comment-author-round">${comment.user.username.slice(0, 2)}</span>
                <span class="comment-author-name">${comment.user.username}</span>
            </div>
            <button data-id=${comment.id} type="button" class="comment-delete-button">X</button>
            <div class="comment">${comment.body}</div>
        </div>`
    ).join('');
    addClickListenerToDeleteButtons();
}

function handleSubmit(event) {
    event.preventDefault();
    const comment = {
        id: Math.floor(Math.random() * 1000) * Math.floor(Math.random() * 1000), // to decrease chances to get the same id
        body: event.target.comment.value,
        user: {
            id: Math.floor(Math.random() * 1000) * Math.floor(Math.random() * 1000),
            username: 'johndoe'
        }
    }
    const commentEl = document.createElement('div');
    commentEl.classList.add('comment-wrapper');
    commentEl.setAttribute('data-id', `comment-${comment.id}`);
    commentEl.innerHTML = `
        <div class="comment-author">
            <span class="comment-author-round">${comment.user.username.slice(0, 2)}</span>
            <span class="comment-author-name">${comment.user.username}</span>
        </div>
        <button data-id=${comment.id} type="button" class="comment-delete-button">X</button>
        <div class="comment">${comment.body}</div>
    `;
    commentsContainer.appendChild(commentEl);
    form.comment.value = '';
    localStorage.removeItem('text-area-comment');
    addClickListenerToDeleteButtons();
}

function handleCommentChange(event) {
    localStorage.setItem('text-area-comment', event.target.value);
}

form.addEventListener('submit', handleSubmit);
form.comment.addEventListener('input', handleCommentChange);

fetch('https://dummyjson.com/comments/?limit=3')
    .then(res => res.json())
    .then(json => {
        if (!json || !json.comments) return;
        renderComments(json.comments);
    })
    .catch(console.log)
    .finally(() => loadingSpinner.style.display = 'none');