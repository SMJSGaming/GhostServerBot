export class AsyncArray<T> extends Array<T> {
    
    public static from<T>(array: T[]): AsyncArray<T> {
        return new AsyncArray(...array);
    }

    constructor(...entries: T[]) {
        super(...entries);
    }

    public async asyncForEach<Z extends object = never>(callback: (value: T, index: number, array: AsyncArray<T>) => Promise<void>, thisArg?: Z): Promise<void> {
        for (let i = 0; i < this.length; i++) {
            await callback.call(thisArg, this[i], i, this);
        }
    }

    public async asyncMap<U, Z extends object = never>(callback: (value: T, index: number, array: AsyncArray<T>) => Promise<U>, thisArg?: Z): Promise<AsyncArray<U>> {        
        const mapped = new AsyncArray<U>();
        
        for (let i = 0; i < this.length; i++) {
            mapped.push(await callback.call(thisArg, this[i], i, this));
        }

        return mapped;
    }

    public async asyncFilter<Z extends object = never>(callback: (value: T, index: number, array: AsyncArray<T>) => Promise<boolean>, thisArg?: Z): Promise<AsyncArray<T>> {
        const filtered = new AsyncArray<T>();

        for (let i = 0; i < this.length; i++) {
            if (await callback.call(thisArg, this[i], i, this)) {
                filtered.push(this[i]);
            }
        }

        return filtered;
    }

    public async asyncReduce<U, Z extends object = never>(callback: (previousValue: U, currentValue: T, index: number, array: AsyncArray<T>) => Promise<U>, initialValue: U, thisArg?: Z): Promise<U> {
        for (let i = 0; i < this.length; i++) {
            initialValue = await callback.call(thisArg, initialValue, this[i], i, this);
        }

        return initialValue;
    }
}