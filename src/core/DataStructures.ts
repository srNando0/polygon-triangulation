export class CircularQueue<T> {
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
	*/
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
	*/
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
}



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