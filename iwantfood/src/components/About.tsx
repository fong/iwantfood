import * as React from "react";

export default class AboutComponent extends React.Component <{}> {
	
	public render() {
		return (
			<div className="container">
				<div className="centreText">
					{/* React components must have a wrapper node/element */}
					<h1>
						Hi.
					</h1>
					<h3>
						I made this because I was hungry.
					</h3>
					<p>
						And I couldn't decide where to go.
					</p>
					<p>
						So here it is.
					</p>
					<p>
						There's an app for that.
					</p>
				</div>
			</div>
		);
	}
	
}