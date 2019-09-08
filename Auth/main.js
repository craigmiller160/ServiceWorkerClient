
const loginPage = document.querySelector('#login');
const contentPage = document.querySelector('#content');
const wrapper = document.querySelector('#wrapper');

const LOGIN_PAGE = 'login';
const CONTENT_PAGE = 'content';

const instance = axios.create({
    baseURL: 'http://localhost:3000/api',
    withCredentials: true
});

const configureContentPage = () => {
    const loadTxtBtn = document.querySelector('#load-text-btn');
    const serverTxt = document.querySelector('#server-text');
    loadTxtBtn.onclick = async () => {
        const res = await instance.get('/hello');
        serverTxt.textContent = res.data;
    };
};

const configureLoginPage = () => {
    const usernameInput = document.querySelector('#username');
    const passwordInput = document.querySelector('#password');
    const loginBtn = document.querySelector('#login-btn');

    loginBtn.onclick = async () => {
        const username = usernameInput.value;
        const password = passwordInput.value;
        const res = await instance.post('/login', {
            username,
            password
        });
        console.log(res.data); // TODO delete this
    };
};

const showPage = (pageName) => {
    let firstChild = wrapper.firstChild;
    while (firstChild) {
        wrapper.removeChild(firstChild);
        firstChild = wrapper.firstChild;
    }

    if (LOGIN_PAGE === pageName) {
        wrapper.append(loginPage.content.cloneNode(true));
        configureLoginPage();
    }
    else {
        wrapper.append(contentPage.content.cloneNode(true));
        configureContentPage();
    }
};

showPage(LOGIN_PAGE);
