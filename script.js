let firstTimeLoading = 1;

let pageBody = document.querySelector(".body");
pageBody.innerHTML = '';
pageBody.innerHTML =
`
<div class="login-screen flex centralize">
    <img class="login-logo" src="/assets/logouologin.png" alt="logo uol">
    <input class="login-input font-size-18 font-weight-400" type="text" placeholder="Digite seu lindo nome">
    <div class="error-align flex centralize">
        <span class="login-name-error error-1 font-size-18 font-weight-400"></span>
        <span class="login-name-error error-2 font-size-18 font-weight-400"></span>
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
        let loginNameEmpty = document.querySelector(".error-1");
        loginNameEmpty.innerHTML = "Digite um nome de usuário!";
        loginNameEmpty = document.querySelector(".error-2");
        loginNameEmpty.innerHTML = '';
        return;
    }
    if(loginName.length > 255)
    {
       let loginNameEmpty = document.querySelector(".error-1");
       loginNameEmpty.innerHTML = "Seu nome deve ter";
       loginNameEmpty = document.querySelector(".error-2");
       loginNameEmpty.innerHTML = 'menos que 255 caracteres';
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
        <img class="loading-gif" src="/assets/logouologin.png" alt="animação carregando">
        <span>Entrando</span>
    </div>
    `
    const messagesPromise = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
    messagesPromise.then(displayMessages, messagesError);
}

function loginError(error)
{
    console.log(error);
    if (error == "Error: Request failed with status code 400")
    {
        console.log(error);
        const loginNameTaken1 = document.querySelector(".error-1");
        const loginNameTaken2 = document.querySelector(".error-2");
        loginNameTaken1.innerHTML = "Esse nome de usuário já está"
        loginNameTaken2.innerHTML = "logado, escolha outro!"
    }
    else {
        console.log(error);
        const loginNameTaken1 = document.querySelector(".error-1");
        const loginNameTaken2 = document.querySelector(".error-2");
        loginNameTaken1.innerHTML = "Houve uma falha no servidor"
        loginNameTaken2.innerHTML = "tente novamente mais tarde!"
    }

}

function displayMessages(response)
{
    if(firstTimeLoading)
    {
        pageBody.innerHTML = '';
        pageBody.innerHTML =
        `
        <header class="header flex centralize bar-sizing white-background full-width">
            <div class="logo-and-people flex bar-spacing">
                <img class="logo" src="/assets/logouol.png" alt="logo uol">
                <img class="people-header" src="/assets/people.png" alt="botao de pessoas no chat">
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
        if (response.data[i].type == "private_message")
        {
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
    displayLocation.removeChild(displayLocation.lastChild);
    const lastMessage = displayLocation.lastChild;
    lastMessage.scrollIntoView();
    if(firstTimeLoading)
    {
        firstTimeLoading = 0;
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