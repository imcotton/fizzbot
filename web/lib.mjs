// @ts-check

export function solve (rules = [], numbers = []) {

    const calc = ruleList => num => {

        return ruleList
            .map(({ number, response }) => num % number === 0 ? response : '')
            .join('') || num
        ;

    };

    return numbers.map(calc(rules)).join(' ');

}



export const process = processWrap(fetchWrap(globalThis.fetch));



export function processWrap (loadWrap) {

    return async function* (base = '', next = '') {

        const load = loadWrap(base);

        const start = await load(next);
        yield start;
        next = start.nextQuestion;

        while (Boolean(next)) {

            const question = await load(next);
            yield question;

            const { rules, numbers, exampleResponse: example = {} } = question;

            let { answer } = example;

            if (rules != null && numbers != null) {
                answer = solve(rules, numbers);
            }

            const res = await load(next, { answer });
            yield { ...res, answer };

            const { message, nextQuestion, result = 'incorrect' } = res;

            if (result === 'incorrect') {
                throw new Error(message);
            }

            if (result === 'interview complete') {
                next = '';
            }

            if (result === 'correct') {
                next = nextQuestion;
            }

        }

    };

}



export function fetchWrap (fetch) {

    return function (base = '') {

        return async function load (url = '', data) {

            const hasData = data != null;

            const res = await fetch(base.concat(url), {

                method: hasData ? 'POST' : 'GET',

                ...( hasData && { body: JSON.stringify(data) } ),

                ...( hasData && { headers: { 'content-type': 'application/json' } } ),

            });

            return await res.json();

        }

    }
}



export function outputTo (selector = 'body') {

    const sheet = document.querySelector(selector);

    let last;
    let target = sheet;

    return Object.freeze({

        update ({ message = '', answer = undefined } = {}) {

            if (answer == null) {

                target = sheet;

                last = document.createElement('li');
                last.className = 'list-group-item text-info bg-light pump-in';
                last.appendChild(document.createTextNode(message));

                target.prepend(last);

            } else {

                target = last;

                last = document.createElement('blockquote');
                last.className = 'text-right blockquote-footer mt-2';
                last.appendChild(document.createTextNode(message));

                const pre = document.createElement('pre');
                pre.className = 'text-light bg-secondary py-1 px-2 mt-1 ml-auto rounded-pill text-wrap shrink';
                pre.appendChild(document.createTextNode(answer));

                last.appendChild(pre);

                target.appendChild(last);
            }

        },

        score ({ elapsedSeconds = 0, grade = '' } = {}) {

            target = sheet;

            last = document.createElement('li');
            last.className = 'list-group-item list-group-item-success d-flex justify-content-between align-items-center font-weight-bold';
            last.appendChild(document.createTextNode(`Completed in: ${ elapsedSeconds }s`));

            const badge = document.createElement('span');
            badge.className = 'badge badge-success badge-pill';
            badge.appendChild(document.createTextNode(grade));

            last.appendChild(badge);

            target.prepend(last);

        },

        fail ({ message = '' } = {}) {

            target = sheet;

            last = document.createElement('li');
            last.className = 'list-group-item list-group-item-danger font-weight-bold';
            last.appendChild(document.createTextNode(message));

            target.prepend(last);

        },

    });

}

