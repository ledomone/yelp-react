import React, { PropTypes as T } from 'react'
import classnames from 'classnames'
import Map, { Marker } from 'google-maps-react'

import styles from './styles.module.css'

export class MapComponent extends React.Component {
	renderChildren() {
		const {children} = this.props;
	}
	renderMarkers() {
		if (!this.props.places) { return null; }
		return this.props.places.map(place => {
			return (
				<Marker key={place.id}
					name={place.id}
					place={place}
					position={place.geometry.location}
				/>
			)
		})
	}
	render() {
		return (
			<Map google={this.props.google}
				className={styles.map}>
				{this.renderChildren()}
			</Map>
		)
	}
}

export default MapComponent
