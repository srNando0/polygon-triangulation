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
	public vertices: [Point, Point, Point];

	public constructor(a: Point, b: Point, c: Point) {
		this.vertices = [a, b, c];
	}



	/*
		Methods
	*/
	public isInverted(): boolean {
		const [a, b, c]: [Point, Point, Point] = this.vertices;

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
	public vertices: Point[];

	public constructor(vertices: Point[]) {
		this.vertices = vertices;
	}



	/*
		Methods
	*/
	public earClippingTriangulation(): Triangle[] {
		// Exit if there is no triangles
		if (this.vertices.length < 3)
			return [];

		const triangles: Triangle[] = [];
		const queue: CircularQueue<Point> = new CircularQueue<Point>(this.vertices);

		// Get three points in anti-clockwise order
		let a: Point = queue.pop()!;
		let b: Point = queue.pop()!;
		let c: Point = queue.pop()!;

		while (queue.getSize() > 0) {
			const triangle: Triangle = new Triangle(a, b, c);

			if (triangle.isInverted()) {
				// Not a diagonal!
				// Therefore discard the last vertex and get a new one
				queue.push(a);
				[a, b, c] = [b, c, queue.pop()!];
			} else {
				// A diagonal!
				// Therefore discard the middle point and get the new first
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