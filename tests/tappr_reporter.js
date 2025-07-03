#!/usr/bin/env node

import { Transform } from 'stream';
import { Parser } from 'tap-parser';
import chalk from 'chalk';

class SimpleTapReporter extends Transform {
  constructor() {
    super({ objectMode: true });
    this.parser = new Parser();
    this.startTime = Date.now();
    this.counts = { total: 0, pass: 0, fail: 0, skip: 0, todo: 0 };
    this.testStack = [];
    this.lastComment = '';

    // List of generic assertion names to omit
    this.genericNames = [
      'should be truthy',
      'should be deeply equivalent',
      'should be strictly equal',
      'should be falsy',
      'should be ok',
      // add more generic assertion names here if needed
    ];

    this.parser.on('comment', (comment) => {
      if (comment.trim()) {
        this.lastComment = comment.trim().replace(/^#\s*/, '');
      }
    });

    this.parser.on('test', (test) => {
      this.testStack.push(test.name || '');
    });

    this.parser.on('test end', () => {
      this.testStack.pop();
    });

    this.parser.on('assert', (assert) => {
      this.counts.total++;

      const testPath = this.testStack.filter(Boolean).join(' › ');
      let name;

      const isGeneric = this.genericNames.includes(assert.name);

      if (testPath) {
        name = (assert.name && !isGeneric) ? `${testPath} › ${assert.name}` : testPath;
      } else if (this.lastComment) {
        name = (assert.name && !isGeneric) ? `${this.lastComment} › ${assert.name}` : this.lastComment;
      } else {
        name = assert.name || '<unnamed test>';
      }

      if (assert.ok) {
        if (assert.skip) {
          this.counts.skip++;
          console.log(`${chalk.yellow('-')} ${chalk.yellow(name)}`);
        } else if (assert.todo) {
          this.counts.todo++;
          console.log(`${chalk.cyan('-')} ${chalk.cyan(name)}`);
        } else {
          this.counts.pass++;
          console.log(`${chalk.green('✓')} ${chalk.green(name)}`);
        }
      } else {
        this.counts.fail++;
        console.log(`${chalk.red('✗')} ${chalk.red(name)}`);

        if (assert.diag) {
          this.printFailureDetails(name, assert.diag);
        }
      }
    });

    this.parser.on('complete', () => {
      this.printSummary();
    });

    this.parser.on('bailout', (reason) => {
      console.log(chalk.red.bold('\nBAILOUT: ') + reason);
    });
  }

  printFailureDetails(testName, diag) {
    console.log(chalk.red(`    Test: ${testName}`));

    if (diag.stack) {
      console.log(chalk.red('    Stack:'));
      console.log(chalk.gray(diag.stack.split('\n').map(line => `      ${line}`).join('\n')));
    }

    if (diag.operator) {
      console.log(chalk.red('    Operator:'), diag.operator);
    }

    if (diag.expected !== undefined) {
      console.log(chalk.red('    Expected:'), diag.expected);
    }

    if (diag.actual !== undefined) {
      console.log(chalk.red('    Actual:'), diag.actual);
    }

    if (diag.diff) {
      console.log(chalk.red('    Diff:'));
      console.log(chalk.gray(diag.diff.split('\n').map(line => `      ${line}`).join('\n')));
    }

    console.log();
  }

  printSummary() {
    const runtime = ((Date.now() - this.startTime) / 1000).toFixed(2);
    const { total, pass, fail, skip, todo } = this.counts;

    console.log(chalk.gray('─'.repeat(60)));

    const stats = [
      `${pass} passed`,
      fail > 0 ? `${fail} failed` : null,
      skip > 0 ? `${skip} skipped` : null,
      todo > 0 ? `${todo} todo` : null
    ].filter(Boolean).join(', ');

    console.log(`${stats} out of ${total} tests`);
    console.log(`Runtime: ${runtime}s`);
    console.log(chalk.gray('─'.repeat(60)));

    process.exit(fail > 0 ? 1 : 0);
  }

  _transform(chunk, encoding, callback) {
    this.parser.write(chunk);
    callback();
  }

  _flush(callback) {
    this.parser.end();
    callback();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const reporter = new SimpleTapReporter();
  process.stdin.pipe(reporter);
}

export default SimpleTapReporter;
