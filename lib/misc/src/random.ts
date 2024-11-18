export const random = {
  string(length: number = 10) {
    return Math.random()
      .toString(36)
      .substring(2, length + 2)
  },
  number(min: number = 0, max: number = 100) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }
}
