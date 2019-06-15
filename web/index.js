import { process, outputTo } from './lib.mjs';





document
    .querySelector('#run-btn')
    .addEventListener('click', main, { once: true })
;



async function main () {

    const log = outputTo('#sheet');

    const spinner = document.querySelector('header .spinner');
    spinner.hidden = false;

    document.querySelector('#run-btn').remove();

    try {

        let res;

        for await (res of process('https://api.noopschallenge.com', '/fizzbot')) {
            log.update(res);
        }

        log.score(res);

    } catch (err) {

        log.fail(err);

    } finally {

        spinner.hidden = true;

    }

}

