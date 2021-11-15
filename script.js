let firstTimeLoadingChat = 1;
let firstTimeLoadingSidebar = 1;

let pageBody = document.querySelector(".body");
pageBody.innerHTML = '';
pageBody.innerHTML =
`
<div class="login-screen flex centralize">
    <img class="login-logo" src="/assets/logouologin.png" alt="logo uol">
    <input class="login-input font-size-18 font-weight-400" type="text" placeholder="Digite seu lindo nome">
    <div class="error-align flex centralize">
        <span class="login-name-error font-size-18 font-weight-400"></span>
    </div>
    <button class="login-button"><span class="login-bt-text weight-400 font-size-18" onclick="loginAttempt()">Entrar</span></button>
</div>
<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
<script src="script.js"></script>
`

function loginAttempt()
{
    let loginName = document.querySelector(".login-input").value;
    console.log(loginName);
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
    usernamePromise.then(connectionMaintenance, loginError);
}

function connectionMaintenance()
{
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
            <div class="logo-and-people flex bar-spacing">
                <img class="logo" src="/assets/logouol.png" alt="logo uol">
                <img class="people-header" src="/assets/people.png" onclick="showSidebar()" alt="botao de pessoas no chat">
            </div>
        </header>
        <main class="chat">
        </main>
        <footer class="write-and-send flex centralize bar-sizing white-background full-width">
            <div class="input-and-send flex bar-spacing">
                <input class="input weight-400" type="text" placeholder="Escreva aqui...">
                <img class="paper-plane-sender" src="assets/paper-plane.png" alt="botao de enviar mensagem">
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

function messagesError(error)
{
    console.log(error);
}

function reloadMessages()
{
    const messagesPromise = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
    messagesPromise.then(displayMessages, messagesError);
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
                    <div class="sidebar-item flex">
                        <img class="sidebar-icon" src="/assets/lock-open.png" alt="enviar publicamente">
                        <div class="sidebar-name-and-check flex">
                            <span class="sidebar-name weight-400 font-size-16">Público</span>
                            <img class="checkmark" src="/assets/Vector.png" alt="check verde">
                        </div>
                    </div>
                    <div class="sidebar-item flex">
                        <img class="sidebar-icon" src="/assets/lock-closed.png" alt="enviar reservadamente">
                        <div class="sidebar-name-and-check flex">
                            <span class="sidebar-name weight-400 font-size-16">Reservadamente</span>
                            <img class="checkmark" src="/assets/Vector.png" alt="check verde">
                        </div>
                    </div>
                </div>
            `
        }
        let peopleLoader = document.querySelector(".sidebar-items");
        peopleLoader.innerHTML =
        `
        <div class="sidebar-item flex">
            <img class="sidebar-icon" src="/assets/people.png" alt="enviar para todos">
            <div class="sidebar-name-and-check flex">
                <span class="sidebar-name weight-400 font-size-16">Todos</span>
                <img class="checkmark" src="/assets/Vector.png" alt="check verde">
            </div>
        </div>
        `
        for(let i = 0; i < whosOnline.data.length; i++)
        {
            peopleLoader.innerHTML +=
            `
            <div class="sidebar-item flex">
                    <img class="sidebar-icon" src="/assets/person-circle.png" alt="">
                    <div class="sidebar-name-and-check flex">
                        <div class="sidebar-name-container overflow-container">
                            <span class="sidebar-name weight-400 font-size-16">${whosOnline.data[i].name}</span>
                        </div>
                        <img class="checkmark" src="/assets/Vector.png" alt="check verde">
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

function reloadParticipants()
{
    const participantsPromise = axios.get("https://mock-api.driven.com.br/api/v4/uol/participants");
    participantsPromise.then(loadSidebar, messagesError);
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