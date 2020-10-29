const sock = io.connect(window.location.origin);

getI().then(I => {
    if (!I) return window.location.href = '/';
    sock.emit('I', { I: I, n: window.location.pathname.split('/')[2] }, outp => {
        if (!outp || outp.userIP && outp.userIP !== I) return window.location.href = '/forbidden/2';
        document.body.style.display = 'revert';
    });
});

var closeBtn = (el) => {
    try { el.animate({ bottom: '-50px', opacity: '0' }, { duration: 500, easing: 'cubic-bezier(.68, -0.55, .27, 1.55)' }).onfinish = () => el.remove(); }
    catch { };
}, notify = (text, type, ms) => {
    text = text || "Hello world", type = type || 1, ms = ms || 5000;
    let notif = document.querySelector(".notification"), normal = notif.querySelectorAll(".normal"), success = notif.querySelectorAll(".success"), content = notif.querySelectorAll(".content"), marginTop = 0;
    let whatToDo = (what, class_) => {
        if (content) content.forEach(el => { marginTop += 40; el.style.marginTop = `${marginTop}px`; });
        notif.innerHTML += `<div class="${class_.slice(1)} content"><img src="${what === success ? '/assets/imgs/mark.svg' : '/assets/imgs/iBubble.svg'}" width="20px" height="20px" alt=""><p>${text}</p><div class="notifCloseBtn" onclick="closeBtn(this.parentElement)"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs" version="1.1" width="512" height="512" x="0" y="0" viewBox="0 0 426.66667 426.66667" style="enable-background:new 0 0 512 512" xml:space="preserve" class=""><g><path xmlns="http://www.w3.org/2000/svg" d="m405.332031 192h-170.664062v-170.667969c0-11.773437-9.558594-21.332031-21.335938-21.332031-11.773437 0-21.332031 9.558594-21.332031 21.332031v170.667969h-170.667969c-11.773437 0-21.332031 9.558594-21.332031 21.332031 0 11.777344 9.558594 21.335938 21.332031 21.335938h170.667969v170.664062c0 11.777344 9.558594 21.335938 21.332031 21.335938 11.777344 0 21.335938-9.558594 21.335938-21.335938v-170.664062h170.664062c11.777344 0 21.335938-9.558594 21.335938-21.335938 0-11.773437-9.558594-21.332031-21.335938-21.332031zm0 0" fill="#000000" data-original="#000000"></path></g></svg></div></div>`;
        if (what[0] || notif.querySelector(class_)) { document.querySelectorAll(class_).forEach((el) => { el.style.opacity = 1; }) };
        setTimeout(() => closeBtn(document.querySelectorAll(class_)[0]), ms);
    };
    if (type === 1) whatToDo(normal, '.normal');
    else if (type === 2) whatToDo(success, '.success');
};

window.onload = () => {
    document.querySelectorAll('.dt').forEach(el => el.innerText = new Date(el.innerText).toDateString());
    let menuBox = document.querySelector('.menuBox'),
        links = document.querySelector('.links'),
        closeMenuBox = () => {
            menuBox.animate([
                { top: '50px', opacity: '1', offset: .7 },
                { top: '20px', opacity: '0', offset: 1 }
            ], {
                duration: 900,
                easing: 'ease'
            })
                .onfinish = () => menuBox.classList.remove('active');
        }, load = (animate) => {
            loader.style.display = 'revert';
            if (animate) {
                loader.animate([
                    { transform: 'translate(-50%, -100px)', opacity: '0' },
                    { transform: 'translate(-50%, 20px)' }
                ], {
                    duration: 500,
                    easing: 'ease'
                })
                    .onfinish = () => loader.style.removeProperty('display');
            };
        }, loaded = (ms) => {
            loader.animate([
                { transform: 'translate(-50%, 50px)', opacity: '1', offset: .7 },
                { transform: 'translate(-50%, -100px)', opacity: '0', offset: 1 }
            ], {
                duration: ms || 700,
                easing: 'ease'
            })
                .onfinish = () => loader.style.removeProperty('display');

        };

    document.querySelector('.del').addEventListener('click', (el) => {
        getI().then(p => {
            if (!p) return notify("Couldn't get your IP address.");
            sock.emit('del', { i: p, n: window.location.pathname.split('/')[2] }, outp => {
                if (outp.code === 200) {
                    document.querySelector('main').classList.add('deleted');
                    document.querySelector('.topPart h2').innerText = 'File has been deleted';
                    el.target.classList.replace('del', 'home');
                } else notify(outp.msg);
            });
        });
    });

    document.querySelector('.home').addEventListener('click', () => window.location.href = '/');

    document.querySelectorAll('.menu ul li').forEach(el => {
        el.addEventListener('click', e => {
            let a = e.target.querySelector('a');
            if (a && a.getAttribute('href')) {
                if (a.getAttribute('target') && a.getAttribute('target') === '_blank') window.open(a.href);
                else window.location.href = a.href;
            };
        });
    });

    document.body.addEventListener('click', el => {
        if (el.target.classList.contains('lines')) {
            if (!menuBox.classList.contains('active')) return menuBox.classList.add('active');
            closeMenuBox();
        }
        else if (menuBox && menuBox.classList.contains('active') && el.target !== menuBox && !el.target.closest('.menuBox')) closeMenuBox();
    });

    sock.on('notify', outp => { notify(outp.msg, outp.type) });
};