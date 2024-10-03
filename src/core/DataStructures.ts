import { NullError } from "./ErrorClasses";



export class DoublyLinkedList<T> {
	private head: DoublyLinkedListNode<T> | null;
	private size: number;

	public constructor(list: T[]) {
		this.head = null;
		this.size = 0;

		for (const element of list)
			this.push(element);
	}



	/*
		Methods
	*/
	public remove(node: DoublyLinkedListNode<T>): void {
		const previous: DoublyLinkedListNode<T> | null = node.getPrevious();
		const next: DoublyLinkedListNode<T> | null = node.getNext();

		if (previous == null)
			throw new NullError(`previous is null while trying to remove ${node.getData()}`);
		if (next == null)
			throw new NullError(`next is null while trying to remove ${node.getData()}`);

		previous.setNext(next);
		next.setPrevious(previous);

		if (this.head == node)
			this.head = next;

		this.size--;
	}

	public insertBefore(data: T, node: DoublyLinkedListNode<T>): void {
		const newNode: DoublyLinkedListNode<T> = new DoublyLinkedListNode<T>(data);

		const previous: DoublyLinkedListNode<T> | null = node.getPrevious();
		if (previous == null)
			throw new NullError(`previous is null while trying to insert ${data} before ${node.getData()}`);

		newNode.setPrevious(previous);
		newNode.setNext(node);
		node.setPrevious(newNode);
		previous.setNext(newNode);


		this.size++;
	}

	public insertAfter(data: T, node: DoublyLinkedListNode<T>): void {
		const newNode: DoublyLinkedListNode<T> = new DoublyLinkedListNode<T>(data);

		const next: DoublyLinkedListNode<T> | null = node.getNext();
		if (next == null)
			throw new NullError(`next is null while trying to insert ${data} after ${node.getData()}`);

		newNode.setPrevious(node);
		newNode.setNext(next);

		node.setNext(newNode);
		next.setPrevious(newNode);

		this.size++;
	}



	public push(data: T): void {
		if (this.head == null) {
			// size = 0
			const node: DoublyLinkedListNode<T> = new DoublyLinkedListNode<T>(data);

			this.head = node;
			this.head.setNext(node);
			this.head.setPrevious(node);

			this.size++;
		} else {
			// size > 0
			this.insertBefore(data, this.head);
		}
	}

	public pop(): T | null {
		// size = 0
		if (this.head == null)
			return null;

		// size = 1
		if (this.size == 1) {
			const data: T = this.head.getData();
			this.head = null;
			this.size--;
			return data;
		}

		// size > 1
		const tail: DoublyLinkedListNode<T> | null = this.head.getPrevious();
		if (tail == null)
			throw new NullError(`tail is null while trying to pop`);

		const data: T = tail.getData();

		this.remove(tail);

		return data;
	}



	public getList(): T[] {
		const list: T[] = [];

		// size = 0
		if (this.head == null)
			return list;

		// size > 0
		list.push(this.head.getData());

		let node: DoublyLinkedListNode<T> | null = this.head.getNext();

		while (node != this.head) {
			if (node == null)
				throw new NullError("node is null while trying to get list");

			list.push(node.getData());
			node = node.getNext();
		}

		return list;
	}
}



class DoublyLinkedListNode<T> {
	private data: T;
	private previous: DoublyLinkedListNode<T> | null;
	private next: DoublyLinkedListNode<T> | null;

	public constructor(data: T) {
		this.data = data;
		this.previous = null;
		this.next = null;
	}



	/*
		Getters and Setters
	*/
	public getData(): T {
		return this.data;
	}
	public getPrevious(): DoublyLinkedListNode<T> | null {
		return this.previous;
	}
	public getNext(): DoublyLinkedListNode<T> | null {
		return this.next;
	}

	public setData(data: T): void {
		this.data = data;
	}
	public setPrevious(node: DoublyLinkedListNode<T>): void {
		this.previous = node;
	}
	public setNext(node: DoublyLinkedListNode<T>): void {
		this.next = node;
	}
}



/*export class CircularQueue<T> {
	// list: [_, i, *, *, *j, _]
	private list: T[];
	private i: number;
	private j: number;
	private size: number;

	public constructor(list: T[]) {
		this.list = [...list];
		this.i = list.length - 1;
		this.j = 0;
		this.size = list.length;
	}



	/*
		Methods
	/
	private step(x: number): number {
		if (x == this.list.length - 1)
			return 0;

		return x + 1;
	}

	public push(data: T): void {
		// if the list is not full
		if (this.size > this.list.length)
			throw Error(`Circular List full. Couldn't add ${data}.`);

		this.list[this.j] = data;

		this.size++;
		this.j = this.step(this.j);
	}

	public pop(): T | null {
		// if list is empty
		if (this.size == 0)
			return null;

		this.size--;
		this.i = this.step(this.i);
		return this.list[this.i];
	}



	/*
		Getters and Setters
	/
	public getSize(): number {
		return this.size;
	}

	public getList(): T[] {
		const list: T[] = []

		let k = this.i;
		k = this.step(k);

		while (k != this.j) {
			list.push(this.list[k]);
			k = this.step(k);
		}

		return list;
	}
}*/



/*export class Queue<T> {
	private front: QueueNode<T> | null;
	private rear: QueueNode<T> | null;
	private size: number;

	public constructor(list: T[]) {
		this.front = null;
		this.rear = null;
		this.size = 0;

		for (const data of list)
			this.push(data);
	}



	/*
		Methods
	/
	public push(data: T) {
		// always increase size
		this.size++;

		if (this.front == null || this.rear == null) {
			// empty case
			const node: QueueNode<T> = new QueueNode<T>(data);
			this.front = node;
			this.rear = node;
		} else {
			// non-empty case
			const node: QueueNode<T> = new QueueNode<T>(data);
			this.rear.next = node;
			this.rear = node;
		}
	}

	public pop(): T | null {
		// empty case
		if (this.front == null)
			return null;

		// decrease only if non-empty
		this.size--;

		// case of one node
		if (this.size == 0) {
			const data: T = this.front.data;
			this.front = null;
			this.rear = null;
			return data;
		}

		// case of more than one node
		const data: T = this.front.data;
		this.front = this.front.next;
		return data;
	}



	/*
		Getters
	/
	public getList(): T[] {
		const list: T[] = [];

		// if not empty
		if (this.front != null && this.rear != null) {
			let pointer: QueueNode<T> = this.front;
			list.push(pointer.data);

			while (pointer != this.rear) {
				pointer = pointer.next;
				list.push(pointer.data);
			}
		}

		return list;
	}

	public getSize(): number {
		return this.size;
	}
}



class QueueNode<T> {
	public data: T;
	public next: QueueNode<T>;

	public constructor(data: T) {
		this.data = data;
		this.next = this;
	}
}*/