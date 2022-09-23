export const parseInput = (e: string) => {
    const parsedInput = e.split('@')
    return {
        title: !!parsedInput[0] ? parsedInput[0] : null,
        category: parsedInput.length > 1 ? parsedInput[parsedInput.length - 1] : null,
    }
}