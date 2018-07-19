
import React, {Component} from 'react';
import {AppRegistry, StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import { Event } from 'detox-instruments-react-native-utils';

class ReactNativeTesterApp extends Component
{
	constructor(props)
	{
		super(props);
		this.slowJSTimer = null;
		this.slowBridgeTimer = null;
		this.state = {counter: 0};
		this.busyBridgeEvent = null;
	}
	
	_performTask()
	{
		let counter = 0;
		for(let i = 0; i < Math.pow(2, 25); i++)
		{
			counter++;
		}
	}
	
	_startSlowJSTimer()
	{
		console.log("Slowing CPU!");
		let test = new Event("Detox Instruments RN Test App", "Slow CPU");
		test.beginInterval("More info 1");
		this._performTask();
		test.endInterval(Event.EventStatus.completed, "More info 2");
		this.slowJSTimer = setTimeout(() => {
									  this._startSlowJSTimer();
									  }, 3500);
	}
	
	_startBusyBridgeTimer()
	{
		if(this.busyBridgeEvent == null)
		{
			this.busyBridgeEvent = new Event("Detox Instruments RN Test App", "Busy Bridge");
			this.busyBridgeEvent.beginInterval("Starting busy bridge");
		}
		
		if(this.state.counter == 200)
		{
			this.busyBridgeEvent.endInterval(Event.EventStatus.completed, "Finished 200 iterations");
			this.busyBridgeEvent = null;
			this.clearBusyBridgeTimeout();
			return;
		}
		
		this.setState({counter: this.state.counter + 1}, () => {
					  Event.event("Detox Instruments RN Test App", "Busy Bridge", (this.state.counter % 12) + 2, "Completed iteration");
					  this.slowBridgeTimer = setTimeout(() => {
														this._startBusyBridgeTimer();
														}, 30);
					  });
	}
	
	onSlowJSThread()
	{
		if(this.slowJSTimer)
		{
			this.busyBridgeEvent.endInterval(Event.EventStatus.error, "Stopped by user");
			clearTimeout(this.slowJSTimer);
			this.slowJSTimer = null;
		}
		else
		{
			this._startSlowJSTimer();
		}
	}
	
	clearBusyBridgeTimeout()
	{
		clearTimeout(this.slowBridgeTimer);
		this.slowBridgeTimer = null;
	}
	
	onBusyBridge()
	{
		if(this.slowBridgeTimer)
		{
			this.clearBusyBridgeTimeout();
		}
		else
		{
			this.setState({counter: 0}, () => {
						  this._startBusyBridgeTimer();
						  });
		}
	}
	
	render()
	{
		return (
				<View style={styles.container}>
				<TouchableOpacity style={styles.button} onPress={() => this.onSlowJSThread()}>
				<Text style={styles.buttonText}>Slow JS Thread</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.button} onPress={() => this.onBusyBridge()}>
				<Text style={styles.buttonText}>Busy Bridge</Text>
				</TouchableOpacity>
				<Text>Counter: {this.state.counter}</Text>
				</View>
				);
	}
}

const styles = StyleSheet.create({
								 container: {
								 flex: 1,
								 justifyContent: 'center',
								 alignItems: 'center',
								 backgroundColor: '#F5FCFF',
								 },
								 button: {
								 height: 40,
								 justifyContent: 'center'
								 },
								 buttonText: {
								 fontSize: 20,
								 textAlign: 'center',
								 margin: 10,
								 },
								 });

AppRegistry.registerComponent('ReactNativeTesterApp', () => ReactNativeTesterApp);

//import MessageQueue from 'react-native/Libraries/BatchedBridge/MessageQueue.js';
//
//const spyFunction = (msg) => {
//	global.nativeLoggingHook(JSON.stringify(msg));
//};
//
//MessageQueue.spy(spyFunction);
