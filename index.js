const util = require('util');

class ZenLog {
    constructor (text, opts) {
        this.opts = Object.assign({
            silent          : false,
            partial         : false,
            format          : '[zenlog][%s][%sms]',
            start_format    : '[zenlog][%s]',
            end_format      : '[zenlog][%s][%sms]',
            tick_format     : '  [tick][%s][%sms]',
            pad_length      : 23,
            pad_symbol      : ' ',
            unnamed_text    : 'unnamed',
            log_function    : console.log,
            wrap_after      : (s) => s,
            hash            : (+[
                                (Math.floor(Math.random() * (90 - 10 + 1)) + 10),
                                (new Date().getTime() % 100)
                            ].join('1')).toString(36)
        }, opts);

        this.text = text || this.opts.unnamed_text;
        this.start = new Date().getTime();
        if(this.opts.partial) {
            this.opts.log_function(
                this.opts.wrap_after(
                    util.format(this.opts.start_format, this.opts.hash)
                        .padEnd(this.opts.pad_length, this.opts.pad_symbol)
                ),
                text
            );
        }
        this.ticks = [];
    }
    tick (text) {
        this.ticks.push({
            text : (text || this.opts.unnamed_text),
            start : new Date().getTime()
        });
        let self = this;
        let index = this.ticks.length - 1;
        return function(text) {
            self.ticks[index].text = text || self.ticks[index].text;
            self.ticks[index].end = new Date().getTime();
            const ms = self.ticks[index].end - self.ticks[index].start;
            if(self.opts.partial) {
                self.opts.log_function(
                    self.opts.wrap_after(
                        util.format(self.opts.tick_format, self.opts.hash, ms)
                        .padEnd(self.opts.pad_length, self.opts.pad_symbol)
                    ),
                    self.ticks[index].text
                );
            }
            return ms;
        };
    }
    ms () {
        return new Date().getTime() - this.start;
    }
    sec () {
        return parseInt((new Date().getTime() - this.start) / 1000);
    }
    end (text) {
        let end = new Date().getTime();
        if(this.opts.partial) {
            this.opts.log_function(
                this.opts.wrap_after(
                    util.format(this.opts.end_format, this.opts.hash, end - this.start)
                        .padEnd(this.opts.pad_length, this.opts.pad_symbol)
                ),
                (text || this.text)
            );
            return end - this.start;
        }
        if(!this.ticks.length) {
            this.opts.log_function(
                this.opts.wrap_after(
                    util.format(this.opts.format, this.opts.hash, end - this.start)
                        .padEnd(this.opts.pad_length, this.opts.pad_symbol)
                ),
                (text || this.text)
            );
        }
        else if(this.ticks.length) {
            this.opts.log_function(
                this.opts.wrap_after(
                    util.format(this.opts.start_format, this.opts.hash)
                        .padEnd(this.opts.pad_length, this.opts.pad_symbol)
                ),
                (text || this.text)
            );
            for(let t = 0; t < this.ticks.length; t++) {
                this.opts.log_function(
                    this.opts.wrap_after(
                        util.format(
                                this.opts.tick_format,
                                this.opts.hash,
                                (this.ticks[t].end || end) - this.ticks[t].start
                            ).padEnd(this.opts.pad_length, this.opts.pad_symbol)
                    ),
                    this.ticks[t].text
                );
            }
            this.opts.log_function(
                this.opts.wrap_after(
                    util.format(this.opts.end_format, this.opts.hash, end - this.start)
                        .padEnd(this.opts.pad_length, this.opts.pad_symbol)
                ),
                (text || this.text)
            );
        }
        return end - this.start;
    }
}

module.exports = ZenLog;
