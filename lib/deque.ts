type Params<T> =
  | []
  | [capacity: number]
  | [array: T[]]
  | [array: T[], capacity: number];

export class Deque<T> {
  #capacity: number | undefined = undefined;
  #head = 0;
  #tail = 0;
  #capacityMask = 0x3;
  #list: T[] = new Array(4);

  constructor(...args: Params<T>) {
    if (args.length === 1) {
      const arg1 = args[0];
      if (Array.isArray(arg1)) {
        this.#fromArray(arg1);
      } else {
        this.#capacity = arg1;
      }
    } else if (args.length === 2) {
      const [arg1, arg2] = args;
      this.#fromArray(arg1);
      this.#capacity = arg2;
    }
  }

  peek(index?: number): T | undefined {
    if (index === undefined) {
      if (this.#head === this.#tail) {
        return undefined;
      }
      return this.#list[this.#head];
    }
    let i = index;
    if ((i !== (i | 0))) return undefined;
    const len = this.length;
    if (i >= len || i < -len) return undefined;
    if (i < 0) {
      i += len;
    }
    i = (this.#head + i) & this.#capacityMask;
    return this.#list[i];
  }

  get length(): number {
    if (this.#head === this.#tail) {
      return 0;
    } else if (this.#head < this.#tail) {
      return this.#tail - this.#head;
    }
    return this.#capacityMask + 1 - (this.#head - this.#tail);
  }

  unshift(item: T): number {
    const len = this.#list.length;
    this.#head = (this.#head - 1 + len) & this.#capacityMask;
    this.#list[this.#head] = item;
    if (this.#tail === this.#head) {
      this.#growArray();
    }
    if (this.#capacity && this.length > this.#capacity) {
      this.pop();
    }
    if (this.#head < this.#tail) {
      return this.#tail - this.#head;
    }
    return this.#capacityMask + 1 - (this.#head - this.#tail);
  }

  shift(): T | undefined {
    const head = this.#head;
    if (head === this.#tail) {
      return undefined;
    }
    const item = this.#list[head];
    // @ts-ignore: Is ok
    this.#list[head] = undefined;
    this.#head = (head + 1) & this.#capacityMask;
    if (
      head < 2 && this.#tail > 10000 && this.#tail <= this.#list.length >>> 2
    ) {
      this.#shrinkArray();
    }
    return item;
  }

  push(item: T): number {
    const tail = this.#tail;
    this.#list[tail] = item;
    this.#tail = (tail + 1) & this.#capacityMask;
    if (this.#tail === this.#head) {
      this.#growArray();
    }
    if (this.#capacity && this.length > this.#capacity) {
      this.shift();
    }
    if (this.#head < this.#tail) {
      return this.#tail - this.#head;
    }
    return this.#capacityMask + 1 - (this.#head - this.#tail);
  }

  pop(): T | undefined {
    const tail = this.#tail;
    if (tail === this.#head) {
      return undefined;
    }
    const len = this.#list.length;
    this.#tail = (tail - 1 + len) & this.#capacityMask;
    const item = this.#list[this.#tail];
    // @ts-ignore: Is ok
    this.#list[this.#tail] = undefined;
    if (this.#head < 2 && tail > 10000 && tail <= len >>> 2) {
      this.#shrinkArray();
    }
    return item;
  }

  remove(index: number): T | undefined;
  remove(index: number, count: number): T[] | undefined;
  remove(index: number, count?: number) {
    if (count === undefined) {
      return this.#removeOne(index);
    }
    let i = index;
    let removed;
    let del_count = count;
    if ((i !== (i | 0))) {
      return undefined;
    } else if (this.#head === this.#tail) {
      return undefined;
    }
    const size = this.length;
    const len = this.#list.length;
    if (i >= size || i < -size || count < 1) {
      return undefined;
    } else if (i < 0) {
      i += size;
    }
    if (count === 1) {
      removed = new Array(1);
      removed[0] = this.#removeOne(i);
      return removed;
    } else if (i === 0 && i + count >= size) {
      removed = this.toArray();
      this.clear();
      return removed;
    } else if (i + count > size) {
      count = size - i;
    }
    let k;
    removed = new Array(count);
    for (k = 0; k < count; k++) {
      removed[k] = this.#list[(this.#head + i + k) & this.#capacityMask];
    }
    i = (this.#head + i) & this.#capacityMask;
    if (index + count === size) {
      this.#tail = (this.#tail - count + len) & this.#capacityMask;
      for (k = count; k > 0; k--) {
        // @ts-ignore: Is ok
        this.#list[i = (i + 1 + len) & this.#capacityMask] = undefined;
      }
      return removed;
    } else if (index === 0) {
      this.#head = (this.#head + count + len) & this.#capacityMask;
      for (k = count - 1; k > 0; k--) {
        // @ts-ignore: Is ok
        this.#list[i = (i + 1 + len) & this.#capacityMask] = undefined;
      }
      return removed;
    } else if (i < size / 2) {
      this.#head = (this.#head + index + count + len) & this.#capacityMask;
      for (k = index; k > 0; k--) {
        this.unshift(this.#list[i = (i - 1 + len) & this.#capacityMask]);
      }
      i = (this.#head - 1 + len) & this.#capacityMask;
      while (del_count > 0) {
        // @ts-ignore: Is ok
        this.#list[i = (i - 1 + len) & this.#capacityMask] = undefined;
        del_count--;
      }
      if (index < 0) {
        this.#tail = i;
      }
    } else {
      this.#tail = i;
      i = (i + count + len) & this.#capacityMask;
      for (k = size - (count + index); k > 0; k--) {
        this.push(this.#list[i++]);
      }
      i = this.#tail;
      while (del_count > 0) {
        // @ts-ignore: Is ok
        this.#list[i = (i + 1 + len) & this.#capacityMask] = undefined;
        del_count--;
      }
    }
    if (this.#head < 2 && this.#tail > 10000 && this.#tail <= len >>> 2) {
      this.#shrinkArray();
    }
    return removed;
  }

  // deno-lint-ignore no-unused-vars
  splice(index: number, count: number, ...insert: T[]): T[] | undefined {
    let i = index;
    if ((i !== (i | 0))) {
      return undefined;
    }
    const size = this.length;
    if (i < 0) {
      i += size;
    }
    if (i > size) {
      return undefined;
    } else if (arguments.length > 2) {
      let k;
      let temp;
      let removed;
      let arg_len = arguments.length;
      let arguments_index = 2;
      const len = this.#list.length;
      if (!size || i < size / 2) {
        temp = new Array(i);
        for (k = 0; k < i; k++) {
          temp[k] = this.#list[(this.#head + k) & this.#capacityMask];
        }
        if (count === 0) {
          removed = [];
          if (i > 0) {
            this.#head = (this.#head + i + len) & this.#capacityMask;
          }
        } else {
          removed = this.remove(i, count);
          this.#head = (this.#head + i + len) & this.#capacityMask;
        }
        while (arg_len > arguments_index) {
          this.unshift(arguments[--arg_len]);
        }
        for (k = i; k > 0; k--) {
          this.unshift(temp[k - 1]);
        }
      } else {
        temp = new Array(size - (i + count));
        const leng = temp.length;
        for (k = 0; k < leng; k++) {
          temp[k] =
            this.#list[(this.#head + i + count + k) & this.#capacityMask];
        }
        if (count === 0) {
          removed = [];
          if (i != size) {
            this.#tail = (this.#head + i + len) & this.#capacityMask;
          }
        } else {
          removed = this.remove(i, count);
          this.#tail = (this.#tail - leng + len) & this.#capacityMask;
        }
        while (arguments_index < arg_len) {
          this.push(arguments[arguments_index++]);
        }
        for (k = 0; k < leng; k++) {
          this.push(temp[k]);
        }
      }
      return removed;
    }
    return this.remove(i, count);
  }

  clear(): void {
    this.#list = new Array(this.#list.length);
    this.#head = 0;
    this.#tail = 0;
  }

  isEmpty(): boolean {
    return this.#head === this.#tail;
  }

  toArray(): T[] {
    return this.#copyArray(false);
  }

  #removeOne(index: number) {
    let i = index;
    if ((i !== (i | 0))) {
      return undefined;
    } else if (this.#head === this.#tail) {
      return undefined;
    }
    const size = this.length;
    const len = this.#list.length;
    if (i >= size || i < -size) {
      return undefined;
    } else if (i < 0) {
      i += size;
    }
    i = (this.#head + i) & this.#capacityMask;
    const item = this.#list[i];
    let k;
    if (index < size / 2) {
      for (k = index; k > 0; k--) {
        this.#list[i] = this.#list[i = (i - 1 + len) & this.#capacityMask];
      }
      // @ts-ignore: Is ok
      this.#list[i] = undefined;
      this.#head = (this.#head + 1 + len) & this.#capacityMask;
    } else {
      for (k = size - 1 - index; k > 0; k--) {
        this.#list[i] = this.#list[i = (i + 1 + len) & this.#capacityMask];
      }
      // @ts-ignore: Is ok
      this.#list[i] = undefined;
      this.#tail = (this.#tail - 1 + len) & this.#capacityMask;
    }
    return item;
  }

  #fromArray(array: T[]) {
    const length = array.length;
    const capacity = this.#nextPowerOf2(length);
    this.#list = new Array(capacity);
    this.#capacityMask = capacity - 1;
    this.#tail = length;
    for (let i = 0; i < length; i++) {
      this.#list[i] = array[i];
    }
  }

  #copyArray(fullCopy: boolean, size = 0): T[] {
    const src = this.#list;
    const capacity = src.length;
    const length = this.length;
    size = size | length;
    if (size == length && this.#head < this.#tail) {
      return this.#list.slice(this.#head, this.#tail);
    }
    const dest = new Array(size);
    let k = 0;
    let i;
    if (fullCopy || this.#head > this.#tail) {
      for (i = this.#head; i < capacity; i++) {
        dest[k++] = src[i];
      }
      for (i = 0; i < this.#tail; i++) {
        dest[k++] = src[i];
      }
    } else {
      for (i = this.#head; i < this.#tail; i++) {
        dest[k++] = src[i];
      }
    }
    return dest;
  }

  #growArray() {
    if (this.#head != 0) {
      const newList = this.#copyArray(true, this.#list.length << 1);
      this.#tail = this.#list.length;
      this.#head = 0;
      this.#list = newList;
    } else {
      this.#tail = this.#list.length;
      this.#list.length <<= 1;
    }
    this.#capacityMask = (this.#capacityMask << 1) | 1;
  }

  #shrinkArray() {
    this.#list.length >>>= 1;
    this.#capacityMask >>>= 1;
  }

  #nextPowerOf2(n: number) {
    const log2 = Math.log(n) / Math.log(2);
    const nextPow2 = 1 << (log2 + 1);
    return Math.max(nextPow2, 4);
  }
}

export default Deque;
