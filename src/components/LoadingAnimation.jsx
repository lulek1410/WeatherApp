import "@/styles/Loading.scss";

function LoadingAnimation(props) {
	const { circleRadius = 15 } = props;
	return (
		<>
			<svg width={circleRadius * 8 + 3 * 5} height={circleRadius * 2}>
				<circle
					id="loading-dots"
					cx={circleRadius}
					cy={circleRadius}
					r={circleRadius}
				/>
				<circle
					id="loading-dots"
					cx={3 * circleRadius + 5}
					cy={circleRadius}
					r={circleRadius}
				/>
				<circle
					id="loading-dots"
					cx={5 * circleRadius + 10}
					cy={circleRadius}
					r={circleRadius}
				/>
				<circle
					id="loading-dots"
					cx={7 * circleRadius + 15}
					cy={circleRadius}
					r={circleRadius}
				/>
			</svg>
		</>
	);
}

export default LoadingAnimation;
