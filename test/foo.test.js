import { foo } from "../src/foo";

test('foo', () => {
  expect(foo(1, 2)).toBe(10);
  expect(foo(-1, -2)).toBe(-10);
});
