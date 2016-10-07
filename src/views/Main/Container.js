import React from 'react'
import Map, {GoogleApiWrapper} from 'google-maps-react'
import {searchNearby} from 'utils/googleApiHelpers'

// our webpack alias allows us to reference `components`
// relatively to the src/ directory
import Header from 'components/Header/Header'

import styles from './styles.module.css'

export class Container extends React.Component {
	constructor(props) {
		super(props);

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
			});
	}
	render() {
		return (
			<div>
				Hello from the container (other side ;-) )
				<Map
					onReady={this.onReady.bind(this)}
					google={this.props.google}
					visible={false}
					className={styles.wrapper}>

					<Header />
					<div className={styles.content}>
						{this.state.places.map(place => {
							return (<div key={place.id}>{place.name}</div>)
						})}
					</div>
				</Map>
			</div>
		)
	}
}

export default GoogleApiWrapper({
	apiKey: __GAPI_KEY__
})(Container)
