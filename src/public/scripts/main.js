const showPastCheckbox = document.getElementById('showPast')
const search = document.getElementById('search')
const commentSubmit = document.getElementById('comment-submit')
let ip;

const getJsonData = async (url) => await (await fetch(url)).json()
const postJsonData = async (data, url) => await (await fetch(url, {
    method: 'post',
    headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
    body: JSON.stringify(data)
})).json()

const getQueryParameterValue = (parameter) => (new URLSearchParams(location.search)).get(parameter)

const setQueryStringParameter = (name, value) => {
    const params = new URLSearchParams(location.search);
    params.set(name, value);
    window.history.replaceState({}
        ,
        '',
        decodeURIComponent(`${window.location.pathname}?${params}`)
    );
}

if (showPastCheckbox) {
    showPastCheckbox.addEventListener('change', function () {
        setQueryStringParameter('isOutOfDate', this.checked ? '1' : '0')
        location.reload()
    })

    switch (new URLSearchParams(location.search).get('isOutOfDate')) {
        case '0':
            showPastCheckbox.checked = false
            break
        case '1':
            showPastCheckbox.checked = true
            break
    }
}

if (search)
    search.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            setQueryStringParameter('search', search.value)
            location.reload()
        }
    })

if (commentSubmit)
    commentSubmit.addEventListener('click', async () => {
        const getTagValue = (tag) => ['input', 'textarea'].includes(tag.tagName.toLowerCase()) ?
            tag.value : tag.innerHTML

        const username = getTagValue(document.getElementById('username'))
        const email = getTagValue(document.getElementById('email'))
        const comment = getTagValue(document.getElementById('comment-body'))
        const adId = getQueryParameterValue('id')

        const data = {username, email, comment, ip, adId}
        const url = 'http://php-mysql-mvc-api.test/src/?controller=comment&action=create'

        const response = (await postJsonData(data, url))[0]
        // console.log('response:', response)

        Toastify({
            text: response?.message ?? 'Unknown message',
            duration: 3000,
            gravity: 'top',
            position: 'right',
            stopOnFocus: true,
            style: {background: response?.error ? 'rgb(153 27 27)' : 'rgb(22 101 52)',}
        }).showToast()
    })

    ;
(async () => ip = (await getJsonData('https://api.ipify.org/?format=json')).ip)()