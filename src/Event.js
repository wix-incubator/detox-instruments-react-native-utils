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
	return __dtx_currentRandomString + "_" + (__dtx_identifierCounter += 1);
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
	}
	
	static event(category, name, eventStatus, additionalInfo)
	{
		if(global.__dtx_markEventBatch_v1 === undefined) { return; }
		
		__dtx_enqueueEventSample(10, __dtx_generateEventId(), arguments);
	}
}

Event.EventStatus =
{
	completed: 0,
	error: 1,
	cancelled: 2
};

function __dtx_generateTimerEventId(timerId)
{
	return __dtx_currentRandomString + "_timer_" + timerId;
}

let __dtx_origSetTimeout = setTimeout;
let __dtx_origClearTimeout = clearTimeout;

if(global.__dtx_getEventsSettings_v1)
{
	const eventsSettings = global.__dtx_getEventsSettings_v1();
	if(eventsSettings.captureTimers === true)
	{
		setTimeout = (func, timeout) => {
			let eventIdenfitier;
			let rv = __dtx_origSetTimeout(() => {
										  __dtx_enqueueEventSample(1, eventIdenfitier, { "0": Event.EventStatus.completed });
										  func();
										  }, timeout);
			eventIdenfitier = __dtx_generateTimerEventId(rv);
			
			__dtx_enqueueEventSample(0, eventIdenfitier, { "0": "Timers" , "1": "JavaScript Timer", "2": "Timer " + rv, "3": true, "4": new Error().stack });
			
			return rv;
		};
		
		clearTimeout = (identifier) => {
			__dtx_origClearTimeout(identifier);
			let eventIdenfitier = __dtx_generateTimerEventId(identifier);
			__dtx_enqueueEventSample(1, eventIdenfitier, { "0": Event.EventStatus.cancelled });
		};
	}
}
