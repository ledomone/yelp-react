import React, { PropTypes as T } from 'react'
import Map, {GoogleApiWrapper} from 'google-maps-react'
import {searchNearby} from 'utils/googleApiHelpers'

// our webpack alias allows us to reference `components`
// relatively to the src/ directory
import Header from 'components/Header/Header'
import Sidebar from 'components/Sidebar/Sidebar'

import styles from './styles.module.css'

export class Container extends React.Component {
	constructor(props, context) {
		super(props, context);

		this.state = {
			places: [],
			pagination: null
		}
	}

	onReady(mapProps, map) {
		const {google} = this.props;
		const opts = {
			location: map.center,
			radius: '500',
			types: ['cafe']
		}
		searchNearby(google, map, opts)
			.then((results, pagination) => {
				// We got some results and a pagination object
				this.setState({
					places: results,
					pagination
				});
			}).catch((status, result) => {
				// There was an error
				console.log('error fetching nearby', status)
			});
	}

	onMapMove() {}

	onMarkerClick(item) {
		const {push} = this.context.router;
		const {place} = item; // place prop
		push(`/map/detail/${place.place_id}`);
	}

	render() {
		let children = null;
		if (this.props.children) {
			// We have children in the Container component
			children = React.cloneElement(
				this.props.children,
				{
					google: this.props.google,
					places: this.state.places,
					loaded: this.props.loaded,
					router: this.props.router,
					onMove: this.onMapMove.bind(this),
					onMarkerClick: this.onMarkerClick.bind(this),
					zoom: this.props.zoom
				}
			);
		}
		return (
			<Map
				onReady={this.onReady.bind(this)}
				google={this.props.google}
				visible={false}
				className={styles.wrapper}>

				<Header />

				<Sidebar
					title={'Restaurants'}
					onListItemClick={this.onMarkerClick.bind(this)}
					places={this.state.places} />

				<div className={styles.content}>
					{/* Setting children routes to be rendered */}
					{children}
				</div>

			</Map>
		)
	}
}

Container.contextTypes = {
	router: T.object
}

export default GoogleApiWrapper({
	apiKey: __GAPI_KEY__
})(Container)
