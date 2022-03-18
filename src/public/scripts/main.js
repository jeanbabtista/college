const showPastCheckbox = document.getElementById('showPast')
const search = document.getElementById('search')

const setQueryStringParameter = (name, value) => {
    const params = new URLSearchParams(location.search);
    params.set(name, value);
    window.history.replaceState({}, '', decodeURIComponent(`${window.location.pathname}?${params}`));
}

if (showPastCheckbox) {
    showPastCheckbox.addEventListener('change', function() {
        setQueryStringParameter('isOutOfDate', this.checked ? '1' : '0')
        location.reload()
    })

    const isOutOfDate = new URLSearchParams(location.search).get('isOutOfDate');

    switch (isOutOfDate) {
        case '0':
            showPastCheckbox.checked = false
            break
        case '1':
            showPastCheckbox.checked = true
            break
    }
}

if (search) {
    search.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            setQueryStringParameter('search', search.value)
            location.reload()
        }
    })
}

