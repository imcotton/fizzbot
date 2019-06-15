import { process } from './lib.mjs';





(async function main () {

    try {

        let res;

        for await (res of process('https://api.noopschallenge.com', '/fizzbot')) {

            const { message, answer } = res;

            if (answer == null) {
                console.log(`\n${ '='.repeat(42) }\n`);
            } else {
                console.log('\n > '.concat(answer).concat('\n'));
            }

            console.log(' - '.concat(message));

        }

        const { grade, elapsedSeconds } = res;

        console.log(`\n${ '='.repeat(42) }\n`);
        console.log({ grade, elapsedSeconds });

    } catch (err) {

        console.log(`\n${ '='.repeat(42) }\n`);
        console.error(err.message);

    }

}())

