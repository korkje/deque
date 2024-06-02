# deque [![JSR](https://jsr.io/badges/@korkje/deque)](https://jsr.io/@korkje/deque)

Double-ended queue implementation, based on [Denque](https://github.com/invertase/denque).

```ts
import Deque from "jsr:@korkje/deque"; 

const deque = new Deque([1, 2, 3, 4]);
deque.shift(); // 1
deque.pop(); // 4
```