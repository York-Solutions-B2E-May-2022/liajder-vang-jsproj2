async function urlFetch(url, _fetch = fetch) {
    try {
        const response = await _fetch(url);
        if (!response.ok) {
            return 'Response not okay'
        }
        return await response.json()
    } catch (error) {
        return 'Response not found'
    }
}

const submitElem = document.getElementById('user-form')

if (submitElem !== null) {
    submitElem.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(submitElem);

        await renderIPAddress()
        await renderHTMLHeaders()

        document.getElementById('valid-JSON').innerHTML = await renderValidateJSON(formData.get('text-input'))
        document.getElementById('md5').innerHTML = await renderMD5(formData.get("md5-input"))
    })
}

function getIP(data) {
    return data?.ip;
}

async function renderIPAddress() {
    const userIP = await getIP(
        await urlFetch('http://ip.jsontest.com/')
    )
    if (userIP) {
        document.getElementById('userIP').innerHTML = userIP
    } else {
        document.getElementById('userIP').innerHTML = "Can't find your IP"
    }
}

function createHTMLHeaders(data) {
    console.log(data)
    return `
    <div>
        <p>X-Cloud-Trace-Context: ${data['X-Cloud-Trace-Context']}</p>
        <p>Accept: ${data.Accept}</p>
        <p>Upgrade-Insecure-Requests: ${data['Upgrade-Insecure-Requests']}</p>
        <p>traceparent: ${data['traceparent']}</p>
        <p>User-Agent: ${data['User-Agent']}</p>
        <p>Referer: ${data['Referer']}</p>
        <p>Host: ${data.Host}</p>
        <p>Accept-Language: ${data['Accept-Language']}</p>
    </div>
    `;
}

async function renderHTMLHeaders() {
     const data = createHTMLHeaders(
        await urlFetch('http://headers.jsontest.com/')
    )
    if (data) {
        document.getElementById('userHeader').innerHTML = data
    }
}

function getDateTime(data) {
    return `
    <div>
        <p>time: ${data.time}</p>
        <p>milliseconds_since_epoch: ${data['milliseconds_since_epoch']}</p>
        <p>date: ${data.date}</p>
    </div>
    `
}

async function renderDateTime() {
    const data = getDateTime(
        await urlFetch('http://date.jsontest.com/'))
    if (data) {
        document.getElementById('date-time').innerHTML = data
    }
}
setInterval(renderDateTime, 1000)

function getValidateJSON(data) {
    if (data.validate) {
        return `
    <div>
        <p>object_or_array: ${data['object_or_array']}</p>
        <p>empty: ${data.empty}</p>
        <p>parse_time_nanoseconds: ${data['parse_time_nanoseconds']}</p>
        <p>validate: ${data.validate}</p>
        <p>size: ${data.size}</p>
    </div>
    `
    } else {
        return `
    <div>
        <p>error: ${data.error}</p>
        <p>object_or_array: ${data['object_or_array']}</p>
        <p>error_info: ${data['error_info']}</p>
        <p>validate: ${data.validate}</p>
    </div>
    `
    }
}

// function getValidJSON(data) {
//     return `
//     <div>
//         <p>object_or_array: ${data['object_or_array']}</p>
//         <p>empty: ${data.empty}</p>
//         <p>parse_time_nanoseconds: ${data['parse_time_nanoseconds']}</p>
//         <p>validate: ${data.validate}</p>
//         <p>size: ${data.size}</p>
//     </div>
//     `
// }

// function getInvalidJSON(data) {
//     return `
//     <div>
//         <p>error: ${data.error}</p>
//         <p>object_or_array: ${data['object_or_array']}</p>
//         <p>error_info: ${data['error_info']}</p>
//         <p>validate: ${data.validate}</p>
//     </div>
//     `
// }

async function renderValidateJSON(text) {
    //redundant
    const validJSON = getValidateJSON(
        await urlFetch(`http://validate.jsontest.com/?json=${text}`))
    return validJSON
}

function getMD5(data) {
    return `
    <div>
        <p>md5: ${data.md5}</p>
        <p>original: ${data.original}</p>
    </div>
    `
}

function test_getMD5_should_return_div() {
    // arrange
    const expected = `
    <div>
        <p>md5: md5</p>
        <p>original: original</p>
    </div>
    `

    const obj = {
        md5: 'md5',
        original: 'original'
    }

    // act
    const result = getMD5(obj)

    // assert
    if (result !== expected) {
        console.log(`test_getMD5 - failed`)
    } else {
        console.log(`test_getMD5 - passed`)
    }
}

async function renderMD5(text) {
    const data = getMD5(
        await urlFetch(`http://md5.jsontest.com/?text=${text}`)
    )
    if (data) {
        //console.log(data)
        //document.getElementById('md5').innerHTML = data;
        return data
    }
}

//-----------------Test Functions-----------------
async function test_urlFetch_ok() {
    // arrange
    const expected = true;
    const _fetch = async () => {
        return({
            ok: true,
            json: async () => {
                return true;
            }
        })
    }

    // act
    const result = await urlFetch('', _fetch)

    // assert
    if (result !== expected) {
        console.log(`test_urlFetch_ok - failed`)
    } else {
        console.log(`test_urlFetch_ok - passed`)
    }

}

async function test_urlFetch_not_ok() {
    // arrange
    const expected = 'Response not okay'
    const _fetch = async () => {
        return({
            ok: false
        })
    }

    // act
    const result = await urlFetch('', _fetch)

    // assert
    if (result !== expected) {
        console.log(`test_urlFetch_not_ok - failed`)
    } else {
        console.log(`test_urlFetch_not_ok - passed`)
    }
}

async function test_urlFetch_failed() {
    // arrange
    const expected = 'Response not found'
    const _fetch = async () => {
        throw 'error'
    }

    // act
    const result = await urlFetch('', _fetch)

    // arrange
    if (result !== expected) {
        console.log(`test_urlFetch_failed - failed`)
    } else {
        console.log(`test_urlFetch_failed - passed`)
    }
}

function test_getIP_should_return_value() {
    // arrange
    const expected = true
    const obj = {
        ip: true
    }

    // act
    const result = getIP(obj)

    // assert
    if (result !== expected) {
        console.log(`test_getIP_should_return_value - failed`)
    } else {
        console.log(`test_getIP_should_return_value - passed`)
    }
}

function test_createHTMLHeaders_should_format_string_from_obj() {
    // arrange
    const expected = `
    <div>
        <p>X-Cloud-Trace-Context: X-Cloud-Trace-Context</p>
        <p>Accept: accept</p>
        <p>Upgrade-Insecure-Requests: Upgrade-Insecure-Requests</p>
        <p>traceparent: traceparent</p>
        <p>User-Agent: user-Agent</p>
        <p>Referer: referer</p>
        <p>Host: host</p>
        <p>Accept-Language: Accept-Language</p>
    </div>
    `;

    const obj = {
        ['X-Cloud-Trace-Context']: 'X-Cloud-Trace-Context',
        accept: 'accept',
        ['Upgrade-Insecure-Requests']: 'Upgrade-Insecure-Requests',
        ['traceparent']: 'traceparent',
        ['user-Agent']: 'user-Agent',
        ['referer']: 'referer',
        host: 'host',
        ['Accept-Language']: 'Accept-Language'
    }

    // act
    const result = createHTMLHeaders(obj)

    // assert
    if (result !== expected) {
        console.log(`test_createHTMLHeaders_should_format_string_from_obj - failed`)
    } else {
        console.log(`test_createHTMLHeaders_should_format_string_from_obj - passed`)
    }
}

function test_getDateTime_should_show_date() {
    // arrange
    const expected = `
    <div>
        <p>time: time</p>
        <p>milliseconds_since_epoch: milliseconds_since_epoch</p>
        <p>date: date</p>
    </div>
    `

    const obj = {
        time: 'time',
        ['milliseconds_since_epoch']: 'milliseconds_since_epoch',
        date: 'date'
    }
    // act
    const result = getDateTime(obj)
    console.log(expected)
    console.log(result)

    // assert
    if (result !== expected) {
        console.log(`test_getDateTime_should_show_date - failed`)
    } else {
        console.log(`test_getDateTime_should_show_date - passed`)
    }
}

// test_urlFetch_ok()
// test_urlFetch_not_ok()
// test_urlFetch_failed()
// test_getIP_should_return_value()
// test_createHTMLHeaders_should_format_string_from_obj()
// test_getDateTime_should_show_date()
// test_getMD5_should_return_div()

// renderIPAddress()
// renderHTMLHeaders()
// renderDateTime()
