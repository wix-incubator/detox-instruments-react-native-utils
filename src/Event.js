let __dtx_queuedEvents = new Array();
let __dtx_queuedEventsConsumer = null;

function __dtx_randomString()
{
	let N = 32;
	return Array(N+1).join((Math.random().toString(36)+'00000000000000000').slice(2, 18)).slice(0, N)
}

let __dtx_currentRandomString = __dtx_randomString();
let __dtx_identifierCounter = 0;

function __dtx_generateEventId()
{
	let x = (__dtx_identifierCounter += 1);
	if(x > 100000000)
	{
		//After a certain threshold, reset the random string.
		__dtx_currentRandomString = __dtx_randomString();
		__dtx_identifierCounter = 0;
		x = 1;
	}
	
	return __dtx_currentRandomString + "_" + x;
}

function __dtx_handleEvents() {
	if(__dtx_queuedEvents.length === 0)
	{
		clearInterval(__dtx_queuedEventsConsumer);
		__dtx_queuedEventsConsumer = null;
		
		return;
	}
	
	global.__dtx_markEventBatch_v1(__dtx_queuedEvents);
	__dtx_queuedEvents = new Array();
}

function __dtx_startQueuedEventsConsumerIfNeeded()
{
	if(__dtx_queuedEventsConsumer !== null)
	{
		return;
	}
	
	__dtx_queuedEventsConsumer = setInterval(__dtx_handleEvents, 500);
}

function __dtx_enqueueEventSample(sampleType, identifier, sampleParams)
{
	__dtx_queuedEvents.push({
							"type": sampleType,
							"identifier": identifier,
							"timestamp": Date.now(),
							"params": sampleParams
							});
	
	__dtx_startQueuedEventsConsumerIfNeeded();
}

export default class Event
{
	constructor(category, name)
	{
		this.category = category;
		this.name = name;
		this._began = false;
		this._ended = false;
		this._identifier = __dtx_generateEventId();
	}
	
	beginInterval(additionalInfo)
	{
		//Global hook is not installed.
		if(global.__dtx_markEventBatch_v1 === undefined) { return; }
		
		//Already began the interval.
		if(this._began === true) { return; }
		
		this._began = true;

		__dtx_enqueueEventSample(0, this._identifier, { "0": this.category, "1": this.name, "2": additionalInfo });
	}
	
	endInterval(eventStatus, additionalInfo)
	{
		//Global hook is not installed.
		if(global.__dtx_markEventBatch_v1 === undefined) { return; }
		
		//Already ended the interval.
		if(this._ended === true) { return; }
		
		if(this._began !== true)
		{
			throw "The interval has not been started. Did you forget to call beginInterval()?";
		}
		
		this._ended = true;
		
		__dtx_enqueueEventSample(1, this._identifier, arguments);
//		global.dtxMarkEventIntervalEnd(this._internalIdentifiersData, eventStatus, additionalInfo);
	}
	
	static event(category, name, eventStatus, additionalInfo)
	{
		if(global.__dtx_markEventBatch_v1 === undefined) { return; }
		
		__dtx_enqueueEventSample(10, __dtx_generateEventId(), arguments);
		
//		global.dtxMarkEvent(category, name, eventStatus, additionalInfo);
	}
}

Event.EventStatus =
{
	completed: 0,
	error: 1,
	category1: 2,
	category2: 3,
	category3: 4,
	category4: 5,
	category5: 6,
	category6: 7,
	category7: 8,
	category8: 9,
	category9: 10,
	category10: 11,
	category11: 12,
	category12: 13,
};

