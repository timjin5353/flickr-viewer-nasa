import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import { sortBy } from 'lodash';

import PhotoCard from './PhotoCard.jsx';

/**
 * This is a photo card list component.
 */
class PhotoCardList extends Component {
	/**
     * Constructor.
     */
	constructor(props) {
		super(props);

		this.state = {
			photos: [],
		};
	}

	/**
     * Called upon component reveive props.
     */
	componentWillReceiveProps(nextProps) {
		let displayPhotos = [];

		// Sort photos if needed.
		if (nextProps.sortTerm && nextProps.sortTerm === 'title') {
			displayPhotos = sortBy(nextProps.photos, ['title']);
		} else if (nextProps.sortTerm && nextProps.sortTerm === 'id') {
			displayPhotos = sortBy(nextProps.photos, ['id']);
		} else displayPhotos = nextProps.photos.map((x) => x);

		if (nextProps.sortOrder === 'dsc') {
			displayPhotos.reverse();
		}

		// Filter photos if needed.
		if (nextProps.filterTerm && nextProps.filterTerm !== '') {
			displayPhotos = displayPhotos.filter((x) => (
				x.id.toUpperCase().includes(nextProps.filterTerm.toUpperCase())
                || x.title.toUpperCase().includes(nextProps.filterTerm.toUpperCase())
			));
		}

		this.setState({
			photos: displayPhotos,
		});
	}

	/**
     * Render method.
     */
	render() {
		// Array of photo cards.
		const photoCards = this.state.photos.map((photo) => (
			<PhotoCard
				id={photo.id}
				title={photo.title}
				urlDefault={photo.urlDefault}
				urlLarge={photo.urlLarge}
				key={photo.id}
				showLargeImage={this.props.showLargeImage}
			/>));

		// Photo cardlist style object.
		const photoCardListStyle = {
			top: this.props.offSetToTop,
			width: `${this.props.widthPercentage}%`,
		};

		// Toolbar style object.
		const toolBarStyle = {
			width: `${this.props.widthPercentage}%`,
			left: `${(100 - this.props.widthPercentage) / 2}%`,
		};

		return (
			<div>
				<div id="ToolBar" style={toolBarStyle}>
					<div id="Filter">
						<TextField
							hintText="Filter photos by ID or title."
							floatingLabelText="Filter"
							floatingLabelFixed
							onChange={this.props.handleFilterChange}
						/>
					</div>
					<div id="Sort">
						<DropDownMenu
							value={this.props.sortTerm}
							onChange={this.props.handleSortTermChange}
						>
							<MenuItem value="id" label="Sort by ID" primaryText="ID" />
							<MenuItem value="title" label="Sort by Title" primaryText="Title" />
						</DropDownMenu>
						<DropDownMenu
							value={this.props.sortOrder}
							onChange={this.props.handleSortOrderChange}
						>
							<MenuItem value="asc" label="Asc Order" primaryText="ASC" />
							<MenuItem value="dsc" label="Dsc Order" primaryText="DSC" />
						</DropDownMenu>
					</div>
				</div>
				<div className="PhotoCardList" style={photoCardListStyle}>
					{ photoCards }
				</div>
			</div>
		);
	}
}

export default PhotoCardList;

