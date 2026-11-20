const challengePage = document.getElementById('challenge-page');

if (challengePage) {
  const button1 = document.getElementById('cbtn-1');
  const button2 = document.getElementById('cbtn-2');
  const submitButton = document.getElementById('submit-flag');
  const csrfToken = challengePage.dataset.csrfToken;
  const endpoint = '/challenge/' + encodeURIComponent(challengePage.dataset.challengeName);
  let labUrl = null;
  let running = false;

  button1.addEventListener('click', () => {
    fetch(endpoint, {
      method: running ? 'DELETE' : 'POST',
      headers: {'X-CSRFToken': csrfToken},
    })
      .then(response => {
        if (!response.ok) throw new Error('Challenge request failed');
        return response.json();
      })
      .then(result => {
        running = !running;
        button1.textContent = running ? 'Stop Challenge' : 'Start Challenge';
        button2.classList.toggle('csp-hidden', !running);
        labUrl = running ? result.endpoint : null;
      })
      .catch(error => console.error(error));
  });

  button2.addEventListener('click', () => {
    if (labUrl) window.open(labUrl, '_blank', 'noopener');
  });

  if (submitButton) {
    submitButton.addEventListener('click', () => {
      const input = document.getElementById('flag-input');
      const resultEl = document.getElementById('flag-result');
      fetch(endpoint, {
        method: 'PUT',
        headers: {'X-CSRFToken': csrfToken, 'Content-Type': 'application/json'},
        body: JSON.stringify({flag: input.value}),
      })
        .then(response => response.json())
        .then(result => {
          resultEl.className = 'd-block mt-2 ' + (result.correct ? 'text-success' : 'text-danger');
          resultEl.textContent = result.correct
            ? result.message + ' +' + result.final_score + ' pts'
            : result.message;
        })
        .catch(() => {
          resultEl.className = 'd-block mt-2 text-danger';
          resultEl.textContent = 'Could not submit flag.';
        });
    });
  }
}
