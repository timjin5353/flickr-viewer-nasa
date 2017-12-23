import React from 'react';
import { Card, CardMedia } from 'material-ui/Card';

/**
 * This is a photo card component.
 */
const PhotoCard = ({ id, title, urlDefault, urlLarge, showLargeImage }) => {
	/**
 	 * This is a photo card component.
	 */
	const handleShowLargeImage = () => {
		showLargeImage(urlLarge, urlDefault, id);
	};

	return (
		<div className="PhotoCard">
			<Card onClick={handleShowLargeImage}>
				<CardMedia>
					<img src={urlDefault} alt="NASA" />
				</CardMedia>
			</Card>
			<div className="PhotoID">
				<span>ID: {id}</span>
			</div>
			<div className="PhotoTitle">
				<span>Title: {title}</span>
			</div>
		</div>
	);
};

export default PhotoCard;
