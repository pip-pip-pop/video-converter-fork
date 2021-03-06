//variables
const { createFFmpeg } = FFmpeg;
var ffmpeg;
load_ffmpeg();
var ActualSourceurl;
var videoSource=document.createElement('video');
videoSource.setAttribute("type","video/mp4")
var sourceBuffer;
var fields=document.getElementsByName("field");
var Filename=document.querySelector('.VideoTitle');
var Spinner=document.querySelector('.Spinner');
var DownloadBox=document.querySelector('.DownloadBox');
var LandingPage=document.querySelector('.Landing');
var LoadingText=document.querySelector('.LoadingText');
const link = document.querySelector(".DownloadLink");
const Workspace=document.querySelector('.Workspace');
const UploadButton=document.querySelector('.Button');
var LandingText=document.querySelector('.Landingtext');
var QrangeValue=document.getElementById('QrangeValue');
var timeFrameforGif=document.querySelector('.TimeFrameHolder');
var ProgressBar=document.querySelector('.ProgressBar');
var videoTime=0
  
var inCompress=false
var CancelProgressOverlay=document.getElementById("OverlayCancel")
var Show_or_Hide_CancelProgressOverlay=(params)=>{
  if(params=="open")
  {
    CancelProgressOverlay.style.display="inherit";
    return
  }
  else if(params=="Yes")
  {
    location.reload();
    return
  }
  else if(params=="No"){
    CancelProgressOverlay.style.display="none";
    return
  }
 
}
console.stdlog = console.log.bind(console);  
console.log = function(){
 
    let consoleLog=Array.from(arguments);
    
    let CurrentTime=null;
    if(consoleLog[0].indexOf("time=")!=-1)
    {
      CurrentTime=consoleLog[0].slice(consoleLog[0].indexOf("time="),consoleLog[0].indexOf("time=")+ consoleLog[0].substring(consoleLog[0].indexOf("time=")).indexOf("bitrate="));
    }
      ProgressBar.style.width="0%";
    if(consoleLog[0].indexOf("inputCompress")!=-1)
      inCompress=true
    if(CurrentTime!=null){
      let a=CurrentTime.slice(5,CurrentTime.length).split(':');
      var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
      var percentage=seconds/videoTime*100;
      ProgressBar.style.width=percentage+"%";
      LandingText.innerHTML=`<span>${percentage>0?percentage.toFixed(0):0}% </span>`;
      
    }
    
}

var CurrentURL=window.location.href;

var Feature=CurrentURL.slice(CurrentURL.lastIndexOf('/')+1,CurrentURL.length);
var FeatureParameters=Feature.split('-');
var InputFormat=FeatureParameters[1];
document.getElementById("ButtonLabel").innerText=`Upload ${InputFormat}`;
LandingText.innerText=`or drop your ${InputFormat} file here`;
var OutputFormat=FeatureParameters[3];
if(OutputFormat==="gif"){
  isgif=true;
  timeFrameforGif.style.display="inherit";
  console.log("is gif")

}
var Settings={Oformat:OutputFormat}
var isgif=false;
var rateInputs=document.querySelectorAll('.rateInput');
var bitrateInput=rateInputs[0];
var framerateInput=rateInputs[1];
const SettingsData={
  
}
var FeatureElements={}
var featureValues=document.querySelectorAll('.FeatureValue');
var sliderSwitches=document.querySelectorAll('.sliderSwitch');
var Togglers=document.querySelectorAll('.Toggler');
var previousToggler=Togglers[0];
var TogglerSettings={
  "videoTogglerSettings":document.querySelector('#videoTogglerSettings'),
  "audioTogglerSettings":document.querySelector('#audioTogglerSettings'),
  "compressionTogglerSettings":document.querySelector('#compressionTogglerSettings')
}


const Number_of_Cores=()=>{
  var logicalProcessors = window.navigator.hardwareConcurrency;
  return logicalProcessors;
}

videoSource.addEventListener('loadeddata',(e)=>{
  videoTime=e.path[0].duration;
  LandingPage.style.height="90vh";
  Spinner.style.display="none";
  Workspace.style.display="inherit";
})

var showTogglerSettings=(CurrentToggler)=>{


  TogglerSettings[CurrentToggler+"Settings"].style.display="inherit";

}

var switchToggler=(e)=>{
  let Id=e.target.id;
  if(previousToggler)
  {
    previousToggler.classList.remove("ActiveToggler");
    TogglerSettings[previousToggler.id+"Settings"].style.display="none";
    previousToggler=e.target;
  }
  e.target.classList.add("ActiveToggler");
  showTogglerSettings(Id);

}
Togglers.forEach(toggler=>{
  toggler.addEventListener('click',switchToggler);
})

const ChangeHandler=async (e)=>{
  let Id=e.id;
  let value=e.value;
  Id=="Qrange"?QrangeValue.innerText=value:null;
  Settings[Id]=value;
  console.log(Settings);
}

var previousSelectedFeatureValue={}

const FeatureValueClickHandler=(e)=>{
  var FeatureId=e.target.parentElement.id;
  let value=e.target.innerText;
  if(FeatureId==="bitrate"||FeatureId==="framerate")
  {
    if(value==="custom")
    {
      if(FeatureId==="bitrate") bitrateInput.style.display="inherit";
      if(FeatureId==="framerate") framerateInput.style.display="inherit";
    }
    else{
      if(FeatureId==="bitrate") bitrateInput.style.display="none";
      if(FeatureId==="framerate") framerateInput.style.display="none";
    }
  }
  if(!previousSelectedFeatureValue[FeatureId])
  {
    // console.log(e.target.parentElement.children.item(1))
    e.target.parentElement.children.item(1).classList.remove('ActiveFeature');
  }
  if(previousSelectedFeatureValue[FeatureId])
  {
    previousSelectedFeatureValue[FeatureId].classList.remove('ActiveFeature');
  }
  // else if(FeatureId==="Oformat"&&value!=="GIF")
  // {isgif=false;
  //   timeFrameforGif.style.display="none";
  // }
  Settings[FeatureId]=value;
  previousSelectedFeatureValue[FeatureId]=e.target;
  previousSelectedFeatureValue[FeatureId].classList.add('ActiveFeature');


  
}

const sliderSwitchClickHandler=(e)=>{
  let checkedValue=e.target.previousSibling.previousSibling.checked;
  e.target.previousSibling.previousSibling.checked=!checkedValue;
  Settings[e.target.id]=!checkedValue;

}

for(let index=0;index <sliderSwitches.length;++index)
{
  sliderSwitches[index].addEventListener('click',sliderSwitchClickHandler,false);
}
for(let index=0;index <featureValues.length;++index)
{
  featureValues[index].addEventListener('click',FeatureValueClickHandler,false);
}

//loading ffmpeg
async function load_ffmpeg(){
    ffmpeg = await createFFmpeg({log: true });
    await ffmpeg.load();

}

var cancelButton=document.getElementById("CancelProcess");
const get_video_source_from_input=async(input)=>{
    UploadButton.style.display="none";
    LandingText.style.display="none";
    Spinner.style.display="inherit";
    var VideoSourceFile=input.files[0];
    Filename.innerText=input.files[0].name;
    const reader = new FileReader();
    reader.readAsDataURL(VideoSourceFile);
    reader.addEventListener("load", async function () {
    videoSource.src=reader.result;
    ActualSourceurl=reader.result;
    sourceBuffer= await fetch(ActualSourceurl).then(r => r.arrayBuffer()); 
    }, false);
    

}

const Actual_API_Function=async ()=>{
  Workspace.style.display="none";
  LandingPage.style.height="300px";
  LandingText.style.display="inherit";
  Settings.OnlyAudio?LandingText.innerText="Please wait, Extracting the audio":LandingText.innerText="Please wait, Re-encoding the video";
  LoadingText.style.display="inherit";
  cancelButton.style.display="inherit";
  ffmpeg.FS(
    "writeFile",
    `input.${InputFormat}`,
    new Uint8Array(sourceBuffer, 0, sourceBuffer.byteLength)
    );  
    //for gif
    var startTime="00:00:00";
    var endTime="00:00:04";
    if(isgif)
    {
      let Arguments=Settings.timeFrame.split(" ");
      if(Arguments.length==3)
      {
      startTime=Arguments[0];
      endTime=Arguments[2];
      }
    }

    //change video encoder
    var ish264=false;
    if(Settings.Vencoder==="H.264"||Settings.Oformat==="FLV"){ish264=true;Settings.Vencoder="libx264";}
    else if(Settings.Vencoder==="MPEG4")Settings.Vencoder=Settings.Vencoder.toLowerCase();
    //change video resolution
    Settings.resolution?Settings.resolution=Settings.resolution.slice(0,Settings.resolution.indexOf('p')):null;
    //change audio encoder
    if(Settings.Aencoder==="AAC")Settings.Aencoder=Settings.Aencoder.toLowerCase();
    else if(Settings.Aencoder==="MP3")Settings.Aencoder="libmp3lame";
    //settings output format
    Settings.Oformat?Settings.Oformat=Settings.Oformat.toLowerCase():Settings.Oformat='mp4';
    //video bitrate
    Settings.bitrate?Settings.bitrate=Settings.bitrate.toUpperCase():null;
    //assign number of threads
    var ThreadsCount=(Number_of_Cores())*4;
    //set video playback speed
    var playbackSpeed=(Settings.playback && Settings.playback!=="default")?parseFloat(Settings.playback.slice(0,Settings.playback.indexOf('x'))).toFixed(2):1.0;
    
    (Settings.playback && Settings.playback!=="default")?Settings.playback=parseFloat(1/Settings.playback.slice(0,Settings.playback.indexOf('x'))).toFixed(2):Settings.playback=1;
    Settings.OnlyAudio?Settings.Oformat='mp3':null;
    (Settings.OnlyAudio && Settings.Aencoder==="aac")?Settings.Oformat='aac':null;
    
    //set command
    if(Settings.Oformat!=="gif") var allinOneCommand=Settings.OnlyAudio?`-i input.${InputFormat} -filter:a atempo=${playbackSpeed} -map 0:a${(Settings.Aencoder&&Settings.Aencoder!=="default")?` -c:a ${Settings.Aencoder}`:''} ${(ThreadsCount>16)?`-threads 16`:`-threads ${ThreadsCount}`} -vn${(Settings.Aquality&&Settings.Aquality!=="default")?` -b:a ${Settings.Aquality}`:''} output.${Settings.Oformat}`:`-itsscale ${Settings.playback} -i input.${InputFormat}${Settings.size?` -fs ${Settings.size}M`:''} ${(Settings.Vencoder&&Settings.Vencoder!=="default")?`-c:v ${Settings.Vencoder}`:'-c:v mpeg4'} -crf ${Settings.Qrange?Settings.Qrange:25} ${(ThreadsCount>=16)?`${ish264?"-threads 10":"-threads 16"}`:`${(ThreadsCount>10 && ish264)?`-threads 10`:`-threads ${ThreadsCount}`}`}${Settings.bitrate?` -b:v ${Settings.bitrate}`:''}${Settings.framerate?` -r ${Settings.framerate}`:''} -preset ${Settings.speed?Settings.speed:'ultrafast'} -c:a ${(Settings.Aencoder&&Settings.Aencoder!=="default")?Settings.Aencoder:'copy'}${(Settings.Aquality&&Settings.Aquality!=="default")?` -b:a ${Settings.Aquality}`:''}${Settings.RAudio?` -an `:''}${(Settings.resolution&&Settings.resolution!=="default")?` -vf scale=-2:${Settings.resolution},format=yuv420p`:''} output.${Settings.Oformat}`;
    else var allinOneCommand=`-t ${endTime} -ss ${startTime} -i input.${InputFormat} -r 15 ${(ThreadsCount>16)?`-threads 16`:`-threads ${ThreadsCount}`} output.gif`  
    
    //run command
    var ArrayofInstructions=allinOneCommand.split(' ');
    await ffmpeg.run(...ArrayofInstructions);
    
    
    //start download
    cancelButton.style.display="none";
    LandingText.style.display="none";
    initateDownload();
    
    // your video is 10 minutes (600 seconds) long and an output of 50 MB is desired. Since bitrate = file size / duration:

    // (50 MB * 8192 [converts MB to kilobits]) / 600 seconds = ~683 kilobits/s total bitrate
    // 683k - 128k (desired audio bitrate) = 555k video bitrate
 
}


//to read the final output file
const initateDownload=async ()=>{
  
  // read the MP4 file back from the FFmpeg file system
  const output = ffmpeg.FS("readFile", `output.${Settings.Oformat}`);
  // ... and now do something with the file
  link.href = URL.createObjectURL(
  new Blob([output.buffer], { type:isgif?`image/gif`:`video/${Settings.Oformat}` })
  );
  link.download = `Output.${Settings.Oformat}`;
  DownloadBox.style.display="inherit";
}







































