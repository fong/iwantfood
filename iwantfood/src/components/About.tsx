import * as React from "react";

export default class About extends React.Component <{}> {
	
	public render() {
		return (
			<div className="container">
				<div className="centreText">
					{/* React components must have a wrapper node/element */}
					<h1>
						Hello there,
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
						There's now an (web) app for that.
					</p>
					<br/>
					<br/>
					<br/>
					<p>
						Created by Eugene @ <a href="https://tofoo.co" target="_blank">tofoo.co</a>
					</p>
				</div>
			</div>
		);
	}
	
}