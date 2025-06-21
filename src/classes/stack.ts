export class Stack<T> {
	private storage: T[] = [];

	add(elem: T) {
		this.storage.push(elem);
	}

	get(): T | undefined {
		return this.storage.pop();
	}
}
