let messagesPromise = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");

messagesPromise.then(displayMessages, messagesError);

function displayMessages(response)
{
    console.log(response);
    const displayLocation = document.querySelector(".chat");
    for(let i = 0; i < response.data.length; i++)
    {
        if(response.data[i].type == "status")
        {
            displayLocation.innerHTML +=
            `
            <div class="message-container-external full-width enter-leave">
            <div class="message-container-internal">
                <span class="time gray-color time-format font-size-14">(${response.data[i].time})</span>
                <span class="user-from-to weight-700 message-format font-size-14">${response.data[i].from}</span>
                <span class="user-interaction message-format font-size-14">${response.data[i].text}</span>
            </div>
        </div>
            `
        }
        if(response.data[i].type == "message")
        {
            displayLocation.innerHTML +=
            `
            <div class="message-container-external full-width public">
            <div class="message-container-internal">
                <span class="time gray-color time-format font-size-14">(${response.data[i].time})</span>
                <span class="user-from-to weight-700 message-format font-size-14">${response.data[i].from}</span>
                <span class="user-interaction message-format font-size-14">para</span>
                <span class="user-from-to weight-700 message-format font-size-14">${response.data[i].to}:</span>
                <span class="user-message message-format font-size-14">${response.data[i].text}</span>
            </div>
        </div>
            `
        }
        if (response.data[i].type == "private_message") {
            displayLocation.innerHTML +=
                `
            <div class="message-container-external full-width private">
            <div class="message-container-internal">
                <span class="time gray-color time-format font-size-14">(${response.data[i].time})</span>
                <span class="user-from-to weight-700 message-format font-size-14">${response.data[i].from}</span>
                <span class="user-interaction message-format font-size-14">reservadamente para</span>
                <span class="user-from-to weight-700 message-format font-size-14">${response.data[i].to}:</span>
                <span class="user-message message-format font-size-14">${response.data[i].text}</span>
            </div>
        </div>
            `
        }
    }

}

function messagesError(error)
{
    console.log(error);
}