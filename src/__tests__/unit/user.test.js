function add(a, b) {
  return +a + +b;
}

describe('add', () => {
  test('2 + 3 should return 5', () => {
    const result = add(2, 3);
    expect(result).toEqual(5);
  });
});
