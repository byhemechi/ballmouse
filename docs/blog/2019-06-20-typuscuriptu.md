subtitle: Using TypeScript to avoid the pains of JS

# Javascript → TypeScript
**Author: George Fischer**  
**Date: 20 06 2019**

## Why are we doing this?
### JavaScript's Failings
Javascript has a _few_ issues; the most important one of which (in my opinion) is that it's dynamically typed.
To show why this is an issue, here's a really simple calculator.

  ```javascript
/**
 * Really simple calculator
 * Seems pretty innocent, right?
 */

var ans = '0'
var lval = '0'
var op = ''

while (lval != '') {
  const input = prompt((op ? '' : '= ') + ans + op)
  if (!input.match(/[\/\*=\-+]/)) {
    op = ''
    switch (lval) {
      case '':
        break
      case '+':
        ans += input
        break
      case '-':
        ans -= input
        break
      case '/':
        ans /= input
        break
      case '*':
        ans *= input
        break
      default:
        op = ''
        ans = input
    }
  } else {
    switch (input) {
      case '+':
        op = ' +'
        break
      case '-':
        op = ' -'
        break
      case '/':
        op = ' ÷'
        break
      case '*':
        op = ''
        break
    }
  }
  lval = input
}
alert(ans)
```

Using this code, the multiplication & division work just fine, but trying addition or subtraction shows us thr problem:

```
2 + 2 = 22 // 🤔
```

You may have guessed the issue at this point: instead of adding the numbers, it's concatenating two strings of numbers,
so actually, what's actually happening is

```
"2" + "2" = "22"
```

!!! note
    This isn't that great an example, but a better one would be way too long to put here and I couldn't be bothered typing one out anyway.

### How TypeScript solves this problem

```typescript
const input: number = prompt((op ? '' : '= ') + ans + op) // Fixed!
```

What I can't really show here is that in this situation TypeScript throws an error, and JavaScript handles it just fine, adding the second string to the end of the first one. Why does this happen? prompt returns a `String`, and input has the `number` type, giving us a `TypeError` in TypeScript. JavaScript, however, has no such feature.

## The Process

### Classes

Most of our code stayed the same, TypeScript _is_ a superset of JavaScript, except for some minor changes. For example, al lot of out classes had to have some major changes to have them work

```javascript tab="Before (JavaScript)"
class example {
  constructor(options = {}) {
    this.demo = options.demo
  }
}
```

```typescript tab="After (TypeScript)"
interface ExampleOptions {
  demo: string
  demo2: number
}
class example {
  demo: string
  constructor(options: ExampleOptions = {}) {
    this.demo = options.demo
  }
}
```

This may look like just adding pointless code, but all of our classes are way longer than this, and it has a genuine effect on productivity.

### Docs

Prior to switching, we were using JSDoc alongside a hacky compiler written by yours truly to turn inline docs into something nicer to read. Due to it being replaced, I can't really show what the old source docs look like, but the new ones [I can](/source).

There's a slight change in doc format between TypeScript and JavaScript (JSDoc and TypeDoc[^1] respectively). Here's the difference

```javascript tab="Before (JSDoc)"
/**
 * A function to pass the FizzBuzz test.
 * @param n {number} The number to check
 * @param sub {Object} The output to replace values with in the format `{number: "value"}`
 */
function fizz(n, sub = { 3: 'Fizz', 5: 'Buzz' }) {
  /*...*/
}
```

```javascript tab="After (TypeDoc)"
interface FizzBuzzSub {
  [key: number]: string;
}
/**
 * A function to pass the FizzBuzz test.
 * @param n - The number to check
 * @param sub - The output to replace values with in the format `{number: "value"}`
 */
function fizz(n: number, sub: FizzBuzzSub = { 3: 'Fizz', 5: 'Buzz' }) {
  /*...*/
}
```

### Webpack

I'm not going to bother writing a description out for this one, it's just here 'cause it happened and I figured I might as well put it here

```javascript tab="Before (With Babel)"
module.exports = {
  module: {
    rules: [
      {
        test: /\.m?jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              /* ... */
            ],
          },
        },
      },
    ],
  },
}
```

```javascript tab="After (With ts-loader)"
module.exports = {
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'ts-loader',
        },
      },
    ],
  },
}
```

!!! note
    This is the only example i've given where the "after" is shorter than the original

[^1]: Technically, we're writing the docs with TSDoc, but TypeDoc is generating the output and has some _slight_ differences
