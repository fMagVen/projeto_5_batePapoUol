let firstTimeLoadingChat = 1;
let firstTimeLoadingSidebar = 1;
let userName;

let pageBody = document.querySelector(".body");
pageBody.innerHTML = '';
pageBody.innerHTML =
`
<div class="login-screen flex centralize">
    <img class="login-logo" src="/assets/logouologin.jpg" alt="logo uol">
    <input class="login-input font-size-18 font-weight-400" type="text" placeholder="Digite seu lindo nome" onkeyup="loginWithEnter(event)">
    <div class="error-align flex centralize">
        <span class="login-name-error font-size-18 font-weight-400"></span>
    </div>
    <button class="login-button"><span class="login-bt-text weight-400 font-size-18" onclick="loginAttempt()">Entrar</span></button>
</div>
<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
<script src="script.js"></script>
`
function loginWithEnter(keyboard) {
    if (keyboard.key == "Enter") {
        loginAttempt();
    }
}

function loginAttempt()
{
    let loginName = document.querySelector(".login-input").value;
    if(loginName == '')
    {
        let loginNameEmpty = document.querySelector(".login-name-error");
        loginNameEmpty.innerHTML = "Digite um nome de usuário!";
        return;
    }
    if(loginName.length > 255)
    {
       let loginNameTooLong = document.querySelector(".login-name-error");
       loginNameTooLong.innerHTML = "Seu nome deve ter menos que 255 caracteres!"
       return;
    }
    let usernamePromise = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants", { name: `${loginName}` });
    userName = loginName;
    usernamePromise.then(connectToChat, loginError);
}

function connectToChat()
{
    const keepOnline = setInterval(connectionMaintenance, 5000);
    pageBody.innerHTML = '';
    pageBody.innerHTML =
    `
    <div class="login-screen flex centralize">
        <img class="login-logo" src="/assets/logouologin.jpg" alt="logo uol">
        <img class="loading-gif" src="/assets/logouologin.gif" alt="animação carregando">
        <span class="loading-text weight-400 size-18">Entrando...</span>
    </div>
    `
    const messagesPromise = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
    const participantsPromise = axios.get("https://mock-api.driven.com.br/api/v4/uol/participants");
    messagesPromise.then(displayMessages, messagesError);
    participantsPromise.then(loadSidebar, messagesError);

}

function loginError(error)
{
    console.log(error);
    if (error == "Error: Request failed with status code 400")
    {
        console.log(error);
        const loginNameTaken = document.querySelector(".login-name-error");
        loginNameTaken.innerHTML = "Esse nome de usuário já está<br>sendo usado, escolha outro!"
    }
    else {
        console.log(error);
        const loginFail = document.querySelector(".login-name-error");
        loginFail.innerHTML = "Houve uma falha no servidor, tente novamente mais tarde!"
    }

}

function displayMessages(response)
{
    if(firstTimeLoadingChat)
    {
        pageBody.innerHTML = '';
        pageBody.innerHTML =
        `
        <header class="header flex centralize bar-sizing white-background full-width">
            <div class="logo-and-people flex header-spacing">
                <img class="logo" src="/assets/logouol.png" alt="logo uol">
                <img class="people-header" src="/assets/people.png" onclick="showSidebar()" alt="botao de pessoas no chat">
            </div>
        </header>
        <main class="chat">
        </main>
        <footer class="write-and-send flex centralize bar-sizing white-background full-width">
            <div class="footer-wrapper">
                <div class="input-and-send flex">
                    <input class="input weight-400" type="text" placeholder="Escreva aqui..." onkeyup="sendWithEnter(event)">
                    <img class="paper-plane-sender" src="assets/paper-plane.png" onclick="sendMessage()" alt="botao de enviar mensagem">
                </div>
                <div class="show-from-to overflow-container">
                    <span class="sending-to weight-400 font-size-14">Enviando para</span>
                    <span class="sending-to to weight-400 font-size-14">Todos</span>
                    <span class="sending-to privacy weight-400 font-size-14"></span>
                </div>
            </div>
        </footer>
        <div class="black-ground hidden" onclick="hideSidebar()">
        </div>
        <aside class="sidebar off-screen">
            <div class="sidebar-titles flex centralize">
                <span class="font-size-16 weight-700">Carregando...</span>
            </div>
        </aside>
        <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
        <script src="script.js"></script>
        `
        console.log(response);
    }
    let displayLocation = document.querySelector(".chat");
    displayLocation.innerHTML = '';
    for(let i = 0; i < response.data.length; i++)
    {
        if(response.data[i].type == "status")
        {
            displayLocation.innerHTML +=
            `
            <div class="message-container-external full-width enter-leave">
                <div class="message-container-internal overflow-container">
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
                <div class="message-container-internal overflow-container">
                    <span class="time gray-color time-format font-size-14">(${response.data[i].time})</span>
                    <span class="user-from-to weight-700 message-format font-size-14">${response.data[i].from}</span>
                    <span class="user-interaction message-format font-size-14">para</span>
                    <span class="user-from-to weight-700 message-format font-size-14">${response.data[i].to}:</span>
                    <span class="user-message message-format font-size-14">${response.data[i].text}</span>
                </div>
            </div>
            `
        }
        if (response.data[i].type == "private_message")
        {
            displayLocation.innerHTML +=
            `
            <div class="message-container-external full-width private">
                <div class="message-container-internal overflow-container">
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
    displayLocation.removeChild(displayLocation.lastChild);
    const lastMessage = displayLocation.lastChild;
    lastMessage.scrollIntoView();
    if(firstTimeLoadingChat)
    {
        firstTimeLoadingChat = 0;
        const reloadingMessages = setInterval(reloadMessages, 3000);
    }
}

function reloadMessages()
{
    const messagesPromise = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
    messagesPromise.then(displayMessages, messagesError);
}
function messagesError(error)
{
    console.log(error);
}

function connectionMaintenance()
{
    const maintenancePromise = axios.post("https://mock-api.driven.com.br/api/v4/uol/status", { name: userName });
    maintenancePromise.catch(maintenanceError);
}
function maintenanceError(error)
{
    console.log(error);
}

function selectTo(toSomeone)
{
    let checkmarkSwap = document.querySelector(".shown-to");
    checkmarkSwap.classList.remove("shown-to");
    checkmarkSwap.classList.add("hidden");
    checkmarkSwap = toSomeone.querySelector(".hidden");
    checkmarkSwap.classList.remove("hidden");
    checkmarkSwap.classList.add("shown-to");

    const getDestination = toSomeone.querySelector(".sidebar-name").innerHTML;
    const placeDestination = document.querySelector(".to");
    placeDestination.innerHTML = getDestination;
}

function selectPrivacy(privacy)
{
    let checkmarkSwap = document.querySelector(".shown-privacy");
    checkmarkSwap.classList.remove("shown-privacy");
    checkmarkSwap.classList.add("hidden");
    checkmarkSwap = privacy.querySelector(".hidden");
    checkmarkSwap.classList.remove("hidden");
    checkmarkSwap.classList.add("shown-privacy");

    const getDestination = privacy.querySelector(".sidebar-name").innerHTML;
    const placeDestination = document.querySelector(".privacy");
    if(getDestination == "Reservadamente")
        placeDestination.innerHTML = `(${getDestination})`;
    else
        placeDestination.innerHTML = '';
}

function sendMessage()
{
    let getMessage = document.querySelector(".input");
    const sendTo = document.querySelector(".to").innerHTML;
    let privacySetting = document.querySelector(".privacy").innerHTML;
    if(privacySetting == '')
        privacySetting = "message";
    if(privacySetting == "(Reservadamente)")
        privacySetting = "private_message";
    console.log(privacySetting);
    const composeMessage =
    {
        from: userName,
        to: sendTo,
        text: getMessage.value,
        type: privacySetting
    }
    const postMessage = axios.post("https://mock-api.driven.com.br/api/v4/uol/messages", composeMessage);
    getMessage.value = '';
    postMessage.then(reloadMessages, sendMessageError);
}
function sendMessageError(error)
{
    console.log(error);
}
function sendWithEnter(keyboard)
{
    if(keyboard.key == "Enter")
    {
        sendMessage();
    }
}

function reloadParticipants()
{
    const participantsPromise = axios.get("https://mock-api.driven.com.br/api/v4/uol/participants");
    participantsPromise.then(loadSidebar, participantsError);
}
function participantsError(error)
{
    console.log(error);
}

function loadSidebar(whosOnline)
{
    if(document.querySelector(".sidebar") != null)
    {
        if(firstTimeLoadingSidebar)
        {
            let sidebarElement = document.querySelector(".sidebar");
            sidebarElement.innerHTML =
            `
                <div class="sidebar-titles flex centralize">
                    <span class="font-size-16 weight-700">Escolha um contato<br>para enviar mensagem:</span>
                </div>
                <div class="sidebar-items flex">
                </div>
                <div class="sidebar-titles">
                    <span class="font-size-16 weight-700 flex centralize">Escolha a visibilidade:</span>
                </div>
                <div class="sidebar-items flex margem-gambiarra">
                    <div class="sidebar-item flex" onclick="selectPrivacy(this)">
                        <img class="sidebar-icon" src="/assets/lock-open.png" alt="enviar publicamente">
                        <div class="sidebar-name-and-check flex">
                            <span class="sidebar-name weight-400 font-size-16">Público</span>
                            <img class="checkmark shown-privacy" src="/assets/Vector.png" alt="check verde">
                        </div>
                    </div>
                    <div class="sidebar-item flex" onclick="selectPrivacy(this)">
                        <img class="sidebar-icon" src="/assets/lock-closed.png" alt="enviar reservadamente">
                        <div class="sidebar-name-and-check flex">
                            <span class="sidebar-name weight-400 font-size-16">Reservadamente</span>
                            <img class="checkmark hidden" src="/assets/Vector.png" alt="check verde">
                        </div>
                    </div>
                </div>
            `
        }
        let peopleLoader = document.querySelector(".sidebar-items");
        peopleLoader.innerHTML =
        `
        <div class="sidebar-item flex" onclick="selectTo(this)">
            <img class="sidebar-icon" src="/assets/people.png" alt="enviar para todos">
            <div class="sidebar-name-and-check flex">
                <span class="sidebar-name weight-400 font-size-16">Todos</span>
                <img class="checkmark shown-to" src="/assets/Vector.png" alt="check verde">
            </div>
        </div>
        `
        for(let i = 0; i < whosOnline.data.length; i++)
        {
            peopleLoader.innerHTML +=
            `
            <div class="sidebar-item flex" onclick="selectTo(this)">
                    <img class="sidebar-icon" src="/assets/person-circle.png" alt="icone de usuário">
                    <div class="sidebar-name-and-check flex">
                        <div class="sidebar-name-container overflow-container">
                            <span class="sidebar-name weight-400 font-size-16">${whosOnline.data[i].name}</span>
                        </div>
                        <img class="checkmark hidden" src="/assets/Vector.png" alt="check verde">
                    </div>
            </div>
            `
        }
        if(firstTimeLoadingSidebar)
        {
            firstTimeLoadingSidebar = 0;
            const reloadingParticipants = setInterval(reloadParticipants, 10000);
        }
    }
    else
    {
        const participantsPromise = axios.get("https://mock-api.driven.com.br/api/v4/uol/participants");
        participantsPromise.then(loadSidebar, messagesError);
    }

}

function showSidebar()
{
    const slideSidebar = document.querySelector(".sidebar");
    const chatLightSwitch = document.querySelector(".black-ground");
    slideSidebar.classList.add("on-screen");
    slideSidebar.classList.remove("off-screen");
    chatLightSwitch.classList.remove("hidden");
}

function hideSidebar()
{
    const slideSidebar = document.querySelector(".sidebar");
    const chatLightSwitch = document.querySelector(".black-ground");
    slideSidebar.classList.add("off-screen");
    slideSidebar.classList.remove("on-screen");
    chatLightSwitch.classList.add("hidden");
}