export function wakeAfter(miliseconds: number): Promise<void> {
    return new Promise(resolve=> {
        setTimeout(()=>resolve(), miliseconds);
    })
}

export function firstKeyOf(obj: object): string | undefined {
    return Object.keys(obj)[0];
}