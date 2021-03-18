# zenlog
Useful NodeJS logger for time tracking.

## Install
`npm i --save zenlog`

## Usage
```javascript
const ZenLog = require('zenlog');

const zen = new ZenLog('example', {partial: true});

let end1 = zen.tick();
setTimeout(() => {
    end1('after 1 sec');
    
    let end2 = zen.tick();
    setTimeout(() => {
        end2('this after 2 sec');
        
        let end3 = zen.tick('and this after 3 sec');
        setTimeout(() => {
            end3();
            
            zen.end('end of example');
        }, 3000);
    }, 2000);
}, 1000);

let end777 = zen.tick();
setTimeout(() => {
    end777('after 777 ms')
}, 777);

```

`$ > node example.js`

```
[zenlog][h3r]           example
  [tick][h3r][777ms]    after 777 ms
  [tick][h3r][1000ms]   after 1 sec
  [tick][h3r][2000ms]   this after 2 sec
  [tick][h3r][3000ms]   and this after 3 sec
[zenlog][h3r][6000ms]   end of example
```

