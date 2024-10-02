import { useState, useEffect, useRef } from "react";
import { ReactNode, RefObject } from "react";
import { CircularQueue } from "./core/DataStructures";

import { Resolution, NullError, Renderer } from "./core/Renderer";
import { Point, Circle, Triangle, Polygon } from "./core/Geometry";
import { Vector2 } from "./core/LinearAlgebra";



/*
	Interfaces
*/



/*
	Main ReactNode
*/
const App = ():ReactNode => {
	/*
		Variables
	*/
	const canvasResolution: Resolution = {
		width: 10*192,
		height: 10*108
	};



	/*
		Functions
	*/
	const clickGenerate = (): void => {
		if (renderer.current == null)
			throw new NullError("renderer is null");

		//setRadiusInfo(generatePointsAndCircle(renderer.current, canvasResolution, numberOfPoints));
	}

	const clickTest = (): void => {
		const numberOfTests = 1000;
		const numberOfSamples = 1000;
		const numbersOfPoints: number[] = [];
		const heuristics: number[] = [];
		const smallests: number[] = [];

		for (let i = 1; i <= numberOfTests; i++) {
			const numberOfPoints: number = (1000/numberOfTests)*i;
			numbersOfPoints.push(numberOfPoints);

			let heristic: number = 0;
			let smallest: number = 0;
			for (let j = 0; j < numberOfSamples; j++) {
				//const testInfo: TestInfo = testAlgorithms(numberOfPoints);

				//heristic += testInfo.heuristic.time;
				//smallest += testInfo.smallest.time;
			}
			heristic /= numberOfSamples;
			smallest /= numberOfSamples;

			heuristics.push(heristic);
			smallests.push(smallest);

			console.log(`points: ${numberOfPoints}, heuristic: ${heristic}, smallest: ${smallest}`);
		}

		console.log(numbersOfPoints);
		console.log(heuristics);
		console.log(smallests);
	}



	/*
		Hooks
	*/
	const canvasRef: RefObject<HTMLCanvasElement> = useRef<HTMLCanvasElement>(null);
	const renderer = useRef<Renderer | null>(null);

	const [numberOfPoints, setNumberOfPoints] = useState<number>(100);
	const [displacement, setDisplacement] = useState<number>(0.5);

	useEffect(() => {
		// Exit if the canvas is not loaded yet
		if (canvasRef.current == null)
			return;
		const current = canvasRef.current;

		// resize canvas
		current.width = canvasResolution.width;
		current.height = canvasResolution.height;

		// Create a Renderer and call the main function
		try {
			renderer.current = new Renderer(current, canvasResolution);


		} catch (e: unknown) {
			if (e instanceof Error) {
				console.error(e.name);
				console.log(e.message);
			}
		}
	}, [canvasRef]);



	return (
		<>
		<div className='p-2 rounded-xl flex flex-col text-center text-xl'>
			<canvas ref={canvasRef} className="w-3/4 self-center bg-black rounded-xl" style={{imageRendering: "crisp-edges"}}/>
			<button
				className="p-2 w-1/2 self-center bg-lime-600 rounded-2xl"
				onClick={clickGenerate}
			>
				Generate points!
			</button>
			<div className="flex justify-between items-center">
				<div className="flex grow justify-center">
					<input
						className="w-1/2"
						type="range"
						min="2"
						max="1000"
						value={numberOfPoints}
						onChange={(e) => setNumberOfPoints(Number(e.target.value))}
					/>
					<input
						className="m-2 p-1 w-14
						bg-gray-500 border-0 rounded-2xl
						focus:outline-none focus:ring-lime-600 focus:border-lime-600 focus:ring-2
						[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
						style={{WebkitAppearance: "none"}}
						type="number"
						min="2"
						max="1000"
						value={numberOfPoints}
						onChange={(e) => setNumberOfPoints(Number(e.target.value))}
					/>
				</div>
				<button
					className="p-2 text-base border-2 border-slate-700 rounded-2xl"
					onClick={clickTest}
				>
					Do test
				</button>
				<div className="flex grow justify-center">
					<input
						className="w-1/2"
						type="range"
						step="0.01"
						min="0"
						max="1"
						value={displacement}
						onChange={(e) => setDisplacement(Number(e.target.value))}
					/>
					<input
						className="m-2 p-1 w-14
						bg-gray-500 border-0 rounded-2xl
						focus:outline-none focus:ring-lime-600 focus:border-lime-600 focus:ring-2
						[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
						style={{WebkitAppearance: "none"}}
						type="number"
						step="0.01"
						min="0"
						max="1"
						value={displacement}
						onChange={(e) => setDisplacement(Number(e.target.value))}
					/>
				</div>
			</div>
		</div>
		</>
	);
}

export default App