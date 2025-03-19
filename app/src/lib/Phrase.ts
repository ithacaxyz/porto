export class PassphraseGenerator {
  #wordlist: Array<string>

  constructor(
    wordlist = [
      'apple',
      'banana',
      'cherry',
      'date',
      'elderberry',
      'fig',
      'grape',
      'honeydew',
      'kiwi',
      'lemon',
      'mango',
      'nectarine',
      'orange',
      'pear',
      'pineapple',
      'quince',
      'raspberry',
      'strawberry',
      'tangerine',
      'watermelon',
    ] as const as Array<string>,
  ) {
    this.#wordlist = wordlist
  }

  #getRandomWord = (): string => {
    const randomBytes = crypto.randomUUID()
    const randomInt = Number.parseInt(randomBytes, 16)
    return this.#wordlist[randomInt % this.#wordlist.length] ?? ''
  }

  generatePhrase = ({
    count = 4,
    separator = '-',
    capitalize = false,
  }): string =>
    Array(count)
      .fill(0)
      .map(() =>
        capitalize
          ? this.#getRandomWord().charAt(0).toUpperCase() +
            this.#getRandomWord().slice(1)
          : this.#getRandomWord(),
      )
      .join(separator)
      .replaceAll(/\n/g, '')
      .replaceAll(/\r/g, '')
}
