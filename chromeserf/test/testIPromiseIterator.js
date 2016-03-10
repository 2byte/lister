'use strict';

const assert = require('chai').assert;
const scheduler = require('../promiseIterator');

describe('Promise iterator', () => {

    const Scheduler = new scheduler();

    it ('Common test', () => {

        let values = [1, 2, 3, 4, 5];

        values[Symbol.iterator] = function () {

            this.current = 0;

            return {
                next: () => {
                    return {
                        done: true,
                        value: this.current
                    };
                }
            };

        };

        let valueIterator = values[Symbol.iterator]();

        console.log(valueIterator.next());

    });

    it ('Scheduler', () => {

        Scheduler.add(new Promise((resolve, reject) => {resolve();
            /*setTimeout(() => {
                console.log(1);
                resolve();
            }, 1000);*/
        })).add(new Promise((resolve, reject) => {console.log('res'); resolve();
            /*setTimeout(() => {
                console.log(2);
                resolve();
            }, 1000);*/
        })).add(new Promise((resolve, reject) => {console.log('res'); resolve();
            /*setTimeout(() => {
                console.log(3);
                resolve();
            }, 1000);*/
        }));

        Scheduler.run();
    });

});

// 63900260 9006793807