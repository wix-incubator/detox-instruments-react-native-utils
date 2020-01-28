
import React, {Component} from 'react';
import {AppRegistry, StyleSheet, View, Text, Button} from 'react-native';
import { Event } from 'detox-instruments-react-native-utils';
import AsyncStorage from '@react-native-community/async-storage';

console.disableYellowBox = true;

export default class ReactNativeTesterApp extends Component
{
	constructor(props)
	{
		super(props);
		this.slowJSTimer = null;
		this.slowBridgeTimer = null;
		this.state = {counter: 0};
		this.busyBridgeEvent = null;
    
		setInterval(async () => {
			const eitherWay = () => {
				for(let i = 0; i < 10; i++)
				{
					AsyncStorage.setItem('@username', 'ExampleUser25').then(() => {
						const firstPair = ["@token", "d029f87e3d80f8fd9b1be67c7426b4cc1ff47b4a9d0a8461c826a59d8c5eb6cd"];
						const secondPair = ["@settings", JSON.stringify({"theme":"dark", "timeBeforeLockout":"30", "lastVisitedTopics": ["78923", "234555", "92637", "6627128"]})];
						AsyncStorage.multiSet([firstPair, secondPair]).then(() => {
							AsyncStorage.getAllKeys().then((zzz) => {
								// console.log(zzz);
								AsyncStorage.multiGet(zzz).then((yyy) => {
									AsyncStorage.getItem('Nopenopenope').then(() => {
									});
									// console.log(yyy);
								});
							});
						});
					});
				}
			};
			
			AsyncStorage.clear().then(() => {
				eitherWay();
			}).catch(() => {
				eitherWay();
			});
		}, 1000);
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
			if(this.busyBridgeEvent == null)
			{
				console.log("🚌");
			}
			else
			{
				this.busyBridgeEvent.endInterval(Event.EventStatus.cancelled, "Stopped by user");
			}
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
	
	onNetwork()
	{
		fetch('https://jsonplaceholder.typicode.com/photos')
		.then(function(response)
		{
			return response.json();
		})
		.then(function(myJson)
		{
			let count = 0;
			for(img of myJson)
			{
				fetch(img["thumbnailUrl"])
				.then(function(response) {
					console.log("Got an image");
				});
				count+=1;
				if(count >= 50) { return; }
			}
		});
	}
	
	onTenEvents()
	{
		console.log("Starting 10 events");
		
		let test = new Event("Detox Instruments RN Test App", "Ten Events");
		test.beginInterval("1");
		test.endInterval(Event.EventStatus.completed, "end 1");
		
		test = new Event("Detox Instruments RN Test App", "Ten Events");
		test.beginInterval("2");
		test.endInterval(Event.EventStatus.completed, "end 2");
		
		test = new Event("Detox Instruments RN Test App", "Ten Events");
		test.beginInterval("3");
		test.endInterval(Event.EventStatus.completed, "end 3");
		
		test = new Event("Detox Instruments RN Test App", "Ten Events");
		test.beginInterval("4");
		test.endInterval(Event.EventStatus.completed, "end 4");
		
		test = new Event("Detox Instruments RN Test App", "Ten Events");
		test.beginInterval("5");
		test.endInterval(Event.EventStatus.completed, "end 5");
		
		test = new Event("Detox Instruments RN Test App", "Ten Events");
		test.beginInterval("6");
		test.endInterval(Event.EventStatus.completed, "end 6");
		
		test = new Event("Detox Instruments RN Test App", "Ten Events");
		test.beginInterval("7");
		test.endInterval(Event.EventStatus.completed, "end 7");
		
		test = new Event("Detox Instruments RN Test App", "Ten Events");
		test.beginInterval("8");
		test.endInterval(Event.EventStatus.completed, "end 8");
		
		test = new Event("Detox Instruments RN Test App", "Ten Events");
		test.beginInterval("9");
		test.endInterval(Event.EventStatus.completed, "end 9");
		
		test = new Event("Detox Instruments RN Test App", "Ten Events");
		test.beginInterval("10");
		test.endInterval(Event.EventStatus.completed, "end 10");
	}
	
	render()
	{
		return (
			<View style={styles.container}>
			<Button title="Slow JS Thread"    style={styles.button} onPress={() => this.onSlowJSThread()} />
			<Button title="Busy Bridge"     style={styles.button} onPress={() => this.onBusyBridge()} />
			<Text>Counter: {this.state.counter}</Text>
			<Button title="Network Requests"   style={styles.button} onPress={() => this.onNetwork()} />
			<Button title="10 Events" 			style={styles.button} onPress={() => this.onTenEvents()} />
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

// import MessageQueue from 'react-native/Libraries/BatchedBridge/MessageQueue.js';
//
// const spyFunction = (msg) => {
//   global.nativeLoggingHook(JSON.stringify(msg));
// };
//
// MessageQueue.spy(spyFunction);
