// var BitrateCommand=`-i input.mp4 -c:a copy -c:v vp9 -b:v 1M output.mp4`; //done
// var FrameRateCommand=`-i input.mp4 -c:a copy -c:v vp9 -r 1 output.mp4`;//done
// var ResolutionCommand=`-i input.mp4 -c:a copy -s 640x480 output.mp4`; //working and slow //done
// var PlayBackSpeed=`-i input.mp4 -filter_complex [0:v]setpts=0.5*PTS[v];[0:a]atempo=2.0[a] -map [v] -map [a] output.mp4`; //working and slow//done
// var convertCommand="-i input.mp4 output.webm";//working and slow//done
// var RemoveAudio=`-i input.mp4 -vcodec copy -an output.MP4`;  //working  and fast//done
// var audioSampleRate=`-i input.mp4 -ar 22050 output.mp4`;
// //encoder commands
// var VideoEncoder=`-i input.flv -vcodec libx264 -acodec aac output.mp4`;//to h264' do atlast //done
// var audioEncoder=`-i input.avi -acodec mp3 -vcodec copy out.avi`; //done
// var mjpegEncoder=`-i input.mpg -vcodec mjpeg -qscale 1 -an output.avi`;
// var Size_based_mpeeg4_encoder=`-i input.avi -c:v mpeg4 -vtag xvid -b:v 555k -pass 2 -c:a libmp3lame -b:a 128k output.avi`;//done