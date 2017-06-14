
var newEraWeb = function() {
	
	var languageResource = getLanguageResource();	
	var languageSetting = "en_us";
	var sRes = languageResource.en_us;
	var browser = getBrowser();	
	
	this.module = {};
	
	
	this.loadModel = function(moduleName) {
		switch(moduleName) {			
			case "voiceRecognition": {
				if(browser.name != "Chrome") {
					console.log(sRes.notSupport);
				}
				
				this.module.voiceRecognition = initNewEraWebVoiceRecognition();							
				
				return;
			}
			default: {
				break;
			}
		}		
	}	
	
	this.loadScript = function loadScript(url) {
		document.body.appendChild(document.createElement("script")).src = url;
	}
	
	this.setLanguage = function(language) {
		if(language in languageResource) {
			sRes = languageResource[language];
			languageSetting = language;
			return true;
		} 
		return false;
	}

	function getLanguageResource() {
		var languageResource = {
			en_us : {
				notSupport : 'Your browser doesn\'t support this function!'
			},
			zh_tw : {
				notSupport : "您的瀏覽器不支援此功能！"
			}
		}
		return languageResource;
	}
	
	function getBrowser() {
		var ua=navigator.userAgent,tem,M=ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || []; 
		if(/trident/i.test(M[1])){
			tem=/\brv[ :]+(\d+)/g.exec(ua) || []; 
			return {name:'IE',version:(tem[1]||'')};
			}   
		if(M[1]==='Chrome'){
			tem=ua.match(/\bOPR|Edge\/(\d+)/)
			if(tem!=null)   {return {name:'Opera', version:tem[1]};}
			}   
		M=M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
		if((tem=ua.match(/version\/(\d+)/i))!=null) {M.splice(1,1,tem[1]);}
		return {
		  name: M[0],
		  version: M[1]
		};
	}
	
	var NewEraWebVoiceRecognition = function () {
		var self = this;
		this.voiceRecognition = true;
		var voiceRecognitionTargetList = [];
		
		var recognition = new webkitSpeechRecognition();
		
		this.addVoiceRecognitionListener = function(targetWord, callback) {			
			console.log(callback);
			if(targetWord == null) {
				console.log('targetWord is null!');
			}
			if(targetWord in voiceRecognitionTargetList) {
				voiceRecognitionTargetList[targetWord].push(new voiceRecognitionTarget(targetWord, callback));
			} else {
				voiceRecognitionTargetList[targetWord] = [new voiceRecognitionTarget(targetWord, callback)];
			}
		}							
		
		this.startVoiceRecognition = function() {
			recognition.continuous = true;
			recognition.interimResults = false;
			switch(languageSetting) {
				case 'zh_tw': {
					recognition.lang="cmn-Hant-TW";
					break;
				}
				case 'en_us': {
					recognition.lang="en-US";
					break;
				}
			}

			recognition.onstart=function(){
				console.log('開始辨識');
			};
			recognition.onend=function(){
				console.log('停止辨識');
				self.startVoiceRecognition();
			};

			recognition.onresult=function(event){
				var i = event.resultIndex;
				var j = event.results[i].length-1;
				console.log(event.results[i][j].transcript);				
				if(event.results[i][j].transcript in voiceRecognitionTargetList) {
					for(var voiceRecognitionTargetIndex in voiceRecognitionTargetList[event.results[i][j].transcript]) {					
						voiceRecognitionTargetList[event.results[i][j].transcript][voiceRecognitionTargetIndex].targetFunction();
					}
				}				
			};

			recognition.start();
		}		
	}		
	
	
	
	function initNewEraWebVoiceRecognition() {				
		return new NewEraWebVoiceRecognition;
	}
}

var voiceRecognitionTarget = function(targetName, targetFunction) {
	this.targetName = targetName;
	this.targetFunction = targetFunction;
}




