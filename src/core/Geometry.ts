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



export class Circle {
	private static readonly EPSILON = 0.0001;

	public center: Point;
	public radius: number;
	
	public constructor(center: Point, radius: number) {
		this.center = center;
		this.radius = radius;
	}



	/*
		Methods
	*/
	public isPointInside(point: Point): boolean {
		return (Point.sqrDistance(this.center, point) <= this.radius*this.radius + Circle.EPSILON);
	}



	/*
		Static Methods
	*/
	public static circleWith2Points(points: Point[]): Circle {
		if (points.length != 2)
			throw new Error("Number of points different than 2 in Circle.circleWith2Points");

		return new Circle(
			Point.lerp(0.5, points[0], points[1]),
			Point.distance(points[0], points[1])/2
		);
	}



	public static circleWith3Points(points: Point[]): Circle {
		if (points.length != 3)
			throw new Error("Number of points different than 2 in Circle.circleWith2Points");

		const r1: Vector2 = Point.sub(points[1], points[0]);
		const r2: Vector2 = Point.sub(points[2], points[0]);

		const _2Rt: Matrix2 = new Matrix2([
			[2*r1.x, 2*r1.y],
			[2*r2.x, 2*r2.y]
		]);
		const s: Vector2 = new Vector2(
			Vector2.dot(r1, r1),
			Vector2.dot(r2, r2)
		);
		const c: Vector2 = Vector2.matmul(_2Rt.inverse(), s);

		const center: Point = Point.add(
			points[0],
			c
		);
		const radius: number = c.norm();

		return new Circle(center, radius);
	}



	public static heuristicEnclosingCircle(points: Point[]): Circle {
		// Special case
		if (points.length == 0) {
			return new Circle(new Point(Vector2.zero()), 0);
		}

		// Getting points of minimum/maximum coordinates for each axis
		let minXPoint: Point = points[0];
		let maxXPoint: Point = points[0];
		let minYPoint: Point = points[0];
		let maxYPoint: Point = points[0];

		for (let point of points) {
			if (point.pos.x < minXPoint.pos.x)
				minXPoint = point;

			if (point.pos.x > maxXPoint.pos.x)
				maxXPoint = point;

			if (point.pos.y < minYPoint.pos.y)
				minYPoint = point;

			if (point.pos.y > maxYPoint.pos.y)
				maxYPoint = point;
		}

		// Computing distance between each pair of points
		const distanceX: number = Point.distance(minXPoint, maxXPoint);
		const distanceY: number = Point.distance(minYPoint, maxYPoint);

		// Setting a initial center point and radius
		let circle: Circle;

		if (distanceX > distanceY)
			circle = new Circle(Point.lerp(0.5, minXPoint, maxXPoint), distanceX/2);
		else
			circle = new Circle(Point.lerp(0.5, minYPoint, maxYPoint), distanceY/2);

		// Enlarging the circle
		for (let point of points) {
			const distance: number = Point.distance(circle.center, point);

			if (circle.radius < distance)
				circle.radius = distance;
		}

		return circle;
	}



	public static welzl(P: Point[], R: Point[]): Circle {
		// Base cases
		if (P.length == 0) {
			if (R.length == 0)
				return new Circle(new Point(Vector2.zero()), 0);

			if (R.length == 1)
				return new Circle(R[0], 0);

			if (R.length == 2)
				return Circle.circleWith2Points(R);
		}

		if (R.length == 3)
			return Circle.circleWith3Points(R);



		// Recursion
		let C: Circle;

		const p: Point = P.pop()!;	// P \ {p}
		C = Circle.welzl(P, R);		// C(P \ {p}, R)
		P.push(p);					// P

		if (C.isPointInside(p))
			return C;				// C(P, R) = C(P \ {p}, R)

		R.push(p);					// R U {p}
		C = Circle.welzl(P, R);		// C(P, R U {p})
		R.pop();					// R
		
		return C;					// C(P, R) = C(P, R U {p})
	}



	public static smallestEnclosingCircle(points: Point[]): Circle {
		// Fisher–Yates shuffle
		const P: Point[] = [...points];

		for (let size = P.length; size > 0; size--) {
			const i: number = size - 1;
			const j: number = Math.floor(Math.random()*size);

			const temp: Point = P[i];
			P[i] = P[j];
			P[j] = temp;
		}

		return Circle.welzl(P, []);
	}
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
	public randomPolygon(center: Point, radius: number, numberOfPoints: number, displacement: number) {
		const thetas: number[] = [];
		const radii: number[] = [];

		for (let i = 0; i < numberOfPoints; i++) {
			thetas.push(Math.random()*2*Math.PI);
			radii.push(radius*Math.sqrt(1 - Math.random()*displacement));
		}

		thetas.sort();
		const points: Point[] = [];

		for (let i = 0; i < numberOfPoints; i++) {
			const vector: Vector2 = new Vector2(
				radii[i]*Math.cos(thetas[i]),
				radii[i]*Math.sin(thetas[i])
			);

			points.push(Point.add(center, vector));
		}

		return points;
	}
}