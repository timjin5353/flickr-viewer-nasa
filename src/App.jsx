import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Lightbox from 'react-images';
import { find } from 'lodash';

import PhotoCardList from './PhotoCardList.jsx';
import './App.css';

const APIKEY = 'a5e95177da353f58113fd60296e1d250';
const USER_ID = '24662369@N07';
const API = `https://api.flickr.com/services/rest/?method=flickr.people.getPublicPhotos&api_key=${APIKEY}&user_id=${USER_ID}&format=json&nojsoncallback=1`;

/* eslint-disable */

/**
 * Calculate and return top off set.
 */
const calculateTopOffSet = () => {
	if(window.innerWidth > 862) {
		return 140;
	} 
	else if(window.innerWidth > 383) {
		return 215;
	} else {
		return 275;
   }
};

/**
 * Calculate and return width percentage.
 */
const calculateWidthPercentage = () => {
	if(window.innerWidth <= 511) {
		return 95;
	} else return 80;
}

const largePhotoStyle = {
	position: 'relative',
	width: '85%',
	maxWidth: 'none'
};

/**
 * This is a photo card list viewer component.
 */
class App extends Component {
	/**
	 * Constructor.
	 */
	constructor(props) {
		super(props);

		this.state = {
			photos: [],
			sortOrder: 'asc',
			sortTerm: 'title',
			filterTerm: '',
			offSetToTop: calculateTopOffSet(),
			widthPercentage: calculateWidthPercentage(),
			urlLarge: '',
			showPinner: true,
		};

		this.handleWindowResize = this.handleWindowResize.bind(this);
		this.handleFilterChange = this.handleFilterChange.bind(this);
		this.handleSortTermChange = this.handleSortTermChange.bind(this);
		this.handleSortOrderChange = this.handleSortOrderChange.bind(this);
		this.showLargeImage = this.showLargeImage.bind(this);
	}

	/**
	 * Called after componet is mounted to DOM.
	 */
	componentDidMount() {
		this.fetchData();
		window.addEventListener('resize', this.handleWindowResize);
	}

	/**
	 * Called when window is resized.
	 */
	handleWindowResize() {
		this.setState({
			...this.state,
			offSetToTop: calculateTopOffSet(),
			widthPercentage: calculateWidthPercentage(),
		});
	}

	/**
	 * Fetches data from NASA via flickr API.
	 */
	fetchData() {
		let photos = [];

		fetch(API)
			.then((response) => {
				if (response.status !== 200) {
					alert(`There is problem while fetching data, please try again. ${response.status}`);
					return;
				}

				response.json().then((data) => {
					photos = data.photos.photo.map((x) => ({
						...x,
						urlDefault: `https://farm${x.farm}.staticflickr.com/${x.server}/${x.id}_${x.secret}.jpg`,
						urlLarge: `https://farm${x.farm}.staticflickr.com/${x.server}/${x.id}_${x.secret}_b.jpg`,
					}));

					this.setState({
						photos,
						showPinner: false,
					});
				});
			})
			.catch((err) => {
				alert(`There is problem while fetching data, please try again. ${err}`);
			});
	}

	/**
	 * Handles when there is change in the filter input..
	 */
	handleFilterChange(e, newValue) {
		if (newValue !== this.state.filterTerm) {
			this.setState({
				...this.state,
				filterTerm: newValue,
			});
		}
	}

	/**
	 * Handles when there is change in the sort term drop down.
	 */
	handleSortTermChange = (event, index, value) => this.setState({ ...this.state, sortTerm: value });

	/**
	 * Handles when there is change in the sort order drop down.
	 */
	handleSortOrderChange = (event, index, value) => this.setState({ ...this.state, sortOrder: value });

	/**
	 * Handles when a photo is clicked, shows a large photo.
	 */
	showLargeImage = (urlLarge, urlDefault, id) => {
		const sizeAPI = `https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=${APIKEY}&photo_id=${id}&format=json&nojsoncallback=1`;

		fetch(sizeAPI)
			.then((response) => {
				if (response.status !== 200) {
					alert(`There is problem while fetching data, please try again. ${response.status}`);
					return;
				}

				response.json().then((data) => {
					if(find(data.sizes.size, x => x.label === 'Large')) {
						this.setState({
							...this.state,
							urlLarge,
						});
					} else {
						this.setState({
							...this.state,
							urlLarge: urlDefault,
						});
					};
				});
			})
			.catch((err) => {
				alert(`There is problem while fetching data, please try again. ${err}`);
			});
	}

	/**
	 * Renders component.
	 */
	render() {
		return (
			<MuiThemeProvider>
				<div id="App">
					<div id="AppBar">
						<AppBar
						title="NASA Flickr Photos"
						showMenuIconButton={false}
						/>
					</div>
					<Lightbox
						images={[{ src: this.state.urlLarge }]}
						isOpen={this.state.urlLarge !== ''}
						onClose={() => this.setState({...this.state, urlLarge: ''})}
						showImageCount={false}
					/>
					<div id="PhotoList">
						<PhotoCardList
							photos={this.state.photos}
							handleFilterChange={this.handleFilterChange}
							handleSortTermChange={this.handleSortTermChange}
							handleSortOrderChange={this.handleSortOrderChange}
							sortTerm={this.state.sortTerm}
							sortOrder={this.state.sortOrder}
							filterTerm={this.state.filterTerm}
							offSetToTop={this.state.offSetToTop}
							widthPercentage={this.state.widthPercentage}
							showLargeImage={this.showLargeImage}
						/>
					</div>
				</div>
			</MuiThemeProvider>
		);
  	}
}

export default App;
