# deque

Double-ended queue implementation for Deno, based on [Denque](https://github.com/invertase/denque).

```ts
import Deque from "https://deno.land/x/deque/mod.ts"; 

const deque = new Deque([1, 2, 3, 4]);
denque.shift(); // 1
denque.pop(); // 4
```