window.onload = () => {
    document.querySelector('.home').addEventListener('click', () => window.location.href = '/');

    let menuBox = document.querySelector('.menuBox'),
        closeMenuBox = () => {
            menuBox.animate([
                { top: '50px', opacity: '1', offset: .7 },
                { top: '20px', opacity: '0', offset: 1 }
            ], {
                duration: 900,
                easing: 'ease'
            })
                .onfinish = () => menuBox.classList.remove('active');
        };


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
};