const ZenLog = require('./');

const zen = new ZenLog('example', {partial: true});
let end1 = zen.tick();
setTimeout(() => {
    end1('after 1 sec')

    let end2 = zen.tick();
    setTimeout(() => {
        end2('after 2 sec')

        let end3 = zen.tick();
        setTimeout(() => {
            end3('after 3 sec')

            zen.end('example of 3 timeouts');
        }, 3000);
    }, 2000);
}, 1000);

let end777 = zen.tick();
setTimeout(() => {
    end777('after 777 ms')
}, 777);
