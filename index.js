//-----------------Side Effects-----------------
const submitElem = document.getElementById('user-form')

if (submitElem !== null) {
    submitElem.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(submitElem);

        document.getElementById('valid-JSON').innerHTML = await renderValidateJSON(formData.get('text-input'))
        document.getElementById('md5').innerHTML = await renderMD5(formData.get("md5-input"))
    })
}

async function renderIPAddress() {
    const userIP = await getIP(
        await urlFetch('http://ip.jsontest.com/')
    )
    if (userIP) {
        document.getElementById('userIP').innerHTML += userIP
    } else {
        document.getElementById('userIP').innerHTML += "Can't find your IP"
    }
}
renderIPAddress()

async function renderHTMLHeaders() {
    const data = createHTMLHeaders(
        await urlFetch('http://headers.jsontest.com/')
    )
    if (data) {
        document.getElementById('userHeader').innerHTML += data + `<br>`
    }
}
renderHTMLHeaders()

async function renderDateTime() {
    const data = getDateTime(
        await urlFetch('http://date.jsontest.com/'))
    if (data) {
        document.getElementById('date-time').innerHTML = `The Current Date and Time (GMT) is: ${data}`
    }
}
setInterval(renderDateTime, 1000)
//-----------------Without Side Effects-----------------
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

function getIP(data) {
    return data?.ip;
}

function createHTMLHeaders(data) {
    let str = ''
    for (let property in data) {
        str += `${property} : ${data[property]} <br>`
    }
    return str
}

function getDateTime(data) {
    return `
    <div>
        <p>time: ${data?.time}</p>
        <p>milliseconds_since_epoch: ${data['milliseconds_since_epoch']}</p>
        <p>date: ${data?.date}</p>
    </div>
    `
}

function getValidateJSON(data) {
    if (data.validate) {
        return `
    <div>
        <p>object_or_array: ${data['object_or_array']}</p>
        <p>empty: ${data?.empty}</p>
        <p>parse_time_nanoseconds: ${data['parse_time_nanoseconds']}</p>
        <p>validate: ${data?.validate}</p>
        <p>size: ${data?.size}</p>
    </div>
    `
    } else {
        return `
    <div>
        <p>error: ${data?.error}</p>
        <p>object_or_array: ${data['object_or_array']}</p>
        <p>error_info: ${data['error_info']}</p>
        <p>validate: ${data?.validate}</p>
    </div>
    `
    }
}

async function renderValidateJSON(text) {
    const validJSON = getValidateJSON(
        await urlFetch(`http://validate.jsontest.com/?json=${text}`))
    if (validJSON) {
        return validJSON
    }
}

function getMD5(data) {
    return `
    <div>
        <p>md5: ${data?.md5}</p>
        <p>original: ${data?.original}</p>
    </div>
    `
}

async function renderMD5(text) {
    const data = getMD5(
        await urlFetch(`http://md5.jsontest.com/?text=${text}`)
    )
    if (data) {
        return data
    }
}
//-----------------Test Functions-----------------
async function test_urlFetch_ok() {
    // arrange
    const expected = true;
    const _fetch = async () => {
        return ({
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
        console.log(`test_urlFetch_ok - failed: -> expected: ${expected} -> actual: ${result}`)
    } else {
        console.log(`test_urlFetch_ok - passed`)
    }

}

async function test_urlFetch_not_ok() {
    // arrange
    const expected = 'Response not okay'
    const _fetch = async () => {
        return ({
            ok: false
        })
    }

    // act
    const result = await urlFetch('', _fetch)

    // assert
    if (result !== expected) {
        console.log(`test_urlFetch_not_ok - failed: -> expected: ${expected} -> actual: ${result}`)
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
        console.log(`test_urlFetch_failed - failed: -> expected: ${expected} -> actual: ${result}`)
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
        console.log(`test_getIP_should_return_value - failed: -> expected: ${expected} -> actual: ${result}`)
    } else {
        console.log(`test_getIP_should_return_value - passed`)
    }
}

function test_getIP_invalid_input() {
    // arrange
    const expected = undefined
    const testData = ''

    // act
    const result = getIP(testData)

    // assert
    if (result !== expected) {
        console.log(`test_getIP_invalid_input - failed: -> expected: ${expected} -> actual ${result}`)
    } else {
        console.log('test_getIP_invalid_input - passed')
    }
}

function test_createHTMLHeaders_should_format_string_from_obj() {
    // arrange
    const expected = 'name : Max <br>lastName : Holloway <br>'
    const obj = {
        name: 'Max',
        lastName: 'Holloway'
    }

    // act
    const result = createHTMLHeaders(obj)

    // assert
    if (result !== expected) {
        console.log(`test_createHTMLHeaders_should_format_string_from_obj - failed: -> expected: ${expected} -> actual: ${result}`)
    } else {
        console.log(`test_createHTMLHeaders_should_format_string_from_obj - passed`)
    }
}

function test_createHTMLHeaders_should_return_empty_string() {
    // arrange
    const expected = ''
    const testData = ''

    // act
    const result = createHTMLHeaders(testData)

    // assert
    if (result !== expected) {
        console.log(`test_createHTMLHeaders_should_return_empty_string - failed: -> expected: ${expected} -> actual ${result}`)
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

    // assert
    if (result !== expected) {
        console.log(`test_getDateTime_should_show_date - failed: -> expected ${expected} -> actual ${result}`)
    } else {
        console.log(`test_getDateTime_should_show_date - passed`)
    }
}

function test_getDateTime_invalid_input() {
    // arrange
    const expected = `
    <div>
        <p>time: undefined</p>
        <p>milliseconds_since_epoch: undefined</p>
        <p>date: undefined</p>
    </div>
    `
    const testData = 'fsdfdsafas'

    // act
    const result = getDateTime(testData)

    // assert
    if (result !== expected) {
        console.log(`test_getDateTime_invalid_input - failed: -> expected ${expected} -> actual: ${result}`)
    }
}

function test_getValidateJSON_should_read_correct_input() {
    // arrange
    const expected = `
    <div>
        <p>object_or_array: object_or_array</p>
        <p>empty: empty</p>
        <p>parse_time_nanoseconds: parse_time_nanoseconds</p>
        <p>validate: validate</p>
        <p>size: size</p>
    </div>
    `
    const obj = {
        object_or_array: 'object_or_array',
        empty: 'empty',
        ['parse_time_nanoseconds']: 'parse_time_nanoseconds',
        validate: 'validate',
        size: 'size'
    }

    // act
    const result = getValidateJSON(obj)

    // assert
    if (result !== expected) {
        console.log(`test_getValidateJSON_should_read_correct_input - failed: -> expected ${expected} -> actual: ${result}`)
    } else {
        console.log(`test_getValidateJSON_should_read_correct_input - passed`)
    }
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
        console.log(`test_getMD5 - failed: -> expected: ${expected} -> actual ${result}`)
    } else {
        console.log(`test_getMD5 - passed`)
    }
}

function test_getMD5_should_return_undefined() {
    // arrange
    const expected = `
    <div>
        <p>md5: undefined</p>
        <p>original: undefined</p>
    </div>
    `
    const obj= 'fdsafasfda'

    // act
    const result = getMD5(obj)

    // assert
    if (result !== expected) {
        console.log(`test_getMD5_should_return_undefined - failed: -> expected: ${expected} -> actual ${result}`)
    } else{
        console.log(`test_getMD5_should_return_undefined - passed`)
    }
}

test_urlFetch_ok()
test_urlFetch_not_ok()
test_urlFetch_failed()

test_getIP_should_return_value()
test_getIP_invalid_input()

test_createHTMLHeaders_should_format_string_from_obj()
test_createHTMLHeaders_should_return_empty_string()

test_getDateTime_should_show_date()
test_getDateTime_invalid_input()

test_getValidateJSON_should_read_correct_input()

test_getMD5_should_return_div()
test_getMD5_should_return_undefined()
