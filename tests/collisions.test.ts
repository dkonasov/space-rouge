import { expect, test } from "vitest";
import { Rectangle } from "../src/classes/rectangle";
import { Vector2 } from "three";

test("Two rectangles that don't intersect each other", () => {
  const rect1 = new Rectangle(2, 2);
  const rect2 = new Rectangle(2, 2);
  const rect1Position = new Vector2(0, 0);
  const rect2Position = new Vector2(3, 3);

  const result = rect1.hasIntersection(rect2, rect1Position, rect2Position);

  expect(result).toBe(false);
});

test("Two rectangles that intersect each other", () => {
  const rect1 = new Rectangle(2, 2);
  const rect2 = new Rectangle(2, 2);
  const rect1Position = new Vector2(0, 0);
  const rect2Position = new Vector2(1, 1);

  const result = rect1.hasIntersection(rect2, rect1Position, rect2Position);

  expect(result).toBe(true);
});
