import { Vector2, Matrix2 } from "./LinearAlgebra";
import { CircularQueue } from "./DataStructures";



export class Point {
	public pos: Vector2;

	public constructor(pos: Vector2) {
		this.pos = pos;
	}



	/*
		Static Methods
	*/
	public static add(p: Point, u: Vector2): Point {
		return new Point(Vector2.add(p.pos, u));
	}

	public static sub(p1: Point, p2: Point): Vector2 {
		return Vector2.sub(p1.pos, p2.pos);
	}

	public static distance(p1: Point, p2: Point): number {
		return Vector2.sub(p1.pos, p2.pos).norm();
	}

	public static sqrDistance(p1: Point, p2: Point): number {
		return Vector2.sub(p1.pos, p2.pos).sqrNorm();
	}

	public static lerp(lambda: number, p1: Point, p2: Point): Point {
		return new Point(Vector2.lerp(lambda, p1.pos, p2.pos));
	}

	/*public static supportMapping(direction: Vector2, points: Point[]): Point {
		if (points.length == 0)
			throw new Error("Empty list in Point.supportMapping");

		let supportPoint: Point = points[0];
		let maxDot: number = Vector2.dot(direction, supportPoint.pos);

		for (const point of points) {
			const dot: number = Vector2.dot(direction, point.pos);
			if (dot > maxDot) {
				supportPoint = point;
				maxDot = dot;
			}
		}

		return supportPoint;
	}*/
}



export class Triangle {
	public points: [Point, Point, Point];

	public constructor(a: Point, b: Point, c: Point) {
		this.points = [a, b, c];
	}



	/*
		Methods
	*/
	public isInverted(): boolean {
		const [a, b, c] = this.points;

		// vectors u = b - a, v = c - a
		const u: Vector2 = Point.sub(b, a);
		const v: Vector2 = Point.sub(c, a);
		
		// matrix
		//     [ | | ]
		// M = [ u v ]
		//     [ | | ]
		const M: Matrix2 = new Matrix2([
			[u.x, v.x],
			[u.y, v.y]
		]);

		return (M.det() < 0) ? true : false;
	}
}



export class Polygon {
	public points: Point[];

	public constructor(points: Point[]) {
		this.points = points;
	}



	/*
		Methods
	*/
	public earClippingTriangulation(): Triangle[] {
		if (this.points.length < 3)
			return [];

		const triangles: Triangle[] = [];
		const queue: CircularQueue<Point> = new CircularQueue<Point>(this.points);

		let a: Point = queue.pop()!;
		let b: Point = queue.pop()!;
		let c: Point = queue.pop()!;

		while (queue.getSize() > 0) {
			const triangle: Triangle = new Triangle(a, b, c);

			if (triangle.isInverted()) {
				queue.push(a);
				[a, b, c] = [b, c, queue.pop()!];
			} else {
				triangles.push(triangle);
				[b, c] = [c, queue.pop()!];
			}
		}

		return triangles;
	}



	/*
		Static Methods
	*/
	/*public randomPolygon(center: Point, radius: number, numberOfPoints: number, displacement: number) {

	}*/
}