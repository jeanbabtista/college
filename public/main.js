const tagInput = document.getElementById('tag')

if (tagInput)
  tagInput.addEventListener('keyup', async (e) => {
    if (e.code !== 'Enter') return

    const { value: tag } = e.target

    try {
      const response = await fetch('/tag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tag })
      })

      const { error, message } = await response.json()
      const toastBackgroundColor = error ? '#f44336' : '#4caf50'

      Toastify({
        text: message,
        style: {
          background: toastBackgroundColor
        }
      }).showToast()

      const tagsSelect = document.getElementById('tags')
      if (!error) tagsSelect.append(new Option(tag, tag))

      const filterTagsSelect = document.getElementById('filter-tags')
      if (!error) filterTagsSelect.append(new Option(tag, tag))

      e.target.value = ''
    } catch (e) {
      console.log(e)
    }
  })
