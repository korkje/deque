import { assert, assertEquals } from "@std/assert";
import Deque from "lib/deque.ts";

Deno.test("Deque.prototype.constructor", function () {
  Deno.test("should take no argument", function () {
    const a = new Deque();
    assert(a.length === 0);
  });

  Deno.test("should take array argument", function () {
    const a = new Deque([1, 2, 3, 4]);
    const b = new Deque([]);

    assert(a.length >= 4);
    assertEquals(a.toArray(), [1, 2, 3, 4]);
    assert(b.length === 0);
    assertEquals(b.toArray(), []);
  });

  Deno.test("should handle a high volume with no out of memory exception", function () {
    const deque = new Deque();
    let l = 250_000;

    while (--l) {
      deque.push(l);
      deque.unshift(l);
    }

    l = 125_000;
    while (--l) {
      const a = deque.shift();
      deque.pop();
      deque.shift();
      deque.push(a);
      deque.shift();
      deque.shift();
    }

    deque.clear();
    l = 100_000;

    while (--l) {
      deque.push(l);
    }

    l = 100_000;
    while (--l) {
      deque.shift();
      deque.shift();
      deque.shift();
      if (l === 25_000) deque.clear();
      deque.pop();
      deque.pop();
      deque.pop();
    }
  });
});

Deno.test("Deque.prototype.toArray", function () {
  Deno.test("should return an array", function () {
    const a = new Deque([1, 2, 3, 4]);
    assertEquals(a.toArray(), [1, 2, 3, 4]);
  });
});

Deno.test("Deque.prototype.push", function () {
  Deno.test("Should accept undefined values", function () {
    const a = new Deque();
    a.push(undefined);
    assert(a.length === 1);
  });

  Deno.test("Should add falsey elements (except undefined)", function () {
    const a = new Deque();
    let ret = a.push(0);
    assertEquals(ret, 1);
    assertEquals(a.length, 1);
    assertEquals(a.peek(0), 0);
    ret = a.push("");
    assertEquals(ret, 2);
    assertEquals(a.length, 2);
    assertEquals(a.peek(1), "");
    ret = a.push(null);
    assertEquals(ret, 3);
    assertEquals(a.length, 3);
    assertEquals(a.peek(2), null);
  });

  Deno.test("Should add single argument - plenty of capacity", function () {
    const a = new Deque([1, 2, 3, 4, 5]);
    const before = a.length;
    const ret = a.push(1);
    assert(ret === before + 1);
    assert(a.length === ret);
    assert(ret === 6);
    assertEquals(a.toArray(), [1, 2, 3, 4, 5, 1]);
  });

  Deno.test("Should add single argument - exact capacity", function () {
    const a = new Deque([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
    const before = a.length;
    const ret = a.push(1);
    assert(ret === before + 1);
    assert(a.length === ret);
    assert(ret === 16);
    assertEquals(a.toArray(), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 1]);
  });

  Deno.test("Should add single argument - over capacity", function () {
    const a = new Deque([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
    const before = a.length;
    const ret = a.push(1);
    assert(ret === before + 1);
    assert(a.length === ret);
    assert(ret === 17);
    assertEquals(a.toArray(), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 1]);
  });

  Deno.test("should respect capacity", function () {
    const a = new Deque([1, 2, 3], 3);
    a.push(4);

    assertEquals(a.length, 3);
    assertEquals(a.peek(0), 2);
    assertEquals(a.peek(1), 3);
    assertEquals(a.peek(2), 4);
  });
});

Deno.test("Deque.prototype.unshift", function () {
  Deno.test("Should accept undefined values", function () {
    const a = new Deque();
    a.unshift(undefined);
    assert(a.length === 1);
  });

  Deno.test("Should unshift falsey elements (except undefined)", function () {
    const a = new Deque();
    // var before = a.length;
    let ret = a.unshift(0);
    assertEquals(ret, 1);
    assertEquals(a.length, 1);
    assertEquals(a.peek(0), 0);
    ret = a.unshift("");
    assertEquals(ret, 2);
    assertEquals(a.length, 2);
    assertEquals(a.peek(0), "");
    ret = a.unshift(null);
    assertEquals(ret, 3);
    assertEquals(a.length, 3);
    assertEquals(a.peek(0), null);
  });

  Deno.test("Should add single argument - plenty of capacity", function () {
    const a = new Deque([1, 2, 3, 4, 5]);
    const before = a.length;
    const ret = a.unshift(1);
    assert(ret === before + 1);
    assert(a.length === ret);
    assert(ret === 6);
    assertEquals(a.toArray(), [1, 1, 2, 3, 4, 5]);
  });

  Deno.test("Should add single argument - exact capacity", function () {
    const a = new Deque([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
    const before = a.length;
    const ret = a.unshift(1);
    assert(ret === before + 1);
    assert(a.length === ret);
    assert(ret === 16);
    assertEquals(a.toArray(), [1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
  });

  Deno.test("Should add single argument - over capacity", function () {
    const a = new Deque([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
    const before = a.length;
    const ret = a.unshift(1);
    assert(ret === before + 1);
    assert(a.length === ret);
    assert(ret === 17);
    assertEquals(a.toArray(), [1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
  });

  Deno.test("should respect capacity", function () {
    const a = new Deque([1, 2, 3], 3);
    a.unshift(0);

    assertEquals(a.length, 3);
    assertEquals(a.peek(0), 0);
    assertEquals(a.peek(1), 1);
    assertEquals(a.peek(2), 2);
  });
});

Deno.test("Deque.prototype.pop", function () {
  Deno.test("Should return undefined when empty deque", function () {
    const a = new Deque();
    assert(a.length === 0);
    assert(a.pop() === undefined);
    assert(a.pop() === undefined);
    assert(a.length === 0);
  });

  Deno.test("Should return the item at the back of the deque", function () {
    const a = new Deque([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const b = [];

    b.push(1, 2, 3, 4, 5, 6, 7, 8, 9);

    assert(a.pop() === 9);
    assert(a.pop() === 8);
    b.pop();
    b.pop();
    assertEquals(a.toArray(), b);
    a.unshift(5);
    a.unshift(4);
    a.unshift(3);
    a.unshift(2);
    a.unshift(1);
    a.push(1);
    a.push(2);
    a.push(3);
    a.push(4);
    a.push(5);
    a.unshift(3);
    a.unshift(2);
    a.unshift(1);
    a.pop();
    b.unshift(1, 2, 3, 4, 5);
    b.push(1, 2, 3, 4, 5);
    b.unshift(1, 2, 3);
    b.pop();
    assertEquals(a.toArray(), b);
    assert(a.pop() === b.pop());
    assertEquals(a.toArray(), b);
  });
});

Deno.test("Deque.prototype.shift", function () {
  Deno.test("Should return undefined when empty deque", function () {
    const a = new Deque();
    assert(a.length === 0);
    assert(a.shift() === undefined);
    assert(a.shift() === undefined);
    assert(a.length === 0);
  });

  Deno.test("Should return the item at the front of the deque", function () {
    const a = new Deque([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const b = [];

    b.push(1, 2, 3, 4, 5, 6, 7, 8, 9);

    assert(a.shift() === 1);
    assert(a.shift() === 2);
    b.shift();
    b.shift();
    assertEquals(a.toArray(), b);
    a.unshift(5);
    a.unshift(4);
    a.unshift(3);
    a.unshift(2);
    a.unshift(1);
    a.push(1);
    a.push(2);
    a.push(3);
    a.push(4);
    a.push(5);
    a.unshift(3);
    a.unshift(2);
    a.unshift(1);
    a.shift();
    b.unshift(1, 2, 3, 4, 5);
    b.push(1, 2, 3, 4, 5);
    b.unshift(1, 2, 3);
    b.shift();
    assertEquals(a.toArray(), b);
    assert(a.shift() === b.shift());
    assertEquals(a.toArray(), b);
  });
});

Deno.test("Deque.prototype.peek", function () {
  Deno.test("should return undefined on nonsensical argument", function () {
    const a = new Deque([1, 2, 3, 4]);
    assert(a.peek(-5) === undefined);
    assert(a.peek(-100) === undefined);
    assert(a.peek(undefined) === undefined);
    assert(a.peek(NaN) === undefined);
    assert(a.peek(Infinity) === undefined);
    assert(a.peek(-Infinity) === undefined);
    assert(a.peek(1.5) === undefined);
    assert(a.peek(4) === undefined);
  });

  Deno.test("should support positive indexing", function () {
    const a = new Deque([1, 2, 3, 4]);
    assert(a.peek(0) === 1);
    assert(a.peek(1) === 2);
    assert(a.peek(2) === 3);
    assert(a.peek(3) === 4);
  });

  Deno.test("should support negative indexing", function () {
    const a = new Deque([1, 2, 3, 4]);
    assert(a.peek(-1) === 4);
    assert(a.peek(-2) === 3);
    assert(a.peek(-3) === 2);
    assert(a.peek(-4) === 1);
  });
});

Deno.test("Deque.prototype.isEmpty", function () {
  Deno.test("should return true on empty deque", function () {
    const a = new Deque();
    assert(a.isEmpty());
  });

  Deno.test("should return false on deque with items", function () {
    const a = new Deque([1]);
    assert(!a.isEmpty());
  });
});

Deno.test("Deque.prototype.clear", function () {
  Deno.test("should clear the deque", function () {
    const a = new Deque([1, 2, 3, 4]);
    assert(!a.isEmpty());
    a.clear();
    assert(a.isEmpty());
  });
});

Deno.test("Deque.prototype.remove", function () {
  Deno.test("Should return undefined when empty deque", function () {
    const a = new Deque();
    assert(a.length === 0);
    assert(a.remove(1) === undefined);
    assert(a.remove(2, 3) === undefined);
    assert(a.length === 0);
  });

  Deno.test("Should return item when count is not provided", function () {
    const a = new Deque([1, 2, 3, 4]);
    assert(a.length === 4);
    assert(a.remove(1) === 2);
    // @ts-ignore: 'q.length' is no longer '3
    assert(a.length === 3);
  });

  Deno.test("remove from the end of the queue if a negative index is provided", function () {
    const q = new Deque();
    q.push(1); // 1
    q.push(2); // 2
    q.push(3); // 3
    assert(q.length === 3);
    assertEquals(q.remove(-2, 2), [2, 3]); // [ 2, 3 ]
    // @ts-ignore: 'q.length' is no longer '3
    assert(q.length === 1);
  });

  Deno.test("Should return undefined if index or count invalid", function () {
    const a = new Deque();
    const b = new Deque();
    b.push("foobar");
    b.push("foobaz");
    assert(a.length === 0);
    assert(b.remove(-1, 0) === undefined);
    assert(b.remove(-1, 2)?.length === 1);
    assert(b.remove(-5, 1) === undefined);
    assert(b.remove(66, 0) === undefined);
    assert(a.length === 0);
  });

  Deno.test("Should return the item at the front of the deque", function () {
    const a = new Deque([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const b = [];
    b.push(1, 2, 3, 4, 5, 6, 7, 8, 9);

    assertEquals(a.remove(0, 1), b.splice(0, 1));
    assertEquals(a.remove(0, 1), b.splice(0, 1));
    assertEquals(a.toArray(), b);
    a.unshift(5);
    a.unshift(4);
    a.unshift(3);
    a.unshift(2);
    a.unshift(1);
    a.push(1);
    a.push(2);
    a.push(3);
    a.push(4);
    a.push(5);
    a.unshift(3);
    a.unshift(2);
    a.unshift(1);
    a.remove(0, 1);
    b.unshift(1, 2, 3, 4, 5);
    b.push(1, 2, 3, 4, 5);
    b.unshift(1, 2, 3);
    b.splice(0, 1);
    assertEquals(a.toArray(), b);
    assertEquals(a.remove(0, 1), b.splice(0, 1));
    assertEquals(a.toArray(), b);
  });

  Deno.test("Should return the item at the back of the deque", function () {
    const a = new Deque([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const b = [];

    b.push(1, 2, 3, 4, 5, 6, 7, 8, 9);
    assertEquals(a.remove(8, 1), b.splice(8, 1));
    assertEquals(a.toArray(), b);
    a.unshift(5);
    a.unshift(4);
    a.unshift(3);
    a.unshift(2);
    a.unshift(1);
    a.push(1);
    a.push(2);
    a.push(3);
    a.push(4);
    a.push(5);
    a.unshift(3);
    a.unshift(2);
    a.unshift(1);
    a.remove(20, 1);
    b.unshift(1, 2, 3, 4, 5);
    b.push(1, 2, 3, 4, 5);
    b.unshift(1, 2, 3);
    b.splice(20, 1);
    assertEquals(a.toArray(), b);
    assertEquals(a.remove(19, 1), b.splice(19, 1));
    assertEquals(a.toArray(), b);
  });

  Deno.test("Should return the item somewhere in the middle of the deque", function () {
    const a = new Deque([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const b = [];
    b.push(1, 2, 3, 4, 5, 6, 7, 8, 9);

    assertEquals(a.remove(4, 1), b.splice(4, 1));
    assertEquals(a.remove(5, 1), b.splice(5, 1));
    assertEquals(a.remove(3, 1), b.splice(3, 1));
    assertEquals(a.toArray(), b);
    a.unshift(5);
    a.unshift(4);
    a.unshift(3);
    a.unshift(2);
    a.unshift(1);
    a.push(1);
    a.push(2);
    a.push(3);
    a.push(4);
    a.push(5);
    a.unshift(3);
    a.unshift(2);
    a.unshift(1);
    a.remove(7, 1);
    b.unshift(1, 2, 3, 4, 5);
    b.push(1, 2, 3, 4, 5);
    b.unshift(1, 2, 3);
    b.splice(7, 1);

    assertEquals(a.toArray(), b);
    assertEquals(a.remove(1, 4), b.splice(1, 4));
    assertEquals(a.toArray(), b);
  });

  Deno.test("Should remove a number of items at the front of the deque", function () {
    const a = new Deque([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const b = [];
    b.push(1, 2, 3, 4, 5, 6, 7, 8, 9);

    assertEquals(a.remove(0, 5), b.splice(0, 5));
    assertEquals(a.toArray(), b);
    a.unshift(5);
    a.unshift(4);
    a.unshift(3);
    a.unshift(2);
    a.unshift(1);
    a.push(1);
    a.push(2);
    a.push(3);
    a.push(4);
    a.push(5);
    a.unshift(3);
    a.unshift(2);
    a.unshift(1);
    a.remove(0, 11);
    b.unshift(1, 2, 3, 4, 5);
    b.push(1, 2, 3, 4, 5);
    b.unshift(1, 2, 3);
    b.splice(0, 11);

    assertEquals(a.toArray(), b);
    assertEquals(a.remove(0, 1), b.splice(0, 1));
    assertEquals(a.toArray(), b);
  });

  Deno.test("Should remove a number of items at the back of the deque", function () {
    const a = new Deque([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const b = [];
    b.push(1, 2, 3, 4, 5, 6, 7, 8, 9);

    assertEquals(a.remove(5, 4), b.splice(5, 4));
    assertEquals(a.toArray(), b);
    a.unshift(5);
    a.unshift(4);
    a.unshift(3);
    a.unshift(2);
    a.unshift(1);
    a.push(1);
    a.push(2);
    a.push(3);
    a.push(4);
    a.push(5);
    a.unshift(3);
    a.unshift(2);
    a.unshift(1);
    a.remove(16, 3);
    b.unshift(1, 2, 3, 4, 5);
    b.push(1, 2, 3, 4, 5);
    b.unshift(1, 2, 3);
    b.splice(16, 3);

    assertEquals(a.toArray(), b);
    assertEquals(a.remove(5, 100), b.splice(5, 100));
    assertEquals(a.toArray(), b);
  });

  Deno.test("Should remove a number of items somewhere in the middle of the deque", function () {
    const a = new Deque([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const b = [];
    b.push(1, 2, 3, 4, 5, 6, 7, 8, 9);

    assertEquals(a.remove(3, 3), b.splice(3, 3));
    assertEquals(a.toArray(), b);
    a.unshift(5);
    a.unshift(4);
    a.unshift(3);
    a.unshift(2);
    a.unshift(1);
    a.push(1);
    a.push(2);
    a.push(3);
    a.push(4);
    a.push(5);
    a.unshift(3);
    a.unshift(2);
    a.unshift(1);
    // console.log(a.toArray())
    a.remove(8, 6);
    b.unshift(1, 2, 3, 4, 5);
    b.push(1, 2, 3, 4, 5);
    b.unshift(1, 2, 3);
    b.splice(8, 6);

    assertEquals(a.toArray(), b);
    assertEquals(a.remove(3, 3), b.splice(3, 3));
    assertEquals(a.toArray(), b);
  });

  Deno.test("Should clear deque", function () {
    const a = new Deque([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const b = [];

    b.push(1, 2, 3, 4, 5, 6, 7, 8, 9);
    a.remove(0, 9);
    b.splice(0, 9);
    assertEquals(a.toArray(), b);
  });
});

Deno.test("Deque.prototype.splice", function () {
  Deno.test("Should remove and add items like native splice method at the front of deque", function () {
    const a = new Deque<number | number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const b: (number | number[])[] = [];
    b.push(1, 2, 3, 4, 5, 6, 7, 8, 9);

    assertEquals(a.splice(0, 2, 14, 15, 16), [1, 2]); // remove then add
    a.splice(0, 0, [11, 12, 13]); // add

    b.splice(0, 2, 14, 15, 16);
    b.splice(0, 0, [11, 12, 13]);
    assertEquals(a.toArray(), b);
    a.unshift(5);
    a.unshift(4);
    a.unshift(3);
    a.unshift(2);
    a.unshift(1);
    a.push(1);
    a.push(2);
    a.push(3);
    a.push(4);
    a.push(5);
    a.unshift(3);
    a.unshift(2);
    a.unshift(1);
    a.splice(0, 0, 17, 18, 19);
    b.unshift(1, 2, 3, 4, 5);
    b.push(1, 2, 3, 4, 5);
    b.unshift(1, 2, 3);
    b.splice(0, 0, 17, 18, 19);
    assertEquals(a.toArray(), b);
    assertEquals(a.splice(0, 2), b.splice(0, 2)); //remove
    assertEquals(a.toArray(), b);
  });

  Deno.test("Should remove and add items like native splice method at the end of deque", function () {
    const a = new Deque<number | number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const b: (number | number[])[] = [];
    b.push(1, 2, 3, 4, 5, 6, 7, 8, 9);

    assertEquals(a.splice(a.length - 1, 1, 14, 15, 16), [9]); // remove then add
    a.splice(a.length, 0, [11, 12, 13]); // add

    b.splice(b.length - 1, 1, 14, 15, 16);
    b.splice(b.length, 0, [11, 12, 13]);
    assertEquals(a.toArray(), b);
    a.unshift(5);
    a.unshift(4);
    a.unshift(3);
    a.unshift(2);
    a.unshift(1);
    a.push(1);
    a.push(2);
    a.push(3);
    a.push(4);
    a.push(5);
    a.unshift(3);
    a.unshift(2);
    a.unshift(1);
    a.splice(a.length, 0, 17, 18, 19);
    b.unshift(1, 2, 3, 4, 5);
    b.push(1, 2, 3, 4, 5);
    b.unshift(1, 2, 3);
    b.splice(b.length, 0, 17, 18, 19);
    assertEquals(a.toArray(), b);
    a.splice(18, 0, 18, 19);
    b.splice(18, 0, 18, 19);
    assertEquals(a.toArray(), b);
    a.splice(21, 0, 1, 2, 3, 4, 5, 6);
    b.splice(21, 0, 1, 2, 3, 4, 5, 6);
    assertEquals(a.toArray(), b);
    assertEquals(a.splice(a.length - 1, 2), b.splice(b.length - 1, 2)); //remove
    assertEquals(a.toArray(), b);
  });

  Deno.test("Should remove and add items like native splice method somewhere in the middle of deque", function () {
    const a = new Deque<number | number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const b: (number | number[])[] = [];
    b.push(1, 2, 3, 4, 5, 6, 7, 8, 9);

    a.splice(2, 0, [11, 12, 13]);
    assertEquals(a.splice(7, 2, 14, 15, 16), [7, 8]); // remove then add
    assertEquals(a.splice(10, 1, 17, 18), [9]);

    b.splice(2, 0, [11, 12, 13]);
    b.splice(7, 2, 14, 15, 16);
    b.splice(10, 1, 17, 18);
    assertEquals(a.toArray(), b);
    a.unshift(5);
    a.unshift(4);
    a.unshift(3);
    a.unshift(2);
    a.unshift(1);
    a.push(1);
    a.push(2);
    a.push(3);
    a.push(4);
    a.push(5);
    a.unshift(3);
    a.unshift(2);
    a.unshift(1);
    b.unshift(1, 2, 3, 4, 5);
    b.push(1, 2, 3, 4, 5);
    b.unshift(1, 2, 3);

    assertEquals(a.splice(3, 3, 16, 15, 14), b.splice(3, 3, 16, 15, 14));
    assertEquals(a.toArray(), b);
    assertEquals(a.splice(6, 1), b.splice(6, 1));
    assertEquals(a.toArray(), b);
  });

  Deno.test("Should return undefined when index or count is invalid", function () {
    const a = new Deque();
    const b = new Deque();
    b.push("foobar");
    b.push("foobaz");
    assert(a.length === 0);
    assert(b.splice(-1, 0) === undefined);
    assert(b.splice(-5, 1) === undefined);
    assert(b.splice(66, 0) === undefined);
    assert(a.length === 0);
  });

  Deno.test("Should return undefined when the queue is empty", function () {
    const a = new Deque();
    assert(a.length === 0);
    assert(a.splice(1, 0) === undefined);
  });

  Deno.test("Should return undefined when trying to remove further than current size", function () {
    const a = new Deque();
    a.push("foobar");
    a.push("foobar1");
    a.push("foobar2");
    a.push("foobar3");
    assert(a.length === 4);
    assert(a.splice(4, 234) === undefined);
  });

  Deno.test("Should remove and add items like native splice method to the empty deque", function () {
    const a = new Deque();
    assertEquals(a.splice(0, 0, 1), []);
    assertEquals(a.toArray(), [1]);
    a.clear();
    assertEquals(a.splice(0, 0, 1, 2, 3, 4, 5), []);
    assertEquals(a.toArray(), [1, 2, 3, 4, 5]);
    a.clear();
    assertEquals(a.splice(0, 1, 1, 2), undefined); // try to add and remove together
    assertEquals(a.toArray(), [1, 2]);

    const b = new Deque<number>([]); // initialized via empty array
    assertEquals(b.splice(0, 0, 1), []);
    assertEquals(b.toArray(), [1]);
  });
});
