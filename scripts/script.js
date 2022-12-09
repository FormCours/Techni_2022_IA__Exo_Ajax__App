const loginForm_html = document.getElementById('connect-form');
const loginDiv_html = document.getElementById('login');
const chan_html = document.getElementById('chan');
const chat_html = document.getElementById('chat');
const logoutDiv_html = document.getElementById('logout');
const userLogout_html = document.getElementById('userName');
const chanList_html = document.getElementById('chan-list');
const chatList_html = document.getElementById('chat-list');
const chatTitle_html = document.getElementById('chat-title');
const disconnect_html = document.getElementById('disconnect');
const retour_html = document.getElementById('back');
const sendForm_html = document.getElementById('send-message');
let currentChannel;
let userName;
const url = 'http://localhost:3000/';

loginForm_html.addEventListener('submit', (e) => {
    e.preventDefault();
    userName = loginForm_html['userName-form'].value;
    loginDiv_html.classList.toggle('cache');
    chan_html.classList.toggle('cache');
    displayChannel(url);
    logoutDiv_html.classList.toggle('cache');
    userLogout_html.innerText = userName;
});

const displayChannel = (url) => {
    fetch(url + 'channel/', { method: 'GET' })
        .then((response) => {
            const rep = response.json();
            return rep;
        })
        .then((rep) => {
            generateChannelList(rep);
        });

};
const generateChannelList = (rep) => {
    for (let i = 0; i < rep.length; i++) {
        const div_html = document.createElement('div');
        const h4_html = document.createElement('h4');
        const p_html = document.createElement('p');
        h4_html.innerText = rep[i].name;
        p_html.innerText = rep[i].desc === null ? 'Pas de desc' : rep[i].desc;
        chanList_html.appendChild(div_html);
        div_html.append(h4_html, p_html);
        div_html.addEventListener('click', () => {
            currentChannel = rep[i].id;
            accessChat(rep[i].id);
            chat_html.classList.toggle('cache');
            chatTitle_html.innerText = rep[i].name;
        });
    }
};
const accessChat = (id) => {
    chan_html.classList.toggle('cache');
    fetch(url + 'channel/' + id + '/message')
        .then((rep1) => {
            const rep2 = rep1.json();
            return rep2;
        })
        .then((rep2) => {
            generateMessage(rep2);
        });
};
const generateMessage = (data) => {
    chatList_html.innerHTML = '';
    for (let i = 0; i < data.length; i++) {
        insertMessage(data[i])
    }
};
const insertMessage = (element) =>{
    console.log(element)
    const dateMessage = new Date(element.createdAt);
    const div_html = document.createElement('div');
    const p1_html = document.createElement('p');
    const p2_html = document.createElement('p');
    const p3_html = document.createElement('p');
    p1_html.innerText = element.content;
    p2_html.innerText = element.author;
    // p3_html.innerText = dateMessage.getDay() + '/' + dateMessage.getMonth() + ' ' + dateMessage.getHours() + ':' + dateMessage.getMinutes()
    p3_html.innerText = dateMessage.toLocaleString(undefined, {day : '2-digit', month : '2-digit', hour : '2-digit', minute : '2-digit'})
    chatList_html.appendChild(div_html);
    div_html.append(p1_html, p2_html, p3_html);
}
retour_html.addEventListener('click', () => {
    chat_html.classList.toggle('cache');
    chan_html.classList.toggle('cache');

});

disconnect_html.addEventListener('click', () => {
    loginDiv_html.classList.toggle('cache');
    chat_html.className = 'cache';
    chan_html.className = 'cache';
    loginForm_html['userName-form'].value = '';
    chan_html.innerHTML = '';
    logoutDiv_html.classList.toggle('cache');
});

const newMessage = (idChannel) => {
    
    fetch(url + 'message', {
        method: 'POST',
        body: JSON.stringify({ 
            channelId: idChannel,
            content: sendForm_html['get-message'].value,
            author: userName,
            createdAt: new Date().getTime()
        }),
        headers: {
            'Content-Type': 'application/json'
        }        
    })
    .then((rep1) => {
        const rep2 = rep1.json()
        return rep2
    })
    .then((rep2) => {
        insertMessage(rep2)
    })
};

sendForm_html.addEventListener('submit', (e) =>{
    e.preventDefault()
    newMessage(currentChannel)
})

const accessNewMessage = (id) => {
    fetch(url + 'channel/' + id + '/message')
        .then((rep1) => {
            const rep2 = rep1.json();
            return rep2;
        })
        .then((rep2) => {
            generateMessage(rep2);
        });
};
