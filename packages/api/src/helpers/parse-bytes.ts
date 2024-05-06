const UNITS = new Map<string, number>([
    ['B', 1],
    ['KB', 1024],
    ['K', 1024],
    ['MB', 1024 * 1024],
    ['M', 1024 * 1024],
    ['GB', 1024 * 1024 * 1024],
    ['G', 1024 * 1024 * 1024],
]);

const PATTERN = new RegExp(`(?<value>[0-9]+(?:\\.[0-9]+)?)\\s*(?<unit>${[...UNITS.keys()].join('|')})`, 'i')

export const parseBytes = (input:string) => {
    const match = input.match(PATTERN)
    if (!match) {
        throw new Error('Invalid byte format')
    }

    const value = +match.groups!.value
    const unit = match.groups!.unit.toUpperCase()
    const unitMultiplier = UNITS.get(unit)
    
    if (!unitMultiplier) {
        throw new Error('Invalid byte format')
    }

    return value * unitMultiplier
}